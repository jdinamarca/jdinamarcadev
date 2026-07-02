import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    heroImage: z.string().optional(),
    heroAlt: z.string().optional(),
    readingTime: z.string().optional(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    client: z.string().optional(),
    role: z.string().default("Arquitecto de Software"),
    year: z.string(),
    stack: z.array(z.string()).default([]),
    disciplines: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    order: z.number().default(99),
    cover: z.string().optional(),
    coverAlt: z.string().optional(),
    liveUrl: z.string().optional(),
    repoUrl: z.string().optional(),
  }),
});

export const collections = { blog, projects };
