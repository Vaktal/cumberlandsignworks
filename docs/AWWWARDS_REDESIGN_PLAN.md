# Cumberland Signworks — Awwwards-Caliber Redesign Plan

**Client:** Cumberland Signworks, LLC — Crossville, TN (founded 2003, family-owned)
**Prepared:** June 13, 2026
**Builds on:** `PROJECT.md` (StoryBrand strategy) + `CLAUDE.md` (voice rules). This plan does **not** replace them — it elevates the *visual + interaction layer* on top of the existing conversion architecture.
**Ambition setting:** **Full immersive** — we are going for the trophy. Submit to Awwwards (Site of the Day target), CSSDA, FWA.
**Palette decision:** Bold black & white editorial base + **one** confident accent: **Signworks Safety-Orange `#FF4D1C`** (recommended — see §2). Competitors hide behind red/blue/black; orange owns a lane and literally reads as "signage / wet paint / high-vis."
**Deliverable status:** This document + a live coded hero prototype (`hero-prototype.html`).

---

## 0. The core tension (and how we resolve it)

An Awwwards site wants heavy motion, WebGL, and experimental navigation. A local print shop's site must convert a stressed coach or shop owner into a quote in under 30 seconds and rank in the Crossville local pack. These pull against each other. **The resolution is "two-speed architecture":**

- **The Showcase Layer** — the homepage, portfolio, and About page get the full immersive treatment. These are the pages a juror, a referral, or a first-time visitor lands on. This is where we win the award.
- **The Conversion Layer** — `/start-your-project`, service pillar pages, contact, and resources stay lean, fast, and frictionless. A wrapped-truck buyer who already decided does not get a WebGL detour between them and the form.

Every immersive technique below is **progressively enhanced**: the page is fully usable, readable, and submittable with JavaScript disabled or `prefers-reduced-motion` set. Motion is the garnish, never the meal. This is also how award juries actually score — they reward restraint and intent over spectacle-for-its-own-sake.

---

## 1. Creative concept — "The Shop Floor"

Most sign-company sites look like clip-art catalogs. We do the opposite: we make the **craft** the hero. The big idea is **"The Shop Floor"** — the site feels like you walked into a working print shop where ink is wet, vinyl is being weeded, and a truck is half-wrapped in the bay.

Three pillars hold the concept together:

1. **Halftone as a signature.** Screen printing *is* dots. We use an animated halftone/CMYK-dot texture as the recurring motif — in the hero, in section transitions, in image reveals (images resolve from coarse dots to full photo on scroll). It is on-brand, it is unmistakably "print," and almost no competitor owns it.
2. **Kinetic type as signage.** The shop's whole job is bold, legible type that stops you in a parking lot. The site's typography behaves like signage: oversized, high-contrast, set in motion. Bebas Neue (already in the stack) does the heavy display lifting; Manrope carries the body.
3. **Real work, full-bleed.** The repo already has 60+ real shop photos (wraps, storefront signs, hats, banners, the building in snow, the team). No stock, ever (per `CLAUDE.md`). The award comes from *real* Crossville work shown at scale, not invented gloss.

**One-line creative direction:** *Industrial editorial — a working-shop documentary rendered as a high-contrast, orange-flagged, kinetic-type experience.*

---

## 2. Art direction & visual system

### 2.1 Palette

| Token | Hex | Role |
|---|---|---|
| `ink` | `#0A0A0A` | Near-black. Backgrounds, body text. |
| `paper` | `#F7F5F0` | Warm off-white (not pure white — reads as paper stock, kinder on the eyes than `#FFF`). |
| `pure` | `#FFFFFF` | Reserved for text on ink and max-contrast moments. |
| **`flare`** | **`#FF4D1C`** | **The accent.** CTAs, active states, the moving "ink" in the hero, link underlines, focus rings, kinetic highlights. Used at ~5–10% surface area — scarcity is what makes it pop. |
| `flare-deep` | `#D63A0E` | Hover/pressed state for `flare`. |
| `smoke` | `#6B7280` | Secondary text, eyebrows, metadata. |
| `hairline` | `#E2DED7` | Borders, dividers, grid rails on paper. |

