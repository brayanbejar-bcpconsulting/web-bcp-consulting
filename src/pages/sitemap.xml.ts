import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

const site = "https://bcpconsulting.pe";
const LIMIT = 100;

export const GET: APIRoute = async () => {

  const blogPosts = await getCollection("blog");

  const blogChunks = Math.ceil(blogPosts.length / LIMIT);

  const staticPages = [
    "",
    "servicios",
    "nosotros",
    "contacto"
  ];

  const pageChunks = Math.ceil(staticPages.length / LIMIT);

  let sitemaps = "";

  for (let i = 1; i <= pageChunks; i++) {
    sitemaps += `
      <sitemap>
        <loc>${site}/sitemap-pages-${i}.xml</loc>
      </sitemap>
    `;
  }

  for (let i = 1; i <= blogChunks; i++) {
    sitemaps += `
      <sitemap>
        <loc>${site}/sitemap-blog-${i}.xml</loc>
      </sitemap>
    `;
  }

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
     <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
       ${sitemaps}
     </sitemapindex>`,
    { headers: { "Content-Type": "application/xml" } }
  );
};
