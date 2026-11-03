const PATHS = {
  code: <><polyline points="9 6 4 12 9 18" /><polyline points="15 6 20 12 15 18" /></>,
  refresh: <><path d="M21 12a9 9 0 1 1-2.64-6.36" /><polyline points="21 3 21 9 15 9" /></>,
  container: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
  shield: <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" />,
  network: <><circle cx="12" cy="12" r="9" /><line x1="3" y1="12" x2="21" y2="12" /><path d="M12 3a14 14 0 0 1 0 18" /><path d="M12 3a14 14 0 0 0 0 18" /></>,
  cloud: <path d="M7 18h11a4 4 0 0 0 0-8 6 6 0 0 0-11.6-1.7A4.5 4.5 0 0 0 7 18z" />,
  bolt: <polygon points="13 2 3 14 11 14 9 22 21 10 13 10 13 2" />,
  lock: <><rect x="4" y="11" width="16" height="9" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></>,
  scale: <><path d="M12 3v18" /><path d="M5 7l-3 6a3 3 0 0 0 6 0z" /><path d="M19 7l-3 6a3 3 0 0 0 6 0z" /><path d="M5 7h14" /></>,
  database: <><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5" /><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" /></>,
  cube: <><path d="M12 2l9 5v10l-9 5-9-5V7l9-5z" /><path d="M3 7l9 5 9-5" /><path d="M12 12v9" /></>,
  monitor: <><rect x="3" y="4" width="18" height="12" rx="2" /><line x1="8" y1="20" x2="16" y2="20" /><line x1="12" y1="16" x2="12" y2="20" /></>,
  receipt: <><path d="M6 2h12v20l-3-2-3 2-3-2-3 2V2z" /><line x1="9" y1="7" x2="15" y2="7" /><line x1="9" y1="11" x2="15" y2="11" /></>,
  plug: <><path d="M9 2v4" /><path d="M15 2v4" /><path d="M7 6h10v4a5 5 0 0 1-10 0V6z" /><path d="M12 15v7" /></>,
  link: <><path d="M9 15l6-6" /><path d="M11 5l1-1a4 4 0 0 1 6 6l-1 1" /><path d="M13 19l-1 1a4 4 0 0 1-6-6l1-1" /></>,
  gear: <><path d="M12 2v4M12 18v4M4 12H2M22 12h-2" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" /></>,
  robot: <><rect x="5" y="8" width="14" height="10" rx="2" /><circle cx="9" cy="13" r="1.2" fill="currentColor" stroke="none" /><circle cx="15" cy="13" r="1.2" fill="currentColor" stroke="none" /><path d="M12 8V4" /><circle cx="12" cy="3" r="1" fill="currentColor" stroke="none" /><path d="M3 12h2" /><path d="M19 12h2" /></>,
  chart: <><polyline points="3 17 9 11 13 15 21 6" /><polyline points="14 6 21 6 21 13" /></>,
  search: <><circle cx="10" cy="10" r="6" /><line x1="20" y1="20" x2="14.5" y2="14.5" /></>,
  chat: <path d="M4 4h16v11H8l-4 4V4z" />,
  document: <><path d="M6 2h9l5 5v15H6V2z" /><path d="M15 2v5h5" /><line x1="9" y1="13" x2="15" y2="13" /><line x1="9" y1="17" x2="15" y2="17" /></>,
  check: <polyline points="4 12 9 17 20 6" />,
  phone: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />,
  clipboard: <><rect x="6" y="4" width="12" height="16" rx="2" /><rect x="9" y="2" width="6" height="4" rx="1" /><line x1="9" y1="10" x2="15" y2="10" /><line x1="9" y1="14" x2="15" y2="14" /></>,
  wrench: <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.8 2.8-2-2 2.8-2.8z" />,
  palette: <><path d="M12 3a9 9 0 1 0 0 18c1.5 0 2-1 2-2s-.5-1.5-1-2 .5-2 2-2h2a4 4 0 0 0 4-4c0-4.4-4-8-9-8z" /><circle cx="7.5" cy="10.5" r="1" fill="currentColor" stroke="none" /><circle cx="10.5" cy="7" r="1" fill="currentColor" stroke="none" /><circle cx="15.5" cy="7.5" r="1" fill="currentColor" stroke="none" /><circle cx="17" cy="11" r="1" fill="currentColor" stroke="none" /></>,
  megaphone: <><path d="M3 10v4h3l6 4V6l-6 4H3z" /><path d="M15 9a4 4 0 0 1 0 6" /><path d="M18 6a8 8 0 0 1 0 12" /></>,
  support: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4" /><line x1="4.2" y1="4.2" x2="9.5" y2="9.5" /><line x1="14.5" y1="14.5" x2="19.8" y2="19.8" /><line x1="19.8" y1="4.2" x2="14.5" y2="9.5" /><line x1="9.5" y1="14.5" x2="4.2" y2="19.8" /></>,
}

export default function Icon({ name, size = 18, ...props }) {
  const path = PATHS[name]
  if (!path) return null
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {path}
    </svg>
  )
}
