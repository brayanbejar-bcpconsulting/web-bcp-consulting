/**
 * fix-issues.mjs
 * Fixes two build-blocking issues:
 * 1. Remove duplicate trailing-slash redirect entries from wp-redirects.json
 *    and regenerate the redirects block in astro.config.mjs
 * 2. Escape { and } chars in MDX body content (outside frontmatter/code blocks)
 *    so MDX doesn't treat them as JSX expressions
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// ─────────────────────────────────────────────────────────────────────────────
// FIX 1 – Remove trailing-slash duplicates from wp-redirects.json
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n── FIX 1: Remove trailing-slash redirect duplicates ──');

const redirectsPath = path.join(__dirname, 'wp-redirects.json');
const raw = JSON.parse(fs.readFileSync(redirectsPath, 'utf-8'));

// Keep only entries whose "from" key does NOT end in "/"
const cleaned = Object.fromEntries(
  Object.entries(raw).filter(([from]) => !from.endsWith('/'))
);

const removedCount = Object.keys(raw).length - Object.keys(cleaned).length;
console.log(`  Entries before: ${Object.keys(raw).length}`);
console.log(`  Entries after:  ${Object.keys(cleaned).length}`);
console.log(`  Removed:        ${removedCount}`);

fs.writeFileSync(redirectsPath, JSON.stringify(cleaned, null, 2), 'utf-8');
console.log('  wp-redirects.json updated ✓');

// Now rewrite the redirects block in astro.config.mjs
const configPath = path.join(ROOT, 'astro.config.mjs');
let config = fs.readFileSync(configPath, 'utf-8');

// Build the new inline redirects object string
const lines = Object.entries(cleaned)
  .map(([from, to]) => `    '${from}': '${to}'`)
  .join(',\n');

const newRedirectsBlock = `redirects: {\n${lines}\n  }`;

// Replace everything between "redirects: {" ... closing "}" of that object
// We use a regex that matches the redirects block
const redirectsRegex = /redirects:\s*\{[\s\S]*?\n  \}/;
if (redirectsRegex.test(config)) {
  config = config.replace(redirectsRegex, newRedirectsBlock);
  fs.writeFileSync(configPath, config, 'utf-8');
  console.log('  astro.config.mjs redirects block updated ✓');
} else {
  console.warn('  WARNING: Could not locate redirects block in astro.config.mjs – skipped');
}

// ─────────────────────────────────────────────────────────────────────────────
// FIX 2 – Escape { } in MDX body content
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n── FIX 2: Escape { } in MDX body content ──');

const blogDir = path.join(ROOT, 'src', 'content', 'blog');
const mdxFiles = fs.readdirSync(blogDir).filter(f => f.endsWith('.mdx'));

let fixedFiles = 0;
let skippedFiles = 0;

for (const filename of mdxFiles) {
  const filePath = path.join(blogDir, filename);
  const original = fs.readFileSync(filePath, 'utf-8');

  // Split into frontmatter + body
  const fmMatch = original.match(/^---[\s\S]*?---\n/);
  if (!fmMatch) {
    skippedFiles++;
    continue;
  }

  const frontmatter = fmMatch[0];
  let body = original.slice(frontmatter.length);

  // Process body line by line, skip fenced code blocks
  const lines = body.split('\n');
  let inCodeBlock = false;
  const processedLines = lines.map(line => {
    // Toggle code block state
    if (/^```/.test(line)) {
      inCodeBlock = !inCodeBlock;
      return line;
    }
    if (inCodeBlock) return line;

    // Skip import/export lines (MDX allows those)
    if (/^(import|export)\s/.test(line.trim())) return line;

    // Escape bare { } that are NOT already escaped and NOT HTML entities
    // Replace { → &#123; and } → &#125;
    // But skip lines that look like MDX/JSX components (start with <)
    if (line.trimStart().startsWith('<')) return line;

    // Replace unescaped { and } with HTML entities
    // Avoid double-escaping already-escaped ones
    let fixed = line
      .replace(/&#123;/g, '\x00LBRACE\x00')  // protect existing escapes
      .replace(/&#125;/g, '\x00RBRACE\x00')
      .replace(/\\\{/g, '\x00ELBRCE\x00')     // protect \{ escapes
      .replace(/\\\}/g, '\x00ERBRCE\x00')
      .replace(/\{/g, '&#123;')
      .replace(/\}/g, '&#125;')
      .replace(/\x00LBRACE\x00/g, '&#123;')
      .replace(/\x00RBRACE\x00/g, '&#125;')
      .replace(/\x00ELBRCE\x00/g, '&#123;')   // normalise \{ → &#123; as well
      .replace(/\x00ERBRCE\x00/g, '&#125;');

    return fixed;
  });

  const newBody = processedLines.join('\n');
  const newContent = frontmatter + newBody;

  if (newContent !== original) {
    fs.writeFileSync(filePath, newContent, 'utf-8');
    fixedFiles++;
  }
}

console.log(`  MDX files scanned:  ${mdxFiles.length}`);
console.log(`  Files modified:     ${fixedFiles}`);
console.log(`  Files unchanged:    ${mdxFiles.length - fixedFiles - skippedFiles}`);

// ─────────────────────────────────────────────────────────────────────────────
// AUDIT – look for any remaining { } in body content
// ─────────────────────────────────────────────────────────────────────────────
console.log('\n── AUDIT: Checking for remaining unescaped { } ──');

let auditIssues = 0;
for (const filename of mdxFiles) {
  const filePath = path.join(blogDir, filename);
  const content = fs.readFileSync(filePath, 'utf-8');
  const fmMatch = content.match(/^---[\s\S]*?---\n/);
  if (!fmMatch) continue;

  const body = content.slice(fmMatch[0].length);
  const lines = body.split('\n');
  let inCode = false;
  lines.forEach((line, i) => {
    if (/^```/.test(line)) { inCode = !inCode; return; }
    if (inCode) return;
    if (/^(import|export)\s/.test(line.trim())) return;
    if (line.trimStart().startsWith('<')) return;
    if (/[{}]/.test(line)) {
      console.log(`  [${filename}] line ${i + 1}: ${line.trim().slice(0, 80)}`);
      auditIssues++;
    }
  });
}

if (auditIssues === 0) {
  console.log('  No issues found ✓');
} else {
  console.log(`  ${auditIssues} potential issue(s) found – review above lines`);
}

console.log('\n✅ fix-issues.mjs complete. Run: pnpm astro build\n');
