// Shared layout for the privacy policy, cookie policy and terms of use.
export default function LegalPage({ title, updated, summary, children }) {
  return (
    <section className="page-section page-top">
      <div className="container">
        <article className="legal">
          <span className="section-tag">Legal</span>
          <h1 className="section-title page-title">{title}</h1>
          <p className="legal-updated">Last updated {updated}</p>

          {summary && (
            <div className="legal-summary">
              <strong>The short version</strong>
              <p>{summary}</p>
            </div>
          )}

          {children}

          <p className="legal-contact">
            Questions about this page? Email <a href="mailto:contact@daimoarc.com">contact@daimoarc.com</a>
          </p>
        </article>
      </div>
    </section>
  )
}
