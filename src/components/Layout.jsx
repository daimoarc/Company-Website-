import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useOutlet } from 'react-router-dom'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Logo from './Logo'
import SmoothScroll, { scrollToHashOrTop } from './SmoothScroll'
import { SERVICES } from '../data/services'

const NAV_LINKS = [
  { to: '/services', label: 'Services' },
  { to: '/about', label: 'About' },
  { to: '/#process', label: 'Process' },
  { to: '/reviews', label: 'Reviews' },
  { to: '/contact', label: 'Contact' },
]

const ease = [0.22, 1, 0.36, 1]
const pageVariants = {
  initial: { opacity: 0, y: 8 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.4, ease } },
  exit: { opacity: 0, transition: { duration: 0.2, ease } },
}

export default function Layout() {
  const location = useLocation()
  const outlet = useOutlet()
  const [menuOpen, setMenuOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // The bar tucks away while scrolling down and returns when scrolling up
  useEffect(() => {
    let lastY = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 8)
      if (Math.abs(y - lastY) > 6) {
        setHidden(y > lastY && y > 160)
        lastY = y
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false); setHidden(false) }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
  }, [menuOpen])

  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll />

      <header className={`nav${hidden && !menuOpen ? ' nav--hidden' : ''}${scrolled || menuOpen ? ' nav--scrolled' : ''}`}>
        <Link className="nav-logo" to="/" aria-label="DaimoArc home">
          <Logo height={38} />
        </Link>
        <nav aria-label="Main">
          <ul className="nav-links">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                {link.to.startsWith('/#')
                  ? <Link to={link.to}>{link.label}</Link>
                  : <NavLink to={link.to}>{link.label}</NavLink>}
              </li>
            ))}
          </ul>
        </nav>
        <Link to="/contact" className="nav-cta">Start a project</Link>
        <button className={`hamburger${menuOpen ? ' is-open' : ''}`} onClick={() => setMenuOpen((o) => !o)} aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen}>
          <span></span><span></span>
        </button>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.2, ease } }}
            exit={{ opacity: 0, transition: { duration: 0.16, ease } }}
          >
            <nav className="mobile-menu-links" aria-label="Mobile">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: 0.05 + i * 0.04, duration: 0.3, ease } }}
                >
                  <Link
                    to={link.to}
                    className={link.to === location.pathname ? 'is-active' : undefined}
                    onClick={() => setMenuOpen(false)}
                  >
                    <span className="mobile-menu-num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="mobile-menu-label">{link.label}</span>
                    <span className="mobile-menu-arrow" aria-hidden="true">→</span>
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.div
              className="mobile-menu-foot"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.25, duration: 0.3, ease } }}
            >
              <Link to="/contact" className="btn-primary" onClick={() => setMenuOpen(false)}>Start a project</Link>
              <div className="mobile-menu-contact">
                <a href="mailto:contact@daimoarc.com">contact@daimoarc.com</a>
                <a href="https://www.linkedin.com/company/daimoarc/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              </div>
              <p className="mobile-menu-note">We typically reply within a few hours</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait" onExitComplete={() => scrollToHashOrTop(null)}>
        <motion.main
          key={location.pathname}
          variants={pageVariants}
          initial="initial"
          animate="enter"
          exit="exit"
          onAnimationComplete={(name) => {
            if (name !== 'enter') return
            ScrollTrigger.refresh()
            if (location.hash) scrollToHashOrTop(location.hash)
          }}
        >
          {outlet}
        </motion.main>
      </AnimatePresence>

      <footer className="footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link className="nav-logo" to="/" aria-label="DaimoArc home">
              <Logo height={40} />
            </Link>
            <p className="footer-tagline">You run the business. We run the machine</p>
            <p>AI-driven solutions for business owners. Web and mobile, WordPress and Shopify development, cloud services. DevOps, SecOps, MLOps and NetOps specialists.</p>
            <a href="mailto:contact@daimoarc.com" className="footer-email">contact@daimoarc.com</a>
          </div>
          <div className="footer-col">
            <h4>Services</h4>
            <ul>
              {SERVICES.map((s) => (
                <li key={s.to}><Link to={s.to}>{s.title}</Link></li>
              ))}
            </ul>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/#process">Process</Link></li>
              <li><Link to="/reviews">Reviews</Link></li>
              <li><Link to="/project-checklist">Project checklist</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 DaimoArc. All rights reserved.</p>
          <nav className="footer-legal" aria-label="Legal">
            <Link to="/privacy">Privacy</Link>
            <Link to="/cookies">Cookies</Link>
            <Link to="/terms">Terms</Link>
          </nav>
          <div className="socials">
            <a href="mailto:contact@daimoarc.com" className="social-link">Email</a>
            <a href="https://www.linkedin.com/company/daimoarc/" className="social-link" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>
        </div>
      </footer>
    </MotionConfig>
  )
}
