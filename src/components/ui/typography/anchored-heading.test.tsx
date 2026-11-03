// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import { expect, it, vi } from 'vitest'
import { AnchoredHeading } from './anchored-heading'
import messages from '@/i18n/messages/pt.json'

it('copies a link to the heading when clicked and announces it', async () => {
  const writeText = vi.fn().mockResolvedValue(undefined)
  Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
  render(
    <NextIntlClientProvider locale="pt" messages={messages} timeZone="UTC">
      <AnchoredHeading as="h2" id="intro-title" anchor="intro">
        Intro
      </AnchoredHeading>
    </NextIntlClientProvider>,
  )
  fireEvent.click(screen.getByRole('heading', { name: 'Intro' }))
  await vi.waitFor(() => expect(writeText).toHaveBeenCalledWith(`${window.location.origin}/#intro`))
  expect(window.location.hash).toBe('#intro')
  expect(await screen.findByRole('status')).toHaveTextContent('Link copiado')
})
