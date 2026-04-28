# Cumberland Signworks — Site Build & Deployment Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the remaining pages, routing, and content for the Cumberland Signworks Astro site, then deploy to Cloudflare Pages via GitHub.

**Architecture:** Astro 4 static site. Service pages use a dynamic `[slug].astro` route per category that reads from Astro Content Collections. A shared `ServicePageLayout.astro` component renders every service page in the SB7 micro-pattern. Deployment is Cloudflare Pages connected to a GitHub repo — push to `main` triggers automatic redeploy.

**Tech Stack:** Astro 4, Tailwind 3, MDX, Decap CMS, Cloudflare Pages, GitHub (gh CLI for repo creation).

---

## File Structure

**New files to create:**

```
src/
  components/
    ServicePageLayout.astro       # Reusable SB7 layout for all service pages
  pages/
    thank-you.astro               # Post-form submission confirmation
    apparel/
      index.astro                 # Apparel pillar page
      [slug].astro                # Dynamic renderer for apparel MDX entries
    signs/
      index.astro                 # Signs pillar page
      [slug].astro                # Dynamic renderer for signs MDX entries
    vehicle-wraps/
      index.astro                 # Vehicle Wraps pillar page
      [slug].astro                # Dynamic renderer for vehicle-wraps MDX entries
    print.astro                   # Print pillar page
    portfolio/
      index.astro                 # Portfolio listing
    about.astro                   # About page
    resources/
      checklist.astro             # Lead magnet landing page
      file-prep.astro             # File prep guide
  content/
    services/
      schools-churches.mdx
      business-branded.mdx
      hats-embroidery.mdx
      storefront.mdx
      yard-real-estate.mdx
      banners.mdx
      window-graphics.mdx
      full-wraps.mdx
      partial-lettering.mdx
      fleet.mdx
      print.mdx

**Files to modify:**
src/components/Header.astro         # Add mobile hamburger menu
src/pages/contact.astro             # Add Google Maps iframe
```

---

## Task 1: Git Init + GitHub Push

**Files:**
- Create: `.gitignore` (already exists — verify it covers `dist/`, `.env`, `node_modules/`)
- No new files needed

- [ ] **Step 1: Verify .gitignore covers sensitive files**

```bash
cat /Users/deucen/Projects/Github/cumberlandsignworks/.gitignore
```

Expected: should include `dist/`, `node_modules/`, `.env`, `.env.local`

- [ ] **Step 2: Initialize git repo**

```bash
cd /Users/deucen/Projects/Github/cumberlandsignworks
git init
git add .
git status
```

Expected: all project files listed as new files to be staged

- [ ] **Step 3: Create first commit**

```bash
git commit -m "feat: initial Astro site scaffold — homepage, components, design system"
```

Expected: `[main (root-commit) xxxxxxx] feat: initial Astro site scaffold...`

- [ ] **Step 4: Create GitHub repo and push**

```bash
gh repo create cumberlandsignworks --public --source=. --remote=origin --push
```

Expected: `✓ Created repository <user>/cumberlandsignworks on GitHub` then push output

If `gh auth` is needed first, run `gh auth login` interactively.

---

## Task 2: Cloudflare Pages Deployment

**Files:**
- No code changes needed — Cloudflare Pages builds from the repo

- [ ] **Step 1: Verify the build works locally**

```bash
cd /Users/deucen/Projects/Github/cumberlandsignworks
npm install
npm run build
```

Expected: `dist/` directory created, no errors. Note any TypeScript or build errors — fix them before continuing.

- [ ] **Step 2: Create Cloudflare Pages project via Wrangler (or dashboard)**

Option A — Wrangler CLI:
```bash
npx wrangler pages project create cumberland-signworks
```
Then deploy once manually:
```bash
npx wrangler pages deploy dist --project-name=cumberland-signworks
```

Option B — Cloudflare Dashboard (if Wrangler auth not set up):
1. Go to dash.cloudflare.com → Pages → Create a project
2. Connect to GitHub → select the `cumberlandsignworks` repo
3. Build command: `npm run build`
4. Build output directory: `dist`
5. Click Deploy

- [ ] **Step 3: Set environment variables on Cloudflare Pages**

In the Cloudflare Pages dashboard → Settings → Environment variables → Production:

```
PUBLIC_SITE_URL=https://cumberland-signworks.pages.dev
PUBLIC_BUSINESS_PHONE=+19317070557
PUBLIC_BUSINESS_PHONE_DISPLAY=(931) 707-0557
PUBLIC_BUSINESS_EMAIL=hello@cumberlandsignworks.com
PUBLIC_BUSINESS_ADDRESS=474 Hyder Ridge Rd, Crossville, TN 38555
PUBLIC_FORMSPREE_ENDPOINT=<get this from formspree.io — create a free form>
```

- [ ] **Step 4: Verify live deploy URL loads**

Open the `.pages.dev` URL in a browser. Expected: homepage renders with correct fonts, colors, and layout.

- [ ] **Step 5: Commit any build fix changes and push**

```bash
git add -A
git commit -m "fix: ensure build passes for Cloudflare Pages"
git push
```

---

## Task 3: Mobile Hamburger Nav

**Files:**
- Modify: `src/components/Header.astro`

- [ ] **Step 1: Replace Header.astro with mobile-ready version**

Replace the full contents of `src/components/Header.astro` with:

```astro
---
/**
 * Header — sticky top nav with mobile hamburger.
 * Single dominant CTA: Start Your Project.
 */
const phone = import.meta.env.PUBLIC_BUSINESS_PHONE_DISPLAY || '(931) 707-0557';
const phoneTel = import.meta.env.PUBLIC_BUSINESS_PHONE || '+19317070557';

const navLinks = [
  { label: 'Apparel', href: '/apparel' },
  { label: 'Signs', href: '/signs' },
  { label: 'Vehicle Wraps', href: '/vehicle-wraps' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'About', href: '/about' },
];
---

<header class="sticky top-0 z-40 bg-cumberland-cream/95 backdrop-blur border-b border-cumberland-mist">
  <div class="container-rail flex items-center justify-between gap-6 py-4">
    <a href="/" class="flex items-center gap-2 font-display text-2xl tracking-tighter">
      <span class="text-cumberland-forest">Cumberland</span>
      <span class="text-cumberland-clay">Signworks</span>
    </a>

    <!-- Desktop nav -->
    <nav class="hidden md:flex items-center gap-8 text-sm font-medium" aria-label="Primary">
      {
        navLinks.map((link) => (
          <a
            href={link.href}
            class="text-cumberland-ink hover:text-cumberland-forest transition-colors"
          >
            {link.label}
          </a>
        ))
      }
    </nav>

    <div class="flex items-center gap-3">
      <a
        href={`tel:${phoneTel}`}
        class="hidden lg:inline text-sm font-medium text-cumberland-ink hover:text-cumberland-forest"
      >
        {phone}
      </a>
      <a href="/start-your-project" class="btn-primary text-sm hidden md:inline-flex">
        Start Your Project
      </a>
      <!-- Mobile hamburger -->
      <button
        id="nav-toggle"
        class="md:hidden p-2 rounded-lg hover:bg-cumberland-mist"
        aria-label="Toggle navigation"
        aria-expanded="false"
        aria-controls="mobile-menu"
      >
        <svg id="icon-open" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <svg id="icon-close" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>

  <!-- Mobile menu -->
  <div
    id="mobile-menu"
    class="hidden md:hidden border-t border-cumberland-mist bg-cumberland-cream"
  >
    <nav class="container-rail py-4 flex flex-col gap-1" aria-label="Mobile">
      {
        navLinks.map((link) => (
          <a
            href={link.href}
            class="py-3 text-base font-medium text-cumberland-ink hover:text-cumberland-forest border-b border-cumberland-mist/60 last:border-0"
          >
            {link.label}
          </a>
        ))
      }
      <a href="/start-your-project" class="btn-primary mt-4 text-base text-center">
        Start Your Project
      </a>
      <a href={`tel:${phoneTel}`} class="mt-2 text-center text-sm text-cumberland-stone hover:text-cumberland-forest">
        {phone}
      </a>
    </nav>
  </div>
</header>

<script is:inline>
  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('mobile-menu');
  const iconOpen = document.getElementById('icon-open');
  const iconClose = document.getElementById('icon-close');

  toggle.addEventListener('click', () => {
    const isOpen = !menu.classList.contains('hidden');
    menu.classList.toggle('hidden', isOpen);
    toggle.setAttribute('aria-expanded', String(!isOpen));
    iconOpen.classList.toggle('hidden', !isOpen);
    iconClose.classList.toggle('hidden', isOpen);
  });
</script>
```

- [ ] **Step 2: Verify build still passes**

```bash
npm run build
```

