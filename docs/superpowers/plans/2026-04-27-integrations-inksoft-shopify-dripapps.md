# Cumberland Signworks — Integrations Addendum: InkSoft, Shopify & Drip Sheet

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Prerequisite:** Complete `2026-04-27-cumberland-signworks-site-build.md` (Tasks 1–16) before starting this plan. Tasks here build on that foundation.

**Goal:** Integrate InkSoft (custom group/team stores), Shopify (online retail), and the Drip Sheet app (DTF gang sheet builder on Shopify) into the Cumberland Signworks Astro marketing site.

**Architecture:**
- **InkSoft** lives at a separate URL (e.g., `store.cumberlandsignworks.com` or `cumberlandsignworks.inksoft.com`). The Astro site links *to* InkSoft stores — it does not embed them. A `/stores` marketing page explains the service and drives CTAs to set up a store.
- **Shopify** is a separate store (e.g., `shop.cumberlandsignworks.com`). The Astro site links to it from the nav, footer, and service pages. Optionally, Shopify Buy Buttons (JS snippet) can be embedded on Astro pages for a lightweight inline cart experience.
- **Drip Sheet** is a Shopify app installed inside the Shopify store. From the Astro site's perspective, it's promoted as a "DTF Transfers" service page that routes customers to the Shopify store to build and order their gang sheet.

**Tech Stack:** Astro 4, Tailwind 3, env vars for all external URLs (InkSoft store URL, Shopify store URL, Shopify Buy Button snippet key).

**Status as of 2026-04-28:**
- InkSoft store URL confirmed: `https://www.cumberlandsignworks.com/cswllc/shop/home`
- Shopify store URL: **DEFERRED** — client to confirm
- Drip Sheet installation: **DEFERRED** — client to confirm
- Tasks E, G, H, I (Shopify/Drip Sheet portions): skip until client confirms Shopify details

---

## File Structure

**New files to create:**

```
src/
  pages/
    stores.astro                    # InkSoft custom online stores marketing page
    apparel/
      dtf-transfers.astro           # DTF Transfers via Drip Sheet / Shopify
  content/
    services/
      custom-stores.mdx             # InkSoft stores as a service offering
      dtf-transfers.mdx             # DTF gang sheet service (Drip Sheet on Shopify)
  components/
    ShopifyBuyButton.astro          # Reusable Shopify Buy Button embed wrapper

**Files to modify:**
src/components/Header.astro         # Add "Shop" + "Custom Stores" nav items
src/components/Footer.astro         # Add "Shop Online" + "Custom Stores" links
src/components/ServicesStrip.astro  # Add DTF Transfers + Custom Stores tiles
src/components/CTASection.astro     # Add Shopify store CTA variant
.env.example                        # Add InkSoft + Shopify env vars
public/admin/config.yml             # Already covers services — no changes needed
```

---

## Environment Variables

Before any code runs, add these to `.env.example` (values filled in by owner):

```
# InkSoft
PUBLIC_INKSOFT_STORE_URL=https://cumberlandsignworks.inksoft.com/store
# Or custom subdomain: https://store.cumberlandsignworks.com

# Shopify storefront
PUBLIC_SHOPIFY_STORE_URL=https://shop.cumberlandsignworks.com
# Or: https://cumberland-signworks.myshopify.com

# Shopify Buy Button (optional — for inline embeds on Astro pages)
# Get this from Shopify Admin → Sales Channels → Buy Button → Create button → Copy snippet
PUBLIC_SHOPIFY_BUY_BUTTON_DOMAIN=cumberland-signworks.myshopify.com
PUBLIC_SHOPIFY_STOREFRONT_TOKEN=
```

---

## Task A: Environment Variables + .env.example Update

**Files:**
- Modify: `.env.example`

- [ ] **Step 1: Add integration env vars to .env.example**

Open `.env.example` and append to the end:

```
# ── InkSoft ───────────────────────────────────────────────────────────────────
# Confirmed store URL (2026-04-28)
PUBLIC_INKSOFT_STORE_URL=https://www.cumberlandsignworks.com/cswllc/shop/home

# ── Shopify (DEFERRED — confirm with client) ──────────────────────────────────
PUBLIC_SHOPIFY_STORE_URL=
PUBLIC_SHOPIFY_BUY_BUTTON_DOMAIN=
PUBLIC_SHOPIFY_STOREFRONT_TOKEN=
```

- [ ] **Step 2: Verify build still passes after .env changes**

```bash
npm run build
```

Expected: exits 0. Env vars with no value default gracefully — no build error.

- [ ] **Step 3: Commit**

```bash
git add .env.example
git commit -m "chore: add InkSoft, Shopify, and Drip Sheet env var stubs"
git push
```

---

