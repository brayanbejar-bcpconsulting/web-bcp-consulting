import { z, defineCollection } from 'astro:content';

const projectsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tagline: z.string().max(160).optional(),
    category: z.enum(['web', 'app', 'software']),
    client: z.string(),
    role: z.string(),
    duration: z.string(),
    year: z.number(),
    technologies: z.array(z.string()),
    coverImage: z.string(),
    url: z.string().url().optional(),
    videoUrl: z.string().url().optional(),
    playStoreUrl: z.string().url().optional(),
    appStoreUrl: z.string().url().optional(),
    gallery: z.array(z.string()).optional(),
    features: z
      .array(
        z.object({
          title: z.string(),
          description: z.string(),
          icon: z.string().optional(),
        })
      )
      .optional(),
    results: z.array(z.string()).optional(),
  }),
});

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    updatedDate: z.date().optional(),
    category: z.enum([
      'inteligencia-artificial',
      'desarrollo-web',
      'software-empresarial',
      'apps-moviles',
      'educacion',
      'sin-categoria',
      'seo',
    ]),
    type: z.enum(['noticia', 'guia', 'caso-de-estudio', 'opinion', 'ranking']).default('guia'),
    author: z.string().default('Equipo BCP Consulting'),
    coverImage: z.string().optional(),
    isFeatured: z.boolean().default(false),
    featuredOrder: z.number().optional(),
    draft: z.boolean().default(false),
    wpId: z.number().optional(),
  }),
});

export const collections = {
  'projects': projectsCollection,
  'blog': blogCollection,
};
