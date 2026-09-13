import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Reveal from '../components/Reveal'
import Scene3D from '../components/Scene3D'

export default function Home() {
  return (
    <>
      <section id="hero">
        <Scene3D />
        <div className="hero-orb hero-orb-1"></div>
        <div className="hero-orb hero-orb-2"></div>

        <motion.div
          className="hero-badge"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="hero-badge-dot"></span>AI-Driven Technology Partner
        </motion.div>

        <motion.h1
          className="hero-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Build Smarter.<br />Deploy Faster.<br />Scale Further.
        </motion.h1>

        <motion.p
          className="hero-sub"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Autryx Solutions delivers end-to-end AI systems, web and mobile development, cloud infrastructure, and enterprise-grade DevOps — engineered for businesses that demand excellence.
        </motion.p>

        <motion.div
          className="hero-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Link to="/services" className="btn-primary">Explore Services</Link>
          <Link to="/contact" className="btn-outline">Start a Project</Link>
        </motion.div>

        <motion.div
          className="hero-stats"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="stat"><div className="stat-num">20+</div><div className="stat-label">Projects Delivered</div></div>
          <div className="stat"><div className="stat-num">99.9%</div><div className="stat-label">Uptime SLA</div></div>
          <div className="stat"><div className="stat-num">8</div><div className="stat-label">Core Disciplines</div></div>
          <div className="stat"><div className="stat-num">24/7</div><div className="stat-label">Support Coverage</div></div>
        </motion.div>
      </section>

      <section id="services">
        <Reveal as="div" className="section-header">
          <span className="section-tag">◆ What We Do</span>
          <h2 className="section-title">Our <span>Core Services</span></h2>
          <p className="section-sub">Requirement engineering, product builds, AI, web &amp; mobile, cloud, DevOps, and marketing — eight disciplines, one accountable team.</p>
        </Reveal>

        <div className="services-grid teaser-grid-narrow">
          {[
            { to: '/ai-ml', img: 'ai-ml.png', label: 'AI and Machine Learning' },
            { to: '/product-engineering', img: 'product-engineering.png', label: 'Product Engineering' },
            { to: '/cloud-services', img: 'cloud-services.png', label: 'Cloud Services' },
            { to: '/meta-ads', img: 'meta-ads.png', label: 'Marketing and Meta Ads' },
          ].map((svc, i) => (
            <Reveal as={Link} key={svc.to} to={svc.to} className="svc-tile" delay={i * 0.08}
              style={{ backgroundImage: `url('/images/${svc.img}')` }} aria-label={svc.label}>
              <span className="svc-tile-cta">Learn More →</span>
            </Reveal>
          ))}
        </div>

        <Reveal className="teaser-more">
          <Link to="/services" className="btn-primary">View All 8 Services</Link>
        </Reveal>
      </section>

      <section id="about">
        <div className="about-inner">
          <div>
            <Reveal as="span" className="section-tag">◆ Why Autryx</Reveal>
            <Reveal as="h2" className="section-title" delay={0.1}>Where <span>Precision</span><br />Meets Performance</Reveal>
            <Reveal as="p" className="section-sub" delay={0.2}>We don't just build software — we architect digital ecosystems built specifically for business owners, with AI-native architecture and ops-driven delivery baked in from day one.</Reveal>

            <ul className="features-list">
              <Reveal as="li" className="feature-item" delay={0.3}>
                <div className="feature-check">✓</div>
                <div className="feature-text"><strong>Built for Business Owners</strong><p>We translate your goals into technology that drives real results, without the technical headaches.</p></div>
              </Reveal>
              <Reveal as="li" className="feature-item" delay={0.4}>
                <div className="feature-check">✓</div>
                <div className="feature-text"><strong>End-to-End Ownership</strong><p>From ideation to production to monitoring — we own the entire lifecycle so you don't have to.</p></div>
              </Reveal>
            </ul>

            <div style={{ marginTop: 32 }}>
              <Link to="/about" className="btn-outline">Learn More About Us</Link>
            </div>
          </div>
          <Reveal className="about-visual" delay={0.2}>
            <div className="orbit-field" aria-hidden="true">
              <div className="orbit-glow"></div>
              <div className="orbit-ping"></div>
              <div className="orbit-ping orbit-ping--delay"></div>

              <div className="orbit-ring orbit-ring--outer">
                <div className="orbit-node" style={{ '--angle': '20deg' }}><span className="orbit-node-icon">🤖</span></div>
                <div className="orbit-node" style={{ '--angle': '160deg' }}><span className="orbit-node-icon">☁️</span></div>
                <div className="orbit-node" style={{ '--angle': '280deg' }}><span className="orbit-node-icon">⚙️</span></div>
              </div>
              <div className="orbit-ring orbit-ring--inner">
                <div className="orbit-node" style={{ '--angle': '80deg' }}><span className="orbit-node-icon">⚡</span></div>
                <div className="orbit-node" style={{ '--angle': '250deg' }}><span className="orbit-node-icon">📣</span></div>
              </div>

              <div className="orbit-core">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="46" height="46">
                  <path d="M12 2 L12 6" /><path d="M12 18 L12 22" /><path d="M2 12 L6 12" /><path d="M18 12 L22 12" />
                  <circle cx="12" cy="12" r="5" />
                  <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
                </svg>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="process">
        <Reveal className="section-header">
          <span className="section-tag">◆ How We Work</span>
          <h2 className="section-title">Our <span>Delivery Process</span></h2>
          <p className="section-sub">A structured, agile methodology that keeps projects on time, on budget, and on point.</p>
        </Reveal>

        <div className="process-steps">
          {[
            ['01', 'Discovery', 'Deep-dive into your goals, constraints, and technical landscape to define a precise scope.'],
            ['02', 'Architect', 'Design a robust solution blueprint — stack, infrastructure, integrations, and data flows.'],
            ['03', 'Build & Test', 'Agile sprints with continuous integration, automated testing, and transparent progress reporting.'],
            ['04', 'Deploy & Operate', 'Zero-downtime deployments, monitoring, alerting, and ongoing optimization post-launch.'],
          ].map(([num, title, desc], i) => (
            <Reveal className="process-step" key={num} delay={i * 0.1}>
              <div className="step-num">{num}</div>
              <div className="step-title">{title}</div>
              <div className="step-desc">{desc}</div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="reviews">
        <Reveal className="section-header">
          <span className="section-tag">◆ Client Reviews</span>
          <h2 className="section-title">What Our <span>Clients Say</span></h2>
          <p className="section-sub">Real feedback from business owners we've worked with across Pakistan and beyond.</p>
        </Reveal>

        <div className="reviews-grid teaser-grid-narrow">
          {[
            { text: 'Autryx Solutions built my WordPress website from scratch and it looks incredibly professional. Highly recommended.', initials: 'HS', name: 'Hani Shakoor', meta: 'WordPress Website · Qatar', badge: '🎨 WordPress' },
            { text: 'The AI object detection system Autryx built for us exceeded all expectations. Rare to find such technical skill and communication.', initials: 'SA', name: 'Sadia Faisal', meta: 'AI Object Detection · Italy', badge: '🤖 AI / ML' },
            { text: 'We moved our entire infrastructure to the cloud with Autryx and the transition was seamless. Zero downtime.', initials: 'OM', name: 'Omar Mirza', meta: 'Cloud Migration · Dubai', badge: '☁️ Cloud Services' },
          ].map((r, i) => (
            <Reveal className="review-card" key={r.name} delay={i * 0.1}>
              <div className="review-stars">★★★★★</div>
              <p className="review-text">"{r.text}"</p>
              <div className="review-author">
                <div className="review-avatar">{r.initials}</div>
                <div className="review-info">
                  <strong>{r.name}</strong>
                  <span>{r.meta}</span>
                </div>
                <div className="review-badge">{r.badge}</div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="teaser-more">
          <Link to="/reviews" className="btn-primary">Read All Reviews</Link>
        </Reveal>
      </section>

      <section id="cta">
        <div className="cta-box">
          <span className="section-tag">◆ Let's Build Together</span>
          <Reveal as="h2" className="cta-title">Ready to Transform<br />Your Business?</Reveal>
          <Reveal as="p" className="cta-sub" delay={0.1}>Reach out directly — we respond fast. Whether you need a website, a Shopify store, or a full AI system, we're here to help business owners like you.</Reveal>
          <Reveal as={Link} to="/contact" className="btn-primary" delay={0.2}>Get In Touch</Reveal>
        </div>
      </section>
    </>
  )
}
