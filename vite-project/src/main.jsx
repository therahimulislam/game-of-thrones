import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './index.css'
import App from './App.jsx'

gsap.registerPlugin(ScrollTrigger)

// ── Lenis smooth scroll ────────────────────────────────────────────────────
const lenis = new Lenis({
  duration: 1.3,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  wheelMultiplier: 0.9,
  touchMultiplier: 1.5,
})

// Connect Lenis to GSAP ScrollTrigger
lenis.on('scroll', ScrollTrigger.update)

// ── Level 4: Scroll Velocity Distortion ──────────────────────────────────────
let proxy = { skew: 0 },
    skewSetter = gsap.quickSetter(document.body, '--skew', 'deg'),
    clamp = gsap.utils.clamp(-8, 8) // max skew 8 degrees

lenis.on('scroll', (e) => {
  const velocity = e.velocity * 0.4
  
  if (Math.abs(velocity) > Math.abs(proxy.skew)) {
    proxy.skew = velocity
    gsap.to(proxy, {
      skew: 0,
      duration: 0.8,
      ease: 'power3',
      overwrite: true,
      onUpdate: () => skewSetter(clamp(proxy.skew))
    })
  }
})

gsap.ticker.add((time) => lenis.raf(time * 1000))
gsap.ticker.lagSmoothing(0)

// Export lenis so components can use it
export { lenis }

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
