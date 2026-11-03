import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import CircuitBackground from './CircuitBackground'

const ease = [0.22, 1, 0.36, 1]
// The page's one entrance: a short fade and rise, 50ms apart
const enter = (i) => ({
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: 0.1 + i * 0.05, ease },
})

export default function Hero() {
  return (
    <section className="hero">
      <CircuitBackground />

      <div className="hero-content">
        <motion.h1 className="hero-title" {...enter(0)}>
          You run the business.<br />We run the machine
        </motion.h1>
        <motion.p className="hero-sub" {...enter(1)}>
          DaimoArc builds and runs the AI systems, web and mobile apps, cloud infrastructure and DevOps behind your business
        </motion.p>
        <motion.div className="hero-actions" {...enter(2)}>
          <Link to="/contact" className="btn-primary">Start a project</Link>
          <Link to="/services" className="btn-ghost">View services</Link>
        </motion.div>
      </div>
    </section>
  )
}
