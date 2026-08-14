import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    if (process.env.NODE_ENV !== 'production') {
      console.error("ErrorBoundary caught an error:", error, errorInfo)
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0a0d14',
            color: '#f8fafc',
            textAlign: 'center',
            padding: '2rem',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>3D Scene Error</h2>
          <p style={{ opacity: 0.8, maxWidth: '400px', marginBottom: '1.5rem' }}>
            We encountered a temporary WebGL rendering issue. Please reload to restore the wild nature experience.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '2rem',
              border: 'none',
              background: '#3b82f6',
              color: '#ffffff',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Reload Experience
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
