# CLAUDE.md — Cumberland Signworks Build

> Operating manual for any Claude agent working in this repo. Read this in full before writing or editing copy, components, or pages.

---

## Project at a glance

- **Client:** Cumberland Signworks, LLC — Crossville, TN. Founded 2003. ~5–10 employees. 4.7★ across 95+ reviews.
- **What they do:** Signs, banners, t-shirts, hats, embroidery, vehicle wraps, storefront graphics, business cards.
- **Service area:** Crossville → Cumberland County → Upper Cumberland Plateau, TN.
- **Mission of this site:** Replace a legacy hosted-storefront with a fast, story-first marketing site that converts quote requests for two priority customer segments — schools/teams/churches/civic groups, and local small-business owners.
- **Stack:** Astro 4 + Tailwind 3 + MDX + Decap CMS. Hosted on Cloudflare Pages.
- **Primary CTA:** `Start Your Project` (one button, repeated everywhere).
- **Strategic source of truth:** `PROJECT.md` in this repo. Read it before making meaningful copy changes.
- **Client info:** Lives at `/Users/deucen/Projects/clients/cumberlandsignworks/PROJECT.md` (contact, scope, decisions log).

---

## The unbreakable rules

1. **The customer is the hero. Cumberland is the guide.** Never invert this. If a sentence describes Cumberland's accomplishments without tying them to a customer outcome, rewrite it.
2. **Confuse and you lose.** Cut every word that doesn't reduce cognitive load. Plain English. No jargon. No "synergistic." No "solutions."
3. **One dominant CTA.** Always `Start Your Project`. Repeat it. The transitional CTA is the free Project Checklist lead magnet — never compete with the direct CTA.
4. **Two priority customers, addressed equally.** Schools/teams/churches/civic groups (Hero A), and local SMB owners (Hero B). Never write copy that only speaks to one.
5. **Local trumps national.** Lean into Crossville, Upper Cumberland, Cumberland County, "23 years here." Online printers cannot say this.
6. **Speed is the product.** Fast quotes, fast turnarounds, fast site. Lighthouse ≥95 mobile. LCP < 1.8s. Every interaction should feel quick.

---

## The BrandScript (memorize this)

### Character
- **Hero A — "The Coach / Chair / Pastor / Principal":** on the hook for shirts, banners, signs, hats by a deadline. Wants the order to be **right, on time, and not embarrassing.**
- **Hero B — "The Local Owner":** needs storefront sign, vehicle wrap, branded crew apparel. Wants signage that **looks legit and gets them noticed.**
- Both want: **to look prepared, professional, and proud of how their team / business / event shows up.**

### Problem
- **External:** Need signs/shirts/wraps/banners by a deadline; online shops won't help; local shops flake.
- **Internal:** Anxious it won't show up in time. Embarrassed it'll look cheap. Overwhelmed by file specs and choices.
- **Philosophical:** Good people doing real work in their community deserve their branding to look as professional as they are.

### Guide (Cumberland)
- **Empathy:** *"We've watched coaches sweat over jerseys, pastors stress over VBS shirts, and owners panic over grand-opening signs for 23 years. You shouldn't have to wonder if your order will show up right."*
- **Authority:** 23 years in Crossville, 4.7★ / 95+ reviews, full in-house (screen print, embroidery, vinyl, digital, signage, full vehicle wraps), 1,000+ projects in the community.

### Plan (3 steps)
1. **Tell us what you need.** Call, message, or fill the form. Don't have artwork? We'll help.
2. **We design + quote — fast.** Free proof. Honest timeline. Clear price. Usually 24–48 hours.
3. **You get it on time, looking right.** Delivered or installed.

### Calls to Action
- **Direct:** `Start Your Project`
- **Transitional:** `Get the Free Project Checklist` (PDF lead magnet → 3-email nurture)

### Failure (stakes)
- Game day with shirts that didn't ship.
- A storefront sign that blends into every strip mall.
- A wrapped vehicle in the wrong shade of your brand color.
- Same money — for noticeably worse work.

### Success (the vision)
- Team runs out of the tunnel in matching, sharp uniforms.
- New sign goes up; friends text you photos.
- Wrapped truck *is* the marketing on every job site.
- Pastor emails: *"Got the shirts. The kids LOVE them."*

