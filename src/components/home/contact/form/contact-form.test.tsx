// @vitest-environment jsdom
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NextIntlClientProvider } from 'next-intl'
import { beforeEach, expect, it, vi } from 'vitest'
import { ContactForm } from './contact-form'
import messages from '@/i18n/messages/pt.json'

const fetchMock = vi.fn<typeof fetch>()
beforeEach(() => {
  fetchMock.mockReset()
  vi.stubGlobal('fetch', fetchMock)
})

function renderForm() {
  return render(
    <NextIntlClientProvider locale="pt" messages={messages} timeZone="UTC">
      <ContactForm />
    </NextIntlClientProvider>,
  )
}

it('associates validation messages with fields and focuses the first invalid value', async () => {
  renderForm()
  const user = userEvent.setup()
  const name = screen.getByRole('textbox', { name: messages.Contact.name })
  await user.type(name, '   ')
  await user.type(screen.getByRole('textbox', { name: messages.Contact.address }), 'not-an-email')
  await user.type(screen.getByRole('textbox', { name: messages.Contact.message }), 'short')
  await user.click(screen.getByRole('button', { name: messages.Contact.submit }))

  expect(await screen.findByRole('alert')).toHaveTextContent(messages.Contact.invalid)
  expect(name).toHaveAttribute('aria-invalid', 'true')
  expect(name).toHaveAccessibleDescription(messages.Contact.validation.name)
  await waitFor(() => expect(name).toHaveFocus())
  expect(fetchMock).not.toHaveBeenCalled()
})

it('submits trimmed schema values and clears errors when a field is corrected', async () => {
  fetchMock.mockResolvedValue(Response.json({ success: true }))
  renderForm()
  const user = userEvent.setup()
  const name = screen.getByRole('textbox', { name: messages.Contact.name })
  await user.type(name, '   ')
  await user.type(screen.getByRole('textbox', { name: messages.Contact.address }), 'mateus@example.com')
  await user.type(screen.getByRole('textbox', { name: messages.Contact.message }), '  Vamos conversar sobre um projeto.  ')
  await user.click(screen.getByRole('button', { name: messages.Contact.submit }))
  await screen.findByRole('alert')

  await user.clear(name)
  await user.type(name, '  Mateus Neiva  ')
  await waitFor(() => expect(name).toHaveAttribute('aria-invalid', 'false'))
  await user.click(screen.getByRole('button', { name: messages.Contact.submit }))
  await screen.findByRole('status')
  expect(fetchMock).toHaveBeenCalledTimes(1)
  expect(fetchMock.mock.calls[0][0]).toBe('/api/contact')
  expect(JSON.parse(fetchMock.mock.calls[0][1]!.body as string)).toEqual({
    name: 'Mateus Neiva',
    email: 'mateus@example.com',
    message: 'Vamos conversar sobre um projeto.',
  })
  expect(screen.getByRole('status')).toHaveTextContent(messages.Contact.success)
  expect(name).toHaveValue('')
})

it('keeps the message after a network failure and allows a successful retry', async () => {
  fetchMock.mockRejectedValueOnce(new Error('Network unavailable'))
  fetchMock.mockResolvedValueOnce(Response.json({ success: true }))
  renderForm()
  const user = userEvent.setup()
  await user.type(screen.getByRole('textbox', { name: messages.Contact.name }), 'Ana Silva')
  await user.type(screen.getByRole('textbox', { name: messages.Contact.address }), 'ana@example.com')
  const message = screen.getByRole('textbox', { name: messages.Contact.message })
  await user.type(message, 'Quero conversar sobre um projeto.')
  await user.click(screen.getByRole('button', { name: messages.Contact.submit }))
  expect(await screen.findByRole('alert')).toHaveTextContent(messages.Contact.error)
  expect(message).toHaveValue('Quero conversar sobre um projeto.')
  await user.click(screen.getByRole('button', { name: messages.Contact.submit }))
  expect(await screen.findByRole('status')).toHaveTextContent(messages.Contact.success)
  expect(screen.queryByRole('alert')).not.toBeInTheDocument()
})
