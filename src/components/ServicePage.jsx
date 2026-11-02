import { Link } from 'react-router-dom'
import Reveal from './Reveal'

export default function ServicePage({ heroImage, title, subtitle, lead, whyItMatters, whyHeading = 'Why It Matters', children }) {
  return (
    <>
      <section className="svc-hero">
        <div className="svc-hero-bg" style={{ backgroundImage: `url('/images/${heroImage}')` }}></div>
        <div className="svc-hero-overlay"></div>
        <div className="svc-hero-content">
          <span className="section-tag">◆ Our Services</span>
          <h1 className="svc-hero-title">{title}</h1>
          <p className="svc-hero-sub">{subtitle}</p>
          <Link to="/contact" className="btn-primary">Book a Free Consultation</Link>
        </div>
      </section>

      <section id="services">
        <div className="article-wrap">
          <Reveal as="p" className="article-lead" style={{ textAlign: 'center' }}>{lead}</Reveal>

          <Reveal>{children}</Reveal>

          <Reveal as="h2" style={{ textAlign: 'center', borderTop: 'none' }}>{whyHeading}</Reveal>
          <Reveal className="pill-row">
            {whyItMatters.map((item) => (
              <span className="pill pill--check" key={item}>{item}</span>
            ))}
          </Reveal>

          <Reveal className="svc-detail-actions">
            <Link to="/contact" className="btn-primary">Start a Project</Link>
            <Link to="/services" className="btn-outline">Back to All Services</Link>
          </Reveal>
        </div>
      </section>
    </>
  )
}
