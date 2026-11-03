import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ServiceVisual from './ServiceVisual'
import { SERVICES } from '../data/services'
import { usePageMeta } from '../usePageMeta'

const ease = [0.22, 1, 0.36, 1]

export default function ServicePage({ heroImage, title, subtitle, lead, whyItMatters, whyHeading = 'Why it matters', children }) {
  const kind = heroImage.replace('-hero.png', '')
  const service = SERVICES.find((s) => s.to === `/${kind}`)
  usePageMeta(service?.title, service?.short)

  return (
    <>
      <section className="svc-hero">
        <div className="svc-hero-bg" style={{ backgroundImage: `url('${import.meta.env.BASE_URL}images/${heroImage.replace(/\.png$/, '.webp')}')` }}></div>
        <div className="svc-hero-overlay"></div>
        <div className="svc-hero-inner">
          <motion.div
            className="svc-hero-content"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease }}
          >
            <span className="section-tag">Services</span>
            <h1 className="svc-hero-title">{title}</h1>
            <p className="svc-hero-sub">{subtitle}</p>
            <Link to="/contact" className="btn-primary">Book a free consultation</Link>
          </motion.div>
          <div className="svc-hero-visual">
            <ServiceVisual kind={kind} />
          </div>
        </div>
      </section>

      <section className="svc-body">
        <div className="article-wrap">
          <p className="article-lead">{lead}</p>

          {children}

          <h2 className="why-heading">{whyHeading}</h2>
          <div className="pill-row">
            {whyItMatters.map((item) => (
              <span className="pill pill--check" key={item}>{item}</span>
            ))}
          </div>

          <div className="svc-detail-actions">
            <Link to="/contact" className="btn-primary">Start a project</Link>
            <Link to="/services" className="btn-ghost">Back to all services</Link>
          </div>
        </div>
      </section>
    </>
  )
}
