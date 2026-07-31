import { useEffect, useRef } from 'react'
import './ScrollProgress.css'

/**
 * Fixed gold progress bar at top of page.
 * Tracks global scroll position across the entire document.
 */
const ScrollProgress = () => {
  const barRef = useRef(null)

  useEffect(() => {
    const bar = barRef.current
    if (!bar) return

    const onScroll = () => {
      const scrolled  = window.scrollY
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const progress  = maxScroll > 0 ? scrolled / maxScroll : 0
      bar.style.transform = `scaleX(${progress})`
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll() // init
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="scroll-progress-track" aria-hidden="true" role="progressbar">
      <div ref={barRef} className="scroll-progress-bar" />
    </div>
  )
}

export default ScrollProgress
