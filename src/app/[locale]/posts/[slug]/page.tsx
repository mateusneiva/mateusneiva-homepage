import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { routing, type Locale } from '@/i18n/routing'
import { getPost } from '@/lib/posts'
import { getLocalPosts } from '@/lib/posts/local'
import { Markdown } from '@/components/posts/markdown'
import { PostBackButton } from '@/components/posts/post-back-button'
import { Tag } from '@/components/ui/tags/tag'
import { ReadingArticle } from '@/components/ui/reading/reading-article'

type Props = { params: Promise<{ locale: Locale; slug: string }> }

export async function generateStaticParams() {
  const params = await Promise.all(
    routing.locales.map(async (locale) =>
      (await getLocalPosts(locale)).map((post) => ({ locale, slug: post.slug })),
    ),
  )
  return params.flat()
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const post = await getPost(locale, slug)
  if (!post) notFound()
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/${locale}/posts/${slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: ['Mateus Neiva'],
    },
  }
}

export default async function PostPage({ params }: Props) {
  const { locale, slug } = await params
  const post = await getPost(locale, slug)
  if (!post) notFound()
  const t = await getTranslations('Posts')
  return (
    <main id="content" className="page-container py-16 sm:py-24">
      <ReadingArticle className="mx-auto max-w-3xl">
        <PostBackButton />
        <div className="mb-5 flex flex-wrap gap-3 font-mono text-xs text-subtle">
          <time dateTime={post.date}>
            {new Intl.DateTimeFormat(locale, {
              dateStyle: 'long',
              timeZone: 'UTC',
            }).format(new Date(post.date))}
          </time>
          <span>·</span>
          <span>{t('minutes', { count: post.readingTime })}</span>
        </div>
        <h1 className="font-serif text-4xl font-medium leading-tight tracking-tight text-ink sm:text-5xl">
          {post.title}
        </h1>
        <p className="mb-8 mt-6 text-xl leading-relaxed text-muted">{post.description}</p>
        <ul className="mb-12 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <li key={tag}>
              <Tag>{tag}</Tag>
            </li>
          ))}
        </ul>
        <Markdown content={post.content} />
      </ReadingArticle>
    </main>
  )
}
