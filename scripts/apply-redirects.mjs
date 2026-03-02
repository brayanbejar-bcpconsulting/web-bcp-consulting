import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const REDIRECTS_JSON = path.join(__dirname, 'wp-redirects.json');
const ASTRO_CONFIG = path.join(ROOT, 'astro.config.mjs');

const redirects = JSON.parse(fs.readFileSync(REDIRECTS_JSON, 'utf-8'));

const redirectLines = Object.entries(redirects)
  .map(([from, to]) => `    '${from}': '${to}',`)
  .join('\n');

const redirectsBlock = `  redirects: {\n${redirectLines}\n  },`;

let configContent = fs.readFileSync(ASTRO_CONFIG, 'utf-8');

let newConfig;
if (configContent.includes('redirects:')) {
  // Reemplazar bloque existente
  newConfig = configContent.replace(
    /redirects:\s*\{[\s\S]*?\},/,
    redirectsBlock
  );
} else {
  // Insertar justo antes del último }) del defineConfig
  newConfig = configContent.replace(
    /(\}\s*\)\s*;?\s*)$/,
    `${redirectsBlock}\n$1`
  );
}

fs.writeFileSync(ASTRO_CONFIG, newConfig, 'utf-8');
console.log(`✅ ${Object.keys(redirects).length} redirects aplicados en astro.config.mjs`);