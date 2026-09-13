import { useEffect, useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

const NAV_LINKS = [
  { to: '/services', label: 'Services' },
  { to: '/about', label: 'About' },
  { to: '/#process', label: 'Process' },
  { to: '/reviews', label: 'Reviews' },
  { to: '/contact', label: 'Contact' },
]

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-menu open"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button className="mobile-menu-close" onClick={() => setMenuOpen(false)}>
              &times;
            </button>
            {NAV_LINKS.map((link) => (
              <Link key={link.to} to={link.to} onClick={() => setMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <nav style={{ padding: scrolled ? '12px 6%' : '18px 6%', transition: 'padding .25s ease' }}>
        <Link className="nav-logo" to="/">
          <img src="/Logo.png" alt="Autryx Solutions" style={{ height: 48, width: 'auto', objectFit: 'contain' }} />
        </Link>
        <ul className="nav-links">
          {NAV_LINKS.map((link) => (
            <li key={link.to}>
              <Link to={link.to}>{link.label}</Link>
            </li>
          ))}
        </ul>
        <Link to="/contact" className="nav-cta">Get Started</Link>
        <button className="hamburger" onClick={() => setMenuOpen(true)} aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
      </nav>

      <Outlet />

      <footer>
        <div className="footer-grid">
          <div className="footer-brand">
            <Link className="nav-logo" to="/">
              <img src="/Logo.png" alt="Autryx Solutions" style={{ height: 52, width: 'auto', objectFit: 'contain' }} />
            </Link>
            <p>AI-driven solutions for business owners. Web & mobile, WordPress &amp; Shopify development, cloud services. DevOps, SecOps, MLOps, and NetOps specialists.</p>
            <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <a href="https://wa.me/923173058669" target="_blank" rel="noopener" style={{ color: '#25d366', fontSize: '.88rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                0317 3058669
              </a>
              <a href="mailto:autryxsolutions@gmail.com" style={{ color: 'var(--cyan)', fontSize: '.88rem', textDecoration: 'none' }}>&#9993; autryxsolutions@gmail.com</a>
            </div>
          </div>
          <div className="footer-col">
            <h4>Services</h4>
            <ul>
              <li><Link to="/services">AI & ML</Link></li>
              <li><Link to="/services">Web & Mobile Dev</Link></li>
              <li><Link to="/services">WordPress &amp; Shopify</Link></li>
              <li><Link to="/services">Cloud Services</Link></li>
              <li><Link to="/services">DevOps, CI/CD, SecOps &amp; NetOps</Link></li>
              <li><Link to="/services">Marketing &amp; Meta Ads</Link></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/#process">Process</Link></li>
              <li><Link to="/reviews">Reviews</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2025 Autryx Solutions. All rights reserved.</p>
          <div className="socials">
            <a href="https://wa.me/923173058669" target="_blank" rel="noopener" className="social-link" title="WhatsApp" style={{ background: 'rgba(37,211,102,0.08)', borderColor: 'rgba(37,211,102,0.3)', color: '#25d366' }}>
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
            </a>
            <a href="mailto:autryxsolutions@gmail.com" className="social-link" title="Email">@</a>
            <a href="#" className="social-link" title="LinkedIn">in</a>
          </div>
        </div>
      </footer>

      <a href="https://wa.me/923173058669" target="_blank" rel="noopener" className="wa-float" aria-label="Chat on WhatsApp">
        <div className="wa-float-tooltip">Chat on WhatsApp</div>
        <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </>
  )
}
