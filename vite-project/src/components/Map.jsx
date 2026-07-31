import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Map.css'

const REGIONS = [
  { id: 'the-wall',     name: 'The Wall',        lore: 'Seven hundred feet of ice — the ancient barrier between the realm of men and the world beyond.',   x: 42, y: 5,  delay: 0 },
  { id: 'winterfell',   name: 'Winterfell',       lore: 'Seat of House Stark. The ancient stronghold of the Kings of Winter, where the direwolf endures.', x: 38, y: 18, delay: 0.1 },
  { id: 'the-north',    name: 'The North',        lore: 'The largest and most sparsely populated of the Seven Kingdoms. Cold, proud, and unbroken.',       x: 28, y: 12, delay: 0.15 },
  { id: 'iron-islands', name: 'Iron Islands',     lore: 'The craggy, windswept home of House Greyjoy. What is dead may never die.',                        x: 14, y: 32, delay: 0.2 },
  { id: 'the-eyrie',   name: 'The Eyrie',         lore: 'The mountain seat of House Arryn. So high that attackers have never once taken it by force.',      x: 55, y: 35, delay: 0.25 },
  { id: 'riverrun',    name: 'Riverrun',           lore: 'The ancestral seat of House Tully, where the Red Fork and the Tumblestone meet.',                 x: 32, y: 42, delay: 0.3 },
  { id: 'kings-landing', name: "King's Landing",  lore: 'The largest city in Westeros. A million souls, the Red Keep, and the Iron Throne.',               x: 48, y: 58, delay: 0.35 },
  { id: 'casterly-rock', name: 'Casterly Rock',   lore: 'The impregnable seat of House Lannister. The rock bleeds gold. So do its lords.',                 x: 24, y: 55, delay: 0.4 },
  { id: 'dragonstone',  name: 'Dragonstone',      lore: 'The ancient Targaryen stronghold, carved from the stone of a smoking mountain.',                  x: 60, y: 63, delay: 0.45 },
  { id: 'highgarden',   name: 'Highgarden',       lore: 'Seat of House Tyrell, where the land is rich and the flowers never stop blooming.',               x: 30, y: 70, delay: 0.5 },
  { id: 'dorne',        name: 'Dorne',             lore: 'Unconquered. Sun-scorched. Proud. The Dornish resisted the dragons and kept their own ways.',     x: 42, y: 85, delay: 0.55 },
]

const Map = () => {
  const sectionRef = useRef(null)
  const [tooltip, setTooltip] = useState(null)
  const [hoveredId, setHoveredId] = useState(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      // Fog of war reveal — wipe from top
      gsap.fromTo('.map-fog', { opacity: 1 }, {
        opacity: 0, duration: 1.5, ease: 'power2.inOut',
        scrollTrigger: { trigger: section, start: 'top 60%', toggleActions: 'play none none reverse' },
      })

      // Pins stagger in
      gsap.fromTo('.map-pin', { scale: 0, opacity: 0 }, {
        scale: 1, opacity: 1, stagger: { each: 0.08, from: 'start' }, duration: 0.5,
        ease: 'back.out(2)',
        scrollTrigger: { trigger: section, start: 'top 50%', toggleActions: 'play none none reverse' },
      })

      // Map frame fade in
      gsap.fromTo('.map-frame', { opacity: 0, scale: 0.96 }, {
        opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out',
        scrollTrigger: { trigger: section, start: 'top 70%', toggleActions: 'play none none reverse' },
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="map-section" id="map" aria-label="Map of Westeros">
      <header className="map-header">
        <p className="map-eyebrow">THE KNOWN WORLD</p>
        <h2 className="map-title">Westeros</h2>
        <p className="map-subtitle">From the Wall in the North to the shores of Dorne — explore the realm.</p>
      </header>

      <div className="map-container">
        {/* Fog of war overlay */}
        <div className="map-fog" aria-hidden="true" />

        {/* Map frame */}
        <div className="map-frame" role="img" aria-label="Stylised map of Westeros">
          {/* Region pins */}
          {REGIONS.map(region => (
            <button
              key={region.id}
              className={`map-pin ${hoveredId === region.id ? 'map-pin--active' : ''}`}
              style={{ left: `${region.x}%`, top: `${region.y}%` }}
              onMouseEnter={() => { setTooltip(region); setHoveredId(region.id) }}
              onMouseLeave={() => { setTooltip(null); setHoveredId(null) }}
              aria-label={region.name}
              title={region.name}
            >
              <span className="map-pin-dot" />
              <span className="map-pin-ring" />
              <span className="map-pin-label">{region.name}</span>
            </button>
          ))}

          {/* Grid decorations */}
          <div className="map-grid" aria-hidden="true" />
          <div className="map-compass" aria-hidden="true">
            <span className="compass-n">N</span>
            <div className="compass-cross" />
            <span className="compass-s">S</span>
          </div>
          <div className="map-border" aria-hidden="true" />

          {/* Region labels (background text) */}
          <div className="map-region-bg map-region-bg--north" aria-hidden="true">THE NORTH</div>
          <div className="map-region-bg map-region-bg--south" aria-hidden="true">DORNE</div>
          <div className="map-region-bg map-region-bg--sea" aria-hidden="true">NARROW SEA</div>
        </div>

        {/* Tooltip */}
        {tooltip && (
          <div className="map-tooltip" role="tooltip">
            <p className="map-tooltip-name">{tooltip.name}</p>
            <div className="map-tooltip-divider" />
            <p className="map-tooltip-lore">{tooltip.lore}</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default Map
