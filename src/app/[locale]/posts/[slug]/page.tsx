import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { routing, type Locale } from '@/i18n/routing'
import { getPost, getPosts } from '@/lib/posts'
import { getLocalPosts } from '@/lib/posts/local'
import { readHeadings } from '@/lib/markdown-headings'
import { Markdown } from '@/components/posts/markdown'
import { BackLink } from '@/components/ui/buttons/back-link'
import { Tag } from '@/components/ui/tags/tag'
import { ReadingArticle } from '@/components/ui/reading/reading-article'
import { ReadingGuide } from '@/components/ui/reading/reading-guide'
import { ReadingPager } from '@/components/ui/reading/reading-pager'

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
      modifiedTime: post.updated,
      authors: ['Mateus Neiva'],
    },
  }
}

export default async function PostPage({ params }: Props) {
  const { locale, slug } = await params
  const post = await getPost(locale, slug)
  if (!post) notFound()
  const t = await getTranslations('Posts')
  const headings = readHeadings(post.content)
  const posts = await getPosts(locale)
  const index = posts.findIndex((item) => item.slug === slug)
  const newer = index > 0 ? posts[index - 1] : undefined
  const older = posts[index + 1]
  const formatDate = (date: string) =>
    new Intl.DateTimeFormat(locale, { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(date))
  return (
    <main id="content" className="page-container py-16 sm:py-24">
      <ReadingArticle
        className={
          headings.length > 0
            ? 'mx-auto grid min-w-0 max-w-5xl lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-x-12'
            : 'mx-auto max-w-3xl'
        }
      >
        {headings.length > 0 && (
          <ReadingGuide
            title={t('guide')}
            sections={headings.map(({ id, title }) => ({ id, label: title }))}
            className="hidden self-start lg:sticky lg:top-8 lg:col-start-1 lg:row-start-1 lg:block"
          />
        )}
        <div className="min-w-0 lg:col-start-2 lg:row-start-1">
        <BackLink label={t('back')} />
        <div className="mb-5 flex flex-wrap gap-3 font-mono text-xs text-subtle">
          <time dateTime={post.date}>
            {new Intl.DateTimeFormat(locale, {
              dateStyle: 'long',
              timeZone: 'UTC',
            }).format(new Date(post.date))}
          </time>
          {post.updated && (
            <>
              <span>·</span>
              <time dateTime={post.updated}>
                {t('updated', {
                  date: new Intl.DateTimeFormat(locale, { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(post.updated)),
                })}
              </time>
            </>
          )}
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
              <Tag>#{tag}</Tag>
            </li>
          ))}
        </ul>
        <Markdown content={post.content} />
        <ReadingPager
          label={t('pager')}
          previousLabel={t('previous')}
          nextLabel={t('next')}
          previousEmpty={t('firstPost')}
          nextEmpty={t('lastPost')}
          previous={older && { href: older.url, title: older.title, meta: formatDate(older.date) }}
          next={newer && { href: newer.url, title: newer.title, meta: formatDate(newer.date) }}
        />
        </div>
      </ReadingArticle>
    </main>
  )
}
