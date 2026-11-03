// Unslop motion pass: headings no longer reveal word by word. Kept as a plain heading so
// existing pages render unchanged; `delay` and `onMount` are accepted and ignored.
export default function TextReveal({ as: Tag = 'h2', className, delay: _delay, onMount: _onMount, children, ...rest }) {
  return (
    <Tag className={className} {...rest}>
      {children}
    </Tag>
  )
}
