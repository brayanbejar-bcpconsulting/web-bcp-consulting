import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

const site = "https://bcpconsulting.pe";
const LIMIT = 100;

export const GET: APIRoute = async ({ params }) => {

  const posts = await getCollection("blog");

  const pageIndex = Number(params.page) - 1;
  const start = pageIndex * LIMIT;
  const end = start + LIMIT;

  const chunk = posts.slice(start, end);

  const urls = chunk.map((post: typeof posts[number]) => `
    <url>
      <loc>${site}/blog/${post.slug}</loc>
      <lastmod>${post.data.date.toISOString()}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.7</priority>
    </url>
  `).join("");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
     <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
       ${urls}
     </urlset>`,
    { headers: { "Content-Type": "application/xml" } }
  );
};
