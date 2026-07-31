import './App.css'
import Cursor    from './components/Cursor'
import Hero      from './components/Hero'
import Section1  from './components/Section1'
import Characters from './components/Characters'
import Quotes    from './components/Quotes'
import Timeline  from './components/Timeline'
import Map       from './components/Map'
import Footer    from './components/Footer'

function App() {
  return (
    <>
      {/* Custom magnetic cursor */}
      <Cursor />

      {/* 1. Hero — scroll-driven cinematic opener */}
      <main id="main-content">
        <Hero />

        {/* 2. Houses — animated house cards */}
        <Section1 />

        {/* 3. Characters — horizontal scroll */}
        <Characters />

        {/* 4. Quotes — full-screen dramatic reveals */}
        <Quotes />

        {/* 5. Timeline — Westeros history */}
        <Timeline />

        {/* 6. Map — interactive Westeros map */}
        <Map />
      </main>

      {/* 7. Footer */}
      <Footer />
    </>
  )
}

export default App
