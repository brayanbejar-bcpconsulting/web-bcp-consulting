/**
 * fix-missing-covers.mjs
 * Para cada MDX sin coverImage:
 *  1. Busca el post en la API de WordPress por slug
 *  2. Descarga la imagen destacada (featured_media)
 *  3. Actualiza el frontmatter del MDX con la ruta local
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const BLOG_DIR = path.join(ROOT, 'src', 'content', 'blog');
const IMG_DIR = path.join(ROOT, 'public', 'blog', 'img');
const WP_BASE = 'https://bcpconsulting.pe/wp-json/wp/v2';

// ── helpers ──────────────────────────────────────────────────────────────────

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      let data = '';
      res.on('data', c => (data += c));
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error(`JSON parse error: ${e.message}`)); }
      });
    }).on('error', reject);
  });
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(dest)) { resolve(false); return; } // ya existe
    const client = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(dest);
    client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        fs.unlinkSync(dest);
        downloadFile(res.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(true); });
    }).on('error', err => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

function getExtension(url) {
  const clean = url.split('?')[0];
  const ext = path.extname(clean).toLowerCase();
  return ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'].includes(ext) ? ext : '.jpg';
}

// ── main ─────────────────────────────────────────────────────────────────────

fs.mkdirSync(IMG_DIR, { recursive: true });

// 1. Detectar MDX sin coverImage
const mdxFiles = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.mdx'));
const missing = mdxFiles.filter(f => {
  const content = fs.readFileSync(path.join(BLOG_DIR, f), 'utf-8');
  return !content.includes('coverImage');
});

console.log(`Posts sin coverImage: ${missing.length}\n`);

let fixed = 0;
let noImage = 0;

for (const filename of missing) {
  const slug = filename.replace(/\.mdx$/, '');
  process.stdout.write(`  [${slug.slice(0, 60)}] → `);

  try {
    // 2. Buscar post en WP por slug
    const posts = await fetchJson(`${WP_BASE}/posts?slug=${encodeURIComponent(slug)}&_fields=id,featured_media,slug`);

    if (!Array.isArray(posts) || posts.length === 0) {
      console.log('no encontrado en WP');
      noImage++;
      continue;
    }

    const post = posts[0];
    const mediaId = post.featured_media;

    if (!mediaId) {
      console.log('sin featured_media');
      noImage++;
      continue;
    }

    // 3. Obtener URL de la imagen
    const media = await fetchJson(`${WP_BASE}/media/${mediaId}?_fields=source_url`);
    const sourceUrl = media?.source_url;

    if (!sourceUrl) {
      console.log('media sin source_url');
      noImage++;
      continue;
    }

    // 4. Descargar
    const ext = getExtension(sourceUrl);
    const imgName = `${slug}-cover${ext}`;
    const imgDest = path.join(IMG_DIR, imgName);
    const localPath = `/blog/img/${imgName}`;

    const downloaded = await downloadFile(sourceUrl, imgDest);
    console.log(downloaded ? `descargada (${imgName})` : `ya existía (${imgName})`);

    // 5. Actualizar frontmatter del MDX
    const filePath = path.join(BLOG_DIR, filename);
    let content = fs.readFileSync(filePath, 'utf-8');

    // Insertar coverImage justo después de "date:" o antes de "category:"
    if (content.includes('category:')) {
      content = content.replace(
        /(category:)/,
        `coverImage: "${localPath}"\n$1`
      );
    } else {
      // Fallback: insertar antes del cierre del frontmatter
      content = content.replace(/^(---[\s\S]*?)(---)/, `$1coverImage: "${localPath}"\n$2`);
    }

    fs.writeFileSync(filePath, content, 'utf-8');
    fixed++;

  } catch (err) {
    console.log(`ERROR: ${err.message}`);
    noImage++;
  }
}

console.log(`\n✅ Resultados:`);
console.log(`   Imágenes encontradas y MDX actualizados: ${fixed}`);
console.log(`   Sin imagen en WP:                        ${noImage}`);
console.log(`\nSi hay posts sin imagen, considera añadir una imagen placeholder.`);
