import { useEffect, useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Logo from './Logo'

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
          <Logo height={40} />
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
              <Logo height={44} showTagline />
            </Link>
            <p>AI-driven solutions for business owners. Web & mobile, WordPress &amp; Shopify development, cloud services. DevOps, SecOps, MLOps, and NetOps specialists.</p>
            <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <a href="mailto:contact@daimoarc.com" style={{ color: 'var(--cyan)', fontSize: '.88rem', textDecoration: 'none' }}>&#9993; contact@daimoarc.com</a>
            </div>
          </div>
          <div className="footer-col">
            <h4>Services</h4>
            <ul>
              <li><Link to="/services">AI & ML</Link></li>
              <li><Link to="/services">Web & Mobile Dev</Link></li>
              <li><Link to="/services">WordPress, Shopify &amp; TikTok</Link></li>
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
          <p>© 2025 DaimoArc. All rights reserved.</p>
          <div className="socials">
            <a href="mailto:contact@daimoarc.com" className="social-link" title="Email">@</a>
            <a href="#" className="social-link" title="LinkedIn">in</a>
          </div>
        </div>
      </footer>
    </>
  )
}
