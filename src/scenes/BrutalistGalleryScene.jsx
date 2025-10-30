import { useLoader } from '@react-three/fiber'
import { TextureLoader, RepeatWrapping, Shape, ExtrudeGeometry } from 'three'
import * as THREE from 'three'
import GalleryArt from '../components/GalleryArt'
import portfolioData from '../data/portfolio.json'

export default function BrutalistGalleryScene({ onArtworkSelect }) {
  // Load granite textures for floor
  const [graniteColor, graniteNormal, graniteRoughness, graniteDisplacement] = useLoader(
    TextureLoader,
    [
      '/Granite006A_4K-PNG/Granite006A_4K-PNG_Color.png',
      '/Granite006A_4K-PNG/Granite006A_4K-PNG_NormalGL.png',
      '/Granite006A_4K-PNG/Granite006A_4K-PNG_Roughness.png',
      '/Granite006A_4K-PNG/Granite006A_4K-PNG_Displacement.png',
    ]
  )

  // Configure granite texture wrapping
  ;[graniteColor, graniteNormal, graniteRoughness, graniteDisplacement].forEach((texture) => {
    texture.wrapS = RepeatWrapping
    texture.wrapT = RepeatWrapping
    texture.repeat.set(3, 3)
  })

  // Load concrete textures for walls
  const [concreteColor, concreteNormal, concreteRoughness, concreteDisplacement, concreteAO] = useLoader(
    TextureLoader,
    [
      '/textures/concrete/Concrete031_4K-PNG_Color.png',
      '/textures/concrete/Concrete031_4K-PNG_NormalGL.png',
      '/textures/concrete/Concrete031_4K-PNG_Roughness.png',
      '/textures/concrete/Concrete031_4K-PNG_Displacement.png',
      '/textures/concrete/Concrete031_4K-PNG_AmbientOcclusion.png',
    ]
  )

  // Configure concrete texture wrapping
  ;[concreteColor, concreteNormal, concreteRoughness, concreteDisplacement, concreteAO].forEach((texture) => {
    texture.wrapS = RepeatWrapping
    texture.wrapT = RepeatWrapping
    texture.repeat.set(2, 2)
  })

  // Pentagon floor shape (exact ARCH.md dimensions)
  // Wall A: (0,0) to (6.8,0)
  // Wall B: (6.8,0) to (6.8,4.4)
  // Wall C: (6.8,4.4) to (5.0,6.0) - 45° angle
  // Wall D: (5.0,6.0) to (0.6,6.0)
  // Wall E: (0.6,6.0) to (0,0)
  const floorShape = new Shape()
  floorShape.moveTo(0, 0)
  floorShape.lineTo(6.8, 0)
  floorShape.lineTo(6.8, 4.4)
  floorShape.lineTo(5.0, 6.0)
  floorShape.lineTo(0.6, 6.0)
  floorShape.lineTo(0, 0)

  // Create extruded walls (0.3m thickness per ARCH.md)
  const wallThickness = 0.3

  return (
    <group position={[-3.4, 0, -3]}>
      {/* Floor - Pentagon shape */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <shapeGeometry args={[floorShape]} />
        <meshStandardMaterial
          color="#A6A0A0"
          map={graniteColor}
          normalMap={graniteNormal}
          roughnessMap={graniteRoughness}
          displacementMap={graniteDisplacement}
          displacementScale={0.01}
          roughness={0.28}
          metalness={0.0}
          side={2}
        />
      </mesh>

      {/* Wall A (bottom wall) - from (0,0) to (6.8,0) */}
      <mesh position={[3.4, 1.6, 0]} receiveShadow castShadow>
        <boxGeometry args={[6.8, 3.2, wallThickness]} />
        <meshStandardMaterial
          color="#BFB8B0"
          map={concreteColor}
          normalMap={concreteNormal}
          roughnessMap={concreteRoughness}
          displacementMap={concreteDisplacement}
          displacementScale={0.02}
          aoMap={concreteAO}
          aoMapIntensity={1.0}
          roughness={0.82}
          metalness={0.0}
        />
      </mesh>

      {/* Wall B (right vertical) - from (6.8,0) to (6.8,4.4) */}
      <mesh position={[6.8, 1.6, 2.2]} rotation={[0, Math.PI / 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[4.4, 3.2, wallThickness]} />
        <meshStandardMaterial
          color="#BFB8B0"
          map={concreteColor}
          normalMap={concreteNormal}
          roughnessMap={concreteRoughness}
          displacementMap={concreteDisplacement}
          displacementScale={0.02}
          aoMap={concreteAO}
          aoMapIntensity={1.0}
          roughness={0.82}
          metalness={0.0}
        />
      </mesh>

      {/* Wall C (angled 45°) - from (6.8,4.4) to (5.0,6.0) */}
      <mesh position={[5.9, 1.6, 5.2]} rotation={[0, Math.PI / 4, 0]} receiveShadow castShadow>
        <boxGeometry args={[2.55, 3.2, wallThickness]} />
        <meshStandardMaterial
          color="#BFB8B0"
          map={concreteColor}
          normalMap={concreteNormal}
          roughnessMap={concreteRoughness}
          displacementMap={concreteDisplacement}
          displacementScale={0.02}
          aoMap={concreteAO}
          aoMapIntensity={1.0}
          roughness={0.82}
          metalness={0.0}
        />
      </mesh>

      {/* Wall D (top) - from (5.0,6.0) to (0.6,6.0) */}
      <mesh position={[2.8, 1.6, 6.0]} receiveShadow castShadow>
        <boxGeometry args={[4.4, 3.2, wallThickness]} />
        <meshStandardMaterial
          color="#BFB8B0"
          map={concreteColor}
          normalMap={concreteNormal}
          roughnessMap={concreteRoughness}
          displacementMap={concreteDisplacement}
          displacementScale={0.02}
          aoMap={concreteAO}
          aoMapIntensity={1.0}
          roughness={0.82}
          metalness={0.0}
        />
      </mesh>

      {/* Wall E (left vertical) - from (0.6,6.0) to (0,0) */}
      <mesh position={[0.3, 1.6, 3.0]} rotation={[0, Math.PI / 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[6.0, 3.2, wallThickness]} />
        <meshStandardMaterial
          color="#BFB8B0"
          map={concreteColor}
          normalMap={concreteNormal}
          roughnessMap={concreteRoughness}
          displacementMap={concreteDisplacement}
          displacementScale={0.02}
          aoMap={concreteAO}
          aoMapIntensity={1.0}
          roughness={0.82}
          metalness={0.0}
        />
      </mesh>

      {/* Ceiling - main zone at 3.2m */}
      <mesh position={[3.4, 3.2, 1.5]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[6.8, 3.0]} />
        <meshStandardMaterial
          color="#BFB8B0"
          map={concreteColor}
          normalMap={concreteNormal}
          roughnessMap={concreteRoughness}
          roughness={0.82}
          metalness={0.0}
          side={2}
        />
      </mesh>

      {/* Ceiling - raised zone near Wall D at 3.5m per ARCH.md */}
      <mesh position={[2.8, 3.5, 5.0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[4.4, 2.0]} />
        <meshStandardMaterial
          color="#BFB8B0"
          map={concreteColor}
          normalMap={concreteNormal}
          roughnessMap={concreteRoughness}
          roughness={0.82}
          metalness={0.0}
          side={2}
        />
      </mesh>

      {/* Ceiling step/ramp between heights (0.3m difference) */}
      <mesh position={[3.4, 3.35, 3.5]} rotation={[-Math.PI / 6, 0, 0]} receiveShadow>
        <planeGeometry args={[6.8, 1.0]} />
        <meshStandardMaterial
          color="#BFB8B0"
          map={concreteColor}
          normalMap={concreteNormal}
          roughnessMap={concreteRoughness}
          roughness={0.82}
          metalness={0.0}
          side={2}
        />
      </mesh>

      {/* Pillar A - center at (2.6, 2.6) per ARCH.md */}
      <mesh position={[2.6, 1.6, 2.6]} castShadow receiveShadow>
        <cylinderGeometry args={[0.21, 0.21, 3.2, 64]} />
        <meshStandardMaterial
          color="#BFB8B0"
          map={concreteColor}
          normalMap={concreteNormal}
          roughnessMap={concreteRoughness}
          roughness={0.86}
          metalness={0.0}
        />
      </mesh>

      {/* Pillar B - center at (4.2, 3.2) per ARCH.md */}
      <mesh position={[4.2, 1.6, 3.2]} castShadow receiveShadow>
        <cylinderGeometry args={[0.21, 0.21, 3.2, 64]} />
        <meshStandardMaterial
          color="#BFB8B0"
          map={concreteColor}
          normalMap={concreteNormal}
          roughnessMap={concreteRoughness}
          roughness={0.86}
          metalness={0.0}
        />
      </mesh>

      {/* Bench/Display Platform - from x=0.3 to x=3.3, depth 0.6m, height 0.45m per ARCH.md */}
      <mesh position={[1.8, 0.225, 0.3]} castShadow receiveShadow>
        <boxGeometry args={[3.0, 0.45, 0.6]} />
        <meshStandardMaterial
          color="#BFB8B0"
          roughness={0.82}
          metalness={0.0}
        />
      </mesh>

      {/* Window 1 - center at (6.8, 1.6), 0.45m wide × 2.0m tall per ARCH.md */}
      <group position={[6.8, 2.0, 1.6]}>
        {/* Window frame - Matte Black Steel */}
        <mesh rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[0.5, 2.05, 0.03]} />
          <meshStandardMaterial
            color="#0B0B0B"
            roughness={0.5}
            metalness={0.7}
          />
        </mesh>
        {/* Glazing */}
        <mesh position={[0, 0, 0.01]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[0.45, 2.0]} />
          <meshStandardMaterial
            color="#3a3a3a"
            roughness={0.1}
            metalness={0.2}
            transparent
            opacity={0.5}
            side={2}
          />
        </mesh>
      </group>

      {/* Window 2 - center at (6.8, 3.0), 0.45m wide × 2.0m tall per ARCH.md */}
      <group position={[6.8, 2.0, 3.0]}>
        {/* Window frame - Matte Black Steel */}
        <mesh rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[0.5, 2.05, 0.03]} />
          <meshStandardMaterial
            color="#0B0B0B"
            roughness={0.5}
            metalness={0.7}
          />
        </mesh>
        {/* Glazing */}
        <mesh position={[0, 0, 0.01]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[0.45, 2.0]} />
          <meshStandardMaterial
            color="#3a3a3a"
            roughness={0.1}
            metalness={0.2}
            transparent
            opacity={0.5}
            side={2}
          />
        </mesh>
      </group>

      {/* Window 3 - Circular accent window, center at (0.9, 5.4), diameter 0.6m per ARCH.md */}
      <group position={[0.3, 2.6, 5.4]}>
        {/* Window frame - Matte Black Steel */}
        <mesh rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.3, 0.02, 16, 32]} />
          <meshStandardMaterial
            color="#0B0B0B"
            roughness={0.5}
            metalness={0.7}
          />
        </mesh>
        {/* Glazing */}
        <mesh position={[0, 0, 0.01]} rotation={[0, Math.PI / 2, 0]}>
          <circleGeometry args={[0.3, 32]} />
          <meshStandardMaterial
            color="#3a3a3a"
            roughness={0.1}
            metalness={0.2}
            transparent
            opacity={0.5}
            side={2}
          />
        </mesh>
      </group>

      {/* Optional Ribbon window on left wall - per ARCH.md */}
      <group position={[0.3, 1.2, 2.0]}>
        {/* Window frame - Matte Black Steel */}
        <mesh rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[2.0, 0.65, 0.03]} />
          <meshStandardMaterial
            color="#0B0B0B"
            roughness={0.5}
            metalness={0.7}
          />
        </mesh>
        {/* Glazing */}
        <mesh position={[0, 0, 0.01]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[2.0, 0.6]} />
          <meshStandardMaterial
            color="#3a3a3a"
            roughness={0.1}
            metalness={0.2}
            transparent
            opacity={0.5}
            side={2}
          />
        </mesh>
      </group>

      {/* Entry Door centered at x=6.0m on Wall A - 0.95m × 2.2m per ARCH.md */}
      <group position={[6.0, 1.1, 0]}>
        {/* Door frame - black steel (#0B0B0B per ARCH.md) */}
        <mesh position={[0, 0, -0.05]}>
          <boxGeometry args={[1.0, 2.3, 0.05]} />
          <meshStandardMaterial
            color="#0B0B0B"
            roughness={0.5}
            metalness={0.7}
          />
        </mesh>
        {/* Door panel - black steel */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.95, 2.2, 0.04]} />
          <meshStandardMaterial
            color="#0B0B0B"
            roughness={0.5}
            metalness={0.7}
          />
        </mesh>
        {/* Door handle */}
        <mesh position={[-0.35, 0, 0.03]}>
          <boxGeometry args={[0.02, 0.15, 0.06]} />
          <meshStandardMaterial
            color="#0B0B0B"
            roughness={0.3}
            metalness={0.9}
          />
        </mesh>
      </group>

      {/* Artworks - positioned on Wall D (top wall) per ARCH.md */}
      {portfolioData.map((artwork, index) => (
        <GalleryArt
          key={artwork.id}
          artwork={{
            ...artwork,
            wall: 'custom',
            position: [2.8 + (index - 1.5) * 1.2, 1.6, 5.85]
          }}
          onSelect={onArtworkSelect}
        />
      ))}
    </group>
  )
}
