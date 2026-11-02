import { expect, it } from 'vitest'
import { readHeadings } from './markdown-headings'

it('lists level-two headings and ignores deeper levels and code fences', () => {
  const content = '## Contexto\n\n### Detalhe\n\n```sh\n## not a heading\n```\n\n## Decisões & limites\n'
  expect(readHeadings(content)).toEqual([
    { id: 'contexto', title: 'Contexto' },
    { id: 'decisoes-limites', title: 'Decisões & limites' },
  ])
})

it('returns an empty list when there are no headings', () => {
  expect(readHeadings('Just text.')).toEqual([])
})
