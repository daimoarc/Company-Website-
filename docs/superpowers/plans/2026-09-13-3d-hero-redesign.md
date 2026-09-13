# 3D Hero Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the React app's Home hero into an interactive 3D scene (glowing drifting orbs, mouse parallax), give the rest of the Home page a lightweight 3D tilt/glass polish, and regenerate the site's service tile images and logo in a matching dark/cyan style — all while keeping the existing brand theme, copy, and routes untouched.

**Architecture:** A new `Scene3D` component renders a `@react-three/fiber` `<Canvas>` absolutely positioned behind the existing hero DOM content (same layering pattern already used by the `.hero-orb` CSS blobs). A new `TiltCard` component (plain CSS + pointer events, no new dependency) wraps existing cards in the about/process/reviews/CTA sections to add hover tilt + a glass-panel look. Nine new images (8 service tiles + logo) are generated via the Higgsfield CLI and dropped into `public/` replacing the existing files 1:1 by name.

**Tech Stack:** React 19, Vite, `three`, `@react-three/fiber`, `@react-three/drei`, framer-motion (already present), Higgsfield CLI (already authenticated).

**Spec:** `app/docs/superpowers/specs/2026-09-13-3d-hero-redesign-design.md`

## Global Constraints

- Do not modify site copy, navigation structure, routes, or the existing color palette (`--cyan: #00c8e8`, `--navy: #0a0e1a`, etc. in `src/styles.css`).
- No changes to pages other than `src/pages/Home.jsx` (other routes stay as placeholders).
- New dependencies limited to `three`, `@react-three/fiber`, `@react-three/drei` — no other libraries.
- Respect `prefers-reduced-motion: reduce` in the 3D scene (static fallback, no animation).
- Image generation budget: 9 images via `gpt_image_2_5` at `quality=medium`, `resolution=1k` (1 credit each = 9 credits total, workspace has 10). Do not use a higher quality/resolution tier without checking remaining credits first (`higgsfield account credits` or workspace list).
- `Company Website/app` is not yet a git repository — Task 1 initializes one so subsequent tasks can commit.

---

### Task 1: Initialize git repo and add 3D dependencies

**Files:**
- Create: `app/.gitignore`
- Modify: `app/package.json`, `app/package-lock.json`

**Interfaces:**
- Produces: `three`, `@react-three/fiber`, `@react-three/drei` available as importable packages for later tasks.

- [ ] **Step 1: Initialize git and commit the current state**

```bash
cd "C:\Users\Abdul Moiz Bin Tahir\Desktop\Free Lancing\AutryxSolutions\Company Website\app"
git init
```

Create `app/.gitignore`:

```
node_modules
dist
.DS_Store
```

```bash
git add -A
git commit -m "chore: initial commit of Vite React app scaffold"
```

- [ ] **Step 2: Install 3D dependencies**

```bash
npm install three @react-three/fiber @react-three/drei
```

- [ ] **Step 3: Verify the build still works**

```bash
npm run build
```

