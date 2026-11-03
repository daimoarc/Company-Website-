import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { GOOGLE_SHEETS_ENDPOINT, CONTACT_EMAIL } from '../config'

// [saved value, label shown]. The saved value goes to the sheet and Code.gs refuses anything else,
// so it must never change. The label is only what visitors see, in the site's sentence case
const SERVICES = [
  ['AI & Machine Learning', 'AI and machine learning'],
  ['Product Engineering / MVP', 'Product engineering or MVP'],
  ['Custom SaaS Platform', 'Custom SaaS platform'],
  ['POS & Retail System', 'POS and retail system'],
  ['Web & Mobile Development', 'Web and mobile development'],
  ['WordPress, Shopify & TikTok Store', 'WordPress, Shopify and TikTok store'],
  ['Cloud Services', 'Cloud services'],
  ['DevOps, CI/CD, SecOps & NetOps', 'DevOps, CI/CD, SecOps and NetOps'],
  ['Marketing & Meta Ads', 'Marketing and Meta ads'],
  ['Requirement Engineering', 'Requirement engineering'],
  ['Not sure yet', 'Not sure yet'],
]

// These exact strings are saved to the sheet and checked by Code.gs. Change them in both places or not at all
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

// Throwaway inbox providers, also listed in Code.gs
const DISPOSABLE_DOMAINS = [
  'mailinator.com', 'guerrillamail.com', 'guerrillamail.net', 'sharklasers.com', 'grr.la', '10minutemail.com',
  'tempmail.com', 'temp-mail.org', 'tempmail.dev', 'yopmail.com', 'trashmail.com', 'getnada.com',
  'dispostable.com', 'maildrop.cc', 'throwawaymail.com', 'fakeinbox.com', 'mintemail.com', 'emailondeck.com',
  'mohmal.com', 'burnermail.io', 'moakt.com', 'tempinbox.com', 'mailnesia.com', 'spamgourmet.com',
]

// Common misspellings of the big email providers. A mistyped address is a lead we can never reply to
const DOMAIN_TYPOS = {
  'gmial.com': 'gmail.com', 'gmai.com': 'gmail.com', 'gamil.com': 'gmail.com', 'gnail.com': 'gmail.com',
  'gmaill.com': 'gmail.com', 'gmail.co': 'gmail.com', 'gmail.con': 'gmail.com',
  'hotmial.com': 'hotmail.com', 'hotmal.com': 'hotmail.com', 'hotmail.con': 'hotmail.com',
  'outlok.com': 'outlook.com', 'outloo.com': 'outlook.com', 'outlook.con': 'outlook.com',
  'yaho.com': 'yahoo.com', 'yahooo.com': 'yahoo.com', 'yahoo.con': 'yahoo.com',
  'iclod.com': 'icloud.com', 'icloud.con': 'icloud.com',
}

// Easy clicks first and personal details last: someone who has started a brief is more likely to finish it.
// Each step checks only its own fields before moving on
const STEPS = [
  { label: 'Project', title: 'What do you need?', fields: ['services', 'budget', 'timeline'] },
  { label: 'Goals', title: 'What should it achieve?', fields: ['message'] },
  { label: 'Details', title: 'Where should we reply?', fields: ['name', 'email', 'phone', 'consent'] },
]
const FIELD_ORDER = STEPS.flatMap((s) => s.fields)

const MAX = { name: 80, email: 254, phone: 20, message: 3000 }
const MAX_LINKS = 3
const MIN_FILL_MS = 3200 // Code.gs refuses briefs sent within 3 seconds of the form being opened
const TOKEN_REFRESH_MS = 90 * 60 * 1000 // Code.gs accepts a token for 2 hours
const DUPLICATE_WINDOW_MS = 10 * 60 * 1000

const EMPTY_FORM = {
  name: '', email: '', phone: '', services: [], budget: '',
  timeline: '', preferredContact: 'Email', message: '', consent: false,
  website: '', // honeypot — real visitors never fill this in
}

