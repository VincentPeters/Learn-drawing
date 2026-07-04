import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

const lessons = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/lessons' }),
  schema: z.object({
    module: z.union([z.literal(1), z.literal(2)]),
    number: z.number().int().min(1),
    phase: z.number().int().min(0),
    title: z.string().min(1),
    diagram: z.string().min(1),
    objective: z.string().min(1),
    warmup: z.array(z.string().min(1)).min(1),
    main: z.array(z.string().min(1)).min(1),
    checkpoint: z.string().min(1),
  }),
});

const phases = defineCollection({
  loader: file('./src/content/phases.json'),
  schema: z.object({
    module: z.union([z.literal(1), z.literal(2)]),
    index: z.number().int().min(0),
    name: z.string().min(1),
    color: z.string().regex(/^#[0-9a-f]{6}$/i),
    blurb: z.string().min(1),
    lessons: z.string().min(1),
  }),
});

export const collections = { lessons, phases };
