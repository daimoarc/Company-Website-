import { Link } from 'react-router-dom'
import { usePageMeta } from '../usePageMeta'

const FEATURES = [
  ['Built for business owners', 'We work directly with business owners, translating your goals into technology that drives real results, without the technical headaches'],
  ['AI-native architecture', 'Every solution we design is built to use AI at its core, not as an afterthought'],
  ['Ops-driven delivery', 'DevOps, SecOps, MLOps and NetOps are built in from day one, not bolted on at the end'],
  ['End-to-end ownership', "From ideation to production to monitoring, we own the entire lifecycle so you don't have to"],
]

export default function About() {
  usePageMeta('About', 'One team across the whole stack, accountable from the first requirement to the last deployment.')

  return (
    <section className="page-section page-top">
      <div className="container">
        <div className="about-hero">
          <span className="section-tag">About</span>
          <h1 className="section-title page-title">One team across the whole stack</h1>
          <p className="section-sub">
            Whether you're a startup, an SME or a growing enterprise, our specialists work across the entire technology stack to deliver solutions that grow with your business
          </p>
        </div>

        <p className="why-statement">
          We don't just build software. We build and run the systems behind your business, <span>accountable from the first requirement to the last deployment</span>
        </p>

        <ul className="features-list features-list--grid">
          {FEATURES.map(([title, desc]) => (
            <li className="feature-item" key={title}>
              <div className="feature-text">
                <strong>{title}</strong>
                <p>{desc}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="teaser-more">
          <Link to="/contact" className="btn-primary">Start a project</Link>
        </div>
      </div>
    </section>
  )
}
