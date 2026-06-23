# Cumberland Signworks — Buildout Handoff (for Claude Code)

**Purpose:** the executable "definition of done" for finishing the "Shop Floor" redesign. The homepage is built as the reference implementation; this doc tells Claude Code how to extend that pattern across product pages, wire page transitions, and finish the remaining pages **without re-deriving design decisions.**

**Read order:** `docs/AWWWARDS_REDESIGN_PLAN.md` (strategy + art direction) → this doc (build spec) → `CLAUDE.md` (voice, never violate) → `PROJECT.md` (StoryBrand source of truth).

**Branch:** all work continues on `redesign/shop-floor`.

---

## 1. Current state — what's done vs. not

**DONE (committed `9d3eb36`, build passes, 0 type errors):**
- Design tokens locked in `tailwind.config.mjs`: `ink #0A0A0A`, `paper #F7F5F0`, `cream #FFFFFF`, accent `clay #FF4D1C` / `clay-dark #D63A0E`, `hairline #2A2A2A`; `font-mono` (Space Mono).
- Accent is decoupled: change `clay` + `clay-dark` in Tailwind **and** `--flare` / `--flare-deep` in `src/styles/global.css`. Everything (CTAs, halftone canvas, focus, underlines) reads from those.
- Motion system in `global.css` (`@layer utilities`): `.cursor-*`, `[data-reveal]`, `[data-reveal-stagger]`, `.kinetic`, `.dot-resolve`, `.marquee`, `.duotone`, full `prefers-reduced-motion` freeze.
- Motion islands: `src/components/motion/HalftoneCanvas.astro` (accent-driven CMYK-dot field, DPR-capped, pauses off-screen) and `src/components/motion/MotionRuntime.astro` (cursor, magnetic, marquee velocity — homepage only).
- Site-wide scroll-reveal observer + no-JS fallback in `BaseLayout.astro`; Space Mono `<link>` in head.
- **Full homepage re-skin**: Hero, Problem, Guide, ThreeStepPlan, ServicesStrip, Stakes, Success, ProofWall, RecentWork, CTASection — all in ink/paper editorial with numbered rail labels and real shop photos.
- **View Transitions wired** (committed `17a9c1d`): `<ViewTransitions/>` in `BaseLayout` (default cross-fade route transition). All three motion scripts — the site-wide scroll-reveal observer, `MotionRuntime`, and `HalftoneCanvas` — rebound to `astro:page-load` with an `AbortController` reset per navigation (no listener/rAF accumulation; loops bail on `signal.aborted`). Reduced-motion guard added for `::view-transition` pseudos. **Verified** home→/signs→home: halftone + cursor re-init on return, cursor tears down off-home, 0 console errors. This unblocks §4/§5 (category + service pages can now add `transition:name` morph anchors).

**NOT DONE (this doc covers it):**
- **Signature orange route-wipe (§3.2) — deferred enhancement.** Baseline is Astro's default cross-fade (live + reduced-motion safe). The flat-orange clip-wipe is NOT built yet: doing it to the "never feels like a load" bar needs visual iteration in a browser. Pick it up as a small polish task. (The §3.6 script-rebinding it depended on is done.)
- **Category index pages** (`/apparel`, `/signs`, `/vehicle-wraps`, `/print`, `/stores`) — still old layout (white sections, rounded cards). They partially inherit orange/paper but are visually inconsistent.
- **Service detail template** (`ServicePageLayout.astro`) — old layout.
- **About** (team bios), **Portfolio** (collection empty), **Contact** (water-tower map), **/resources/checklist** lead magnet — not re-skinned / not built.
- Real testimonials still placeholder (`src/content/testimonials/featured.json`).
- Several **catalog gaps** — see §7.

---

## 2. Page tiers (governs how much motion each page gets)

| Tier | Pages | Motion budget |
|---|---|---|
| **Showcase** | `/` (done), `/portfolio`, `/about`, category index pages | Full: dot-resolve, reveals, marquee, shared-element transition morph. Cursor runtime optional (homepage has it; category/portfolio may add it). |
| **Conversion** | `/start-your-project`, service detail pages, `/contact`, `/resources/*` | Lean: reveals + page wipe only. **No cursor runtime, no heavy morph.** LCP < 1.8s. |