// Duplicate-send guard (see the cookie policy): stores a scrambled fingerprint of email + message,
// never the details themselves, in sessionStorage so it's gone when the tab closes.
function fingerprint(text) {
  let hash = 0x811c9dc5
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  return (hash >>> 0).toString(36)
}

// Unfinished briefs are kept in this browser tab's session storage, so a refresh or a look at another page
// doesn't lose them (see the cookie policy). They never leave the device until the brief is sent, and the
// browser deletes them when the tab is closed
const DRAFT_KEY = 'daimoarc-brief-draft'
const hasAnswers = (f) => Boolean(f.services.length || f.budget || f.timeline || f.message.trim() || f.name.trim() || f.email.trim() || f.phone.trim())

function loadDraft() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(DRAFT_KEY) || 'null')
    const f = saved?.form
    if (!f || typeof f !== 'object') return null
    const text = (v, max) => (typeof v === 'string' ? v.slice(0, max) : '')
    const form = {
      ...EMPTY_FORM,
      name: text(f.name, MAX.name),
      email: text(f.email, MAX.email),
      phone: text(f.phone, MAX.phone),
      message: text(f.message, MAX.message),
      services: Array.isArray(f.services) ? f.services.filter((s) => SERVICES.some(([v]) => v === s)) : [],
      budget: BUDGETS.includes(f.budget) ? f.budget : '',
      timeline: TIMELINES.includes(f.timeline) ? f.timeline : '',
      preferredContact: PREFERRED_CONTACTS.includes(f.preferredContact) ? f.preferredContact : 'Email',
      consent: f.consent === true,
    }
    if (!hasAnswers(form)) return null
    const step = Number.isInteger(saved.step) ? Math.min(Math.max(saved.step, 0), STEPS.length - 1) : 0
    return { form, step }
  } catch {
    return null
  }
}

const countLetters = (text) => (text.match(/\p{L}/gu) || []).length
const EMAIL_PATTERN = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+([a-z]{2,24}|xn--[a-z0-9-]{1,59})$/i
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// The phone library checks numbers against each country's numbering rules. It only downloads when
// someone clicks into the phone field, so visitors who skip that optional field never load it
let phoneLibrary
function loadPhoneLibrary() {
  phoneLibrary ??= import('libphonenumber-js/min').catch((err) => { phoneLibrary = undefined; throw err })
  return phoneLibrary
}

// Obvious fakes: seven or more of the same digit in a row, or eight or more digits counting up or down.
// Code.gs runs the same check
function looksFake(digits) {
  if (/(\d)\1{6,}/.test(digits)) return true
  let up = 1
  let down = 1
  for (let i = 1; i < digits.length; i++) {
    const step = (digits.charCodeAt(i) - digits.charCodeAt(i - 1) + 10) % 10
    up = step === 1 ? up + 1 : 1
    down = step === 9 ? down + 1 : 1
    if (up >= 8 || down >= 8) return true
  }
  return false
}

// Returns the number in international format (+447700900123), which is how the sheet stores it
async function checkPhone(raw, required) {
  const value = raw.trim()
  if (!value) return { error: required ? 'Add a phone number so we can call you' : '', e164: '' }
  if (!value.startsWith('+')) return { error: 'Start with your country code, like +44 7700 900000', e164: '' }
  if (!/^\+[\d\s().-]+$/.test(value)) return { error: 'Use digits only after the country code', e164: '' }
  let e164 = `+${value.replace(/\D/g, '')}`
  let valid = /^\+[1-9]\d{6,14}$/.test(e164)
  try {
    const { parsePhoneNumberFromString } = await loadPhoneLibrary()
    const parsed = parsePhoneNumberFromString(value)
    valid = Boolean(parsed && parsed.isValid())
    if (valid) e164 = parsed.number
  } catch {
    // The library didn't load (for example offline). The length check above stands and Code.gs checks again
  }
  if (!valid || looksFake(e164.slice(1))) return { error: 'This number doesn’t look right. Check it and include your country code', e164: '' }
  return { error: '', e164 }
}

