import { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const STEPS = [
  ['01', 'Discovery', 'Deep-dive into your goals, constraints and technical landscape to define a precise scope'],
  ['02', 'Architect', 'Design the solution blueprint: stack, infrastructure, integrations and data flows'],
  ['03', 'Build and test', 'Agile sprints with continuous integration, automated testing and transparent progress reports'],
  ['04', 'Deploy and operate', 'Zero-downtime deployments, monitoring, alerting and ongoing optimization after launch'],
]

const RUN = 1.6 // seconds for the packet to cross the trace

// Moment: the process drawn as one circuit trace. The first time it scrolls into view,
// a single packet runs along it and lights each step's pad as it passes. Then it rests.
export default function ProcessTimeline() {
  const ref = useRef(null)

  useGSAP(() => {
    const track = ref.current.querySelector('.pt-track')
    const mm = gsap.matchMedia()

    mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
      const packet = track.querySelector('.pt-packet')
      const steps = gsap.utils.toArray('.pt-step', track)
      const width = track.clientWidth + 64
      const tl = gsap.timeline({ paused: true, onComplete: () => track.classList.add('is-done') })
      tl.set(packet, { opacity: 1, x: 0 })
        .to(packet, { x: width, duration: RUN, ease: 'none' })
        .to(packet, { opacity: 0, duration: 0.2 }, RUN - 0.2)
      steps.forEach((step) => {
        tl.call(() => step.classList.add('is-active'), null, (step.offsetLeft / width) * RUN)
      })
      ScrollTrigger.create({ trigger: track, start: 'top 75%', once: true, onEnter: () => tl.play() })
      return () => {
        track.classList.remove('is-done')
        steps.forEach((s) => s.classList.remove('is-active'))
      }
    })
    // Phones and reduced motion: the trace is simply shown lit
    mm.add('(max-width: 899px), (prefers-reduced-motion: reduce)', () => {
      track.classList.add('is-done')
      return () => track.classList.remove('is-done')
    })
    return () => mm.revert()
  }, { scope: ref })

  return (
    <section className="pt" id="process" ref={ref}>
      <div className="container">
        <span className="section-tag">How we work</span>
        <h2 className="section-title">Our delivery process</h2>
        <p className="section-sub">A structured, agile process that keeps projects on time and on budget</p>

        <div className="pt-track">
          <span className="pt-line" aria-hidden="true"></span>
          <span className="pt-packet" aria-hidden="true"></span>
          <ol className="pt-steps">
            {STEPS.map(([num, title, desc]) => (
              <li className="pt-step" key={num}>
                <span className="pt-dot" aria-hidden="true"></span>
                <span className="pt-num">{num}</span>
                <h3 className="pt-title">{title}</h3>
                <p className="pt-desc">{desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
