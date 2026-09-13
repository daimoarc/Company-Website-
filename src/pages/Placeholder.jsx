import Reveal from '../components/Reveal'

export default function Placeholder({ title }) {
  return (
    <section style={{ minHeight: '50vh', display: 'flex', alignItems: 'center' }}>
      <Reveal className="section-header">
        <span className="section-tag">◆ Coming Soon</span>
        <h2 className="section-title">{title}</h2>
        <p className="section-sub">This page hasn't been migrated to React yet — content still lives in the original static HTML file.</p>
      </Reveal>
    </section>
  )
}