function emailProblem(raw) {
  const email = raw.trim()
  if (!email) return 'Enter your email address'
  if (email.length > MAX.email || !EMAIL_PATTERN.test(email) || email.split('@')[0].length > 64) return 'Enter a valid email address, like jane@company.com'
  const domain = email.split('@')[1].toLowerCase()
  if (DISPOSABLE_DOMAINS.some((d) => domain === d || domain.endsWith(`.${d}`))) return 'Use your work or personal email, not a temporary inbox'
  return ''
}

function emailSuggestion(raw) {
  const email = raw.trim()
  const at = email.lastIndexOf('@')
  if (at < 1) return ''
  const fix = DOMAIN_TYPOS[email.slice(at + 1).toLowerCase()]
  return fix ? `${email.slice(0, at)}@${fix}` : ''
}

// Mirrors the checks in Code.gs, so real visitors see a clear message instead of a refusal
async function validate(form) {
  const errors = {}
  const name = form.name.trim()
  if (name.length < 2 || countLetters(name) < 2) errors.name = 'Enter your full name'
  else if (name.length > MAX.name || /https?:|www\.|[<>@]/i.test(name)) errors.name = 'Use only your name here'

  const emailError = emailProblem(form.email)
  if (emailError) errors.email = emailError

  const phone = await checkPhone(form.phone, form.preferredContact === 'Phone call')
  if (phone.error) errors.phone = phone.error

  if (form.services.length === 0) errors.services = 'Choose at least one service'
  if (!form.budget) errors.budget = 'Choose a budget range'
  if (!form.timeline) errors.timeline = 'Choose a timeline'

  const message = form.message.trim()
  if (message.length < 20 || countLetters(message) < 10) errors.message = 'Tell us a little more, at least 20 characters'
  else if (message.length > MAX.message) errors.message = `Keep it under ${MAX.message.toLocaleString('en-GB')} characters`
  else if ((message.match(/https?:\/\/|www\./gi) || []).length > MAX_LINKS) errors.message = `Include ${MAX_LINKS} links at most`

  if (!form.consent) errors.consent = 'Tick this box so we can reply to you'
  return { errors, phone: phone.e164 }
}

