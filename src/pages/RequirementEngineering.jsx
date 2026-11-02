import ServicePage from '../components/ServicePage'
import Icon from '../components/Icon'

const STEPS = [
  ['search', 'Feasibility Study', 'Is it technically, legally & financially viable?'],
  ['chat', 'Elicitation', 'Gather needs straight from stakeholders.'],
  ['document', 'Specification', 'Document requirements clearly & unambiguously.'],
  ['check', 'Verification & Validation', "Confirm they're correct, consistent & complete."],
  ['refresh', 'Management', 'Track & control change throughout delivery.'],
]

export default function RequirementEngineering() {
  return (
    <ServicePage
      heroImage="requirement-engineering-hero.png"
      title={<>Requirements Engineering Process<br />in Software Engineering</>}
      subtitle="Requirements Engineering is the process of identifying, eliciting, analyzing, specifying, validating, and managing the needs and expectations of stakeholders for a software system."
      lead="Turning ambiguous ideas into a clear, build-ready blueprint — before a line of code is written."
      whyItMatters={['Fewer costly surprises later', 'Clear scope everyone agrees on', 'Faster, smoother development', 'On-time, on-budget delivery']}
    >
      <div className="diagram-steps" aria-label="The 5-stage requirements engineering process">
        <div className="diagram-flow-pulse"></div>
        {STEPS.map(([icon, title, desc]) => (
          <div className="diagram-step" key={title}>
            <div className="diagram-step-num"><Icon name={icon} /></div>
            <div className="diagram-step-title">{title}</div>
            <div className="diagram-step-desc">{desc}</div>
          </div>
        ))}
      </div>
    </ServicePage>
  )
}
