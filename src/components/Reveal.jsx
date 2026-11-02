import { motion } from 'framer-motion'

// framer-motion's `motion` proxy only resolves string keys (e.g. motion.div, motion.h2).
// When `as` is a component (e.g. react-router's Link) instead of a string, bracket access
// silently stringifies it to "[object Object]" and framer-motion manufactures a bogus DOM
// tag for it, crashing on mount. Cache a proper motion(Component) wrapper per component so
// `as={Link}` etc. works, without creating a new component identity on every render.
const motionComponentCache = new WeakMap()

function resolveMotionTag(Tag) {
  if (typeof Tag === 'string') return motion[Tag] ?? motion.div
  if (motionComponentCache.has(Tag)) return motionComponentCache.get(Tag)
  const Wrapped = motion.create ? motion.create(Tag) : motion(Tag)
  motionComponentCache.set(Tag, Wrapped)
  return Wrapped
}

export default function Reveal({ as = 'div', delay = 0, className = '', children, ...rest }) {
  const MotionTag = resolveMotionTag(as)
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      {...rest}
    >
      {children}
    </MotionTag>
  )
}
