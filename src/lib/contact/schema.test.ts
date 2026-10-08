import { describe, expect, it } from 'vitest'
import { contactSchema } from './schema'

const valid = {
  name: 'Ana Silva',
  email: 'ana@example.com',
  message: 'Quero conversar sobre um projeto.',
}

describe('contact validation', () => {
  it('trims fields before preparing the email', () => {
    expect(
      contactSchema.parse({
        name: ' Ana Silva ',
        email: ' ana@example.com ',
        message: ' Uma mensagem válida. ',
      }),
    ).toEqual({
      name: 'Ana Silva',
      email: 'ana@example.com',
      message: 'Uma mensagem válida.',
    })
  })

  it.each([
    { name: '   ' },
    { email: 'not-an-email' },
    { message: 'short' },
    { message: 'x'.repeat(5001) },
    { email: 'x'.repeat(255) + '@example.com' },
  ])('rejects invalid input: %j', (invalid) => {
    expect(contactSchema.safeParse({ ...valid, ...invalid }).success).toBe(false)
  })
})
