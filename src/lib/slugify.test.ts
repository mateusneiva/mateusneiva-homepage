import { expect, it } from 'vitest'
import { slugify } from './slugify'

it('turns headings into stable ASCII anchors', () => {
  expect(slugify('Desafios de compatibilidade')).toBe('desafios-de-compatibilidade')
  expect(slugify('  Decisões & trade-offs! ')).toBe('decisoes-trade-offs')
})
