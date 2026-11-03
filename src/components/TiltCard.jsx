// Unslop motion pass: cards no longer tilt on hover. A plain surface with a hairline.
export default function TiltCard({ as: Tag = 'div', className = '', maxTilt: _maxTilt, children, ...rest }) {
  return (
    <Tag className={`tilt-card glass-panel ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  )
}