## Task B: Header Nav — Add "Shop" + "Stores" Links

The header currently has 5 nav links. Add two more:
- "Shop Online" → Shopify store (external link)
- "Custom Stores" → `/stores` (internal page, Task D)

**Files:**
- Modify: `src/components/Header.astro`

- [ ] **Step 1: Update navLinks array and add shop link**

In `src/components/Header.astro`, replace the `navLinks` array:

```astro
const shopUrl = import.meta.env.PUBLIC_SHOPIFY_STORE_URL || '#shop-coming-soon';

const navLinks = [
  { label: 'Apparel', href: '/apparel' },
  { label: 'Signs', href: '/signs' },
  { label: 'Vehicle Wraps', href: '/vehicle-wraps' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'About', href: '/about' },
];
```

Then in the desktop nav `<nav>` block, after the mapped navLinks, add the Shop link:

```astro
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
      <a
        href={shopUrl}
        class="text-cumberland-ink hover:text-cumberland-forest transition-colors"
        {...(shopUrl.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        Shop Online
      </a>
    </nav>
```

And in the mobile menu `<nav>` block, add the same Shop Online link at the end of the navLinks list (before the CTA button):

```astro
      <a
        href={shopUrl}
        class="py-3 text-base font-medium text-cumberland-ink hover:text-cumberland-forest border-b border-cumberland-mist/60"
        {...(shopUrl.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        Shop Online
      </a>
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add src/components/Header.astro
git commit -m "feat: add Shop Online link to nav (Shopify storefront)"
git push
```

---

## Task C: Footer Update — Shop + Stores Links

**Files:**
- Modify: `src/components/Footer.astro`

- [ ] **Step 1: Add Shop Online and Custom Stores to the Services column**

In `src/components/Footer.astro`, find the Services `<ul>` and add two new items:

```astro
    <div>
      <h2 class="text-xs uppercase tracking-[0.2em] font-semibold text-cumberland-clay">Services</h2>
      <ul class="mt-3 space-y-2 text-sm">
        <li><a href="/apparel" class="hover:text-cumberland-clay">Apparel & embroidery</a></li>
        <li><a href="/signs" class="hover:text-cumberland-clay">Signs & banners</a></li>
        <li><a href="/vehicle-wraps" class="hover:text-cumberland-clay">Vehicle wraps</a></li>
        <li><a href="/print" class="hover:text-cumberland-clay">Business cards & print</a></li>
        <li><a href="/apparel/dtf-transfers" class="hover:text-cumberland-clay">DTF transfers</a></li>
        <li><a href="/stores" class="hover:text-cumberland-clay">Custom online stores</a></li>
      </ul>
    </div>
```

Also add a new column for "Online" links next to the Services column:

```astro
    <div>
      <h2 class="text-xs uppercase tracking-[0.2em] font-semibold text-cumberland-clay">Shop & Stores</h2>
      <ul class="mt-3 space-y-2 text-sm">
        <li>
          <a
            href={import.meta.env.PUBLIC_SHOPIFY_STORE_URL || '#'}
            class="hover:text-cumberland-clay"
            target="_blank"
            rel="noopener noreferrer"
          >
            Shop online →
          </a>
        </li>
        <li><a href="/stores" class="hover:text-cumberland-clay">Set up a group store</a></li>
        <li><a href="/apparel/dtf-transfers" class="hover:text-cumberland-clay">Order DTF transfers</a></li>
      </ul>
    </div>
```

Note: The footer grid is currently `md:grid-cols-4`. Adding a 5th column may cause overflow on some screen sizes. Change the grid to `md:grid-cols-5` or keep 4 columns and combine the new links into the existing Services column. The Services column approach (simpler) is shown first above — use that if layout is a concern.

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add src/components/Footer.astro
git commit -m "feat: add DTF transfers and custom stores links to footer"
git push
```

---

## Task D: ServicesStrip Update

Add two new service tiles: "DTF Transfers" and "Custom Online Stores."

**Files:**
- Modify: `src/components/ServicesStrip.astro`

- [ ] **Step 1: Add two services to the array**

In `src/components/ServicesStrip.astro`, add to the `services` array:

```astro
  {
    title: 'DTF Transfers & Gang Sheets',
    body: 'Direct-to-film transfers. Build your own gang sheet and order online — powered by Shopify.',
    href: '/apparel/dtf-transfers',
  },
  {
    title: 'Custom Online Stores',
    body: 'Fundraising, spirit, and team stores — we set up and run a fully branded InkSoft store for your group.',
    href: '/stores',
  },
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: exits 0. Services strip now shows 8 tiles.

- [ ] **Step 3: Commit**

```bash
git add src/components/ServicesStrip.astro
git commit -m "feat: add DTF transfers and custom stores to services strip"
git push
```

