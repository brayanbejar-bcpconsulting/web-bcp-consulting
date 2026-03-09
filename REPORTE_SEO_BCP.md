# Plan de Acción SEO: BCP Consulting

## FASE 1: Hallazgos Críticos (Prioridad Máxima - Resolver YA)
1. **Archivo robots.txt**: Renombrar `public/robot.txt` a `public/robots.txt`.
2. **Referencia Sitemap**: En `robots.txt`, corregir la URL a `https://bcpconsulting.pe/sitemap-index.xml`.
3. **Página Consultoría**: Crear la página en `src/pages/consultoria.astro` (slug `/consultoria`).
4. **Páginas Legales**: Crear directorio `src/pages/legal/` con `politicas-privacidad.astro` y `terminos-condiciones.astro`.
5. **Configuración OG**: Actualizar `site-config.ts` para usar `/og-image.webp` (ya subido a `public/`).

## FASE 2: Impacto Alto (Optimización Técnica)
6. **Breadcrumbs Schema**: Implementar `BreadcrumbList` en `HeroPage.astro` y `BlogPostLayout.astro` usando `getBreadcrumbSchema()`.
7. **Meta Tags Redes**: Agregar `og:image:width` (1200), `og:image:height` (630) y `og:image:alt` en `BaseHead.astro`.
8. **Ajuste de Títulos/Metas**: 
   - Reducir título del Blog a < 60 caracteres.
   - Reducir meta descripción de Software a < 160 caracteres.
9. **Centralización E-E-A-T**: Unificar redes sociales en `utils/seo.ts` (Facebook + LinkedIn).
10. **Locale**: Cambiar `es-ES` a `es_PE` en `site-config.ts`.

## FASE 3: Impacto Medio y Bajo
11. **Schema Service**: Agregar JSON-LD de servicio en `/servicios/apps-moviles` y `/servicios/web`.
12. **SearchAction**: Implementar schema de buscador en `BaseHead.astro`.
13. **Prioridad Sitemap**: Ajustar `astro.config.mjs` para que `/portafolio/*` tenga prioridad 0.6.