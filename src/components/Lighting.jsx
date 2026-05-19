
/**
 * Interior accent and architectural lighting for the brutalist gallery.
 * Aligned with the gallery scene using the local offset [-10, 0, -9].
 * Implements a premium, museum-grade architectural lighting design:
 * 1. High-fidelity ambient fill to ensure a clean, well-lit baseline throughout the space.
 * 2. Dual central shadow-casting point lights to project soft, realistic overlapping shadows.
 * 3. A distributed grid of 6 ceiling downlights to flood the corners, walls, and artworks.
 * 4. Refined column grazers and glowing floor washes to accentuate the concrete textures.
 */
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import useGalleryStore from '../store/useGalleryStore'

/**
 * Interior accent and architectural lighting for the brutalist gallery.
 * Aligned with the gallery scene using the local offset [-10, 0, -9].
 * Implements a premium, museum-grade architectural lighting design:
 * 1. High-fidelity ambient fill that transitions to a dim cozy sunset wash.
 * 2. Dual central shadow-casting point lights providing soft, realistic ambient shadows.
 * 3. A distributed grid of 6 ceiling downlights that boost at night to flood concrete walls.
 * 4. Refined column grazers that emphasize raw displacement textures.
 * 5. Architectural cove glows that bathe the base of walls in warm sunset amber.
 */
