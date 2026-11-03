import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let lenis = null

// Jump to the top, or glide to a #section. Used by page transitions and same-page hash links.
export function scrollToHashOrTop(hash) {
  const target = hash ? document.querySelector(hash) : null
  if (lenis) {
    if (target) lenis.scrollTo(target, { offset: -90 })
    else lenis.scrollTo(0, { immediate: true, force: true })
  } else if (target) {
    target.scrollIntoView({ behavior: 'smooth' })
  } else {
    window.scrollTo(0, 0)
  }
}

// Site-wide Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger stays in sync.
export default function SmoothScroll() {
  const { pathname, hash } = useLocation()
  const lastPath = useRef(pathname)

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    lenis = new Lenis({ lerp: 0.1, anchors: { offset: -90 } })
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      lenis = null
    }
  }, [])

  // Hash links on the same page (e.g. clicking "Process" while already on Home).
  // Cross-page navigation is handled by the page transition in Layout.
  useEffect(() => {
    if (lastPath.current === pathname && hash) scrollToHashOrTop(hash)
    lastPath.current = pathname
  }, [pathname, hash])

  return null
}
