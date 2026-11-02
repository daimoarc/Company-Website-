import { useState } from 'react'
import { GOOGLE_SHEETS_ENDPOINT, CONTACT_EMAIL } from '../config'

const SERVICES = [
  'AI & Machine Learning',
  'Product Engineering / MVP',
  'Custom SaaS Platform',
  'POS & Retail System',
  'Web & Mobile Development',
  'WordPress, Shopify & TikTok Store',
  'Cloud Services',
  'DevOps, CI/CD, SecOps & NetOps',
  'Marketing & Meta Ads',
  'Requirement Engineering',
  'Not sure yet',
]

const BUDGETS = [
  'Under £1,000',
  '£1,000 – £5,000',
  '£5,000 – £15,000',
  '£15,000 – £50,000',
  '£50,000+',
  'Not sure yet',
]

const TIMELINES = [
  'ASAP',
  '2–4 weeks',
  '1–3 months',
  'Flexible',
]

const PREFERRED_CONTACTS = ['Email', 'Phone call']

const EMPTY_FORM = {
  name: '', email: '', phone: '', services: [], budget: '',
  timeline: '', preferredContact: 'Email', message: '', consent: false,
  website: '', // honeypot — real visitors never fill this in
}

const DUPLICATE_WINDOW_MS = 10 * 60 * 1000

export default function ProjectInquiryForm() {
  const [form, setForm] = useState(EMPTY_FORM)
  const [status, setStatus] = useState('idle') // idle | submitting | success | error | duplicate | unconfigured
  const [reference, setReference] = useState('')

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function toggleService(service) {
    setForm((f) => ({
      ...f,
      services: f.services.includes(service)
        ? f.services.filter((s) => s !== service)
        : [...f.services, service],
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!form.name || !form.email || form.services.length === 0 || !form.budget || !form.timeline || !form.message || !form.consent) {
      setStatus('error')
      return
    }
    if (form.website) {
      // Honeypot field was filled — silently treat as handled, don't tip off the bot.
      setStatus('success')
      return
    }
    if (!GOOGLE_SHEETS_ENDPOINT) {
      setStatus('unconfigured')
      return
    }

    const duplicateKey = `daimoarc-lead-${form.email.trim().toLowerCase()}-${form.message.trim()}`
    let previousSubmission = null
    try { previousSubmission = localStorage.getItem(duplicateKey) } catch { /* storage unavailable, ignore */ }
    if (previousSubmission && Date.now() - Number(previousSubmission) < DUPLICATE_WINDOW_MS) {
      setStatus('duplicate')
      return
    }

    const ref = `DM-${Date.now().toString(36).toUpperCase()}`
    setStatus('submitting')
    try {
      // Apps Script Web Apps send no CORS headers on POST, so a browser fetch
      // that tries to read the response gets blocked even on a successful write.
      // no-cors sends the request for real but makes the response opaque —
      // we can't confirm success, only that the request didn't fail to send.
      await fetch(GOOGLE_SHEETS_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ ...form, submissionId: ref, source: 'DaimoArc website' }),
      })

      try { localStorage.setItem(duplicateKey, String(Date.now())) } catch { /* ignore */ }
      setReference(ref)
      setStatus('success')
      setForm(EMPTY_FORM)
    } catch {
      setReference(ref)
      setStatus('error')
    }
  }

  const servicesList = form.services.join(', ')
  const mailtoFallback = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Project brief: ${servicesList || 'General enquiry'}`)}&body=${encodeURIComponent(
    `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone || 'Not provided'}\nServices: ${servicesList}\nBudget: ${form.budget}\nTimeline: ${form.timeline}\nPreferred contact: ${form.preferredContact}\n\nProject goals:\n${form.message}`
  )}`

  if (status === 'success') {
    return (
      <div className="intake-form-done">
        <div className="intake-form-done-icon">✓</div>
        <h3>Request sent{reference ? ` — Reference: ${reference}` : ''}</h3>
        <p>We'll review it and reply within one business day.</p>
      </div>
    )
  }

  return (
    <form className="intake-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <label className="form-field">
          <span>Full Name *</span>
          <input type="text" autoComplete="name" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Jane Doe" required />
        </label>
        <label className="form-field">
          <span>Email *</span>
          <input type="email" autoComplete="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="jane@company.com" required />
        </label>
        <label className="form-field">
          <span>Phone</span>
          <input type="tel" autoComplete="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="+44 7700 900000" />
        </label>
        <label className="form-field">
          <span>Preferred Contact</span>
          <select value={form.preferredContact} onChange={(e) => update('preferredContact', e.target.value)}>
            {PREFERRED_CONTACTS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
        <label className="form-field">
          <span>Budget Range *</span>
          <select value={form.budget} onChange={(e) => update('budget', e.target.value)} required>
            <option value="" disabled>Select a budget</option>
            {BUDGETS.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </label>
        <label className="form-field">
          <span>Desired Timeline *</span>
          <select value={form.timeline} onChange={(e) => update('timeline', e.target.value)} required>
            <option value="" disabled>Select a timeline</option>
            {TIMELINES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </label>
      </div>

      <div className="form-field form-field--full">
        <span>Services Needed * <em className="form-field-hint">(select all that apply)</em></span>
        <div className="service-checkbox-group">
          {SERVICES.map((s) => (
            <label key={s} className="service-checkbox">
              <input type="checkbox" checked={form.services.includes(s)} onChange={() => toggleService(s)} />
              <span>{s}</span>
            </label>
          ))}
        </div>
      </div>

      <label className="form-field form-field--full">
        <span>Project Goals *</span>
        <textarea rows={4} minLength={20} value={form.message} onChange={(e) => update('message', e.target.value)} placeholder="What are you trying to achieve? Include any important features, links, or constraints." required />
      </label>

      <label className="form-consent">
        <input type="checkbox" checked={form.consent} onChange={(e) => update('consent', e.target.checked)} required />
        <span>I agree to be contacted about this project.</span>
      </label>

      {/* Honeypot — hidden from real users via CSS, bots that auto-fill every field trip it */}
      <label className="form-trap" aria-hidden="true">
        Leave this field empty
        <input type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => update('website', e.target.value)} />
      </label>

      {status === 'error' && (
        <p className="form-status form-status--error">
          Unable to send your request.{' '}
          <a href={mailtoFallback} className="form-status-link">Email your brief directly instead</a>
        </p>
      )}
      {status === 'duplicate' && (
        <p className="form-status form-status--error">This brief was already sent recently. Email us if you need to change it.</p>
      )}
      {status === 'unconfigured' && (
        <p className="form-status form-status--error">This form isn't connected to a spreadsheet yet — see SHEETS_SETUP.md to finish setup.</p>
      )}

      <button type="submit" className="btn-primary" disabled={status === 'submitting'}>
        {status === 'submitting' ? 'Sending...' : 'Send Project Brief →'}
      </button>
    </form>
  )
}
