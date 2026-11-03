import { Link } from 'react-router-dom'
import ServiceList from '../components/ServiceList'
import { usePageMeta } from '../usePageMeta'

export default function Services() {
  usePageMeta('Services', 'Eight services from one accountable team: requirement engineering, product engineering, AI, web and mobile, e-commerce, cloud, DevOps and marketing.')

  return (
    <section className="page-section page-top">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Services</span>
          <h1 className="section-title page-title">Our core services</h1>
          <p className="section-sub">Everything from requirements to deployment, delivered by one accountable team</p>
        </div>

        <ServiceList />

        <div className="teaser-more">
          <Link to="/contact" className="btn-primary">Start a project</Link>
        </div>
      </div>
    </section>
  )
}