Expected: exits 0, no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/Header.astro
git commit -m "feat: add mobile hamburger navigation"
git push
```

---

## Task 4: Thank-You Page + Form Redirect

**Files:**
- Create: `src/pages/thank-you.astro`
- Modify: `src/components/QuoteForm.astro` (add redirect on success)

- [ ] **Step 1: Create thank-you page**

Create `src/pages/thank-you.astro`:

```astro
---
import BaseLayout from '@layouts/BaseLayout.astro';
---

<BaseLayout
  title="Got it! — Cumberland Signworks"
  description="We received your project request. Expect a reply within 24 hours."
  noIndex={true}
>
  <section class="section bg-cumberland-cream min-h-[60vh] flex items-center">
    <div class="container-rail max-w-2xl text-center">
      <p class="font-display text-6xl text-cumberland-clay">✓</p>
      <h1 class="mt-6 text-cumberland-ink">We got it.</h1>
      <p class="mt-6 text-xl leading-relaxed text-cumberland-stone">
        Mike or Sarah will reply within 24 hours — Mon–Fri. Most quotes go out
        the same day.
      </p>
      <p class="mt-4 text-cumberland-stone">
        Need it faster? Call us directly:
        <a
          href={`tel:${import.meta.env.PUBLIC_BUSINESS_PHONE || '+19317070557'}`}
          class="text-cumberland-forest font-semibold hover:underline"
        >
          {import.meta.env.PUBLIC_BUSINESS_PHONE_DISPLAY || '(931) 707-0557'}
        </a>
      </p>
      <div class="mt-10 flex flex-wrap justify-center gap-4">
        <a href="/" class="btn-secondary">Back to home</a>
        <a href="/portfolio" class="btn-ghost">See our work →</a>
      </div>
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 2: Wire Formspree endpoint + redirect in QuoteForm**

In `src/components/QuoteForm.astro`, add a hidden `_next` input inside the `<form>` tag (Formspree uses this to redirect after submission):

After the opening `<form ...>` tag, before the first `<fieldset>`, add:

```astro
  {/* Formspree redirect — points to thank-you page after submission */}
  <input type="hidden" name="_next" value={`${import.meta.env.PUBLIC_SITE_URL || 'https://cumberlandsignworks.com'}/thank-you`} />
  <input type="hidden" name="_subject" value="New Project Request — Cumberland Signworks" />
```

- [ ] **Step 3: Verify build passes**

```bash
npm run build
```

Expected: `dist/thank-you/index.html` is generated, exits 0.

- [ ] **Step 4: Commit**

```bash
git add src/pages/thank-you.astro src/components/QuoteForm.astro
git commit -m "feat: add thank-you page and Formspree redirect wiring"
git push
```

---

## Task 5: ServicePageLayout Component

This layout wraps every service page MDX in the SB7 micro-pattern shell.

**Files:**
- Create: `src/components/ServicePageLayout.astro`

- [ ] **Step 1: Create ServicePageLayout.astro**

Create `src/components/ServicePageLayout.astro`:

```astro
---
/**
 * ServicePageLayout — SB7 shell for all service pages.
 * Wraps MDX content with BaseLayout + header context + CTA footer.
 *
 * Props:
 *   title       — page title (also used as <title>)
 *   summary     — meta description
 *   category    — 'apparel' | 'signs' | 'vehicle-wraps' | 'print'
 *   bullets     — feature bullets shown in sidebar (optional)
 *   class       — additional classes on content wrapper
 */
import BaseLayout from '@layouts/BaseLayout.astro';
import CTASection from '@components/CTASection.astro';

interface Props {
  title: string;
  summary: string;
  category: string;
  bullets?: string[];
  class?: string;
}

const { title, summary, category, bullets = [], class: className } = Astro.props;

const categoryLabels: Record<string, string> = {
  apparel: 'Apparel & Embroidery',
  signs: 'Signs & Banners',
  'vehicle-wraps': 'Vehicle Wraps',
  print: 'Business Print',
};

const categoryHref: Record<string, string> = {
  apparel: '/apparel',
  signs: '/signs',
  'vehicle-wraps': '/vehicle-wraps',
  print: '/print',
};
---

<BaseLayout title={`${title} — Cumberland Signworks`} description={summary}>
  <!-- Breadcrumb -->
  <nav class="bg-cumberland-mist/40 border-b border-cumberland-mist" aria-label="Breadcrumb">
    <div class="container-rail py-3 text-sm text-cumberland-stone flex gap-2 items-center">
      <a href="/" class="hover:text-cumberland-forest">Home</a>
      <span aria-hidden="true">›</span>
      <a href={categoryHref[category] ?? '/'} class="hover:text-cumberland-forest">
        {categoryLabels[category] ?? category}
      </a>
      <span aria-hidden="true">›</span>
      <span class="text-cumberland-ink">{title}</span>
    </div>
  </nav>

  <article class={`section bg-cumberland-cream ${className ?? ''}`}>
    <div class="container-rail grid gap-12 lg:grid-cols-12">
      <!-- Main MDX content -->
      <div class="lg:col-span-8 prose prose-lg max-w-none
        prose-headings:font-display prose-headings:tracking-tighter
        prose-h1:text-4xl prose-h1:md:text-6xl prose-h1:leading-[0.95] prose-h1:text-cumberland-ink
        prose-h2:text-3xl prose-h2:text-cumberland-ink
        prose-h3:text-2xl prose-h3:text-cumberland-ink
        prose-p:text-cumberland-stone prose-p:leading-relaxed
        prose-li:text-cumberland-stone
        prose-strong:text-cumberland-ink
        prose-a:text-cumberland-forest prose-a:no-underline hover:prose-a:underline">
        <slot />
      </div>

      <!-- Sidebar: bullets + CTA -->
      <aside class="lg:col-span-4">
        <div class="sticky top-24 space-y-6">
          {bullets.length > 0 && (
            <div class="rounded-3xl bg-white border border-cumberland-mist p-8">
              <p class="eyebrow">What's included</p>
              <ul class="mt-4 space-y-3">
                {bullets.map((b) => (
                  <li class="flex gap-3 text-sm text-cumberland-ink">
                    <span class="text-cumberland-clay shrink-0 mt-0.5" aria-hidden="true">✓</span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div class="rounded-3xl bg-cumberland-forest text-cumberland-cream p-8">
            <p class="font-display text-2xl tracking-tighter">Ready to start?</p>
            <p class="mt-3 text-sm text-cumberland-mist">
              Free proof. Fast quote. Usually within 24–48 hours.
            </p>
            <a href="/start-your-project" class="btn bg-cumberland-clay text-white hover:bg-cumberland-clay-dark mt-6 w-full text-center block">
              Start Your Project
            </a>
            <p class="mt-4 text-xs text-cumberland-mist text-center">
              Or call <a href={`tel:${import.meta.env.PUBLIC_BUSINESS_PHONE || '+19317070557'}`} class="font-semibold hover:text-white">
                {import.meta.env.PUBLIC_BUSINESS_PHONE_DISPLAY || '(931) 707-0557'}
              </a>
            </p>
          </div>
        </div>
      </aside>
    </div>
  </article>

  <CTASection />
</BaseLayout>
```

- [ ] **Step 2: Verify build passes**

```bash
npm run build
```

Expected: exits 0, no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/ServicePageLayout.astro
git commit -m "feat: add ServicePageLayout component for SB7 service pages"
git push
```

---

## Task 6: Apparel Pillar Page + Dynamic Route

**Files:**
- Create: `src/pages/apparel/index.astro`
- Create: `src/pages/apparel/[slug].astro`

- [ ] **Step 1: Create the Apparel pillar page**

Create `src/pages/apparel/index.astro`:

```astro
---
import BaseLayout from '@layouts/BaseLayout.astro';
import { getCollection } from 'astro:content';
import CTASection from '@components/CTASection.astro';
import ThreeStepPlan from '@components/ThreeStepPlan.astro';

const services = await getCollection('services', ({ data }) => data.category === 'apparel');
services.sort((a, b) => a.data.order - b.data.order);
---

<BaseLayout
  title="Custom Apparel & Embroidery — Cumberland Signworks Crossville TN"
  description="Custom t-shirts, team uniforms, hats, polos, and embroidery for schools, teams, churches, and local businesses across the Upper Cumberland. Fast quotes, rush orders welcome."
