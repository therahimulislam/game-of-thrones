import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './Hero.css'

gsap.registerPlugin(ScrollTrigger)

// ─── Chapter colour palette ───────────────────────────────────────────────────
const CHAPTER_COLORS = [
  'rgba(25, 10, 55, 0.78)',
  'rgba(8, 22, 48, 0.78)',
  'rgba(4, 22, 12, 0.78)',
  'rgba(40, 18, 0, 0.78)',
  'rgba(10, 10, 18, 0.78)',
  'rgba(52, 3, 3, 0.78)',
]

// ─── Chapter snow / ember intensities ────────────────────────────────────────
const CHAPTER_EFFECTS = [
  { snow: 0.35, ember: 0.15 }, // Prologue — light snow, faint embers
  { snow: 1.00, ember: 0.00 }, // Winterfell — full blizzard, no embers
  { snow: 0.20, ember: 0.35 }, // Seven Kingdoms — mixed
  { snow: 0.00, ember: 0.90 }, // King's Landing — intense embers
  { snow: 0.10, ember: 0.60 }, // A Thousand Blades — forge fire
  { snow: 0.00, ember: 1.00 }, // Iron Throne — maximum embers
]

// ─── Cinematic background: snow + embers ─────────────────────────────────────
const CinematicBackground = ({ intensityRef: iRef }) => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // ── Ember factory ──
    const makeEmber = () => ({
      x:          Math.random() * canvas.width,
      y:          canvas.height + 10,
      size:       Math.random() * 1.8 + 0.4,
      speedY:     -(Math.random() * 0.65 + 0.2),
      speedX:     (Math.random() - 0.5) * 0.3,
      opacity:    0,
      maxOpacity: Math.random() * 0.5 + 0.12,
      life:       1,
      decay:      Math.random() * 0.0022 + 0.0007,
      phase:      Math.random() * Math.PI * 2,
    })
    const embers = Array.from({ length: 80 }, () => {
      const p = makeEmber()
      p.y = Math.random() * canvas.height
      return p
    })

    // ── Snow factory ──
    const makeSnow = () => ({
      x:      Math.random() * canvas.width,
      y:      -10,
      r:      Math.random() * 2.8 + 0.6,
      speedY: Math.random() * 1.1 + 0.25,
      speedX: (Math.random() - 0.5) * 0.5,
      op:     Math.random() * 0.55 + 0.3,
      phase:  Math.random() * Math.PI * 2,
      wobble: Math.random() * 0.7 + 0.2,
    })
    const snowflakes = Array.from({ length: 140 }, () => {
      const s = makeSnow()
      s.y = Math.random() * canvas.height
      return s
    })

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const now       = Date.now() * 0.0005
      const emberInt  = iRef?.current?.ember ?? 0.35
      const snowInt   = iRef?.current?.snow  ?? 0.35

      // ── Embers (rise up) ──
      const activeEmbers = Math.floor(embers.length * emberInt)
      embers.slice(0, activeEmbers).forEach((p, i) => {
        p.y      += p.speedY
        p.x      += p.speedX + Math.sin(now + p.phase + i * 0.3) * 0.15
        p.life   -= p.decay
        p.opacity = Math.min(p.maxOpacity, p.opacity + 0.01)
        if (p.life <= 0 || p.y < -20) Object.assign(p, makeEmber())
        ctx.save()
        ctx.globalAlpha = p.opacity * Math.max(0, p.life)
        const r = p.size * 3.5
        const eg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r)
        eg.addColorStop(0,    '#f2d880')
        eg.addColorStop(0.35, '#c9a84c')
        eg.addColorStop(1,    'transparent')
        ctx.fillStyle = eg
        ctx.beginPath()
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })

      // ── Snow (fall down) ──
      const activeSnow = Math.floor(snowflakes.length * snowInt)
      snowflakes.slice(0, activeSnow).forEach((s) => {
        s.y += s.speedY
        s.x += s.speedX + Math.sin(now * 0.55 + s.phase) * s.wobble
        if (s.y > canvas.height + 12) { s.y = -10; s.x = Math.random() * canvas.width }
        if (s.x < -12) s.x = canvas.width + 12
        if (s.x > canvas.width + 12) s.x = -12
        ctx.save()
        ctx.globalAlpha = s.op * snowInt
        const sg = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 2.2)
        sg.addColorStop(0,   'rgba(220, 238, 255, 1)')
        sg.addColorStop(0.5, 'rgba(190, 218, 255, 0.55)')
        sg.addColorStop(1,   'transparent')
        ctx.fillStyle = sg
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r * 2.2, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })

      animId = requestAnimationFrame(tick)
    }

    tick()
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [iRef])

  return (
    <>
      <canvas ref={canvasRef} className="got-ember-canvas" />
      <div className="got-fog-1" />
      <div className="got-fog-2" />
      <div className="got-light-rays">
        <div className="got-ray got-ray-1" />
        <div className="got-ray got-ray-2" />
        <div className="got-ray got-ray-3" />
      </div>
    </>
  )
}

