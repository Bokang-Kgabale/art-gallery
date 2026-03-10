import { useState, useRef } from 'react'
import { useLoader, useFrame } from '@react-three/fiber'
import { TextureLoader } from 'three'
import * as THREE from 'three'
import useGalleryStore from '../store/useGalleryStore'

/**
 * Computes a camera dolly position that sits ~1.5 m in front of
 * the artwork, at eye level, facing toward it.
 */
function getDollyTarget(wall, worldPosition) {
  const dollyDistance = 1.5 // metres in front of the piece

  // The camera should land at eye level (y=1.6) in front of the art
  const camY = 1.6
  let camX = worldPosition[0]
  let camZ = worldPosition[2]
  let lookX = worldPosition[0]
  let lookZ = worldPosition[2]

  switch (wall) {
    case 'north':
      camZ = worldPosition[2] + dollyDistance
      lookZ = worldPosition[2]
      break
    case 'south':
      camZ = worldPosition[2] - dollyDistance
      lookZ = worldPosition[2]
      break
    case 'east':
      camX = worldPosition[0] - dollyDistance
      lookX = worldPosition[0]
      break
    case 'west':
      camX = worldPosition[0] + dollyDistance
      lookX = worldPosition[0]
      break
  }

  return {
    cameraPosition: [camX, camY, camZ],
    cameraLookAt: [lookX, worldPosition[1], lookZ],
  }
}

export default function GalleryArt({ artwork }) {
  const [hovered, setHovered] = useState(false)
  const meshRef = useRef()
  const frameRef = useRef()
  const groupRef = useRef()

  const selectArtwork = useGalleryStore((s) => s.selectArtwork)
  const selectedArtwork = useGalleryStore((s) => s.selectedArtwork)
  const isSelected = selectedArtwork?.id === artwork.id

  // Load artwork texture
  const texture = useLoader(TextureLoader, artwork.image)

  // ─── Position helpers (same as before) ───────────────────────────────────
  const wallOffset = 4.8
  const spacing = 2.5
  const offset = (artwork.position - 0.5) * spacing
  const height = 1.5

  const positions = {
    north: [offset, height, -wallOffset],
    south: [-offset, height, wallOffset],
    east: [wallOffset, height, offset],
    west: [-wallOffset, height, -offset],
  }

  const rotations = {
    north: [0, 0, 0],
    south: [0, Math.PI, 0],
    east: [0, -Math.PI / 2, 0],
    west: [0, Math.PI / 2, 0],
  }

  const position = positions[artwork.wall] ?? [0, height, 0]
  const rotation = rotations[artwork.wall] ?? [0, 0, 0]

  // ─── Hover / selection animations (R3F render loop) ──────────────────────
  useFrame(() => {
    if (!meshRef.current) return

    const targetScale = hovered && !isSelected ? 1.05 : 1.0
    const targetEmissive = hovered || isSelected ? 0.18 : 0

    meshRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.1
    )

    if (meshRef.current.material?.emissive) {
      const currentHex = meshRef.current.material.emissive.getHex()
      const targetHex = Math.round(targetEmissive * 0xffffff)
      meshRef.current.material.emissive.setHex(
        Math.round(THREE.MathUtils.lerp(currentHex, targetHex, 0.1))
      )
    }
  })

  // ─── Click handler ────────────────────────────────────────────────────────
  const handleClick = (e) => {
    e.stopPropagation()

    // GalleryScene root group is at position [-10, 0, -9]
    // So artwork world position = local position + group offset
    const SCENE_OFFSET = [-10, 0, -9]
    const worldPos = [
      position[0] + SCENE_OFFSET[0],
      position[1] + SCENE_OFFSET[1],
      position[2] + SCENE_OFFSET[2],
    ]

    const { cameraPosition, cameraLookAt } = getDollyTarget(artwork.wall, worldPos)
    selectArtwork(artwork, cameraPosition, cameraLookAt)
  }

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {/* Outer frame */}
      <mesh ref={frameRef} position={[0, 0, -0.015]} receiveShadow>
        <planeGeometry args={[1.35, 1.35]} />
        <meshStandardMaterial
          color={isSelected ? '#c8a96e' : '#2c2c2c'}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>

      {/* Artwork surface */}
      <mesh
        ref={meshRef}
        castShadow
        receiveShadow
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={(e) => {
          e.stopPropagation()
          setHovered(false)
          document.body.style.cursor = 'default'
        }}
        onClick={handleClick}
      >
        <planeGeometry args={[1.2, 1.2]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.5}
          metalness={0.1}
          emissive="#000000"
          emissiveIntensity={1}
        />
      </mesh>

      {/* Per-artwork spotlight (warm gallery light) */}
      <spotLight
        position={[
          0,
          1.2,
          artwork.wall === 'north' || artwork.wall === 'south'
            ? (artwork.wall === 'north' ? 0.6 : -0.6)
            : (artwork.wall === 'east' ? -0.6 : 0.6),
        ]}
        target={meshRef.current}
        intensity={isSelected ? 3.5 : 2.0}
        angle={Math.PI / 8}
        penumbra={0.4}
        decay={1.5}
        distance={10}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.1}
        shadow-camera-far={5}
        shadow-bias={-0.0001}
        shadow-radius={2}
        color="#fff5e6"
      />
    </group>
  )
}
