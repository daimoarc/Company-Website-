import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import ServiceIcon from './ServiceIcon'
import { SERVICES } from '../data/services'

// The eight services as a quiet index. Each icon rests as a still drawing in its service's
// colour and plays once on hover; on touch screens it plays once as its row scrolls into view.
export default function ServiceList() {
  const ref = useRef(null)

  useEffect(() => {
    if (!window.matchMedia('(hover: none)').matches) return
    const rows = ref.current ? [...ref.current.querySelectorAll('.svc-row')] : []
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-playing')
        io.unobserve(entry.target)
      })
    }, { threshold: 0.6 })
    rows.forEach((row) => io.observe(row))
    return () => io.disconnect()
  }, [])

  return (
    <ul className="svc-list" ref={ref}>
      {SERVICES.map((s) => (
        <li className="svc-row" key={s.to} style={{ '--svc': s.color }}>
          <Link to={s.to}>
            <span className="svc-row-icon">
              <ServiceIcon kind={s.to.slice(1)} />
            </span>
            <span>
              <span className="svc-row-title">{s.title}</span>
              <span className="svc-row-desc">{s.short}</span>
            </span>
            <span className="svc-row-arrow" aria-hidden="true">→</span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