Reveals are wired globally in `BaseLayout`, so any page may use `data-reveal` freely. The cursor/magnetic/marquee runtime (`MotionRuntime`) is opt-in per page — include it only on Showcase pages.

---

## 3. RECOMMENDED transition system (decision + reasoning)

**Recommendation: tiered "shared-element morph + orange wipe."** Rationale — the morph between a category card and its service hero is the high-craft moment award juries reward, but the quote funnel must never wait on animation. Tiering gets both: spectacle where it helps, instant where it converts.

### 3.1 Wire it
1. `astro.config.mjs` — no change needed (View Transitions is an Astro core feature, not an integration).
2. `BaseLayout.astro` head — add the directive:
   ```astro
   ---
   import { ViewTransitions } from 'astro:transitions';
   ---
   <head>
     ...
     <ViewTransitions />
   </head>
   ```

### 3.2 Default: flat-orange route wipe (all pages)
Add to `global.css`. Keep it ≤ 350ms so it never feels like a load:
```css
@keyframes flare-wipe-in { from { clip-path: inset(0 0 100% 0); } to { clip-path: inset(0); } }
::view-transition-old(root) { animation: none; } /* old page holds */
::view-transition-new(root) { animation: none; }
/* orange sweep overlay */
::view-transition-group(root) { animation-duration: 0.35s; }
```
Simplest robust version: use Astro's built-in `transition:animate="fade"` on `<main>` as the baseline, plus a thin orange bar element animated on `astro:before-swap`. Keep the wipe element `aria-hidden`.

### 3.3 Showcase morph: category card ↔ service hero
Apply a **deterministic `transition:name`** to the two shared elements so they morph across the navigation. Convention (use the service `slug`):
- Hero image: `transition:name={`svc-img-${slug}`}`
- Service title: `transition:name={`svc-title-${slug}`}`

The **same names** must appear on the card (index page) and the hero (detail page). Example — on the category index card and the service hero `<Image>`:
```astro
<Image src={heroImage} transition:name={`svc-img-${slug}`} ... />
<h1 transition:name={`svc-title-${slug}`}>{title}</h1>
```
Astro matches identical names between pages and tweens position/size automatically. Names must be **unique per page** — only render the morph names on the card the user is most likely to click, or scope by ensuring each slug appears once per page.

### 3.4 Conversion route: no morph
On `/start-your-project` (and CTAs that jump straight to it), opt out so the form paints instantly:
```astro
<a href="/start-your-project" transition:animate="none">Start Your Project</a>
```

### 3.5 Reduced motion
Astro respects `prefers-reduced-motion` for built-in animations. Add a belt-and-suspenders rule:
```css
@media (prefers-reduced-motion: reduce) {
  ::view-transition-group(*),
  ::view-transition-old(*),
  ::view-transition-new(*) { animation: none !important; }
}
```

### 3.6 ⚠️ CRITICAL caveat — re-init scripts after navigation
With `<ViewTransitions/>`, Astro does SPA-style client navigation, so **module `<script>`s run once and do NOT re-run on subsequent navigations.** `MotionRuntime` and `HalftoneCanvas` will silently die after the first client-side nav unless their init is bound to Astro's lifecycle event. Refactor both so init runs on load **and** on every navigation:
```js
function init() { /* existing setup */ }
document.addEventListener('astro:page-load', init); // fires on first load + every nav
```
Also guard against double-binding (e.g., a `data-bound` flag) since `astro:page-load` fires on initial load too. This is the #1 thing that breaks View-Transition retrofits — do it first and verify by navigating home → signs → home and confirming the cursor + halftone still run.

---

## 4. Category index page template (Showcase)

Re-skin `/apparel`, `/signs`, `/vehicle-wraps`, `/print`, `/stores` to match the homepage. Structure:

1. **Ink hero band** (reuse the homepage hero pattern, smaller): `HalftoneCanvas class="opacity-40"`, mono rail label (e.g. `SIGNS & BANNERS`), kinetic `<h1>` (keep existing category headline copy, e.g. *"A sign that stops people. Not blends in."*), sub, primary CTA `Start Your Project` + ghost `Talk to us first`. Trust strip optional.
2. **Service index** on `paper` — the editorial numbered list pattern from `ServicesStrip.astro` (orange hover sweep), one row per service in that category, each row carrying the `transition:name` morph anchors (§3.3). Pull rows from `getCollection('services', d => d.category === X)` sorted by `order`.
3. `ThreeStepPlan` (reuse) → `CTASection` (reuse).

