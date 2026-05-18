import { useState, useRef } from 'react'
import { useLoader, useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import { TextureLoader } from 'three'
import * as THREE from 'three'
import useGalleryStore from '../store/useGalleryStore'

// ─── Gallery Scene root offset (must match GalleryScene.jsx group position) ───
const SCENE_OFFSET = [-10, 0, -9]

// ─── Wall rotations — face inward ────────────────────────────────────────────
const WALL_ROTATIONS = {
  bottom: [0, 0, 0],
  right:  [0, -Math.PI / 2, 0],
  top:    [0, Math.PI, 0],
  left:   [0,  Math.PI / 2, 0],
}

const DOLLY_DIR = {
  bottom: [0, 0,  1],
  right:  [-1, 0, 0],
  top:    [0, 0, -1],
  left:   [1, 0,  0],
}

// ─── FRAME STYLES ─────────────────────────────────────────────────────────────

// 1. DARK-ORNATE — thick matte black box + recessed gold bevel (Scarecrow series)
function FrameDarkOrnate({ W, H, accent, isSelected }) {
  const OUTER = 0.14
  const goldColor = isSelected ? '#e8c870' : accent
  return (
    <>
      {/* Thick outer dark frame */}
      <mesh position={[0, 0, -0.12]}>
        <boxGeometry args={[W + OUTER * 2, H + OUTER * 2, 0.20]} />
        <meshStandardMaterial color="#0a0807" roughness={0.55} metalness={0.08} />
      </mesh>
      {/* Recessed gold bevel */}
      <mesh position={[0, 0, -0.065]}>
        <boxGeometry args={[W + OUTER * 0.8, H + OUTER * 0.8, 0.09]} />
        <meshStandardMaterial color={goldColor} roughness={0.18} metalness={0.92} envMapIntensity={2.5} />
      </mesh>
      {/* Inner dark rebate — creates shadow depth */}
      <mesh position={[0, 0, -0.022]}>
        <boxGeometry args={[W + 0.04, H + 0.04, 0.06]} />
        <meshStandardMaterial color="#060504" roughness={0.7} metalness={0.1} />
      </mesh>
    </>
  )
}

// 2. MINIMAL — ultra-thin brushed steel strip, no mat (Graphite/Charcoal)
function FrameMinimal({ W, H, accent, isSelected }) {
  const T = 0.028 // frame thickness
  const DEPTH = 0.018
  const color = isSelected ? '#d0d0d0' : '#7a7a7a'
  return (
    <>
      {/* Top bar */}
      <mesh position={[0, H / 2 + T / 2, -DEPTH / 2]}>
        <boxGeometry args={[W + T * 2, T, DEPTH]} />
        <meshStandardMaterial color={color} roughness={0.1} metalness={0.95} envMapIntensity={1.8} />
      </mesh>
      {/* Bottom bar */}
      <mesh position={[0, -(H / 2 + T / 2), -DEPTH / 2]}>
        <boxGeometry args={[W + T * 2, T, DEPTH]} />
        <meshStandardMaterial color={color} roughness={0.1} metalness={0.95} envMapIntensity={1.8} />
      </mesh>
      {/* Left bar */}
      <mesh position={[-(W / 2 + T / 2), 0, -DEPTH / 2]}>
        <boxGeometry args={[T, H, DEPTH]} />
        <meshStandardMaterial color={color} roughness={0.1} metalness={0.95} envMapIntensity={1.8} />
      </mesh>
      {/* Right bar */}
      <mesh position={[W / 2 + T / 2, 0, -DEPTH / 2]}>
        <boxGeometry args={[T, H, DEPTH]} />
        <meshStandardMaterial color={color} roughness={0.1} metalness={0.95} envMapIntensity={1.8} />
      </mesh>
      {/* Dark backing */}
      <mesh position={[0, 0, -DEPTH * 1.5]}>
        <planeGeometry args={[W + T * 2, H + T * 2]} />
        <meshStandardMaterial color="#111111" roughness={0.9} />
      </mesh>
    </>
  )
}

// 3. FLOAT — frameless, only a thin glowing LED-colored perimeter strip (Digital Art)
function FrameFloat({ W, H, accent, isSelected }) {
  const T = 0.018
  const glowColor = accent || '#00aaff'
  const intensity = isSelected ? 1.0 : 0.35
  return (
    <>
      {/* Top LED strip */}
      <mesh position={[0, H / 2 + T / 2, 0.005]}>
        <boxGeometry args={[W + T * 2, T, T * 0.6]} />
        <meshStandardMaterial color={glowColor} emissive={glowColor} emissiveIntensity={intensity} roughness={0.2} metalness={0.1} />
      </mesh>
      {/* Bottom LED strip */}
      <mesh position={[0, -(H / 2 + T / 2), 0.005]}>
        <boxGeometry args={[W + T * 2, T, T * 0.6]} />
        <meshStandardMaterial color={glowColor} emissive={glowColor} emissiveIntensity={intensity} roughness={0.2} metalness={0.1} />
      </mesh>
      {/* Left LED strip */}
      <mesh position={[-(W / 2 + T / 2), 0, 0.005]}>
        <boxGeometry args={[T, H, T * 0.6]} />
        <meshStandardMaterial color={glowColor} emissive={glowColor} emissiveIntensity={intensity} roughness={0.2} metalness={0.1} />
      </mesh>
      {/* Right LED strip */}
      <mesh position={[W / 2 + T / 2, 0, 0.005]}>
        <boxGeometry args={[T, H, T * 0.6]} />
        <meshStandardMaterial color={glowColor} emissive={glowColor} emissiveIntensity={intensity} roughness={0.2} metalness={0.1} />
      </mesh>
      {/* Very subtle dark backing shadow */}
      <mesh position={[0, 0, -0.012]}>
        <planeGeometry args={[W + 0.08, H + 0.08]} />
        <meshStandardMaterial color="#060608" roughness={0.9} />
      </mesh>
    </>
  )
}

// 4. GILT — warm gold leaf frame + cream linen mat (Watercolour)
function FrameGilt({ W, H, accent, isSelected }) {
  const OUTER = 0.18
  const goldColor = isSelected ? '#e8c870' : (accent || '#c8a040')
  return (
    <>
      {/* Outer gold frame body */}
      <mesh position={[0, 0, -0.10]}>
        <boxGeometry args={[W + OUTER * 2, H + OUTER * 2, 0.16]} />
        <meshStandardMaterial color={goldColor} roughness={0.20} metalness={0.90} envMapIntensity={3.0} />
      </mesh>
      {/* Inner dark lip — creates shadow between gold and mat */}
      <mesh position={[0, 0, -0.045]}>
        <boxGeometry args={[W + OUTER * 0.5, H + OUTER * 0.5, 0.07]} />
        <meshStandardMaterial color="#1a1208" roughness={0.6} metalness={0.2} />
      </mesh>
      {/* Cream linen mat */}
      <mesh position={[0, 0, -0.015]}>
        <boxGeometry args={[W + 0.08, H + 0.08, 0.03]} />
        <meshStandardMaterial color="#f0ebe0" roughness={0.92} metalness={0.0} />
      </mesh>
    </>
  )
}

// ─── Frame router ─────────────────────────────────────────────────────────────
function ArtFrame({ style, W, H, accent, isSelected }) {
  switch (style) {
    case 'minimal':     return <FrameMinimal     W={W} H={H} accent={accent} isSelected={isSelected} />
    case 'float':       return <FrameFloat        W={W} H={H} accent={accent} isSelected={isSelected} />
    case 'gilt':        return <FrameGilt         W={W} H={H} accent={accent} isSelected={isSelected} />
    case 'dark-ornate':
    default:            return <FrameDarkOrnate   W={W} H={H} accent={accent} isSelected={isSelected} />
  }
}

// ─── Metadata label ───────────────────────────────────────────────────────────
function ArtLabel({ title, artist, year, medium, frameH, frameStyle }) {
  const yearStr = year ? `  ·  ${year}` : ''
  const offset  = frameH / 2 + 0.22
  const isFloat = frameStyle === 'float'
  return (
    <group position={[0, -offset, 0.015]}>
      <Text
        fontSize={0.090}
        color={isFloat ? '#c8e8ff' : '#f0ece4'}
        anchorX="center"
        anchorY="top"
        position={[0, 0.20, 0]}
        maxWidth={2.6}
      >
        {title}{yearStr}
      </Text>
      <Text
        fontSize={0.068}
        color={isFloat ? '#7aaccc' : '#a89f92'}
        anchorX="center"
        anchorY="top"
        position={[0, 0.08, 0]}
        maxWidth={2.6}
      >
        {artist}
      </Text>
      {medium ? (
        <Text
          fontSize={0.054}
          color={isFloat ? '#557788' : '#6a6258'}
          anchorX="center"
          anchorY="top"
          position={[0, -0.02, 0]}
          maxWidth={2.6}
        >
          {medium}
        </Text>
      ) : null}
    </group>
  )
}

// ─── Main GalleryArt ──────────────────────────────────────────────────────────
export default function GalleryArt({ artwork }) {
  const [hovered, setHovered] = useState(false)
  const meshRef   = useRef()
  const lightRef  = useRef()

  const selectArtwork   = useGalleryStore((s) => s.selectArtwork)
  const selectedArtwork = useGalleryStore((s) => s.selectedArtwork)
  const isSelected = selectedArtwork?.id === artwork.id

  const localPos = artwork.localPos ?? [0, 1.6, 0]
  const W = artwork.width  ?? 1.6
  const H = artwork.height ?? 1.6
  const frameStyle  = artwork.frameStyle  ?? 'dark-ornate'
  const frameAccent = artwork.frameAccent ?? '#c8a96e'

  // Canvas size is full W × H — frame components draw around the outside
  const rotation = WALL_ROTATIONS[artwork.wall] ?? [0, 0, 0]
  const dolly    = DOLLY_DIR[artwork.wall]      ?? [0, 0, 1]

  const texture = useLoader(TextureLoader, artwork.image)

  // ─── Per-frame spotlight color ─────────────────────────────────────────────
  const lightColor = frameStyle === 'float'
    ? frameAccent  // tinted spot matches accent glow
    : '#fff6e0'    // warm gallery white for others

  // ─── Animations ────────────────────────────────────────────────────────────
  useFrame(() => {
    if (!meshRef.current) return

    const targetScale = hovered && !isSelected ? 1.02 : 1.0
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)

    if (meshRef.current.material) {
      const target = hovered || isSelected ? 0.14 : 0.0
      meshRef.current.material.emissiveIntensity = THREE.MathUtils.lerp(
        meshRef.current.material.emissiveIntensity ?? 0,
        target,
        0.1
      )
    }

    if (lightRef.current) {
      const targetInt = isSelected ? 5.5 : hovered ? 4.0 : 2.8
      lightRef.current.intensity = THREE.MathUtils.lerp(lightRef.current.intensity, targetInt, 0.08)
    }
  })

  // ─── Click ─────────────────────────────────────────────────────────────────
  const handleClick = (e) => {
    e.stopPropagation()
    const worldPos = [
      localPos[0] + SCENE_OFFSET[0],
      localPos[1] + SCENE_OFFSET[1],
      localPos[2] + SCENE_OFFSET[2],
    ]
    const D = Math.max(W, H) * 0.75 + 1.2
    const camPos = [
      worldPos[0] + dolly[0] * D,
      1.65,
      worldPos[2] + dolly[2] * D,
    ]
    selectArtwork(artwork, camPos, worldPos)
  }

  return (
    <group position={localPos} rotation={rotation}>

      {/* ── Frame (style varies per artwork) ── */}
      <ArtFrame style={frameStyle} W={W} H={H} accent={frameAccent} isSelected={isSelected} />

      {/* ── Artwork canvas ── */}
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
        <planeGeometry args={[W, H]} />
        <meshStandardMaterial
          map={texture}
          roughness={frameStyle === 'float' ? 0.3 : 0.5}
          metalness={0.04}
          emissive="#ffffff"
          emissiveIntensity={0.0}
          emissiveMap={texture}
        />
      </mesh>

      {/* ── Metadata label ── */}
      <ArtLabel
        title={artwork.title}
        artist={artwork.artist}
        year={artwork.year}
        medium={artwork.medium}
        frameH={H}
        frameStyle={frameStyle}
      />

      {/* ── Spotlight ── */}
      <spotLight
        ref={lightRef}
        position={[0, H * 0.75 + 0.6, 0.9]}
        intensity={2.8}
        angle={Math.PI / 7}
        penumbra={0.6}
        decay={1.5}
        distance={H * 2 + 4}
        castShadow={false}
        color={lightColor}
      />
    </group>
  )
}