>
  <section class="section bg-cumberland-cream">
    <div class="container-rail max-w-4xl">
      <p class="eyebrow">Apparel & Embroidery</p>
      <h1 class="mt-4 text-cumberland-ink">
        Your team, crew, or group — <span class="text-cumberland-forest">dressed right.</span>
      </h1>
      <p class="mt-6 text-xl leading-relaxed text-cumberland-stone">
        Screen printing, embroidery, DTG, and custom headwear — all in-house in Crossville, TN.
        Schools, leagues, churches, businesses, and everyone in between.
      </p>
      <div class="mt-8 flex flex-wrap gap-4">
        <a href="/start-your-project" class="btn-primary">Start Your Project</a>
        <a href="/contact" class="btn-secondary">Talk to us first</a>
      </div>
    </div>
  </section>

  <section class="section bg-cumberland-mist/40">
    <div class="container-rail">
      <p class="eyebrow">What we make</p>
      <h2 class="mt-4 text-cumberland-ink">Apparel services</h2>
      <ul class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {services.map((service) => (
          <li>
            <a
              href={`/apparel/${service.slug}`}
              class="group block h-full rounded-3xl bg-white p-8 border border-cumberland-mist transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <p class="font-display text-2xl text-cumberland-ink leading-tight group-hover:text-cumberland-forest">
                {service.data.title}
              </p>
              <p class="mt-3 text-cumberland-stone">{service.data.summary}</p>
              {service.data.bullets.length > 0 && (
                <ul class="mt-4 space-y-1">
                  {service.data.bullets.slice(0, 3).map((b) => (
                    <li class="flex gap-2 text-sm text-cumberland-stone">
                      <span class="text-cumberland-clay" aria-hidden="true">✓</span>
                      {b}
                    </li>
                  ))}
                </ul>
              )}
              <p class="mt-6 text-sm font-semibold text-cumberland-clay">Learn more →</p>
            </a>
          </li>
        ))}
      </ul>
    </div>
  </section>

  <ThreeStepPlan />
  <CTASection />
</BaseLayout>
```

- [ ] **Step 2: Create the dynamic apparel service page route**

Create `src/pages/apparel/[slug].astro`:

```astro
---
import { getCollection } from 'astro:content';
import ServicePageLayout from '@components/ServicePageLayout.astro';

export async function getStaticPaths() {
  const entries = await getCollection('services', ({ data }) => data.category === 'apparel');
  return entries.map((entry) => ({
    params: { slug: entry.slug },
    props: { entry },
  }));
}

const { entry } = Astro.props;
const { Content } = await entry.render();
---

<ServicePageLayout
  title={entry.data.title}
  summary={entry.data.summary}
  category={entry.data.category}
  bullets={entry.data.bullets}
>
  <Content />
</ServicePageLayout>
```

- [ ] **Step 3: Verify build — confirms team-uniforms route is generated**

```bash
npm run build
```

Expected: `dist/apparel/index.html` and `dist/apparel/team-uniforms/index.html` generated. Exits 0.

- [ ] **Step 4: Commit**

```bash
git add src/pages/apparel/
git commit -m "feat: add apparel pillar page and dynamic service routes"
git push
```

---

## Task 7: Remaining Apparel Service MDX Content

**Files:**
- Create: `src/content/services/schools-churches.mdx`
- Create: `src/content/services/business-branded.mdx`
- Create: `src/content/services/hats-embroidery.mdx`

- [ ] **Step 1: Create schools-churches.mdx**

Create `src/content/services/schools-churches.mdx`:

```mdx
---
title: Schools, Churches & Civic Groups
slug: schools-churches
summary: Shirts, banners, hats, and event apparel for organizations that need everything right — and on time.
order: 20
category: apparel
bullets:
  - Bulk pricing for full rosters and groups
  - Rush orders for fundraisers and events
  - No artwork? We'll help you design it
  - Screen print, embroidery, and DTG in-house
---

# Your organization deserves to look like it has its act together.

Whether it's spirit shirts for the school fundraiser, VBS tees for 200 kids, or matching polos for the volunteer team — you've got a deadline and a group counting on you. That's exactly what we're built for.

## Sound familiar?

- You're three weeks from the event and still waiting on a proof from the last shop.
- The colors were off and nobody at the national chain would fix it.
- You need shirts, banners, *and* lanyards — but that means three different vendors.

Not anymore.

## How it works

1. **Tell us about your group.** Size, colors, date, and what you're making. A sketch or a Pinterest image is fine.
2. **We design and quote — fast.** Free proof. Honest timeline. Clear price. Usually 24–48 hours.
3. **You get it on time, looking right.** Delivered to the school, church, or event site.

## What we make for groups

- Spirit shirts and fundraiser tees
- Staff and volunteer polos
- VBS and summer camp t-shirts
- Youth group and mission trip shirts
- Banners and event signage (ask about bundles)
- Custom hats and headwear

## Why organizations come back

We've printed for schools, churches, civic leagues, booster clubs, and nonprofits across the Upper Cumberland for 23 years. Repeat customers are our majority — because when we say it'll be there, it is.

4.7 stars · 95+ reviews · Crossville, TN
```

- [ ] **Step 2: Create business-branded.mdx**

Create `src/content/services/business-branded.mdx`:

```mdx
---
title: Business Branded Apparel
slug: business-branded
summary: Crew shirts, polos, hoodies, and branded gear that makes your team look like a team — not a pickup crew.
order: 30
category: apparel
bullets:
  - Your logo, your colors, your brand
  - Screen print, embroidery, and DTG
  - Polos, hoodies, jackets, and tees
  - Small runs to full-crew orders
---

# Your crew should look like your brand walks with them.

First impressions happen on job sites, in waiting rooms, and at the counter. Branded apparel tells every customer: this team takes their work seriously.

## Sound familiar?

- Half the crew is in plain shirts, the other half in mismatched old polos.
- The embroidered logo from the last shop looked amateurish on the actual shirt.
- You want to order 12 shirts — but most places have 24-piece minimums.

## How it works

1. **Send us your logo and tell us what you need.** Don't have a vector file? Send us what you have — we'll sort it.
2. **We design and quote — fast.** Free proof, clear price, honest timeline.
3. **Your crew picks up looking like a unit.** Delivered or ready for pickup in Crossville.

## What we make for businesses

- Screen-printed crew tees
- Embroidered polos and button-downs
- Zip-up and pullover hoodies
- High-vis and workwear with your logo
- Branded hats and caps

## Small shop or big crew — we handle both

No run too small, no crew too large. We've done 6-piece polo orders for boutique shops and 200-piece tee runs for regional contractors. Same attention, same turnaround.
```

- [ ] **Step 3: Create hats-embroidery.mdx**

Create `src/content/services/hats-embroidery.mdx`:

```mdx
---
title: Hats & Embroidery
slug: hats-embroidery
summary: Custom embroidered hats, caps, and beanies — plus embroidery on any garment you bring in or order through us.
order: 40
category: apparel
bullets:
  - In-house embroidery — no outsourcing
  - Structured and unstructured caps
  - Beanies, bucket hats, visors
  - Bring your own garment or order through us
---

# A well-embroidered hat is the logo on its own.

People wear hats everywhere. A clean, well-placed embroidered logo on a structured cap is more advertising per dollar than most campaigns.

## Sound familiar?

- You got hats back from the last shop and the logo was placed crooked or the stitches were loose.
- You have a stack of garments and a logo — you just need someone local to embroider them.
- You want hats for the whole team but can't find a shop that does small runs.

## How it works

1. **Tell us what you need.** Hat style, quantity, logo, and any color preferences.
2. **We quote and digitize — fast.** Free proof, one-time digitizing fee on first run, free after that.
3. **You get hats that look right.** Tight stitches, correct placement, colors matched.

## What we embroider

- Structured baseball caps (snap, fitted, flex)
- Unstructured dad hats
- Beanies and knit caps
- Bucket hats and visors
- Polos, jackets, bags — bring your garment in

## Done in-house — no middleman

Our embroidery machine is in the same building as our screen printing press. When your design gets digitized here, we know exactly how it'll look on the finished garment — and we stand behind it.
```

- [ ] **Step 4: Verify all three new MDX files build correctly**

```bash
npm run build
```

Expected: `dist/apparel/schools-churches/`, `dist/apparel/business-branded/`, `dist/apparel/hats-embroidery/` directories generated. Exits 0.

- [ ] **Step 5: Commit**

```bash
git add src/content/services/schools-churches.mdx src/content/services/business-branded.mdx src/content/services/hats-embroidery.mdx
git commit -m "feat: add apparel service content — schools-churches, business-branded, hats-embroidery"
git push
```

---

## Task 8: Signs Pillar Page + Dynamic Route

**Files:**
- Create: `src/pages/signs/index.astro`
- Create: `src/pages/signs/[slug].astro`

- [ ] **Step 1: Create Signs pillar page**

Create `src/pages/signs/index.astro`:

```astro
---
import BaseLayout from '@layouts/BaseLayout.astro';
import { getCollection } from 'astro:content';
import CTASection from '@components/CTASection.astro';
import ThreeStepPlan from '@components/ThreeStepPlan.astro';

