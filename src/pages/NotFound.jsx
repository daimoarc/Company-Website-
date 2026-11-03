import { Link } from 'react-router-dom'
import { usePageMeta } from '../usePageMeta'

export default function NotFound() {
  usePageMeta('Page not found', 'This page does not exist on the DaimoArc website.')

  return (
    <section className="page-section page-top not-found">
      <div className="container">
        <span className="section-tag">404</span>
        <h1 className="section-title page-title">This page doesn’t exist</h1>
        <p className="section-sub">The link may be old, or the address may have a typo</p>
        <div className="not-found-actions">
          <Link to="/" className="btn-primary">Go to the home page</Link>
          <Link to="/services" className="btn-ghost">View services</Link>
        </div>
      </div>
    </section>
  )
}
