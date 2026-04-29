import type { QuoteFields } from './notion'

export async function sendQuoteEmail(opts: {
  fields: QuoteFields
  artworkFile: File | null
  notionUrl: string | null
  apiKey: string
  from: string
  to: string
}): Promise<void> {
  const { fields, artworkFile, notionUrl, apiKey, from, to } = opts

  const subject = [
    'New project request —',
    fields.name,
    fields.organization ? `, ${fields.organization}` : '',
  ].join('')

  const rows = [
    ['Name', fields.name],
    ['Contact', fields.contact],
    fields.organization ? ['Organization', fields.organization] : null,
    ['Project type', fields.projectTypes.length ? fields.projectTypes.join(', ') : '—'],
    ['Quantity / size', fields.quantity || '—'],
    ['Needed by', fields.neededBy || '—'],
    ['Artwork', artworkFile ? `Attached (${artworkFile.name})` : 'None'],
  ]
    .filter(Boolean)
    .map(
      ([label, value]) =>
        `<tr>
          <td style="padding:8px 0;border-bottom:1px solid #e8e4dc;font-weight:600;width:160px">${esc(label!)}</td>
          <td style="padding:8px 0;border-bottom:1px solid #e8e4dc">${esc(value!)}</td>
        </tr>`
    )
    .join('')

  const notionLink = notionUrl
    ? `<p style="margin-top:20px"><a href="${notionUrl}" style="color:#111111">View in Notion →</a></p>`
    : ''

  const html = `
<div style="font-family:sans-serif;max-width:560px;color:#1a1a1a">
  <h2 style="color:#111111;margin-bottom:4px">New project request</h2>
  <p style="color:#6b7280;margin-top:0">Submitted via cumberlandsignworks.com</p>
  <table style="border-collapse:collapse;width:100%">${rows}</table>
  ${notionLink}
</div>`

  const payload: Record<string, unknown> = {
    from,
    to: [to],
    reply_to: fields.contact.includes('@') ? fields.contact : undefined,
    subject,
    html,
  }

  if (artworkFile && artworkFile.size > 0) {
    const bytes = await artworkFile.arrayBuffer()
    const b64 = btoa(String.fromCharCode(...new Uint8Array(bytes)))
    payload.attachments = [{ filename: artworkFile.name, content: b64 }]
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Resend ${res.status}: ${err}`)
  }
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
