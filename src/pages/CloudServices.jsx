import ServicePage from '../components/ServicePage'
import Icon from '../components/Icon'

const CAPABILITIES = [
  ['cloud', 'Serverless Architecture', 'Event-driven applications that scale automatically and cost nothing when idle.'],
  ['bolt', 'Compute (EC2 & Lambda)', 'From EC2 instances to Lambda functions — the right compute model for your workload.'],
  ['lock', 'API Gateway & Routing', 'Secure, scalable API Gateway endpoints with Route 53 for DNS and routing.'],
  ['scale', 'Load Balancing & Auto-Scaling', 'Elastic Load Balancers that keep your app fast and available under any traffic.'],
  ['database', 'Storage & Databases', 'S3, RDS, and DynamoDB — managed storage that scales with your data.'],
  ['refresh', 'Cloud Migration', 'Move existing infrastructure to AWS with a zero-downtime migration plan.'],
]

const AWS_SERVICES = ['EC2', 'Lambda', 'Elastic Load Balancer', 'API Gateway', 'Route 53', 'S3', 'RDS', 'DynamoDB', 'CloudFront', 'VPC', 'and many more AWS services']

export default function CloudServices() {
  return (
    <ServicePage
      heroImage="cloud-services-hero.png"
      title="Cloud Services"
      subtitle="Serverless architectures and managed AWS infrastructure — engineered to scale automatically, stay available, and cost less when idle."
      lead="We build serverless-first applications on AWS — no servers for you to manage, no capacity to guess."
      whyItMatters={['Scales automatically with demand', 'No idle-server costs', 'Highly available by design', 'Zero-downtime migrations']}
    >
      <>
        <div className="aws-badge">
          <span className="aws-badge-label">Powered by</span>
          <svg viewBox="0 0 120 50" width="90" height="38" xmlns="http://www.w3.org/2000/svg" aria-label="AWS">
            <text x="2" y="33" fontFamily="Arial, Helvetica, sans-serif" fontWeight="700" fontSize="32" fill="#252F3E">aws</text>
            <path d="M3 39 Q38 53 70 37" stroke="#FF9900" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M70 37 L62 35 M70 37 L67 44" stroke="#FF9900" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div className="capability-grid">
          {CAPABILITIES.map(([icon, title, desc]) => (
            <div className="capability-card" key={title}>
              <div className="capability-icon"><Icon name={icon} /></div>
              <div className="capability-title">{title}</div>
              <div className="capability-desc">{desc}</div>
            </div>
          ))}
        </div>

        <h2 style={{ textAlign: 'center', borderTop: 'none' }}>AWS Services We Use</h2>
        <div className="pill-row">
          {AWS_SERVICES.map((s) => (
            <span className="pill" key={s}>{s}</span>
          ))}
        </div>
      </>
    </ServicePage>
  )
}
