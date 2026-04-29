import { isHoneypotFilled, verifyTurnstile } from './validate'
import { createNotionEntry, type QuoteFields } from './notion'
import { sendQuoteEmail } from './email'

export interface Env {
  ALLOWED_ORIGIN: string
  RESEND_API_KEY: string
  RESEND_FROM: string
  RESEND_TO: string
  NOTION_API_KEY: string
  NOTION_DATABASE_ID: string
  TURNSTILE_SECRET_KEY?: string
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const corsHeaders = {
      'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders })
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 })
    }

    let form: FormData
    try {
      form = await request.formData()
    } catch {
      return json({ ok: false, error: 'Invalid form data' }, 400, corsHeaders)
    }

    // Honeypot — silent discard
    if (isHoneypotFilled(form)) {
      return json({ ok: true }, 200, corsHeaders)
    }

    // Turnstile (optional — skip if secret not configured)
    if (env.TURNSTILE_SECRET_KEY) {
      const token = (form.get('cf-turnstile-response') as string) ?? ''
      const valid = await verifyTurnstile(token, env.TURNSTILE_SECRET_KEY)
      if (!valid) {
        return json({ ok: false, error: 'Spam check failed. Please try again.' }, 400, corsHeaders)
      }
    }

    const artworkRaw = form.get('artwork') as unknown
    const artworkFileEntry =
      artworkRaw instanceof File && artworkRaw.size > 0 ? artworkRaw : null

    const fields: QuoteFields = {
      name: (form.get('name') as string) ?? '',
      contact: (form.get('contact') as string) ?? '',
      organization: (form.get('organization') as string) ?? '',
      projectTypes: form.getAll('project_type') as string[],
      quantity: (form.get('quantity') as string) ?? '',
      neededBy: (form.get('needed_by') as string) ?? '',
      hasArtwork: artworkFileEntry !== null,
    }

    if (!fields.name || !fields.contact) {
      return json({ ok: false, error: 'Name and contact are required.' }, 400, corsHeaders)
    }

    const artworkFile = artworkFileEntry

    // Write to Notion — non-fatal (email is the source of truth for the client)
    let notionUrl: string | null = null
    try {
      notionUrl = await createNotionEntry(fields, env.NOTION_API_KEY, env.NOTION_DATABASE_ID)
    } catch (e) {
      console.error('Notion write failed:', e)
    }

    // Send email — fatal (client must receive the lead)
    try {
      await sendQuoteEmail({
        fields,
        artworkFile,
        notionUrl,
        apiKey: env.RESEND_API_KEY,
        from: env.RESEND_FROM,
        to: env.RESEND_TO,
      })
    } catch (e) {
      console.error('Email failed:', e)
      return json(
        { ok: false, error: 'Could not send your request. Please call us at (931) 707-0557.' },
        500,
        corsHeaders
      )
    }

    return json({ ok: true }, 200, corsHeaders)
  },
}

function json(
  body: unknown,
  status: number,
  headers: Record<string, string> = {}
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...headers },
  })
}
