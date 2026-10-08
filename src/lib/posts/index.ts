import 'server-only'
import { cache } from 'react'
import type { Locale } from '@/i18n/routing'
import { getLocalPosts } from './local'
export type { Post, LocalPost } from './schema'

export const getPosts = cache(async (locale: Locale) => {
  const local = await getLocalPosts(locale)
  const localMetadata = local.map(({ content: _content, ...post }) => post)
  return localMetadata.sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
})

export const getPost = cache(async (locale: Locale, slug: string) => {
  const posts = await getLocalPosts(locale)
  return posts.find((post) => post.slug === slug)
})
