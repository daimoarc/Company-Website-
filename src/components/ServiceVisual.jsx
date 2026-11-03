import { useRef } from 'react'
import { gsap } from 'gsap'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(DrawSVGPlugin, useGSAP)

/* ─────────────────────────────────────────────────────────────────
   Service-page scenes: each one is a small story of the service at work,
   sequenced with a looping GSAP timeline. Continuous details (signals,
   spinners, hearts) live in styles.css → "SERVICE SCENES".
   Every colour means something inside the scenes:
   ───────────────────────────────────────────────────────────────── */
const C = {
  cyan: '#3CDCE6', // data, signals, primary actions
  green: '#4cc38a', // success, healthy, done
  amber: '#f5a524', // running, load, attention
  coral: '#ff6b6b', // alerts, likes, top priority
  blue: '#6ea8fe', // infrastructure, secondary series
  text: '#eef0f5',
  text2: '#a3a9b8',
  muted: '#7a8296',
  panel: '#151a25',
  raised: '#1d2331',
  line: 'rgba(238,240,245,0.09)',
  ink: '#0b0d14',
}

const Panel = ({ x, y, w, h, r = 10, fill = C.panel, stroke = C.line, ...rest }) => (
  <rect x={x} y={y} width={w} height={h} rx={r} fill={fill} stroke={stroke} {...rest} />
)
const Label = ({ x, y, children, fill = C.muted, size = 7.5, anchor, className, ...rest }) => (
  <text x={x} y={y} fontSize={size} fill={fill} textAnchor={anchor} className={className} {...rest}>{children}</text>
)

/* ── timeline helpers ── */
// Puts targets in their start state at the top of every loop, then animates them in at `at`.
function reveal(tl, targets, from, to, at) {
  tl.set(targets, from, 0)
  tl.fromTo(targets, from, { immediateRender: false, ...to }, at)
}
// Counts a text value up, resetting it at the top of every loop.
function count(tl, el, from, to, fmt, duration, at) {
  if (!el) return
  const o = { v: from }
  tl.call(() => { o.v = from; el.textContent = fmt(from) }, null, 0)
  tl.to(o, { v: to, duration, ease: 'power1.out', onUpdate: () => { el.textContent = fmt(o.v) } }, at)
}
const fadeOut = (tl, q, at) => tl.to(q('.dyn'), { opacity: 0, duration: 0.5 }, at)

