// Unslop motion pass: content no longer flies in on scroll. Kept as a plain wrapper so
// existing pages render unchanged; `delay` is accepted and ignored.
export default function Reveal({ as: Tag = 'div', delay: _delay, className, children, ...rest }) {
  return (
    <Tag className={className} {...rest}>
      {children}
    </Tag>
  )
}
