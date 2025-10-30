import { useState, useRef } from 'react'
import { useLoader, useFrame } from '@react-three/fiber'
import { TextureLoader } from 'three'
import * as THREE from 'three'

export default function GalleryArt({ artwork, onSelect }) {
  const [hovered, setHovered] = useState(false)
  const meshRef = useRef()
  const frameRef = useRef()

  // Load artwork texture
  const texture = useLoader(TextureLoader, artwork.image)

  // Calculate position based on wall and position index
  const getPosition = () => {
    const wallOffset = 4.8
    const spacing = 2.5
    const offset = (artwork.position - 0.5) * spacing
    const height = 1.5

    switch (artwork.wall) {
      case 'north':
        return [offset, height, -wallOffset]
      case 'south':
        return [-offset, height, wallOffset]
      case 'east':
        return [wallOffset, height, offset]
      case 'west':
        return [-wallOffset, height, -offset]
      default:
        return [0, height, 0]
    }
  }

  // Calculate rotation based on wall
  const getRotation = () => {
    switch (artwork.wall) {
      case 'north':
        return [0, 0, 0]
      case 'south':
        return [0, Math.PI, 0]
      case 'east':
        return [0, -Math.PI / 2, 0]
      case 'west':
        return [0, Math.PI / 2, 0]
      default:
        return [0, 0, 0]
    }
  }

  const position = getPosition()
  const rotation = getRotation()

  // Animate hover effect
  useFrame(() => {
    if (meshRef.current && frameRef.current) {
      const targetScale = hovered ? 1.05 : 1.0
      const targetEmissive = hovered ? 0.15 : 0

      // Smooth scale transition
      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      )

      // Smooth emissive transition
      if (meshRef.current.material.emissive) {
        meshRef.current.material.emissive.setHex(
          THREE.MathUtils.lerp(
            meshRef.current.material.emissive.getHex(),
            targetEmissive * 0xffffff,
            0.1
          )
        )
      }
    }
  })

  return (
    <group position={position} rotation={rotation}>
      {/* Frame */}
      <mesh
        ref={frameRef}
        position={[0, 0, -0.01]}
        receiveShadow
      >
        <planeGeometry args={[1.3, 1.3]} />
        <meshStandardMaterial
          color="#2c2c2c"
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>

      {/* Artwork */}
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
        onClick={(e) => {
          e.stopPropagation()
          onSelect(artwork)
        }}
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

      {/* Spotlight for this artwork */}
      <spotLight
        position={[
          0,
          1.2,
          artwork.wall === 'north' || artwork.wall === 'south'
            ? (artwork.wall === 'north' ? 0.6 : -0.6)
            : (artwork.wall === 'east' ? -0.6 : 0.6)
        ]}
        target={meshRef.current}
        intensity={2.0}
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
