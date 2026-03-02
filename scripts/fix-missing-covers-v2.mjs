/**
 * fix-missing-covers-v2.mjs
 * Para los MDX sin coverImage que no tienen featured_media en WP,
 * extrae la primera imagen del contenido HTML del post.
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

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      let data = '';
      res.on('data', c => (data += c));
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error(`JSON parse error for ${url}`)); }
      });
    }).on('error', reject);
  });
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(dest)) { resolve(false); return; }
    const client = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(dest);
    client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        try { fs.unlinkSync(dest); } catch {}
        downloadFile(res.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        file.close();
        try { fs.unlinkSync(dest); } catch {}
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(true); });
    }).on('error', err => {
      try { fs.unlinkSync(dest); } catch {}
      reject(err);
    });
  });
}

function getExtension(url) {
  const clean = url.split('?')[0];
  const ext = path.extname(clean).toLowerCase();
  return ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext) ? ext : '.jpg';
}

// Extrae la primera src de <img> en HTML
function extractFirstImage(html) {
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (!match) return null;
  let src = match[1];
  // Ignorar data URIs y SVG inline
  if (src.startsWith('data:') || src.includes('.svg')) return null;
  // Buscar la URL más grande (wp-content) si hay srcset
  const srcsetMatch = html.match(/<img[^>]+srcset=["']([^"']+)["']/i);
  if (srcsetMatch) {
    const entries = srcsetMatch[1].split(',').map(e => e.trim());
    const largest = entries[entries.length - 1]?.split(' ')[0];
    if (largest && (largest.startsWith('http') || largest.startsWith('/'))) {
      src = largest;
    }
  }
  return src.startsWith('//') ? 'https:' + src : src;
}

fs.mkdirSync(IMG_DIR, { recursive: true });

const mdxFiles = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.mdx'));
const missing = mdxFiles.filter(f =>
  !fs.readFileSync(path.join(BLOG_DIR, f), 'utf-8').includes('coverImage')
);

console.log(`Posts sin coverImage: ${missing.length}\n`);

let fixed = 0;
let noImage = 0;

for (const filename of missing) {
  const slug = filename.replace(/\.mdx$/, '');
  process.stdout.write(`  [${slug.slice(0, 55)}] → `);

  try {
    // Buscar post completo
    const posts = await fetchJson(
      `${WP_BASE}/posts?slug=${encodeURIComponent(slug)}&_fields=id,featured_media,content`
    );

    if (!Array.isArray(posts) || posts.length === 0) {
      console.log('no encontrado en WP');
      noImage++;
      continue;
    }

    const post = posts[0];
    const html = post.content?.rendered || '';

    // Intentar primero ogImage desde meta (no disponible por REST simple)
    // → extraer primera imagen del body
    const imgUrl = extractFirstImage(html);

    if (!imgUrl) {
      console.log('sin imágenes en contenido');
      noImage++;
      continue;
    }

    const ext = getExtension(imgUrl);
    const imgName = `${slug}-cover${ext}`;
    const imgDest = path.join(IMG_DIR, imgName);
    const localPath = `/blog/img/${imgName}`;

    await downloadFile(imgUrl, imgDest);
    console.log(`→ ${imgName}`);

    // Actualizar MDX
    const filePath = path.join(BLOG_DIR, filename);
    let content = fs.readFileSync(filePath, 'utf-8');

    if (content.includes('category:')) {
      content = content.replace(/(category:)/, `coverImage: "${localPath}"\n$1`);
    } else {
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
console.log(`   MDX actualizados con imagen del contenido: ${fixed}`);
console.log(`   Sin ninguna imagen disponible:              ${noImage}`);

if (noImage > 0) {
  console.log(`\nPosts definitivamente sin imagen (candidatos para placeholder):`);
  const stillMissing = fs.readdirSync(BLOG_DIR)
    .filter(f => f.endsWith('.mdx'))
    .filter(f => !fs.readFileSync(path.join(BLOG_DIR, f), 'utf-8').includes('coverImage'));
  stillMissing.forEach(f => console.log(`  - ${f}`));
}
