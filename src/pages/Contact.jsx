import ProjectInquiryForm from '../components/ProjectInquiryForm'
import { usePageMeta } from '../usePageMeta'

export default function Contact() {
  usePageMeta('Contact', 'Tell us about your project. We typically reply within a few hours, and every project starts with a free consultation.')

  return (
    <section className="page-section page-top">
      <div className="container contact-layout">
        <div className="contact-intro">
          <span className="section-tag">Contact</span>
          <h1 className="section-title page-title">Tell us about your project</h1>
          <p className="section-sub">
            Tell us what you need, your budget and your timeframe, and we'll get back to you within a few hours
          </p>

          <a href="mailto:contact@daimoarc.com" className="contact-card">
            <div className="contact-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <div className="contact-card-text">
              <span className="contact-card-label">Email us directly</span>
              <span className="contact-card-value">contact@daimoarc.com</span>
            </div>
            <div className="contact-card-arrow" aria-hidden="true">→</div>
          </a>

          <ul className="contact-points">
            <li>We typically reply within a few hours</li>
            <li>Free consultation for every project</li>
          </ul>
        </div>

        <div className="contact-form-col">
          <ProjectInquiryForm />
        </div>
      </div>
    </section>
  )
}