const services = await getCollection('services', ({ data }) => data.category === 'signs');
services.sort((a, b) => a.data.order - b.data.order);
---

<BaseLayout
  title="Custom Signs & Banners — Cumberland Signworks Crossville TN"
  description="Storefront signs, yard signs, banners, window graphics, and more — designed and installed in Crossville, TN. 23 years. Fast quotes. Rush orders welcome."
>
  <section class="section bg-cumberland-cream">
    <div class="container-rail max-w-4xl">
      <p class="eyebrow">Signs & Banners</p>
      <h1 class="mt-4 text-cumberland-ink">
        A sign that stops people. <span class="text-cumberland-forest">Not blends in.</span>
      </h1>
      <p class="mt-6 text-xl leading-relaxed text-cumberland-stone">
        Yard signs, storefronts, window graphics, banners, and real estate signs —
        designed and produced in Crossville. Free proof. Fast turnaround.
      </p>
      <div class="mt-8 flex flex-wrap gap-4">
        <a href="/start-your-project" class="btn-primary">Start Your Project</a>
        <a href="/contact" class="btn-secondary">Talk to us first</a>
      </div>
    </div>
  </section>

  <section class="section bg-cumberland-mist/40">
    <div class="container-rail">
      <p class="eyebrow">What we make</p>
      <h2 class="mt-4 text-cumberland-ink">Sign services</h2>
      <ul class="mt-10 grid gap-6 sm:grid-cols-2">
        {services.map((service) => (
          <li>
            <a
              href={`/signs/${service.slug}`}
              class="group block h-full rounded-3xl bg-white p-8 border border-cumberland-mist transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <p class="font-display text-2xl text-cumberland-ink leading-tight group-hover:text-cumberland-forest">
                {service.data.title}
              </p>
              <p class="mt-3 text-cumberland-stone">{service.data.summary}</p>
              {service.data.bullets.length > 0 && (
                <ul class="mt-4 space-y-1">
                  {service.data.bullets.slice(0, 3).map((b) => (
                    <li class="flex gap-2 text-sm text-cumberland-stone">
                      <span class="text-cumberland-clay" aria-hidden="true">✓</span>
                      {b}
                    </li>
                  ))}
                </ul>
              )}
              <p class="mt-6 text-sm font-semibold text-cumberland-clay">Learn more →</p>
            </a>
          </li>
        ))}
      </ul>
    </div>
  </section>

  <ThreeStepPlan />
  <CTASection />
</BaseLayout>
```

- [ ] **Step 2: Create the dynamic signs service route**

Create `src/pages/signs/[slug].astro`:

```astro
---
import { getCollection } from 'astro:content';
import ServicePageLayout from '@components/ServicePageLayout.astro';

export async function getStaticPaths() {
  const entries = await getCollection('services', ({ data }) => data.category === 'signs');
  return entries.map((entry) => ({
    params: { slug: entry.slug },
    props: { entry },
  }));
}

const { entry } = Astro.props;
const { Content } = await entry.render();
---

<ServicePageLayout
  title={entry.data.title}
  summary={entry.data.summary}
  category={entry.data.category}
  bullets={entry.data.bullets}
>
  <Content />
</ServicePageLayout>
```

- [ ] **Step 3: Verify build passes**

```bash
npm run build
```

Expected: `dist/signs/index.html` generated. Exits 0. (Sign detail pages will generate once content MDX is added in Task 9.)

- [ ] **Step 4: Commit**

```bash
git add src/pages/signs/
git commit -m "feat: add signs pillar page and dynamic service routes"
git push
```

---

## Task 9: Signs Service MDX Content

**Files:**
- Create: `src/content/services/storefront.mdx`
- Create: `src/content/services/yard-real-estate.mdx`
- Create: `src/content/services/banners.mdx`
- Create: `src/content/services/window-graphics.mdx`

- [ ] **Step 1: Create storefront.mdx**

Create `src/content/services/storefront.mdx`:

```mdx
---
title: Storefront Signs
slug: storefront
summary: Channel letters, monument signs, aluminum panels, and illuminated storefront signage for Crossville businesses.
order: 10
category: signs
bullets:
  - Channel letters and dimensional signs
  - Aluminum panel and ACM signs
  - Illuminated and non-illuminated options
  - Design + fabrication + installation
---

# A storefront that stops people before they even read the name.

Your sign is working 24/7 whether you're open or not. It's the first impression, the landmark for new customers, and the statement that says "we're serious about our business."

## Sound familiar?

- Your storefront still has the last tenant's sign — or a blank facade.
- You got quotes for a new sign and they were all confusing, vague, or way too expensive.
- You want something that looks professional, not like a banner zip-tied to the awning.

## How it works

1. **Tell us your vision.** Colors, style, any brand guidelines. We'll bring ideas if you don't have them.
2. **We design and quote — fast.** Free proof, fabrication plan, install quote all together.
3. **Your sign goes up looking right.** Installed by our team — no subcontractors on your job.

## What we make for storefronts

- Dimensional channel letters (individual letters, backlit or face-lit)
- Aluminum composite (ACM) sign panels
- Monument and post signs
- Cabinet and box signs
- Awning lettering and graphics

## Why local businesses trust us for signage

We've put up signs on storefronts all across Crossville and Cumberland County since 2003. We know the permit landscape, the landlord questions, and the local codes — because this is our town too.
```

- [ ] **Step 2: Create yard-real-estate.mdx**

Create `src/content/services/yard-real-estate.mdx`:

```mdx
---
title: Yard Signs & Real Estate Signs
slug: yard-real-estate
summary: Durable corrugated yard signs, H-frame wire stakes, and real estate rider signs — fast turnaround, bulk pricing available.
order: 20
category: signs
bullets:
  - Full-color corrugated plastic (coroplast)
  - Wire H-frame stakes included
  - Real estate riders and directionals
  - Bulk pricing for large orders
---

# Yard signs that actually get seen.

Whether you're running for school board or listing 20 houses this month, yard signs do one job: put your name in front of passing traffic. We make them fast, bright, and durable.

## Sound familiar?

- You ordered signs online, they arrived wrong, and there was no one to call.
- You need 50 signs for a campaign by Friday — and it's Tuesday.
- The print on the last set faded in two months.

## How it works

1. **Send your artwork or just tell us what you need.** Size, quantity, design, deadline.
2. **We proof and print — fast.** Most standard yard sign orders turn in 2–3 business days.
3. **You get durable, color-accurate signs.** With H-frame stakes, ready to go in the ground.

## What we make

- 18" × 24" and 24" × 36" corrugated plastic yard signs
- Custom sizes on request
- Wire H-frame and fold-over stakes
- Real estate riders (6" × 24" name bars)
- Directional arrow signs
- Contractors, political campaigns, grand openings, events

## Rush orders welcome

Need them Thursday? Call us. We've run yard sign orders for campaigns, grand openings, and auction events on tight timelines more times than we can count.
```

- [ ] **Step 3: Create banners.mdx**

Create `src/content/services/banners.mdx`:

```mdx
---
title: Banners & Event Signs
slug: banners
summary: Vinyl banners, step-and-repeat backdrops, and event signage — printed and hemmed in Crossville, ready for your next event.
order: 30
category: signs
bullets:
  - Heavy-duty 13 oz vinyl
  - Hemmed edges and grommets
  - Custom sizes — no standard limitations
  - Rush turnaround available
---

# Your event deserves a backdrop that doesn't look like a bedsheet.

Banners are the first thing people photograph at events, the thing in every group photo, and the thing that tells attendees they're in the right place. We make them look like they were made on purpose.

## Sound familiar?

- The banner arrived and the colors looked nothing like your brand.
- The grommets popped out by noon on event day.
- The online shop charged you extra for every grommet and the edges frayed in the wind.

## How it works

1. **Tell us the size, what it says, and when you need it.** Upload your logo or design.
2. **We proof it and get it on press — fast.** Most banners print and ship within 2–3 business days.
3. **You get a banner that survives the event.** Hemmed, grommeted, ready to hang.

## What we make

- Step-and-repeat / photo backdrop banners
- Vinyl event and trade-show banners (any size)
- Horizontal and vertical formats
- Outdoor-rated, UV and weather resistant
- Retractable banner stands (ask about rentals)
- Indoor fabric banners

## Custom sizes, always

We don't force you into standard sizes. Tell us where it's hanging and we'll size it right.
```

- [ ] **Step 4: Create window-graphics.mdx**

Create `src/content/services/window-graphics.mdx`:

```mdx
---
title: Window & Door Graphics
slug: window-graphics
summary: Vinyl window graphics, perforated see-through film, hours decals, and frosted privacy film for storefronts and offices.
order: 40
category: signs
bullets:
  - Opaque vinyl and perforated see-through
  - Hours and contact decals
  - Frosted privacy film
  - Design included
