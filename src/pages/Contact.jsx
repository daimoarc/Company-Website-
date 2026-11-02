import Reveal from '../components/Reveal'
import ProjectInquiryForm from '../components/ProjectInquiryForm'

export default function Contact() {
  return (
    <section id="cta" style={{ paddingTop: 150 }}>
      <div className="cta-box cta-box--wide glass-panel">
        <span className="section-tag">◆ Let's Build Together</span>
        <Reveal as="h2" className="cta-title">Ready to Transform<br />Your Business?</Reveal>
        <Reveal as="p" className="cta-sub" delay={0.1}>
          Tell us what you need — service, budget, timeframe — and we'll get back to you within a few hours.
        </Reveal>

        <Reveal delay={0.15}>
          <ProjectInquiryForm />
        </Reveal>

        <div className="intake-form-divider"><span>or reach out directly</span></div>

        <Reveal className="contact-cards contact-cards--single" delay={0.2}>
          <a href="mailto:contact@daimoarc.com" className="contact-card contact-card--email">
            <div className="contact-card-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="28" height="28" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <div className="contact-card-text">
              <span className="contact-card-label">Email Us</span>
              <span className="contact-card-value">contact@daimoarc.com</span>
            </div>
            <div className="contact-card-arrow">→</div>
          </a>
        </Reveal>

        <Reveal as="p" style={{ color: 'var(--muted)', fontSize: '.85rem', marginTop: 24 }} delay={0.3}>
          We typically respond within a few hours
        </Reveal>
      </div>
    </section>
  )
}
