// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
/** @type {Record<string,string>} */
const wpRedirects = require('./scripts/wp-redirects.json');

export default defineConfig({
  site: 'https://bcpconsulting.pe',
  output: 'static',
  redirects: wpRedirects,
  integrations: [
    mdx(),
    sitemap({
      serialize(item) {
        // Exclude noindex pages from sitemap
        if (item.url.includes('/legal/')) return undefined;

        // 1. Prioridad Máxima: Home
        if (item.url === 'https://bcpconsulting.pe/') {
          item.priority = 1.0;
          // @ts-ignore
          item.changefreq = 'daily';
        }
        // 2. Prioridad Alta: Páginas estáticas principales (excepto /portafolio/*)
        else if (
          item.url.includes('/servicios') ||
          item.url.includes('/nosotros') ||
          item.url.includes('/contacto') ||
          item.url.includes('/consultoria') ||
          item.url === 'https://bcpconsulting.pe/portafolio'
        ) {
          item.priority = 0.9;
          // @ts-ignore
          item.changefreq = 'monthly';
        }
        // 3. Prioridad Media-Alta: Páginas individuales de portafolio
        else if (item.url.includes('/portafolio/')) {
          item.priority = 0.6;
          // @ts-ignore
          item.changefreq = 'monthly';
        }
        // 3. Prioridad Media: Blog y Artículos
        else if (item.url.includes('/blog')) {
          item.priority = 0.7;
          // @ts-ignore
          item.changefreq = 'weekly';
        }
        // 4. Landings o resto de páginas
        else {
          item.priority = 0.5;
          // @ts-ignore
          item.changefreq = 'monthly';
        }

        return item;
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      noExternal: ['tailwind-animations'],
    }
  }
});