export default function ProjectInquiryForm() {
  const [draft] = useState(loadDraft)
  const [form, setForm] = useState(() => draft?.form ?? EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | submitting | success | error | rejected | limited | duplicate | unconfigured
  const [reference, setReference] = useState('')
  const [step, setStep] = useState(() => draft?.step ?? 0)
  const [restored, setRestored] = useState(Boolean(draft))
  const [emailFix, setEmailFix] = useState('')
  const formRef = useRef(null)
  const titleRef = useRef(null)
  const moved = useRef(false)
  const busy = useRef(false)
  const tracked = useRef(new Set())
  const token = useRef({ value: '', at: 0, requested: false, pending: null })

  // After a step change, focus lands on the new step's title, so keyboard and screen reader users start at its top
  useEffect(() => {
    if (moved.current) titleRef.current?.focus()
  }, [step])

  // Keep the unfinished brief for this tab, or clear it once there's nothing worth keeping
  useEffect(() => {
    if (status === 'success') return
    try {
      if (hasAnswers(form)) sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ form: { ...form, website: '' }, step }))
      else sessionStorage.removeItem(DRAFT_KEY)
    } catch { /* storage unavailable: the form still works, it just can't keep a draft */ }
  }, [form, step, status])

  function goTo(next) {
    moved.current = true
    setErrors({})
    setRestored(false)
    setStep(next)
  }

  function startOver() {
    try { sessionStorage.removeItem(DRAFT_KEY) } catch { /* ignore */ }
    setForm(EMPTY_FORM)
    setEmailFix('')
    goTo(0)
  }

  // Anonymous daily totals (see the privacy policy): the request names the step and nothing about the visitor.
  // Each step is counted once per visit
  function track(name) {
    if (!GOOGLE_SHEETS_ENDPOINT || tracked.current.has(name)) return
    tracked.current.add(name)
    fetch(`${GOOGLE_SHEETS_ENDPOINT}?action=event&name=${name}`, { keepalive: true }).catch(() => {})
  }

  function clearError(field) {
    setErrors((current) => {
      if (!current[field]) return current
      const next = { ...current }
      delete next[field]
      return next
    })
  }

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
    clearError(field)
    if (field === 'preferredContact') clearError('phone')
    if (field === 'email') setEmailFix('')
  }

  function toggleService(service) {
    setForm((f) => ({
      ...f,
      services: f.services.includes(service)
        ? f.services.filter((s) => s !== service)
        : [...f.services, service],
    }))
    clearError('services')
  }

  const focusField = (field) => formRef.current?.querySelector(`[data-field="${field}"]`)?.focus()

  // Checks a field as the visitor moves on, without nagging about fields they haven't filled in yet
  async function checkOnBlur(field) {
    if (!String(form[field]).trim() && !errors[field]) return
    const { errors: found } = await validate(form)
    setErrors((current) => {
      const next = { ...current }
      if (found[field]) next[field] = found[field]
      else delete next[field]
      return next
    })
    if (field === 'email') setEmailFix(found.email ? '' : emailSuggestion(form.email))
    if (field === 'phone' && !found.phone) {
      try {
        const { parsePhoneNumberFromString } = await loadPhoneLibrary()
        const parsed = parsePhoneNumberFromString(form.phone.trim())
        if (parsed?.isValid()) setForm((f) => ({ ...f, phone: parsed.formatInternational() }))
      } catch { /* keep the number as typed */ }
    }
  }

  // The anti-spam token is requested when someone first uses the form, never on page load,
  // so people who only browse the site never contact Google
  function fetchToken() {
    const t = token.current
    if (!GOOGLE_SHEETS_ENDPOINT) return Promise.resolve()
    t.pending ??= fetch(`${GOOGLE_SHEETS_ENDPOINT}?action=token`)
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.token === 'string') {
          t.value = data.token
          t.at = Date.now()
        }
      })
      .catch(() => { /* retried when the brief is sent */ })
      .finally(() => { t.pending = null })
    return t.pending
  }

  function prepare() {
    if (!token.current.requested) {
      token.current.requested = true
      fetchToken()
    }
  }

  async function send(phone) {
    const t = token.current
    if (!t.value || Date.now() - t.at > TOKEN_REFRESH_MS) {
      t.value = ''
      await fetchToken()
    }
    const age = Date.now() - t.at
    if (t.value && age < MIN_FILL_MS) await sleep(MIN_FILL_MS - age)
    const res = await fetch(GOOGLE_SHEETS_ENDPOINT, {
      method: 'POST',
      // text/plain keeps this a "simple" request with no CORS preflight, which Apps Script can't answer.
      // Apps Script does allow the reply to be read, so the form can show what really happened
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        name: form.name.trim(),
        email: form.email.trim(),
        phone,
        services: form.services,
        budget: form.budget,
        timeline: form.timeline,
        preferredContact: form.preferredContact,
        message: form.message.trim(),
        consent: form.consent,
        website: form.website,
        token: t.value,
      }),
    })
    return res.json()
  }

  async function submitBrief(phone) {
    if (form.website) {
      // Honeypot field was filled — treat it as handled without sending, so the bot learns nothing
      setStatus('success')
      return
    }
    if (!GOOGLE_SHEETS_ENDPOINT) {
      setStatus('unconfigured')
      return
    }

    const duplicateKey = `daimoarc-lead-${fingerprint(`${form.email.trim().toLowerCase()}|${form.message.trim()}`)}`
    let previousSubmission = null
    try { previousSubmission = sessionStorage.getItem(duplicateKey) } catch { /* storage unavailable, ignore */ }
    if (previousSubmission && Date.now() - Number(previousSubmission) < DUPLICATE_WINDOW_MS) {
      setStatus('duplicate')
      return
    }

    setStatus('submitting')
    try {
      let result = await send(phone)
      if (result.status === 'expired') {
        // The tab was left open for hours: get a fresh token and try once more
        token.current.value = ''
        result = await send(phone)
      }
      if (result.status === 'ok') {
        try {
          sessionStorage.setItem(duplicateKey, String(Date.now()))
          sessionStorage.removeItem(DRAFT_KEY)
        } catch { /* ignore */ }
        setReference(result.reference || '')
        setForm(EMPTY_FORM)
        setStatus('success')
      } else if (result.status === 'duplicate') setStatus('duplicate')
      else if (result.status === 'limited') setStatus('limited')
      else if (result.status === 'invalid') setStatus('rejected')
      else setStatus('error')
    } catch {
      setStatus('error')
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (busy.current || status === 'submitting') return
    busy.current = true
    try {
      const { errors: found, phone } = await validate(form)
      const fields = STEPS[step].fields
      const lastStep = step === STEPS.length - 1

      if (!lastStep) {
        const stepErrors = Object.fromEntries(fields.filter((f) => found[f]).map((f) => [f, found[f]]))
        setErrors(stepErrors)
        const first = fields.find((f) => stepErrors[f])
        if (first) {
          focusField(first)
        } else {
          track(step === 0 ? 'step1' : 'step2')
          goTo(step + 1)
        }
        return
      }

      const firstProblem = FIELD_ORDER.find((field) => found[field])
      if (firstProblem) {
        const owner = STEPS.findIndex((s) => s.fields.includes(firstProblem))
        const ownerErrors = Object.fromEntries(STEPS[owner].fields.filter((f) => found[f]).map((f) => [f, found[f]]))
        if (owner !== step) {
          moved.current = true
          setStep(owner)
        } else {
          focusField(firstProblem)
        }
        setErrors(ownerErrors)
        return
      }
      setErrors({})
      await submitBrief(phone)
    } finally {
      busy.current = false
    }
  }

  const servicesList = form.services.join(', ')
  const mailtoFallback = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Project brief: ${servicesList || 'General enquiry'}`)}&body=${encodeURIComponent(
    `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone || 'Not provided'}\nServices: ${servicesList}\nBudget: ${form.budget}\nTimeline: ${form.timeline}\nPreferred contact: ${form.preferredContact}\n\nProject goals:\n${form.message}`
  )}`

  const describe = (field) => ({
    'data-field': field,
    'aria-invalid': errors[field] ? true : undefined,
    'aria-describedby': errors[field] ? `${field}-error` : undefined,
  })
  const errorText = (field) => errors[field]
    ? <span className="form-error" id={`${field}-error`}>{errors[field]}</span>
    : null
  const hasErrors = Object.keys(errors).length > 0
  const phoneNeeded = form.preferredContact === 'Phone call'
  const lastStep = step === STEPS.length - 1

  // One chip style for every choice: checkboxes for services, radios for budget and timeline
  const choices = ({ field, label, meta, type, options, isChecked, onPick, list }) => (
    <div className="form-field">
      <span className="form-label" id={`${field}-label`}>
        {label}
        {meta && <span className="form-label-meta">{meta}</span>}
      </span>
      <div
        className={list ? 'choice-group choice-group--list' : 'choice-group'}
        role={type === 'radio' ? 'radiogroup' : 'group'}
        aria-labelledby={`${field}-label`}
        aria-invalid={errors[field] ? true : undefined}
        aria-describedby={errors[field] ? `${field}-error` : undefined}
      >
        {options.map(([value, text], i) => (
          <label key={value} className={type === 'radio' ? 'choice choice--radio' : 'choice'}>
            <input type={type} name={field} value={value} checked={isChecked(value)} onChange={() => onPick(value)} data-field={i === 0 ? field : undefined} />
            <span>{text}</span>
          </label>
        ))}
      </div>
      {errorText(field)}
    </div>
  )

  // A strong ending: what happens next, taken from the real process, and one useful place to go meanwhile
  if (status === 'success') {
    return (
      <div className="intake-form-done" role="status">
        <div className="intake-form-done-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        </div>
        <h2>Brief received</h2>
        {reference && <span className="intake-form-done-ref">Reference {reference}</span>}
        <p className="intake-next-title">What happens next</p>
        <ul className="intake-next">
          <li>We read your brief and reply within a few hours</li>
          <li>A free consultation to agree the scope</li>
          <li>We design the blueprint: stack, integrations and data flows</li>
        </ul>
        <Link to="/reviews" className="intake-form-done-link">
          While you wait, read what clients say <span aria-hidden="true">→</span>
        </Link>
      </div>
    )
  }

  return (
    <form className="intake-form" ref={formRef} onSubmit={handleSubmit} onFocus={prepare} noValidate>
      {restored && (
        <p className="form-restored">
          We kept your unfinished brief
          <button type="button" className="form-restored-reset" onClick={startOver}>Start over</button>
        </p>
      )}
      <ol className="form-steps" aria-label="Progress">
        {STEPS.map((s, i) => (
          <li key={s.label} className={i < step ? 'is-done' : undefined} aria-current={i === step ? 'step' : undefined}>
            {s.label}
          </li>
        ))}
      </ol>

      <div className="form-step" key={step}>
        <div className="form-step-head">
          <h2 className="form-step-title" ref={titleRef} tabIndex={-1}>{STEPS[step].title}</h2>
          <p className="form-step-meta">
            Step {step + 1} of {STEPS.length}{step === 0 ? ' · About 2 minutes' : lastStep ? ' · Last step' : ''}
          </p>
        </div>

        {step === 0 && (
          <>
            {choices({
              field: 'services', label: 'Services', meta: 'Choose all that apply', type: 'checkbox', list: true,
              options: SERVICES, isChecked: (v) => form.services.includes(v), onPick: toggleService,
            })}
            {choices({
              field: 'budget', label: 'Budget', type: 'radio',
              options: BUDGETS.map((b) => [b, b]), isChecked: (v) => form.budget === v, onPick: (v) => update('budget', v),
            })}
            {choices({
              field: 'timeline', label: 'Timeline', type: 'radio',
              options: TIMELINES.map((t) => [t, t]), isChecked: (v) => form.timeline === v, onPick: (v) => update('timeline', v),
            })}
          </>
        )}

        {step === 1 && (
          <div className="form-field">
            <label className="form-label" htmlFor="pf-message">
              Project goals
              <span className="form-label-meta">20 characters minimum</span>
            </label>
            <textarea id="pf-message" className="form-input" name="message" rows={5} maxLength={MAX.message} value={form.message} onChange={(e) => update('message', e.target.value)} onBlur={() => checkOnBlur('message')} placeholder="What should it do, who is it for, and is there a deadline? Add any links that help" {...describe('message')} />
            {errorText('message')}
          </div>
        )}

        {lastStep && (
          <>
            <div className="form-field">
              <label className="form-label" htmlFor="pf-name">Full name</label>
              <input id="pf-name" className="form-input" type="text" name="name" autoComplete="name" maxLength={MAX.name} value={form.name} onChange={(e) => update('name', e.target.value)} onBlur={() => checkOnBlur('name')} placeholder="Jane Doe" {...describe('name')} />
              {errorText('name')}
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="pf-email">Email</label>
              <input id="pf-email" className="form-input" type="email" name="email" autoComplete="email" inputMode="email" autoCapitalize="off" spellCheck={false} maxLength={MAX.email} value={form.email} onChange={(e) => update('email', e.target.value)} onBlur={() => checkOnBlur('email')} placeholder="jane@company.com" {...describe('email')} />
              {emailFix && !errors.email && (
                <button type="button" className="form-suggest" onClick={() => update('email', emailFix)}>
                  Did you mean <span>{emailFix}</span>?
                </button>
              )}
              {errorText('email')}
            </div>
            <div className="form-grid">
              <div className="form-field">
                <label className="form-label" htmlFor="pf-phone">
                  Phone
                  <span className="form-label-meta">{phoneNeeded ? 'Needed for a call' : 'Optional'}</span>
                </label>
                <input id="pf-phone" className="form-input" type="tel" name="phone" autoComplete="tel" inputMode="tel" maxLength={MAX.phone} value={form.phone} onFocus={() => loadPhoneLibrary().catch(() => {})} onChange={(e) => update('phone', e.target.value)} onBlur={() => checkOnBlur('phone')} placeholder="+44 7700 900000" {...describe('phone')} />
                {errorText('phone')}
              </div>
              <div className="form-field">
                <span className="form-label" id="preferredContact-label">Preferred contact</span>
                <div className="segmented" role="radiogroup" aria-labelledby="preferredContact-label">
                  {PREFERRED_CONTACTS.map((c) => (
                    <label key={c} className="choice">
                      <input type="radio" name="preferredContact" value={c} checked={form.preferredContact === c} onChange={() => update('preferredContact', c)} />
                      <span>{c}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <label className="form-consent">
              <input type="checkbox" name="consent" checked={form.consent} onChange={(e) => update('consent', e.target.checked)} {...describe('consent')} />
              <span>
                I agree to be contacted about this project. Read how we use your details in our{' '}
                <Link to="/privacy" target="_blank" rel="noopener noreferrer">privacy policy</Link>
                {errors.consent && <span className="form-error form-error--block" id="consent-error" aria-hidden="true">{errors.consent}</span>}
              </span>
            </label>
          </>
        )}
      </div>

      {/* Honeypot — hidden from real users via CSS, bots that auto-fill every field trip it */}
      <label className="form-trap" aria-hidden="true">
        Leave this field empty
        <input type="text" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => update('website', e.target.value)} />
      </label>

      <div className="form-footer">
        {hasErrors && <p className="form-status form-status--error" role="alert">Check the highlighted fields</p>}
        {status === 'error' && (
          <p className="form-status form-status--error" role="alert">
            Your brief couldn’t be sent.{' '}
            <a href={mailtoFallback} className="form-status-link">Email it to us instead</a>
          </p>
        )}
        {status === 'rejected' && (
          <p className="form-status form-status--error" role="alert">
            Your brief didn’t pass our spam checks. Check your details, or{' '}
            <a href={mailtoFallback} className="form-status-link">email it to us</a>
          </p>
        )}
        {status === 'limited' && (
          <p className="form-status form-status--error" role="alert">
            The form has had a lot of briefs this hour, so it’s paused.{' '}
            <a href={mailtoFallback} className="form-status-link">Email it to us instead</a>
          </p>
        )}
        {status === 'duplicate' && (
          <p className="form-status form-status--error" role="alert">This brief was already sent recently. Email us if you need to change it.</p>
        )}
        {status === 'unconfigured' && (
          <p className="form-status form-status--error" role="alert">This form isn't connected to a spreadsheet yet — see SHEETS_SETUP.md to finish setup.</p>
        )}

        <div className="form-nav">
          <button type="submit" className="btn-primary" disabled={status === 'submitting'}>
            {!lastStep ? 'Continue' : status === 'submitting' ? 'Sending' : 'Get my free consultation'}
          </button>
          {step > 0 && <button type="button" className="form-back" onClick={() => goTo(step - 1)}>Back</button>}
        </div>
        {step === 0 && (
          <p className="form-aside">
            Not ready to send a brief? <Link to="/project-checklist">Plan it with the free project checklist</Link>
          </p>
        )}
        {lastStep && (
          <p className="form-trust">
            <span>Free consultation</span>
            <span>We typically reply within a few hours</span>
            <span>We never sell your details</span>
          </p>
        )}
      </div>
    </form>
  )
}
