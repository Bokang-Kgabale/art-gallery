import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { ACESFilmicToneMapping } from 'three'
import GalleryScene from './scenes/GalleryScene'
import CameraControls from './components/CameraControls'
import Lighting from './components/Lighting'
import ProjectModal from './ui/ProjectModal'

function App() {
  const [selectedArtwork, setSelectedArtwork] = useState(null)

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas
        shadows
        camera={{ position: [0, 1.6, 4], fov: 75 }}
        gl={{
          antialias: true,
          toneMapping: ACESFilmicToneMapping,
          toneMappingExposure: 1,
        }}
      >
        {/* Environment & Lighting */}
        <Environment preset="warehouse" background={false} />
        <fog attach="fog" args={['#1a1a1a', 10, 30]} />
        <Lighting />

        {/* Custom Controls with WASD movement */}
        <CameraControls />

        {/* Scene */}
        <GalleryScene onArtworkSelect={setSelectedArtwork} />

        {/* Postprocessing Effects per ARCH.md */}
        <EffectComposer multisampling={4}>
          <Bloom
            luminanceThreshold={0.9}
            luminanceSmoothing={0.9}
            intensity={0.15}
            radius={0.5}
          />
          <ChromaticAberration
            blendFunction={BlendFunction.NORMAL}
            offset={[0.0003, 0.0003]}
          />
          <Vignette
            offset={0.3}
            darkness={0.5}
            eskil={false}
          />
        </EffectComposer>
      </Canvas>

      {/* UI Overlay */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        padding: '15px 25px',
        borderRadius: '8px',
        textAlign: 'center',
        fontSize: '14px',
        zIndex: 100,
      }}>
        <p style={{ margin: '5px 0' }}><strong style={{ color: '#ffd700' }}>Controls:</strong></p>
        <p style={{ margin: '5px 0' }}>Mouse: Look around | W/A/S/D: Move | Click: View artwork info</p>
      </div>

      {/* Project Modal */}
      <ProjectModal artwork={selectedArtwork} onClose={() => setSelectedArtwork(null)} />
    </div>
  )
}

export default App
