export interface QuoteFields {
  name: string
  contact: string
  organization: string
  projectTypes: string[]
  quantity: string
  neededBy: string
  hasArtwork: boolean
}

export async function createNotionEntry(
  fields: QuoteFields,
  apiKey: string,
  databaseId: string
): Promise<string> {
  const label = fields.projectTypes.length
    ? fields.projectTypes.join(' · ')
    : 'General'
  const date = new Date().toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
  const title = `${fields.name} — ${label} — ${date}`

  const body = {
    parent: { database_id: databaseId },
    properties: {
      Name: { title: [{ text: { content: title } }] },
      Contact: { rich_text: [{ text: { content: fields.contact } }] },
      Organization: { rich_text: [{ text: { content: fields.organization } }] },
      'Project Type': { multi_select: fields.projectTypes.map((name) => ({ name })) },
      Quantity: { rich_text: [{ text: { content: fields.quantity } }] },
      'Needed By': { rich_text: [{ text: { content: fields.neededBy } }] },
      Artwork: { checkbox: fields.hasArtwork },
      Status: { select: { name: 'New' } },
      Source: { select: { name: 'Website form' } },
      Submitted: { date: { start: new Date().toISOString() } },
    },
  }

  const res = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Notion API ${res.status}: ${err}`)
  }

  const page = await res.json() as { url: string }
  return page.url
}