Expected: build succeeds with no errors (new deps don't break anything since nothing imports them yet).

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add three.js/react-three-fiber dependencies"
```

---

### Task 2: Build the Scene3D component

**Files:**
- Create: `app/src/components/Scene3D.jsx`

**Interfaces:**
- Produces: `export default function Scene3D()` — a self-contained component with no required props, rendering a `<div>` wrapper containing a `<Canvas>`. Later tasks import it as `import Scene3D from '../components/Scene3D'` and render `<Scene3D />`.

- [ ] **Step 1: Write the component**

```jsx
import { useRef, useEffect, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'

const ORB_COLORS = ['#00c8e8', '#1e5bbd', '#00e5c3']

function randomOrbs(count) {
  const orbs = []
  for (let i = 0; i < count; i++) {
    orbs.push({
      id: i,
      position: [
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 4,
      ],
      radius: 0.15 + Math.random() * 0.55,
      color: ORB_COLORS[i % ORB_COLORS.length],
      speed: 0.5 + Math.random() * 0.8,
    })
  }
  return orbs
}

function Orb({ position, radius, color, speed, animate }) {
  const mesh = (
    <mesh position={position}>
      <sphereGeometry args={[radius, 24, 24]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1.4}
        roughness={0.25}
        metalness={0.1}
        transparent
        opacity={0.85}
      />
    </mesh>
  )
  if (!animate) return mesh
  return (
    <Float speed={speed} rotationIntensity={0.2} floatIntensity={1.1}>
      {mesh}
    </Float>
  )
}

function OrbField({ orbs, animate, pointerRef, enableParallax }) {
  const group = useRef()
  useFrame(() => {
    if (!group.current || !enableParallax) return
    const { x, y } = pointerRef.current
    group.current.rotation.y += (x * 0.15 - group.current.rotation.y) * 0.03
    group.current.rotation.x += (y * 0.1 - group.current.rotation.x) * 0.03
  })
  return (
    <group ref={group}>
      {orbs.map((orb) => (
        <Orb key={orb.id} {...orb} animate={animate} />
      ))}
    </group>
  )
}

export default function Scene3D() {
  const orbs = useMemo(() => randomOrbs(36), [])
  const [reducedMotion, setReducedMotion] = useState(false)
  const [visible, setVisible] = useState(true)
  const pointer = useRef({ x: 0, y: 0 })
  const containerRef = useRef(null)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const onChange = (e) => setReducedMotion(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    const node = containerRef.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0 }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (reducedMotion) return
    const onMove = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [reducedMotion])

  return (
    <div
      ref={containerRef}
      style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}
      aria-hidden="true"
    >
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 8], fov: 45 }}
        frameloop={visible ? 'always' : 'never'}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={1.2} color="#00c8e8" />
        <OrbField
          orbs={orbs}
          animate={!reducedMotion}
          pointerRef={pointer}
          enableParallax={!reducedMotion}
        />
      </Canvas>
    </div>
  )
}
```

- [ ] **Step 2: Verify the build compiles**

```bash
npm run build
```

Expected: build succeeds (component isn't used anywhere yet, but this catches syntax/import errors early).

- [ ] **Step 3: Commit**

```bash
git add src/components/Scene3D.jsx
git commit -m "feat: add Scene3D component (3D orb field for hero)"
```

---

### Task 3: Integrate Scene3D into the Home hero

**Files:**
- Modify: `app/src/pages/Home.jsx`

**Interfaces:**
- Consumes: `Scene3D` from `../components/Scene3D` (Task 2).

- [ ] **Step 1: Import Scene3D and render it as the first child of `#hero`**

In `app/src/pages/Home.jsx`, add the import at the top:

```jsx
import Scene3D from '../components/Scene3D'
```

Change the opening of the hero section from:

```jsx
      <section id="hero">
        <div className="hero-orb hero-orb-1"></div>
        <div className="hero-orb hero-orb-2"></div>
```

to:

```jsx
      <section id="hero">
        <Scene3D />
        <div className="hero-orb hero-orb-1"></div>
        <div className="hero-orb hero-orb-2"></div>
```

- [ ] **Step 2: Manually verify in the browser**

```bash
npm run dev
```

Open the printed local URL. Confirm:
- The hero shows glowing drifting orbs behind the headline/badge/buttons.
- Moving the mouse slowly tilts the orb field (parallax).
- Headline, badge, buttons, and stats are still fully readable and clickable (the canvas must not block clicks — it has `pointerEvents: 'none'`).
- Scrolling the hero out of view and back in doesn't error in the console (frameloop pause/resume).

- [ ] **Step 3: Verify production build still works**

```bash
npm run build
```

Expected: succeeds with no errors.

- [ ] **Step 4: Commit**

```bash
git add src/pages/Home.jsx
git commit -m "feat: render Scene3D behind Home hero content"
```

---

### Task 4: Build the TiltCard component and supporting CSS

**Files:**
- Create: `app/src/components/TiltCard.jsx`
- Modify: `app/src/styles.css`

**Interfaces:**
- Produces: `export default function TiltCard({ as, className, maxTilt, children, ...rest })` — renders as the given host tag (default `'div'`) with `tilt-card glass-panel` classes plus any passed `className`, and pointer-move-based tilt. Later tasks import it as `import TiltCard from '../components/TiltCard'`.

- [ ] **Step 1: Write the component**

```jsx
import { useRef } from 'react'

export default function TiltCard({ as: Tag = 'div', className = '', maxTilt = 8, children, ...rest }) {
  const ref = useRef(null)

  function handlePointerMove(e) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    el.style.transform = `perspective(800px) rotateX(${(-py * maxTilt).toFixed(2)}deg) rotateY(${(px * maxTilt).toFixed(2)}deg)`
  }

  function handlePointerLeave() {
    const el = ref.current
    if (!el) return
    el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)'
  }

  return (
    <Tag
      ref={ref}
      className={`tilt-card glass-panel ${className}`.trim()}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      {...rest}
    >
      {children}
    </Tag>
  )
}
```

- [ ] **Step 2: Add supporting CSS**

Append to the end of `app/src/styles.css`:

