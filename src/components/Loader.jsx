import React from 'react'
import { useProgress } from '@react-three/drei'

const Loader = () => {
  const { progress, active } = useProgress()

  if (!active && progress >= 100) {
    return null
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at 50% 35%, #161c28 0%, #0a0d14 60%, #040508 100%)',
        color: '#f8fafc',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        transition: 'opacity 0.5s ease',
        pointerEvents: active ? 'auto' : 'none',
        opacity: active ? 1 : 0,
      }}
      aria-live="polite"
      aria-label="Loading 3D Experience"
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.25rem',
          padding: '2.5rem 3.5rem',
          background: 'rgba(255, 255, 255, 0.04)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '1.5rem',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
        }}
      >
        <div style={{ textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '0.85rem', fontWeight: 800, opacity: 0.85 }}>
          WILDRUN / STUDIO
        </div>

        <div
          style={{
            width: '200px',
            height: '4px',
            background: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '2px',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <div
            style={{
              width: `${Math.min(100, Math.max(0, progress))}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #60a5fa, #3b82f6, #93c5fd)',
              borderRadius: '2px',
              transition: 'width 0.2s ease-out',
              boxShadow: '0 0 12px rgba(96, 165, 250, 0.8)',
            }}
          />
        </div>

        <div style={{ fontSize: '1.1rem', fontWeight: 700, letterSpacing: '0.05em', color: '#93c5fd' }}>
          {Math.round(progress)}%
        </div>
      </div>
    </div>
  )
}

export default Loader