Build a single reusable `CategoryHero.astro` so all five indexes share it; pass `{ label, headline, accentWord, sub }` props.

---

## 5. Service detail template (Conversion-leaning)

Re-skin `ServicePageLayout.astro` (every service MDX renders through it). Keep the SB7 micro-pattern from `CLAUDE.md`:

1. **Hero**: `paper` or split ink/paper. Mono breadcrumb (`SIGNS / STOREFRONT SIGNS`), `<h1>` = the service `title` with `transition:name` anchor, `summary` as sub, `heroImage` with `.dot-resolve` + `transition:name` anchor, primary CTA.
2. **"What's included"** — the `bullets` array as a mono-labelled list (reuse the Problem-section row style).
3. **MDX `<Content/>`** in a prose column (keep `@tailwind/typography`, retoken to ink/paper).
4. **Mini proof** — one category-relevant testimonial (filter `testimonials` by `service`).
5. **Stakes mini-block** (one short paragraph) → `CTASection`.

Motion budget: reveals + dot-resolve hero only. **Do not** add `MotionRuntime` here.

---

## 6. Per-service hero image map

Source files live in `Assets/CumberlandSignworks/`. Curate each into `src/assets/photos/` with the semantic name below (so `astro:assets` optimizes them), then set `heroImage` in each service's MDX frontmatter. ✅ = already curated into `src/assets/photos/`. ⚠️ = needs a better real photo or owner confirmation of subject.

| Service (slug) | Category | Source file | Target name |
|---|---|---|---|
| team-uniforms | apparel | `NAT Game.jpg` | apparel-team-uniforms.jpg ⚠️ confirm |
| schools-churches | apparel | `CCHS SMHS hats.jpg` | apparel-schools-churches.jpg |
| business-branded | apparel | `charlottes.jpg` | apparel-business-branded.jpg ⚠️ confirm |
| hats-embroidery | apparel | ✅ `apparel-embroidered-hats-wall.jpg` | (in place) |
| custom-stores | apparel | `Webstore Graphics.jpg` | apparel-custom-stores.jpg |
| storefront | signs | ✅ `storefront-1776-coffee.jpg` (alt `storefront-plateau-family-dentistry.jpg`) | (in place) |
| yard-real-estate | signs | ⚠️ no clean yard-sign photo in library — request one; temp use `signs-cchs-school.jpg` | signs-yard-real-estate.jpg ⚠️ |
| banners | signs | ✅ `banners-retractable.jpg` | (in place) |
| window-graphics | signs | `window perf.jpg` (alt ✅ `interior-wall-graphics.jpg`) | signs-window-graphics.jpg |
| full-wraps | vehicle-wraps | `truck wrap.jpg` | vehicle-full-wraps.jpg |
| partial-lettering | vehicle-wraps | ✅ `vehicle-trailer-decals.jpg` | (in place) |
| fleet | vehicle-wraps | `Sandbaggers.jpg` | vehicle-fleet.jpg ⚠️ confirm |

Homepage feature images already curated: `vehicle-trailer-decals`, `csw-shop-building-snow`, `storefront-1776-coffee`, `apparel-embroidered-hats-wall`, plus the existing `tommys-*`, `selk-*`, `ah-roberts-*`, `post-*`.

---

## 7. Catalog gaps to confirm with the client (don't guess)

These are real inconsistencies between the deck, the homepage marquee, and the content collection:
1. **Laser engraving** — in the deck and the homepage marquee, but **no service page, no category, not in the `category` enum.** `Laser Engraving.jpg` exists. Decide: add as a service (likely under a new `print`/`promo` category) or drop from the marquee.
2. **`print` category is empty** — the enum allows `print` and `/print.astro` exists, but there are **zero** `category: print` service MDX files. Add business-cards/flyers/short-run services, or remove the category.
3. **`custom-stores` is `category: apparel`** but links to `/stores` (a standalone page, not `/apparel/custom-stores`). Decide canonical URL + category.
4. **Decap CMS** (`public/admin/config.yml`) must gain a `heroImage` field for services once images are added, or owner edits will strip them.
5. **Promotional products / "merch"** themes from the deck (3,400 impressions stat, fundraising) — decide whether they get dedicated pages.