This is a near-drop-in for the existing `tailwind.config.mjs` (which already collapses everything to black/gray/white and explicitly says *"swap here when accent locked"*). We lock `clay` → `#FF4D1C`.

**Why orange, specifically:** safety-orange is the color of cones, high-vis vests, wet-paint signs, and "CAUTION" tape — the exact semiotic field a sign shop lives in. It is warm and Tennessee-friendly, it photographs well against the shop's existing imagery, and it is the single most under-used color in the local-signage competitive set.

> If the client rejects orange, the only swap needed is two tokens. Fallback recommendation: deep forest `#163D2B` (heritage/craft read). The whole motion/type system is color-agnostic.

### 2.2 Typography

- **Display / Signage:** **Bebas Neue** (already installed). Pushed to extreme scale — hero H1 at `clamp(4rem, 14vw, 18rem)`. Tightly tracked, set in ALL CAPS for hero/section heads. This is the "billboard" voice.
- **Body / UI:** **Manrope Variable** (already installed). 16–20px, generous line-height, comfortable for the stressed reader skimming on a phone in a gym parking lot.
- **Accent / Mono (new, optional):** a monospace (e.g. **Space Mono** or **JetBrains Mono**) for metadata, spec callouts, file-prep numbers, and "shop ticket" details — reinforces the working-shop feel. ~3kb subset, defer-loaded.

Type is treated as a *layout material*, not decoration: oversized numerals for the 3-step plan, a scrolling type marquee of services, headlines that clip-reveal on scroll.

### 2.3 Layout & grid

- **Asymmetric editorial grid** with a visible left rail (thin `hairline` rules, mono labels like `01 — APPAREL`). Feels like a printed broadside / shop ledger.
- **Full-bleed photography** broken by tight-tracked captions.
- Generous negative space on `paper`; dense, high-contrast blocks on `ink`. The alternation creates rhythm and gives the eye places to rest between motion moments.

### 2.4 Imagery treatment

- Hero + section images **resolve from a halftone-dot state to full photo** as they enter the viewport (the signature move).
- Duotone (ink + flare) hover state on portfolio thumbnails.
- Real captions with mono metadata: `CUMBERLAND FELLOWSHIP · CHANNEL LETTERS · CROSSVILLE TN`.

---

## 3. Motion & interaction system

The motion language is **"mechanical, then settle"** — things move with the snap of a press stroke or a squeegee pull, then lock into place. Nothing floats aimlessly. Curve: mostly `cubic-bezier(0.16, 1, 0.3, 1)` (fast out, soft land).

| Interaction | Behavior | Tech |
|---|---|---|
| **Custom cursor** | A small `flare` ring that grows and inverts over interactive elements; shows a label ("VIEW", "START") on portfolio + CTAs. Hidden on touch. | Vanilla JS + `requestAnimationFrame`, lerp follow. |
| **Hero halftone field** | Animated CMYK-dot canvas that reacts subtly to cursor/scroll — the "wet ink" motif. GPU-light (2D canvas, capped DPR, throttled). | `<canvas>` 2D, ~3kb. WebGL upgrade optional in Phase 2. |
| **Kinetic headline** | H1 words clip-reveal on load, line by line, with a slight orange "ink-bleed" wipe. | CSS clip-path + Web Animations API. |
| **Service marquee** | Infinite horizontal scroll of services ("SIGNS · WRAPS · APPAREL · BANNERS · EMBROIDERY · LASER") that speeds with scroll velocity. | CSS animation + scroll listener. |
| **Image dot-resolve** | Photos enter as coarse halftone, sharpen to full res. | CSS mask / canvas, IntersectionObserver. |
| **Magnetic CTA** | "Start Your Project" button subtly pulls toward the cursor within a radius. | JS pointer math. |
| **Scroll-pinned sections** | The 3-step plan pins and advances each step as you scroll through it. | CSS sticky + IntersectionObserver (no scroll-jacking — page still scrolls naturally). |
| **Section transitions** | Ink panels slide up over paper with a halftone leading edge. | Transform + IntersectionObserver. |
| **Page transitions** | Astro **View Transitions API** — a flat orange wipe between routes. Native, near-zero JS. | `astro:transitions`. |

