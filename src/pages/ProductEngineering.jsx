import { Fragment } from 'react'
import ServicePage from '../components/ServicePage'
import Icon from '../components/Icon'

const CAPABILITIES = [
  ['cube', 'New Product & MVP Builds', 'From concept to a working, production-ready product — fast.'],
  ['monitor', 'Custom SaaS Platforms', 'Multi-tenant SaaS software built around your business model — subscriptions, dashboards, and admin tooling included.'],
  ['receipt', 'POS & Retail Systems', 'Point-of-sale systems, inventory tracking, and order management built for retail, restaurants, and service businesses.'],
  ['plug', 'SaaS Feature Development', 'Already have a SaaS product? We build new features and modules directly into it.'],
  ['link', 'System Integrations', 'We plug into your existing stack — CRMs, APIs, payment providers, internal tools.'],
  ['gear', 'Process Automation', 'Tell us the manual process slowing you down — we design and build the automation.'],
  ['robot', 'AI Automations', 'AI agents and automated pipelines built directly into your product, not bolted on.'],
  ['chart', 'Scale & Harden', 'Production-grade performance, security, and reliability as you grow.'],
]

const FLOW = [
  ['Step 1', 'You Tell Us the Problem', "Walk us through the manual work, bottleneck, or system that's slowing you down."],
  ['Step 2', 'We Design the Fix', 'We map the workflow and design the right integration or automation — AI-powered where it helps.'],
  ['Step 3', 'We Build & Ship It', 'Built into your existing system, tested, and monitored in production.'],
]

export default function ProductEngineering() {
  return (
    <ServicePage
      heroImage="product-engineering-hero.png"
      title="Product Engineering"
      subtitle="New products, custom SaaS platforms, POS and retail systems, new features on your existing software, integrations with the tools you already run, and automation — including AI-driven automation — that removes manual work from your workflow."
      lead="Not just new products — we also extend, connect, and automate the systems you already have."
      whyItMatters={['Faster time-to-market', 'Less manual busywork', 'Built to scale from day one', 'Connects with what you already use']}
    >
      <>
        <div className="capability-grid">
          {CAPABILITIES.map(([icon, title, desc]) => (
            <div className="capability-card" key={title}>
              <div className="capability-icon"><Icon name={icon} /></div>
              <div className="capability-title">{title}</div>
              <div className="capability-desc">{desc}</div>
            </div>
          ))}
        </div>

        <div className="mini-flow-wrap">
          <div className="mini-flow-heading">How We Automate It</div>
          <div className="mini-flow">
            {FLOW.map(([step, title, desc], i) => (
              <Fragment key={title}>
                <div className="mini-flow-card">
                  <div className="mini-flow-label">{step}</div>
                  <h4>{title}</h4>
                  <p>{desc}</p>
                </div>
                {i < FLOW.length - 1 && <div className="mini-flow-arrow">→</div>}
              </Fragment>
            ))}
          </div>
        </div>
      </>
    </ServicePage>
  )
}
