import { defineCollection, z } from 'astro:content';

const services = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      heroImage: image().optional(),
      bullets: z.array(z.string()).default([]),
      order: z.number().default(99),
      category: z.enum(['apparel', 'signs', 'vehicle-wraps', 'print']),
    }),
});

const portfolio = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      client: z.string(),
      serviceType: z.string(),
      heroImage: image(),
      gallery: z.array(image()).default([]),
      date: z.coerce.date(),
      featured: z.boolean().default(false),
    }),
});

const testimonials = defineCollection({
  type: 'data',
  schema: z.array(
    z.object({
      quote: z.string(),
      name: z.string(),
      role: z.string(),
      service: z.string().optional(),
      source: z.enum(['google', 'facebook', 'birdeye', 'direct']).optional(),
      rating: z.number().min(1).max(5).default(5),
    }),
  ),
});

export const collections = { services, portfolio, testimonials };
