# Quote Form → Cloudflare Worker → Notion + Email

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Formspree form endpoint with a Cloudflare Worker that writes every quote request to the client's Notion portal and sends an email notification to the client's inbox via Resend.

**Architecture:** The site's QuoteForm POSTs to a Cloudflare Worker. The Worker validates (honeypot + optional Turnstile), writes a structured entry to a Notion database in the client's portal, and sends a formatted HTML email to the client via Resend with any artwork file attached. The QuoteForm switches from native HTML POST to `fetch()` for an inline thank-you. All config is env-var driven so the same Worker pattern can be reused for every Vaktal client.

**Tech Stack:** Cloudflare Workers (TypeScript, Wrangler 3), Resend API (email + attachments), Notion API (database pages), Cloudflare Turnstile (optional spam gate)

---

## File Structure

**New files:**
- `workers/quote-handler/src/index.ts` — Worker entry: CORS, routing, main handler
- `workers/quote-handler/src/notion.ts` — Notion API: create database page from `QuoteFields`
- `workers/quote-handler/src/email.ts` — Resend API: HTML email with optional file attachment
- `workers/quote-handler/src/validate.ts` — Honeypot check + Turnstile verification
- `workers/quote-handler/src/index.test.ts` — Vitest smoke tests for validate logic
- `workers/quote-handler/wrangler.toml` — Worker name, compat date, env var declarations
- `workers/quote-handler/package.json` — Worker devDependencies
- `workers/quote-handler/tsconfig.json` — TypeScript for Workers runtime

**Modified files:**
- `tailwind.config.mjs` — Replace green/clay/cream tokens with black/white/gray palette
- `src/components/QuoteForm.astro` — Switch from native POST to `fetch()`, add inline success/error state, remove Formspree hidden fields
- `.env.example` — Replace Formspree vars with Worker + Notion + Resend vars

---

## Task 1: Update brand color tokens to Black / White / Gray

**Files:**
- Modify: `tailwind.config.mjs`

The client is rebranding from forest green + clay orange to a black/white/gray palette. All components reference Tailwind tokens (`cumberland-forest`, `cumberland-clay`, etc.) — no hardcoded hex values exist in `.astro` files — so updating the token values in `tailwind.config.mjs` cascades to the entire site automatically.

> **Confirm exact hex values with client before applying.** The mapping below is a professional B&W/gray interpretation of their stated direction. Adjust any value before committing if the client provides specific codes.

Proposed token mapping:

| Token | Old | New | Role |
|---|---|---|---|
| `forest` | `#1F4E3D` | `#111111` | Primary black (section backgrounds, nav, outlines) |
| `forest-dark` | `#163A2D` | `#000000` | Hover / pressed state |
| `clay` | `#D97842` | `#111111` | CTA button color — pure black for maximum pop |
| `clay-dark` | `#B85F2D` | `#000000` | Hover for CTA |
| `cream` | `#FAF7F2` | `#FFFFFF` | White background |
| `ink` | `#1A1A1A` | `#111111` | Body text (minor tightening) |
| `stone` | `#6B7280` | `#6B7280` | Muted text — unchanged |
| `mist` | `#E8E4DC` | `#E5E5E5` | Borders / dividers (warm beige → cool light gray) |

- [ ] **Step 1: Update `tailwind.config.mjs`**

Open `tailwind.config.mjs`. Replace the `colors.cumberland` block:

```js
colors: {
  cumberland: {
    ink: '#111111',
    cream: '#FFFFFF',
    forest: '#111111',
    'forest-dark': '#000000',
    clay: '#111111',
    'clay-dark': '#000000',
    stone: '#6B7280',
    mist: '#E5E5E5',
  },
},
```

- [ ] **Step 2: Build to verify no broken token references**

```bash
npm run build
```

Expected: `25 page(s) built` with no errors or warnings about unknown colors.

- [ ] **Step 3: Fix eyebrows inside dark sections**

`cumberland-clay` is also used for eyebrow text. On light backgrounds, black-on-white reads fine. But inside dark sections (`bg-cumberland-forest` = black), `text-cumberland-clay` = black-on-black → invisible.

Find every eyebrow that sits inside a dark-background section and change it to `text-cumberland-stone` (medium gray, readable on black):

```bash
grep -n "eyebrow text-cumberland-clay\|eyebrow.*text-cumberland-clay" src/components/*.astro
```

