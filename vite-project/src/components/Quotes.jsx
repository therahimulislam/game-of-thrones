import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Quotes.css'

const QUOTES = [
  { text: 'When you play the game of thrones, you win or you die.', author: 'Cersei Lannister', house: 'HOUSE LANNISTER' },
  { text: 'A mind needs books as a sword needs a whetstone, if it is to keep its edge.', author: 'Tyrion Lannister', house: 'HAND OF THE KING' },
  { text: 'Chaos isn\'t a pit. Chaos is a ladder.', author: 'Petyr Baelish', house: 'LORD OF HARRENHAL' },
  { text: 'The night is dark and full of terrors. But the fire burns them all away.', author: 'Melisandre', house: 'THE RED WOMAN' },
]

const Quotes = () => {
  const sectionRef  = useRef(null)
  const panelsRef   = useRef([])
  const [active, setActive] = useState(0)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      const totalScroll = window.innerHeight * (QUOTES.length + 1)

      ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: `+=${totalScroll}`,
        pin: true,
        pinSpacing: true,
        scrub: false,
        anticipatePin: 1,
        onUpdate: (self) => {
          const idx = Math.min(
            QUOTES.length - 1,
            Math.floor(self.progress * QUOTES.length)
          )
          setActive(idx)
        },
      })

      // Per-panel word-by-word reveal
      panelsRef.current.forEach((panel, i) => {
        if (!panel) return
        const words = panel.querySelectorAll('.q-word')
        const meta  = panel.querySelector('.q-meta')

        ScrollTrigger.create({
          trigger: section,
          start: `top+=${i * window.innerHeight * 1.1} top`,
          onEnter: () => {
            gsap.fromTo(words, { y: 40, opacity: 0 }, {
              y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', stagger: 0.06,
            })
            gsap.fromTo(meta, { opacity: 0, y: 20 }, {
              opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: words.length * 0.06 + 0.2,
            })
          },
          onLeave: () => {
            gsap.to([...words, meta], { opacity: 0, duration: 0.3, ease: 'power2.in' })
          },
          onEnterBack: () => {
            gsap.fromTo(words, { y: -40, opacity: 0 }, {
              y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', stagger: 0.04,
            })
            gsap.fromTo(meta, { opacity: 0 }, { opacity: 1, duration: 0.5, delay: 0.3 })
          },
        })
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="quotes-section" id="lore" aria-label="Famous quotes from Westeros">
      {QUOTES.map((q, i) => (
        <div
          key={i}
          ref={el => panelsRef.current[i] = el}
          className={`q-panel ${i === active ? 'q-panel--active' : ''}`}
          aria-hidden={i !== active}
        >
          {/* Decorative ember canvas is inherited from the ember background  */}
          <div className="q-inner">
            <div className="q-ornament" aria-hidden="true">
              <span className="q-ornament-line" />
              <span className="q-glyph">✦</span>
              <span className="q-ornament-line" />
            </div>

            <blockquote className="q-text" cite={`#${q.author.replace(/\s+/g, '-').toLowerCase()}`}>
              <span className="q-open-mark">&ldquo;</span>
              {q.text.split(' ').map((word, wi) => (
                <span key={wi} className="q-word" style={{ '--wi': wi }}>
                  {word}{' '}
                </span>
              ))}
              <span className="q-close-mark">&rdquo;</span>
            </blockquote>

            <div className="q-meta" aria-label={`Spoken by ${q.author}`}>
              <div className="q-divider">
                <span className="q-divider-line" />
                <span className="q-diamond" />
                <span className="q-divider-line q-divider-line--right" />
              </div>
              <p className="q-author">{q.author}</p>
              <p className="q-house">{q.house}</p>
            </div>
          </div>

          {/* Subtle bottom embers for atmosphere */}
          <div className="q-ember-glow" aria-hidden="true" />
        </div>
      ))}

      {/* Quote progress */}
      <div className="q-progress" aria-label={`Quote ${active + 1} of ${QUOTES.length}`}>
        {QUOTES.map((_, i) => (
          <div key={i} className={`q-dot ${i === active ? 'active' : ''}`} />
        ))}
      </div>
    </section>
  )
}

export default Quotes