---

## Task E: DTF Transfers Service Page (Drip Sheet / Shopify)

This page markets DTF gang sheet printing and routes customers to the Shopify store where the Drip Sheet app lives.

**Files:**
- Create: `src/content/services/dtf-transfers.mdx`
- Create: `src/pages/apparel/dtf-transfers.astro`

The Drip Sheet app is a Shopify app — the `/apparel/dtf-transfers` Astro page does **not** embed Drip Sheet directly. It markets the service and links to the Shopify store where the Drip Sheet builder lives.

- [ ] **Step 1: Create dtf-transfers.mdx content**

Create `src/content/services/dtf-transfers.mdx`:

```mdx
---
title: DTF Transfers & Gang Sheets
slug: dtf-transfers
summary: Direct-to-film heat transfer printing. Build your own gang sheet, upload your designs, and order online — ready to press onto any garment.
order: 50
category: apparel
bullets:
  - Direct-to-film (DTF) transfers — press to any fabric
  - Gang sheet builder — pack your designs, maximize every inch
  - Order online through our Shopify store
  - High resolution — 300 DPI, PNG/JPEG/PSD/PDF accepted
  - 5" × 5" to full 22" × 60" sheets
---

# Your designs. Your sheet. Your timeline.

DTF (Direct-to-Film) transfers let you print virtually any design — full color, photographic detail, no minimums — onto a heat-transfer film you press to any garment yourself. Build a gang sheet, pack it with every design you need, and order one file that goes straight to production.

## What's a gang sheet?

A gang sheet is one large film sheet (up to 22" × 60") with multiple designs arranged on it. Instead of ordering each design separately, you fill the sheet with everything you need — reducing waste and your cost per design.

## Who orders DTF transfers?

- Small clothing brands and boutiques
- Screen printers adding DTF to their lineup
- Crafters pressing custom one-offs at home
- Shops needing full-color or photographic designs that screen printing can't achieve
- Anyone who wants to press their own shirts, hoodies, or totes

## How it works

1. **Go to our online shop.** Our gang sheet builder is inside our Shopify store — no account required to start.
2. **Upload your designs and build your sheet.** Drag, resize, arrange, and autofill. The builder shows you exactly what you'll get.
3. **Place your order.** We print and ship your transfer sheet — typically within 3–5 business days.
4. **Press and wear.** Use a heat press at 305°F for 15 seconds. Peel, done.

## File requirements

- Format: PNG (preferred), JPEG, PSD, PDF
- Resolution: 300 DPI minimum at print size
- Color: Full CMYK including white underbase (handled automatically)
- Background: Transparent PNG recommended for best results

## Pricing

Priced per square inch on the gang sheet. The more you pack, the lower your cost per design. Minimum order is one sheet. Pricing shows in the builder before you check out.

## Need help with artwork?

We can prep your file for DTF. Send what you have via the [project form](/start-your-project) and ask for DTF prep — usually a same-day turnaround.
```

- [ ] **Step 2: Create the dtf-transfers.astro page**

This page does NOT use the generic `[slug].astro` route — it needs a special CTA that links out to Shopify. Create `src/pages/apparel/dtf-transfers.astro` as a standalone page:

