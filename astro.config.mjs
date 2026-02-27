// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://bcpconsulting.pe',
  output: 'static',
  integrations: [
    mdx(),
    sitemap({
      serialize(item) {
        // 1. Prioridad Máxima: Home
        if (item.url === 'https://bcpconsulting.pe/') {
          item.priority = 1.0;
          // @ts-ignore
          item.changefreq = 'daily';
        }
        // 2. Prioridad Alta: Páginas estáticas principales
        else if (
          item.url.includes('/servicios') || 
          item.url.includes('/nosotros') || 
          item.url.includes('/portafolio') || 
          item.url.includes('/contacto')
        ) {
          item.priority = 0.9;
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