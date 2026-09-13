# 3D Hero Redesign — Design Spec

Date: 2026-09-13
Scope: `Company Website/app` (React + Vite site)

## Goal

Redesign the Home page hero into an interactive 3D scene while keeping the
existing dark/cyan "Autryx Solutions" brand theme, generate new visual
assets (service images + logo) in a matching style, and give the rest of
the Home page a lightweight 3D-style polish — without altering copy,
routes, or the sections not yet ported to React.

## Out of scope

- Porting the remaining static pages (about, services, contact, reviews,
  and the 8 service detail pages) to React — they stay as placeholders.
- Any redesign of pages other than Home.
- Changing site copy, navigation structure, or color palette.

## 1. Tech stack

Add to `app/package.json`:
- `three`
- `@react-three/fiber` — declarative React bindings for Three.js
- `@react-three/drei` — helpers, specifically `Float` for ambient motion

No other new runtime dependencies. The rest-of-page polish (section 4)
is CSS + a small hook, no library.

## 2. Hero 3D scene (`components/Scene3D.jsx`)

- A `<Canvas>` positioned absolutely behind the existing hero DOM content
  (badge, title, subtext, actions, stats all stay normal HTML/CSS —
  nothing text-related goes into WebGL).
- Content: a field of ~30-40 glowing spheres of varying size, colored
  from the existing `--cyan` palette (plus a secondary accent already
  used in `hero-orb` gradients), using emissive materials so they read
  as soft glowing orbs against the dark background — extending the
  existing 2D `.hero-orb` motif into real 3D.
- Motion: slow ambient drift — each orb bobs/drifts independently and
  slowly via `drei`'s `Float`, not a fast or attention-grabbing motion.
- Interaction: subtle parallax — the whole orb group tilts slightly
  toward the pointer position (`useFrame`, lerped toward target
  rotation based on normalized mouse position).
- Accessibility/perf:
  - `prefers-reduced-motion: reduce` → render a static, non-animated
    orb arrangement (no drift, no parallax).
  - Pause the render loop (`invalidateFrameloop` / conditional
    `frameloop="demand"`) when the hero scrolls out of view via
    `IntersectionObserver`.
  - Cap `dpr` (device pixel ratio) via `<Canvas dpr={[1, 1.5]}>` to
    control cost on high-DPI/mobile screens.

## 3. Generated image assets (via Higgsfield)

Generate via the Higgsfield CLI (`higgsfield generate create ...`, now
authenticated), in a consistent style: **dark background-friendly,
glossy 3D render, cyan neon accent lighting**, matching the new hero.

**Budget constraint:** the connected Higgsfield workspace is on the free
plan with 10 total credits. `gpt_image_2_5` costs 1 credit/image; 9
generations (8 tiles + 1 logo) = 9 credits, leaving 1 in reserve. The
8 `*-hero.png` variants (used only on the not-yet-ported individual
service pages) are deferred to when those pages are ported — generating
them now would exceed the credit budget at this quality tier.

Asset list (9 files, replacing existing files 1:1 by name so no other
code needs to change), model: `gpt_image_2_5`:

Tile images (`images/*.png`):
`ai-ml.png`, `product-engineering.png`, `cloud-services.png`,
`meta-ads.png`, `devops.png`, `fullstack.png`,
`requirement-engineering.png`, `wordpress-shopify.png`

Logo:
`Logo.png` — new AI-generated logo, same brand name "Autryx Solutions,"
cyan-accented icon/wordmark, dark-background-friendly, geometric/circuit
motif consistent with the new 3D theme.

Generated images will be reviewed with the user before being placed
into `app/public/images/` and `app/public/Logo.png`. The original
static site's `images/`/`Logo.png` are left untouched by this plan.

## 4. Rest-of-page polish (about, process, reviews, CTA)

- New `components/TiltCard.jsx`: a small wrapper using a `pointermove`
  handler to compute rotateX/rotateY based on cursor position within
  the element, applied via inline CSS transform with a transition on
  pointer leave to reset. No new dependency.
- New CSS (`styles.css`, additive): a `.glass-panel` class (semi-transparent
  background, `backdrop-filter: blur(...)`, soft border) reusing existing
  `--cyan` and dark background variables — no new colors.
- Applied to: about-section feature items, process steps, review cards,
  and the CTA box.
- Existing `Reveal` (scroll fade-in via framer-motion) is unchanged;
  `TiltCard` is additive/orthogonal (hover/pointer behavior only).

## 5. File changes summary

New:
- `app/src/components/Scene3D.jsx`
- `app/src/components/TiltCard.jsx`

Modified:
- `app/src/pages/Home.jsx` — hero wraps `Scene3D` behind existing content;
  about/process/reviews/CTA cards wrapped in `TiltCard`
- `app/src/styles.css` — additive glass/tilt-supporting classes
- `app/package.json` — new dependencies
- `app/public/images/*.png` (8 tile files), `app/public/Logo.png` — replaced

## 6. Testing / verification

- `npm run dev`: manual browser check — hero renders, orbs animate,
  parallax responds to mouse, tilt cards behave on hover, page still
  scrolls/reveals correctly.
- `npm run build`: confirm no build errors with the new dependencies.
- DevTools: emulate `prefers-reduced-motion: reduce` and confirm the
  static fallback renders.
- Manual perf sanity check: verify the scene pauses when scrolled out
  of the hero (no continued GPU usage further down the page).

## Notes

- `Company Website/app` is not currently a git repository; this spec is
  saved to disk but not committed. No commit step will happen unless
  the user asks to `git init` first.
