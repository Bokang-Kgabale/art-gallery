import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import useGalleryStore from '../store/useGalleryStore'

export default function MobileControls() {
  const isMobile = useGalleryStore(s => s.isMobile)
  const setMoveState = useGalleryStore(s => s.setMoveState)
  const moveState = useGalleryStore(s => s.moveState)
  const selectedArtwork = useGalleryStore(s => s.selectedArtwork)
  const timePanelExpanded = useGalleryStore(s => s.timePanelExpanded)

  if (!isMobile) return null

  const showControls = !selectedArtwork && !timePanelExpanded

  const handlePointerDown = (dir) => (e) => {
    e.preventDefault()
    // Reset all other directions to clear any stuck keys
    Object.keys(moveState).forEach((key) => {
      if (key !== dir && moveState[key]) {
        setMoveState(key, false)
      }
    })
    setMoveState(dir, true)
  }

  const handlePointerUp = (dir) => (e) => {
    e.preventDefault()
    setMoveState(dir, false)
  }

  return (
    <motion.div
      animate={{
        opacity: showControls ? 0.7 : 0,
        scale: showControls ? 1 : 0.8,
        y: showControls ? 0 : 20,
      }}
      transition={{ duration: 0.3 }}
      style={{
        position: 'absolute',
        bottom: 30,
        right: 30,
        display: 'grid',
        gridTemplateColumns: '60px 60px 60px',
        gridTemplateRows: '60px 60px 60px',
        gap: 12,
        zIndex: 100,
        pointerEvents: showControls ? 'auto' : 'none',
        userSelect: 'none'
      }}
      onContextMenu={(e) => e.preventDefault()}
    >
      <div style={{ gridColumn: 2, gridRow: 1 }}>
        <ControlButton dir="forward" active={moveState.forward} onDown={handlePointerDown} onUp={handlePointerUp}>↑</ControlButton>
      </div>
      <div style={{ gridColumn: 1, gridRow: 2 }}>
        <ControlButton dir="left" active={moveState.left} onDown={handlePointerDown} onUp={handlePointerUp}>←</ControlButton>
      </div>
      <div style={{ gridColumn: 2, gridRow: 2 }}>
        <ControlButton dir="backward" active={moveState.backward} onDown={handlePointerDown} onUp={handlePointerUp}>↓</ControlButton>
      </div>
      <div style={{ gridColumn: 3, gridRow: 2 }}>
        <ControlButton dir="right" active={moveState.right} onDown={handlePointerDown} onUp={handlePointerUp}>→</ControlButton>
      </div>
    </motion.div>
  )
}

function ControlButton({ dir, active, onDown, onUp, children }) {
  return (
    <motion.button
      onPointerDown={onDown(dir)}
      onPointerUp={onUp(dir)}
      onPointerLeave={onUp(dir)}
      onPointerCancel={onUp(dir)}
      animate={active ? {
        scale: 0.88,
        backgroundColor: 'rgba(200, 169, 110, 0.35)',
        borderColor: 'rgba(200, 169, 110, 0.8)',
        color: '#ffffff',
        boxShadow: '0 0 15px rgba(200, 169, 110, 0.3)'
      } : {
        scale: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        color: '#c8a96e',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)'
      }}
      transition={{ type: 'spring', stiffness: 500, damping: 15 }}
      style={{
        width: '100%',
        height: '100%',
        borderRadius: '50%',
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
    </motion.button>
  )
}
