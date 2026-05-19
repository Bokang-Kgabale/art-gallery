import { useEffect, useState } from 'react'
import useGalleryStore from '../store/useGalleryStore'

export default function MobileControls() {
  const [isMobile, setIsMobile] = useState(false)
  const setMoveState = useGalleryStore(s => s.setMoveState)
  const selectedArtwork = useGalleryStore(s => s.selectedArtwork)

  useEffect(() => {
    // Detect touch-capable small screens
    const checkMobile = () => setIsMobile(window.matchMedia('(max-width: 1024px) and (hover: none)').matches)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (!isMobile || selectedArtwork) return null

  const handlePointerDown = (dir) => (e) => {
    e.preventDefault()
    e.stopPropagation()
    setMoveState(dir, true)
  }

  const handlePointerUp = (dir) => (e) => {
    e.preventDefault()
    e.stopPropagation()
    setMoveState(dir, false)
  }

  return (
    <div style={{
      position: 'absolute',
      bottom: 30,
      right: 30,
      display: 'grid',
      gridTemplateColumns: '60px 60px 60px',
      gridTemplateRows: '60px 60px 60px',
      gap: 12,
      zIndex: 100,
      opacity: 0.7,
      userSelect: 'none'
    }}
    onContextMenu={(e) => e.preventDefault()}>
      <div style={{ gridColumn: 2, gridRow: 1 }}>
        <ControlButton dir="forward" onDown={handlePointerDown} onUp={handlePointerUp}>↑</ControlButton>
      </div>
      <div style={{ gridColumn: 1, gridRow: 2 }}>
        <ControlButton dir="left" onDown={handlePointerDown} onUp={handlePointerUp}>←</ControlButton>
      </div>
      <div style={{ gridColumn: 2, gridRow: 2 }}>
        <ControlButton dir="backward" onDown={handlePointerDown} onUp={handlePointerUp}>↓</ControlButton>
      </div>
      <div style={{ gridColumn: 3, gridRow: 2 }}>
        <ControlButton dir="right" onDown={handlePointerDown} onUp={handlePointerUp}>→</ControlButton>
      </div>
    </div>
  )
}

function ControlButton({ dir, onDown, onUp, children }) {
  return (
    <button
      onPointerDown={onDown(dir)}
      onPointerUp={onUp(dir)}
      onPointerLeave={onUp(dir)}
      onPointerCancel={onUp(dir)}
      style={{
        width: '100%',
        height: '100%',
        background: 'rgba(255, 255, 255, 0.1)',
        border: '2px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '50%',
        color: '#c8a96e',
        fontSize: 24,
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        touchAction: 'none',
        userSelect: 'none',
        outline: 'none',
        backdropFilter: 'blur(8px)',
        WebkitTapHighlightColor: 'transparent',
        cursor: 'pointer'
      }}
    >
      {children}
    </button>
  )
}
