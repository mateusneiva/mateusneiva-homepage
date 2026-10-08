import { useLocale, useTranslations } from 'next-intl'
import { AnimatedArrow } from '@/components/ui/icons/animated-arrow'
import { Link } from '@/i18n/navigation'
import type { Post } from '@/lib/posts'
import { Reveal } from '@/components/ui/motion/reveal'
import { LinkLabel } from '@/components/ui/typography/link-label'
import { MouseCardSurface } from '@/components/ui/motion/mouse-card-surface'
import { Tag } from '@/components/ui/tags/tag'

export function PostCard({ post, index = 0 }: { post: Post; index?: number }) {
  const t = useTranslations('Posts')
  const locale = useLocale()
  const contents = (
    <>
      <div
        className="flex items-start justify-between gap-3 font-mono text-xs text-subtle"
        data-post-metadata
      >
        <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 py-1">
          <time dateTime={post.date} className="whitespace-nowrap">
            {new Intl.DateTimeFormat(locale, {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              timeZone: 'UTC',
            }).format(new Date(post.date))}
          </time>
          <span aria-hidden="true">·</span>
          <span className="whitespace-nowrap">{t('minutes', { count: post.readingTime })}</span>
        </div>
      </div>
      <h3 className="heading-card mt-3">
        <LinkLabel scope="card">{post.title}</LinkLabel>
      </h3>
      <p className="mb-6 mt-3 text-sm leading-6 text-muted">{post.description}</p>
      <div className="mt-auto flex items-end justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {post.tags.slice(0, 3).map((tag) => (
            <Tag key={tag} size="xs" tone="subtle">
              #{tag}
            </Tag>
          ))}
        </div>
        <AnimatedArrow size={20} className="text-accent" animated={false} />
      </div>
    </>
  )
  const className = 'group/card flex h-full flex-col p-6 sm:p-7'
  return (
    <Reveal className="h-full" delay={index * 0.06}>
      <article className="h-full">
        <MouseCardSurface className="h-full">
          <Link href={post.url} className={className}>
            {contents}
          </Link>
        </MouseCardSurface>
      </article>
    </Reveal>
  )
}