Expected matches: `GuideSection.astro`, `CTASection.astro`, `RecentWork.astro` (the "Your project" tile), and any other component with a dark band.

For each match, change `text-cumberland-clay` → `text-cumberland-stone` **only on eyebrows inside dark-background elements**. Leave eyebrows on light backgrounds unchanged (black-on-white is correct).

Example in `GuideSection.astro`:
```astro
<!-- Before -->
<p class="eyebrow text-cumberland-clay">Your print shop, since 2003</p>

<!-- After -->
<p class="eyebrow text-cumberland-stone">Your print shop, since 2003</p>
```

- [ ] **Step 4: Build to verify no broken token references**

```bash
npm run build
```

Expected: `25 page(s) built` with no errors.

- [ ] **Step 5: Spot-check visually with dev server**

```bash
npm run dev
```

Open `http://localhost:4321` and verify:
- Hero background is white, headline is black
- "Start Your Project" button is pure black (#111111) with white text — high contrast pop
- GuideSection dark band is black; eyebrow label is gray (stone), not invisible
- Eyebrow labels on light backgrounds ("Fresh from the shop", "Step 1 of 3") are black
- Borders and dividers are cool light gray, not warm beige

- [ ] **Step 6: Commit**

```bash
git add tailwind.config.mjs src/components/
git commit -m "feat: update brand colors to black/white/gray palette"
```

---

## Task 3: Create the Notion "Quote Requests" database

**Files:** None — Notion MCP / manual setup

- [ ] **Step 1: Find the Cumberland Signworks client page in Notion**

Open Notion. Navigate to the Cumberland Signworks client portal page. Copy the page ID from the URL (the UUID after the last `/` and before any `?`). This becomes the parent for the new database.

- [ ] **Step 2: Create the "Quote Requests" database as a child of that page**

Create a new database named **Quote Requests** with these properties:

| Property | Type | Notes |
|---|---|---|
| Name | title | Auto-set by Worker: "[Name] — [Types] — [Date]" |
| Contact | rich_text | Phone or email submitted |
| Organization | rich_text | Business / team / church |
| Project Type | multi_select | Options: Apparel, Signs, Vehicle Wraps, Print |
| Quantity | rich_text | Quantity/size field |
| Needed By | rich_text | Timeline |
| Artwork | checkbox | true if file was attached |
| Status | select | Options: New, Contacted, Quoted, Won, Lost (default: New) |
| Source | select | Options: Website form, Phone, Walk-in |
| Submitted | date | ISO timestamp |

- [ ] **Step 3: Copy the database ID**

Click ··· on the database → Copy link. The database ID is the UUID in the URL. Save it — this becomes `NOTION_DATABASE_ID`.

- [ ] **Step 4: Create a Notion integration**

Go to https://www.notion.so/my-integrations → New integration → name it **Vaktal Forms** → Internal. Copy the token (starts with `secret_`). Save it — this becomes `NOTION_API_KEY`.

- [ ] **Step 5: Connect the integration to the database**

Open the Quote Requests database → ··· → Connections → add Vaktal Forms.

- [ ] **Step 6: Verify the integration can write**

```bash
curl -s -X POST https://api.notion.com/v1/pages \
  -H "Authorization: Bearer secret_YOUR_TOKEN" \
  -H "Notion-Version: 2022-06-28" \
  -H "Content-Type: application/json" \
  -d '{
    "parent": { "database_id": "YOUR_DATABASE_ID" },
    "properties": {
      "Name": { "title": [{ "text": { "content": "Test entry — delete me" } }] },
      "Status": { "select": { "name": "New" } }
    }
  }' | jq '.id'
```

Expected: a UUID string. Delete the test entry from Notion.

---

## Task 4: Scaffold the Worker project

**Files:**
- Create: `workers/quote-handler/package.json`
- Create: `workers/quote-handler/tsconfig.json`
- Create: `workers/quote-handler/wrangler.toml`

- [ ] **Step 1: Create directories**

```bash
mkdir -p workers/quote-handler/src
```

- [ ] **Step 2: Create `workers/quote-handler/package.json`**

```json
{
  "name": "quote-handler",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "wrangler dev",
    "deploy": "wrangler deploy",
    "test": "vitest run"
  },
  "devDependencies": {
    "@cloudflare/workers-types": "^4.20240529.0",
    "typescript": "^5.5.2",
    "vitest": "^1.6.0",
    "wrangler": "^3.60.0"
  }
}
```

- [ ] **Step 3: Install dependencies**

```bash
cd workers/quote-handler && npm install
```

Expected: `node_modules/` created.

- [ ] **Step 4: Create `workers/quote-handler/tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "bundler",
    "lib": ["ES2022"],
    "types": ["@cloudflare/workers-types"],
    "strict": true,
    "noEmit": true
  },
  "include": ["src/**/*.ts"]
}
```

- [ ] **Step 5: Create `workers/quote-handler/wrangler.toml`**

```toml
name = "csw-quote-handler"
main = "src/index.ts"
compatibility_date = "2024-06-03"
compatibility_flags = ["nodejs_compat"]

[vars]
ALLOWED_ORIGIN = "https://cumberlandsignworks.com"

# Secrets (set via `wrangler secret put`):
# RESEND_API_KEY
# RESEND_FROM      — "Cumberland Signworks <forms@vaktal.com>"
# RESEND_TO        — hello@cumberlandsignworks.com
# NOTION_API_KEY
# NOTION_DATABASE_ID
# TURNSTILE_SECRET_KEY   (optional)
```

- [ ] **Step 6: Verify Wrangler sees the config**

```bash
cd workers/quote-handler && npx wrangler whoami
```

Expected: your Cloudflare account name. If not logged in: `npx wrangler login`.

- [ ] **Step 7: Commit**

```bash
git add workers/
git commit -m "feat: scaffold cloudflare worker for quote form"
```

---

## Task 5: Implement validate.ts

**Files:**
- Create: `workers/quote-handler/src/validate.ts`
- Create: `workers/quote-handler/src/index.test.ts`

- [ ] **Step 1: Write the failing test**

Create `workers/quote-handler/src/index.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { isHoneypotFilled } from './validate'

describe('isHoneypotFilled', () => {
  it('returns true when website field has a value', () => {
    const form = new FormData()
    form.set('website', 'http://spam.com')
    expect(isHoneypotFilled(form)).toBe(true)
  })

  it('returns false when website field is empty string', () => {
    const form = new FormData()
    form.set('website', '')
    expect(isHoneypotFilled(form)).toBe(false)
  })

  it('returns false when website field is absent', () => {
    const form = new FormData()
    expect(isHoneypotFilled(form)).toBe(false)
  })
})
```

- [ ] **Step 2: Run to verify it fails**

```bash
cd workers/quote-handler && npm test
```

Expected: FAIL — `Cannot find module './validate'`

- [ ] **Step 3: Create `workers/quote-handler/src/validate.ts`**

```typescript
export function isHoneypotFilled(form: FormData): boolean {
  const val = form.get('website')
  return typeof val === 'string' && val.length > 0
}

export async function verifyTurnstile(
  token: string,
  secretKey: string
): Promise<boolean> {
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ secret: secretKey, response: token }),
  })
  const data = await res.json() as { success: boolean }
  return data.success === true
}
```

- [ ] **Step 4: Run tests — expect PASS**

```bash
cd workers/quote-handler && npm test
```

Expected: 3 tests passing.

- [ ] **Step 5: Commit**

```bash
git add workers/quote-handler/src/
git commit -m "feat: add honeypot and turnstile validation"
```

---

## Task 6: Implement notion.ts

**Files:**
- Create: `workers/quote-handler/src/notion.ts`

- [ ] **Step 1: Create `workers/quote-handler/src/notion.ts`**

```typescript
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
```

- [ ] **Step 2: Commit**

```bash
git add workers/quote-handler/src/notion.ts
git commit -m "feat: add notion entry creation"
```

---

## Task 7: Implement email.ts

**Files:**
- Create: `workers/quote-handler/src/email.ts`

- [ ] **Step 1: Create `workers/quote-handler/src/email.ts`**

```typescript
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
```

- [ ] **Step 2: Commit**

```bash
git add workers/quote-handler/src/email.ts
git commit -m "feat: add resend email with artwork attachment support"
```

---

## Task 8: Implement index.ts (main Worker handler)

**Files:**
- Create: `workers/quote-handler/src/index.ts`

- [ ] **Step 1: Create `workers/quote-handler/src/index.ts`**

```typescript
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

    const fields: QuoteFields = {
      name: (form.get('name') as string) ?? '',
      contact: (form.get('contact') as string) ?? '',
      organization: (form.get('organization') as string) ?? '',
      projectTypes: form.getAll('project_type') as string[],
      quantity: (form.get('quantity') as string) ?? '',
      neededBy: (form.get('needed_by') as string) ?? '',
      hasArtwork:
        form.get('artwork') instanceof File &&
        (form.get('artwork') as File).size > 0,
    }

    if (!fields.name || !fields.contact) {
      return json({ ok: false, error: 'Name and contact are required.' }, 400, corsHeaders)
    }

    const artworkFile =
      form.get('artwork') instanceof File &&
      (form.get('artwork') as File).size > 0
        ? (form.get('artwork') as File)
        : null

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
```

- [ ] **Step 2: Type-check**

```bash
cd workers/quote-handler && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add workers/quote-handler/src/index.ts
git commit -m "feat: implement cloudflare worker main handler"
```

---

## Task 9: Local smoke test with wrangler dev

**Files:**
- Create: `workers/quote-handler/.dev.vars` (gitignored)
- Modify: `.gitignore`

- [ ] **Step 1: Add `.dev.vars` to .gitignore**

Add to the project root `.gitignore`:

```
workers/**/.dev.vars
```

```bash
git add .gitignore && git commit -m "chore: gitignore worker .dev.vars"
```

- [ ] **Step 2: Create `workers/quote-handler/.dev.vars`**

```
RESEND_API_KEY=re_your_key_here
RESEND_FROM=Cumberland Signworks <forms@vaktal.com>
RESEND_TO=hello@cumberlandsignworks.com
NOTION_API_KEY=secret_your_notion_token
NOTION_DATABASE_ID=your_database_id_here
```

- [ ] **Step 3: Start the Worker locally**

```bash
cd workers/quote-handler && npm run dev
```

Expected: `Ready on http://localhost:8787`

- [ ] **Step 4: Test a valid submission**

```bash
curl -s -X POST http://localhost:8787 \
  -F "name=Test Person" \
  -F "contact=test@example.com" \
  -F "organization=Crossville High" \
  -F "project_type=Apparel" \
  -F "quantity=50 t-shirts" \
  -F "needed_by=May 15" \
  -F "website=" | jq
```

Expected: `{"ok":true}`

Verify:
- Email arrives at `hello@cumberlandsignworks.com` with subject "New project request — Test Person, Crossville High"
- Notion database shows entry "Test Person — Apparel — [today]" with Status = New and a "View in Notion →" link in the email body

- [ ] **Step 5: Test honeypot discard**

```bash
curl -s -X POST http://localhost:8787 \
  -F "name=Spammer" \
  -F "contact=spam@spam.com" \
  -F "website=http://malicious.com" | jq
```

Expected: `{"ok":true}` — silent discard. No email, no Notion entry.

- [ ] **Step 6: Test missing required fields**

```bash
curl -s -X POST http://localhost:8787 \
  -F "name=" \
  -F "contact=" \
  -F "website=" | jq
```

Expected: `{"ok":false,"error":"Name and contact are required."}`

---

## Task 10: Update QuoteForm.astro

**Files:**
- Modify: `src/components/QuoteForm.astro`

The form switches from native POST to `fetch()`. The Formspree-specific `_next` and `_subject` hidden fields are removed. Inline success/error replaces the redirect.

- [ ] **Step 1: Replace the entire contents of `src/components/QuoteForm.astro`**

```astro
---
const endpoint = import.meta.env.PUBLIC_QUOTE_ENDPOINT ?? ''
const turnstileKey = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY
---

<form
  id="quote-form"
  method="POST"
  enctype="multipart/form-data"
  class="space-y-6"
  novalidate
>
  <fieldset class="space-y-2">
    <legend class="block text-sm font-semibold text-cumberland-ink">
      What kind of project? <span class="text-cumberland-clay">*</span>
    </legend>
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {['Apparel', 'Signs', 'Vehicle Wraps', 'Print'].map((type) => (
        <label class="cursor-pointer">
          <input type="checkbox" name="project_type" value={type} class="peer sr-only" />
          <span class="block text-center px-4 py-3 rounded-xl border-2 border-cumberland-mist bg-white text-sm font-medium transition-colors peer-checked:border-cumberland-forest peer-checked:bg-cumberland-forest peer-checked:text-white">
            {type}
          </span>
        </label>
      ))}
    </div>
  </fieldset>

  <div>
    <label for="quantity" class="block text-sm font-semibold text-cumberland-ink">Quantity / size</label>
    <input type="text" id="quantity" name="quantity"
      placeholder="e.g. 50 t-shirts, 4x8ft banner, full F-150 wrap"
      class="mt-2 w-full rounded-xl border-2 border-cumberland-mist bg-white px-4 py-3 focus:border-cumberland-forest focus:outline-none" />
  </div>

  <div>
    <label for="needed_by" class="block text-sm font-semibold text-cumberland-ink">When do you need it?</label>
    <input type="text" id="needed_by" name="needed_by"
      placeholder="e.g. season opener Sept 13 / ASAP / flexible"
      class="mt-2 w-full rounded-xl border-2 border-cumberland-mist bg-white px-4 py-3 focus:border-cumberland-forest focus:outline-none" />
  </div>

  <div>
    <label for="artwork" class="block text-sm font-semibold text-cumberland-ink">Got artwork? (optional)</label>
    <input type="file" id="artwork" name="artwork"
      accept=".jpg,.jpeg,.png,.pdf,.ai,.eps,.svg"
      class="mt-2 block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-cumberland-forest file:text-white hover:file:bg-cumberland-forest-dark" />
    <p class="mt-1 text-xs text-cumberland-stone">No artwork? No problem — we'll help you figure it out.</p>
  </div>

  <div class="grid sm:grid-cols-2 gap-4">
    <div>
      <label for="name" class="block text-sm font-semibold text-cumberland-ink">Name <span class="text-cumberland-clay">*</span></label>
      <input type="text" id="name" name="name" required
        class="mt-2 w-full rounded-xl border-2 border-cumberland-mist bg-white px-4 py-3 focus:border-cumberland-forest focus:outline-none" />
    </div>
    <div>
      <label for="organization" class="block text-sm font-semibold text-cumberland-ink">Business / Team / Church</label>
      <input type="text" id="organization" name="organization"
        class="mt-2 w-full rounded-xl border-2 border-cumberland-mist bg-white px-4 py-3 focus:border-cumberland-forest focus:outline-none" />
    </div>
  </div>

  <div>
    <label for="contact" class="block text-sm font-semibold text-cumberland-ink">Best phone or email <span class="text-cumberland-clay">*</span></label>
    <input type="text" id="contact" name="contact" required
      class="mt-2 w-full rounded-xl border-2 border-cumberland-mist bg-white px-4 py-3 focus:border-cumberland-forest focus:outline-none" />
  </div>

  <!-- Honeypot -->
  <input type="text" name="website" tabindex="-1" autocomplete="off"
    class="absolute left-[-9999px]" aria-hidden="true" />

  {turnstileKey && <div class="cf-turnstile" data-sitekey={turnstileKey} />}

  <p id="form-error"
    class="hidden rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm"
    role="alert">
  </p>

  <button type="submit" id="form-submit" class="btn-primary w-full text-base md:text-lg">
    Send My Project
  </button>

  <p class="text-xs text-cumberland-stone text-center">
    We reply within 24 hours, Mon–Fri. Most quotes go out the same day.
  </p>
</form>

<div id="form-success" class="hidden text-center py-8">
  <p class="font-display text-4xl tracking-tighter text-cumberland-forest">Got it.</p>
  <p class="mt-3 text-lg text-cumberland-stone">
    We got your project request. Mike or Sarah will reply within 24 hours.
  </p>
  <a href="/" class="mt-6 inline-block btn-ghost">Back to home →</a>
</div>

{turnstileKey && <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />}

<script define:vars={{ endpoint }}>
  const form = document.getElementById('quote-form')
  const successEl = document.getElementById('form-success')
  const errorEl = document.getElementById('form-error')
  const submitBtn = document.getElementById('form-submit')

  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    errorEl.classList.add('hidden')
    submitBtn.disabled = true
    submitBtn.textContent = 'Sending…'

    try {
      const res = await fetch(endpoint, { method: 'POST', body: new FormData(form) })
      const result = await res.json()

      if (result.ok) {
        form.classList.add('hidden')
        successEl.classList.remove('hidden')
      } else {
        errorEl.textContent = result.error ?? 'Something went wrong. Please try again or call us.'
        errorEl.classList.remove('hidden')
        submitBtn.disabled = false
        submitBtn.textContent = 'Send My Project'
      }
    } catch {
      errorEl.textContent = 'Could not reach the server. Please call us at (931) 707-0557.'
      errorEl.classList.remove('hidden')
      submitBtn.disabled = false
      submitBtn.textContent = 'Send My Project'
    }
  })
</script>
```

- [ ] **Step 2: Build to verify no errors**

```bash
npm run build
```

Expected: `25 page(s) built` with no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/QuoteForm.astro
git commit -m "feat: switch quote form to fetch with inline success/error state"
```

---

## Task 11: Deploy Worker and wire up env vars

**Files:**
- Modify: `.env.example`

- [ ] **Step 1: Update `.env.example`**

Replace the Formspree block and add the Worker block:

```bash
# ── Quote form (Cloudflare Worker) ────────────────────────────────────────────
# Set this in Cloudflare Pages env vars after deploying the Worker
PUBLIC_QUOTE_ENDPOINT=https://csw-quote-handler.YOUR_SUBDOMAIN.workers.dev

# Worker secrets — set via `wrangler secret put` in workers/quote-handler/
# RESEND_API_KEY        — from resend.com (free tier: 3,000 emails/month)
# RESEND_FROM           — "Cumberland Signworks <forms@vaktal.com>"
# RESEND_TO             — hello@cumberlandsignworks.com  (client inbox)
# NOTION_API_KEY        — from notion.so/my-integrations (Vaktal Forms integration)
# NOTION_DATABASE_ID    — from Quote Requests database URL
# TURNSTILE_SECRET_KEY  — from Cloudflare dashboard (optional, pairs with PUBLIC_TURNSTILE_SITE_KEY)
```

Remove these lines:
```
PUBLIC_FORMSPREE_ENDPOINT=
PUBLIC_CHECKLIST_FORM_ENDPOINT=
```

- [ ] **Step 2: Set Worker secrets**

```bash
cd workers/quote-handler
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put RESEND_FROM
npx wrangler secret put RESEND_TO
npx wrangler secret put NOTION_API_KEY
npx wrangler secret put NOTION_DATABASE_ID
```

Each command prompts interactively — paste the value and press Enter.

- [ ] **Step 3: Deploy the Worker**

```bash
cd workers/quote-handler && npm run deploy
```

Expected final lines:
```
Uploaded csw-quote-handler (X.XXs)
Published csw-quote-handler (X.XXs)
  https://csw-quote-handler.YOUR_SUBDOMAIN.workers.dev
```

Copy the Worker URL.

- [ ] **Step 4: Set `PUBLIC_QUOTE_ENDPOINT` in Cloudflare Pages**

Cloudflare dashboard → Pages → cumberlandsignworks → Settings → Environment variables → Production:

| Variable | Value |
|---|---|
| `PUBLIC_QUOTE_ENDPOINT` | `https://csw-quote-handler.YOUR_SUBDOMAIN.workers.dev` |

Trigger a new Pages deployment (push a commit or Retry deployment in the dashboard).

- [ ] **Step 5: End-to-end test on production**

Submit the live form at `https://cumberlandsignworks.com/start-your-project` with real data.

Verify all three outcomes:
1. Inline "Got it." success message appears on the page
2. Email arrives at `hello@cumberlandsignworks.com` with subject "New project request — [Name]" and a "View in Notion →" link
3. Notion Quote Requests database has a new entry with Status = New

- [ ] **Step 6: Final commit**

```bash
git add .env.example
git commit -m "chore: update env example for worker/notion/resend"
```

---

## Self-Review

**Spec coverage:**
- ✅ Form submits to Cloudflare Worker (no Formspree)
- ✅ Worker writes entry to Notion database in client's portal
- ✅ Email goes to **client's inbox** (`RESEND_TO` = `hello@cumberlandsignworks.com`) — not Eric's
- ✅ Artwork file attached to email via Resend attachments
- ✅ "View in Notion →" link in email body connects inbox to portal
- ✅ Honeypot spam filter (silent discard)
- ✅ Turnstile optional — Worker works without it
- ✅ Inline thank-you ("Got it.") — no page redirect
- ✅ Reusable across all Vaktal clients — all config is env-var driven
- ✅ Notion failure is non-fatal — email still goes out
- ✅ Email failure is fatal — returns 500 with call-us fallback message

**Placeholder scan:** None found — all code is complete and runnable.

**Type consistency:** `QuoteFields` defined once in `notion.ts`, imported by `index.ts` and `email.ts` throughout.
