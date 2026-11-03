import { useState } from 'react'
import { Link } from 'react-router-dom'
import { usePageMeta } from '../usePageMeta'

// A free, ungated resource for business owners who aren't ready to brief anyone yet. Ticks live on the page
// only: nothing is stored or sent anywhere, so it needs no consent and no cookie policy entry
const SECTIONS = [
  {
    title: 'Goals',
    items: [
      ['What problem should this solve?', 'Describe it in one sentence a customer would recognise'],
      ['How will you know it worked?', 'Pick one or two numbers, like enquiries a month or hours saved a week'],
      ['Who makes the final decisions?', 'One person signing things off keeps the project moving'],
      ['What happens if you do nothing?', 'If the honest answer is “not much”, it may not be the right time'],
    ],
  },
  {
    title: 'Users and features',
    items: [
      ['Who will use it?', 'Customers, your team or both, and on which devices'],
      ['What must it do on day one?', 'Name three things. Everything else can wait for a second phase'],
      ['What do you use today?', 'Spreadsheets, an old site or a paid tool. It shows what to replace and what to keep'],
      ['Which websites or apps do you like?', 'Two or three examples save hours of back and forth'],
    ],
  },
  {
    title: 'Data and connections',
    items: [
      ['What information does it need?', 'Products, customers, bookings or documents, and where they live now'],
      ['What must it connect to?', 'Payments, accounting software, a CRM, Shopify or WhatsApp'],
      ['Who owns the data?', 'It should be you, in accounts under your business’s name'],
      ['Does it handle personal data?', 'If it does, plan for privacy laws like the GDPR from the start'],
    ],
  },
  {
    title: 'Budget and timeline',
    items: [
      ['What can you spend on the build?', 'A range is enough. It decides what’s realistic'],
      ['What will it cost to run each month?', 'Hosting, licences, support and updates carry on after launch'],
      ['Is there a real deadline?', 'A launch, a season or a contract. Say why it matters'],
      ['What would you cut to hit it?', 'Knowing this early keeps the date honest'],
    ],
  },
  {
    title: 'Ownership and support',
    items: [
      ['Will you own the code, domain and accounts?', 'Ask for this in writing before any work starts'],
      ['Who looks after it after launch?', 'Security updates, backups and fixes need someone responsible'],
      ['What happens when something breaks?', 'Agree how fast problems get a reply, and who to contact'],
      ['Can you take your data with you?', 'If you ever change supplier, everything should come with you'],
    ],
  },
  {
    title: 'Choosing who builds it',
    items: [
      ['Who will actually do the work?', 'Meet the people building it, not only the person selling it'],
      ['How will you see progress?', 'Regular demos of working software beat long reports'],
      ['What exactly is in the quote?', 'Design, testing, launch, training and support should each be listed'],
      ['Can you speak to a past client?', 'A team proud of its work will put you in touch'],
    ],
  },
]
const TOTAL = SECTIONS.reduce((n, s) => n + s.items.length, 0)

export default function ProjectChecklist() {
  usePageMeta('Project checklist', `A free checklist for business owners planning a website, app, AI or cloud project: ${TOTAL} questions to answer before you brief anyone.`)
  const [done, setDone] = useState(() => new Set())

  function toggle(id) {
    setDone((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <section className="page-section page-top">
      <div className="container">
        <article className="checklist">
          <span className="section-tag">Free checklist</span>
          <h1 className="section-title page-title">Plan your tech project before you brief anyone</h1>
          <p className="section-sub">
            {TOTAL} questions for business owners planning a website, app, AI or cloud project. Answer them first and every quote you get
            will be clearer, including ours
          </p>

          <div className="checklist-bar">
            <p className="checklist-meta">
              <span>{SECTIONS.length} sections</span>
              <span>About 15 minutes</span>
              <span>Free, no email needed</span>
            </p>
            <button type="button" className="btn-ghost checklist-print" onClick={() => window.print()}>Print or save as PDF</button>
          </div>
          <p className="checklist-progress" aria-live="polite">{done.size} of {TOTAL} answered</p>

          {SECTIONS.map((section, s) => (
            <section className="checklist-section" key={section.title} aria-labelledby={`checklist-${s}`}>
              <h2 className="checklist-title" id={`checklist-${s}`}>{section.title}</h2>
              <ul className="checklist-items">
                {section.items.map(([question, why], i) => {
                  const id = `${s}-${i}`
                  return (
                    <li key={id}>
                      <label className="checklist-item">
                        <input type="checkbox" checked={done.has(id)} onChange={() => toggle(id)} />
                        <span>
                          <span className="checklist-q">{question}</span>
                          <span className="checklist-why">{why}</span>
                        </span>
                      </label>
                    </li>
                  )
                })}
              </ul>
            </section>
          ))}

          <div className="checklist-next">
            <h2>Answered most of them?</h2>
            <p>
              Your answers make the project brief quick to fill in. We typically reply within a few hours, and every project starts with
              a free consultation
            </p>
            <Link to="/contact" className="btn-primary">Start your project brief</Link>
          </div>
        </article>
      </div>
    </section>
  )
}