---

# Turn your windows into marketing space.

Every square foot of glass facing the street is a billboard you're already paying for. Window graphics put your brand, your hours, your products, and your phone number right where people are looking.

## Sound familiar?

- Your windows are just…windows. No branding, no info, no invitation to come in.
- You've seen shops with beautiful frosted logos and wondered how much it costs.
- The hours sticker from the last owner is still on the door.

## How it works

1. **Tell us what you want on the glass.** Logo, hours, graphics, or all three.
2. **We design and proof — fast.** We measure your windows, design to fit, and show you before we print.
3. **We install it.** No bubbles, no crooked text, no mess.

## What we apply to windows

- Full-coverage vinyl wraps and spot graphics
- Perforated one-way see-through film (see out, not in)
- Frosted privacy film and etch-look vinyl
- Business hours and contact decals
- Seasonal promotional graphics (removable)
- Door lettering and entry decals
```

- [ ] **Step 5: Verify all four sign pages build**

```bash
npm run build
```

Expected: `dist/signs/storefront/`, `dist/signs/yard-real-estate/`, `dist/signs/banners/`, `dist/signs/window-graphics/` directories present. Exits 0.

- [ ] **Step 6: Commit**

```bash
git add src/content/services/storefront.mdx src/content/services/yard-real-estate.mdx src/content/services/banners.mdx src/content/services/window-graphics.mdx
git commit -m "feat: add signs service content — storefront, yard signs, banners, window graphics"
git push
```

---

## Task 10: Vehicle Wraps Pillar Page + Dynamic Route

**Files:**
- Create: `src/pages/vehicle-wraps/index.astro`
- Create: `src/pages/vehicle-wraps/[slug].astro`

- [ ] **Step 1: Create Vehicle Wraps pillar page**

Create `src/pages/vehicle-wraps/index.astro`:

```astro
---
import BaseLayout from '@layouts/BaseLayout.astro';
import { getCollection } from 'astro:content';
import CTASection from '@components/CTASection.astro';
import ThreeStepPlan from '@components/ThreeStepPlan.astro';

const services = await getCollection('services', ({ data }) => data.category === 'vehicle-wraps');
services.sort((a, b) => a.data.order - b.data.order);
---

<BaseLayout
  title="Vehicle Wraps & Lettering — Cumberland Signworks Crossville TN"
  description="Full vehicle wraps, partial wraps, fleet lettering, and single-door graphics for Crossville, TN and the Upper Cumberland. Installed in-house. Fast quotes."
>
  <section class="section bg-cumberland-cream">
    <div class="container-rail max-w-4xl">
      <p class="eyebrow">Vehicle Wraps & Lettering</p>
      <h1 class="mt-4 text-cumberland-ink">
        Your truck is your best <span class="text-cumberland-forest">billboard.</span>
      </h1>
      <p class="mt-6 text-xl leading-relaxed text-cumberland-stone">
        Full wraps, partial wraps, and fleet lettering — designed and installed
        in-house in Crossville, TN. Turn every job site into a marketing impression.
      </p>
      <div class="mt-8 flex flex-wrap gap-4">
        <a href="/start-your-project" class="btn-primary">Start Your Project</a>
        <a href="/contact" class="btn-secondary">Talk to us first</a>
      </div>
    </div>
  </section>

  <section class="section bg-cumberland-mist/40">
    <div class="container-rail">
      <p class="eyebrow">Wrap options</p>
      <h2 class="mt-4 text-cumberland-ink">Vehicle wrap services</h2>
      <ul class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <li>
            <a
              href={`/vehicle-wraps/${service.slug}`}
              class="group block h-full rounded-3xl bg-white p-8 border border-cumberland-mist transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <p class="font-display text-2xl text-cumberland-ink leading-tight group-hover:text-cumberland-forest">
                {service.data.title}
              </p>
              <p class="mt-3 text-cumberland-stone">{service.data.summary}</p>
              {service.data.bullets.length > 0 && (
                <ul class="mt-4 space-y-1">
                  {service.data.bullets.slice(0, 3).map((b) => (
                    <li class="flex gap-2 text-sm text-cumberland-stone">
                      <span class="text-cumberland-clay" aria-hidden="true">✓</span>
                      {b}
                    </li>
                  ))}
                </ul>
              )}
              <p class="mt-6 text-sm font-semibold text-cumberland-clay">Learn more →</p>
            </a>
          </li>
        ))}
      </ul>
    </div>
  </section>

  <ThreeStepPlan />
  <CTASection />
</BaseLayout>
```

- [ ] **Step 2: Create the dynamic vehicle-wraps service route**

Create `src/pages/vehicle-wraps/[slug].astro`:

```astro
---
import { getCollection } from 'astro:content';
import ServicePageLayout from '@components/ServicePageLayout.astro';

export async function getStaticPaths() {
  const entries = await getCollection('services', ({ data }) => data.category === 'vehicle-wraps');
  return entries.map((entry) => ({
    params: { slug: entry.slug },
    props: { entry },
  }));
}

const { entry } = Astro.props;
const { Content } = await entry.render();
---

<ServicePageLayout
  title={entry.data.title}
  summary={entry.data.summary}
  category={entry.data.category}
  bullets={entry.data.bullets}
>
  <Content />
</ServicePageLayout>
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Expected: `dist/vehicle-wraps/index.html` generated. Exits 0.

- [ ] **Step 4: Commit**

```bash
git add src/pages/vehicle-wraps/
git commit -m "feat: add vehicle-wraps pillar page and dynamic service routes"
git push
```

---

## Task 11: Vehicle Wraps MDX Content

**Files:**
- Create: `src/content/services/full-wraps.mdx`
- Create: `src/content/services/partial-lettering.mdx`
- Create: `src/content/services/fleet.mdx`

- [ ] **Step 1: Create full-wraps.mdx**

Create `src/content/services/full-wraps.mdx`:

```mdx
---
title: Full Vehicle Wraps
slug: full-wraps
summary: Bumper-to-bumper full vehicle wraps that turn your truck, van, or SUV into a rolling billboard — installed in-house in Crossville.
order: 10
category: vehicle-wraps
bullets:
  - Full bumper-to-bumper coverage
  - Premium 3M and Avery vinyl
  - Design included
  - In-house installation — no subcontractors
---

# Your truck is driving around all day. Make it work while you work.

A full vehicle wrap is 70,000–100,000 impressions a day for the life of the wrap. No ad platform comes close per dollar. And unlike a billboard, it moves through every neighborhood where your customers live.

## Sound familiar?

- You've seen wrapped trucks at job sites and said "I need to do that."
- You got a quote once and it seemed high — but you're not sure what you were getting.
- Your fleet is five vehicles with mismatched magnets and zero brand consistency.

## How it works

1. **Bring in your vehicle (or send us dimensions and photos).** We'll design a mockup that fits your brand and your truck.
2. **We proof and produce.** You approve the design before anything goes on press.
3. **We install it.** In our shop, by our team. Takes 1–2 days depending on vehicle size.

## What a full wrap includes

- Custom design scaled to your exact vehicle template
- Premium cast vinyl (3M or Avery) — rated 5–7 years outdoors
- Full installation by our wrap technicians
- Warranty on workmanship
- All vehicles: pickup trucks, vans, SUVs, box trucks, trailers

## The ROI math

A full wrap on a work truck costs roughly the same as 3–4 months of mid-tier Facebook ads — and it runs for 5 years, every day, everywhere you drive. It's the highest-ROI marketing most service businesses ever buy.
```

- [ ] **Step 2: Create partial-lettering.mdx**

Create `src/content/services/partial-lettering.mdx`:

```mdx
---
title: Partial Wraps & Vehicle Lettering
slug: partial-lettering
summary: Door lettering, hood graphics, tailgate wraps, and partial coverage options — brand your vehicle without a full wrap budget.
order: 20
category: vehicle-wraps
bullets:
  - Door and panel lettering
  - Tailgate graphics and wraps
  - Partial coverage designs
  - One vehicle or ten
---

# Not ready for a full wrap? Partial coverage still does the work.

A clean set of door letters with your logo, phone, and what you do turns your truck from anonymous to a moving business card. Simple, effective, professional.

## Sound familiar?

- You want to brand your truck but a full wrap feels like too big a commitment right now.
- You've seen some vehicles with just a logo and number on the door — and it looked sharp.
- You're adding a second vehicle and want it to match the first without re-doing everything.

## How it works

1. **Tell us what you want on the vehicle.** Door letters, hood, tailgate — or all three.
2. **We design a layout that works for your vehicle.** Free proof showing exactly where everything goes.
3. **We install it.** Usually a half-day for a basic lettering package.

## What we do for partial vehicle graphics

- Door and panel lettering (name, number, what you do)
- Logo and tagline placement
- Tailgate and roof graphics
- Window graphics and rear-window lettering
- Hood and fender accent graphics
- Magnetic signs (ask about fit for your vehicle)

## Match your existing vehicles

If you already have a full wrap and you're adding a new vehicle, bring us the old spec — we'll match it exactly.
```

