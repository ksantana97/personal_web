import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    updatedDate: z.date().optional(),
    heroImage: z.string().optional(),
    tags: z.array(z.string()).optional(),
    readingTime: z.string().optional(),
    draft: z.boolean().optional(),
  }),
});

const projectsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    heroImage: z.string().optional(),
    tags: z.array(z.string()).optional(),
    repoUrl: z.string().optional(),
    liveUrl: z.string().optional(),
    featured: z.boolean().optional(),
    draft: z.boolean().optional(),
  }),
});

export const collections = {
  'blog': blogCollection,
  'projects': projectsCollection,
};

