import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import TiltCard from '../components/TiltCard'
import Icon from '../components/Icon'

const FEATURES = [
  ['Built for Business Owners', 'We specialize in working directly with business owners — translating your goals into technology that drives real results, without the technical headaches.'],
  ['AI-Native Architecture', 'Every solution we design is built to leverage AI — not as an afterthought, but at its core.'],
  ['Ops-Driven Delivery', 'DevOps, SecOps, MLOps, and NetOps baked in from day one — not bolted on at the end.'],
  ['End-to-End Ownership', "From ideation to production to monitoring — we own the entire lifecycle so you don't have to."],
]

export default function About() {
  return (
    <section id="about" style={{ paddingTop: 150 }}>
      <div className="about-inner">
        <div>
          <Reveal as="span" className="section-tag">◆ Why DaimoArc</Reveal>
          <Reveal as="h2" className="section-title" delay={0.1}>Where <span>Precision</span><br />Meets Performance</Reveal>
          <Reveal as="p" className="section-sub" delay={0.2}>
            We don't just build software — we architect digital ecosystems built specifically for business owners. Whether you're a startup, SME, or growing enterprise, our specialists operate across the entire technology stack to deliver cohesive solutions that grow with your business.
          </Reveal>

          <ul className="features-list">
            {FEATURES.map(([title, desc], i) => (
              <Reveal as="li" key={title} delay={0.3 + i * 0.1}>
                <TiltCard as="div" className="feature-item">
                  <div className="feature-check">✓</div>
                  <div className="feature-text"><strong>{title}</strong><p>{desc}</p></div>
                </TiltCard>
              </Reveal>
            ))}
          </ul>

          <div style={{ marginTop: 32 }}>
            <Link to="/contact" className="btn-outline">Start a Project</Link>
          </div>
        </div>

        <Reveal className="about-visual" delay={0.2}>
          <div className="orbit-field" aria-hidden="true">
            <div className="orbit-glow"></div>
            <div className="orbit-ping"></div>
            <div className="orbit-ping orbit-ping--delay"></div>

            <div className="orbit-ring orbit-ring--outer">
              <div className="orbit-node" style={{ '--angle': '20deg' }}><span className="orbit-node-icon"><Icon name="robot" size={20} /></span></div>
              <div className="orbit-node" style={{ '--angle': '160deg' }}><span className="orbit-node-icon"><Icon name="cloud" size={20} /></span></div>
              <div className="orbit-node" style={{ '--angle': '280deg' }}><span className="orbit-node-icon"><Icon name="gear" size={20} /></span></div>
            </div>
            <div className="orbit-ring orbit-ring--inner">
              <div className="orbit-node" style={{ '--angle': '80deg' }}><span className="orbit-node-icon"><Icon name="bolt" size={16} /></span></div>
              <div className="orbit-node" style={{ '--angle': '250deg' }}><span className="orbit-node-icon"><Icon name="megaphone" size={16} /></span></div>
            </div>

            <div className="orbit-core">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="46" height="46">
                <path d="M12 2 L12 6" /><path d="M12 18 L12 22" /><path d="M2 12 L6 12" /><path d="M18 12 L22 12" />
                <circle cx="12" cy="12" r="5" />
                <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
              </svg>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
