import { useLoader, useFrame } from '@react-three/fiber'
import { TextureLoader, RepeatWrapping, Shape, ShapeGeometry } from 'three'
import * as THREE from 'three'
import { useMemo, useRef, Suspense } from 'react'
import GalleryArt from '../components/GalleryArt'
import CollectionHighlight from '../components/CollectionHighlight'
import ArtErrorBoundary from '../components/ArtErrorBoundary'
import portfolioData from '../data/portfolio.json'
import useGalleryStore from '../store/useGalleryStore'

// ── SlitWindow Component ──────────────────────────────────────────────
// Features high-end steel framing, realistic glass material, and 
// performance-optimized dynamic spotlighting and volumetric light beams.
function SlitWindow({ position }) {
  const localTargetRef = useRef()
  const localSpotLightRef = useRef()
  const localBeamRef = useRef()

  const AZ_OFFSET = -Math.PI / 2
  const L = 14.0 // Beam length

  useFrame((state) => {
    // Read from store directly in frame loop to bypass React render cycle entirely
    const time = useGalleryStore.getState().timeOfDay
    const t = time / 24
    const el = Math.sin(t * Math.PI * 2 - Math.PI / 2)
    const az = t * Math.PI * 2 + AZ_OFFSET
    const cosEl = Math.cos(el)

    const x = Math.sin(az) * cosEl
    const y = Math.max(Math.sin(el), -0.05)
    const z = Math.cos(az) * cosEl

    const sunHeight = Math.max(y, 0)
    const opacityScale = THREE.MathUtils.clamp(sunHeight * 5.0, 0.0, 1.0)
    
    // Direction from sun to scene
    const dx = -x
    const dy = -y
    const dz = -z
    const len = Math.sqrt(dx*dx + dy*dy + dz*dz)
    const ndx = dx / (len || 1)
    const ndy = dy / (len || 1)
    const ndz = dz / (len || 1)

    // Update spotlight target position
    if (localTargetRef.current) {
      localTargetRef.current.position.set(
        position[0] + ndx * 12,
        position[1] + ndy * 12,
        position[2] + ndz * 12
      )
    }

    // Update spotlight position and properties
    if (localSpotLightRef.current) {
      // Position spotlight outside the window frame along the sun vector
      localSpotLightRef.current.position.set(
        position[0] - ndx * 3.0,
        position[1] - ndy * 3.0,
        position[2] - ndz * 3.0
      )
      localSpotLightRef.current.intensity = opacityScale * 1200.0
      const warmth = 1.0 - Math.min(sunHeight * 3.0, 1.0)
      localSpotLightRef.current.color.setRGB(1.0, 1.0 - warmth * 0.38, 1.0 - warmth * 0.68)
      if (localTargetRef.current && localSpotLightRef.current.target !== localTargetRef.current) {
        localSpotLightRef.current.target = localTargetRef.current
      }
    }

    // Update volumetric beam position, quaternion, and shader uniforms
    if (localBeamRef.current) {
      if (sunHeight <= 0.01) {
        localBeamRef.current.visible = false
      } else {
        localBeamRef.current.visible = true
        // Set center position of beam: position + dir * L/2
        localBeamRef.current.position.set(
          position[0] + ndx * (L / 2),
          position[1] + ndy * (L / 2),
          position[2] + ndz * (L / 2)
        )
        // Align beam with sun direction
        const targetDir = new THREE.Vector3(ndx, ndy, ndz)
        const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), targetDir)
        localBeamRef.current.quaternion.copy(q)

        // Sync shader color and opacity to dynamic sun values
        const warmth = 1.0 - Math.min(sunHeight * 3.0, 1.0)
        const beamColor = new THREE.Color()
        beamColor.setRGB(1.0, 1.0 - warmth * 0.38, 1.0 - warmth * 0.68)
        
        const mat = localBeamRef.current.material
        if (mat && mat.uniforms) {
          mat.uniforms.uColor.value.copy(beamColor)
          mat.uniforms.uOpacity.value = opacityScale * 0.15
          mat.uniforms.uTime.value = state.clock.getElapsedTime()
        }
      }
    }
  })

  // Static colors and initial structures
  const frameColor = '#0b0d0e'
  const beamColorInitial = new THREE.Color('#fff')

  return (
    <>
      {/* Window group rotated to align local X with global Z, local Y with global Y, local Z with global -X */}
      <group position={position} rotation={[0, Math.PI / 2, 0]}>
        {/* Outer Steel Frame: Left post */}
        <mesh castShadow receiveShadow position={[-0.205, 0, 0]}>
          <boxGeometry args={[0.04, 9.75, 0.58]} />
          <meshStandardMaterial color={frameColor} roughness={0.25} metalness={0.9} envMapIntensity={1.5} />
        </mesh>
        
        {/* Outer Steel Frame: Right post */}
        <mesh castShadow receiveShadow position={[0.205, 0, 0]}>
          <boxGeometry args={[0.04, 9.75, 0.58]} />
          <meshStandardMaterial color={frameColor} roughness={0.25} metalness={0.9} envMapIntensity={1.5} />
        </mesh>

        {/* Outer Steel Frame: Top post */}
        <mesh castShadow receiveShadow position={[0, 4.855, 0]}>
          <boxGeometry args={[0.45, 0.04, 0.58]} />
          <meshStandardMaterial color={frameColor} roughness={0.25} metalness={0.9} envMapIntensity={1.5} />
        </mesh>

        {/* Outer Steel Frame: Bottom post */}
        <mesh castShadow receiveShadow position={[0, -4.855, 0]}>
          <boxGeometry args={[0.45, 0.04, 0.58]} />
          <meshStandardMaterial color={frameColor} roughness={0.25} metalness={0.9} envMapIntensity={1.5} />
        </mesh>

        {/* Transoms (horizontal architectural steel grid lines) */}
        <mesh castShadow receiveShadow position={[0, -2.5, 0]}>
          <boxGeometry args={[0.45, 0.03, 0.52]} />
          <meshStandardMaterial color={frameColor} roughness={0.25} metalness={0.9} envMapIntensity={1.5} />
        </mesh>
        <mesh castShadow receiveShadow position={[0, -0.25, 0]}>
          <boxGeometry args={[0.45, 0.03, 0.52]} />
          <meshStandardMaterial color={frameColor} roughness={0.25} metalness={0.9} envMapIntensity={1.5} />
        </mesh>
        <mesh castShadow receiveShadow position={[0, 2.0, 0]}>
          <boxGeometry args={[0.45, 0.03, 0.52]} />
          <meshStandardMaterial color={frameColor} roughness={0.25} metalness={0.9} envMapIntensity={1.5} />
        </mesh>
        <mesh castShadow receiveShadow position={[0, 4.25, 0]}>
          <boxGeometry args={[0.45, 0.03, 0.52]} />
          <meshStandardMaterial color={frameColor} roughness={0.25} metalness={0.9} envMapIntensity={1.5} />
        </mesh>

        {/* Premium high-end architectural glass sheet */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.41, 9.67, 0.06]} />
          <meshPhysicalMaterial
            color="#d4eefc"
            transparent
            opacity={0.25}
            roughness={0.05}
            metalness={0.95}
            clearcoat={1.0}
            clearcoatRoughness={0.0}
            ior={1.5}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* SpotLight pointing inside casting dramatic shadows of columns & art */}
      <spotLight
        ref={localSpotLightRef}
        position={[position[0], position[1], position[2]]}
        angle={Math.PI / 4.5}
        penumbra={0.7}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={32}
        shadow-bias={-0.0005}
        intensity={0}
        color={beamColorInitial}
      />
      {/* Target object for spotlight direction */}
      <group
        ref={localTargetRef}
        position={[position[0] - 5, position[1], position[2]]}
      />

      {/* Volumetric Light Shaft (Fading gradient mesh with floating dust motes) */}
      <mesh ref={localBeamRef} position={[position[0], position[1], position[2]]} visible={false}>
        <boxGeometry args={[0.43, 9.6, L]} />
        <shaderMaterial
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
          uniforms={{
            uColor: { value: beamColorInitial },
            uOpacity: { value: 0.0 },
            uLength: { value: L },
            uTime: { value: 0.0 }
          }}
          vertexShader={`
            varying vec3 vPosition;
            void main() {
              vPosition = position;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            uniform vec3 uColor;
            uniform float uOpacity;
            uniform float uLength;
            uniform float uTime;
            varying vec3 vPosition;

            // Simple hash function for pseudo-random noise
            float hash(vec3 p) {
              p = fract(p * vec3(443.8975, 397.2973, 491.1871));
              p += dot(p.xyz, p.yzx + 19.19);
              return fract(p.x * p.y * p.z);
            }

            // Simple 3D value noise
            float noise(vec3 p) {
              vec3 i = floor(p);
              vec3 f = fract(p);
              vec3 u = f * f * (3.0 - 2.0 * f);
              return mix(
                mix(
                  mix(hash(i + vec3(0.0,0.0,0.0)), hash(i + vec3(1.0,0.0,0.0)), u.x),
                  mix(hash(i + vec3(0.0,1.0,0.0)), hash(i + vec3(1.0,1.0,0.0)), u.x),
                  u.y
                ),
                mix(
                  mix(hash(i + vec3(0.0,0.0,1.0)), hash(i + vec3(1.0,0.0,1.0)), u.x),
                  mix(hash(i + vec3(0.0,1.0,1.0)), hash(i + vec3(1.0,1.0,1.0)), u.x),
                  u.y
                ),
                u.z
              );
            }

            void main() {
              // position.z goes from -uLength/2 to uLength/2
              // fade from 1.0 at -uLength/2 (window) to 0.0 at uLength/2 (end)
              float fade = 1.0 - (vPosition.z + uLength / 2.0) / uLength;
              fade = clamp(fade, 0.0, 1.0);
              fade = pow(fade, 1.5);
              
              // Soft edges along the width (x: -0.215 to 0.215) and height (y: -4.8 to 4.8)
              float edgeX = 1.0 - abs(vPosition.x) / 0.215;
              float edgeY = 1.0 - abs(vPosition.y) / 4.8;
              float edge = clamp(edgeX * edgeY, 0.0, 1.0);
              edge = pow(edge, 0.4);

              // Procedural drifting dust motes
              vec3 dustPos = vPosition * 4.5 + vec3(0.12, 0.28, 0.18) * uTime;
              float n1 = noise(dustPos);
              float n2 = noise(dustPos * 1.8 - vec3(0.2, 0.1, 0.3) * uTime);
              float dust = pow(n1 * n2, 5.0) * 18.0; // High contrast spots

              // Slow ambient air current flows
              vec3 flowPos = vPosition * 0.75 + vec3(0.04, 0.08, 0.05) * uTime;
              float flow = noise(flowPos) * 0.35 + 0.85;

              float finalAlpha = uOpacity * fade * edge * flow * (1.0 + dust);
              gl_FragColor = vec4(uColor, finalAlpha);
            }
          `}
        />
      </mesh>
    </>
  )
}


