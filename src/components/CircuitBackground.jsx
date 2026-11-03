import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(DrawSVGPlugin, MotionPathPlugin, useGSAP)

/* ─────────────────────────────────────────────────────────────────
   Layout generator: PCB-style traces on a grid.
   Traces run straight, bend in 45° chamfers, never cross, and stop at
   pads. On desktop the centre (where the headline sits) is kept clear,
   so the traces frame it like pins around a chip.
   ───────────────────────────────────────────────────────────────── */

const DIRS = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]] // E SE S SW W NW N NE

function rng(seed) {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Deterministic per-location hash: neighbouring traces moving the same way turn at the
// same spots, which makes them run in parallel "buses" like a real circuit board.
function hash(a, b, c) {
  let n = Math.imul(a, 374761393) ^ Math.imul(b, 668265263) ^ Math.imul(c, 1274126177)
  n = Math.imul(n ^ (n >>> 13), 1103515245)
  return ((n ^ (n >>> 16)) >>> 0) / 4294967296
}

function shuffle(list, rand) {
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[list[i], list[j]] = [list[j], list[i]]
  }
  return list
}

function generateCircuit(w, h) {
  const compact = w < 900
  const cell = compact ? 26 : 28
  const cols = Math.floor(w / cell) + 1
  const rows = Math.floor(h / cell) + 1
  const ox = (w - (cols - 1) * cell) / 2
  const oy = (h - (rows - 1) * cell) / 2
  const rand = rng(compact ? 11 : 7)

  const used = new Uint8Array(cols * rows)
  const diagonals = new Set()
  const cx = (cols - 1) / 2
  const cy = (rows - 1) * 0.46
  const rx = compact ? 0 : cols * 0.27
  const ry = rows * 0.31
  const inCore = (x, y) => rx > 0 && ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 < 1
  const free = (x, y) => x >= 0 && y >= 0 && x < cols && y < rows && !used[y * cols + x] && !inCore(x, y)
  const edgeKey = (ax, ay, bx, by) => {
    const a = ay * cols + ax
    const b = by * cols + bx
    return a < b ? `${a}:${b}` : `${b}:${a}`
  }

  const traces = []

  const walk = (sx, sy, dir, edge) => {
    if (!free(sx, sy)) return
    const pts = [[sx, sy]]
    used[sy * cols + sx] = 1
    let x = sx
    let y = sy
    let d = dir
    let diagLeft = 0
    let back = 1
    const maxLen = 8 + Math.floor(rand() * 34)

    const step = (nd) => {
      const [dx, dy] = DIRS[nd]
      const nx = x + dx
      const ny = y + dy
      if (!free(nx, ny)) return false
      if (dx && dy) {
        if (diagonals.has(edgeKey(x + dx, y, x, y + dy))) return false // would cross another trace
        diagonals.add(edgeKey(x, y, nx, ny))
      }
      used[ny * cols + nx] = 1
      x = nx
      y = ny
      d = nd
      pts.push([x, y])
      return true
    }

    for (let n = 0; n < maxLen; n++) {
      let nd = d
      if (d % 2) {
        // on a diagonal: straighten out again after a short chamfer
        if (--diagLeft <= 0) nd = (d + back) % 8
      } else if (n > 2) {
        const horizontal = d === 0 || d === 4
        const pos = horizontal ? x : y
        const band = Math.floor((horizontal ? y : x) / 5)
        if (hash(pos, band, d) < 0.13) {
          nd = (d + (hash(pos, band, d + 8) < 0.5 ? 1 : 7)) % 8
          diagLeft = 1 + Math.floor(hash(band, pos, d + 16) * 3)
          back = hash(pos, band, d + 24) < 0.5 ? 1 : 7
        }
      }
      if (!step(nd) && !(nd !== d && step(d))) break
    }
    if (pts.length >= 5) traces.push({ pts, edge })
  }

  // Traces entering from every edge, heading inward
  const starts = []
  for (let x = 2; x < cols - 2; x += 3) {
    if (rand() < 0.7) starts.push([x, 0, 2])
    if (rand() < 0.7) starts.push([x, rows - 1, 6])
  }
  for (let y = 2; y < rows - 2; y += 3) {
    if (rand() < 0.75) starts.push([0, y, 0])
    if (rand() < 0.75) starts.push([cols - 1, y, 4])
  }
  shuffle(starts, rand).forEach(([x, y, d]) => walk(x, y, d, true))

  // Shorter traces scattered in between for density
  const extra = Math.round((cols * rows) / (compact ? 55 : 42))
  for (let i = 0; i < extra; i++) {
    walk(Math.floor(rand() * cols), Math.floor(rand() * rows), Math.floor(rand() * 4) * 2, false)
  }

  const toPx = ([x, y]) => [ox + x * cell, oy + y * cell]
  const out = traces.map(({ pts, edge }) => {
    const corners = [pts[0]]
    for (let k = 1; k < pts.length - 1; k++) {
      const [ax, ay] = pts[k - 1]
      const [bx, by] = pts[k]
      const [nx, ny] = pts[k + 1]
      if (bx - ax !== nx - bx || by - ay !== ny - by) corners.push(pts[k])
    }
    corners.push(pts[pts.length - 1])
    let px = corners.map(toPx)
    if (edge) {
      // extend the entry point off-screen so the trace appears to come from outside
      const [[x0, y0], [x1, y1]] = px
      const len = Math.hypot(x1 - x0, y1 - y0) || 1
      px = [[x0 - ((x1 - x0) / len) * cell * 3, y0 - ((y1 - y0) / len) * cell * 3], ...px]
    }
    return {
      d: 'M' + px.map(([px1, py1]) => `${px1.toFixed(1)} ${py1.toFixed(1)}`).join('L'),
      start: edge ? null : px[0],
      end: px[px.length - 1],
      edge,
    }
  })

  const pads = []
  out.forEach((t, i) => {
    if (t.start) pads.push({ x: t.start[0], y: t.start[1], via: rand() < 0.3, trace: i, at: 'start' })
    pads.push({ x: t.end[0], y: t.end[1], via: rand() < 0.25, trace: i, at: 'end' })
  })

  return { w, h, compact, traces: out, pads }
}

