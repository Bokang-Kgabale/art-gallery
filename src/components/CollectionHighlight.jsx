import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'

/**
 * CollectionHighlight
 *
 * Renders a collection banner above a group of artworks on a wall.
 * Includes:
 *   - A title label ("051 Scarecrow Series")
 *   - A subtitle / description line
 *   - N animated ring lights that gently pulse on and off
 *
 * Props:
 *   title        – collection name
 *   subtitle     – short description line
 *   position     – [x, y, z] world-local position (centre of the banner)
 *   rotation     – [rx, ry, rz] to match the wall
 *   ringCount    – how many ring lights to render (default 3)
 *   ringSpacing  – distance between rings along X axis (default 3.8)
 */
export default function CollectionHighlight({
  title = '051 Scarecrow Series',
  subtitle = 'Digital Art — Triptych',
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  ringCount = 3,
  ringSpacing = 3.8,
}) {
  const lightsRef = useRef([])
  const ringsRef = useRef([])
  const elapsed = useRef(0)

  useFrame((_, delta) => {
    elapsed.current += delta

    lightsRef.current.forEach((light, i) => {
      if (!light) return
      // Each ring light is staggered by 0.6s
      const phase = (elapsed.current * 1.2 + i * 0.55) % (Math.PI * 2)
      // Smooth sine pulse between 0.6 and 3.0 intensity
      light.intensity = 0.6 + Math.sin(phase) * 1.2 + 1.0
    })

    ringsRef.current.forEach((ring, i) => {
      if (!ring || !ring.material) return
      const phase = (elapsed.current * 1.2 + i * 0.55) % (Math.PI * 2)
      // Opacity pulses between 0.3 and 0.9
      ring.material.opacity = 0.35 + (Math.sin(phase) * 0.5 + 0.5) * 0.55
      // Slight scale breathe
      const s = 1.0 + Math.sin(phase) * 0.07
      ring.scale.set(s, s, s)
    })
  })

  // Centre offset so rings are evenly spaced around position
  const halfSpan = ((ringCount - 1) * ringSpacing) / 2

  return (
    <group position={position} rotation={rotation}>
      {/* ── Collection title ───────────────────────────────────────── */}
      <Text
        position={[0, 0.52, 0.01]}
        fontSize={0.18}
        color="#e8d5a3"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.08}
      >
        {title.toUpperCase()}
      </Text>

      {/* ── Subtitle / medium ─────────────────────────────────────── */}
      <Text
        position={[0, 0.28, 0.01]}
        fontSize={0.095}
        color="#9a8f7e"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.05}
      >
        {subtitle}
      </Text>

      {/* ── Decorative horizontal rule ────────────────────────────── */}
      <mesh position={[0, 0.18, 0.01]}>
        <planeGeometry args={[3.2, 0.003]} />
        <meshBasicMaterial color="#c8a96e" transparent opacity={0.5} />
      </mesh>

      {/* ── Animated ring lights ──────────────────────────────────── */}
      {Array.from({ length: ringCount }, (_, i) => {
        const x = -halfSpan + i * ringSpacing
        return (
          <group key={i} position={[x, 0, 0]}>
            {/* Visible ring geometry */}
            <mesh
              ref={(el) => (ringsRef.current[i] = el)}
              position={[0, -0.1, 0.01]}
              rotation={[0, 0, 0]}
            >
              <ringGeometry args={[0.09, 0.13, 32]} />
              <meshBasicMaterial
                color="#c8a96e"
                transparent
                opacity={0.7}
                side={THREE.DoubleSide}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
              />
            </mesh>

            {/* Inner glow disc */}
            <mesh position={[0, -0.1, 0.005]}>
              <circleGeometry args={[0.07, 32]} />
              <meshBasicMaterial
                color="#ffe8a0"
                transparent
                opacity={0.12}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
              />
            </mesh>

            {/* Actual point light */}
            <pointLight
              ref={(el) => (lightsRef.current[i] = el)}
              position={[0, -0.1, 0.3]}
              intensity={1.8}
              distance={3.5}
              decay={2}
              color="#ffe4a0"
            />
          </group>
        )
      })}
    </group>
  )
}
