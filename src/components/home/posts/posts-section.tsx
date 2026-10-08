import { useTranslations } from 'next-intl'
import { AnimatedArrow } from '@/components/ui/icons/animated-arrow'
import { Section } from '@/components/ui/motion/animated-section'
import { SectionHeading } from '@/components/ui/typography/section-heading'
import { Link } from '@/i18n/navigation'
import type { Post } from '@/lib/posts'
import { PostCard } from '@/components/posts/post-card'
import { LinkLabel } from '@/components/ui/typography/link-label'
import { ConstructionFrame } from '@/components/layout/construction/construction-frame'

export function PostsSection({ posts }: { posts: Post[] }) {
  const t = useTranslations('Posts')

  return (
    <Section id="posts">
      <SectionHeading eyebrow={t('eyebrow')} title={t('title')} description={t('description')}>
        <Link
          href="/posts"
          className="interactive-link group/link inline-flex items-center gap-2 text-sm text-accent hover:text-ink"
        >
          <LinkLabel>{t('all')}</LinkLabel>
          <AnimatedArrow />
        </Link>
      </SectionHeading>
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
        <p className="bg-surface p-10 text-subtle">{t('empty')}</p>
      )}
    </Section>
  )
}
