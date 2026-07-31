import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Footer.css'

const HOUSE_WORDS = [
  { house: 'Stark',      words: 'Winter Is Coming' },
  { house: 'Lannister',  words: 'Hear Me Roar' },
  { house: 'Targaryen',  words: 'Fire and Blood' },
  { house: 'Baratheon',  words: 'Ours Is the Fury' },
  { house: 'Greyjoy',    words: 'We Do Not Sow' },
  { house: 'Tyrell',     words: 'Growing Strong' },
  { house: 'Martell',    words: 'Unbowed, Unbent, Unbroken' },
  { house: 'Arryn',      words: 'As High as Honor' },
]

const Footer = () => {
  const footerRef = useRef(null)
  const lineRef   = useRef(null)

  useEffect(() => {
    const footer = footerRef.current
    const line   = lineRef.current
    if (!footer || !line) return

    const ctx = gsap.context(() => {
      // Top separator line draws in
      gsap.fromTo(line, { scaleX: 0, transformOrigin: 'left center' }, {
        scaleX: 1, duration: 1.2, ease: 'power2.out',
        scrollTrigger: { trigger: footer, start: 'top 90%', toggleActions: 'play none none none' },
      })

      // Content fade-up
      gsap.fromTo(footer.querySelectorAll('.footer-animate'), { y: 24, opacity: 0 }, {
        y: 0, opacity: 1, stagger: 0.08, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: footer, start: 'top 85%', toggleActions: 'play none none none' },
      })
    }, footer)

    return () => ctx.revert()
  }, [])

  return (
    <footer ref={footerRef} className="site-footer" role="contentinfo">
      {/* Top separator */}
      <div ref={lineRef} className="footer-sep-line" aria-hidden="true" />

      {/* Iron Throne sigil */}
      <div className="footer-sigil footer-animate" aria-hidden="true">
        <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="footer-sigil-svg">
          <circle cx="60" cy="60" r="56" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.3"/>
          <circle cx="60" cy="60" r="44" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.2" strokeDasharray="4 8"/>
          <circle cx="60" cy="60" r="32" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.15" strokeDasharray="2 6"/>
          {/* Cardinal points */}
          <path d="M60 10 L64 38 L60 44 L56 38 Z" fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="0.6"/>
          <path d="M60 110 L64 82 L60 76 L56 82 Z" fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="0.6"/>
          <path d="M10 60 L38 56 L44 60 L38 64 Z" fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="0.6"/>
          <path d="M110 60 L82 56 L76 60 L82 64 Z" fill="none" stroke="currentColor" strokeWidth="1" strokeOpacity="0.6"/>
          {/* Diagonal points */}
          <path d="M24 24 L44 46 L40 50 L36 42 Z" fill="none" stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.35"/>
          <path d="M96 24 L76 46 L80 50 L84 42 Z" fill="none" stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.35"/>
          <path d="M24 96 L44 74 L40 70 L36 78 Z" fill="none" stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.35"/>
          <path d="M96 96 L76 74 L80 70 L84 78 Z" fill="none" stroke="currentColor" strokeWidth="0.7" strokeOpacity="0.35"/>
          {/* Center */}
          <circle cx="60" cy="60" r="6" fill="currentColor" fillOpacity="0.5"/>
          <circle cx="60" cy="60" r="12" fill="none" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.4"/>
        </svg>
      </div>

      {/* Brand */}
      <div className="footer-brand footer-animate">
        <h2 className="footer-title">Game of Thrones</h2>
        <p className="footer-tagline">The Chronicles of Westeros</p>
      </div>

      {/* House words */}
      <div className="footer-house-words footer-animate" aria-label="House words">
        {HOUSE_WORDS.map(h => (
          <div key={h.house} className="footer-house-item">
            <span className="footer-house-name">{h.house}</span>
            <span className="footer-house-separator">·</span>
            <span className="footer-house-motto">{h.words}</span>
          </div>
        ))}
      </div>

      {/* Nav */}
      <nav className="footer-nav footer-animate" aria-label="Footer navigation">
        {['The World', 'Characters', 'Houses', 'History', 'The Map'].map(link => (
          <a key={link} href="#0" className="footer-nav-link">{link}</a>
        ))}
      </nav>

      {/* Bottom engraving */}
      <div className="footer-engraving footer-animate">
        <div className="footer-orn-line" aria-hidden="true" />
        <p className="footer-motto-line" aria-label="When you play the game of thrones, you win or you die">
          When you play the game of thrones — you win, or you die.
        </p>
        <div className="footer-orn-line" aria-hidden="true" />
      </div>

      <p className="footer-copy footer-animate">
        &copy; {new Date().getFullYear()} Game of Thrones — Fan Experience. Not affiliated with HBO.
      </p>
    </footer>
  )
}

export default Footer
