import { useLoader } from '@react-three/fiber'
import { TextureLoader, RepeatWrapping } from 'three'

/**
 * Creates a procedural concrete texture using Canvas API
 * Used as fallback if actual PBR textures aren't available
 */
export function useProceduralConcrete() {
  // Create canvas for procedural texture
  const createConcreteTexture = () => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 512
    const ctx = canvas.getContext('2d')

    // Base concrete color - brutalist grey
    const gradient = ctx.createLinearGradient(0, 0, 512, 512)
    gradient.addColorStop(0, '#9e9e9e')
    gradient.addColorStop(0.5, '#b0b0b0')
    gradient.addColorStop(1, '#9e9e9e')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 512, 512)

    // Add concrete texture noise
    for (let i = 0; i < 8000; i++) {
      const x = Math.random() * 512
      const y = Math.random() * 512
      const size = Math.random() * 3
      const opacity = Math.random() * 0.15
      ctx.fillStyle = `rgba(${Math.random() > 0.5 ? 0 : 255}, ${Math.random() > 0.5 ? 0 : 255}, ${Math.random() > 0.5 ? 0 : 255}, ${opacity})`
      ctx.fillRect(x, y, size, size)
    }

    // Add subtle scratches and imperfections
    for (let i = 0; i < 30; i++) {
      ctx.strokeStyle = `rgba(0, 0, 0, ${Math.random() * 0.1})`
      ctx.lineWidth = Math.random() * 2
      ctx.beginPath()
      ctx.moveTo(Math.random() * 512, Math.random() * 512)
      ctx.lineTo(Math.random() * 512, Math.random() * 512)
      ctx.stroke()
    }

    return canvas
  }

  return createConcreteTexture()
}

/**
 * Hook to load concrete PBR textures
 * Falls back to procedural if files not found
 */
export function useConcreteMaterial(texturePath = '/textures/concrete/') {
  try {
    const [color, normal, roughness, displacement] = useLoader(TextureLoader, [
      `${texturePath}Concrete_Color.png`,
      `${texturePath}Concrete_Normal.png`,
      `${texturePath}Concrete_Roughness.png`,
      `${texturePath}Concrete_Displacement.png`,
    ])

      // Configure textures
      ;[color, normal, roughness, displacement].forEach((texture) => {
        texture.wrapS = RepeatWrapping
        texture.wrapT = RepeatWrapping
        texture.repeat.set(2, 2)
      })

    return {
      map: color,
      normalMap: normal,
      roughnessMap: roughness,
      displacementMap: displacement,
      displacementScale: 0.02,
      roughness: 0.9,
      metalness: 0.1,
    }
  } catch (error) {
    console.warn('PBR textures not found, using procedural concrete')
    return null
  }
}

/**
 * Hook to load metal PBR textures
 */
export function useMetalMaterial(texturePath = '/textures/metal/') {
  try {
    const [color, normal, roughness, metallic] = useLoader(TextureLoader, [
      `${texturePath}Metal_Color.png`,
      `${texturePath}Metal_Normal.png`,
      `${texturePath}Metal_Roughness.png`,
      `${texturePath}Metal_Metallic.png`,
    ])

      // Configure textures
      ;[color, normal, roughness, metallic].forEach((texture) => {
        texture.wrapS = RepeatWrapping
        texture.wrapT = RepeatWrapping
        texture.repeat.set(4, 4)
      })

    return {
      map: color,
      normalMap: normal,
      roughnessMap: roughness,
      metalnessMap: metallic,
      roughness: 0.3,
      metalness: 0.9,
    }
  } catch (error) {
    console.warn('Metal textures not found, using default material')
    return null
  }
}
