// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import { expect, it } from 'vitest'
import { BackLink } from './back-link'
import messages from '@/i18n/messages/pt.json'

it('links to the localized home page', () => {
  render(
    <NextIntlClientProvider locale="pt" messages={messages} timeZone="UTC">
      <BackLink label="Voltar ao início" />
    </NextIntlClientProvider>,
  )
  expect(screen.getByRole('link', { name: 'Voltar ao início' })).toHaveAttribute('href', '/pt')
})
