import ServicePage from '../components/ServicePage'
import Icon from '../components/Icon'

const STEPS = [
  ['code', 'Code & Build', 'Automated builds triggered on every commit.'],
  ['refresh', 'CI/CD Pipelines', 'Continuous integration & deployment, zero-touch releases.'],
  ['container', 'Container Orchestration', 'Kubernetes-managed containers that scale on demand.'],
  ['shield', 'SecOps', 'Vulnerability scans, Zero Trust, and SOC monitoring.'],
  ['network', 'NetOps', 'Network operations, compliance, and uptime monitoring.'],
]

export default function Devops() {
  return (
    <ServicePage
      heroImage="devops-hero.png"
      title="DevOps, CI/CD, SecOps & NetOps"
      subtitle="End-to-end operations coverage — automated pipelines, container orchestration, security-first architecture, and network operations, all baked in from day one."
      lead="From commit to production to 24/7 monitoring — one accountable pipeline, not four disconnected teams."
      whyItMatters={['Faster, safer releases', 'Fewer production incidents', 'Security & compliance built in', '24/7 monitoring & alerting']}
    >
      <div className="diagram-steps" aria-label="The DevOps pipeline">
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
