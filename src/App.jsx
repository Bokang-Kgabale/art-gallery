import { Suspense, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { ACESFilmicToneMapping } from 'three'
import { motion } from 'framer-motion'

import GalleryScene from './scenes/GalleryScene'
import ExteriorScene from './scenes/ExteriorScene'
import DynamicSky from './scenes/DynamicSky'
import CameraControls from './components/CameraControls'
import Lighting from './components/Lighting'
import ArtworkInspector from './ui/ArtworkInspector'
import FastTravelMenu from './ui/FastTravelMenu'
import useGalleryStore from './store/useGalleryStore'
import { Loader } from '@react-three/drei'

function App() {
  const selectedArtwork = useGalleryStore((s) => s.selectedArtwork)
  const clearArtwork = useGalleryStore((s) => s.clearArtwork)

  // Global ESC handler
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') clearArtwork() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [clearArtwork])

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#0a090a' }}>
      {/* ── Main 3-D Canvas ─────────────────────────────────────────── */}
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
          <DynamicSky timeScale={40} startHour={9} />

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

      {/* ── Controls HUD — fades when artwork selected ─────────── */}
      <motion.div
        animate={{ opacity: selectedArtwork ? 0 : 1 }}
        transition={{ duration: 0.4 }}
        style={{
          pointerEvents: 'none',
          position: 'absolute',
          bottom: 28,
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(8px)',
          color: 'rgba(255,255,255,0.8)',
          padding: '10px 22px',
          borderRadius: 8,
          textAlign: 'center',
          fontSize: 12,
          border: '1px solid rgba(255,255,255,0.07)',
          letterSpacing: '0.5px',
          zIndex: 100,
          whiteSpace: 'nowrap',
        }}
      >
        <span style={{ color: '#c8a96e', fontWeight: 600, marginRight: 8 }}>Navigate:</span>
        W A S D — Move &nbsp;|&nbsp; Mouse — Look around &nbsp;|&nbsp;
        <span style={{ color: '#c8a96e', marginLeft: 8 }}>Click artwork</span> — Inspect &amp; Rotate &nbsp;|&nbsp; ESC — Close
      </motion.div>

      {/* ── Tomb Raider–style 3-D artwork inspector ─────────── */}
      <ArtworkInspector />
      
      {/* ── Fast Travel Menu ─────────── */}
      <FastTravelMenu />

      {/* ── Loading Screen ─────────── */}
      <Loader
        containerStyles={{ background: '#0a090a' }}
        innerStyles={{ width: '300px' }}
        barStyles={{ background: '#c8a96e' }}
        dataStyles={{ color: '#c8a96e', fontFamily: 'monospace', letterSpacing: '2px', fontSize: '13px' }}
      />
    </div>
  )
}

export default App
