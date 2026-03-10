/**
 * Interior accent lighting for the brutalist gallery.
 * NOTE: The main directional sun light + hemisphereLlight + ambient are
 * provided by DynamicSky — we only add warm artwork spotlights here.
 * Following ARCH.md: 3000K warm accent spotlights.
 */
export default function Lighting() {
  return (
    <group>
      {/* Low ambient fill — supplements DynamicSky indoors */}
      <ambientLight intensity={0.25} color="#f5f0e8" />

      {/* Warm accent spotlights for artwork walls (3000K) */}
      <spotLight
        position={[1, 2.8, 5.5]}
        angle={Math.PI / 8}
        penumbra={0.65}
        intensity={1.2}
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
        intensity={1.2}
        distance={8}
        color="#ffd6aa"
      />
      <spotLight
        position={[5, 2.8, 5.5]}
        angle={Math.PI / 8}
        penumbra={0.65}
        intensity={1.1}
        distance={8}
        color="#ffd6aa"
      />

      {/* Architectural accent for pillars */}
      <spotLight
        position={[2.6, 2.9, 2.6]}
        angle={Math.PI / 8}
        penumbra={0.65}
        intensity={1.0}
        distance={6}
        color="#ffd6aa"
      />
      <spotLight
        position={[4.2, 2.9, 3.2]}
        angle={Math.PI / 8}
        penumbra={0.65}
        intensity={1.0}
        distance={6}
        color="#ffd6aa"
      />
    </group>
  )
}
