import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'

const SERVICES = [
  ['/requirement-engineering', 'requirement-engineering.png', 'Requirement Engineering', 'Requirement Engineering — structured requirements gathering, stakeholder analysis, and technical specifications.'],
  ['/product-engineering', 'product-engineering.png', 'Product Engineering', 'Product Engineering — end-to-end product builds from MVP to scalable, production-grade systems.'],
  ['/ai-ml', 'ai-ml.png', 'AI and Machine Learning', 'AI and Machine Learning — custom AI systems, LLM integrations, and predictive analytics.'],
  ['/fullstack', 'fullstack.png', 'Web and Mobile Development', 'Web and Mobile Development — custom apps built to your requirements.'],
  ['/wordpress-shopify', 'wordpress-shopify.png', 'WordPress, Shopify & TikTok Store', 'WordPress, Shopify and TikTok Store — custom sites, store builds, and TikTok Shop integration.'],
  ['/cloud-services', 'cloud-services.png', 'Cloud Services', 'Cloud Services — migration, multi-cloud architecture, and managed infrastructure.'],
  ['/devops', 'devops.png', 'DevOps, CI/CD, SecOps & NetOps', 'DevOps, CI/CD, SecOps and NetOps — automated pipelines and security-first architecture.'],
  ['/meta-ads', 'meta-ads.png', 'Marketing & Meta Ads', 'Marketing and Meta Ads — ad strategy, creative direction, and performance analytics.'],
]

export default function Services() {
  return (
    <section id="services" style={{ paddingTop: 150 }}>
      <Reveal className="section-header">
        <span className="section-tag">◆ What We Do</span>
        <h2 className="section-title">Our <span>Core Services</span></h2>
        <p className="section-sub">A full spectrum of modern technology services, deeply integrated for seamless delivery.</p>
      </Reveal>

      <div className="services-grid">
        {SERVICES.map(([to, img, name, label], i) => (
          <Reveal as={Link} key={to} to={to} className="svc-tile" delay={i * 0.06}
            style={{ backgroundImage: `url('/images/${img}')` }} aria-label={label}>
            <span className="svc-tile-cta">Learn More →</span>
            <span className="svc-tile-scrim"></span>
            <span className="svc-tile-title">{name}</span>
          </Reveal>
        ))}
      </div>

      <Reveal className="teaser-more">
        <Link to="/contact" className="btn-primary">Start a Project</Link>
      </Reveal>
    </section>
  )
}
