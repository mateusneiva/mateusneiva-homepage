import { beforeEach, expect, it, vi } from 'vitest'
import { sendContactEmail } from './send-email'

const values = { name: 'Ana Silva', email: 'ana@example.com', message: 'Quero conversar sobre um projeto.' }
const fetchMock = vi.fn<typeof fetch>()

beforeEach(() => {
  fetchMock.mockReset()
  vi.stubGlobal('fetch', fetchMock)
  vi.stubEnv('RESEND_API_KEY', 'private-test-key')
  vi.stubEnv('CONTACT_EMAIL_FROM', 'Portfolio <contato@example.com>')
  vi.stubEnv('CONTACT_EMAIL_TO', 'owner@example.com')
})

it('sends only to the configured recipient and uses the visitor email for replies', async () => {
  fetchMock.mockResolvedValueOnce(Response.json({ id: 'email-id' }))
  expect(await sendContactEmail(values)).toBe('sent')
  const [url, options] = fetchMock.mock.calls[0]
  expect(url).toBe('https://api.resend.com/emails')
  expect(options!.headers).toEqual({
    Authorization: 'Bearer private-test-key',
    'Content-Type': 'application/json',
  })
  expect(JSON.parse(options!.body as string)).toEqual({
    from: 'Portfolio <contato@example.com>',
    to: ['owner@example.com'],
    reply_to: 'ana@example.com',
    subject: 'Nova mensagem pelo portfólio — Mateus Neiva',
    text: `Nome: ${values.name}\nE-mail: ${values.email}\n\n${values.message}`,
  })
  expect(options!.signal).toBeInstanceOf(AbortSignal)
})

it.each(['RESEND_API_KEY', 'CONTACT_EMAIL_FROM', 'CONTACT_EMAIL_TO'])(
  'does not call Resend without %s',
  async (variable) => {
    vi.stubEnv(variable, '')
    expect(await sendContactEmail(values)).toBe('unconfigured')
    expect(fetchMock).not.toHaveBeenCalled()
  },
)

it.each([Response.json({ message: 'Provider error' }, { status: 429 }), Response.json({})])(
  'does not claim success for rejected or malformed provider responses',
  async (response) => {
    fetchMock.mockResolvedValueOnce(response)
    expect(await sendContactEmail(values)).toBe('failed')
  },
)

it('handles network failures and timeouts', async () => {
  fetchMock.mockRejectedValueOnce(new DOMException('Timed out', 'TimeoutError'))
  expect(await sendContactEmail(values)).toBe('failed')
})
