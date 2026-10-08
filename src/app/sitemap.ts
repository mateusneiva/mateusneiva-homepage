import { MetadataRoute } from 'next'
import { routing } from '@/i18n/routing'
import { getLocalPosts } from '@/lib/posts/local'
import { projects } from '@/data/projects'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://mateusneiva.com'
  const pages = await Promise.all(
    routing.locales.map(async (locale): Promise<MetadataRoute.Sitemap> => {
      const posts = await getLocalPosts(locale)
      return [
        {
          url: `${base}/${locale}`,
          changeFrequency: 'monthly',
          priority: 1,
          alternates: { languages: { pt: `${base}/pt`, en: `${base}/en` } },
        },
        {
          url: `${base}/${locale}/posts`,
          changeFrequency: 'weekly',
          priority: 0.8,
        },
        ...posts.map((post) => ({
          url: `${base}/${locale}${post.url}`,
          lastModified: new Date(post.date),
          priority: 0.7,
        })),
        ...projects.map((project) => ({
          url: `${base}/${locale}/projects/${project.slug}`,
          priority: 0.8,
          alternates: {
            languages: {
              pt: `${base}/pt/projects/${project.slug}`,
              en: `${base}/en/projects/${project.slug}`,
            },
          },
        })),
      ]
    })
  )
  return pages.flat()
}
