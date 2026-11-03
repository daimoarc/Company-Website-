import { REVIEWS } from '../data/reviews'

export function ReviewCard({ review, lead = false }) {
  return (
    <figure className={`review-card${lead ? ' review-card--lead' : ''}`}>
      <div className="review-stars" aria-label="Rated 5 out of 5">★★★★★</div>
      <blockquote className="review-text">“{review.text}”</blockquote>
      <figcaption className="review-author">
        <div className="review-avatar" aria-hidden="true">{review.initials}</div>
        <div className="review-info">
          <strong>{review.name}</strong>
          <span>{review.meta}</span>
        </div>
        <div className="review-badge">{review.badge}</div>
      </figcaption>
    </figure>
  )
}

// Home: one lead review with two shorter ones beside it, so the sizes vary
export default function ReviewHighlights() {
  const lead = REVIEWS.find((r) => r.name === 'Sadia Faisal')
  const side = REVIEWS.filter((r) => r.name === 'Omar Mirza' || r.name === 'Hani Shakoor')
  return (
    <div className="reviews-feature">
      <ReviewCard review={lead} lead />
      <div className="reviews-side">
        {side.map((r) => <ReviewCard key={r.name} review={r} />)}
      </div>
    </div>
  )
}
