import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    author: z.string().default('LeoninCS'),
    cover: z.string().optional(),
    categories: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([])
  })
});

const work = defineCollection({
  loader: glob({ base: './src/content/works', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    sourceUrl: z.string().url(),
    stack: z.string(),
    badge: z.string(),
    order: z.number(),
    chapterCount: z.number(),
    categories: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([])
  })
});

const workChapter = defineCollection({
  loader: glob({ base: './src/content/work-chapters', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    sourceUrl: z.string().url(),
    workSlug: z.string(),
    workTitle: z.string(),
    chapterSlug: z.string(),
    order: z.number(),
    categories: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([])
  })
});

export const collections = { blog, work, workChapter };