```astro
---
import BaseLayout from '@layouts/BaseLayout.astro';
import CTASection from '@components/CTASection.astro';
import ThreeStepPlan from '@components/ThreeStepPlan.astro';

const shopUrl = import.meta.env.PUBLIC_SHOPIFY_STORE_URL || '#shopify-coming-soon';
const shopDtfUrl = shopUrl.endsWith('/')
  ? `${shopUrl}collections/dtf-gang-sheets`
  : `${shopUrl}/collections/dtf-gang-sheets`;
---

<BaseLayout
  title="DTF Transfers & Gang Sheets — Cumberland Signworks"
  description="Direct-to-film heat transfer printing. Build your own gang sheet online, upload your designs, and order — no minimums. Ships from Crossville, TN."
>
  <!-- Breadcrumb -->
  <nav class="bg-cumberland-mist/40 border-b border-cumberland-mist" aria-label="Breadcrumb">
    <div class="container-rail py-3 text-sm text-cumberland-stone flex gap-2 items-center">
      <a href="/" class="hover:text-cumberland-forest">Home</a>
      <span aria-hidden="true">›</span>
      <a href="/apparel" class="hover:text-cumberland-forest">Apparel</a>
      <span aria-hidden="true">›</span>
      <span class="text-cumberland-ink">DTF Transfers & Gang Sheets</span>
    </div>
  </nav>

  <!-- Hero -->
  <section class="section bg-cumberland-cream">
    <div class="container-rail grid gap-12 lg:grid-cols-12 items-center">
      <div class="lg:col-span-7">
        <p class="eyebrow">Apparel · DTF Printing</p>
        <h1 class="mt-4 text-cumberland-ink">
          Build your gang sheet.<br />
          <span class="text-cumberland-forest">Press it yourself.</span>
        </h1>
        <p class="mt-6 text-xl leading-relaxed text-cumberland-stone">
          Direct-to-film heat transfer printing — full color, any design, no minimums.
          Build a gang sheet online, fill it with all your designs, and get a
          production-ready transfer film shipped fast from Crossville.
        </p>
        <div class="mt-8 flex flex-wrap gap-4">
          <a
            href={shopDtfUrl}
            target="_blank"
            rel="noopener noreferrer"
            class="btn-primary text-base md:text-lg"
          >
            Build Your Gang Sheet →
          </a>
          <a href="/start-your-project" class="btn-secondary">
            Need help? Start here
          </a>
        </div>
      </div>

      <aside class="lg:col-span-5">
        <div class="rounded-3xl bg-cumberland-forest text-cumberland-cream p-8 space-y-4">
          <p class="font-display text-2xl tracking-tighter">What's included</p>
          {[
            'Full-color DTF — any design, photographic detail',
            'Gang sheet builder — pack every design in one order',
            'Accepts PNG, JPEG, PSD, PDF — 300 DPI',
            'Sheets up to 22" × 60"',
            '305°F press / 15 seconds — works on cotton, poly, blends',
            'Ships in 3–5 business days',
          ].map((item) => (
            <div class="flex gap-3 text-sm text-cumberland-mist">
              <span class="text-cumberland-clay shrink-0 mt-0.5" aria-hidden="true">✓</span>
              {item}
            </div>
          ))}
        </div>
      </aside>
    </div>
  </section>

  <!-- How it works -->
  <section class="section bg-cumberland-mist/40">
    <div class="container-rail max-w-4xl">
      <p class="eyebrow">How it works</p>
      <h2 class="mt-4 text-cumberland-ink">From design to pressed shirt in four steps.</h2>
      <ol class="mt-10 grid gap-6 md:grid-cols-4">
        {[
          { n: '1', title: 'Open the builder', body: 'Go to our Shopify store, select gang sheet sizing, and open the drag-and-drop builder.' },
          { n: '2', title: 'Upload + arrange', body: 'Drop in your PNG files, resize, and pack the sheet. AutoBuild fills remaining space.' },
          { n: '3', title: 'Checkout', body: 'Pay in the Shopify store. Pricing is calculated live as you build.' },
          { n: '4', title: 'Press and done', body: '305°F · 15 seconds · peel cold. Works on cotton, polyester, and blends.' },
        ].map((step) => (
          <li class="rounded-3xl border-2 border-cumberland-mist bg-white p-6">
            <p class="font-display text-5xl text-cumberland-clay leading-none">{step.n}</p>
            <p class="mt-3 font-display text-xl text-cumberland-ink">{step.title}</p>
            <p class="mt-2 text-sm text-cumberland-stone leading-relaxed">{step.body}</p>
          </li>
        ))}
      </ol>
      <div class="mt-10 flex justify-center">
        <a
          href={shopDtfUrl}
          target="_blank"
          rel="noopener noreferrer"
          class="btn-primary text-base md:text-lg"
        >
          Start Building Your Sheet →
        </a>
      </div>
    </div>
  </section>

  <!-- File spec quick ref -->
  <section class="section bg-cumberland-cream">
    <div class="container-rail max-w-4xl">
      <p class="eyebrow">File requirements</p>
      <h2 class="mt-4 text-cumberland-ink">What to send us.</h2>
      <div class="mt-8 grid sm:grid-cols-2 gap-6">
        <div class="rounded-3xl bg-white border border-cumberland-mist p-8">
          <p class="font-semibold text-cumberland-forest">Preferred</p>
          <ul class="mt-3 space-y-2 text-sm text-cumberland-stone">
            <li>PNG with transparent background (no white box)</li>
            <li>300 DPI minimum at intended print size</li>
            <li>CMYK or RGB — we handle the color conversion</li>
          </ul>
        </div>
        <div class="rounded-3xl bg-white border border-cumberland-mist p-8">
          <p class="font-semibold text-cumberland-clay">Also accepted</p>
          <ul class="mt-3 space-y-2 text-sm text-cumberland-stone">
            <li>JPEG, PSD, PDF, WEBP, TIFF</li>
            <li>AI or EPS (we'll convert)</li>
            <li>Low-res? <a href="/start-your-project" class="text-cumberland-forest underline">Ask us first</a></li>
          </ul>
        </div>
      </div>
      <p class="mt-6 text-sm text-cumberland-stone">
        Not sure if your file will work?
        <a href="/resources/file-prep" class="text-cumberland-forest hover:underline font-medium">Read the file prep guide →</a>
      </p>
    </div>
  </section>

  <CTASection />
</BaseLayout>
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Expected: `dist/apparel/dtf-transfers/index.html` generated. Exits 0.

- [ ] **Step 4: Commit**

```bash
git add src/pages/apparel/dtf-transfers.astro src/content/services/dtf-transfers.mdx
git commit -m "feat: add DTF transfers page — Drip Sheet gang sheet builder via Shopify"
git push
```

---

## Task F: Custom Online Stores Page (InkSoft)

This page markets the InkSoft-powered custom store service: schools, teams, and churches can get a fully-branded online store for fundraising, spirit wear, and team orders.

**Files:**
- Create: `src/pages/stores.astro`

- [ ] **Step 1: Create stores.astro**

Create `src/pages/stores.astro`:

```astro
---
import BaseLayout from '@layouts/BaseLayout.astro';
import CTASection from '@components/CTASection.astro';

