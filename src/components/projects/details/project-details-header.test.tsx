// @vitest-environment jsdom
import { render, screen, within } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import { expect, it } from 'vitest'
import { projects } from '@/data/projects'
import messages from '@/i18n/messages/pt.json'
import { ProjectDetailsHeader } from './project-details-header'

const project = projects.find((item) => item.id === 'softness')!

it('shows the technologies and links next to the title', () => {
  render(
    <NextIntlClientProvider locale="pt" messages={messages} timeZone="UTC">
      <ProjectDetailsHeader project={project} />
    </NextIntlClientProvider>
  )
  const header = screen.getByRole('banner')
  project.stack.forEach((name) => {
    expect(within(header).getByText(name)).toBeInTheDocument()
  })
  expect(within(header).getByRole('link', { name: 'Código no GitHub' })).toHaveAttribute('href', project.repository)
  expect(within(header).getByRole('link', { name: 'Ver projeto' })).toHaveAttribute('href', project.website)
})

it.each([
  ['polaris', 'Abrir Storybook'],
  ['licht', 'Site e downloads'],
  ['shiva', 'Convidar para o meu servidor'],
  ['softness', 'Ver projeto'],
] as const)('labels the %s website button as "%s"', (id, label) => {
  const item = projects.find((entry) => entry.id === id)!
  render(
    <NextIntlClientProvider locale="pt" messages={messages} timeZone="UTC">
      <ProjectDetailsHeader project={item} />
    </NextIntlClientProvider>
  )
  expect(screen.getByRole('link', { name: label })).toHaveAttribute('href', item.website)
  expect(screen.getByRole('link', { name: 'Código no GitHub' })).toHaveAttribute('href', item.repository)
})

it('places the cover above the title', () => {
  const { container } = render(
    <NextIntlClientProvider locale="pt" messages={messages} timeZone="UTC">
      <ProjectDetailsHeader project={project} />
    </NextIntlClientProvider>
  )
  const cover = container.querySelector('header > div[aria-hidden="true"], header > div > div[aria-hidden="true"]')!
  const title = screen.getByRole('heading', { level: 1 })
  expect(cover.compareDocumentPosition(title)).toBe(Node.DOCUMENT_POSITION_FOLLOWING)
})
