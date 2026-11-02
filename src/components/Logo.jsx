export default function Logo({ height = 48, showTagline = false }) {
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: height * 0.22 }}>
      <svg viewBox="0 0 120 120" width={height} height={height} style={{ display: 'block', flexShrink: 0 }}>
        <g fill="none" stroke="#CDE3EC" strokeLinecap="round">
          <circle cx="60" cy="60" r="52" strokeWidth="3" strokeDasharray="88 32" transform="rotate(-28 60 60)" opacity="0.7" />
          <circle cx="60" cy="60" r="40" strokeWidth="6.5" strokeDasharray="54 34" transform="rotate(118 60 60)" />
          <circle cx="60" cy="60" r="27" strokeWidth="2.5" strokeDasharray="17 13" opacity="0.85" />
        </g>
        <circle cx="60" cy="60" r="19.5" fill="none" stroke="#3CDCE6" strokeWidth="2" opacity="0.45" />
        <circle cx="60" cy="60" r="12" fill="#3CDCE6" />
      </svg>
      <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1, gap: 4 }}>
        <span style={{ fontFamily: "'Exo 2', sans-serif", fontWeight: 800, fontSize: height * 0.42, letterSpacing: '-0.02em', color: '#E6F3F8', textTransform: 'uppercase' }}>
          DAIM<span style={{ color: '#3CDCE6' }}>O</span>ARC
        </span>
        {showTagline && (
          <span style={{ fontFamily: "'Rajdhani', sans-serif", fontWeight: 600, fontSize: height * 0.13, letterSpacing: '.13em', color: '#8FA9B8', textTransform: 'uppercase' }}>
            You run the business. We run the machine.
          </span>
        )}
      </span>
    </span>
  )
}
