import { z, defineCollection } from 'astro:content';

const projectsCollection = defineCollection({
  type: 'content', // v2.5+ uses 'content', Astro 5 uses modern config but this is safe
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['web', 'app', 'software']),
    client: z.string(),
    role: z.string(),
    duration: z.string(),
    year: z.number(),
    technologies: z.array(z.string()),
    coverImage: z.string(),
    url: z.string().url().optional(),
    results: z.array(z.string()).optional(),
  }),
});

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    category: z.enum(['inteligencia-artificial', 'desarrollo-web', 'software-empresarial', 'apps-moviles']),
    type: z.enum(['noticia', 'guia', 'caso-de-estudio', 'opinion', 'ranking']),
    author: z.string(),
    coverImage: z.string(),
    isFeatured: z.boolean().default(false),
    featuredOrder: z.number().optional(),
  }),
});

export const collections = {
  'projects': projectsCollection,
  'blog': blogCollection,
};
