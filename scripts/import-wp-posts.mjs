/**
 * Script: import-wp-posts.mjs
 * Fetches all posts from bcpconsulting.pe WP REST API,
 * converts content to Markdown, downloads images locally,
 * and generates .mdx files in src/content/blog/.
 *
 * Usage: node scripts/import-wp-posts.mjs
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';
import TurndownService from 'turndown';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const WP_API = 'https://bcpconsulting.pe/wp-json/wp/v2';
const BLOG_DIR = path.join(ROOT, 'src', 'content', 'blog');
const IMG_DIR = path.join(ROOT, 'public', 'blog', 'img');

// WP category ID → Astro category slug
const CATEGORY_MAP = {
  1:  'sin-categoria',   // sin-categoria
  25: 'inteligencia-artificial',
  26: 'apps-moviles',
  27: 'desarrollo-web',
  29: 'seo',
  30: 'educacion',
  32: 'software-empresarial', // software-a-medida
  33: 'software-empresarial', // software
};

// ------ helpers -------

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith('https') ? https : http;
    proto.get(url, { headers: { 'User-Agent': 'bcp-importer/1.0' } }, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`JSON parse error for ${url}: ${e.message}\n${data.slice(0, 200)}`));
        }
      });
    }).on('error', reject);
  });
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(dest)) { resolve(dest); return; }
    const proto = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(dest);
    proto.get(url, { headers: { 'User-Agent': 'bcp-importer/1.0' } }, (res) => {
      // Handle redirects
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        fs.unlinkSync(dest);
        downloadFile(res.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(dest); });
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      reject(err);
    });
  });
}

function stripHtml(html) {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&hellip;/g, '…')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-_]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function buildTurndown() {
  const td = new TurndownService({
    headingStyle: 'atx',
    bulletListMarker: '-',
    codeBlockStyle: 'fenced',
    hr: '---',
  });

  // Remove empty wp-block wrappers
  td.addRule('remove-empty-paragraphs', {
    filter: (node) =>
      node.nodeName === 'P' && node.textContent.trim() === '',
    replacement: () => '',
  });

  // Keep figures as plain image markdown
  td.addRule('figures', {
    filter: 'figure',
    replacement: (content) => content.trim() + '\n\n',
  });

  // Preserve <strong> inside headings
  td.addRule('strong-in-heading', {
    filter: ['strong', 'b'],
    replacement: (content) => `**${content}**`,
  });

  return td;
}

async function fetchAllPosts() {
  const posts = [];
  let page = 1;
  while (true) {
    console.log(`  Fetching page ${page}…`);
    const batch = await fetchJson(
      `${WP_API}/posts?per_page=100&page=${page}&_fields=id,slug,title,excerpt,date,modified,content,categories,featured_media`
    );
    if (!Array.isArray(batch) || batch.length === 0) break;
    posts.push(...batch);
    if (batch.length < 100) break;
    page++;
  }
  return posts;
}

async function resolveMediaUrl(mediaId) {
  if (!mediaId || mediaId === 0) return null;
  try {
    const media = await fetchJson(
      `${WP_API}/media/${mediaId}?_fields=source_url`
    );
    return media.source_url || null;
  } catch {
    return null;
  }
}

function extFromUrl(url) {
  const match = url.split('?')[0].match(/\.([a-z0-9]+)$/i);
  return match ? `.${match[1].toLowerCase()}` : '.jpg';
}

async function downloadImage(remoteUrl, slug, label = 'cover') {
  if (!remoteUrl) return null;
  fs.mkdirSync(IMG_DIR, { recursive: true });
  const ext = extFromUrl(remoteUrl);
  const filename = `${slug}-${label}${ext}`;
  const dest = path.join(IMG_DIR, filename);
  try {
    await downloadFile(remoteUrl, dest);
    return `/blog/img/${filename}`;
  } catch (err) {
    console.warn(`    ⚠ Could not download image ${remoteUrl}: ${err.message}`);
    return remoteUrl; // fallback to remote URL
  }
}

function resolveCategory(categoryIds) {
  if (!categoryIds || categoryIds.length === 0) return 'sin-categoria';
  for (const id of categoryIds) {
    if (CATEGORY_MAP[id]) return CATEGORY_MAP[id];
  }
  return 'sin-categoria';
}

function buildFrontmatter(post, localCoverImage) {
  const cat = resolveCategory(post.categories);
  const title = stripHtml(post.title.rendered).replace(/"/g, '\\"');
  const rawExcerpt = stripHtml(post.excerpt.rendered);
  // Trim description to ~155 chars at word boundary
  const description =
    rawExcerpt.length > 155
      ? rawExcerpt.substring(0, rawExcerpt.lastIndexOf(' ', 155)).replace(/"/g, '\\"') + '…'
      : rawExcerpt.replace(/"/g, '\\"');

  const dateStr = post.date.split('T')[0]; // YYYY-MM-DD
  const modifiedStr = post.modified.split('T')[0];

  const lines = [
    '---',
    `title: "${title}"`,
    `description: "${description}"`,
    `date: ${dateStr}`,
    `updatedDate: ${modifiedStr}`,
    `category: "${cat}"`,
    `type: "guia"`,
    `author: "Equipo BCP Consulting"`,
  ];

  if (localCoverImage) {
    lines.push(`coverImage: "${localCoverImage}"`);
  }

  lines.push(`isFeatured: false`);
  lines.push(`wpId: ${post.id}`);
  lines.push('---');

  return lines.join('\n');
}

// Replace remote image URLs in markdown with local paths
async function localizeImagesInMarkdown(markdown, slug, td) {
  const remoteImgRegex = /!\[([^\]]*)\]\((https?:\/\/bcpconsulting\.pe[^\)]+)\)/g;
  const matches = [...markdown.matchAll(remoteImgRegex)];
  let result = markdown;
  for (const match of matches) {
    const alt = match[1];
    const remoteUrl = match[2];
    const label = slugify(path.basename(remoteUrl.split('?')[0]).replace(/\.[^.]+$/, '')).slice(0, 40) || 'img';
    const localUrl = await downloadImage(remoteUrl, slug, label);
    if (localUrl && localUrl !== remoteUrl) {
      result = result.replace(match[0], `![${alt}](${localUrl})`);
    }
  }
  return result;
}

function writeMdx(slug, frontmatter, markdown) {
  fs.mkdirSync(BLOG_DIR, { recursive: true });
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  const content = `${frontmatter}\n\n${markdown}\n`;
  fs.writeFileSync(filePath, content, 'utf-8');
  return filePath;
}

// -------- main --------

async function main() {
  console.log('▶ Starting WordPress → Astro MDX import\n');

  const td = buildTurndown();

  console.log('📡 Fetching posts from WP REST API…');
  const wpPosts = await fetchAllPosts();
  console.log(`  Found ${wpPosts.length} posts.\n`);

  // Resolve all media IDs upfront (deduplicated)
  const mediaIds = [...new Set(wpPosts.map((p) => p.featured_media).filter(Boolean))];
  console.log(`🖼  Resolving ${mediaIds.length} unique media IDs…`);
  const mediaMap = {};
  for (const id of mediaIds) {
    mediaMap[id] = await resolveMediaUrl(id);
  }
  console.log('  Done.\n');

  const redirects = {};
  let count = 0;
  const errors = [];

  console.log('✍  Converting posts to MDX…\n');

  for (const post of wpPosts) {
    const { slug } = post;
    process.stdout.write(`  [${++count}/${wpPosts.length}] ${slug}…\r`);

    try {
      // 1. Featured image
      const remoteUrl = mediaMap[post.featured_media] || null;
      let localCoverImage = null;
      if (remoteUrl) {
        localCoverImage = await downloadImage(remoteUrl, slug, 'cover');
      }

      // 2. Convert HTML → Markdown
      let markdown = td.turndown(post.content.rendered || '');

      // 3. Localize inline images in content
      markdown = await localizeImagesInMarkdown(markdown, slug, td);

      // 4. Frontmatter
      const frontmatter = buildFrontmatter(post, localCoverImage);

      // 5. Write MDX
      writeMdx(slug, frontmatter, markdown);

      // 6. Register redirect   /slug/ → /blog/slug/
      redirects[`/${slug}/`] = `/blog/${slug}/`;
      redirects[`/${slug}`] = `/blog/${slug}/`;

    } catch (err) {
      errors.push({ slug, error: err.message });
      console.error(`\n  ✗ Error on "${slug}": ${err.message}`);
    }
  }

  console.log(`\n\n✅ Generated ${count - errors.length} MDX files  |  ${errors.length} errors.\n`);

  // ---- Write redirects to a JSON file for manual review ----
  const redirectsPath = path.join(ROOT, 'scripts', 'wp-redirects.json');
  fs.writeFileSync(redirectsPath, JSON.stringify(redirects, null, 2), 'utf-8');
  console.log(`📄 Redirects written to: ${redirectsPath}`);
  console.log('   Add them to astro.config.mjs → redirects: { ... }\n');

  if (errors.length > 0) {
    console.log('⚠  Posts with errors:');
    for (const e of errors) console.log(`   - ${e.slug}: ${e.error}`);
  }

  console.log('🏁 Done!\n');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
