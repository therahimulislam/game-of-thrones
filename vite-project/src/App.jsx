import './App.css'
import Cursor         from './components/Cursor'
import Hero           from './components/Hero'
import Section1       from './components/Section1'
import Characters     from './components/Characters'
import Quotes         from './components/Quotes'
import Timeline       from './components/Timeline'
import Map            from './components/Map'
import Footer         from './components/Footer'
import SectionDivider from './components/SectionDivider'

function App() {
  return (
    <>
      {/* Custom magnetic cursor */}
      <Cursor />

      <main id="main-content">
        {/* 1. Hero — cinematic scroll-driven opener with snow + embers */}
        <Hero />

        {/* 2. Houses — animated card grid */}
        <SectionDivider glyph="✦ THE GREAT HOUSES ✦" />
        <Section1 />

        {/* 3. Characters — horizontal scroll showcase */}
        <SectionDivider glyph="✦ CHARACTERS ✦" />
        <Characters />

        {/* 4. Quotes — full-screen word reveals */}
        <SectionDivider glyph="✦ WORDS OF THE REALM ✦" />
        <Quotes />

        {/* 5. Timeline — Westeros history */}
        <SectionDivider glyph="✦ A HISTORY OF BLOOD ✦" />
        <Timeline />

        {/* 6. Map — interactive Westeros */}
        <SectionDivider glyph="✦ THE KNOWN WORLD ✦" />
        <Map />
      </main>

      {/* 7. Footer */}
      <Footer />
    </>
  )
}

export default App
