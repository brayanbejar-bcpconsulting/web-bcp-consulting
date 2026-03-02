/**
 * fix-inline-images.mjs
 *
 * Corrige las imágenes inline de los posts migrados de WordPress.
 *
 * Patrón actual (generado en la migración WP → MDX):
 *   [![alt text](/blog/img/local-filename.ext)](https://bcpconsulting.pe/wp-content/uploads/.../orig.ext)
 *
 * Esto renderiza como imagen rota porque /blog/img/ no existe en el proyecto.
 * La URL externa ya está presente como href del enlace de cada imagen.
 *
 * Transformación aplicada:
 *   [![alt](/blog/img/local.ext)](https://ext.url) → ![alt](https://ext.url)
 *
 * Se elimina el wrapper de enlace y el src local se reemplaza por la URL externa.
 */

import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const BLOG_DIR = new URL("../src/content/blog", import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1");

// Coincide: [![cualquier alt](/blog/img/cualquier-archivo.ext)](https://url-externa)
// Captura: $1 = alt text, $2 = URL externa
const RE = /\[!\[([^\]]*)\]\(\/blog\/img\/[^)]+\)\]\(([^)]+)\)/g;

async function run() {
  const files = (await readdir(BLOG_DIR)).filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

  let totalFiles = 0;
  let totalReplacements = 0;

  for (const file of files) {
    const filePath = join(BLOG_DIR, file);
    const original = await readFile(filePath, "utf8");

    let count = 0;
    const fixed = original.replace(RE, (_match, alt, externalUrl) => {
      count++;
      return `![${alt}](${externalUrl})`;
    });

    if (count > 0) {
      await writeFile(filePath, fixed, "utf8");
      console.log(`✅ ${file}: ${count} imagen${count > 1 ? "es" : ""} corregida${count > 1 ? "s" : ""}`);
      totalFiles++;
      totalReplacements += count;
    }
  }

  console.log(`\n📦 Total: ${totalReplacements} imágenes corregidas en ${totalFiles} archivos`);
}

run().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
