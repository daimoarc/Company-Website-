import { Link } from 'react-router-dom'
import Hero from '../components/Hero'
import ServiceList from '../components/ServiceList'
import ProcessTimeline from '../components/ProcessTimeline'
import ReviewHighlights from '../components/ReviewHighlights'
import { usePageMeta } from '../usePageMeta'

const FEATURES = [
  ['Built for business owners', 'We translate your goals into technology that drives real results, without the technical headaches'],
  ['AI-native architecture', 'Every solution is designed around AI from the start, not bolted on afterwards'],
  ['Ops-driven delivery', 'DevOps, SecOps, MLOps and NetOps built in from day one'],
  ['End-to-end ownership', 'From ideation to production to monitoring, we own the whole lifecycle'],
]

const FIGURES = [
  ['20+', 'Projects delivered'],
  ['8', 'Core disciplines'],
  ['24/7', 'Support coverage'],
]

export default function Home() {
  usePageMeta() // site default title and description

  return (
    <>
      <Hero />

      <section className="services" id="services">
        <div className="container">
          <div className="services-head">
            <div>
              <span className="section-tag">Services</span>
              <h2 className="section-title">Eight disciplines, one accountable team</h2>
              <p className="section-sub">From the first requirement to the last deployment: AI, product, web, cloud, DevOps and marketing</p>
            </div>
            <Link to="/services" className="btn-ghost">View all services</Link>
          </div>
          <ServiceList />
        </div>
      </section>

      <section className="why" id="about">
        <div className="container">
          <span className="section-tag">Why DaimoArc</span>
          <p className="why-statement">
            We work directly with business owners and own the whole lifecycle, <span>from the first idea to production and monitoring</span>
          </p>

          <ul className="features-list">
            {FEATURES.map(([title, desc]) => (
              <li className="feature-item" key={title}>
                <div className="feature-text">
                  <strong>{title}</strong>
                  <p>{desc}</p>
                </div>
              </li>
            ))}
          </ul>

          <div className="figures">
            {FIGURES.map(([num, label]) => (
              <div className="figure" key={label}>
                <div className="figure-num">{num}</div>
                <div className="figure-label">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ProcessTimeline />

      <section className="reviews-section" id="reviews">
        <div className="container">
          <div className="reviews-head">
            <div>
              <span className="section-tag">Client reviews</span>
              <h2 className="section-title">What our clients say</h2>
              <p className="section-sub">Business owners we've worked with across Europe, the Middle East and Asia</p>
            </div>
            <Link to="/reviews" className="btn-ghost">Read all reviews</Link>
          </div>
          <ReviewHighlights />
        </div>
      </section>

      <section className="cta">
        <div className="container cta-inner">
          <div>
            <span className="section-tag">Contact</span>
            <h2 className="cta-title">Tell us what you need</h2>
            <p className="cta-sub">A website, a Shopify store or a full AI system. We reply within a few hours.</p>
          </div>
          <div className="cta-actions">
            <Link to="/contact" className="btn-primary">Start a project</Link>
            <Link to="/services" className="btn-ghost">View services</Link>
          </div>
        </div>
      </section>
    </>
  )
}
