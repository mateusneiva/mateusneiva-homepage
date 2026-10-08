import 'server-only'
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'
import type { Locale } from '@/i18n/routing'
import { postMetadataSchema, type LocalPost } from './schema'
import { readingTime } from './reading-time'

const POST_FILENAME = /^[a-z0-9-]+\.md$/

async function readLocalPost(directory: string, filename: string, today: string): Promise<LocalPost | null> {
  const file = await readFile(path.join(directory, filename), 'utf8')
  const { data, content } = matter(file)
  const { draft, ...metadata } = postMetadataSchema.parse(data)
  if (draft || metadata.date > today) return null

  const slug = filename.replace(/\.md$/, '')
  return {
    ...metadata,
    slug,
    content,
    readingTime: readingTime(content),
    url: `/posts/${slug}`,
  }
}

export async function getLocalPosts(locale: Locale): Promise<LocalPost[]> {
  const directory = path.join(process.cwd(), 'content', 'posts', locale)
  const today = new Date().toISOString().slice(0, 10)
  let files: string[]

  try {
    files = await readdir(directory)
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') return []
    throw error
  }
  const filenames = files.filter((filename) => POST_FILENAME.test(filename))
  const posts = await Promise.all(filenames.map((filename) => readLocalPost(directory, filename, today)))
  return posts.filter((post): post is LocalPost => post !== null)
}
