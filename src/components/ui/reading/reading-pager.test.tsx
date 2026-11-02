// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import { expect, it } from 'vitest'
import { ReadingPager } from './reading-pager'
import messages from '@/i18n/messages/pt.json'

const labels = {
  label: 'Navegação',
  previousLabel: 'Anterior',
  nextLabel: 'Próximo',
}

function renderPager(props: Partial<Parameters<typeof ReadingPager>[0]>) {
  return render(
    <NextIntlClientProvider locale="pt" messages={messages} timeZone="UTC">
      <ReadingPager {...labels} {...props} />
    </NextIntlClientProvider>,
  )
}

it('links to both neighbours with their titles and dates', () => {
  renderPager({
    previous: { href: '/posts/a', title: 'Primeiro', meta: '1 de janeiro de 2026' },
    next: { href: '/posts/c', title: 'Terceiro' },
  })
  expect(screen.getByRole('link', { name: /Anterior\s*Primeiro\s*1 de janeiro de 2026/ })).toHaveAttribute('href', '/pt/posts/a')
  expect(screen.getByRole('link', { name: /Próximo\s*Terceiro/ })).toHaveAttribute('href', '/pt/posts/c')
})

it('hides the side that has no destination', () => {
  renderPager({ next: { href: '/posts/b', title: 'Segundo' } })
  expect(screen.queryByRole('link', { name: /Anterior/ })).not.toBeInTheDocument()
  expect(screen.getByRole('link', { name: /Próximo/ })).toBeInTheDocument()
})

it('renders nothing when there are no neighbours', () => {
  renderPager({})
  expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
})
