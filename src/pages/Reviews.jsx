import { Link } from 'react-router-dom'
import { ReviewCard } from '../components/ReviewHighlights'
import { REVIEWS } from '../data/reviews'
import { usePageMeta } from '../usePageMeta'

export default function Reviews() {
  usePageMeta('Client reviews', 'What business owners across Europe, the Middle East and Asia say about working with DaimoArc.')

  return (
    <section className="page-section page-top">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Client reviews</span>
          <h1 className="section-title page-title">What our clients say</h1>
          <p className="section-sub">Real feedback from business owners we've worked with across Europe, the Middle East and Asia</p>
        </div>

        <div className="reviews-grid">
          {REVIEWS.map((r) => <ReviewCard key={r.name} review={r} />)}
        </div>

        <div className="teaser-more">
          <Link to="/contact" className="btn-primary">Start a project</Link>
        </div>
      </div>
    </section>
  )
}