// ─── Chapter data ────────────────────────────────────────────────────────────
const CHAPTERS = [
  {
    id: 'prologue',
    progress: [0, 0.12],
    title: 'The Ancient Chronicles',
    subtitle: 'A SONG OF ICE AND FIRE',
    body: 'In the beginning, there were only the words of the Maesters — secrets sealed within ancient tomes, waiting for a hand brave enough to open them.',
    sigil: '✦',
  },
  {
    id: 'winterfell',
    progress: [0.12, 0.30],
    title: 'The North Remembers',
    subtitle: 'HOUSE STARK — WINTERFELL',
    body: 'Winter is coming. Beyond the ancient walls, the cold whispers of the North carry stories older than the Wall itself.',
    sigil: '⚔',
  },
  {
    id: 'westeros',
    progress: [0.30, 0.52],
    title: 'The Seven Kingdoms',
    subtitle: 'THE REALM OF WESTEROS',
    body: 'From the Eyrie\'s clouded peaks to the red sands of Dorne — seven kingdoms, one throne, a thousand reasons to bleed.',
    sigil: '♜',
  },
  {
    id: 'kings-landing',
    progress: [0.52, 0.70],
    title: 'Where Crowns Are Won',
    subtitle: 'KING\'S LANDING — THE CAPITAL',
    body: 'The city that swallows kings whole. Gold and treachery perfume the air. Every smile here conceals a blade.',
    sigil: '👑',
  },
  {
    id: 'swords',
    progress: [0.70, 0.87],
    title: 'A Thousand Blades',
    subtitle: 'FORGED IN CONQUEST',
    body: 'One thousand swords, surrendered by enemies of Aegon the Conqueror. Melted. Reshaped. Made into something terrible and magnificent.',
    sigil: '⚒',
  },
  {
    id: 'throne',
    progress: [0.87, 1.0],
    title: 'The Iron Throne',
    subtitle: 'WHEN YOU PLAY THE GAME OF THRONES',
    body: 'You win — or you die.',
    sigil: '♔',
  },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────
const lerp = (a, b, t) => a + (b - a) * t
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))
const invlerp = (a, b, v) => clamp((v - a) / (b - a), 0, 1)

