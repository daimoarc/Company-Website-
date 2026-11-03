// Mini animated line icons for the services list — new ideas, separate from the larger
// service-page illustrations. 24px, 1.5 stroke, cyan on the moving part.
// Styles live in styles.css ("MINI ICONS").

const ICONS = {
  // A magnifier scans across the requirements
  'requirement-engineering': (
    <>
      <line x1="4" y1="7" x2="17" y2="7" />
      <line x1="4" y1="11.5" x2="13" y2="11.5" />
      <line x1="4" y1="16" x2="15" y2="16" />
      <g className="mi-scan">
        <circle className="mi-lens mi-accent" cx="11" cy="11.5" r="3.6" />
        <line className="mi-accent" x1="9.2" y1="11.5" x2="12.8" y2="11.5" />
        <line className="mi-accent" x1="13.6" y1="14.1" x2="16.5" y2="17" />
      </g>
    </>
  ),
  // The build completes, then a tick: shipped
  'product-engineering': (
    <>
      <path className="mi-ring-bg" d="M12 4a8 8 0 1 1 0 16a8 8 0 1 1 0-16" />
      <path className="mi-ring mi-accent" d="M12 4a8 8 0 1 1 0 16a8 8 0 1 1 0-16" pathLength="100" />
      <path className="mi-check mi-accent" d="M8.6 12.3l2.3 2.3 4.6-4.8" pathLength="12" />
    </>
  ),
  // A detection frame closes in and locks onto an object
  'ai-ml': (
    <>
      <circle className="mi-target" cx="12" cy="12" r="3.2" />
      <circle className="mi-core" cx="12" cy="12" r="1.1" />
      <path className="mi-corner mi-c1 mi-accent" d="M4 8.5V4h4.5" />
      <path className="mi-corner mi-c2 mi-accent" d="M15.5 4H20v4.5" />
      <path className="mi-corner mi-c3 mi-accent" d="M20 15.5V20h-4.5" />
      <path className="mi-corner mi-c4 mi-accent" d="M8.5 20H4v-4.5" />
    </>
  ),
  // One screen resizes from desktop to phone and back
  fullstack: (
    <>
      <g className="mi-resize">
        <rect x="3" y="4.5" width="18" height="12.5" rx="1.6" />
        <line className="mi-accent" x1="6" y1="8" x2="13" y2="8" />
      </g>
      <line className="mi-stand" x1="9" y1="20.5" x2="15" y2="20.5" />
    </>
  ),
  // A card slides into the reader and the payment light turns on
  'wordpress-shopify': (
    <>
      <g className="mi-card">
        <rect className="mi-accent" x="7" y="3" width="10" height="7" rx="1.2" />
        <line className="mi-accent" x1="7" y1="5.4" x2="17" y2="5.4" />
      </g>
      <rect className="mi-terminal" x="5" y="9" width="14" height="12" rx="1.8" />
      <line x1="8" y1="17.5" x2="12.5" y2="17.5" />
      <circle className="mi-led" cx="15.5" cy="17.5" r="1.1" />
    </>
  ),
  // Capacity scales out by one server, then back in
  'cloud-services': (
    <>
      <rect x="5" y="3.5" width="14" height="5" rx="1.2" />
      <rect x="5" y="10" width="14" height="5" rx="1.2" />
      <rect className="mi-scale mi-accent" x="5" y="16.5" width="14" height="5" rx="1.2" />
      <circle className="mi-blink" cx="8" cy="6" r="0.9" />
      <circle className="mi-blink mi-d1" cx="8" cy="12.5" r="0.9" />
      <line x1="11" y1="6" x2="16" y2="6" />
      <line x1="11" y1="12.5" x2="16" y2="12.5" />
    </>
  ),
  // Pipeline stages pass one after another
  devops: (
    <>
      <line x1="5" y1="12" x2="19" y2="12" />
      <line className="mi-progress mi-accent" x1="5" y1="12" x2="19" y2="12" pathLength="100" />
      <circle className="mi-stage" cx="5" cy="12" r="2.3" />
      <circle className="mi-stage mi-d1" cx="12" cy="12" r="2.3" />
      <circle className="mi-stage mi-d2" cx="19" cy="12" r="2.3" />
    </>
  ),
  // The message goes out in waves
  'meta-ads': (
    <>
      <path d="M4 10v4h3l6.5 4V6L7 10H4z" />
      <path className="mi-wave mi-accent" d="M16.5 9.5a3.5 3.5 0 0 1 0 5" />
      <path className="mi-wave mi-accent mi-d1" d="M19 7a7 7 0 0 1 0 10" />
    </>
  ),
}

export default function ServiceIcon({ kind }) {
  const icon = ICONS[kind]
  if (!icon) return null
  return (
    <svg className="mi" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
      {icon}
    </svg>
  )
}
