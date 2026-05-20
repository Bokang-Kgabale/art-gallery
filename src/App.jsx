import { Suspense, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { ACESFilmicToneMapping } from 'three'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Maximize2, Minimize2 } from 'lucide-react'
import { isMobileDevice, requestFullscreenAndLockOrientation, exitFullscreen, isFullscreenActive } from './utils/device'

import GalleryScene from './scenes/GalleryScene'
import ExteriorScene from './scenes/ExteriorScene'
import DynamicSky from './scenes/DynamicSky'
import CameraControls from './components/CameraControls'
import Lighting from './components/Lighting'
import ArtworkInspector from './ui/ArtworkInspector'
import FastTravelMenu from './ui/FastTravelMenu'
import TimeControlPanel from './ui/TimeControlPanel'
import MobileControls from './ui/MobileControls'
import DeviceOrientationPrompt from './ui/DeviceOrientationPrompt'
import useGalleryStore from './store/useGalleryStore'
import { Environment } from '@react-three/drei'
import CreativeLoader from './ui/CreativeLoader'
import ErrorBoundary from './components/ErrorBoundary'

function App() {
  const isMobile = useGalleryStore((s) => s.isMobile)
  const setIsMobile = useGalleryStore((s) => s.setIsMobile)
  const selectedArtwork = useGalleryStore((s) => s.selectedArtwork)
  const clearArtwork = useGalleryStore((s) => s.clearArtwork)
  const hudVisible = useGalleryStore((s) => s.hudVisible)
  const toggleHUD = useGalleryStore((s) => s.toggleHUD)

  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(isMobileDevice())
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [setIsMobile])

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(isFullscreenActive())
    document.addEventListener('fullscreenchange', handleFsChange)
    document.addEventListener('webkitfullscreenchange', handleFsChange)
    document.addEventListener('mozfullscreenchange', handleFsChange)
    document.addEventListener('MSFullscreenChange', handleFsChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange)
      document.removeEventListener('webkitfullscreenchange', handleFsChange)
      document.removeEventListener('mozfullscreenchange', handleFsChange)
      document.removeEventListener('MSFullscreenChange', handleFsChange)
    }
  }, [])

  const handleToggleFullscreen = () => {
    if (isFullscreen) {
      exitFullscreen()
    } else {
      requestFullscreenAndLockOrientation()
    }
  }

  // Global Keyboard Handlers
  useEffect(() => {
    const onKey = (e) => {
      // Ignore if user is inside an input field (safety check)
      if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') return

      if (e.key === 'Escape') {
        clearArtwork()
      } else if (e.key.toLowerCase() === 'h') {
        toggleHUD()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [clearArtwork, toggleHUD])

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#0a090a' }}>
      {/* ── Main 3-D Canvas ─────────────────────────────────────────── */}
      <ErrorBoundary>
        <Canvas
          shadows
          // Camera starts OUTSIDE the building looking at the gallery entrance
          camera={{ position: [8, 2.2, 18], fov: 70 }}
          gl={{
            antialias: true,
            toneMapping: ACESFilmicToneMapping,
            toneMappingExposure: 1.05,
          }}
        >
          <Suspense fallback={null}>
            {/* Sky with procedural sun that moves over time */}
            <DynamicSky />

            {/* Environment map for high-fidelity PBR reflections */}
            <Environment preset="sunset" />

            {/* Warm dusty haze — mountains at 150-190m fade into it */}
            <fog attach="fog" args={['#ccc4aa', 70, 220]} />

            {/* Interior gallery accent lights */}
            <Lighting />

            {/* Camera navigation + cinematic dolly hook */}
            <CameraControls />

            {/* Outdoor terrain, dunes, trees, concrete pad */}
            <ExteriorScene />

            {/* Brutalist gallery building + artworks */}
            <GalleryScene />

            {/* Postprocessing */}
            <EffectComposer multisampling={4}>
              <Bloom
                luminanceThreshold={0.85}
                luminanceSmoothing={0.9}
                intensity={0.2}
                radius={0.6}
              />
              <ChromaticAberration
                blendFunction={BlendFunction.NORMAL}
                offset={[0.0003, 0.0003]}
              />
              <Vignette offset={0.25} darkness={0.45} eskil={false} />
            </EffectComposer>
          </Suspense>
        </Canvas>
      </ErrorBoundary>

      {/* ── Top Central HUD Controls Row ─────────── */}
      <motion.div
        animate={{
          y: selectedArtwork ? -100 : 0,
          opacity: selectedArtwork ? 0 : 1
        }}
        transition={{ duration: 0.4 }}
        style={{
          position: 'absolute',
          top: isMobile ? 16 : 28,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 101,
          display: 'flex',
          alignItems: 'center',
          gap: '0px',
          pointerEvents: selectedArtwork ? 'none' : 'auto',
        }}
      >
        {/* Master HUD Toggle Button */}
        <button
          onClick={toggleHUD}
          style={{
            background: hudVisible ? 'rgba(0, 0, 0, 0.65)' : 'rgba(200, 169, 110, 0.9)',
            backdropFilter: 'blur(8px)',
            color: hudVisible ? 'rgba(255, 255, 255, 0.9)' : '#0f0e0f',
            border: hudVisible ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(200, 169, 110, 1)',
            padding: isMobile ? '8px 16px' : '10px 20px',
            borderRadius: '24px',
            cursor: 'pointer',
            fontSize: '11px',
            fontWeight: '700',
            letterSpacing: '1.5px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
            outline: 'none',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = hudVisible ? 'rgba(200, 169, 110, 0.25)' : 'rgba(200, 169, 110, 1)'
            e.currentTarget.style.color = hudVisible ? '#c8a96e' : '#000'
            e.currentTarget.style.borderColor = '#c8a96e'
            e.currentTarget.style.boxShadow = '0 6px 25px rgba(200, 169, 110, 0.25)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = hudVisible ? 'rgba(0, 0, 0, 0.65)' : 'rgba(200, 169, 110, 0.9)'
            e.currentTarget.style.color = hudVisible ? 'rgba(255, 255, 255, 0.9)' : '#0f0e0f'
            e.currentTarget.style.borderColor = hudVisible ? 'rgba(255, 255, 255, 0.12)' : 'rgba(200, 169, 110, 1)'
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)'
          }}
        >
          {hudVisible ? <Eye size={16} /> : <EyeOff size={16} />}
          <span>{hudVisible ? 'HIDE UI' : 'SHOW UI'}</span>
        </button>

        {/* Fullscreen Toggle Button */}
        <motion.button
          onClick={handleToggleFullscreen}
          initial={{ opacity: 0, scale: 0, y: '-50%' }}
          animate={{
            opacity: hudVisible ? 1 : 0,
            scale: hudVisible ? 1 : 0,
            y: '-50%',
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            left: 'calc(100% + 12px)',
            top: '50%',
            background: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(8px)',
            color: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            width: isMobile ? '36px' : '40px',
            height: isMobile ? '36px' : '40px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
            outline: 'none',
            overflow: 'hidden',
            pointerEvents: hudVisible ? 'auto' : 'none',
          }}
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(200, 169, 110, 0.25)'
            e.currentTarget.style.color = '#c8a96e'
            e.currentTarget.style.borderColor = '#c8a96e'
            e.currentTarget.style.boxShadow = '0 6px 25px rgba(200, 169, 110, 0.25)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.65)'
            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)'
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)'
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </div>
        </motion.button>
      </motion.div>

      <motion.div
        animate={{ opacity: (selectedArtwork || !hudVisible) ? 0 : 1 }}
        transition={{ duration: 0.4 }}
        style={{
          pointerEvents: (selectedArtwork || !hudVisible) ? 'none' : 'auto',
          position: 'absolute',
          bottom: isMobile ? 16 : 28,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.65)',
          backdropFilter: 'blur(8px)',
          color: 'rgba(255,255,255,0.8)',
          padding: isMobile ? '8px 16px' : '10px 22px',
          borderRadius: 8,
          textAlign: 'center',
          fontSize: isMobile ? 10 : 12,
          border: '1px solid rgba(255,255,255,0.07)',
          letterSpacing: '0.5px',
          zIndex: 100,
          whiteSpace: 'nowrap',
          maxWidth: '90vw',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}
      >
        {isMobile ? (
          <>
            <span style={{ color: '#c8a96e', fontWeight: 600, marginRight: 6 }}>Touch Controls:</span>
            Drag screen to look &nbsp;|&nbsp; Joystick to walk &nbsp;|&nbsp; Tap artwork to inspect
          </>
        ) : (
          <>
            <span style={{ color: '#c8a96e', fontWeight: 600, marginRight: 8 }}>Navigate:</span>
            W A S D — Move &nbsp;|&nbsp; Mouse — Look around &nbsp;|&nbsp;
            <span style={{ color: '#c8a96e', marginLeft: 8 }}>Click artwork</span> — Inspect &amp; Rotate &nbsp;|&nbsp;
            <span style={{ color: '#c8a96e', marginLeft: 8 }}>H</span> — Toggle UI &nbsp;|&nbsp; ESC — Close
          </>
        )}
      </motion.div>

      {/* ── Tomb Raider–style 3-D artwork inspector ─────────── */}
      <ArtworkInspector />
      
      {/* ── Fast Travel Menu ─────────── */}
      <FastTravelMenu />

      {/* ── Time of Day HUD Controls ─────────── */}
      <TimeControlPanel />

      {/* ── Mobile UI ─────────── */}
      <MobileControls />
      <DeviceOrientationPrompt />

      {/* ── Loading Screen ─────────── */}
      <CreativeLoader />
    </div>
  )
}

export default App
