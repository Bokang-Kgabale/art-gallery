import { useLoader } from '@react-three/fiber'
import { TextureLoader, RepeatWrapping, Shape, ShapeGeometry } from 'three'
import * as THREE from 'three'
import { useMemo } from 'react'
import GalleryArt from '../components/GalleryArt'
import portfolioData from '../data/portfolio.json'

export default function GalleryScene() {
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

  // Load concrete textures for walls
  const [concreteColor, concreteNormal, concreteRoughness] = useLoader(
    TextureLoader,
    [
      '/textures/concrete/Concrete031_4K-PNG_Color.png',
      '/textures/concrete/Concrete031_4K-PNG_NormalGL.png',
      '/textures/concrete/Concrete031_4K-PNG_Roughness.png',
    ]
  )

    // Configure granite texture wrapping
    ;[graniteColor, graniteNormal, graniteRoughness, graniteDisplacement].forEach((texture) => {
      texture.wrapS = RepeatWrapping
      texture.wrapT = RepeatWrapping
      texture.repeat.set(3, 3)
    })

    // Configure concrete texture wrapping
    ;[concreteColor, concreteNormal, concreteRoughness].forEach((texture) => {
      texture.wrapS = RepeatWrapping
      texture.wrapT = RepeatWrapping
      texture.repeat.set(2, 2)
    })

  // Large square floor shape - extends beyond walls
  const floorShape = new Shape()
  floorShape.moveTo(-5, -5)      // Extended bottom-left
  floorShape.lineTo(25, -5)      // Extended bottom-right  
  floorShape.lineTo(25, 23)      // Extended top-right
  floorShape.lineTo(-5, 23)      // Extended top-left
  floorShape.lineTo(-5, -5)      // Close the shape

  // Create floor geometry with proper UVs for large square
  const floorGeometry = useMemo(() => {
    const geometry = new ShapeGeometry(floorShape)

    // Generate UV coordinates for texture mapping
    const uvs = geometry.attributes.position
    const uvArray = []

    for (let i = 0; i < uvs.count; i++) {
      const x = uvs.getX(i)
      const y = uvs.getY(i)
      // Normalize UVs based on the larger square bounds (-5 to 25 for x, -5 to 23 for y)
      uvArray.push((x + 5) / 30, (y + 5) / 28)
    }

    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvArray, 2))
    return geometry
  }, [floorShape])

  return (
    <group position={[-10, 0, -9]}>
      {/* Floor - Pentagon shape */}
      <mesh rotation={[-Math.PI / 2, 0, 5]} receiveShadow position={[0, 0, 0]} geometry={floorGeometry}>
        <meshStandardMaterial
          color="#A6A0A0"
          map={graniteColor}
          normalMap={graniteNormal}
          roughnessMap={graniteRoughness}
          displacementMap={graniteDisplacement}
          displacementScale={0.01}
          roughness={0.28}
          metalness={0.0}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Wall A (bottom) - from (0,0) to (20,0) - RAISED to match ceiling */}
      <mesh position={[10, 3.375, -0.225]} receiveShadow castShadow>
        <boxGeometry args={[20, 8.25, 0.45]} />
        <meshStandardMaterial
          color="#BFB8B0"
          map={concreteColor}
          normalMap={concreteNormal}
          roughnessMap={concreteRoughness}
          roughness={0.82}
          metalness={0.0}
        />
      </mesh>

      {/* Wall B (right) - from (20,0) to (20,14) - RAISED HEIGHT */}
      <mesh position={[20.225, 3.375, 7]} rotation={[0, Math.PI / 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[14, 8.25, 0.45]} />
        <meshStandardMaterial
          color="#BFB8B0"
          map={concreteColor}
          normalMap={concreteNormal}
          roughnessMap={concreteRoughness}
          roughness={0.82}
          metalness={0.0}
        />
      </mesh>

      {/* Wall C (angled 45°) - from (20,14) to (15,18) - RAISED HEIGHT */}
      <mesh position={[17.5, 3.375, 16]} rotation={[0, -Math.PI / 4, 0]} receiveShadow castShadow>
        <boxGeometry args={[7.2, 8.25, 0.45]} />
        <meshStandardMaterial
          color="#BFB8B0"
          map={concreteColor}
          normalMap={concreteNormal}
          roughnessMap={concreteRoughness}
          roughness={0.82}
          metalness={0.0}
        />
      </mesh>

      {/* Wall D (top) - from (15,18) to (2,18) - RAISED HEIGHT */}
      <mesh position={[8.5, 3.375, 18.225]} receiveShadow castShadow>
        <boxGeometry args={[13, 8.25, 0.45]} />
        <meshStandardMaterial
          color="#BFB8B0"
          map={concreteColor}
          normalMap={concreteNormal}
          roughnessMap={concreteRoughness}
          roughness={0.82}
          metalness={0.0}
        />
      </mesh>

      {/* Wall E (left) - from (2,18) to (0,0) - RAISED HEIGHT */}
      <mesh position={[1.8, 3.375, 9]} rotation={[0, Math.PI / 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[18, 8.25, 0.45]} />
        <meshStandardMaterial
          color="#BFB8B0"
          map={concreteColor}
          normalMap={concreteNormal}
          roughnessMap={concreteRoughness}
          roughness={0.82}
          metalness={0.0}
        />
      </mesh>

      {/* Angled ceiling - slopes from Wall A (4.8m) to Wall D (7.5m) */}
      <mesh
        position={[10, 6.15, 9]}
        rotation={[Math.PI / 2 + Math.atan((7.5 - 4.8) / 18), 0, 0]}
        receiveShadow
        castShadow
      >
        <boxGeometry args={[20, 18.5, 0.075]} />
        <meshStandardMaterial
          color="#BFB8B0"
          map={concreteColor}
          normalMap={concreteNormal}
          roughnessMap={concreteRoughness}
          roughness={0.82}
          metalness={0.0}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Pillar A - cylindrical concrete column at (2.6, 2.6) scaled 2.25x = (5.85, 5.85) */}
      <mesh position={[7.5, 3.375, 7.2]} castShadow receiveShadow>
        <cylinderGeometry args={[0.4725, 0.4725, 6.75, 64]} />
        <meshStandardMaterial
          color="#BFB8B0"
          map={concreteColor}
          normalMap={concreteNormal}
          roughnessMap={concreteRoughness}
          roughness={0.82}
          metalness={0.0}
        />
      </mesh>

      {/* Pillar B - cylindrical concrete column at (4.2, 3.2) scaled 2.25x = (9.45, 7.2) */}
      <mesh position={[14, 3.375, 13]} castShadow receiveShadow>
        <cylinderGeometry args={[0.4725, 0.4725, 6.75, 64]} />
        <meshStandardMaterial
          color="#BFB8B0"
          map={concreteColor}
          normalMap={concreteNormal}
          roughnessMap={concreteRoughness}
          roughness={0.82}
          metalness={0.0}
        />
      </mesh>

      {/* Entry Door at x=13.5m on Wall A (9.0 * 1.5) */}
      <group position={[13.5, 1.65, -0.375]}>
        {/* Door frame */}
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[2.25, 3.6, 0.12]} />
          <meshStandardMaterial
            color="#0A0A0A"
            roughness={0.3}
            metalness={0.9}
            envMapIntensity={1.5}
          />
        </mesh>
        {/* Door inset */}
        <mesh position={[0, 0, 0.03]} castShadow>
          <boxGeometry args={[2.1, 3.45, 0.06]} />
          <meshStandardMaterial
            color="#1a1a1a"
            roughness={0.6}
            metalness={0.7}
          />
        </mesh>
      </group>
      {/* Window 1 on Wall B - spans entire wall thickness */}
      <group position={[20.255, 3.3, 2.4]} rotation={[0, Math.PI / 2, 0]}>
        {/* Window frame - thicker frame */}
        <mesh castShadow>
          <boxGeometry args={[0.45, 8.35, 0.58]} />
          <meshStandardMaterial
            color="#0A0A0A"
            roughness={0.3}
            metalness={0.9}
            envMapIntensity={1.5}
          />
        </mesh>
        {/* Glass pane - thicker glass spanning wall */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.45, 8.35, 0.58]} />
          <meshPhysicalMaterial
            color="#87CEEB"
            transparent
            opacity={0.4}
            roughness={0.05}
            metalness={0.1}
            transmission={0.9}
            thickness={1.0}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
      {/* Window 1 on Wall B - spans entire wall thickness */}
      <group position={[20.255, 3.3, 4]} rotation={[0, Math.PI / 2, 0]}>
        {/* Window frame - thicker frame */}
        <mesh castShadow>
          <boxGeometry args={[0.45, 8.35, 0.58]} />
          <meshStandardMaterial
            color="#0A0A0A"
            roughness={0.3}
            metalness={0.9}
            envMapIntensity={1.5}
          />
        </mesh>
        {/* Glass pane - thicker glass spanning wall */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.45, 8.35, 0.58]} />
          <meshPhysicalMaterial
            color="#87CEEB"
            transparent
            opacity={0.4}
            roughness={0.05}
            metalness={0.1}
            transmission={0.9}
            thickness={1.0}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
      {/* ── Window light shafts — softened ── */}
      {/* Wall B windows are at local x=20.255, z=2.4 and z=4.0 */}
      <pointLight position={[20.0, 3.3, 2.4]} intensity={12} color="#fff6d0" distance={24} decay={1.8} />
      <pointLight position={[20.0, 3.3, 4.0]} intensity={12} color="#fff6d0" distance={24} decay={1.8} />

      {/* Mid-point interior fill to soften the contrast */}
      <pointLight position={[10.0, 3.3, 3.2]} intensity={4} color="#fff6e0" distance={15} decay={2} />

      {/* Shaft beams — using oriented cylinders for a volumetric 'glow' look */}
      <mesh position={[15.6, 3.3, 2.4]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.26, 0.45, 9, 16, 1, true]} />
        <meshBasicMaterial
          color="#fff8d0"
          transparent
          opacity={0.015}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <mesh position={[15.6, 3.3, 4.0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.26, 0.45, 9, 16, 1, true]} />
        <meshBasicMaterial
          color="#fff8d0"
          transparent
          opacity={0.015}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Floor light pools beneath window shafts — smoothed radius */}
      <mesh position={[14.0, 0.02, 2.4]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[4.2, 32]} />
        <meshBasicMaterial color="#fff8c0" transparent opacity={0.05} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh position={[14.0, 0.02, 4.0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[4.2, 32]} />
        <meshBasicMaterial color="#fff8c0" transparent opacity={0.05} depthWrite={false} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* Artworks — mapped from portfolio.json */}
      {portfolioData.map((artwork) => (
        <GalleryArt key={artwork.id} artwork={artwork} />
      ))}
    </group>
  )
}
