import { z } from 'zod'

export const postMetadataSchema = z
  .object({
    title: z.string().trim().min(1).max(180),
    description: z.string().trim().min(1).max(500),
    date: z.string().date(),
    tags: z.array(z.string().max(40)).max(10).default([]),
    draft: z.boolean().default(false),
  })
  .strict()

export type Post = {
  slug: string
  title: string
  description: string
  date: string
  tags: string[]
  readingTime: number
  url: string
}

export type LocalPost = Post & { content: string }
