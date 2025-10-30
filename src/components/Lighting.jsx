/**
 * Advanced lighting setup for brutalist gallery
 * Following ARCH.md specifications:
 * - 4000K ambient lighting (neutral white)
 * - 3000K accent spots (warm white)
 * - Spotlights: angle Math.PI/8, penumbra 0.65, intensity 1.2-1.8
 */
export default function Lighting() {
  return (
    <group>
      {/* Main ambient light - 4000K neutral white */}
      <ambientLight intensity={0.4} color="#faf6ed" />

      {/* Hemisphere light per ARCH.md - 0xebe8e3 sky, 0x22222a ground */}
      <hemisphereLight
        skyColor="#ebe8e3"
        groundColor="#22222a"
        intensity={0.3}
      />

      {/* Directional light - simulates skylight through windows */}
      <directionalLight
        position={[5, 10, 5]}
        intensity={0.6}
        color="#faf6ed"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
        shadow-camera-near={0.1}
        shadow-camera-far={50}
        shadow-bias={-0.0001}
      />

      {/* Accent spotlights - 3000K warm white, positioned for artwork illumination per ARCH.md */}
      <spotLight
        position={[1, 2.8, 5.5]}
        angle={Math.PI / 8}
        penumbra={0.65}
        intensity={1.5}
        distance={8}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        color="#ffd6aa"
      />
      <spotLight
        position={[3, 2.8, 5.5]}
        angle={Math.PI / 8}
        penumbra={0.65}
        intensity={1.5}
        distance={8}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        color="#ffd6aa"
      />
      <spotLight
        position={[5, 2.8, 5.5]}
        angle={Math.PI / 8}
        penumbra={0.65}
        intensity={1.4}
        distance={8}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        color="#ffd6aa"
      />

      {/* Architectural accent light for pillars per ARCH.md */}
      <spotLight
        position={[2.6, 2.9, 2.6]}
        angle={Math.PI / 8}
        penumbra={0.65}
        intensity={1.2}
        distance={6}
        color="#ffd6aa"
      />
      <spotLight
        position={[4.2, 2.9, 3.2]}
        angle={Math.PI / 8}
        penumbra={0.65}
        intensity={1.2}
        distance={6}
        color="#ffd6aa"
      />
    </group>
  )
}
