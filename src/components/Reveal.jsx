import { motion } from 'framer-motion'

export default function Reveal({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) {
  const MotionTag = motion[Tag] ?? motion.div
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