export default function GalleryScene() {

  // Load concrete A textures for walls (light, beige-gray)
  const [
    concreteAColor,
    concreteANormal,
    concreteARoughness,
    concreteAMetalness,
    concreteADisplacement,
    concreteAAO
  ] = useLoader(
    TextureLoader,
    [
      '/textures/concrete/Concrete043a_2K_Color.jpg',
      '/textures/concrete/Concrete043a_2K_NormalGL.jpg',
      '/textures/concrete/Concrete043a_2K_Roughness.jpg',
      '/textures/concrete/Concrete043a_2K_Metalness.jpg',
      '/textures/concrete/Concrete043a_2K_Displacement.jpg',
      '/textures/concrete/Concrete043a_2K_AmbientOcclusion.jpg',
    ]
  )

  // Load concrete C textures for accent walls (dark, rich texture)
  const [
    concreteCColor,
    concreteCNormal,
    concreteCRoughness,
    concreteCMetalness,
    concreteCDisplacement,
    concreteCAO
  ] = useLoader(
    TextureLoader,
    [
      '/textures/concrete/Concrete043c_2K_Color.jpg',
      '/textures/concrete/Concrete043c_2K_NormalGL.jpg',
      '/textures/concrete/Concrete043c_2K_Roughness.jpg',
      '/textures/concrete/Concrete043c_2K_Metalness.jpg',
      '/textures/concrete/Concrete043c_2K_Displacement.jpg',
      '/textures/concrete/Concrete043c_2K_AmbientOcclusion.jpg',
    ]
  )

  // Load Concrete044D textures for the interior floor (dark, weathered slab)
  const [
    concrete44Color,
    concrete44Normal,
    concrete44Roughness,
    concrete44Metalness,
    concrete44Displacement, // enabled for subdivided plane floor geometry
    concrete44AO
  ] = useLoader(
    TextureLoader,
    [
      '/textures/Concrete044D_4K-PNG/Concrete044D_4K-PNG_Color.png',
      '/textures/Concrete044D_4K-PNG/Concrete044D_4K-PNG_NormalGL.png',
      '/textures/Concrete044D_4K-PNG/Concrete044D_4K-PNG_Roughness.png',
      '/textures/Concrete044D_4K-PNG/Concrete044D_4K-PNG_Metalness.png',
      '/textures/Concrete044D_4K-PNG/Concrete044D_4K-PNG_Displacement.png',
      '/textures/Concrete044D_4K-PNG/Concrete044D_4K-PNG_AmbientOcclusion.png',
    ]
  )

  // Configure concrete texture wrapping
  // repeat(1,1) — each tile covers the full mapped surface area, giving
  // wide, zoomed-in concrete slabs with prominent grain and pore detail.
  ;[
    concreteAColor,
    concreteANormal,
    concreteARoughness,
    concreteAMetalness,
    concreteADisplacement,
    concreteAAO,
    concreteCColor,
    concreteCNormal,
    concreteCRoughness,
    concreteCMetalness,
    concreteCDisplacement,
    concreteCAO
  ].forEach((texture) => {
    texture.wrapS = RepeatWrapping
    texture.wrapT = RepeatWrapping
    texture.repeat.set(1, 1)
  })

  // Floor texture — tile 3×3 across the ~20×18m slab for visible grain
  ;[
    concrete44Color,
    concrete44Normal,
    concrete44Roughness,
    concrete44Metalness,
    concrete44Displacement,
    concrete44AO
  ].forEach((texture) => {
    texture.wrapS = RepeatWrapping
    texture.wrapT = RepeatWrapping
    texture.repeat.set(3, 3)
  })
  concrete44Color.colorSpace = THREE.SRGBColorSpace

  // Light concrete (A) material properties - INCREASED displacement scale & bias for volume without corner tearing
  const concreteAMaterialProps = useMemo(() => ({
    color: '#D5CFC9',
    map: concreteAColor,
    normalMap: concreteANormal,
    roughnessMap: concreteARoughness,
    metalnessMap: concreteAMetalness,
    displacementMap: concreteADisplacement,
    displacementScale: 0.01,
    displacementBias: -0.005,
    aoMap: concreteAAO,
    roughness: 0.85,
    metalness: 0.05,
    normalScale: new THREE.Vector2(1.8, 1.8),
    envMapIntensity: 1.0,
  }), [concreteAColor, concreteANormal, concreteARoughness, concreteAMetalness, concreteADisplacement, concreteAAO])

  const concreteCMaterialProps = useMemo(() => ({
    color: '#85807B',
    map: concreteCColor,
    normalMap: concreteCNormal,
    roughnessMap: concreteCRoughness,
    metalnessMap: concreteCMetalness,
    displacementMap: concreteCDisplacement,
    displacementScale: 0.01,
    displacementBias: -0.005,
    aoMap: concreteCAO,
    roughness: 0.75,
    metalness: 0.15,
    normalScale: new THREE.Vector2(2.0, 2.0),
    envMapIntensity: 1.5,
  }), [concreteCColor, concreteCNormal, concreteCRoughness, concreteCMetalness, concreteCDisplacement, concreteCAO])

  // Floor concrete (044D) material — dark weathered slab with displacement mapping
  const concrete44FloorProps = useMemo(() => ({
    color: '#7a7670',
    map: concrete44Color,
    normalMap: concrete44Normal,
    roughnessMap: concrete44Roughness,
    metalnessMap: concrete44Metalness,
    displacementMap: concrete44Displacement,
    displacementScale: 0.02,
    displacementBias: -0.01,
    aoMap: concrete44AO,
    roughness: 0.80,
    metalness: 0.05,
    normalScale: new THREE.Vector2(1.5, 1.5),
    envMapIntensity: 0.8,
  }), [concrete44Color, concrete44Normal, concrete44Roughness, concrete44Metalness, concrete44Displacement, concrete44AO])

  // Split portfolio by collection for targeted rendering
  const scarecrowPieces = portfolioData.filter((a) => a.collection === '051')
  const regularPieces = portfolioData.filter((a) => a.collection !== '051')

  // Exact interior floor shape to avoid clipping with outside terrain
  const floorShape = new Shape()
  floorShape.moveTo(0, 0)
  floorShape.lineTo(20, 0)
  floorShape.lineTo(20, 14)
  floorShape.lineTo(15, 18)
  floorShape.lineTo(2, 18)
  floorShape.lineTo(0, 0)

  // Create floor geometry with proper UVs
  const floorGeometry = useMemo(() => {
    const geometry = new ShapeGeometry(floorShape)

    // Generate UV coordinates for texture mapping
    const uvs = geometry.attributes.position
    const uvArray = []

    for (let i = 0; i < uvs.count; i++) {
      const x = uvs.getX(i)
      const y = uvs.getY(i)
      // Normalize UVs based on the bounds (0 to 20 for x, 0 to 18 for y)
      uvArray.push(x / 20, y / 18)
    }

    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvArray, 2))
    return geometry
  }, [floorShape])

  return (
    <group position={[-10, 0, -9]}>
      {/* Floor - Subdivided Plane with Displacement */}
      {/* Elevated slightly (Y=0.05) to merge perfectly above the exterior sand terrain */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[10, 0.05, 9]}>
        <planeGeometry args={[20, 18, 100, 100]} />
        <meshStandardMaterial {...concrete44FloorProps} />
      </mesh>

      {/* Wall A (bottom) - from (0,0) to (20,0) - RAISED to match ceiling */}
      <mesh position={[10, 4.125, -0.225]} receiveShadow castShadow>
        <boxGeometry args={[20, 9.75, 0.45, 100, 50, 4]} />
        <meshStandardMaterial {...concreteAMaterialProps} />
      </mesh>

      {/* Wall B (right) - Split into three segments to create window openings */}
      {/* Segment 1: Z covers [0, 2.175] */}
      <mesh position={[20.225, 4.125, 1.0875]} rotation={[0, Math.PI / 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[2.175, 9.75, 0.45, 20, 50, 4]} />
        <meshStandardMaterial {...concreteCMaterialProps} />
      </mesh>

      {/* Segment 2: Z covers [2.625, 3.775] */}
      <mesh position={[20.225, 4.125, 3.2]} rotation={[0, Math.PI / 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[1.15, 9.75, 0.45, 10, 50, 4]} />
        <meshStandardMaterial {...concreteCMaterialProps} />
      </mesh>

      {/* Segment 3: Z covers [4.225, 14.0] */}
      <mesh position={[20.225, 4.125, 9.1125]} rotation={[0, Math.PI / 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[9.775, 9.75, 0.45, 90, 50, 4]} />
        <meshStandardMaterial {...concreteCMaterialProps} />
      </mesh>

      {/* Wall C (angled 45°) - from (20,14) to (15,18) - RAISED HEIGHT */}
      <mesh position={[17.5, 4.125, 16]} rotation={[0, -Math.PI / 4, 0]} receiveShadow castShadow>
        <boxGeometry args={[7.2, 9.75, 0.45, 36, 50, 4]} />
        <meshStandardMaterial {...concreteCMaterialProps} />
      </mesh>

      {/* Wall D (top) - from (15,18) to (2,18) - RAISED HEIGHT */}
      <mesh position={[8.5, 4.125, 18.225]} receiveShadow castShadow>
        <boxGeometry args={[13, 9.75, 0.45, 65, 50, 4]} />
        <meshStandardMaterial {...concreteAMaterialProps} />
      </mesh>

      {/* Wall E (left) - from (2,18) to (0,0) - RAISED HEIGHT */}
      <mesh position={[1.8, 4.125, 9]} rotation={[0, Math.PI / 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[18, 9.75, 0.45, 90, 50, 4]} />
        <meshStandardMaterial {...concreteAMaterialProps} />
      </mesh>

      {/* Angled ceiling - slopes from Wall A (6.3m) to Wall D (9.0m) */}
      <mesh
        position={[10, 7.65, 9]}
        rotation={[Math.PI / 2 - Math.atan((9.0 - 6.3) / 18), 0, 0]}
        receiveShadow
        castShadow
      >
        <boxGeometry args={[20, 18.5, 0.075, 100, 100, 1]} />
        <meshStandardMaterial {...concreteAMaterialProps} side={THREE.DoubleSide} />
      </mesh>

      {/* Pillar A - cylindrical concrete column at (2.6, 2.6) scaled 2.25x = (5.85, 5.85) */}
      <mesh position={[7.5, 4.25, 7.2]} castShadow receiveShadow>
        <cylinderGeometry args={[0.4725, 0.4725, 8.5, 64, 32]} />
        <meshStandardMaterial {...concreteCMaterialProps} />
      </mesh>

      {/* Pillar B - cylindrical concrete column at (4.2, 3.2) scaled 2.25x = (9.45, 7.2) */}
      <mesh position={[14, 4.25, 13]} castShadow receiveShadow>
        <cylinderGeometry args={[0.4725, 0.4725, 8.5, 64, 32]} />
        <meshStandardMaterial {...concreteCMaterialProps} />
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
      {/* Slit Windows with architectural frames, realistic glass and dynamic lighting shafts */}
      <SlitWindow position={[20.225, 4.125, 2.4]} />
      <SlitWindow position={[20.225, 4.125, 4.0]} />


      {/* ── 051 Scarecrow Collection Banner (Wall D, top) ──────── */}
      {/* Triptych is at x=5.5/9.0/12.5, y=2.5, h=3.0 → top=4.0   */}
      <CollectionHighlight
        title="051 Scarecrow Series"
        subtitle="Digital Art  ·  3-Part Series"
        position={[9.0, 5.8, 17.6]}
        rotation={[0, Math.PI, 0]}
        ringCount={3}
        ringSpacing={3.5}
      />

      {/* ── Regular artworks ────────────────────────────────────── */}
      {regularPieces.map((artwork) => (
        <GalleryArt key={artwork.id} artwork={artwork} />
      ))}

      {/* ── 051 Scarecrow collection pieces ─────────────────────── */}
      {scarecrowPieces.map((artwork) => (
        <GalleryArt key={artwork.id} artwork={artwork} />
      ))}
    </group>
  )
}