**Library choice:** stay lean. Use the **Web Animations API + CSS + IntersectionObserver** for 90% of this (zero dependency, fully tree-shaken). Bring in **GSAP (+ScrollTrigger)** *only* on the homepage and portfolio if hand-rolling the pinned/scrubbed sequences gets unwieldy — loaded as a deferred island so it never touches the conversion pages. **Lenis** for smooth-scroll is optional and homepage-only; test it against `prefers-reduced-motion` and mobile jank before committing.

**Reduced-motion contract:** when `prefers-reduced-motion: reduce`, the halftone canvas renders one static frame, reveals become instant fades, marquee freezes, custom cursor is disabled, magnetic CTA is static. The page loses nothing functional.

---

## 4. Page-by-page direction

The information architecture from `PROJECT.md` is unchanged. We re-skin and choreograph it. Existing components (`Hero`, `ProblemSection`, `ThreeStepPlan`, etc.) get visual upgrades but keep their StoryBrand order and copy.

### Home (Showcase layer — the award page)
1. **Immersive hero.** Full-viewport `ink` canvas, animated halftone field, kinetic ALL-CAPS H1: *"MAKE YOUR TEAM, CHURCH, OR BUSINESS LOOK LIKE PROS."* Orange "look like pros." Magnetic primary CTA + ghost "See the work." Live trust strip (4.7★ · 95+ reviews · 23 yrs · Crossville). Custom cursor active.
2. **Service marquee** — kinetic ticker of everything they make, scroll-reactive.
3. **Problem section** ("Print shops shouldn't make your job harder") — set as a stark `ink` editorial spread, big pull-quote type.
4. **Guide section** — empathy + authority, with the real Crossville building-in-snow photo doing a dot-resolve.
5. **3-step plan** — scroll-pinned, oversized mono numerals `01 / 02 / 03`, orange progress rail.
6. **Stakes** — fast, tense, red-flag list; restrained motion (lets the copy bite).
7. **Success vision** — full-bleed real photos (team in matching shirts, wrapped truck, storefront) in a duotone-to-color gallery.
8. **Proof wall** — real review verbatims, mono attribution, marquee of logos/orgs served.
9. **Recent work** — filterable portfolio teaser, duotone hover.
10. **Final CTA** — oversized orange panel, magnetic button, transitional "Get the Free Project Checklist."

### Portfolio (Showcase layer)
Filterable grid (apparel / signs / wraps / print / embroidery / laser), duotone→color hover, custom-cursor "VIEW" label, dot-resolve on load. Case-study detail pages: full-bleed hero, the problem the customer had, what was made, the result. This is the second-strongest award asset after the hero — juries love a portfolio that proves the craft.

### About (Showcase layer — the heart)
Lean into the family-owned, 23-years story. **Team grid using the real staff photos** (Melissa McClung, Ross, Cynthia, Amy, Wayne, Elissa, Lilly — and "Jeremiah, always working in the background :)" as a deliberate, charming easter-egg card). Shop-tour scroll sequence. The "next to the FFG water tower" location story from the deck is *gold* — render it as a playful, map-pin map moment ("Technically 474 Hyder Ridge Rd. But everyone knows the water tower."). This human, specific, local texture is exactly what makes a small-business site memorable to a juror.

### Service pillar pages (Conversion layer)
Keep the SB7 micro-pattern from `CLAUDE.md`. Light motion only: a dot-resolve hero image and the page-transition wipe. Speed and clarity first. Pull stats from the deck where they sell — e.g., apparel page leads with *"Avg. branded shirt = ~3,400 impressions and 14+ months of wear. Your shirt is a walking billboard."*

### Start Your Project (Conversion layer — sacred)
**No immersive anything.** Instant load, 6-field form (per `PROJECT.md`), Turnstile, inline success. The only flourish: the orange page-wipe in, and a calm "Mike or the team will call within 24 hours" confirmation. Every CTA on every page points here.

### Contact / Resources (Conversion layer)
Map (the water-tower story repeated), click-to-call, hours, checklist lead magnet. Fast and plain.

---

## 5. Technical plan (additions to the existing stack)

The stack stays **Astro 4 + Tailwind 3 + MDX + Decap CMS on Cloudflare Pages**. Additions:

