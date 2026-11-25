import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { author } from '@/data/author'
import { HomeSocialLinks } from '@/components/home/social-links'

export function PostAuthor() {
  const t = useTranslations('Posts.author')

  return (
    <aside className="mt-16 flex items-start gap-4 bg-surface px-6 pb-3 pt-6 sm:px-7 sm:pb-5.5 sm:pt-7">
      <Image
        src={author.avatarUrl}
        width={56}
        height={56}
        alt={author.name}
        className="h-14 w-14 shrink-0 rounded-full bg-raised object-cover"
      />
      <div className="min-w-0">
        <p className="font-mono text-xs text-subtle">{t('label')}</p>
        <a
          href={author.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-serif text-xl font-medium text-ink hover:text-accent focus-visible:text-accent"
        >
          {author.name}
        </a>
        <p className="text-sm leading-6 text-muted">{t('bio')}</p>
        <HomeSocialLinks resume={false} className="-ml-2.5 mt-1.5" />
      </div>
    </aside>
  )
}
