import { useLoader } from '@react-three/fiber'
import { TextureLoader, RepeatWrapping } from 'three'
import GalleryArt from '../components/GalleryArt'
import BrutalistWall from '../components/BrutalistWall'
import portfolioData from '../data/portfolio.json'

export default function GalleryScene({ onArtworkSelect }) {
  // Load granite textures
  const [graniteColor, graniteNormal, graniteRoughness, graniteDisplacement] = useLoader(
    TextureLoader,
    [
      '/Granite006A_4K-PNG/Granite006A_4K-PNG_Color.png',
      '/Granite006A_4K-PNG/Granite006A_4K-PNG_NormalGL.png',
      '/Granite006A_4K-PNG/Granite006A_4K-PNG_Roughness.png',
      '/Granite006A_4K-PNG/Granite006A_4K-PNG_Displacement.png',
    ]
  )

  // Configure texture wrapping
  ;[graniteColor, graniteNormal, graniteRoughness, graniteDisplacement].forEach((texture) => {
    texture.wrapS = RepeatWrapping
    texture.wrapT = RepeatWrapping
    texture.repeat.set(3, 3)
  })

  return (
    <group>
      {/* Floor with granite texture */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial
          map={graniteColor}
          normalMap={graniteNormal}
          roughnessMap={graniteRoughness}
          displacementMap={graniteDisplacement}
          displacementScale={0.01}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* Brutalist Concrete Walls */}
      <BrutalistWall position={[0, 1.5, -5]} rotation={[0, 0, 0]} />
      <BrutalistWall position={[0, 1.5, 5]} rotation={[0, Math.PI, 0]} />
      <BrutalistWall position={[5, 1.5, 0]} rotation={[0, -Math.PI / 2, 0]} />
      <BrutalistWall position={[-5, 1.5, 0]} rotation={[0, Math.PI / 2, 0]} />

      {/* Brutalist Concrete Ceiling */}
      <BrutalistWall
        position={[0, 3, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        width={10}
        height={10}
      />

      {/* Artworks */}
      {portfolioData.map((artwork) => (
        <GalleryArt
          key={artwork.id}
          artwork={artwork}
          onSelect={onArtworkSelect}
        />
      ))}
    </group>
  )
}
