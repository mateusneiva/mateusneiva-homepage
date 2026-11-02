import { z } from 'zod'

export const postMetadataSchema = z
  .object({
    title: z.string().trim().min(1).max(180),
    description: z.string().trim().min(1).max(500),
    date: z.string().date(),
    updated: z.string().date().optional(),
    tags: z.array(z.string().max(40)).max(10).default([]),
    draft: z.boolean().default(false),
  })
  .strict()
  .refine(({ date, updated }) => !updated || updated >= date, {
    message: 'updated must not be earlier than date',
    path: ['updated'],
  })

export type Post = {
  slug: string
  title: string
  description: string
  date: string
  updated?: string
  tags: string[]
  readingTime: number
  url: string
}

export type LocalPost = Post & { content: string }
