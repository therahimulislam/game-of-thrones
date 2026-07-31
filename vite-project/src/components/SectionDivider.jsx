import { useEffect, useRef } from 'react'

/**
 * Animated gold ornament divider between sections.
 * Lines draw in from center when scrolled into view.
 */
const SectionDivider = ({ glyph = '✦ WESTEROS ✦' }) => {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('in-view')
          observer.unobserve(el)
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className="section-divider" role="separator" aria-hidden="true">
      <div className="section-divider__line" />
      <span className="section-divider__glyph">{glyph}</span>
      <div className="section-divider__line" />
    </div>
  )
}

export default SectionDivider
