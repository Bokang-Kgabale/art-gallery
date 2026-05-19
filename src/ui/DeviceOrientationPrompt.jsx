import { useEffect, useState } from 'react'

export default function DeviceOrientationPrompt() {
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    const checkOrientation = () => {
      // Check if device is a touch screen (phone/tablet) and in portrait mode
      const isMobile = window.matchMedia('(max-width: 1024px) and (hover: none)').matches
      const isPortrait = window.matchMedia('(orientation: portrait)').matches
      setShowPrompt(isMobile && isPortrait)
    }

    checkOrientation()
    window.addEventListener('resize', checkOrientation)
    return () => window.removeEventListener('resize', checkOrientation)
  }, [])

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
      <p style={{ fontSize: 16, lineHeight: 1.6, opacity: 0.8, maxWidth: 320, letterSpacing: '0.5px' }}>
        For the best immersive experience, please enable auto-rotate and view this gallery in landscape mode.
      </p>

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