---

## 8. Remaining pages

- **About** — family-owned, 23-yr story; team grid from real staff photos in `Assets/CumberlandSignworks/`: `Amy`, `Ross`, `cynthia`, `wayne`, `Elissa`, `Lilly Mel`, `Bennett`, `Bloom`, `Jordan`, `Mel E David` (Melissa McClung = owner/presenter). Add **Jeremiah** as a deliberate no-photo "always working in the background :)" card (from the deck). Include the **water-tower location story** (deck slide 16) as a playful map moment. ⚠️ Confirm names/roles/spellings with owner before publishing.
- **Portfolio** — `portfolio` collection is **empty**; build 4–6 case studies from real jobs (Cumberland Fellowship sign, Little Friends Play trailer, 1776 Coffee, A.H. Roberts, Selk, Tommy's). Duotone→color grid + detail pages with `transition:name` morph.
- **Contact** — water-tower landmark + map, click-to-call, hours (M–F 9–4 per schema).
- **/resources/checklist** — lead-magnet landing page for the PDF (per PROJECT.md §5.10).
- **Testimonials** — replace `featured.json` placeholders with 12–15 real verbatims (Google/Facebook/Birdeye), with `source` + `rating`.

---

## 9. Build / test conventions

- **Node 20** (`.nvmrc`). `npm install`, `npm run dev` (localhost:4321), `npm run build`, `npx astro check`.
- **Acceptance per page:** `astro check` 0 errors; build succeeds; reveals visible with JS off (no-JS fallback); `prefers-reduced-motion` freezes all motion; keyboard focus shows the orange ring; no orange small-body-text (accent is large-text/UI only — AA).
- **Lighthouse (mobile):** Showcase ≥ 90 / LCP < 2.5s; Conversion ≥ 95 / LCP < 1.8s.
- **Headline LCP:** the kinetic `<h1>` is real text animated with CSS — keep it crawlable; never bake headlines into the canvas or images.
- **Sandbox note (only if building in this hosted env):** the repo mount blocks unlinking macOS-owned files, so in-place `astro build` fails on cache cleanup and `git` lock removal. Workarounds used here: build from a `/tmp` copy with `cacheDir`/`vite.cacheDir` redirected, and commit with `GIT_INDEX_FILE=/tmp/idx`. On a normal macOS checkout none of this is needed; if git complains about a stale lock, `rm -f .git/index.lock` once.

---

## 10. Ordered task list for Claude Code

1. ✅ **DONE (`17a9c1d`)** — Wired View Transitions + rebound scripts to `astro:page-load` (§3.1, §3.6). Verified cursor + halftone survive home→signs→home.
2. ⏳ **Reduced-motion rule DONE (§3.5); orange wipe DEFERRED (§3.2)** — baseline cross-fade is live. Build the orange clip-wipe as a browser-verified polish task.
3. Build `CategoryHero.astro`; re-skin the 5 category index pages (§4) with morph anchors.
4. Re-skin `ServicePageLayout.astro` (§5) with morph anchors; retoken breadcrumb/prose to ink/paper.
5. Curate per-service hero images (§6); add `heroImage` to each MDX + the Decap field (§7.4).
6. Re-skin About (team grid + water-tower) and Contact (§8).
7. Build Portfolio collection + grid + case-study detail pages with morph (§8).
8. Re-skin `/resources/checklist`; replace testimonials with real verbatims (§8).
9. Resolve catalog gaps (§7) per owner answers.
10. Full QA pass against §9 acceptance + Lighthouse; then prep Awwwards/CSSDA/FWA submission from the plan's "Shop Floor" narrative.

---

## 11. Decisions to confirm before/while building
- Catalog gaps §7 (laser, print category, custom-stores URL, promo pages).
- Per-service ⚠️ images §6 and a yard-sign photo.
- About team names/roles/spellings §8.
- Accent stays flare-orange (placeholder) — or swap (two-token change) before the product pass.

*End of handoff.*