```css
/* ─── 3D POLISH: GLASS PANELS + TILT CARDS ─── */
.glass-panel {
  background: rgba(255,255,255,0.04);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--border);
}
.tilt-card {
  transition: transform .15s ease-out, box-shadow .25s ease-out;
  transform-style: preserve-3d;
  will-change: transform;
}
.tilt-card:hover {
  box-shadow: var(--shadow-dark-hover);
}
```

- [ ] **Step 3: Verify the build compiles**

```bash
npm run build
```

Expected: succeeds (component isn't used anywhere yet).

- [ ] **Step 4: Commit**

```bash
git add src/components/TiltCard.jsx src/styles.css
git commit -m "feat: add TiltCard component and glass/tilt CSS"
```

---

### Task 5: Apply TiltCard to about/process/reviews/CTA sections

**Files:**
- Modify: `app/src/pages/Home.jsx`

**Interfaces:**
- Consumes: `TiltCard` from `../components/TiltCard` (Task 4).

- [ ] **Step 1: Import TiltCard**

Add to the imports in `app/src/pages/Home.jsx`:

```jsx
import TiltCard from '../components/TiltCard'
```

- [ ] **Step 2: Wrap the two feature items (about section)**

Change:

```jsx
              <Reveal as="li" className="feature-item" delay={0.3}>
                <div className="feature-check">✓</div>
                <div className="feature-text"><strong>Built for Business Owners</strong><p>We translate your goals into technology that drives real results, without the technical headaches.</p></div>
              </Reveal>
              <Reveal as="li" className="feature-item" delay={0.4}>
                <div className="feature-check">✓</div>
                <div className="feature-text"><strong>End-to-End Ownership</strong><p>From ideation to production to monitoring — we own the entire lifecycle so you don't have to.</p></div>
              </Reveal>
```

to:

```jsx
              <Reveal as="li" delay={0.3}>
                <TiltCard as="div" className="feature-item">
                  <div className="feature-check">✓</div>
                  <div className="feature-text"><strong>Built for Business Owners</strong><p>We translate your goals into technology that drives real results, without the technical headaches.</p></div>
                </TiltCard>
              </Reveal>
              <Reveal as="li" delay={0.4}>
                <TiltCard as="div" className="feature-item">
                  <div className="feature-check">✓</div>
                  <div className="feature-text"><strong>End-to-End Ownership</strong><p>From ideation to production to monitoring — we own the entire lifecycle so you don't have to.</p></div>
                </TiltCard>
              </Reveal>
```

- [ ] **Step 3: Wrap the process steps**

Change the process steps map from:

```jsx
          {[
            ['01', 'Discovery', 'Deep-dive into your goals, constraints, and technical landscape to define a precise scope.'],
            ['02', 'Architect', 'Design a robust solution blueprint — stack, infrastructure, integrations, and data flows.'],
            ['03', 'Build & Test', 'Agile sprints with continuous integration, automated testing, and transparent progress reporting.'],
            ['04', 'Deploy & Operate', 'Zero-downtime deployments, monitoring, alerting, and ongoing optimization post-launch.'],
          ].map(([num, title, desc], i) => (
            <Reveal className="process-step" key={num} delay={i * 0.1}>
              <div className="step-num">{num}</div>
              <div className="step-title">{title}</div>
              <div className="step-desc">{desc}</div>
            </Reveal>
          ))}
```

to:

```jsx
          {[
            ['01', 'Discovery', 'Deep-dive into your goals, constraints, and technical landscape to define a precise scope.'],
            ['02', 'Architect', 'Design a robust solution blueprint — stack, infrastructure, integrations, and data flows.'],
            ['03', 'Build & Test', 'Agile sprints with continuous integration, automated testing, and transparent progress reporting.'],
            ['04', 'Deploy & Operate', 'Zero-downtime deployments, monitoring, alerting, and ongoing optimization post-launch.'],
          ].map(([num, title, desc], i) => (
            <Reveal key={num} delay={i * 0.1}>
              <TiltCard className="process-step">
                <div className="step-num">{num}</div>
                <div className="step-title">{title}</div>
                <div className="step-desc">{desc}</div>
              </TiltCard>
            </Reveal>
          ))}
```

- [ ] **Step 4: Wrap the review cards**

Change:

```jsx
            <Reveal className="review-card" key={r.name} delay={i * 0.1}>
              <div className="review-stars">★★★★★</div>
              <p className="review-text">"{r.text}"</p>
              <div className="review-author">
                <div className="review-avatar">{r.initials}</div>
                <div className="review-info">
                  <strong>{r.name}</strong>
                  <span>{r.meta}</span>
                </div>
                <div className="review-badge">{r.badge}</div>
              </div>
            </Reveal>
```

to:

```jsx
            <Reveal key={r.name} delay={i * 0.1}>
              <TiltCard className="review-card">
                <div className="review-stars">★★★★★</div>
                <p className="review-text">"{r.text}"</p>
                <div className="review-author">
                  <div className="review-avatar">{r.initials}</div>
                  <div className="review-info">
                    <strong>{r.name}</strong>
                    <span>{r.meta}</span>
                  </div>
                  <div className="review-badge">{r.badge}</div>
                </div>
              </TiltCard>
            </Reveal>
```

- [ ] **Step 5: Wrap the CTA box**

Change:

```jsx
      <section id="cta">
        <div className="cta-box">
          <span className="section-tag">◆ Let's Build Together</span>
          <Reveal as="h2" className="cta-title">Ready to Transform<br />Your Business?</Reveal>
          <Reveal as="p" className="cta-sub" delay={0.1}>Reach out directly — we respond fast. Whether you need a website, a Shopify store, or a full AI system, we're here to help business owners like you.</Reveal>
          <Reveal as={Link} to="/contact" className="btn-primary" delay={0.2}>Get In Touch</Reveal>
        </div>
      </section>
```

to:

```jsx
      <section id="cta">
        <TiltCard as="div" className="cta-box">
          <span className="section-tag">◆ Let's Build Together</span>
          <Reveal as="h2" className="cta-title">Ready to Transform<br />Your Business?</Reveal>
          <Reveal as="p" className="cta-sub" delay={0.1}>Reach out directly — we respond fast. Whether you need a website, a Shopify store, or a full AI system, we're here to help business owners like you.</Reveal>
          <Reveal as={Link} to="/contact" className="btn-primary" delay={0.2}>Get In Touch</Reveal>
        </TiltCard>
      </section>
```

- [ ] **Step 6: Manually verify in the browser**

```bash
npm run dev
```

Confirm: hovering over feature items, process steps, review cards, and the CTA box tilts them toward the cursor and shows the glass-panel background/border; moving the mouse away resets them smoothly. Scroll-in fade animations (from `Reveal`) still play normally.

- [ ] **Step 7: Verify production build**

```bash
npm run build
```

Expected: succeeds with no errors.

- [ ] **Step 8: Commit**

```bash
git add src/pages/Home.jsx
git commit -m "feat: apply TiltCard polish to about/process/reviews/CTA sections"
```

---

### Task 6: Generate service tile images and logo via Higgsfield

**Files:**
- Modify (replace binary content, same filenames): `app/public/images/ai-ml.png`, `app/public/images/product-engineering.png`, `app/public/images/cloud-services.png`, `app/public/images/meta-ads.png`, `app/public/images/devops.png`, `app/public/images/fullstack.png`, `app/public/images/requirement-engineering.png`, `app/public/images/wordpress-shopify.png`, `app/public/Logo.png`

No code changes needed — Home.jsx already references these paths by filename, so replacing the files in place updates the site automatically.

- [ ] **Step 1: Check remaining credits before starting**

```bash
higgsfield workspace list
```

Confirm at least 9 credits are available (budget: 9 images × 1 credit at `quality=medium`, `resolution=1k`).

- [ ] **Step 2: Generate the 8 service tile images**

Run each of these (aspect ratio 4:5 matches the existing tile images' ~0.93:1 portrait proportions; `--wait` blocks until the job finishes and prints the result URL):

```bash
higgsfield generate create gpt_image_2_5 --prompt "A glossy 3D render of a glowing cyan neural network formed from interconnected translucent nodes and light trails, floating in a dark navy void, cinematic volumetric lighting, futuristic AI technology aesthetic, no text" --aspect-ratio 4:5 --background opaque --quality medium --resolution 1k --wait

higgsfield generate create gpt_image_2_5 --prompt "A glossy 3D render of an abstract modular product architecture, interlocking glowing cyan geometric blocks assembling in mid-air, dark navy background, cinematic rim lighting, futuristic engineering aesthetic, no text" --aspect-ratio 4:5 --background opaque --quality medium --resolution 1k --wait

higgsfield generate create gpt_image_2_5 --prompt "A glossy 3D render of a glowing cyan cloud shape formed from soft geometric facets with streams of light data flowing into it, floating above a dark navy void, cinematic lighting, futuristic cloud technology aesthetic, no text" --aspect-ratio 4:5 --background opaque --quality medium --resolution 1k --wait

higgsfield generate create gpt_image_2_5 --prompt "A glossy 3D render of a glowing cyan megaphone with radiating signal waves and floating glassy heart and like icons, dark navy background, cinematic lighting, futuristic marketing technology aesthetic, no text" --aspect-ratio 4:5 --background opaque --quality medium --resolution 1k --wait

higgsfield generate create gpt_image_2_5 --prompt "A glossy 3D render of an infinite-loop DevOps symbol made of glowing cyan glass, with small floating glassy server and container shapes orbiting it, dark navy background, cinematic lighting, futuristic aesthetic, no text" --aspect-ratio 4:5 --background opaque --quality medium --resolution 1k --wait

higgsfield generate create gpt_image_2_5 --prompt "A glossy 3D render of stacked glowing cyan layered translucent platforms connected by beams of light, representing frontend and backend layers, floating in a dark navy void, cinematic lighting, futuristic aesthetic, no text" --aspect-ratio 4:5 --background opaque --quality medium --resolution 1k --wait

higgsfield generate create gpt_image_2_5 --prompt "A glossy 3D render of a floating translucent glass blueprint panel with glowing cyan checkmarks and connecting lines, dark navy background, cinematic lighting, futuristic requirements-engineering aesthetic, no text" --aspect-ratio 4:5 --background opaque --quality medium --resolution 1k --wait

higgsfield generate create gpt_image_2_5 --prompt "A glossy 3D render of two interlocking glowing cyan glass emblem shapes, an abstract shopping bag and an abstract browser window, dark navy background, cinematic lighting, futuristic e-commerce aesthetic, no text" --aspect-ratio 4:5 --background opaque --quality medium --resolution 1k --wait
```

Each command prints a result image URL when it finishes. Download each to the matching filename:

```bash
curl -L -o "app/public/images/ai-ml.png" "<url from command 1>"
curl -L -o "app/public/images/product-engineering.png" "<url from command 2>"
curl -L -o "app/public/images/cloud-services.png" "<url from command 3>"
curl -L -o "app/public/images/meta-ads.png" "<url from command 4>"
curl -L -o "app/public/images/devops.png" "<url from command 5>"
curl -L -o "app/public/images/fullstack.png" "<url from command 6>"
curl -L -o "app/public/images/requirement-engineering.png" "<url from command 7>"
curl -L -o "app/public/images/wordpress-shopify.png" "<url from command 8>"
```

- [ ] **Step 3: Generate the logo**

```bash
higgsfield generate create gpt_image_2_5 --prompt "A modern minimalist tech company logo for 'Autryx Solutions': a glowing cyan geometric emblem (an abstract interconnected node/circuit mark) to the left of the wordmark 'Autryx Solutions' set in a clean modern sans-serif font, transparent background, dark-theme friendly, high contrast cyan glow, no other text" --aspect-ratio 4:3 --background transparent --quality medium --resolution 1k --wait
```

```bash
curl -L -o "app/public/Logo.png" "<url from command>"
```

- [ ] **Step 4: Review the results in the browser**

```bash
npm run dev
```

Open the site and check the Home page service tiles and the nav/footer logo. If any image looks broken, off-brand, or has garbled text (common with AI-generated logos), re-run that one `generate create` command with an adjusted prompt using the 1 spare credit, then re-download over the same filename.

- [ ] **Step 5: Commit**

```bash
git add public/images public/Logo.png
git commit -m "feat: regenerate service tile images and logo with Higgsfield"
```

---

### Task 7: Final verification

**Files:** none (verification only)

- [ ] **Step 1: Full production build**

```bash
npm run build
```

Expected: succeeds with no errors or warnings about missing assets.

- [ ] **Step 2: Reduced-motion check**

In Chrome DevTools, open the Rendering tab (Cmd/Ctrl+Shift+P → "Show Rendering"), set "Emulate CSS media feature prefers-reduced-motion" to "reduce", reload the Home page. Confirm the hero orbs render statically (no drift, no parallax) instead of animating.

- [ ] **Step 3: Perf sanity check**

With the Performance or Rendering tab's FPS meter open, scroll the hero section out of view. Confirm GPU/CPU activity from the 3D canvas drops (frameloop paused) rather than continuing to animate off-screen.

- [ ] **Step 4: Full manual walkthrough**

```bash
npm run dev
```

Click through the Home page top to bottom: hero (3D scene + parallax), services tiles (new images, links work), about section (tilted feature cards), process steps (tilted), reviews (tilted cards), CTA (tilted box, link works). Confirm nothing regressed from before this plan (nav, footer, mobile menu still work).

- [ ] **Step 5: Final commit (if any fixes were made during verification)**

```bash
git add -A
git commit -m "chore: final verification fixes for 3D hero redesign"
```
