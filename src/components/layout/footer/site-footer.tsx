'use client'

import { useTranslations } from 'next-intl'
import { FooterMarquee } from './footer-marquee'
import { FooterColumns } from './footer-columns'
import type { ReactNode } from 'react'

export function Footer({ repository }: { repository: ReactNode }) {
  const t = useTranslations('Footer')
  return (
    <footer
      data-theme="dark"
      className="theme-dark relative mt-16 overflow-hidden bg-surface text-ink"
    >
      <div className="page-container relative pt-12 sm:pt-16">
        <FooterColumns />
      </div>
      <FooterMarquee lines={[t('signature'), t('signatureReturn')]} />
      <div className="page-container pb-8">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-2 font-mono text-[11px] text-subtle">
            <p>
              © {new Date().getFullYear()} Mateus Neiva. {t('rights')}
            </p>
            {repository}
          </div>
        </div>
      </div>
    </footer>
  )
}