// ─── Component ───────────────────────────────────────────────────────────────
const Hero = () => {
  const containerRef  = useRef(null)
  const stickyRef     = useRef(null)
  const videoRef      = useRef(null)
  const overlayRef    = useRef(null)
  const titleRef      = useRef(null)
  const subtitleRef   = useRef(null)
  const bodyRef       = useRef(null)
  const sigilRef      = useRef(null)
  const progressRef   = useRef(null)
  const vignetteRef   = useRef(null)
  const chapterLabelRef = useRef(null)
  const runeBarRef    = useRef(null)
  const colorWashRef  = useRef(null)
  const navRef        = useRef(null)
  const intensityRef  = useRef({ snow: 0.35, ember: 0.15 })

  const [activeChapter, setActiveChapter] = useState(0)
  const [videoReady, setVideoReady]       = useState(false)
  const [videoFailed, setVideoFailed]     = useState(false)
  const [menuOpen, setMenuOpen]           = useState(false)
  const [navScrolled, setNavScrolled]     = useState(false)

  // ─── Chapter transition ───────────────────────────────────────────────────
  const prevChapter = useRef(-1)
  const transitionChapter = (idx) => {
    if (prevChapter.current === idx) return
    prevChapter.current = idx
    setActiveChapter(idx)

    const ch = CHAPTERS[idx]
    const tl = gsap.timeline()

    // fade out old text
    tl.to([titleRef.current, subtitleRef.current, bodyRef.current, sigilRef.current], {
      y: -24, opacity: 0, duration: 0.35, ease: 'power2.in', stagger: 0.04,
    })
    // update DOM mid-fade via callback
    .call(() => {
      if (titleRef.current)    titleRef.current.textContent    = ch.title
      if (subtitleRef.current) subtitleRef.current.textContent = ch.subtitle
      if (bodyRef.current)     bodyRef.current.textContent     = ch.body
      if (sigilRef.current)    sigilRef.current.textContent    = ch.sigil
    })
    // fade in new text
    .fromTo(
      [sigilRef.current, subtitleRef.current, titleRef.current, bodyRef.current],
      { y: 32, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.55, ease: 'power3.out', stagger: 0.07 }
    )

    // chapter colour atmosphere
    if (colorWashRef.current) {
      gsap.to(colorWashRef.current, {
        backgroundColor: CHAPTER_COLORS[idx],
        duration: 1.4,
        ease: 'power2.inOut',
      })
    }

    // chapter snow / ember intensity
    intensityRef.current = CHAPTER_EFFECTS[idx] ?? CHAPTER_EFFECTS[0]

    // chapter label
    if (chapterLabelRef.current) {
      gsap.fromTo(chapterLabelRef.current,
        { opacity: 0, x: 12 },
        { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' }
      )
      chapterLabelRef.current.textContent = `${String(idx + 1).padStart(2, '0')} / ${String(CHAPTERS.length).padStart(2, '0')}`
    }
  }

  // ─── Setup ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const onReady = () => setTimeout(() => setVideoReady(true), 1000)
    const onError = () => {
      setVideoFailed(true)
      setTimeout(() => setVideoReady(true), 500)
    }

    video.addEventListener('loadedmetadata', onReady)
    video.addEventListener('error', onError)
    if (video.readyState >= 1) onReady()

    // Fallback: if video hasn't loaded in 3s, proceed anyway
    const fallbackTimer = setTimeout(() => {
      if (!video.duration) {
        setVideoFailed(true)
        setVideoReady(true)
      }
    }, 3000)

    // Initial chapter text
    const ch0 = CHAPTERS[0]
    if (titleRef.current)    titleRef.current.textContent    = ch0.title
    if (subtitleRef.current) subtitleRef.current.textContent = ch0.subtitle
    if (bodyRef.current)     bodyRef.current.textContent     = ch0.body
    if (sigilRef.current)    sigilRef.current.textContent    = ch0.sigil

    return () => {
      video.removeEventListener('loadedmetadata', onReady)
      video.removeEventListener('error', onError)
      clearTimeout(fallbackTimer)
    }
  }, [])

  // ─── Mouse parallax ──────────────────────────────────────────────────────
  useEffect(() => {
    const sticky = stickyRef.current
    if (!sticky) return

    const fog1    = sticky.querySelector('.got-fog-1')
    const fog2    = sticky.querySelector('.got-fog-2')
    const content = sticky.querySelector('.got-content')
    const corners = sticky.querySelectorAll('.got-corner')

    const onMove = (e) => {
      const cx = (e.clientX / window.innerWidth  - 0.5) * 2
      const cy = (e.clientY / window.innerHeight - 0.5) * 2
      if (fog1)    gsap.to(fog1,    { x: cx * 22, y: cy * 14, duration: 2.2, ease: 'power2.out' })
      if (fog2)    gsap.to(fog2,    { x: cx * -16, y: cy * -10, duration: 2.8, ease: 'power2.out' })
      if (content) gsap.to(content, { x: cx * -7, y: cy * -4, duration: 1.6, ease: 'power3.out' })
      corners.forEach(el => gsap.to(el, { x: cx * 14, y: cy * 9, duration: 2, ease: 'power2.out' }))
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  // ─── Nav glassmorphism on scroll progress ────────────────────────────────
  useEffect(() => {
    if (!videoReady) return
    const trigger = ScrollTrigger.getAll().find(t => t.vars?.pin === stickyRef.current)
    if (!trigger) return
    const unsub = ScrollTrigger.observe({
      target: window,
      type: 'scroll',
      onChangeY: () => setNavScrolled(trigger.progress > 0.02),
    })
    return () => unsub?.kill()
  }, [videoReady])

  // ─── GSAP ScrollTrigger ───────────────────────────────────────────────────
  useEffect(() => {
    if (!videoReady) return

    const video    = videoRef.current
    const duration = (!videoFailed && video.duration) ? video.duration : 1

    // Scroll distance = 5× viewport so we have plenty of room to scrub
    const scrollHeight = window.innerHeight * 6

    // Pin the sticky wrapper
    const pinTrigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start:   'top top',
      end:     `+=${scrollHeight}`,
      pin:     stickyRef.current,
      pinSpacing: true,
      anticipatePin: 1,
    })

    // Main scrub timeline — drives video time + rune bar
    const scrubTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start:   'top top',
        end:     `+=${scrollHeight}`,
        scrub:   1.2,
        onUpdate: (self) => {
          // video scrub (only when video is available)
          if (!videoFailed && video.duration) {
            const t = self.progress * duration
            if (Math.abs(video.currentTime - t) > 0.04) {
              video.currentTime = t
            }
          }

          // progress bar
          if (progressRef.current) {
            progressRef.current.style.width = `${self.progress * 100}%`
          }

          // chapter detection
          const p = self.progress
          const idx = CHAPTERS.findIndex(c => p >= c.progress[0] && p < c.progress[1])
          transitionChapter(idx === -1 ? CHAPTERS.length - 1 : idx)

          // vignette intensity
          const vinInt = 0.55 + Math.sin(p * Math.PI) * 0.2
          if (vignetteRef.current) {
            vignetteRef.current.style.opacity = String(vinInt)
          }
        },
      },
    })

    // Subtle overlay colour shift across scroll
    gsap.to(overlayRef.current, {
      background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.0) 55%)',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: `+=${scrollHeight}`,
        scrub: 2,
      },
    })

    // Rune bar decorative tick animation
    if (runeBarRef.current) {
      const ticks = runeBarRef.current.querySelectorAll('.rune-tick')
      gsap.fromTo(ticks,
        { scaleY: 0, opacity: 0 },
        {
          scaleY: 1, opacity: 1, stagger: 0.06, duration: 0.6, ease: 'elastic.out(1,0.5)',
          scrollTrigger: { trigger: containerRef.current, start: 'top 80%' }
        }
      )
    }

    // Entrance animation
    gsap.fromTo(
      [sigilRef.current, subtitleRef.current, titleRef.current, bodyRef.current],
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.1, ease: 'power3.out', stagger: 0.1, delay: 0.3 }
    )

    return () => {
      scrubTl.kill()
      pinTrigger.kill()
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoReady, videoFailed])

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <>

      {/* ── Loading overlay ── */}
      <div className={`got-loading ${videoReady ? 'hidden' : ''}`}>
        <div className="got-loading-inner">
          <svg className="got-loading-sigil" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="40" cy="40" r="36" stroke="#c9a84c" strokeWidth="0.5" strokeOpacity="0.3"/>
            <circle cx="40" cy="40" r="28" stroke="#c9a84c" strokeWidth="0.5" strokeOpacity="0.2" strokeDasharray="3 5"/>
            <path d="M40 8 L43 28 L40 32 L37 28 Z" fill="none" stroke="#c9a84c" strokeWidth="0.9" strokeOpacity="0.7"/>
            <path d="M40 72 L43 52 L40 48 L37 52 Z" fill="none" stroke="#c9a84c" strokeWidth="0.9" strokeOpacity="0.7"/>
            <path d="M8 40 L28 37 L32 40 L28 43 Z" fill="none" stroke="#c9a84c" strokeWidth="0.9" strokeOpacity="0.7"/>
            <path d="M72 40 L52 37 L48 40 L52 43 Z" fill="none" stroke="#c9a84c" strokeWidth="0.9" strokeOpacity="0.7"/>
            <circle cx="40" cy="40" r="4" fill="#c9a84c" fillOpacity="0.65"/>
            <circle cx="40" cy="40" r="9" fill="none" stroke="#c9a84c" strokeWidth="0.5" strokeOpacity="0.35"/>
          </svg>
          <div className="got-loading-logo">Game of Thrones</div>
          <div className="got-loading-sub">The Chronicles of Westeros</div>
          <div className="got-loading-bar-wrap">
            <div className="got-loading-bar-fill" />
          </div>
        </div>
      </div>

      {/* ── Main scroll container ── */}
      <div
        ref={containerRef}
        className="got-container"
        style={{ height: `${window.innerHeight * 6 + window.innerHeight}px` }}
      >
        {/* ── Sticky viewport ── */}
        <div ref={stickyRef} className="got-sticky">

          {/* Cinematic background (always shown; video overlays if available) */}
          <div ref={colorWashRef} className="got-color-wash" />
          <CinematicBackground intensityRef={intensityRef} />

          {/* Video */}
          <video
            ref={videoRef}
            className="got-video"
            src="/video/one.mp4"
            playsInline
            muted
            preload="auto"
          />

          {/* Layers */}
          <div ref={vignetteRef} className="got-vignette" />
          <div ref={overlayRef}  className="got-overlay" />
          <div className="got-grain" />

          {/* Corner ornaments */}
          {['tl','tr','bl','br'].map(pos => (
            <div key={pos} className={`got-corner got-corner-${pos}`}>
              <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 2 L2 20 M2 2 L20 2" stroke="#c9a84c" strokeWidth="1" strokeOpacity="0.5"/>
                <path d="M2 2 L8 8" stroke="#c9a84c" strokeWidth="0.5" strokeOpacity="0.4"/>
                <rect x="1" y="1" width="4" height="4" fill="none" stroke="#c9a84c" strokeWidth="0.5" strokeOpacity="0.6"/>
              </svg>
            </div>
          ))}

          {/* Nav */}
          <nav ref={navRef} className={`got-nav ${navScrolled ? 'got-nav--scrolled' : ''}`}>
            <div className="got-nav-logo">Game of Thrones</div>
            <ul className="got-nav-links">
              {['The World','Characters','Houses','History'].map(l => (
                <li key={l}><a href="#0">{l}</a></li>
              ))}
            </ul>
            {/* Hamburger (mobile) */}
            <button
              className={`got-hamburger ${menuOpen ? 'got-hamburger--open' : ''}`}
              onClick={() => setMenuOpen(o => !o)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              <span /><span /><span />
            </button>
          </nav>

          {/* Mobile overlay menu */}
          <div className={`got-mobile-menu ${menuOpen ? 'got-mobile-menu--open' : ''}`} role="dialog" aria-modal="true" aria-label="Navigation">
            <button className="got-mobile-menu__close" onClick={() => setMenuOpen(false)} aria-label="Close menu">&times;</button>
            <ul className="got-mobile-menu__links">
              {['The World','Characters','Houses','History','The Map'].map((l, i) => (
                <li key={l} style={{ '--li': i }}>
                  <a href="#0" onClick={() => setMenuOpen(false)}>{l}</a>
                </li>
              ))}
            </ul>
            <p className="got-mobile-menu__motto">When you play the game of thrones —<br />you win, or you die.</p>
          </div>

          {/* Rune bar */}
          <div ref={runeBarRef} className="got-rune-bar">
            {Array.from({ length: 80 }).map((_, i) => (
              <div key={i} className="rune-tick" />
            ))}
          </div>

   
          <div className="got-content">
            <span ref={sigilRef} className="got-sigil" />
            <div className="got-divider">
              <div className="got-divider-line" />
              <div className="got-divider-diamond" />
              <div className="got-divider-line right" />
            </div>
            <span ref={subtitleRef} className="got-subtitle" />
            <h1 ref={titleRef} className="got-title" />
            <p ref={bodyRef} className="got-body" />
            <div className="got-cta-row">
              <button className="got-cta-btn">Begin the Journey</button>
              <button className="got-cta-ghost">Explore the Realm</button>
            </div>
          </div>

         
          <div className="got-right-panel">
            <div ref={chapterLabelRef} className="got-chapter-label">01 / 06</div>
            <div className="got-vert-line" />
            <div className="got-dots">
              {CHAPTERS.map((_, i) => (
                <div
                  key={i}
                  className={`got-dot ${i === activeChapter ? 'active' : ''}`}
                />
              ))}
            </div>
          </div>

          {/* Scroll hint */}
          <div className="got-scroll-hint">
            <span>Scroll</span>
            <div className="arrow" />
          </div>

          {/* Progress bar */}
          <div className="got-progress-bar-wrap">
            <div ref={progressRef} className="got-progress-bar-fill" />
          </div>

        </div>{/* /sticky */}
      </div>{/* /container */}
    </>
  )
}

export default Hero