/* ─────────────────────────────────────────────────────────────────
   Component
   ───────────────────────────────────────────────────────────────── */

const RIPPLES = 6

export default function CircuitBackground() {
  const wrapRef = useRef(null)
  const [size, setSize] = useState(null)

  // Generate the board for the real hero size; only rebuild on meaningful resizes
  useLayoutEffect(() => {
    const el = wrapRef.current
    const measure = () => {
      const w = Math.round(el.clientWidth)
      const h = Math.round(el.clientHeight)
      if (!w || !h) return
      setSize((prev) => (!prev || Math.abs(prev.w - w) > 40 || Math.abs(prev.h - h) > 140 ? { w, h } : prev))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const layout = useMemo(() => (size ? generateCircuit(size.w, size.h) : null), [size])
  const packetCount = layout?.compact ? 3 : 7

  useGSAP(() => {
    if (!layout) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return // static board only

    const root = wrapRef.current
    const svg = root.querySelector('svg')
    const basePaths = [...root.querySelectorAll('.cb-base path')]
    const litPaths = [...root.querySelectorAll('.cb-lit path')]
    const pads = [...root.querySelectorAll('.cb-pad')]
    const ripples = [...root.querySelectorAll('.cb-ripple')]
    const lit = root.querySelector('.cb-lit')
    const spot = root.querySelector('.cb-spot')

    const traces = layout.traces.map((t, i) => {
      const el = basePaths[i]
      const len = el.getTotalLength()
      const samples = []
      for (let s = 0; s <= len; s += 40) {
        const p = el.getPointAtLength(s)
        samples.push([p.x, p.y])
      }
      return { ...t, el, len, samples, busy: false, startPad: null, endPad: null }
    })
    pads.forEach((pad) => {
      const t = traces[Number(pad.dataset.trace)]
      if (pad.dataset.at === 'start') t.startPad = pad
      else t.endPad = pad
    })

    // 1 ─ Intro: every trace draws itself in, then the pads pop on
    traces.forEach((t, i) => {
      gsap.fromTo([t.el, litPaths[i]], { drawSVG: '0%' }, {
        drawSVG: '100%',
        duration: gsap.utils.clamp(0.7, 1.9, t.len / 520),
        ease: 'power2.inOut',
        delay: Math.random() * 0.9,
      })
    })
    gsap.from(pads, { attr: { r: 0 }, duration: 0.55, ease: 'back.out(3)', stagger: { amount: 1.3, from: 'random' }, delay: 0.8 })

    // 2 ─ Data packets: a bright head (MotionPath) with a light trail (DrawSVG)
    const packets = [...root.querySelectorAll('.cb-packet')].map((g) => ({
      head: g.querySelector('.cb-head'),
      trails: [...g.querySelectorAll('.cb-trail')],
      busy: false,
    }))
    const active = new Set()
    const pointer = { x: 0, y: 0, at: -1e9 }
    let rippleIndex = 0
    let visible = true
    let timer = null

    const flash = (pad) => {
      if (!pad) return
      const r = Number(pad.dataset.r)
      gsap.fromTo(pad, { attr: { r: r * 2.4 } }, { attr: { r }, duration: 0.9, ease: 'expo.out' })
      gsap.fromTo(pad, { fill: '#3CDCE6', strokeOpacity: 1 }, { fill: pad.classList.contains('cb-pad--via') ? 'rgba(11,13,20,0)' : '#0b0d14', strokeOpacity: 0.45, duration: 1.2, ease: 'power2.out', clearProps: 'fill,strokeOpacity' })
      const ring = ripples[rippleIndex++ % ripples.length]
      gsap.fromTo(ring, { attr: { cx: pad.getAttribute('cx'), cy: pad.getAttribute('cy'), r: r }, opacity: 0.8 }, { attr: { r: 26 }, opacity: 0, duration: 1.1, ease: 'power2.out' })
    }

    const send = (t, reverse) => {
      const p = packets.find((pk) => !pk.busy)
      if (!p) return
      p.busy = true
      t.busy = true
      const d = t.el.getAttribute('d')
      p.trails.forEach((tr) => tr.setAttribute('d', d))

      const D = t.len / gsap.utils.random(260, 420) // travel time at 260–420 px/s
      const l = (Math.min(130, t.len * 0.4) / t.len) * 100 // trail length as % of the trace
      const t1 = D * (l / 100)
      const [a, b, c, e] = reverse
        ? ['100% 100%', `${100 - l}% 100%`, `0% ${l}%`, '0% 0%']
        : ['0% 0%', `0% ${l}%`, `${100 - l}% 100%`, '100% 100%']

      const tl = gsap.timeline({
        onComplete: () => {
          p.busy = false
          t.busy = false
          active.delete(tl)
        },
      })
      active.add(tl)
      tl.set([p.head, ...p.trails], { opacity: 1 }, 0)
        // trail grows behind the head, slides along at constant length, then the tail catches up
        .fromTo(p.trails, { drawSVG: a }, { drawSVG: b, duration: t1, ease: 'none' }, 0)
        .to(p.trails, { drawSVG: c, duration: D - t1, ease: 'none' })
        .to(p.trails, { drawSVG: e, duration: t1, ease: 'none' })
        .to(p.head, {
          motionPath: { path: t.el, align: t.el, alignOrigin: [0.5, 0.5], start: reverse ? 1 : 0, end: reverse ? 0 : 1 },
          duration: D,
          ease: 'none',
        }, 0)
        .to(p.head, { opacity: 0, duration: 0.25 }, D)
        .call(() => flash(reverse ? t.startPad : t.endPad), null, D)
        .set(p.trails, { opacity: 0 })
    }

    const pick = () => {
      const minLen = layout.compact ? 120 : 180
      const idle = traces.filter((t) => !t.busy && t.len > minLen)
      if (!idle.length) return null
      // While the mouse is moving, most packets fire on the trace closest to it
      if (performance.now() - pointer.at < 1500 && Math.random() < 0.65) {
        let best = null
        let bestDist = 220 ** 2
        idle.forEach((t) => t.samples.forEach(([sx, sy]) => {
          const dist = (sx - pointer.x) ** 2 + (sy - pointer.y) ** 2
          if (dist < bestDist) { bestDist = dist; best = t }
        }))
        if (best) return best
      }
      return idle[Math.floor(Math.random() * idle.length)]
    }

    const spawn = () => {
      if (visible && !document.hidden) {
        const t = pick()
        // edge traces mostly carry data inward, toward the headline
        if (t) send(t, t.edge ? Math.random() < 0.3 : Math.random() < 0.5)
      }
      timer = gsap.delayedCall(layout.compact ? gsap.utils.random(0.8, 1.6) : gsap.utils.random(0.22, 0.6), spawn)
    }
    timer = gsap.delayedCall(1.5, spawn)

    // Pause new packets while the hero is off-screen
    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting }, { threshold: 0.05 })
    io.observe(root)

    // 3 ─ Cursor spotlight: traces near the mouse light up (desktop pointers only)
    const section = root.closest('.hero')
    let onMove = null
    let onLeave = null
    if (section && window.matchMedia('(pointer: fine)').matches) {
      const xTo = gsap.quickTo(spot, 'x', { duration: 0.55, ease: 'power3.out' })
      const yTo = gsap.quickTo(spot, 'y', { duration: 0.55, ease: 'power3.out' })
      let shown = false
      onMove = (e) => {
        const ctm = svg.getScreenCTM()
        if (!ctm) return
        const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(ctm.inverse())
        pointer.x = pt.x
        pointer.y = pt.y
        pointer.at = performance.now()
        if (!shown) {
          gsap.set(spot, { x: pt.x, y: pt.y })
          gsap.to(lit, { opacity: 1, duration: 0.5, overwrite: 'auto' })
          shown = true
        }
        xTo(pt.x)
        yTo(pt.y)
      }
      onLeave = () => {
        shown = false
        gsap.to(lit, { opacity: 0, duration: 0.7, overwrite: 'auto' })
      }
      section.addEventListener('pointermove', onMove)
      section.addEventListener('pointerleave', onLeave)
    }

    return () => {
      timer?.kill()
      active.forEach((tl) => tl.kill())
      gsap.killTweensOf([...pads, ...ripples, lit, spot])
      io.disconnect()
      if (onMove) {
        section.removeEventListener('pointermove', onMove)
        section.removeEventListener('pointerleave', onLeave)
      }
    }
  }, { scope: wrapRef, dependencies: [layout], revertOnUpdate: true })

  return (
    <div className="hero-circuit" ref={wrapRef} aria-hidden="true">
      {layout && (
        <svg viewBox={`0 0 ${layout.w} ${layout.h}`} preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="cb-spot-grad">
              <stop offset="0%" stopColor="#fff" stopOpacity="1" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0" />
            </radialGradient>
            <mask id="cb-spot" maskUnits="userSpaceOnUse" x="0" y="0" width={layout.w} height={layout.h}>
              <circle className="cb-spot" r="230" fill="url(#cb-spot-grad)" />
            </mask>
          </defs>

          <g className="cb-base">
            {layout.traces.map((t, i) => <path key={i} d={t.d} />)}
          </g>
          <g className="cb-lit" mask="url(#cb-spot)">
            {layout.traces.map((t, i) => <path key={i} d={t.d} />)}
          </g>

          <g className="cb-packets">
            {Array.from({ length: packetCount }, (_, i) => (
              <g className="cb-packet" key={i}>
                <path className="cb-trail cb-trail--glow" />
                <path className="cb-trail cb-trail--core" />
                <g className="cb-head">
                  <circle className="cb-head-glow" r="7" />
                  <circle className="cb-head-core" r="2.4" />
                </g>
              </g>
            ))}
          </g>

          <g className="cb-pads">
            {layout.pads.map((p, i) => {
              const r = p.via ? 4.5 : 3
              return (
                <circle
                  key={i}
                  className={`cb-pad${p.via ? ' cb-pad--via' : ''}`}
                  cx={p.x.toFixed(1)}
                  cy={p.y.toFixed(1)}
                  r={r}
                  data-r={r}
                  data-trace={p.trace}
                  data-at={p.at}
                />
              )
            })}
          </g>

          <g className="cb-ripples">
            {Array.from({ length: RIPPLES }, (_, i) => <circle key={i} className="cb-ripple" cx="0" cy="0" r="0" />)}
          </g>
        </svg>
      )}
    </div>
  )
}