/* ═════════════ AI & machine learning ═════════════ */
function AiScene() {
  const X = [188, 237, 286]
  const L = [[56, 80, 104], [50, 72, 94, 116], [66, 98]]
  const edges = []
  L[0].forEach((a) => L[1].forEach((b) => edges.push([X[0], a, X[1], b])))
  L[1].forEach((a) => L[2].forEach((b) => edges.push([X[1], a, X[2], b])))
  const nodes = L.flatMap((ys, l) => ys.map((y) => [X[l], y, l]))
  return (
    <>
      {/* object detection on a camera frame */}
      <Panel x={12} y={14} w={142} h={116} />
      <Label x={22} y={28}>camera_04.jpg</Label>
      <line x1="20" y1="118" x2="146" y2="118" stroke={C.line} />
      <rect x="32" y="80" width="38" height="36" rx="3" fill="#262d3d" />
      <line x1="32" y1="92" x2="70" y2="92" stroke="#333b4f" strokeWidth="2" />
      <circle cx="112" cy="60" r="9" fill="#262d3d" />
      <rect x="100" y="72" width="24" height="44" rx="10" fill="#262d3d" />
      <rect className="ai-scan dyn" x="18" y="36" width="130" height="2" rx="1" fill={C.cyan} />
      <g className="ai-det dyn">
        <rect className="ai-box" x="27" y="74" width="48" height="46" rx="2" stroke={C.cyan} strokeWidth="1.5" />
        <g className="ai-tag"><rect x="27" y="63" width="50" height="11" rx="2" fill={C.cyan} /><Label x={31} y={71} fill={C.ink} size={7}>box 0.97</Label></g>
      </g>
      <g className="ai-det dyn">
        <rect className="ai-box" x="96" y="47" width="32" height="73" rx="2" stroke={C.amber} strokeWidth="1.5" />
        <g className="ai-tag"><rect x="96" y="36" width="56" height="11" rx="2" fill={C.amber} /><Label x={100} y={44} fill={C.ink} size={7}>person 0.92</Label></g>
      </g>

      {/* the model */}
      <Panel x={166} y={14} w={142} h={116} />
      <Label x={176} y={28}>model</Label>
      <g className="ai-train"><rect x="248" y="19" width="52" height="13" rx="6.5" fill={C.amber} fillOpacity=".16" /><Label x={274} y={28.5} anchor="middle" fill={C.amber} size={7}>training</Label></g>
      <g className="ai-live dyn"><rect x="248" y="19" width="52" height="13" rx="6.5" fill={C.green} fillOpacity=".16" /><Label x={274} y={28.5} anchor="middle" fill={C.green} size={7}>deployed</Label></g>
      {edges.map(([x1, y1, x2, y2], i) => <line key={`e${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.line} />)}
      {edges.map(([x1, y1, x2, y2], i) => (
        <line key={`s${i}`} className="sv-signal" style={{ animationDelay: `${(i % 7) * 0.37}s` }} x1={x1} y1={y1} x2={x2} y2={y2} stroke={i % 3 === 0 ? C.green : C.cyan} />
      ))}
      {nodes.map(([x, y, l], i) => {
        const color = l === 2 ? C.green : C.cyan
        return <circle key={`n${i}`} className="sv-neuron" style={{ '--c': color, animationDelay: `${(i % 5) * 0.45}s` }} cx={x} cy={y} r={l === 2 ? 6 : 4.5} fill={C.ink} stroke={color} strokeWidth="1.5" />
      })}

      {/* training curve + generative answer */}
      <Panel x={12} y={142} w={296} h={102} />
      <Label x={22} y={158}>accuracy</Label>
      <Label className="ai-acc sv-sans" x={150} y={159} anchor="end" fill={C.green} size={10}>97.4%</Label>
      {[176, 196, 216].map((y) => <line key={y} x1="22" y1={y} x2="150" y2={y} stroke={C.line} />)}
      <path className="ai-area dyn" d="M22 232 L22 226 L43 212 L64 204 L85 192 L106 185 L127 176 L150 170 L150 232 Z" fill={C.green} fillOpacity=".12" />
      <polyline className="ai-line dyn" points="22 226 43 212 64 204 85 192 106 185 127 176 150 170" stroke={C.green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="164" y="152" width="134" height="82" rx="8" fill={C.raised} />
      <Label x={172} y={166}>› summarise this report</Label>
      {[[288, C.text], [280, C.text2], [262, C.text2], [236, C.cyan]].map(([x2, color], i) => (
        <line key={i} className="ai-type dyn" x1="172" y1={182 + i * 12} x2={x2} y2={182 + i * 12} stroke={color} strokeWidth="3" strokeLinecap="round" />
      ))}
    </>
  )
}
function aiTimeline(tl, q) {
  const scan = q('.ai-scan')
  reveal(tl, scan, { opacity: 0, y: 0 }, { opacity: 0.85, duration: 0.2 }, 0.2)
  tl.to(scan, { y: 82, duration: 1.2, ease: 'none' }, 0.2).to(scan, { opacity: 0, duration: 0.2 }, 1.3)
  const boxes = q('.ai-box')
  const tags = q('.ai-tag')
  q('.ai-det').forEach((d, i) => {
    const at = 1.4 + i * 0.5
    reveal(tl, d, { opacity: 0 }, { opacity: 1, duration: 0.1 }, at)
    reveal(tl, boxes[i], { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.5, ease: 'power2.inOut' }, at)
    reveal(tl, tags[i], { scaleX: 0, transformOrigin: 'left center' }, { scaleX: 1, duration: 0.3 }, at + 0.35)
  })
  reveal(tl, q('.ai-line'), { drawSVG: '0%', opacity: 1 }, { drawSVG: '100%', duration: 2.4, ease: 'power1.inOut' }, 1)
  reveal(tl, q('.ai-area'), { opacity: 0 }, { opacity: 1, duration: 1.6 }, 1.6)
  count(tl, q('.ai-acc')[0], 88, 97.4, (v) => `${v.toFixed(1)}%`, 2.4, 1)
  q('.ai-type').forEach((l, i) => reveal(tl, l, { scaleX: 0, opacity: 1, transformOrigin: 'left center' }, { scaleX: 1, duration: 0.45, ease: 'power1.out' }, 3.2 + i * 0.4))
  reveal(tl, q('.ai-train'), { opacity: 1 }, { opacity: 0, duration: 0.3 }, 4.9)
  reveal(tl, q('.ai-live'), { opacity: 0 }, { opacity: 1, duration: 0.3 }, 4.9)
  tl.addLabel('hold', 5.4)
  fadeOut(tl, q, 7.6)
}

/* ═════════════ Cloud ═════════════ */
function CloudScene() {
  const xs = [24, 96, 168, 240]
  return (
    <>
      <Panel x={12} y={12} w={296} h={74} />
      <Label x={22} y={27}>requests / s</Label>
      <Label className="cl-rps sv-sans" x={298} y={28} anchor="end" fill={C.amber} size={10}>6.4k</Label>
      <line x1="22" y1="78" x2="298" y2="78" stroke={C.line} />
      <path className="cl-area dyn" d="M22 78 L22 72 L56 69 L90 66 L124 60 L158 54 L192 47 L226 44 L260 39 L298 35 L298 78 Z" fill={C.amber} fillOpacity=".12" />
      <polyline className="cl-line dyn" points="22 72 56 69 90 66 124 60 158 54 192 47 226 44 260 39 298 35" stroke={C.amber} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

      <rect x="118" y="98" width="84" height="22" rx="11" fill={C.raised} stroke={C.cyan} strokeOpacity=".7" />
      <Label x={160} y={112} anchor="middle" fill={C.text2}>load balancer</Label>

      {xs.map((x, i) => (
        <g key={x} className={i === 3 ? 'cl-new dyn' : undefined}>
          <line x1="160" y1="120" x2={x + 28} y2="148" stroke={C.line} />
          <line className="sv-packet" style={{ animationDelay: `${i * 0.3}s` }} x1="160" y1="120" x2={x + 28} y2="148" stroke={C.cyan} />
          <rect x={x} y="148" width="56" height="84" rx="8" fill={C.panel} stroke={i === 3 ? C.green : C.line} strokeOpacity={i === 3 ? 0.6 : 1} />
          <Label x={x + 8} y={162} size={7}>{`i-0${i + 1}`}</Label>
          <circle cx={x + 47} cy="159" r="2.5" fill={C.green} />
          {[0, 1, 2].map((b) => <rect key={b} className="cl-bar" x={x + 10 + b * 13} y="176" width="9" height="46" rx="2" fill={C.green} />)}
        </g>
      ))}
      <g className="cl-plus dyn"><rect x="226" y="236" width="70" height="14" rx="7" fill={C.green} fillOpacity=".16" /><Label x={261} y={246} anchor="middle" fill={C.green} size={7}>+1 instance</Label></g>
      <Label x={22} y={247}>eu-west-2 · auto-scaling</Label>
    </>
  )
}
function cloudTimeline(tl, q) {
  reveal(tl, q('.cl-line'), { drawSVG: '0%', opacity: 1 }, { drawSVG: '100%', duration: 2.6, ease: 'power1.inOut' }, 0.2)
  reveal(tl, q('.cl-area'), { opacity: 0 }, { opacity: 1, duration: 2 }, 0.6)
  count(tl, q('.cl-rps')[0], 1.2, 6.4, (v) => `${v.toFixed(1)}k`, 2.6, 0.2)
  const bars = q('.cl-bar')
  tl.set(bars, { scaleY: 0.3, transformOrigin: 'center bottom', fill: C.green }, 0)
  tl.to(bars.slice(0, 9), { scaleY: (i) => [0.82, 0.9, 0.86, 0.94, 0.8, 0.88, 0.92, 0.84, 0.9][i], fill: C.amber, duration: 1.4, stagger: 0.05, ease: 'power2.inOut' }, 0.8)
  reveal(tl, q('.cl-new'), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5 }, 2.9)
  reveal(tl, q('.cl-plus'), { opacity: 0, x: -6 }, { opacity: 1, x: 0, duration: 0.35 }, 3.1)
  tl.to(bars, { scaleY: (i) => [0.48, 0.55, 0.5, 0.52, 0.46, 0.56, 0.5, 0.54, 0.47, 0.45, 0.52, 0.49][i], fill: C.green, duration: 1.2, stagger: 0.04, ease: 'power2.inOut' }, 3.4)
  tl.addLabel('hold', 4.9)
  fadeOut(tl, q, 7)
}

/* ═════════════ DevOps ═════════════ */
const STAGES = ['build', 'test', 'scan', 'deploy', 'monitor']
const SX = [36, 98, 160, 222, 284]
const LOG = [
  ['$ npm run build', C.text2], ['✓ compiled in 4.2s', C.green],
  ['$ npm test', C.text2], ['✓ 128 passed, 0 failed', C.green],
  ['$ security scan', C.text2], ['✓ 0 critical issues', C.green],
  ['→ deploying to production', C.amber], ['✓ live · health checks passing', C.cyan],
]
function DevopsScene() {
  return (
    <>
      <rect x="12" y="12" width="190" height="24" rx="12" fill={C.raised} />
      <circle cx="26" cy="24" r="3.5" stroke={C.cyan} strokeWidth="1.5" />
      <line x1="29.5" y1="24" x2="35" y2="24" stroke={C.cyan} strokeWidth="1.5" />
      <Label x={40} y={27} fill={C.text} size={8} className="sv-sans">feat: checkout v2</Label>
      <Label x={194} y={27} anchor="end" fill={C.amber}>a1f3c9e</Label>
      <Label x={298} y={27} anchor="end">main</Label>

      <line x1={SX[0]} y1="62" x2={SX[4]} y2="62" stroke={C.line} strokeWidth="2" />
      <line className="dv-progress" x1={SX[0]} y1="62" x2={SX[4]} y2="62" stroke={C.green} strokeWidth="2" />
      {STAGES.map((s, i) => (
        <g key={s}>
          <circle cx={SX[i]} cy="62" r="12" fill={C.panel} stroke={C.line} strokeWidth="1.5" />
          <circle className="dv-run" cx={SX[i]} cy="62" r="12" stroke={C.amber} strokeWidth="2" strokeDasharray="20 56" strokeLinecap="round" />
          <g className="dv-done">
            <circle cx={SX[i]} cy="62" r="12" fill={C.green} fillOpacity=".18" stroke={C.green} strokeWidth="1.5" />
            <path d={`M${SX[i] - 5} 62.5l3.2 3.2 6.3-6.6`} stroke={C.green} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </g>
          <Label x={SX[i]} y={90} anchor="middle">{s}</Label>
        </g>
      ))}

      <Panel x={12} y={104} w={296} h={140} fill="#0f1219" />
      <circle cx="24" cy="117" r="3" fill={C.coral} /><circle cx="34" cy="117" r="3" fill={C.amber} /><circle cx="44" cy="117" r="3" fill={C.green} />
      <Label x={160} y={120} anchor="middle" size={7}>deploy.log</Label>
      {LOG.map(([t, color], i) => <Label key={i} className="dv-log dyn" x={22} y={138 + i * 13.5} fill={color}>{t}</Label>)}
    </>
  )
}
function devopsTimeline(tl, q) {
  const runs = q('.dv-run')
  const dones = q('.dv-done')
  const progress = q('.dv-progress')
  tl.set(runs, { opacity: 0 }, 0)
  tl.set(dones, { opacity: 0, scale: 0.6, transformOrigin: 'center' }, 0)
  tl.set(progress, { drawSVG: '0%', opacity: 1 }, 0)
  STAGES.forEach((_, i) => {
    const start = 0.3 + i * 1.0
    const done = start + 0.75
    tl.to(runs[i], { opacity: 1, duration: 0.15 }, start)
    tl.to(runs[i], { opacity: 0, duration: 0.15 }, done)
    tl.to(dones[i], { opacity: 1, scale: 1, duration: 0.3 }, done)
    if (i > 0) tl.to(progress, { drawSVG: `${(i / 4) * 100}%`, duration: 0.35, ease: 'power1.inOut' }, done - 0.1)
  })
  q('.dv-log').forEach((l, i) => reveal(tl, l, { opacity: 0, x: -4 }, { opacity: 1, x: 0, duration: 0.25 }, 0.3 + Math.floor(i / 2) * 1.0 + (i % 2) * 0.7))
  tl.addLabel('hold', 5.4)
  tl.to([...dones, ...progress], { opacity: 0, duration: 0.4 }, 7.4)
  fadeOut(tl, q, 7.4)
}

/* ═════════════ Requirement engineering ═════════════ */
const REQS = [['Must', C.coral, 'Book a slot online'], ['Should', C.amber, 'SMS reminders'], ['Could', C.blue, 'Take a deposit']]
function RequirementsScene() {
  return (
    <>
      <circle cx="22" cy="24" r="8" fill={C.blue} fillOpacity=".2" stroke={C.blue} strokeWidth="1.2" />
      <circle cx="22" cy="22" r="2.6" fill={C.blue} />
      <path d="M17.5 28.5a4.5 4 0 0 1 9 0" stroke={C.blue} strokeWidth="1.2" />
      <Label x={36} y={27}>client interview</Label>
      <g className="rq-bubble dyn"><rect x="12" y="40" width="126" height="34" rx="10" fill={C.raised} /><Label x={22} y={54} fill={C.text} className="sv-sans">We need customers to book</Label><Label x={22} y={66} fill={C.text} className="sv-sans">appointments online</Label></g>
      <g className="rq-bubble dyn"><rect x="24" y="80" width="114" height="22" rx="10" fill={C.cyan} fillOpacity=".12" stroke={C.cyan} strokeOpacity=".5" /><Label x={34} y={94} fill={C.text} className="sv-sans">…and send SMS reminders</Label></g>
      <g className="rq-bubble dyn"><rect x="12" y="108" width="112" height="22" rx="10" fill={C.raised} /><Label x={22} y={122} fill={C.text} className="sv-sans">…maybe take a deposit</Label></g>

      <line x1="20" y1="165" x2="20" y2="211" stroke={C.line} />
      {['elicit', 'specify', 'validate'].map((s, i) => (
        <g key={s}>
          <circle className="rq-dot" cx="20" cy={160 + i * 28} r="5" fill={C.ink} stroke={C.muted} strokeWidth="1.2" />
          <Label className="rq-step" x={32} y={163 + i * 28} size={8}>{`${i + 1}  ${s}`}</Label>
        </g>
      ))}

      <Panel x={146} y={12} w={162} h={232} />
      <Label x={156} y={27}>requirements.md</Label>
      <Label x={298} y={27} anchor="end" fill={C.text2} size={7}>v1.2</Label>
      {REQS.map(([p, color, title], i) => {
        const y = 38 + i * 54
        return (
          <g key={p} className="rq-card dyn">
            <rect x="154" y={y} width="146" height="46" rx="8" fill={C.raised} />
            <rect x="162" y={y + 8} width={p.length * 5 + 12} height="12" rx="6" fill={color} fillOpacity=".18" />
            <Label x={168} y={y + 17} fill={color} size={7}>{p}</Label>
            <Label x={162} y={y + 33} fill={C.text} size={8} className="sv-sans">{title}</Label>
            <line x1="162" y1={y + 40} x2="240" y2={y + 40} stroke={C.muted} strokeOpacity=".35" strokeWidth="2" strokeLinecap="round" />
            <circle cx="284" cy={y + 23} r="8" stroke={C.line} strokeWidth="1.5" />
            <g className="rq-check">
              <circle cx="284" cy={y + 23} r="8" fill={C.green} fillOpacity=".18" stroke={C.green} strokeWidth="1.5" />
              <path d={`M280 ${y + 23.5}l2.6 2.6 5.2-5.4`} stroke={C.green} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </g>
        )
      })}
      <g className="rq-approved dyn"><rect x="154" y="208" width="74" height="22" rx="11" fill={C.green} fillOpacity=".16" stroke={C.green} strokeOpacity=".6" /><Label x={191} y={222} anchor="middle" fill={C.green} size={8}>Approved</Label></g>
      <path className="rq-sign dyn" d="M238 224c5-9 9 4 14-2s7-8 11 1 9-5 14-1 7 3 11-2" stroke={C.text2} strokeWidth="1.4" strokeLinecap="round" />
    </>
  )
}
function requirementsTimeline(tl, q) {
  const dots = q('.rq-dot')
  const steps = q('.rq-step')
  tl.set(dots, { fill: C.ink, stroke: C.muted }, 0)
  tl.set(steps, { fill: C.muted }, 0)
  const light = (i, at) => {
    tl.to(dots[i], { fill: C.cyan, stroke: C.cyan, duration: 0.3 }, at)
    tl.to(steps[i], { fill: C.text, duration: 0.3 }, at)
  }
  light(0, 0.2)
  q('.rq-bubble').forEach((b, i) => reveal(tl, b, { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.45 }, 0.3 + i * 0.6))
  light(1, 2.1)
  q('.rq-card').forEach((c, i) => reveal(tl, c, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.45 }, 2.2 + i * 0.45))
  const checks = q('.rq-check')
  tl.set(checks, { opacity: 0, scale: 0.5, transformOrigin: 'center' }, 0)
  light(2, 3.9)
  checks.forEach((c, i) => tl.to(c, { opacity: 1, scale: 1, duration: 0.3 }, 4.0 + i * 0.4))
  reveal(tl, q('.rq-approved'), { opacity: 0, scale: 0.9, transformOrigin: 'left center' }, { opacity: 1, scale: 1, duration: 0.35 }, 5.4)
  reveal(tl, q('.rq-sign'), { drawSVG: '0%', opacity: 1 }, { drawSVG: '100%', duration: 0.9, ease: 'power1.inOut' }, 5.6)
  tl.addLabel('hold', 6.6)
  fadeOut(tl, q, 8.4)
}

/* ═════════════ Product engineering ═════════════ */
const KPIS = [['users', '1,284', C.cyan], ['growth', '+12%', C.green], ['open tasks', '38', C.amber]]
const BARS = [24, 38, 30, 46, 34, 52, 42, 58]
const MILESTONES = [['prototype', 36], ['MVP', 118.7], ['beta', 201.3], ['v1.0', 284]]
function ProductScene() {
  return (
    <>
      <Panel x={12} y={12} w={296} h={176} />
      {[22, 31, 40].map((x) => <circle key={x} cx={x} cy="23" r="2.5" fill={C.raised} />)}
      <Label x={160} y={26} anchor="middle" size={7}>dashboard</Label>
      <line x1="12" y1="34" x2="308" y2="34" stroke={C.line} />
      <line x1="76" y1="34" x2="76" y2="188" stroke={C.line} />
      {[46, 62, 78, 94, 110].map((y, i) => (
        <rect key={y} className="pd-nav dyn" x="20" y={y} width={i === 0 ? 48 : 40 - (i % 2) * 8} height="8" rx="4" fill={i === 0 ? C.cyan : C.muted} fillOpacity={i === 0 ? 0.35 : 0.25} />
      ))}
      <rect className="pd-head dyn" x="86" y="44" width="84" height="9" rx="3" fill={C.text} fillOpacity=".85" />
      {KPIS.map(([label, value, color], i) => (
        <g key={label} className="pd-kpi dyn">
          <rect x={86 + i * 72} y="62" width="66" height="40" rx="6" fill={C.raised} />
          <Label x={93 + i * 72} y={75} size={6.5}>{label}</Label>
          <Label className="pd-val sv-sans" x={93 + i * 72} y={94} fill={color} size={12}>{value}</Label>
        </g>
      ))}
      <g className="pd-chart dyn">
        <rect x="86" y="110" width="214" height="70" rx="6" fill={C.raised} />
        {BARS.map((h, i) => {
          const last = i === BARS.length - 1
          return <rect key={i} className="pd-bar" x={98 + i * 25} y={174 - h} width="13" height={h} rx="2" fill={last ? C.amber : i % 2 ? C.blue : C.cyan} fillOpacity={last ? 1 : 0.75} />
        })}
      </g>

      <line x1="36" y1="214" x2="284" y2="214" stroke={C.line} strokeWidth="2" />
      <line className="pd-road" x1="36" y1="214" x2="284" y2="214" stroke={C.cyan} strokeWidth="2" />
      {MILESTONES.map(([m, x]) => (
        <g key={m}>
          <circle className="pd-mile" cx={x} cy="214" r="6" fill={C.ink} stroke={C.muted} strokeWidth="1.5" />
          <Label className="pd-mile-label" x={x} y={236} anchor="middle">{m}</Label>
        </g>
      ))}
    </>
  )
}
function productTimeline(tl, q) {
  q('.pd-nav').forEach((n, i) => reveal(tl, n, { opacity: 0, x: -6 }, { opacity: 1, x: 0, duration: 0.3 }, 0.2 + i * 0.1))
  reveal(tl, q('.pd-head'), { opacity: 0, scaleX: 0, transformOrigin: 'left center' }, { opacity: 1, scaleX: 1, duration: 0.4 }, 0.8)
  q('.pd-kpi').forEach((k, i) => reveal(tl, k, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.35 }, 1.1 + i * 0.15))
  const vals = q('.pd-val')
  count(tl, vals[0], 0, 1284, (v) => Math.round(v).toLocaleString('en-GB'), 1.4, 1.1)
  count(tl, vals[1], 0, 12, (v) => `+${Math.round(v)}%`, 1.4, 1.25)
  count(tl, vals[2], 0, 38, (v) => `${Math.round(v)}`, 1.4, 1.4)
  reveal(tl, q('.pd-chart'), { opacity: 0 }, { opacity: 1, duration: 0.3 }, 1.7)
  reveal(tl, q('.pd-bar'), { scaleY: 0, transformOrigin: 'center bottom' }, { scaleY: 1, duration: 0.5, stagger: 0.08 }, 1.8)
  const road = q('.pd-road')
  const miles = q('.pd-mile')
  const labels = q('.pd-mile-label')
  tl.set(road, { drawSVG: '0%', opacity: 1 }, 0)
  tl.set(miles, { fill: C.ink, stroke: C.muted }, 0)
  tl.set(labels, { fill: C.muted }, 0)
  ;[0.3, 1.2, 2.1, 3.0].forEach((at, i) => {
    const color = i === 3 ? C.green : C.cyan
    if (i > 0) tl.to(road, { drawSVG: `${(i / 3) * 100}%`, duration: 0.8, ease: 'power1.inOut' }, at - 0.8)
    tl.to(miles[i], { fill: color, stroke: color, duration: 0.25 }, at)
    tl.to(labels[i], { fill: i === 3 ? C.green : C.text, duration: 0.25 }, at)
  })
  tl.addLabel('hold', 3.6)
  tl.to(road, { opacity: 0, duration: 0.5 }, 6.6)
  fadeOut(tl, q, 6.6)
}

/* ═════════════ Web & mobile ═════════════ */
function WebScene() {
  return (
    <>
      <Panel x={12} y={16} w={206} h={146} r={8} />
      {[22, 30, 38].map((x) => <circle key={x} cx={x} cy="25" r="2.2" fill={C.raised} />)}
      <rect x="52" y="20" width="126" height="10" rx="5" fill={C.raised} />
      <Label x={60} y={27.5} size={6.5}>yourbusiness.com</Label>
      <line x1="12" y1="34" x2="218" y2="34" stroke={C.line} />
      <g className="wb-hero dyn">
        <rect x="22" y="42" width="186" height="40" rx="6" fill={C.blue} fillOpacity=".16" />
        <rect x="32" y="52" width="92" height="8" rx="3" fill={C.text} fillOpacity=".85" />
        <rect x="32" y="65" width="62" height="5" rx="2.5" fill={C.text2} fillOpacity=".5" />
        <g className="wb-btn"><rect x="152" y="54" width="46" height="16" rx="5" fill={C.cyan} /><Label x={175} y={65} anchor="middle" fill={C.ink} size={7} className="sv-sans">Book now</Label></g>
      </g>
      {[[22, C.amber], [84, C.coral], [146, C.green]].map(([x, color]) => (
        <g key={x} className="wb-card dyn">
          <rect x={x} y="90" width="58" height="64" rx="6" fill={C.raised} />
          <rect x={x + 6} y="96" width="46" height="28" rx="4" fill={color} fillOpacity=".3" />
          <rect x={x + 6} y="130" width="36" height="5" rx="2.5" fill={C.text} fillOpacity=".7" />
          <rect x={x + 6} y="140" width="24" height="5" rx="2.5" fill={C.text2} fillOpacity=".45" />
        </g>
      ))}
      <rect x="2" y="162" width="226" height="7" rx="3.5" fill={C.raised} />
      <circle className="wb-ripple" cx="175" cy="62" r="4" stroke={C.cyan} strokeWidth="1.5" />
      <g className="wb-toast dyn">
        <rect x="118" y="132" width="92" height="22" rx="6" fill={C.ink} stroke={C.green} strokeOpacity=".6" />
        <circle cx="129" cy="143" r="3" fill={C.green} />
        <Label x={137} y={146} fill={C.text} size={7} className="sv-sans">Booking confirmed</Label>
      </g>
      <path className="wb-cursor" d="M0 0 L0 13 L3.6 9.6 L6.4 15.4 L8.6 14.4 L5.8 8.8 L10.6 8.8 Z" fill={C.text} stroke={C.ink} strokeWidth="1" />

      <line x1="218" y1="100" x2="236" y2="100" stroke={C.line} />
      <line className="sv-packet" x1="218" y1="100" x2="236" y2="100" stroke={C.cyan} />

      <rect x="236" y="22" width="74" height="152" rx="13" fill={C.panel} stroke={C.line} />
      <rect x="262" y="27" width="22" height="4" rx="2" fill={C.raised} />
      <g className="wb-phone dyn">
        <rect x="244" y="40" width="58" height="30" rx="5" fill={C.blue} fillOpacity=".16" />
        <rect x="250" y="47" width="36" height="5" rx="2.5" fill={C.text} fillOpacity=".85" />
        <rect x="250" y="57" width="24" height="7" rx="3" fill={C.cyan} />
        {[78, 108, 138].map((y, i) => (
          <g key={y}>
            <rect x="244" y={y} width="58" height="24" rx="5" fill={C.raised} />
            <rect x="249" y={y + 5} width="14" height="14" rx="3" fill={[C.amber, C.coral, C.green][i]} fillOpacity=".35" />
            <rect x="268" y={y + 7} width="28" height="4" rx="2" fill={C.text} fillOpacity=".7" />
            <rect x="268" y={y + 14} width="18" height="4" rx="2" fill={C.text2} fillOpacity=".45" />
          </g>
        ))}
      </g>
      <g className="wb-notif dyn">
        <rect x="240" y="34" width="66" height="24" rx="7" fill={C.ink} stroke={C.green} strokeOpacity=".6" />
        <circle cx="250" cy="46" r="3" fill={C.green} />
        <Label x={257} y={49} fill={C.text} size={6.5} className="sv-sans">Confirmed</Label>
      </g>
      <Label x={115} y={186} anchor="middle">desktop</Label>
      <Label x={273} y={186} anchor="middle">mobile</Label>

      <Panel x={12} y={198} w={296} h={46} />
      <Label x={22} y={214}>POST /api/bookings</Label>
      <Label className="wb-status dyn" x={298} y={214} anchor="end" fill={C.green}>201 created</Label>
      <rect x="22" y="225" width="276" height="6" rx="3" fill={C.raised} />
      <rect className="wb-latency dyn" x="22" y="225" width="86" height="6" rx="3" fill={C.cyan} />
      <Label className="wb-ms dyn" x={114} y={231.5} size={6.5}>86 ms</Label>
    </>
  )
}
function webTimeline(tl, q) {
  reveal(tl, q('.wb-hero'), { opacity: 0 }, { opacity: 1, duration: 0.4 }, 0.2)
  reveal(tl, q('.wb-card'), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.12 }, 0.4)
  reveal(tl, q('.wb-phone'), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4 }, 0.6)
  const cursor = q('.wb-cursor')
  tl.set(cursor, { x: 70, y: 150, opacity: 0 }, 0)
  tl.to(cursor, { opacity: 1, duration: 0.2 }, 1.2)
  tl.to(cursor, { x: 172, y: 60, duration: 1.0, ease: 'power2.inOut' }, 1.3)
  tl.to(q('.wb-btn'), { scale: 0.94, transformOrigin: 'center', duration: 0.1, yoyo: true, repeat: 1 }, 2.35)
  tl.set(q('.wb-ripple'), { opacity: 0 }, 0)
  tl.fromTo(q('.wb-ripple'), { opacity: 0.9, scale: 1, transformOrigin: 'center' }, { opacity: 0, scale: 5, duration: 0.7, immediateRender: false }, 2.4)
  reveal(tl, q('.wb-latency'), { scaleX: 0, transformOrigin: 'left center', opacity: 1 }, { scaleX: 1, duration: 0.5 }, 2.5)
  reveal(tl, q('.wb-toast'), { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.35 }, 2.6)
  reveal(tl, q('.wb-status'), { opacity: 0 }, { opacity: 1, duration: 0.3 }, 2.9)
  reveal(tl, q('.wb-ms'), { opacity: 0 }, { opacity: 1, duration: 0.3 }, 2.9)
  reveal(tl, q('.wb-notif'), { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.45 }, 3.1)
  tl.to(cursor, { x: 120, y: 120, opacity: 0, duration: 0.8 }, 3.4)
  tl.addLabel('hold', 4.2)
  fadeOut(tl, q, 6.6)
}

/* ═════════════ WordPress, Shopify & TikTok ═════════════ */
const PRODUCTS = [[22, 40, C.amber, '£24', 'circle'], [104, 40, C.blue, '£39', 'square'], [22, 140, C.coral, '£18', 'tri'], [104, 140, C.green, '£52', 'pill']]
function StoreScene() {
  return (
    <>
      <Panel x={12} y={12} w={176} h={232} />
      <Label x={22} y={29}>your-store</Label>
      <path d="M150 21h3l2 9h11l2-6h-14" stroke={C.text2} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="157" cy="33" r="1.3" fill={C.text2} />
      <circle cx="165" cy="33" r="1.3" fill={C.text2} />
      <g className="st-badge"><circle cx="171" cy="19" r="6.5" fill={C.coral} /><Label className="st-count sv-sans" x={171} y={22} anchor="middle" fill={C.ink}>3</Label></g>
      {PRODUCTS.map(([x, y, color, price, shape], i) => (
        <g key={i} className="st-card dyn">
          <rect x={x} y={y} width="76" height="94" rx="8" fill={C.raised} />
          <rect x={x + 7} y={y + 7} width="62" height="46" rx="6" fill={color} fillOpacity=".14" />
          {shape === 'circle' && <circle cx={x + 38} cy={y + 30} r="13" fill={color} fillOpacity=".85" />}
          {shape === 'square' && <rect x={x + 26} y={y + 18} width="24" height="24" rx="5" fill={color} fillOpacity=".85" />}
          {shape === 'tri' && <path d={`M${x + 38} ${y + 16} l14 26 h-28 z`} fill={color} fillOpacity=".85" />}
          {shape === 'pill' && <rect x={x + 22} y={y + 22} width="32" height="16" rx="8" fill={color} fillOpacity=".85" />}
          <rect x={x + 7} y={y + 62} width="40" height="5" rx="2.5" fill={C.text} fillOpacity=".7" />
          <Label x={x + 7} y={y + 84} fill={C.text} size={9} className="sv-sans">{price}</Label>
          <g className={i === 1 ? 'st-add' : undefined}>
            <rect x={x + 46} y={y + 74} width="22" height="13" rx="6.5" fill={C.cyan} fillOpacity=".18" stroke={C.cyan} strokeOpacity=".6" />
            <Label x={x + 57} y={y + 83.5} anchor="middle" fill={C.cyan} size={8}>+</Label>
          </g>
        </g>
      ))}
      <circle className="st-fly" cx="0" cy="0" r="4" fill={C.blue} />

      <rect x="198" y="12" width="110" height="150" rx="10" fill="#10131b" stroke={C.line} />
      <Label x={208} y={28} size={7}>@yourstore · live</Label>
      <circle className="st-live" cx="294" cy="25" r="3" fill={C.coral} />
      <circle cx="253" cy="62" r="20" fill={C.blue} fillOpacity=".18" />
      <rect x="236" y="72" width="34" height="34" rx="8" fill={C.blue} fillOpacity=".55" />
      <g className="st-tag dyn"><rect x="206" y="114" width="64" height="18" rx="9" fill={C.ink} stroke={C.cyan} strokeOpacity=".6" /><Label x={238} y={126} anchor="middle" fill={C.text} size={7} className="sv-sans">£39 · Shop</Label></g>
      {[0, 1, 2].map((i) => (
        <path key={i} className="st-heart" style={{ animationDelay: `${i * 0.7}s` }} d="M290 140c-2.5-2.5-6 0-3.5 3.2L290 146l3.5-2.8c2.5-3.2-1-5.7-3.5-3.2z" fill={C.coral} />
      ))}
      <rect x="206" y="150" width="94" height="3" rx="1.5" fill={C.raised} />
      <rect className="st-progress" x="206" y="150" width="94" height="3" rx="1.5" fill={C.cyan} />

      <g className="st-order dyn">
        <rect x="198" y="172" width="110" height="72" rx="10" fill={C.panel} stroke={C.green} strokeOpacity=".5" />
        <circle cx="211" cy="188" r="3" fill={C.green} />
        <Label x={219} y={191} fill={C.text} size={8} className="sv-sans">New order</Label>
        <Label className="st-amount sv-sans" x={208} y={216} fill={C.green} size={14}>£39.00</Label>
        <Label x={208} y={234} size={7}>from the live video</Label>
      </g>
    </>
  )
}
function storeTimeline(tl, q) {
  reveal(tl, q('.st-card'), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.1 }, 0.2)
  reveal(tl, q('.st-tag'), { opacity: 0, scale: 0.85, transformOrigin: 'left center' }, { opacity: 1, scale: 1, duration: 0.35 }, 0.9)
  tl.to(q('.st-add'), { scale: 1.15, transformOrigin: 'center', duration: 0.15, yoyo: true, repeat: 1 }, 1.5)
  const fly = q('.st-fly')
  tl.set(fly, { x: 161, y: 120, opacity: 0, scale: 1 }, 0)
  tl.to(fly, { opacity: 1, duration: 0.1 }, 1.7)
  tl.to(fly, { x: 160, y: 27, scale: 0.5, duration: 0.7, ease: 'power2.in' }, 1.7)
  tl.to(fly, { opacity: 0, duration: 0.1 }, 2.4)
  count(tl, q('.st-count')[0], 2, 3, (v) => `${Math.round(v)}`, 0.01, 2.4)
  tl.to(q('.st-badge'), { scale: 1.3, transformOrigin: 'center', duration: 0.15, yoyo: true, repeat: 1 }, 2.4)
  reveal(tl, q('.st-order'), { opacity: 0, x: 12 }, { opacity: 1, x: 0, duration: 0.45 }, 2.8)
  count(tl, q('.st-amount')[0], 0, 39, (v) => `£${v.toFixed(2)}`, 0.8, 2.9)
  tl.addLabel('hold', 3.8)
  fadeOut(tl, q, 6.6)
}

/* ═════════════ Marketing & Meta ads ═════════════ */
const METRICS = [['Reach', 'ad-reach', C.cyan, '24.3k'], ['Clicks', 'ad-clicks', C.blue, '1,862'], ['CTR', 'ad-ctr', C.green, '3.4%'], ['ROAS', 'ad-roas', C.amber, '4.1×']]
const AD_BARS = [22, 30, 26, 38, 34, 46, 58]
function AdsScene() {
  return (
    <>
      <Panel x={12} y={12} w={146} h={232} />
      <circle cx="28" cy="29" r="8" fill={C.cyan} fillOpacity=".2" stroke={C.cyan} strokeWidth="1.2" />
      <Label x={42} y={28} fill={C.text} size={8} className="sv-sans">Your brand</Label>
      <Label x={42} y={38} size={6.5}>Sponsored</Label>
      <rect x="20" y="46" width="130" height="92" rx="6" fill="#1a2233" />
      <circle className="ad-sun" cx="122" cy="70" r="12" fill={C.amber} fillOpacity=".9" />
      <path d="M20 138 L20 118 Q48 96 76 116 T130 108 L150 112 L150 132 Q150 138 144 138 Z" fill={C.blue} fillOpacity=".45" />
      <path d="M20 138 L20 126 Q60 112 98 128 T150 124 L150 132 Q150 138 144 138 Z" fill={C.green} fillOpacity=".4" />
      <rect x="20" y="146" width="112" height="6" rx="3" fill={C.text} fillOpacity=".8" />
      <rect x="20" y="158" width="80" height="5" rx="2.5" fill={C.text2} fillOpacity=".5" />
      <g className="ad-cta"><rect x="20" y="172" width="130" height="22" rx="6" fill={C.cyan} /><Label x={85} y={186} anchor="middle" fill={C.ink} size={8} className="sv-sans">Shop now</Label></g>
      <circle className="ad-ripple" cx="85" cy="183" r="4" stroke={C.ink} strokeWidth="1.5" />
      <path d="M27 216c-2.6-2.6-6.4 0-3.7 3.4L27 222.4l3.7-3c2.7-3.4-1.1-6-3.7-3.4z" fill={C.coral} />
      <Label className="ad-likes" x={36} y={222} fill={C.text2} size={8}>1.6k</Label>
      <path d="M70 214h12v8h-7l-3 3v-3h-2z" stroke={C.text2} strokeWidth="1.2" strokeLinejoin="round" />
      <Label x={88} y={222} fill={C.text2} size={8}>84</Label>

      <Panel x={168} y={12} w={140} h={120} />
      {METRICS.map(([label, cls, color, value], i) => (
        <g key={label}>
          <Label x={178} y={34 + i * 26}>{label}</Label>
          <Label className={`${cls} sv-sans`} x={298} y={35 + i * 26} anchor="end" fill={color} size={11}>{value}</Label>
          {i < 3 && <line x1="178" y1={43 + i * 26} x2="298" y2={43 + i * 26} stroke={C.line} />}
        </g>
      ))}
      <Panel x={168} y={142} w={140} h={102} />
      <Label x={178} y={157} size={7}>conversions / day</Label>
      <line x1="178" y1="196" x2="298" y2="196" stroke={C.coral} strokeOpacity=".5" strokeDasharray="3 3" />
      {AD_BARS.map((h, i) => {
        const last = i === AD_BARS.length - 1
        return <rect key={i} className="ad-bar" x={180 + i * 17} y={232 - h} width="11" height={h} rx="2" fill={last ? C.amber : C.cyan} fillOpacity={last ? 1 : 0.7} />
      })}
    </>
  )
}
function adsTimeline(tl, q) {
  tl.to(q('.ad-cta'), { scale: 0.95, transformOrigin: 'center', duration: 0.1, yoyo: true, repeat: 1 }, 0.8)
  tl.set(q('.ad-ripple'), { opacity: 0 }, 0)
  tl.fromTo(q('.ad-ripple'), { opacity: 0.8, scale: 1, transformOrigin: 'center' }, { opacity: 0, scale: 6, duration: 0.7, immediateRender: false }, 0.85)
  count(tl, q('.ad-likes')[0], 1.2, 1.6, (v) => `${v.toFixed(1)}k`, 2.5, 0.5)
  count(tl, q('.ad-reach')[0], 8, 24.3, (v) => `${v.toFixed(1)}k`, 2.2, 1)
  count(tl, q('.ad-clicks')[0], 240, 1862, (v) => Math.round(v).toLocaleString('en-GB'), 2.2, 1.15)
  count(tl, q('.ad-ctr')[0], 1.2, 3.4, (v) => `${v.toFixed(1)}%`, 2.2, 1.3)
  count(tl, q('.ad-roas')[0], 1, 4.1, (v) => `${v.toFixed(1)}×`, 2.2, 1.45)
  reveal(tl, q('.ad-bar'), { scaleY: 0, transformOrigin: 'center bottom' }, { scaleY: 1, duration: 0.5, stagger: 0.12 }, 1.2)
  tl.addLabel('hold', 3.6)
  tl.to(q('.ad-bar'), { scaleY: 0, duration: 0.4, stagger: 0.03 }, 6.4)
}

const SCENES = {
  'ai-ml': [AiScene, aiTimeline],
  'cloud-services': [CloudScene, cloudTimeline],
  devops: [DevopsScene, devopsTimeline],
  'requirement-engineering': [RequirementsScene, requirementsTimeline],
  'product-engineering': [ProductScene, productTimeline],
  fullstack: [WebScene, webTimeline],
  'wordpress-shopify': [StoreScene, storeTimeline],
  'meta-ads': [AdsScene, adsTimeline],
}

export default function ServiceVisual({ kind, className = '' }) {
  const ref = useRef(null)
  const entry = SCENES[kind]

  useGSAP(() => {
    if (!entry || !ref.current) return
    const q = gsap.utils.selector(ref.current)
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.6, defaults: { ease: 'power2.out' } })
    entry[1](tl, q)
    // Reduced motion: show the finished scene, still
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      tl.pause('hold')
      return
    }
    // Only animate while it's on screen
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? tl.resume() : tl.pause()))
    io.observe(ref.current)
    return () => io.disconnect()
  }, { scope: ref, dependencies: [kind] })

  if (!entry) return null
  const Scene = entry[0]
  return (
    <svg ref={ref} className={`sv ${className}`.trim()} viewBox="0 0 320 256" fill="none" aria-hidden="true">
      <Scene />
    </svg>
  )
}
