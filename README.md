# Cumberland Signworks

New marketing site for **Cumberland Signworks, LLC** — Crossville, TN.

## Stack

- **Astro 4** — static, content-first
- **Tailwind CSS 3** with Cumberland brand tokens
- **MDX** for service and portfolio content collections
- **Decap CMS** at `/admin` for non-technical edits
- **astro-seo** + JSON-LD `LocalBusiness` for local SEO
- **Cloudflare Pages** (target host) with Cloudflare Turnstile for spam
- **Formspree** OR **Cloudflare Worker + Resend** for quote-form intake

## Read these first

- [`PROJECT.md`](./PROJECT.md) — full StoryBrand rewrite, BrandScript, PEACE soundbites, IA, copy, 7-week build plan.
- [`CLAUDE.md`](./CLAUDE.md) — operating manual for any Claude agent in this repo. Voice rules, BrandScript, PEACE soundbites, conventions.

Client-facing info (contact, scope, decisions log) lives separately at:
`/Users/deucen/Projects/clients/cumberlandsignworks/`

## Local development

```bash
# 1. Use the right Node
nvm use   # reads .nvmrc → Node 20

# 2. Install deps (pnpm preferred)
pnpm install

# 3. Copy env and fill in values
cp .env.example .env

# 4. Dev server
pnpm dev          # http://localhost:4321

# 5. Build + preview
pnpm build
pnpm preview

# 6. Type-check
pnpm typecheck

# 7. Format
pnpm format
```

## What's already built

- ✅ Astro + Tailwind + MDX scaffold (`astro.config.mjs`, `tailwind.config.mjs`, `tsconfig.json`)
- ✅ Brand tokens in Tailwind (`cumberland-forest` / `cumberland-clay` / `cumberland-cream` / etc. — DRAFT, lock with stakeholder)
- ✅ `BaseLayout` with SEO + `LocalBusiness` JSON-LD
- ✅ Header with sticky nav + dominant CTA
- ✅ Footer with NAP and social links
- ✅ Mobile-only sticky call bar (click-to-call + Start Your Project)
- ✅ Components: `Hero`, `ProblemSection`, `GuideSection`, `ThreeStepPlan`, `ServicesStrip`, `StakesSection`, `SuccessSection`, `ProofWall`, `CTASection`, `QuoteForm`
- ✅ Pages: `/` (homepage), `/start-your-project` (quote form), `/contact`
- ✅ Content Collections schema for services, portfolio, testimonials
- ✅ Sample service: `src/content/services/team-uniforms.mdx`
- ✅ Sample testimonials: `src/content/testimonials/featured.json`
- ✅ Decap CMS at `/admin` wired to all three collections
- ✅ `robots.txt`, `favicon.svg`, `.nvmrc`, `.editorconfig`, `.prettierrc`

## What's next (in priority order)

1. `git init` + push to GitHub (private repo)
2. `pnpm install` + verify `pnpm dev` boots clean
3. Photoshoot — replace hero photo placeholder + service photos
4. Lock brand color + typography pair, update `tailwind.config.mjs`
5. Pull 12–15 real testimonials → replace `featured.json`
6. Build remaining service pillar pages (`/apparel/`, `/signs/`, `/vehicle-wraps/`, `/print/`)
7. Build dynamic route at `src/pages/[category]/[slug].astro` to render service MDX
8. Local SEO landing pages (`/signs/crossville-tn`, `/vehicle-wraps/cumberland-county`, etc.)
9. Wire form endpoint (Formspree or Cloudflare Worker) + Turnstile site key
10. Lead magnet PDF + `/resources/checklist` landing page
11. About page with team bios
12. Portfolio gallery filterable by service type
13. Cloudflare Pages deploy + DNS cutover with 301s from legacy `/cswllc/shop/*` URLs
14. Submit sitemap to Google Search Console

## Repo layout

```
cumberland-signworks/
├── CLAUDE.md                  Voice + conventions for Claude agents
├── PROJECT.md                 Full strategy + build plan
├── README.md                  This file
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
├── package.json
├── .env.example
├── public/
│   ├── admin/                 Decap CMS
│   │   ├── config.yml
│   │   └── index.html
│   ├── favicon.svg
│   └── robots.txt
└── src/
    ├── components/            Reusable Astro components
    ├── content/               Content collections (services/, portfolio/, testimonials/)
    ├── layouts/               BaseLayout
    ├── pages/                 File-based routes
    └── styles/                global.css (Tailwind base + custom layers)
```

## Voice

The customer is the hero. Cumberland is the guide. One CTA: **Start Your Project**. Read [`CLAUDE.md`](./CLAUDE.md) before writing copy.