- [ ] **Step 3: Create fleet.mdx**

Create `src/content/services/fleet.mdx`:

```mdx
---
title: Fleet Wraps & Lettering
slug: fleet
summary: Consistent fleet branding across multiple vehicles — from 2 trucks to 200. Coordinated design, phased installation, volume pricing.
order: 30
category: vehicle-wraps
bullets:
  - Consistent design across all vehicles
  - Volume pricing for 3+ vehicles
  - Phased installs to keep your fleet moving
  - Design templates for future adds
---

# A branded fleet says: we're serious, we're established, we're everywhere.

When your trucks look like a fleet, your company looks like a company. Coordinated graphics across five, ten, or fifty vehicles sends a signal no single ad can — this operation has its act together.

## Sound familiar?

- You have six trucks and they all look different.
- You did one truck a few years ago but can't match it exactly anymore.
- You're adding vehicles quarterly and need a system for keeping branding consistent.

## How it works

1. **Tell us about your fleet.** Number of vehicles, types, current state of branding.
2. **We build a design template.** One master design that adapts cleanly to every vehicle in your fleet.
3. **We schedule installation in phases.** No need to ground your whole fleet at once — we work around your operations.

## What fleet branding includes

- Single master design scaled across vehicle types
- Color-matched vinyl across all installs
- Master design file in your hands for future vehicles
- Volume pricing at 3+ vehicles
- Mixed vehicle types (trucks, vans, trailers) covered under one program

## Ongoing fleet management

As you add vehicles, bring them to us. Your design file is on file. Turnaround for an additional vehicle is faster every time.
```

- [ ] **Step 4: Verify build**

```bash
npm run build
```

Expected: `dist/vehicle-wraps/full-wraps/`, `dist/vehicle-wraps/partial-lettering/`, `dist/vehicle-wraps/fleet/` generated. Exits 0.

- [ ] **Step 5: Commit**

```bash
git add src/content/services/full-wraps.mdx src/content/services/partial-lettering.mdx src/content/services/fleet.mdx
git commit -m "feat: add vehicle wraps service content — full wraps, partial lettering, fleet"
git push
```

---

## Task 12: Print Page

**Files:**
- Create: `src/pages/print.astro`
- Create: `src/content/services/print.mdx`

- [ ] **Step 1: Create print.mdx content**

Create `src/content/services/print.mdx`:

```mdx
---
title: Business Cards & Print
slug: print
summary: Full-color business cards, flyers, door hangers, and short-run print — designed in-house, ready fast.
order: 10
category: print
bullets:
  - Business cards with real design help
  - Flyers and door hangers
  - Short-run, full-color printing
  - Fast turnaround
---

# Business cards that don't go straight in the trash.

Your card is your handshake when you leave the room. Thick stock, clean design, accurate colors — the kind of card people hold onto.

## What we print

- Business cards (standard, rounded-corner, thick stock)
- Flyers (8.5×11, half-sheet, quarter-sheet)
- Door hangers
- Rack cards and brochures
- Postcards and mailers
- Event programs

## How it works

1. **Send your artwork or tell us what you need.** Don't have a design yet? We'll help.
2. **We proof it and price it.** Most business card and flyer quotes are same-day.
3. **You pick up locally or we ship.** Fast turnaround — most short-run print in 2–3 business days.
```

- [ ] **Step 2: Create print.astro**

Create `src/pages/print.astro`:

```astro
---
import BaseLayout from '@layouts/BaseLayout.astro';
import CTASection from '@components/CTASection.astro';
import ThreeStepPlan from '@components/ThreeStepPlan.astro';
---

<BaseLayout
  title="Business Cards & Print — Cumberland Signworks Crossville TN"
  description="Business cards, flyers, door hangers, and short-run printing in Crossville, TN. Design help included. Fast turnaround."
>
  <section class="section bg-cumberland-cream">
    <div class="container-rail max-w-4xl">
      <p class="eyebrow">Business Cards & Print</p>
      <h1 class="mt-4 text-cumberland-ink">
        Printed materials that make the <span class="text-cumberland-forest">right impression.</span>
      </h1>
      <p class="mt-6 text-xl leading-relaxed text-cumberland-stone">
        Business cards, flyers, door hangers, and short-run print — designed
        and printed in Crossville. Fast quotes, real design help.
      </p>
      <div class="mt-8 flex flex-wrap gap-4">
        <a href="/start-your-project" class="btn-primary">Start Your Project</a>
      </div>
    </div>
  </section>

  <section class="section bg-cumberland-mist/40">
    <div class="container-rail max-w-4xl">
      <ul class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { title: 'Business Cards', body: 'Standard, rounded corner, thick stock. Design help included.' },
          { title: 'Flyers', body: 'Full-color 8.5×11, half-sheet, or quarter-sheet. Events, promotions, and menus.' },
          { title: 'Door Hangers', body: 'Great for contractors and restaurants. Design-to-door service available.' },
          { title: 'Rack Cards', body: '4×9 cards for lobbies, waiting rooms, and countertops.' },
          { title: 'Postcards', body: 'Direct mail, announcement cards, and promotional mailers.' },
          { title: 'Brochures', body: 'Tri-fold and bi-fold. We help you organize the content.' },
        ].map((item) => (
          <li class="rounded-3xl bg-white p-8 border border-cumberland-mist">
            <p class="font-display text-2xl text-cumberland-ink">{item.title}</p>
            <p class="mt-3 text-cumberland-stone text-sm">{item.body}</p>
          </li>
        ))}
      </ul>
    </div>
  </section>

  <ThreeStepPlan />
  <CTASection />
</BaseLayout>
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Expected: `dist/print/index.html` generated. Exits 0.

- [ ] **Step 4: Commit**

```bash
git add src/pages/print.astro src/content/services/print.mdx
git commit -m "feat: add print pillar page and content"
git push
```

---

## Task 13: Portfolio Listing Page

**Files:**
- Create: `src/pages/portfolio/index.astro`

- [ ] **Step 1: Create portfolio listing page**

Create `src/pages/portfolio/index.astro`:

```astro
---
import BaseLayout from '@layouts/BaseLayout.astro';
import { getCollection } from 'astro:content';
import CTASection from '@components/CTASection.astro';

let portfolio: Awaited<ReturnType<typeof getCollection<'portfolio'>>> = [];
try {
  portfolio = await getCollection('portfolio');
  portfolio.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
} catch {
  // Empty collection — show placeholder state
}
---

<BaseLayout
  title="Portfolio — Cumberland Signworks Crossville TN"
  description="See our work — vehicle wraps, storefront signs, team uniforms, and more from jobs across Cumberland County and the Upper Cumberland Plateau."
