import 'server-only'
import { z } from 'zod'
import type { ContactValues } from './schema'

const sentEmailSchema = z.object({ id: z.string().min(1) })

export async function sendContactEmail(values: ContactValues): Promise<'sent' | 'unconfigured' | 'failed'> {
  const apiKey = process.env.RESEND_API_KEY?.trim()
  const from = process.env.CONTACT_EMAIL_FROM?.trim()
  const to = process.env.CONTACT_EMAIL_TO?.trim()
  if (!apiKey || !from || !to) return 'unconfigured'

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: values.email,
        subject: 'Nova mensagem pelo portfólio — Mateus Neiva',
        text: `Nome: ${values.name}\nE-mail: ${values.email}\n\n${values.message}`,
      }),
      signal: AbortSignal.timeout(10_000),
      cache: 'no-store',
    })
    if (!response.ok) return 'failed'
    return sentEmailSchema.safeParse(await response.json()).success ? 'sent' : 'failed'
  } catch {
    return 'failed'
  }
}
