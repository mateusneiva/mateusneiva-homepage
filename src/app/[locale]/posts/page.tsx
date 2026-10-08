import type { Metadata } from 'next'
import { getTranslations, getLocale } from 'next-intl/server'
import type { Locale } from '@/i18n/routing'
import { getPosts } from '@/lib/posts'
import { PostCard } from '@/components/posts/post-card'
import { SectionHeading } from '@/components/ui/typography/section-heading'
import { Section } from '@/components/ui/motion/animated-section'
import { ConstructionFrame } from '@/components/layout/construction/construction-frame'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Posts' })
  return {
    title: 'Posts',
    description: t('indexDescription'),
    alternates: {
      canonical: `/${locale}/posts`,
      languages: { pt: '/pt/posts', en: '/en/posts' },
    },
  }
}

export default async function PostsPage() {
  const t = await getTranslations('Posts')
  const locale = await getLocale()
  const posts = await getPosts(locale)
  return (
    <main id="content" className="page-container min-h-[65vh]">
      <Section>
        <SectionHeading eyebrow={t('eyebrow')} title={t('title')} description={t('description')} />
        {posts.length ? (
          <div className="relative isolate grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <ConstructionFrame
              variant="cards"
              columns={posts.length > 1 ? 'posts' : undefined}
              caption={`${String(posts.length).padStart(2, '0')} / posts`}
            />
            {posts.map((post, index) => (
              <PostCard key={post.url} post={post} index={index} />
            ))}
          </div>
        ) : (
          <p className="text-muted">{t('empty')}</p>
        )}
      </Section>
    </main>
  )
}