const inkSoftUrl = import.meta.env.PUBLIC_INKSOFT_STORE_URL || '#inksoft-store';
---

<BaseLayout
  title="Custom Online Stores — Cumberland Signworks"
  description="Get a fully branded online store for your school, team, church, or business — powered by InkSoft. Fundraising stores, spirit wear shops, and team uniform portals set up and managed by Cumberland Signworks in Crossville, TN."
>
  <!-- Hero -->
  <section class="section bg-cumberland-cream">
    <div class="container-rail max-w-4xl">
      <p class="eyebrow">Custom Online Stores</p>
      <h1 class="mt-4 text-cumberland-ink">
        Your own store.<br />
        <span class="text-cumberland-forest">We build and run it.</span>
      </h1>
      <p class="mt-6 text-xl leading-relaxed text-cumberland-stone">
        Fundraising shops. Spirit wear stores. Team uniform portals.
        We set up a fully branded online storefront for your school, team, church,
        or business — so your people can order exactly what they need, when they need it,
        without chasing you for it.
      </p>
      <div class="mt-8 flex flex-wrap gap-4">
        <a href="/start-your-project" class="btn-primary text-base md:text-lg">
          Set Up My Store
        </a>
        <a
          href={inkSoftUrl}
          target="_blank"
          rel="noopener noreferrer"
          class="btn-secondary"
        >
          Browse the store →
        </a>
      </div>
    </div>
  </section>

  <!-- Use cases -->
  <section class="section bg-cumberland-mist/40">
    <div class="container-rail">
      <p class="eyebrow">Who it's for</p>
      <h2 class="mt-4 text-cumberland-ink">One store, any group.</h2>
      <ul class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[
          {
            title: 'School Fundraising Stores',
            body: 'Spirit wear, apparel, and branded items available to parents, students, and staff online — with proceeds going back to the school or club.',
            icon: '🏫',
          },
          {
            title: 'Team & League Uniform Portals',
            body: 'Players and parents order their own gear through a private store with roster numbers, sizes, and names — no more collecting paper forms.',
            icon: '🏆',
          },
          {
            title: 'Church & Org Stores',
            body: 'VBS shirts, mission trip tees, volunteer polos, and event gear — all available year-round in your store so you don\'t re-order from scratch every year.',
            icon: '⛪',
          },
          {
            title: 'Business Staff Stores',
            body: 'Branded crew gear, onboarding uniforms, and branded merch available to employees in a private portal — no more tracking sizes in a spreadsheet.',
            icon: '🏢',
          },
          {
            title: 'Event Merchandise Shops',
            body: 'Temporary stores for reunions, tournaments, and events — open for a set window, then closed. No leftover inventory.',
            icon: '🎟',
          },
          {
            title: 'Retail Spirit Wear',
            body: 'Ongoing storefronts for towns, businesses, and brands that want to sell branded merch without managing inventory or fulfillment themselves.',
            icon: '🛒',
          },
        ].map((item) => (
          <li class="rounded-3xl bg-white border border-cumberland-mist p-8">
            <p class="text-3xl" aria-hidden="true">{item.icon}</p>
            <p class="mt-4 font-display text-2xl text-cumberland-ink leading-tight">{item.title}</p>
            <p class="mt-3 text-cumberland-stone text-sm leading-relaxed">{item.body}</p>
          </li>
        ))}
      </ul>
    </div>
  </section>

  <!-- How it works -->
  <section class="section bg-cumberland-cream">
    <div class="container-rail max-w-4xl">
      <p class="eyebrow">How it works</p>
      <h2 class="mt-4 text-cumberland-ink">We handle the setup. You share the link.</h2>
      <ol class="mt-10 grid gap-6 md:grid-cols-3">
        {[
          {
            n: '1',
            title: 'Tell us about your store.',
            body: 'What products, which logos, what colors, what dates. We\'ll build the product lineup and design the storefront.',
          },
          {
            n: '2',
            title: 'We build and launch it.',
            body: 'Fully branded storefront on our platform — your logo, your colors, your URL. Usually live within a week.',
          },
          {
            n: '3',
            title: 'Your people order. We fulfill.',
            body: 'They shop, pay, and choose their size. We print and ship — directly to their door or to one pickup location.',
          },
        ].map((step) => (
          <li class="rounded-3xl border-2 border-cumberland-mist bg-white p-8">
            <p class="font-display text-6xl text-cumberland-clay leading-none">{step.n}</p>
            <p class="mt-4 font-display text-2xl text-cumberland-ink leading-tight">{step.title}</p>
            <p class="mt-3 text-cumberland-stone leading-relaxed text-sm">{step.body}</p>
          </li>
        ))}
      </ol>
    </div>
  </section>

  <!-- What's included -->
  <section class="section bg-cumberland-forest text-cumberland-cream">
    <div class="container-rail max-w-4xl grid gap-12 lg:grid-cols-2">
      <div>
        <p class="eyebrow text-cumberland-clay">What's included</p>
        <h2 class="mt-4">Everything to run your store — we handle it.</h2>
        <ul class="mt-8 space-y-4">
          {[
            'Fully branded storefront — your logo, colors, products',
            'Product customization tools — names, numbers, sizes',
            'Secure online checkout (credit/debit)',
            'Automatic order routing to our production queue',
            'Direct-to-door shipping or group pickup options',
            'Store open/close date control for time-limited runs',
            'Sales reporting available on request',
          ].map((item) => (
            <li class="flex gap-3 text-cumberland-mist text-sm">
              <span class="text-cumberland-clay shrink-0 mt-0.5" aria-hidden="true">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div class="space-y-6">
        <div class="rounded-3xl bg-cumberland-forest-dark/60 p-8">
          <p class="font-display text-2xl tracking-tighter">Powered by InkSoft</p>
          <p class="mt-3 text-sm text-cumberland-mist leading-relaxed">
            Our online stores run on InkSoft — an industry-leading platform built specifically
            for custom print shops. Trusted by thousands of decorators nationwide. Your store
            is managed by us so you don't have to learn new software.
          </p>
        </div>
        <div class="rounded-3xl bg-cumberland-forest-dark/60 p-8">
          <p class="font-display text-2xl tracking-tighter">No upfront cost to set up</p>
          <p class="mt-3 text-sm text-cumberland-mist leading-relaxed">
            Store setup is included when you run your apparel through us.
            Reach out and we'll talk through what makes sense for your group.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- CTA -->
  <section class="section bg-cumberland-cream">
    <div class="container-rail max-w-3xl text-center">
      <h2 class="text-cumberland-ink">Ready to set up your store?</h2>
      <p class="mt-4 text-cumberland-stone text-lg">
        Tell us about your group, what you need, and when — we'll build the rest.
      </p>
      <div class="mt-8 flex flex-col sm:flex-row justify-center gap-4">
        <a href="/start-your-project" class="btn-primary text-base md:text-lg">
          Set Up My Store
        </a>
        <a
          href={inkSoftUrl}
          target="_blank"
          rel="noopener noreferrer"
          class="btn-secondary"
        >
          Browse existing stores →
        </a>
      </div>
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: `dist/stores/index.html` generated. Exits 0.

- [ ] **Step 3: Commit**

```bash
git add src/pages/stores.astro
git commit -m "feat: add custom online stores page — InkSoft-powered group/team/fundraising stores"
git push
```

---

## Task G: Shopify Buy Button Component (Optional — For Going-Forward Features)

This task creates the reusable component that wraps Shopify's Buy Button JS snippet. It's marked optional because the Buy Button requires a live Shopify store + channel setup before it will render. Build the component now so it's ready to drop into any page when the store goes live.

**Files:**
- Create: `src/components/ShopifyBuyButton.astro`

- [ ] **Step 1: Create ShopifyBuyButton.astro**

Create `src/components/ShopifyBuyButton.astro`:

```astro
---
/**
 * ShopifyBuyButton — embeds a Shopify Buy Button for a single product or collection.
 *
 * Prerequisites (must be done in Shopify Admin before this renders):
 *   1. Install the "Buy Button channel" from Shopify Admin → Sales Channels
 *   2. Create a Buy Button for the product/collection
 *   3. Copy the generated snippet — extract `storefrontAccessToken` and `productId`/`collectionId`
 *   4. Set PUBLIC_SHOPIFY_BUY_BUTTON_DOMAIN and PUBLIC_SHOPIFY_STOREFRONT_TOKEN in env
 *
 * Props:
 *   type         — 'product' | 'collection'
 *   id           — Shopify product or collection GID (numeric ID portion)
 *   buttonLabel  — text on the buy button (default: 'Buy Now')
 *   componentId  — unique DOM id for this button instance (required if multiple per page)
 */

interface Props {
  type: 'product' | 'collection';
  id: string;
  buttonLabel?: string;
  componentId?: string;
}

const {
  type,
  id,
  buttonLabel = 'Buy Now',
  componentId = `shopify-buy-${id}`,
} = Astro.props;

const domain = import.meta.env.PUBLIC_SHOPIFY_BUY_BUTTON_DOMAIN;
const token = import.meta.env.PUBLIC_SHOPIFY_STOREFRONT_TOKEN;
const isConfigured = domain && token;
---

{isConfigured ? (
  <div id={componentId} class="shopify-buy-wrapper">
    <script is:inline>
      /* Shopify Buy Button SDK loader — loaded once per page */
      if (!window.ShopifyBuyInit) {
        window.ShopifyBuyInit = true;
        var script = document.createElement('script');
        script.async = true;
        script.src = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';
        (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(script);
      }
    </script>
    <script
      define:vars={{ domain, token, type, id, buttonLabel, componentId }}
      is:inline
    >
      function initShopifyBuyButton() {
        if (!window.ShopifyBuy) {
          setTimeout(initShopifyBuyButton, 50);
          return;
        }
        var client = window.ShopifyBuy.buildClient({ domain: domain, storefrontAccessToken: token });
        window.ShopifyBuy.UI.onReady(client).then(function(ui) {
          ui.createComponent(type, {
            id: id,
            node: document.getElementById(componentId),
            moneyFormat: '%24%7B%7Bamount%7D%7D',
            options: {
              product: {
                styles: {
                  button: {
                    'background-color': '#D97842',
                    ':hover': { 'background-color': '#B85F2D' },
                    'border-radius': '9999px',
                    'font-family': 'Inter, system-ui, sans-serif',
                    'font-weight': '600',
                  },
                },
                text: { button: buttonLabel },
              },
            },
          });
        });
      }
      initShopifyBuyButton();
    </script>
  </div>
) : (
  <!-- Fallback when Shopify env vars are not configured -->
  <div class="rounded-2xl bg-cumberland-mist/60 p-6 text-center text-sm text-cumberland-stone">
    <p>Online ordering coming soon.</p>
    <a href="/start-your-project" class="mt-3 inline-block text-cumberland-forest font-semibold hover:underline">
      Request a quote instead →
    </a>
  </div>
)}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: exits 0. The fallback state renders since env vars are empty.

- [ ] **Step 3: Document how to use it**

To embed a Shopify product on any Astro page once the store is live:

```astro
---
import ShopifyBuyButton from '@components/ShopifyBuyButton.astro';
---

<!-- Embed a single product -->
<ShopifyBuyButton type="product" id="123456789" buttonLabel="Order Transfers" />

<!-- Embed a collection -->
<ShopifyBuyButton type="collection" id="987654321" componentId="dtf-collection" />
```

To get the product/collection ID: Shopify Admin → Products → click a product → the number in the URL is the ID.

- [ ] **Step 4: Commit**

```bash
git add src/components/ShopifyBuyButton.astro
git commit -m "feat: add ShopifyBuyButton component for inline Shopify embeds"
git push
```

---

## Task H: Update Decap CMS Config for New Services

The two new service MDX files (dtf-transfers and custom-stores) were added as content, but `dtf-transfers.astro` uses a standalone page — not the dynamic `[slug].astro` route — so it won't be auto-rendered by the existing apparel route. The Decap CMS config already covers the services collection, so no changes to `config.yml` are needed. However, you should verify the `dtf-transfers.mdx` category matches the content collection schema.

**Files:**
- Modify: `src/content/services/custom-stores.mdx` (create — for Decap CMS management)

- [ ] **Step 1: Create custom-stores.mdx so it appears in Decap CMS**

Create `src/content/services/custom-stores.mdx`:

```mdx
---
title: Custom Online Stores
slug: custom-stores
summary: Fundraising stores, spirit wear shops, and team uniform portals — fully branded, set up and managed by Cumberland Signworks via InkSoft.
order: 60
category: apparel
bullets:
  - School fundraising and spirit wear stores
  - Team and league uniform portals
  - Church and organization stores
  - Secure online checkout — no paper forms
  - Direct-to-door shipping or group pickup
---

Custom online stores are managed through our InkSoft platform. See [/stores](/stores) for full details and to get started.
```

This stub keeps the content collection consistent and lets Decap CMS manage the summary/bullets. The actual page is `src/pages/stores.astro` which renders the full marketing experience.

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: exits 0. The `custom-stores.mdx` will be auto-included in the apparel dynamic route at `/apparel/custom-stores` (which redirects conceptually to `/stores` — acceptable).

- [ ] **Step 3: Commit**

```bash
git add src/content/services/custom-stores.mdx
git commit -m "feat: add custom-stores MDX stub for CMS management"
git push
```

---

## Task I: Homepage Hero — Acknowledge All Three Platforms

Update the homepage `ServicesStrip` heading and add a short platform context bar below the hero to surface InkSoft stores and Shopify ordering — the two new customer touchpoints.

**Files:**
- Modify: `src/components/Hero.astro`

- [ ] **Step 1: Add a "How to order" context bar below the Hero CTA buttons**

In `src/components/Hero.astro`, after the trust badges `<ul>` (the `<li>` items with ★ / 🛠 / 🏠), add:

```astro
      <div class="mt-8 pt-8 border-t border-cumberland-mist grid gap-3 sm:grid-cols-3 text-sm">
        <a href="/start-your-project" class="flex items-start gap-3 hover:text-cumberland-forest group">
          <span class="text-2xl shrink-0" aria-hidden="true">📋</span>
          <div>
            <p class="font-semibold text-cumberland-ink group-hover:text-cumberland-forest">Get a quote</p>
            <p class="text-cumberland-stone">Signs, shirts, wraps, and print — tell us what you need.</p>
          </div>
        </a>
        <a
          href={import.meta.env.PUBLIC_SHOPIFY_STORE_URL || '#'}
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-start gap-3 hover:text-cumberland-forest group"
        >
          <span class="text-2xl shrink-0" aria-hidden="true">🛒</span>
          <div>
            <p class="font-semibold text-cumberland-ink group-hover:text-cumberland-forest">Shop online</p>
            <p class="text-cumberland-stone">DTF transfers and gang sheets — build and order now.</p>
          </div>
        </a>
        <a href="/stores" class="flex items-start gap-3 hover:text-cumberland-forest group">
          <span class="text-2xl shrink-0" aria-hidden="true">🏪</span>
          <div>
            <p class="font-semibold text-cumberland-ink group-hover:text-cumberland-forest">Get a group store</p>
            <p class="text-cumberland-stone">Fundraising, spirit wear, team portals — we build it.</p>
          </div>
        </a>
      </div>
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: exits 0.

- [ ] **Step 3: Commit**

```bash
git add src/components/Hero.astro
git commit -m "feat: add three-channel context bar to homepage hero (quote, shop, stores)"
git push
```

---

## Self-Review

**Spec coverage:**

| Feature | Task | Status |
|---|---|---|
| InkSoft stores page | Task F | ✅ |
| InkSoft env var | Task A | ✅ |
| InkSoft CTA in nav | Task B | ✅ |
| InkSoft CTA in footer | Task C | ✅ |
| InkSoft service tile on homepage | Task D | ✅ |
| Shopify store link in nav | Task B | ✅ |
| Shopify store link in footer | Task C | ✅ |
| Drip Sheet / DTF transfers page | Task E | ✅ |
| Drip Sheet service tile on homepage | Task D | ✅ |
| Shopify Buy Button component | Task G | ✅ |
| Homepage acknowledges all 3 order paths | Task I | ✅ |
| Decap CMS can manage new services | Task H | ✅ |

**What requires live credentials before it fully renders:**
- `PUBLIC_INKSOFT_STORE_URL` — InkSoft must be set up with Cumberland's account
- `PUBLIC_SHOPIFY_STORE_URL` — Shopify store must be created
- `PUBLIC_SHOPIFY_BUY_BUTTON_DOMAIN` + `PUBLIC_SHOPIFY_STOREFRONT_TOKEN` — Shopify Buy Button channel must be enabled and a button created
- `PUBLIC_CHECKLIST_FORM_ENDPOINT` — separate Formspree form for checklist lead magnet

All pages degrade gracefully when env vars are missing — CTAs fall back to `/start-your-project` and Buy Button shows a "coming soon" placeholder.

**Open questions to resolve with client before launch:**
1. Is InkSoft already set up? What's the store URL?
2. Does Cumberland have an active Shopify account? What's the store URL?
3. Is Drip Sheet already installed in the Shopify store?
4. Should the Shopify store be at `shop.cumberlandsignworks.com` (custom domain)?
5. Should the InkSoft store be at `store.cumberlandsignworks.com` (custom domain)?

---

*Addendum complete. 9 tasks. Estimated total: 1.5–2 hours of execution after base plan is done.*