>
  <section class="section bg-cumberland-cream">
    <div class="container-rail max-w-4xl">
      <p class="eyebrow">Our work</p>
      <h1 class="mt-4 text-cumberland-ink">
        1,000+ projects. <span class="text-cumberland-forest">Here are a few.</span>
      </h1>
      <p class="mt-6 text-xl leading-relaxed text-cumberland-stone">
        Every project in our portfolio was made for a school, team, business, or church right here in the Upper Cumberland.
        No stock. No staged shots. Real work, real clients.
      </p>
    </div>
  </section>

  <section class="section bg-cumberland-mist/40">
    <div class="container-rail">
      {portfolio.length > 0 ? (
        <ul class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {portfolio.map((item) => (
            <li class="rounded-3xl overflow-hidden bg-white border border-cumberland-mist shadow-sm">
              <!-- Hero image rendered when photos are available -->
              <div class="aspect-video bg-cumberland-mist/60 flex items-center justify-center">
                <p class="text-xs text-cumberland-stone">{item.data.serviceType}</p>
              </div>
              <div class="p-6">
                <p class="font-display text-xl text-cumberland-ink">{item.data.title}</p>
                <p class="mt-1 text-sm text-cumberland-stone">{item.data.client} · {item.data.serviceType}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div class="rounded-3xl bg-white border border-cumberland-mist p-16 text-center">
          <p class="font-display text-3xl text-cumberland-ink">Photos coming soon.</p>
          <p class="mt-4 text-cumberland-stone max-w-md mx-auto">
            We're building out our online portfolio. In the meantime — call us and we'll show you
            work similar to what you're looking for.
          </p>
          <div class="mt-8 flex justify-center gap-4">
            <a href="/start-your-project" class="btn-primary">Start Your Project</a>
            <a href="/contact" class="btn-secondary">Call us</a>
          </div>
        </div>
      )}
    </div>
  </section>

  <CTASection />
</BaseLayout>
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: `dist/portfolio/index.html` generated. The placeholder state renders when the portfolio collection is empty. Exits 0.

- [ ] **Step 3: Commit**

```bash
git add src/pages/portfolio/index.astro
git commit -m "feat: add portfolio listing page with empty-state placeholder"
git push
```

---

## Task 14: About Page

**Files:**
- Create: `src/pages/about.astro`

- [ ] **Step 1: Create about.astro**

Create `src/pages/about.astro`:

```astro
---
import BaseLayout from '@layouts/BaseLayout.astro';
import CTASection from '@components/CTASection.astro';
---

<BaseLayout
  title="About Cumberland Signworks — Crossville, TN Since 2003"
  description="We've been the print shop for schools, teams, churches, and local businesses across the Upper Cumberland for 23 years. Family owned. In-house everything."
>
  <!-- Hero -->
  <section class="section bg-cumberland-cream">
    <div class="container-rail max-w-4xl">
      <p class="eyebrow">About us</p>
      <h1 class="mt-4 text-cumberland-ink">
        We help the Upper Cumberland<br />
        <span class="text-cumberland-forest">show up looking like pros.</span>
      </h1>
      <p class="mt-6 text-xl leading-relaxed text-cumberland-stone">
        Cumberland Signworks has been the print shop for schools, teams, churches,
        and local businesses in Crossville and across Cumberland County since 2003.
        One shop. Everything in-house. Same standards, 23 years running.
      </p>
    </div>
  </section>

  <!-- Story -->
  <section class="section bg-cumberland-mist/40">
    <div class="container-rail grid gap-12 lg:grid-cols-2 items-start">
      <div>
        <p class="eyebrow">Our story</p>
        <h2 class="mt-4 text-cumberland-ink">Built for this community, by this community.</h2>
        <div class="mt-6 space-y-5 text-cumberland-stone leading-relaxed">
          <p>
            Cumberland Signworks opened in 2003 because Crossville needed a real print shop —
            one that understood local deadlines, answered the phone, and stood behind its work.
          </p>
          <p>
            For 23 years we've made shirts for the team, signs for the grand opening, wraps for
            the fleet, banners for the event, and hats for the group photo. More than 1,000 projects.
            Hundreds of clients who've become familiar faces.
          </p>
          <p>
            We do it all in-house: screen printing, embroidery, vinyl, digital printing,
            signage fabrication, and full vehicle wraps. One shop. One point of contact. One
            standard — it goes out right or it doesn't go out.
          </p>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 gap-6">
        {[
          { stat: '23', label: 'Years in Crossville' },
          { stat: '1,000+', label: 'Projects completed' },
          { stat: '4.7★', label: 'Across 95+ reviews' },
          { stat: '1', label: 'Shop. Everything in-house.' },
        ].map((item) => (
          <div class="rounded-3xl bg-white border border-cumberland-mist p-8 text-center">
            <p class="font-display text-5xl text-cumberland-forest tracking-tighter">{item.stat}</p>
            <p class="mt-2 text-sm text-cumberland-stone">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  </section>

  <!-- Team placeholder -->
  <section class="section bg-cumberland-cream">
    <div class="container-rail max-w-4xl">
      <p class="eyebrow">The team</p>
      <h2 class="mt-4 text-cumberland-ink">Real people. Same shop.</h2>
      <p class="mt-6 text-cumberland-stone leading-relaxed max-w-prose">
        When you call Cumberland Signworks, you get a real person from Crossville — not a
        help desk, not a portal. We know our clients by name, we know their brand colors,
        and we know what "need it by Friday" actually means.
      </p>
      <!-- TODO: real team photos — recommend half-day shoot in the shop -->
      <div class="mt-10 rounded-3xl bg-cumberland-mist/60 p-12 text-center text-cumberland-stone">
        <p class="text-sm">Team photos coming — photoshoot scheduled.</p>
      </div>
    </div>
  </section>

  <!-- Community -->
  <section class="section bg-cumberland-forest text-cumberland-cream">
    <div class="container-rail max-w-4xl">
      <p class="eyebrow text-cumberland-clay">Why local matters</p>
      <h2 class="mt-4">We're not shipping from a warehouse.<br />We live here.</h2>
      <p class="mt-6 text-lg text-cumberland-mist leading-relaxed">
        We've watched Crossville grow. We've made the shirts for the high school championship runs,
        the signs for businesses that became staples, the wraps for trucks you see every day on
        I-40. We're invested in this community because we're part of it — not just a vendor passing through.
      </p>
      <p class="mt-6 text-lg text-cumberland-mist leading-relaxed">
        When you choose Cumberland Signworks, you're not subsidizing a national chain or a
        fulfillment center in another state. You're keeping a local shop open that's been
        part of this community for two decades.
      </p>
    </div>
  </section>

  <CTASection />
</BaseLayout>
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: `dist/about/index.html` generated. Exits 0.

- [ ] **Step 3: Commit**

```bash
git add src/pages/about.astro
git commit -m "feat: add about page"
git push
```

---

## Task 15: Resources Pages (Checklist + File Prep)

**Files:**
- Create: `src/pages/resources/checklist.astro`
- Create: `src/pages/resources/file-prep.astro`

- [ ] **Step 1: Create checklist.astro (lead magnet landing page)**

Create `src/pages/resources/checklist.astro`:

```astro
---
import BaseLayout from '@layouts/BaseLayout.astro';
---

<BaseLayout
  title="Free Project Checklist — Cumberland Signworks"
  description="Everything you need to know before ordering signs, shirts, or a vehicle wrap. File specs, sizing, timelines, and what to ask. Free PDF."
>
  <section class="section bg-cumberland-cream">
    <div class="container-rail max-w-4xl grid gap-12 lg:grid-cols-2 items-start">
      <!-- Left: value prop -->
      <div>
        <p class="eyebrow">Free download</p>
        <h1 class="mt-4 text-cumberland-ink">
          The Sign & Apparel<br />Project Checklist.
        </h1>
        <p class="mt-6 text-xl leading-relaxed text-cumberland-stone">
          Everything you need to know before you order — so you don't have to
          Google "what file format does a print shop need" at 11pm the night before
          your deadline.
        </p>

        <ul class="mt-8 space-y-4">
          {[
            'File format cheat sheet — what to send and what we can work with',
            'Size guide for common signs, banners, and yard signs',
            'Apparel quantity & timeline guide — when to order for game day',
            'Vehicle wrap prep checklist',
            '5 questions to ask any print shop before placing an order',
          ].map((item) => (
            <li class="flex gap-3 text-cumberland-ink">
              <span class="text-cumberland-clay shrink-0 mt-0.5" aria-hidden="true">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <!-- Right: email capture form -->
      <div class="rounded-3xl bg-white border border-cumberland-mist p-8 md:p-10 shadow-sm">
        <h2 class="font-display text-2xl text-cumberland-ink tracking-tighter">
          Send me the checklist.
        </h2>
        <p class="mt-2 text-sm text-cumberland-stone">
          One email. Your checklist. No spam, ever.
        </p>

        <!-- TODO: wire to email provider (Resend + Formspree or ConvertKit) -->
        <form
          action={import.meta.env.PUBLIC_CHECKLIST_FORM_ENDPOINT || '#configure-checklist-form'}
          method="POST"
          class="mt-6 space-y-4"
        >
          <input type="hidden" name="_subject" value="Checklist Request — Cumberland Signworks" />
          <input type="hidden" name="_next" value={`${import.meta.env.PUBLIC_SITE_URL || 'https://cumberlandsignworks.com'}/thank-you`} />

          <div>
            <label for="checklist-name" class="block text-sm font-semibold text-cumberland-ink">
              Your name
            </label>
            <input
              type="text"
              id="checklist-name"
              name="name"
              required
              class="mt-2 w-full rounded-xl border-2 border-cumberland-mist bg-white px-4 py-3 focus:border-cumberland-forest"
            />
          </div>

          <div>
            <label for="checklist-email" class="block text-sm font-semibold text-cumberland-ink">
              Email address <span class="text-cumberland-clay">*</span>
            </label>
            <input
              type="email"
              id="checklist-email"
              name="email"
              required
              class="mt-2 w-full rounded-xl border-2 border-cumberland-mist bg-white px-4 py-3 focus:border-cumberland-forest"
            />
          </div>

          {/* Honeypot */}
          <input type="text" name="website" tabindex="-1" autocomplete="off" class="absolute left-[-9999px]" aria-hidden="true" />

          <button type="submit" class="btn-primary w-full">
            Send me the checklist
          </button>

          <p class="text-xs text-cumberland-stone text-center">
            We'll email it right away. Mon–Fri · Crossville, TN
          </p>
        </form>
      </div>
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 2: Add `PUBLIC_CHECKLIST_FORM_ENDPOINT` to .env.example**

Open `src/pages/resources/checklist.astro` is already reading from `PUBLIC_CHECKLIST_FORM_ENDPOINT`. Add this variable to `.env.example`:

In `.env.example`, after the `PUBLIC_FORMSPREE_ENDPOINT` line, add:

```
# Checklist lead magnet form (Formspree separate form or same endpoint)
PUBLIC_CHECKLIST_FORM_ENDPOINT=
```

- [ ] **Step 3: Create file-prep.astro**

Create `src/pages/resources/file-prep.astro`:

```astro
---
import BaseLayout from '@layouts/BaseLayout.astro';
import CTASection from '@components/CTASection.astro';
---

<BaseLayout
  title="File Prep Guide — Cumberland Signworks"
  description="How to prepare artwork files for signs, shirts, vehicle wraps, and print. Vector vs raster, file formats, color modes — everything you need to send files we can work with."
>
  <section class="section bg-cumberland-cream">
    <div class="container-rail max-w-4xl">
      <p class="eyebrow">Resources</p>
      <h1 class="mt-4 text-cumberland-ink">File prep guide.</h1>
      <p class="mt-6 text-xl leading-relaxed text-cumberland-stone">
        Don't know what file to send? Here's everything you need to know — and
        what to do if you don't have the right file (hint: we can usually help).
      </p>
    </div>
  </section>

  <section class="section bg-cumberland-mist/40">
    <div class="container-rail max-w-4xl space-y-12">
      <div class="rounded-3xl bg-white border border-cumberland-mist p-8">
        <h2 class="font-display text-3xl text-cumberland-ink">The short version</h2>
        <p class="mt-4 text-cumberland-stone">
          Send us a <strong class="text-cumberland-ink">vector file</strong> if you have one
          (.AI, .EPS, .SVG, .PDF from Illustrator). If you don't — send us your highest-resolution
          version and we'll tell you if it works. Don't let file anxiety stop you from reaching out.
        </p>
      </div>

      <div class="rounded-3xl bg-white border border-cumberland-mist p-8">
        <h2 class="font-display text-3xl text-cumberland-ink">Vector vs. raster</h2>
        <div class="mt-4 grid sm:grid-cols-2 gap-6">
          <div>
            <p class="font-semibold text-cumberland-forest">Vector (preferred)</p>
            <p class="mt-2 text-sm text-cumberland-stone">Math-based lines. Scales to any size without going blurry. Files: .AI, .EPS, .SVG, .PDF (from Illustrator).</p>
          </div>
          <div>
            <p class="font-semibold text-cumberland-clay">Raster (sometimes OK)</p>
            <p class="mt-2 text-sm text-cumberland-stone">Pixel-based. If high enough resolution (300 dpi at print size), it works. Files: .PNG, .JPG, .TIFF. Low-res JPGs from the web will not work.</p>
          </div>
        </div>
      </div>

      <div class="rounded-3xl bg-white border border-cumberland-mist p-8">
        <h2 class="font-display text-3xl text-cumberland-ink">Color mode</h2>
        <ul class="mt-4 space-y-3 text-cumberland-stone">
          <li><strong class="text-cumberland-ink">Screen printing:</strong> Provide Pantone (PMS) colors if you have them. We'll match or advise.</li>
          <li><strong class="text-cumberland-ink">Digital / full-color print:</strong> CMYK is preferred. RGB is OK — we'll convert and show you a proof.</li>
          <li><strong class="text-cumberland-ink">Vehicle wraps:</strong> CMYK print files. We'll color-correct if needed.</li>
        </ul>
      </div>

      <div class="rounded-3xl bg-white border border-cumberland-mist p-8">
        <h2 class="font-display text-3xl text-cumberland-ink">What to do if you don't have the right file</h2>
        <p class="mt-4 text-cumberland-stone leading-relaxed">
          Send us what you have. We've worked with everything from a phone photo of a hand-drawn sketch to
          a Word doc with a logo in it. We'll tell you if it works, offer to redraw it for a small fee if it doesn't,
          or help you track down the original source. You're not expected to be a graphic designer.
        </p>
        <a href="/start-your-project" class="btn-primary mt-6 inline-flex">Start Your Project Anyway</a>
      </div>
    </div>
  </section>

  <CTASection />
</BaseLayout>
```

- [ ] **Step 4: Verify build**

```bash
npm run build
```

Expected: `dist/resources/checklist/index.html` and `dist/resources/file-prep/index.html` generated. Exits 0.

- [ ] **Step 5: Commit**

```bash
git add src/pages/resources/ .env.example
git commit -m "feat: add resources pages — checklist lead magnet and file prep guide"
git push
```

---

## Task 16: Contact Page — Google Maps Embed

**Files:**
- Modify: `src/pages/contact.astro`

- [ ] **Step 1: Replace the map placeholder with a real Google Maps iframe**

In `src/pages/contact.astro`, replace this block:

```astro
      <!-- TODO: embed Google Map of 474 Hyder Ridge Rd, Crossville, TN -->
      <div
        class="mt-12 aspect-video w-full rounded-3xl bg-cumberland-mist/60 flex items-center justify-center text-cumberland-stone"
      >
        <p class="text-sm">Map placeholder — Google Maps embed of 474 Hyder Ridge Rd</p>
      </div>
```

With:

```astro
      <div class="mt-12 aspect-video w-full rounded-3xl overflow-hidden border border-cumberland-mist">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3188.1234!2d-85.0269!3d35.9489!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzXCsDU2JzU2LjAiTiA4NcKwMDEnMzYuOCJX!5e0!3m2!1sen!2sus!4v1234567890"
          width="100%"
          height="100%"
          style="border:0;"
          allowfullscreen=""
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          title="Cumberland Signworks location — 474 Hyder Ridge Rd, Crossville, TN"
          class="w-full h-full"
        ></iframe>
      </div>
```

**Note:** The embed URL above uses approximate coordinates. To get the exact embed URL:
1. Go to maps.google.com
2. Search "474 Hyder Ridge Rd, Crossville, TN 38555"
3. Click Share → Embed a map → Copy the `src` URL from the iframe code
4. Replace the `src` value in the iframe above with the real URL

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: Exits 0, no errors.

- [ ] **Step 3: Commit**

```bash
git add src/pages/contact.astro
git commit -m "feat: add Google Maps embed to contact page"
git push
```

---

## Self-Review Checklist

**Spec coverage against PROJECT.md §6 (IA):**

| Route | Covered? |
|---|---|
| `/` | ✅ Already built |
| `/apparel` | ✅ Task 6 |
| `/apparel/team-uniforms` | ✅ Task 6 (existing MDX) |
| `/apparel/schools-churches` | ✅ Task 7 |
| `/apparel/business-branded` | ✅ Task 7 |
| `/apparel/hats-embroidery` | ✅ Task 7 |
| `/signs` | ✅ Task 8 |
| `/signs/storefront` | ✅ Task 9 |
| `/signs/yard-real-estate` | ✅ Task 9 |
| `/signs/banners` | ✅ Task 9 |
| `/signs/window-graphics` | ✅ Task 9 |
| `/vehicle-wraps` | ✅ Task 10 |
| `/vehicle-wraps/full-wraps` | ✅ Task 11 |
| `/vehicle-wraps/partial-lettering` | ✅ Task 11 |
| `/vehicle-wraps/fleet` | ✅ Task 11 |
| `/print` | ✅ Task 12 |
| `/portfolio` | ✅ Task 13 |
| `/about` | ✅ Task 14 |
| `/start-your-project` | ✅ Already built |
| `/resources/checklist` | ✅ Task 15 |
| `/resources/file-prep` | ✅ Task 15 |
| `/contact` | ✅ Task 16 (maps embed) |
| `/thank-you` | ✅ Task 4 |
| Mobile nav | ✅ Task 3 |

**Deferred (post-launch):**
- `/reviews` — nice-to-have, depends on review API setup
- Local SEO geo pages (`/signs/crossville-tn`, etc.) — Phase 3 in PROJECT.md
- Decap CMS OAuth backend — requires `base_url` OAuth proxy on Cloudflare Workers
- Form endpoint wiring — requires Formspree account + endpoint URL added to env

**Placeholder scan:** No TODOs left in code except documented intentional ones (team photos, map embed URL, form endpoint). All code blocks are complete and self-contained.

**Type consistency:** `ServicePageLayout` accepts `category: string` (matches all MDX frontmatter `category` enum values). Dynamic routes use `entry.slug` (Astro built-in, always a string). `getCollection` filter uses strict `===` equality.

---

*Plan complete. 16 tasks. Estimated total: 3–5 hours of sequential execution.*
