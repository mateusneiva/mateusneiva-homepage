// @vitest-environment jsdom
import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { Markdown } from './markdown'

it('anchors level-two headings with a stable slug', () => {
  render(<Markdown content={'## Decisões & limites\n\nTexto.'} />)
  expect(screen.getByRole('heading', { level: 2, name: 'Decisões & limites' })).toHaveAttribute('id', 'decisoes-limites')
})

it('renders a local image as a captioned figure, not inside a paragraph', () => {
  const { container } = render(<Markdown content={'![Tela inicial](/projects/licht/home.png "A lista de instâncias.")'} />)
  const image = screen.getByRole('img', { name: 'Tela inicial' })
  expect(image.closest('figure')).toHaveTextContent('A lista de instâncias.')
  expect(container.querySelector('p')).toBeNull()
})

it('ignores raw HTML comments used as authoring notes', () => {
  render(<Markdown content={'Antes.\n\n<!-- imagem: tela de login -->\n\nDepois.'} />)
  expect(screen.queryByText(/imagem: tela de login/)).not.toBeInTheDocument()
})
