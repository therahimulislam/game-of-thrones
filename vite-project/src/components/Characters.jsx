import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Characters.css'

const CHARACTERS = [
  {
    id: 'jon',
    name: 'Jon Snow',
    house: 'HOUSE STARK',
    title: 'King in the North',
    words: '"The night is dark and full of terrors."',
    desc: 'Bastard of Winterfell. Lord Commander. King. Jon Snow carries the weight of every vow he has ever sworn — and every one he has broken.',
    image: '/images/one.jpg',
    accentColor: '#8fafc4',
    bgGradient: 'linear-gradient(135deg, #050810 0%, #0d1825 50%, #050810 100%)',
    sigilColor: '#6b9ab8',
  },
  {
    id: 'daenerys',
    name: 'Daenerys',
    house: 'HOUSE TARGARYEN',
    title: 'Mother of Dragons',
    words: '"I am not your little princess."',
    desc: 'Khaleesi of the Great Grass Sea. Breaker of Chains. The last dragon. Born in exile and forged in fire, she came to break the wheel.',
    image: '/images/three.png',
    accentColor: '#c0392b',
    bgGradient: 'linear-gradient(135deg, #1a0000 0%, #2d0a0a 50%, #1a0000 100%)',
    sigilColor: '#c0392b',
  },
  {
    id: 'tyrion',
    name: 'Tyrion',
    house: 'HOUSE LANNISTER',
    title: 'Hand of the Queen',
    words: '"I drink and I know things."',
    desc: 'The Imp. The Halfman. The most cunning mind in Westeros hidden behind a jest. Where others wield swords, Tyrion Lannister wields words — and they cut deeper.',
    image: '/images/two.jpg',
    accentColor: '#c9a84c',
    bgGradient: 'linear-gradient(135deg, #1a1200 0%, #2a1f00 50%, #1a1200 100%)',
    sigilColor: '#c9a84c',
  },
  {
    id: 'cersei',
    name: 'Cersei',
    house: 'HOUSE LANNISTER',
    title: 'Queen of the Seven Kingdoms',
    words: '"When you play the game of thrones, you win or you die."',
    desc: 'The Lioness of Casterly Rock. Every decision a chess move. Every kindness a trap. Cersei Lannister does not forgive. She does not forget. She endures.',
    image: '/images/two.jpg',
    accentColor: '#d4a843',
    bgGradient: 'linear-gradient(135deg, #100900 0%, #201500 50%, #100900 100%)',
    sigilColor: '#d4a843',
  },
]

const Characters = () => {
  const sectionRef = useRef(null)
  const trackRef   = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const track   = trackRef.current
    if (!section || !track) return

    const panels = track.querySelectorAll('.char-panel')
    const totalWidth = (panels.length - 1) * window.innerWidth

    // Horizontal scroll pin
    const ctx = gsap.context(() => {
      const tween = gsap.to(track, {
        x: -totalWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: `+=${totalWidth}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      // Per-panel reveal animations
      panels.forEach((panel, i) => {
        const chars  = panel.querySelectorAll('.char-name-letter')
        const info   = panel.querySelectorAll('.char-house, .char-title, .char-words, .char-desc, .char-divider')
        const img    = panel.querySelector('.char-img-wrap')

        ScrollTrigger.create({
          trigger: section,
          start: `top+=${i * window.innerWidth * 0.8} top`,
          end:   `top+=${i * window.innerWidth * 0.8 + window.innerWidth * 0.5} top`,
          scrub: false,
          onEnter: () => {
            gsap.fromTo(chars, { y: 120, opacity: 0 }, {
              y: 0, opacity: 1, duration: 1, ease: 'power3.out', stagger: 0.04,
            })
            gsap.fromTo(info, { y: 30, opacity: 0 }, {
              y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.08, delay: 0.3,
            })
            gsap.fromTo(img, { scale: 1.15, opacity: 0 }, {
              scale: 1, opacity: 1, duration: 1.2, ease: 'power2.out',
            })
          },
        })
      })

      // Progress dots
      const dots = section.querySelectorAll('.char-progress-dot')
      dots.forEach((dot, i) => {
        ScrollTrigger.create({
          trigger: section,
          start: `top+=${i * totalWidth / (panels.length - 1) * 0.9} top`,
          end:   `top+=${(i + 1) * totalWidth / (panels.length - 1) * 0.9} top`,
          onEnter:      () => { dots.forEach(d => d.classList.remove('active')); dot.classList.add('active') },
          onEnterBack:  () => { dots.forEach(d => d.classList.remove('active')); dot.classList.add('active') },
        })
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="characters-section" id="characters" aria-label="Characters">
      <div ref={trackRef} className="char-track">
        {CHARACTERS.map((char) => (
          <div
            key={char.id}
            className="char-panel"
            style={{ '--char-accent': char.accentColor, background: char.bgGradient }}
          >
            {/* Background sigil watermark */}
            <div className="char-bg-sigil" style={{ color: char.sigilColor }}>
              {char.name[0]}
            </div>

            {/* Left — content */}
            <div className="char-content">
              <p className="char-house" style={{ color: char.accentColor }}>{char.house}</p>
              <div className="char-divider">
                <span className="char-divider-line" style={{ background: `linear-gradient(to right, transparent, ${char.accentColor})` }} />
                <span className="char-divider-diamond" style={{ background: char.accentColor }} />
                <span className="char-divider-line" style={{ background: `linear-gradient(to left, transparent, ${char.accentColor})` }} />
              </div>
              <h2 className="char-name" aria-label={char.name}>
                {char.name.split('').map((letter, i) => (
                  <span key={i} className="char-name-letter"
                    style={{ color: letter === ' ' ? 'transparent' : undefined }}>
                    {letter === ' ' ? '\u00A0' : letter}
                  </span>
                ))}
              </h2>
              <p className="char-title" style={{ color: char.accentColor }}>{char.title}</p>
              <p className="char-words">"{char.words.replace(/"/g, '')}"</p>
              <p className="char-desc">{char.desc}</p>
            </div>

            {/* Right — image */}
            <div className="char-img-wrap">
              <img
                className="char-img"
                src={char.image}
                alt={`${char.name} — ${char.house}`}
                loading="lazy"
              />
              <div className="char-img-overlay" style={{ background: `linear-gradient(to right, ${char.bgGradient.match(/#\w+/)[0]} 0%, transparent 60%)` }} />
              <div className="char-img-vignette" />
            </div>
          </div>
        ))}
      </div>

      {/* Progress indicator */}
      <div className="char-progress" aria-hidden="true">
        {CHARACTERS.map((_, i) => (
          <div key={i} className={`char-progress-dot ${i === 0 ? 'active' : ''}`} />
        ))}
      </div>

      {/* Scroll hint */}
      <div className="char-scroll-hint" aria-hidden="true">
        <span>Drag</span>
        <div className="char-scroll-arrow" />
      </div>
    </section>
  )
}

export default Characters
