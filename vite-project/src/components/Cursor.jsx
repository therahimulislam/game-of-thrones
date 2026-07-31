import { useEffect, useRef } from 'react'
import './Cursor.css'

const Cursor = () => {
  const dotRef  = useRef(null)
  const ringRef = useRef(null)
  const labelRef = useRef(null)

  useEffect(() => {
    const dot  = dotRef.current
    const ring = ringRef.current
    const label = labelRef.current
    if (!dot || !ring) return

    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let ringX  = mouseX
    let ringY  = mouseY
    let raf

    const onMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`
    }

    const lerp = (a, b, t) => a + (b - a) * t

    const animate = () => {
      ringX = lerp(ringX, mouseX, 0.1)
      ringY = lerp(ringY, mouseY, 0.1)
      ring.style.transform = `translate(${ringX}px, ${ringY}px)`
      raf = requestAnimationFrame(animate)
    }
    animate()

    window.addEventListener('mousemove', onMove)

    // ── Magnetic / context effects ─────────────────────────────────────────
    const setGlyph = (g) => { if (label) label.textContent = g }

    const onEnterLink = () => {
      ring.classList.add('cursor-ring--hover')
      dot.classList.add('cursor-dot--hidden')
      setGlyph('ENTER')
      label.classList.add('cursor-label--visible')
    }
    const onEnterCard = () => {
      ring.classList.add('cursor-ring--card')
      dot.classList.add('cursor-dot--hidden')
      setGlyph('⚔')
      label.classList.add('cursor-label--visible')
    }
    const onLeave = () => {
      ring.className = 'cursor-ring'
      dot.className  = 'cursor-dot'
      label.classList.remove('cursor-label--visible')
    }
    const onDown = () => ring.classList.add('cursor-ring--click')
    const onUp   = () => ring.classList.remove('cursor-ring--click')

    // Attach to all interactive elements
    const links  = document.querySelectorAll('a, button')
    const cards  = document.querySelectorAll('.house-card, .char-card, .timeline-node')

    links.forEach(el => { el.addEventListener('mouseenter', onEnterLink); el.addEventListener('mouseleave', onLeave) })
    cards.forEach(el => { el.addEventListener('mouseenter', onEnterCard); el.addEventListener('mouseleave', onLeave) })

    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)

    // Re-query on any DOM change (for dynamically rendered elements)
    const obs = new MutationObserver(() => {
      document.querySelectorAll('a, button').forEach(el => {
        el.removeEventListener('mouseenter', onEnterLink)
        el.removeEventListener('mouseleave', onLeave)
        el.addEventListener('mouseenter', onEnterLink)
        el.addEventListener('mouseleave', onLeave)
      })
      document.querySelectorAll('.house-card, .char-card').forEach(el => {
        el.removeEventListener('mouseenter', onEnterCard)
        el.removeEventListener('mouseleave', onLeave)
        el.addEventListener('mouseenter', onEnterCard)
        el.addEventListener('mouseleave', onLeave)
      })
    })
    obs.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      cancelAnimationFrame(raf)
      obs.disconnect()
    }
  }, [])

  return (
    <>
      <div ref={dotRef}   className="cursor-dot"   aria-hidden="true" />
      <div ref={ringRef}  className="cursor-ring"  aria-hidden="true">
        <span ref={labelRef} className="cursor-label" />
      </div>
    </>
  )
}

export default Cursor
