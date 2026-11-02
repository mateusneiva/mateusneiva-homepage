// @vitest-environment jsdom
import { render, screen, within } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import { expect, it } from 'vitest'
import { projects } from '@/data/projects'
import messages from '@/i18n/messages/pt.json'
import { ProjectDetailsContent } from './project-details-content'

const project = projects.find((item) => item.id === 'softness')!

function renderContent() {
  return render(
    <NextIntlClientProvider locale="pt" messages={messages} timeZone="UTC">
      <ProjectDetailsContent project={project} />
    </NextIntlClientProvider>
  )
}

it('closes the page with the repository and website links', () => {
  const { container } = renderContent()
  const section = screen.getByRole('region', { name: 'Explore o projeto' })
  expect(section).toHaveAttribute('id', 'project-links')
  expect(within(section).getByRole('link', { name: 'Código no GitHub' })).toHaveAttribute('href', project.repository)
  expect(within(section).getByRole('link', { name: 'Ver projeto' })).toHaveAttribute('href', project.website)
  expect(within(section).getAllByRole('link').map((link) => link.getAttribute('href'))).toEqual([
    project.website,
    project.repository,
  ])
  expect(container.querySelectorAll('section[id]')).toHaveLength(5)
  expect(container.querySelector('section[id]:last-of-type')).toBe(section)
})

it('starts with the technologies section', () => {
  const { container } = renderContent()
  expect(container.querySelector('section[id]')).toBe(screen.getByRole('region', { name: 'Tecnologias' }))
})
