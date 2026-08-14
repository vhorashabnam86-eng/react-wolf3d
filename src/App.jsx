import { useState, useEffect, Suspense } from 'react'
import Deer from './components/Deer'
import Loader from './components/Loader'
import ErrorBoundary from './components/ErrorBoundary'
import './App.css'
import { Canvas } from '@react-three/fiber'

const STUDIO_THEMES = {
  dark: {
    name: 'Lacoste Dark Glow',
    bg: 'radial-gradient(ellipse at 50% 35%, #232938 0%, #10141e 50%, #06080d 100%)',
    textColor: '#f8fafc',
    secondaryTextColor: 'rgba(248, 250, 252, 0.75)',
    accentLine: 'rgba(255, 0, 0, 0.396)',
    toggleBg: 'rgba(125, 125, 125, 0.15)',
    toggleBorder: 'rgba(255, 255, 255, 0.2)',
    activeToggleBg: 'rgba(255, 255, 255, 0.95)',
    activeToggleColor: '#0f172a',
    svgFill: '#ffffff'
  },
  light: {
    name: 'Warm Heritage Light',
    bg: 'radial-gradient(ellipse at 50% 40%, #FFFDF7 0%, #F5F1E6 55%, #EEE8D8 100%)',
    textColor: '#24321F',
    secondaryTextColor: '#36432D',
    accentLine: 'rgba(200, 155, 60, 0.45)',
    toggleBg: '#EEE8D8',
    toggleBorder: 'rgba(74, 90, 50, 0.2)',
    activeToggleBg: '#FFFDF7',
    activeToggleColor: '#24321F',
    svgFill: '#24321F'
  },
  gold: {
    name: 'Warm Heritage Light',
    bg: 'radial-gradient(ellipse at 50% 35%, #3d3228 0%, #1a1410 50%, #0a0705 100%)',
    textColor: '#faf5f0',
    secondaryTextColor: 'rgba(250, 245, 240, 0.75)',
    accentLine: 'rgba(200, 155, 60, 0.35)',
    toggleBg: 'rgba(125, 125, 125, 0.15)',
    toggleBorder: 'rgba(255, 255, 255, 0.2)',
    activeToggleBg: 'rgba(255, 255, 255, 0.95)',
    activeToggleColor: '#1a1410',
    svgFill: '#faf5f0'
  }
}

function App() {
  const [activeTheme, setActiveTheme] = useState(() => {
    return localStorage.getItem('studio_theme') || 'dark'
  })
  const currentTheme = STUDIO_THEMES[activeTheme]

  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }
    window.scrollTo(0, 0)

    const handleBeforeUnload = () => {
      window.scrollTo(0, 0)
    }
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])

  const handleThemeChange = (key) => {
    setActiveTheme(key)
    localStorage.setItem('studio_theme', key)
  }

  return (
    <ErrorBoundary>
      <Loader />
      <main style={{ color: currentTheme.textColor, transition: 'color 0.4s ease' }} role="main">
        <Canvas
          dpr={[1, Math.min(window.devicePixelRatio || 1, 1.5)]}
          gl={{ powerPreference: 'high-performance', antialias: true, alpha: true }}
          style={{
            height: "100vh",
            width: "100vw",
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 1,
            background: currentTheme.bg,
            transition: 'background 0.5s ease',
          }}
          aria-label="3D Wild Nature Interactive Canvas"
        >
          <Suspense fallback={null}>
            <Deer activeTheme={activeTheme} />
          </Suspense>
        </Canvas>
          <section id='section-1' aria-label="Hero Section">
            <nav role="navigation" aria-label="Main Navigation">
              <div className="nav-elem" style={{ fontWeight: 900, fontSize: '1.2rem', lineHeight: '1.15', letterSpacing: '0.04em', textTransform: 'uppercase', color: currentTheme.textColor }}>
                WILDRUN <br />
                <span style={{ fontSize: '0.85rem', opacity: 0.8, fontWeight: 700 }}>/ STUDIO.</span>
              </div>
              
              {/* Studio Lighting Theme Switcher */}
              <div
                className="nav-elem theme-switcher"
                role="group"
                aria-label="Theme Switcher"
                style={{
                  background: currentTheme.toggleBg,
                  borderColor: currentTheme.toggleBorder
                }}
              >
                {Object.keys(STUDIO_THEMES).map((key) => (
                  <button
                    key={key}
                    onClick={() => handleThemeChange(key)}
                    className={activeTheme === key ? 'active' : ''}
                    title={`Switch to ${STUDIO_THEMES[key].name}`}
                    aria-pressed={activeTheme === key}
                    style={activeTheme === key ? {
                      background: currentTheme.activeToggleBg,
                      color: currentTheme.activeToggleColor,
                      boxShadow: activeTheme === 'light' ? '0 4px 14px rgba(36, 50, 31, 0.12)' : '0 4px 14px rgba(0, 0, 0, 0.2)'
                    } : {
                      color: currentTheme.textColor
                    }}
                  >
                    {key === 'light' ? '☀️ Light' : key === 'dark' ? '🌙 Dark' : '✨ Gold'}
                  </button>
                ))}
              </div>

              <div className="nav-elem" tabIndex={0} role="button" aria-label="Menu Toggle" style={{ color: currentTheme.textColor }}>
                <i className="ri-menu-3-line" aria-hidden="true"></i>
              </div>
            </nav>
            <div className="middle">
              <div className="left">
                <h1 style={{ color: currentTheme.textColor }}>RUN <br /> WITH <br /> WONDER</h1>
              </div>
              <div className="right"></div>
            </div>
            <div className="bottom">
              <div className="left"></div>
              <div className="right">
                <p style={{ color: currentTheme.secondaryTextColor || 'inherit', fontWeight: 500 }}>
                  Wildrun is a creative studio <br />
                  inspired by nature, movement, <br />
                  and wonder.
                </p>
              </div>
            </div>

            <div className="first-line" style={{ backgroundColor: currentTheme.accentLine }} aria-hidden="true"></div>
            <div className="second-line" style={{ backgroundColor: currentTheme.accentLine }} aria-hidden="true"></div>

          </section>
          <section id='section-2' aria-label="Projects Section"></section>
          <section id='section-3' aria-label="Footer Section"></section>

        </main>
    </ErrorBoundary>
  )
}

export default App