export default function Lighting() {
  const ambientRef = useRef()
  const frontCenterRef = useRef()
  const backCenterRef = useRef()

  // Arrays of refs for ceiling downlights, column grazers, and cove glows
  const ceilingLightsRef = useRef([])
  const columnLightsRef = useRef([])
  const coveLightsRef = useRef([])

  // Helper to ensure arrays are filled correctly in React refs
  const addToRefs = (refArray) => (el) => {
    if (el && !refArray.current.includes(el)) {
      refArray.current.push(el)
    }
  }

  // Pre-instantiated THREE.Color objects for high-performance lerping
  const cAmbientDay = useMemo(() => new THREE.Color('#fbf9f4'), [])
  const cAmbientNight = useMemo(() => new THREE.Color('#100e0c'), [])

  const cCenterDayFront = useMemo(() => new THREE.Color('#ffebd6'), [])
  const cCenterDayBack = useMemo(() => new THREE.Color('#ffead4'), [])
  const cCenterNight = useMemo(() => new THREE.Color('#ff9e40'), []) // warm golden-amber

  const cCeilingDay = useMemo(() => new THREE.Color('#ffdca8'), [])
  const cCeilingNight = useMemo(() => new THREE.Color('#ff8830'), []) // deep warm amber

  const cColumnDay = useMemo(() => new THREE.Color('#ffe8cc'), [])
  const cColumnNight = useMemo(() => new THREE.Color('#ff8830'), []) // rich orange-gold

  const cCoveDayA = useMemo(() => new THREE.Color('#ffcaa0'), [])
  const cCoveDayD = useMemo(() => new THREE.Color('#ffc696'), [])
  const cCoveDayA2 = useMemo(() => new THREE.Color('#ffe3cc'), [])
  const cCoveNight = useMemo(() => new THREE.Color('#ff7710'), []) // glowing sunset amber

  useFrame(() => {
    const timeOfDay = useGalleryStore.getState().timeOfDay
    
    // Smooth night factor: 0.0 at noon, 1.0 at midnight, 0.5 at 6am/6pm
    const nightFactor = 0.5 - Math.cos((timeOfDay - 12) / 24 * Math.PI * 2) * 0.5

    // 1. Interpolate Ambient Fill (dimmer and warmer at night)
    if (ambientRef.current) {
      ambientRef.current.intensity = THREE.MathUtils.lerp(0.52, 0.10, nightFactor)
      ambientRef.current.color.copy(cAmbientDay).lerp(cAmbientNight, nightFactor)
    }

    // 2. Interpolate Dual Central Shadow-Casting Lights
    if (frontCenterRef.current) {
      frontCenterRef.current.intensity = THREE.MathUtils.lerp(9.0, 3.2, nightFactor)
      frontCenterRef.current.color.copy(cCenterDayFront).lerp(cCenterNight, nightFactor)
    }
    if (backCenterRef.current) {
      backCenterRef.current.intensity = THREE.MathUtils.lerp(10.0, 3.8, nightFactor)
      backCenterRef.current.color.copy(cCenterDayBack).lerp(cCenterNight, nightFactor)
    }

    // 3. Interpolate distributed ceiling downlights (6 lights)
    // Boosted at night to create dramatic high-contrast pools of golden light!
    ceilingLightsRef.current.forEach((light, i) => {
      if (!light) return
      // Base day intensities: 7.0 (front rows), 7.5 (mid rows), 8.0 (back rows)
      let dayInt = 7.0
      if (i === 1 || i === 4) dayInt = 7.5
      if (i === 2 || i === 5) dayInt = 8.0
      
      const nightInt = dayInt * 1.65 // Boost intensity by 65% at night
      light.intensity = THREE.MathUtils.lerp(dayInt, nightInt, nightFactor)
      light.color.copy(cCeilingDay).lerp(cCeilingNight, nightFactor)
    })

    // 4. Interpolate column grazers (2 lights)
    // Boosted at night to reveal rich rough concrete pillar displacements!
    columnLightsRef.current.forEach((light) => {
      if (!light) return
      light.intensity = THREE.MathUtils.lerp(6.0, 10.5, nightFactor)
      light.color.copy(cColumnDay).lerp(cColumnNight, nightFactor)
    })

    // 5. Interpolate cove glows (5 lights)
    // Washes the bottom of concrete walls in glowing warm sunset amber at night
    coveLightsRef.current.forEach((light, i) => {
      if (!light) return
      let dayInt = 4.5
      let dayColor = cCoveDayA
      if (i === 2) { // Wall D glow
        dayInt = 5.0
        dayColor = cCoveDayD
      } else if (i === 4) { // Wall A second glow
        dayInt = 4.5
        dayColor = cCoveDayA2
      } else if (i === 3) { // Wall A first glow
        dayInt = 4.0
      }

      const nightInt = dayInt * 2.0 // Double intensity at night for rich accent washes
      light.intensity = THREE.MathUtils.lerp(dayInt, nightInt, nightFactor)
      light.color.copy(dayColor).lerp(cCoveNight, nightFactor)
    })
  })

  // Reset ref arrays on render so that addToRefs doesn't grow indefinitely
  ceilingLightsRef.current = []
  columnLightsRef.current = []
  coveLightsRef.current = []

  return (
    <group position={[-10, 0, -9]}>
      {/* ── 1. Refined Ambient Fill ── */}
      <ambientLight ref={ambientRef} intensity={0.52} color="#fbf9f4" />

      {/* ── 2. Dual Central Shadow-Casting Lights ── */}
      <pointLight
        ref={frontCenterRef}
        position={[10.0, 4.5, 4.5]}
        intensity={9.0}
        color="#ffebd6"
        distance={18}
        decay={1.2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0008}
      />
      <pointLight
        ref={backCenterRef}
        position={[10.0, 5.5, 13.5]}
        intensity={10.0}
        color="#ffead4"
        distance={20}
        decay={1.2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0008}
      />

      {/* ── 3. Distributed Grid of Non-Shadow-Casting Ceiling Downlights ── */}
      <pointLight
        ref={addToRefs(ceilingLightsRef)}
        position={[4.0, 5.1, 4.5]}
        intensity={7.0}
        color="#ffdca8"
        distance={12}
        decay={1.3}
      />
      <pointLight
        ref={addToRefs(ceilingLightsRef)}
        position={[4.0, 5.8, 9.0]}
        intensity={7.5}
        color="#ffdca8"
        distance={12}
        decay={1.3}
      />
      <pointLight
        ref={addToRefs(ceilingLightsRef)}
        position={[4.0, 6.4, 13.5]}
        intensity={8.0}
        color="#ffdca8"
        distance={12}
        decay={1.3}
      />
      <pointLight
        ref={addToRefs(ceilingLightsRef)}
        position={[16.0, 5.1, 4.5]}
        intensity={7.0}
        color="#ffdca8"
        distance={12}
        decay={1.3}
      />
      <pointLight
        ref={addToRefs(ceilingLightsRef)}
        position={[16.0, 5.8, 9.0]}
        intensity={7.5}
        color="#ffdca8"
        distance={12}
        decay={1.3}
      />
      <pointLight
        ref={addToRefs(ceilingLightsRef)}
        position={[16.0, 6.4, 13.5]}
        intensity={8.0}
        color="#ffdca8"
        distance={12}
        decay={1.3}
      />

      {/* ── 4. Grazing Column Downlights ── */}
      <pointLight
        ref={addToRefs(columnLightsRef)}
        position={[7.5, 5.0, 7.2]}
        intensity={6.0}
        color="#ffe8cc"
        distance={10}
        decay={1.4}
      />
      <pointLight
        ref={addToRefs(columnLightsRef)}
        position={[14.0, 6.0, 13.0]}
        intensity={6.0}
        color="#ffe8cc"
        distance={10}
        decay={1.4}
      />

      {/* ── 5. Cove Glows at base of walls ── */}
      <pointLight
        ref={addToRefs(coveLightsRef)}
        position={[2.4, 0.25, 4.5]}
        intensity={4.5}
        color="#ffcaa0"
        distance={9}
        decay={1.6}
      />
      <pointLight
        ref={addToRefs(coveLightsRef)}
        position={[2.4, 0.25, 12.5]}
        intensity={4.5}
        color="#ffcaa0"
        distance={9}
        decay={1.6}
      />
      <pointLight
        ref={addToRefs(coveLightsRef)}
        position={[9.0, 0.25, 17.5]}
        intensity={5.0}
        color="#ffc696"
        distance={10}
        decay={1.6}
      />
      <pointLight
        ref={addToRefs(coveLightsRef)}
        position={[4.5, 0.25, 0.8]}
        intensity={4.0}
        color="#ffcaa0"
        distance={9}
        decay={1.6}
      />
      <pointLight
        ref={addToRefs(coveLightsRef)}
        position={[13.5, 0.25, 1.0]}
        intensity={4.5}
        color="#ffe3cc"
        distance={9}
        decay={1.6}
      />
    </group>
  )
}


