import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { Header } from '@/components/layout/navigation/header'
import { MotionProvider } from '@/components/ui/motion/motion-provider'
import { Footer } from '@/components/layout/footer/site-footer'
import { FooterRepository } from '@/components/layout/footer/footer-repository'
import { ThemeProvider } from '@/components/ui/theme/theme-provider'
import { InteractiveBackground } from '@/components/layout/background/interactive-background'
import { DocumentShell } from '@/components/layout/document-shell'
import { LinkLabel } from '@/components/ui/typography/link-label'
import { ScrollToTop } from '@/components/layout/navigation/scroll-to-top'
import { InitialLoadingProvider } from '@/components/layout/loading/initial-loading-provider'
import { SmoothScroll } from '@/components/layout/scroll/smooth-scroll'
import 'lenis/dist/lenis.css'
import '@/styles/globals.css'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  const t = await getTranslations({ locale, namespace: 'Hero' })
  const description = t.markup('description', {
    name: (chunks) => chunks,
    highlight: (chunks) => chunks,
  })

  return {
    metadataBase: new URL('https://mateusneiva.com'),
    title: {
      default: 'Mateus Neiva — Software Developer',
      template: '%s | Mateus Neiva',
    },
    description,
    authors: [{ name: 'Mateus Neiva' }],
    icons: {
      icon: [{ url: '/logo.svg', type: 'image/svg+xml', sizes: 'any' }, { url: '/logo.ico', sizes: '16x16 32x32 48x48' }],
      shortcut: '/logo.ico',
      apple: '/apple-icon.png',
    },
    openGraph: {
      siteName: 'Mateus Neiva',
      type: 'website',
      images: '/opengraph-image.png',
      locale: locale === 'pt' ? 'pt_BR' : 'en_US',
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  const t = await getTranslations('Navigation')
  return (
    <DocumentShell locale={locale}>
      <ThemeProvider>
        <NextIntlClientProvider>
          <MotionProvider>
            <InitialLoadingProvider>
              <SmoothScroll />
              <InteractiveBackground />
              <a
                href="#content"
                className="group/link fixed left-4 top-4 z-50 -translate-y-32 bg-accent p-3 text-sm text-accent-ink focus:translate-y-0"
              >
                <LinkLabel>{t('skip')}</LinkLabel>
              </a>
              <Header />
              {children}
              <Footer repository={<FooterRepository />} />
              <ScrollToTop />
            </InitialLoadingProvider>
          </MotionProvider>
        </NextIntlClientProvider>
      </ThemeProvider>
    </DocumentShell>
  )
}