---

## The PEACE Soundbites (use these verbatim or as DNA)

| Stage | Soundbite |
|---|---|
| **P — Problem** | "Most print shops keep you waiting and leave you guessing. Online shops are worse — and they don't know your team, your town, or your timeline." |
| **E — Empathy** | "We've watched coaches sweat over jerseys, pastors stress over VBS shirts, and owners panic over grand-opening signs for 23 years. You shouldn't have to wonder if your order will show up right." |
| **A — Answer** | "Cumberland Signworks does signs, shirts, hats, banners, and full vehicle wraps under one roof in Crossville — with the design help, fast quotes, and rush-order grace your project actually needs." |
| **C — Change** | "You stop chasing vendors. You stop double-checking proofs at midnight. You start showing up looking like the most prepared person in the room." |
| **E — End Result** | "Game-day photos that pop. Storefronts people stop for. Trucks that work the room while you're working the job. Branding you're proud to put your name on." |

---

## The one-liner

> **"We help schools, teams, churches, and local businesses across the Upper Cumberland show up looking like pros — with signs, shirts, hats, and vehicle wraps designed and delivered fast, right here in Crossville."**

Use this on About hero, IG bio, email signature, voicemail script, and as fallback meta description.

---

## Voice DOs and DON'Ts

**DO**
- Talk to the customer in second person: *you, your team, your shop.*
- Use specific, concrete imagery: "the season opener is Friday," "the church bus needs new lettering."
- Lead with the customer's win, support with Cumberland's proof.
- Be warm, plainspoken, Tennessee-confident — not corporate, not folksy-cringe.
- Use real review verbatims wherever possible.

**DON'T**
- Open a section with "We are…" or "Cumberland Signworks is…"
- Use industry jargon ("DTG transfer," "CMYK separation") on marketing pages — keep that in `/resources/file-prep` where it earns its place.
- Use generic adjectives: "quality," "professional," "innovative," "unique."
- Hedge: "we strive to…", "we aim to…". Just say what you do.
- Stack multiple competing CTAs in a section. One direct + one transitional. Max.
- Use stock photos. If a real photo isn't ready, leave a clear `<!-- TODO: real photo -->` placeholder rather than ship stock.

---

## SB7 micro-pattern for every page (especially service pages)

Every service page (`/apparel/team-uniforms`, `/signs/storefront`, `/vehicle-wraps/full-wraps`, etc.) follows this shape:

1. **Hook headline** — names the customer's win, not the product. *"Uniforms your team is proud to wear."* not *"Custom Screen-Printed Team Apparel."*
2. **Problem block** — "Sound familiar?" — names 2–3 specific pains for that service.
3. **3-step plan** — same plan, restated for that context.
4. **Authority + proof** — service-specific testimonial, photo, or stat.
5. **Stakes mini-block** — what they lose if they pick wrong (one short paragraph).
6. **CTA section** — Start Your Project (direct) + Get the Checklist (transitional).

Reusable components live in `src/components/`. Compose pages from these — do not write one-off layouts unless intentionally departing from the pattern.

---

## Tech conventions

### File layout

```
src/
├── components/        Astro components, named in PascalCase (Hero.astro, ThreeStepPlan.astro)
├── content/           Content Collections (services/, portfolio/, testimonials/) — config in content/config.ts
├── layouts/           BaseLayout.astro and any page-shape variants
├── pages/             File-based routes; each page composes components, holds minimal logic
└── styles/            global.css only — everything else is Tailwind utility
public/
├── admin/             Decap CMS (index.html + config.yml)
└── images/            optimized images, placed by Astro Image during build
```

### Components
- One component, one job. Props are typed.
- All components must accept a `class` or `className` prop and merge it onto the root element so pages can override spacing without forking.
- No client-side JS unless necessary. If a component needs interactivity, prefer `<script>` islands with `is:inline` for tiny bits, or proper Astro client directives for larger ones.

