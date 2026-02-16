import type { APIRoute } from "astro";

const site = "https://bcpconsulting.pe";
const LIMIT = 100;

const staticPages = [
  "",
  "servicios",
  "nosotros",
  "contacto"
];

export const GET: APIRoute = async ({ params }) => {

  const pageIndex = Number(params.page) - 1;
  const start = pageIndex * LIMIT;
  const end = start + LIMIT;

  const chunk = staticPages.slice(start, end);

  const urls = chunk.map((slug) => `
    <url>
      <loc>${site}/${slug}</loc>
      <changefreq>monthly</changefreq>
      <priority>${slug === "" ? "1.0" : "0.9"}</priority>
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
