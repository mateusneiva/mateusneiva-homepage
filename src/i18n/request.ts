import { getRequestConfig } from 'next-intl/server'
import { hasLocale } from 'next-intl'
import { routing } from './routing'
import { locale as getRootLocale } from 'next/root-params'
import { notFound } from 'next/navigation'

export default getRequestConfig(async ({ locale: override }) => {
  const locale = override ?? (await getRootLocale())
  if (!hasLocale(routing.locales, locale)) notFound()

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  }
})
