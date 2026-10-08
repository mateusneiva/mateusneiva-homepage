import { contactSchema } from '@/lib/contact/schema'
import { sendContactEmail } from '@/lib/contact/send-email'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const origin = request.headers.get('origin')
  if (origin && origin !== new URL(request.url).origin) {
    return Response.json({ success: false }, { status: 403 })
  }

  let body: unknown
  try {
    const text = await request.text()
    if (text.length > 32_000) return Response.json({ success: false }, { status: 413 })
    body = JSON.parse(text)
  } catch {
    return Response.json({ success: false }, { status: 400 })
  }

  const parsed = contactSchema.safeParse(body)
  if (!parsed.success) return Response.json({ success: false }, { status: 400 })

  const result = await sendContactEmail(parsed.data)
  if (result !== 'sent') {
    return Response.json({ success: false }, { status: result === 'unconfigured' ? 503 : 502 })
  }
  return Response.json({ success: true })
}
