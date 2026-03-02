/** Mapa de slugs de categoría a etiquetas legibles */
export const CATEGORY_LABELS: Record<string, string> = {
  "inteligencia-artificial": "Inteligencia Artificial",
  "desarrollo-web": "Desarrollo Web",
  "software-empresarial": "Software Empresarial",
  "apps-moviles": "Apps Móviles",
  educacion: "Educación",
  seo: "SEO",
  "sin-categoria": "General",
};

/** Mapa de slugs de tipo de post a etiquetas legibles */
export const TYPE_LABELS: Record<string, string> = {
  guia: "Guía",
  noticia: "Noticia",
  "caso-de-estudio": "Caso de Estudio",
  opinion: "Opinión",
  ranking: "Ranking",
};

/** Colores de badge por categoría (clases Tailwind) */
export const CATEGORY_COLORS: Record<string, string> = {
  "inteligencia-artificial": "bg-violet-100 text-violet-700",
  "desarrollo-web": "bg-blue-100 text-blue-700",
  "software-empresarial": "bg-emerald-100 text-emerald-700",
  "apps-moviles": "bg-orange-100 text-orange-700",
  educacion: "bg-yellow-100 text-yellow-700",
  seo: "bg-pink-100 text-pink-700",
  "sin-categoria": "bg-gray-100 text-gray-600",
};

/** Formatea una fecha al estilo es-PE */
export function formatDate(
  date: Date,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "2-digit",
  },
): string {
  return date.toLocaleDateString("es-PE", options);
}