- **Astro View Transitions** (`astro:transitions`) — page wipes, near-zero cost.
- **Motion as islands.** All heavy motion lives in `client:visible` / `client:idle` islands so it ships *only* on showcase pages and *after* content paints. Conversion pages import none of it.
- **Canvas halftone** — a small standalone module (`src/scripts/halftone.ts`), DPR-capped at 1.5, paused via IntersectionObserver when off-screen, single static frame under reduced-motion.
- **GSAP/ScrollTrigger** — optional, homepage+portfolio only, deferred. Decide during Phase 2 build; default to WAAPI first.
- **Lenis smooth-scroll** — optional, homepage only, gated behind motion + pointer checks.
- **Image pipeline** — `astro:assets` with AVIF/WebP, responsive `srcset`, `loading="lazy"`, LQIP. The 60+ shop JPGs in `Assets/CumberlandSignworks/` get optimized + renamed semantically on import.
- **Fonts** — self-hosted (already are), `font-display: swap`, subset, preload Bebas for the hero.
- **No new heavy deps on conversion pages.** Enforced by keeping motion in islands.

---

## 6. Performance & SEO guardrails (non-negotiable)

Going full-immersive does **not** void the local-business fundamentals. Targets:

- **Showcase pages:** Lighthouse Performance ≥ 90 mobile, LCP < 2.5s, CLS < 0.1, INP < 200ms. (We relax the hero's LCP budget slightly vs. the original ≥95 to allow the canvas — but the H1 text is the LCP element and paints instantly; the canvas layers behind it.)
- **Conversion pages:** Lighthouse ≥ 95 mobile, LCP < 1.8s — the original `PROJECT.md` budget, fully intact.
- **SEO unchanged and protected:** `LocalBusiness` JSON-LD on every page, service × geography landing pages (`/signs/crossville-tn`, etc.), sitemap, 301s from legacy `/cswllc/shop/*`, real crawlable text (the kinetic headline is real `<h1>` text, animated with CSS — not an image or canvas).
- **Accessibility:** WCAG 2.1 AA. Orange `#FF4D1C` on `ink` passes AA for large text and UI; for small body text we use `paper`/`pure`, never orange-on-paper for long copy. Full keyboard nav, visible focus (orange ring), reduced-motion contract honored, custom cursor never replaces real focus states.

**The award and the funnel are not in conflict if the motion is disciplined and islanded. That discipline is itself what wins.**

---

## 7. Phasing

**Phase A — Design system + hero (this week).** Lock palette + type tokens in Tailwind, build the immersive hero (prototype delivered alongside this plan), establish the motion primitives (cursor, halftone, dot-resolve, reveal) as reusable islands.

**Phase B — Showcase pages.** Home (full sequence), Portfolio (grid + case studies), About (team + shop story). Wire GSAP/Lenis only if WAAPI falls short.

**Phase C — Conversion layer polish.** Re-skin service pillars, lock the quote form experience, contact/resources. Verify the ≥95 budget held.

**Phase D — Content + imagery.** Optimize and semantically rename the 60+ real photos, build portfolio case studies from real jobs, pull 12–15 real review verbatims, populate service MDX with the deck's selling stats.

**Phase E — QA + submit.** Cross-device, Lighthouse, a11y audit, reduced-motion pass, form testing, 301s. Then prepare Awwwards/CSSDA/FWA submissions (they want a clean case-study writeup + the "Shop Floor" concept narrative — this doc is the seed of that).

---

## 8. Why this can actually win

Awwwards juries reward (a) a clear, ownable concept, (b) craft in motion + type, (c) restraint, and (d) authenticity. This plan has all four: "The Shop Floor" is a concept *no national printer can copy* because it's built from a real 23-year Crossville shop's real photos, real team, real water-tower-landmark story. The halftone-dot signature is conceptually tied to the actual craft (screen printing is dots). And the two-speed architecture proves design maturity — we show juries we can be spectacular where it counts and ruthless about conversion where it matters. That combination — bold *and* disciplined — is the profile of a Site of the Day, not just a flashy reel.

---

*Companion file: `hero-prototype.html` — a working, standalone preview of the immersive hero direction (kinetic type, custom cursor, animated halftone, magnetic CTA, service marquee). Open it in a browser.*