### Tailwind
- Use the design tokens defined in `tailwind.config.mjs` (`cumberland-forest`, `cumberland-clay`, `cumberland-cream`, `cumberland-ink`, `cumberland-stone`, `cumberland-mist`).
- **Never** introduce a new hex color in markup. Add it to `tailwind.config.mjs` first.
- Mobile-first: write the small-screen styles, then layer `md:` / `lg:` modifiers.
- Container width: `max-w-6xl mx-auto px-6 lg:px-8` is the default page rail.

### Content Collections
- `services/` → MDX. Frontmatter: `title`, `slug`, `summary`, `heroImage`, `bullets[]`, `order`.
- `portfolio/` → MDX. Frontmatter: `title`, `client`, `serviceType`, `heroImage`, `gallery[]`, `date`.
- `testimonials/` → JSON array. Fields: `quote`, `name`, `role`, `service`, `source`.
- Add a new entry by dropping a file in the right folder — Astro picks it up. No code changes needed for content edits.

### SEO
- Every page passes `title` and `description` to `BaseLayout`.
- `LocalBusiness` JSON-LD is rendered in `BaseLayout` — do not duplicate per page.
- Service × geography pages live at `src/pages/[service]/[location].astro` (or as static MDX), each with unique copy. **No doorway pages.**

### Forms
- The quote form is the only form on the site. It posts to either Formspree or a Cloudflare Worker (env-driven). Anti-spam via Cloudflare Turnstile.
- After submit, show an inline thank-you that re-states the *fast* expectation: "We got it. Mike or Sarah will reply within 24 hours."

### Performance
- Images: always `<Image />` from `astro:assets`. Never `<img src="…">` to avoid layout shift.
- Fonts: self-hosted, `font-display: swap`. No Google Fonts CDN.
- No third-party tag managers in v1. If analytics is needed, use Cloudflare Web Analytics (no cookies, no banner).
- Click-to-call `tel:` link in mobile sticky bar — every page.

### Accessibility
- WCAG 2.1 AA color contrast minimum. Verify any new color combo against `cumberland-forest` and `cumberland-cream`.
- All interactive elements reachable by keyboard. Visible focus rings — do not strip `:focus-visible`.
- Alt text on every image. For decorative-only, use `alt=""`.

---

## Common tasks — how to handle

### "Add a new service page"
1. Create `src/content/services/<slug>.mdx` with frontmatter.
2. The dynamic route at `src/pages/[service]/[slug].astro` (when added) renders it.
3. Compose the SB7 micro-pattern (above) using existing components — do not write new layouts.

### "Write copy for a new section"
1. Open `PROJECT.md`. Skim §5 for the canonical voice and structure.
2. Open this file. Re-read the BrandScript and PEACE soundbites.
3. Draft. Customer in second person. Concrete. Plainspoken.
4. Pass the test: *Could a coach, pastor, or shop owner read this in 5 seconds and know what they get?* If not, cut.

### "Audit / brand review existing copy"
- Run it against the DOs / DON'Ts above.
- Verify: customer-as-hero, single CTA, no jargon, stakes named or implied, success painted.
- If a competitor (Modern D-Signs, Tennessee Wraps, online printers) could say it, rewrite until they couldn't.

### "Add a new component"
1. Check `src/components/` first — chances are something close exists.
2. Match the conventions: typed props, accepts `class`, no surprise side effects.
3. Document the prop shape at the top of the file as a JSDoc/TS comment.

---

## What's already done

- StoryBrand audit, BrandScript, PEACE soundbites, full website copy (in `PROJECT.md`)
- Site map (10-section IA)
- Tech stack locked: Astro + Tailwind + MDX + Decap CMS
- Hosting target: Cloudflare Pages
- Form intake design (6 fields max, Turnstile, Worker or Formspree)
- Local SEO architecture (service × geography pages)
- 7-week phased build plan

## What's open / decisions pending

- Lock primary phone (two listed across directories — confirm with owner)
- Lock hero brand color (working draft: forest green `#1F4E3D` + clay accent `#D97842`)
- Lock typography pair (working draft: Inter + Bebas Neue)
- Photoshoot scheduled / completed
- Testimonial verbatims pulled and permission granted (target 12–15)
- Owner / team bios for About page

---

## When in doubt

Open `PROJECT.md`. Then re-read this file. Then write the simplest, clearest version of the thing. **Clarity beats cleverness every time.**
