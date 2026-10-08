'use client'

import { useLocale, useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import { ThemeToggle } from '@/components/ui/theme/theme-toggle'
import { Wordmark } from './wordmark'
import { LinkLabel } from '@/components/ui/typography/link-label'
import { cn } from '@/lib/cn'

export function Header() {
  const t = useTranslations('Navigation')
  const locale = useLocale()
  const pathname = usePathname()
  return (
    <header className="relative">
      <div className="page-container flex min-h-20 items-center justify-between gap-4">
        <Wordmark />
        <div className="flex items-center gap-6 sm:gap-8">
          <div
            className="flex items-center gap-3 font-mono text-xs"
            role="group"
            aria-label={t('language')}
          >
            {(['pt', 'en'] as const).map((language) => (
              <Link
                key={language}
                href={pathname}
                locale={language}
                hrefLang={language}
                aria-current={locale === language ? 'true' : undefined}
                className={cn('interactive-link group/link', locale === language ? 'text-accent' : 'text-subtle hover:text-ink')}
              >
                <LinkLabel>{language.toUpperCase()}</LinkLabel>
              </Link>
            ))}
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
