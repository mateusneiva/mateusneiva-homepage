// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { NextIntlClientProvider } from 'next-intl'
import userEvent from '@testing-library/user-event'
import { expect, it, vi } from 'vitest'
import { ProjectSectionGuide } from './project-section-guide'
import { projectSections } from './project-sections'
import messages from '@/i18n/messages/pt.json'

function renderGuide() {
  return render(
    <NextIntlClientProvider locale="pt" messages={messages} timeZone="UTC">
      <ProjectSectionGuide />
    </NextIntlClientProvider>
  )
}

it('exposes six labeled section links and identifies the current location', () => {
  renderGuide()
  expect(
    screen.getByRole('navigation', { name: 'Nesta página' })
  ).toBeInTheDocument()
  expect(screen.getAllByRole('link')).toHaveLength(6)
  projectSections.forEach(({ id, label }) => {
    expect(
      screen.getByRole('link', { name: messages.ProjectDetails[label] })
    ).toHaveAttribute('href', `#${id}`)
  })
  expect(screen.getByRole('link', { name: 'Apresentação' })).toHaveAttribute(
    'aria-current',
    'location'
  )
})

it('scrolls to a section without adding extra back-history entries', async () => {
  const section = document.createElement('section')
  section.id = 'project-architecture'
  const scrollIntoView = vi.fn()
  section.scrollIntoView = scrollIntoView
  document.body.append(section)
  const replace = vi.spyOn(window.history, 'replaceState')
  try {
    renderGuide()
    await userEvent.click(
      screen.getByRole('link', { name: 'Como foi construído' })
    )
    expect(scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    })
    expect(replace).toHaveBeenCalledWith(
      window.history.state,
      '',
      '#project-architecture'
    )
  } finally {
    section.remove()
    window.history.replaceState(null, '', '/')
  }
})
