import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Timeline.css'

const EVENTS = [
  { year: '~8,000 BC', title: 'The Long Night', desc: 'Darkness falls upon the world. The Others march from the Lands of Always Winter. The first men and children of the forest stand united.', side: 'left' },
  { year: '~7,500 BC', title: 'The Pact', desc: 'The First Men and the Children of the Forest forge a great pact at the Isle of Faces. The ancient gods bear witness.', side: 'right' },
  { year: '~6,000 BC', title: 'The Wall is Raised', desc: 'Bran the Builder raises the Wall — three hundred miles of ice and magic — to forever hold back the darkness from the north.', side: 'left' },
  { year: '~2,000 BC', title: 'The Andal Invasion', desc: 'The Andals cross the Narrow Sea bearing steel and the Faith of the Seven. The old kingdoms fall one by one.', side: 'right' },
  { year: '~300 BC', title: "Aegon's Conquest", desc: "Aegon the Conqueror lands at Dragonstone with his sisters and three dragons. In two years he forges six kingdoms into one.", side: 'left' },
  { year: '1 AC', title: 'The Iron Throne', desc: 'One thousand swords, surrendered or torn from the fallen. Melted by Balerion the Dread. Reshaped into something terrible and magnificent.', side: 'right' },
  { year: '283 AC', title: "Robert's Rebellion", desc: "The Mad King is slain. The Targaryens fall. Robert Baratheon takes the Iron Throne. An age ends in blood and fire.", side: 'left' },
  { year: '298 AC', title: 'War of the Five Kings', desc: 'Five men claim the Iron Throne. The realm tears itself apart. Winter approaches. And something far worse stirs beyond the Wall.', side: 'right' },
  { year: '305 AC', title: 'Battle of the Bastards', desc: 'Jon Snow reclaims Winterfell. The North remembers. The bastard of Ned Stark rises to become King in the North.', side: 'left' },
  { year: '305 AC', title: 'The Last War', desc: 'Daenerys Targaryen burns King\'s Landing. The Iron Throne melts. A new age dawns — broken, scarred, and uncertain.', side: 'right' },
]

const Timeline = () => {
  const sectionRef = useRef(null)
  const lineRef    = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const line    = lineRef.current
    if (!section || !line) return

    const ctx = gsap.context(() => {
      // Animate the SVG line drawing
      gsap.fromTo(line, { scaleY: 0, transformOrigin: 'top center' }, {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          end:   'bottom 20%',
          scrub: true,
        },
      })

      // Animate each event node + content
      section.querySelectorAll('.tl-event').forEach((el) => {
        const node    = el.querySelector('.tl-node')
        const content = el.querySelector('.tl-content')
        const side    = el.dataset.side

        gsap.fromTo(node, { scale: 0, opacity: 0 }, {
          scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2)',
          scrollTrigger: { trigger: el, start: 'top 75%', toggleActions: 'play none none reverse' },
        })

        gsap.fromTo(content,
          { x: side === 'left' ? -40 : 40, opacity: 0 },
          {
            x: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 75%', toggleActions: 'play none none reverse' },
          }
        )
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="timeline-section" id="history" aria-label="History of Westeros">
      {/* Header */}
      <header className="tl-header">
        <p className="tl-eyebrow">THE CHRONICLES OF WESTEROS</p>
        <div className="tl-header-ornament">
          <span className="tl-ornament-line" />
          <span className="tl-ornament-rune">✦</span>
          <span className="tl-ornament-line" />
        </div>
        <h2 className="tl-title">A History<br /><em>of Blood</em></h2>
        <p className="tl-subtitle">Ten thousand years of war, fire, and ruin — carved into the annals of Westeros.</p>
      </header>

      {/* Timeline */}
      <div className="tl-track">
        {/* The central vertical line */}
        <div className="tl-spine">
          <div ref={lineRef} className="tl-spine-line" />
        </div>

        {/* Events */}
        {EVENTS.map((ev, i) => (
          <div
            key={i}
            className={`tl-event tl-event--${ev.side}`}
            data-side={ev.side}
          >
            {/* Node */}
            <div className="tl-node" aria-hidden="true">
              <div className="tl-node-outer" />
              <div className="tl-node-inner" />
            </div>

            {/* Connector */}
            <div className="tl-connector" />

            {/* Content card */}
            <div className="tl-content">
              <span className="tl-year">{ev.year}</span>
              <h3 className="tl-event-title">{ev.title}</h3>
              <div className="tl-content-divider" />
              <p className="tl-event-desc">{ev.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Timeline
