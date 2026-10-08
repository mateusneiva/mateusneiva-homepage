// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import { expect, it } from 'vitest'
import { ProjectCard } from './project-card'
import { projects } from '@/data/projects'
import messages from '@/i18n/messages/pt.json'

it.each(projects)('renders $name as one accessible link to its details page', (project) => {
  render(
    <NextIntlClientProvider locale="pt" messages={messages} timeZone="UTC">
      <ProjectCard project={project} index={0} />
    </NextIntlClientProvider>,
  )
  const links = screen.getAllByRole('link')
  expect(links).toHaveLength(1)
  expect(links[0]).toHaveAttribute('href', `/pt/projects/${project.slug}`)
  expect(links[0]).toHaveAccessibleName(`${project.name} — Ver detalhes`)
  expect(links[0].querySelector('a')).toBeNull()
  for (const technology of project.stack) expect(screen.getByText(technology)).toBeInTheDocument()
  expect(screen.queryByText('GitHub')).not.toBeInTheDocument()
  expect(screen.queryByText('Ver projeto')).not.toBeInTheDocument()
})

it('uses the chosen project image while preserving the accessible card link', () => {
  const project = { ...projects[0], image: '/projects/custom-softness.png' }
  const { container } = render(
    <NextIntlClientProvider locale="pt" messages={messages} timeZone="UTC">
      <ProjectCard project={project} index={0} />
    </NextIntlClientProvider>,
  )
  const image = container.querySelector('img')!
  expect(image).toBeInTheDocument()
  expect(decodeURIComponent(image.getAttribute('src')!)).toContain(project.image)
  expect(image).toHaveAttribute('alt', '')
  expect(image).toHaveClass('object-contain')
  expect(screen.getByRole('link')).toHaveAccessibleName('Softness — Ver detalhes')
  expect(screen.queryByText('LESS NOISE. MORE YOU.')).not.toBeInTheDocument()
})
