import { useEffect, useState } from 'react'
import useGalleryStore from '../store/useGalleryStore'
import { requestFullscreenAndLockOrientation } from '../utils/device'

export default function DeviceOrientationPrompt() {
  const isMobile = useGalleryStore((s) => s.isMobile)
  const [isPortrait, setIsPortrait] = useState(false)

  useEffect(() => {
    const checkOrientation = () => {
      setIsPortrait(window.matchMedia('(orientation: portrait)').matches)
    }

    checkOrientation()
    window.addEventListener('resize', checkOrientation)
    window.addEventListener('orientationchange', checkOrientation)
    if (window.screen && window.screen.orientation) {
      window.screen.orientation.addEventListener('change', checkOrientation)
    }

    return () => {
      window.removeEventListener('resize', checkOrientation)
      window.removeEventListener('orientationchange', checkOrientation)
      if (window.screen && window.screen.orientation) {
        window.screen.orientation.removeEventListener('change', checkOrientation)
      }
    }
  }, [])

  const showPrompt = isMobile && isPortrait

  if (!showPrompt) return null

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      background: 'rgba(10, 9, 10, 0.98)',
      zIndex: 99999,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      textAlign: 'center',
      padding: 30,
      backdropFilter: 'blur(10px)'
    }}>
      <div style={{
        width: 70,
        height: 120,
        border: '4px solid #c8a96e',
        borderRadius: 12,
        position: 'relative',
        animation: 'rotateDevice 2.5s infinite ease-in-out',
        marginBottom: 32
      }}>
        <div style={{
          position: 'absolute',
          bottom: 6,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 24,
          height: 4,
          background: '#c8a96e',
          borderRadius: 2
        }} />
      </div>
      <h2 style={{ fontSize: 28, marginBottom: 16, fontWeight: 300, color: '#c8a96e', letterSpacing: '1px' }}>Please Rotate Device</h2>
      <p style={{ fontSize: 16, lineHeight: 1.6, opacity: 0.8, maxWidth: 320, letterSpacing: '0.5px', marginBottom: 32 }}>
        For the best immersive experience, please enable auto-rotate and view this gallery in landscape mode.
      </p>

      {/* Premium Lock Orientation Button */}
      <button
        onClick={requestFullscreenAndLockOrientation}
        style={{
          background: 'rgba(200, 169, 110, 0.95)',
          border: '1px solid rgba(200, 169, 110, 1)',
          color: '#0a090a',
          padding: '12px 32px',
          borderRadius: '30px',
          fontSize: '11px',
          fontWeight: '800',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          cursor: 'pointer',
          boxShadow: '0 10px 30px rgba(200, 169, 110, 0.3)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          outline: 'none',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#ffffff'
          e.currentTarget.style.borderColor = '#ffffff'
          e.currentTarget.style.boxShadow = '0 15px 40px rgba(255, 255, 255, 0.3)'
          e.currentTarget.style.transform = 'translateY(-2px)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(200, 169, 110, 0.95)'
          e.currentTarget.style.borderColor = 'rgba(200, 169, 110, 1)'
          e.currentTarget.style.boxShadow = '0 10px 30px rgba(200, 169, 110, 0.3)'
          e.currentTarget.style.transform = 'translateY(0)'
        }}
      >
        Lock to Landscape
      </button>

      <style>{`
        @keyframes rotateDevice {
          0% { transform: rotate(0deg); }
          40% { transform: rotate(-90deg); }
          60% { transform: rotate(-90deg); }
          100% { transform: rotate(0deg); }
        }
      `}</style>
    </div>
  )
}
