import ServicePage from '../components/ServicePage'
import Icon from '../components/Icon'

const CAPABILITIES = [
  ['network', 'Responsive Web Apps', 'Fast, responsive web applications that work on every device.'],
  ['phone', 'Native & Cross-Platform Mobile', 'iOS, Android, or one cross-platform codebase — built around your requirement.'],
  ['clipboard', 'Requirement-Based Builds', 'No fixed template — every app is scoped and built around your specific workflow.'],
  ['wrench', 'API & Backend Development', 'Reliable backend systems and APIs that power your web and mobile apps.'],
  ['palette', 'UI/UX Implementation', 'Clean, usable interfaces implemented pixel-for-pixel from design.'],
  ['support', 'Ongoing Support & Maintenance', 'We stay on after launch — updates, fixes, and new features as you grow.'],
]

export default function Fullstack() {
  return (
    <ServicePage
      heroImage="fullstack-hero.png"
      title="Web & Mobile Development"
      subtitle="We build web and mobile apps around your exact requirements — not a template. Responsive web apps, native and cross-platform mobile, and the backend to run them."
      lead="You tell us what your business needs — we design and build the web and mobile app around it."
      whyItMatters={['Built to your requirement, not a template', 'One app, every device', 'Reliable backend & APIs', 'Support after launch']}
    >
      <div className="capability-grid">
        {CAPABILITIES.map(([icon, title, desc]) => (
          <div className="capability-card" key={title}>
            <div className="capability-icon"><Icon name={icon} /></div>
            <div className="capability-title">{title}</div>
            <div className="capability-desc">{desc}</div>
          </div>
        ))}
      </div>
    </ServicePage>
  )
}
