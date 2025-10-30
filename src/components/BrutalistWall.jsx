import { useLoader } from '@react-three/fiber'
import { TextureLoader, RepeatWrapping } from 'three'

export default function BrutalistWall({ position, rotation, width = 10, height = 3 }) {
  // Load PBR concrete textures
  const [colorMap, normalMap, roughnessMap, displacementMap, aoMap] = useLoader(
    TextureLoader,
    [
      '/textures/concrete/Concrete031_4K-PNG_Color.png',
      '/textures/concrete/Concrete031_4K-PNG_NormalGL.png',
      '/textures/concrete/Concrete031_4K-PNG_Roughness.png',
      '/textures/concrete/Concrete031_4K-PNG_Displacement.png',
      '/textures/concrete/Concrete031_4K-PNG_AmbientOcclusion.png',
    ]
  )

  // Configure texture wrapping and repeat
  const repeatScale = width > 5 ? 3 : 2;
  [colorMap, normalMap, roughnessMap, displacementMap, aoMap].forEach((texture) => {
    texture.wrapS = RepeatWrapping
    texture.wrapT = RepeatWrapping
    texture.repeat.set(repeatScale, repeatScale)
  })

  return (
    <mesh position={position} rotation={rotation} receiveShadow castShadow>
      <planeGeometry args={[width, height]} />
      <meshStandardMaterial
        map={colorMap}
        normalMap={normalMap}
        roughnessMap={roughnessMap}
        displacementMap={displacementMap}
        displacementScale={0.015}
        aoMap={aoMap}
        aoMapIntensity={1.0}
        roughness={0.9}
        metalness={0.05}
      />
    </mesh>
  )
}
