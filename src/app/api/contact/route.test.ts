import { beforeEach, expect, it, vi } from 'vitest'
import { POST } from './route'

const mocks = vi.hoisted(() => ({ sendEmail: vi.fn() }))
vi.mock('@/lib/contact/send-email', () => ({ sendContactEmail: mocks.sendEmail }))
const values = {
  name: ' Ana Silva ',
  email: ' ana@example.com ',
  message: ' Quero conversar sobre um projeto. ',
}
const request = (body: unknown) =>
  new Request('https://portfolio.example/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: 'https://portfolio.example' },
    body: JSON.stringify(body),
  })

beforeEach(() => {
  mocks.sendEmail.mockReset()
})

it('validates and trims the payload before sending, without exposing provider data', async () => {
  mocks.sendEmail.mockResolvedValueOnce('sent')
  const response = await POST(request(values))
  expect(response.status).toBe(200)
  expect(await response.json()).toEqual({ success: true })
  expect(mocks.sendEmail).toHaveBeenCalledWith({
    name: 'Ana Silva',
    email: 'ana@example.com',
    message: 'Quero conversar sobre um projeto.',
  })
})

it.each([
  { ...values, email: 'invalid' },
  { ...values, message: 'short' },
  { ...values, to: 'another@example.com' },
])('rejects invalid input and recipient overrides before sending', async (body) => {
  expect((await POST(request(body))).status).toBe(400)
  expect(mocks.sendEmail).not.toHaveBeenCalled()
})

it.each([
  ['unconfigured', 503],
  ['failed', 502],
] as const)('returns a generic failure for %s', async (result, status) => {
  mocks.sendEmail.mockResolvedValueOnce(result)
  const response = await POST(request(values))
  expect(response.status).toBe(status)
  expect(await response.json()).toEqual({ success: false })
})

it('rejects malformed JSON', async () => {
  const response = await POST(
    new Request('https://portfolio.example/api/contact', { method: 'POST', body: '{' }),
  )
  expect(response.status).toBe(400)
  expect(mocks.sendEmail).not.toHaveBeenCalled()
})

it('rejects a different browser origin', async () => {
  const foreign = request(values)
  foreign.headers.set('origin', 'https://other.example')
  expect((await POST(foreign)).status).toBe(403)
  expect(mocks.sendEmail).not.toHaveBeenCalled()
})

it('rejects oversized payloads', async () => {
  expect((await POST(request({ ...values, message: 'x'.repeat(32_001) }))).status).toBe(413)
  expect(mocks.sendEmail).not.toHaveBeenCalled()
})
