import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    // We can log the error to an error reporting service here
    console.error('Gallery Engine Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }
      return (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          background: '#0a090a', color: '#ff4444', fontFamily: 'monospace', padding: '20px', textAlign: 'center', zIndex: 999999
        }}>
          <div style={{ border: '1px solid rgba(255, 68, 68, 0.3)', padding: '40px', borderRadius: '8px', background: 'rgba(255, 68, 68, 0.05)', maxWidth: '600px' }}>
            <h2 style={{ fontSize: '18px', letterSpacing: '2px', marginBottom: '16px', color: '#ff5555' }}>SYSTEM CRASH DETECTED</h2>
            <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '24px', lineHeight: 1.6 }}>
              A critical failure occurred while rendering the virtual gallery. This may be due to missing textures, unsupported WebGL features on your device, or a 3D asset failing to load.
            </p>
            <div style={{ 
              background: 'rgba(0,0,0,0.5)', padding: '12px', borderRadius: '4px', textAlign: 'left', 
              color: '#ff8888', fontSize: '11px', overflow: 'auto', maxHeight: '150px', marginBottom: '24px',
              borderLeft: '3px solid #ff4444'
            }}>
              <code>{this.state.error?.message || "Unknown rendering exception"}</code>
            </div>
            <button 
              onClick={() => window.location.reload()}
              style={{
                padding: '12px 24px', background: 'rgba(255, 68, 68, 0.1)', border: '1px solid #ff4444', 
                color: '#ff4444', cursor: 'pointer', fontSize: '11px', letterSpacing: '2px', fontWeight: 'bold',
                textTransform: 'uppercase', borderRadius: '4px', transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 68, 68, 0.2)'
                e.currentTarget.style.boxShadow = '0 0 15px rgba(255, 68, 68, 0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 68, 68, 0.1)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              Reboot System
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
