// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import { expect, it } from 'vitest'
import { PostAuthor } from './post-author'
import { author } from '@/data/author'
import { socialLinks } from '@/data/social'
import en from '@/i18n/messages/en.json'
import pt from '@/i18n/messages/pt.json'

const locales = { pt, en } as const

it.each(['pt', 'en'] as const)('shows the author name, avatar, bio and profile link in %s', (locale) => {
  render(
    <NextIntlClientProvider locale={locale} messages={locales[locale]} timeZone="UTC">
      <PostAuthor />
    </NextIntlClientProvider>,
  )
  const messages = locales[locale].Posts.author
  expect(screen.getByText(messages.label)).toBeInTheDocument()
  expect(screen.getByText(messages.bio)).toBeInTheDocument()
  expect(screen.getByRole('img', { name: author.name })).toBeInTheDocument()
  const link = screen.getByRole('link', { name: author.name })
  expect(link).toHaveAttribute('href', author.profileUrl)
  expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'))
  for (const { label, href } of socialLinks) {
    expect(screen.getByRole('link', { name: label })).toHaveAttribute('href', href)
  }
  expect(screen.queryByRole('link', { name: /Currículo|Résumé/ })).not.toBeInTheDocument()
})
