import React from 'react'
import { Text } from '@react-three/drei'

export default class ArtErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.warn(`ArtErrorBoundary caught an error for ${this.props.fallbackName || 'Artwork'}:`, error)
  }

  render() {
    if (this.state.hasError) {
      const { width = 1.6, height = 1.6 } = this.props
      return (
        <group>
          {/* Missing Texture Fallback Mesh */}
          <mesh>
            <planeGeometry args={[width, height]} />
            <meshStandardMaterial color="#330000" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0, 0.01]}>
            <planeGeometry args={[width * 0.9, height * 0.9]} />
            <meshStandardMaterial color="#111111" roughness={0.8} />
          </mesh>
          {/* Error Text */}
          <Text
            position={[0, 0, 0.02]}
            fontSize={0.15}
            color="#ff4444"
            anchorX="center"
            anchorY="middle"
            maxWidth={width * 0.8}
            textAlign="center"
          >
            {`ERROR\nASSET OFFLINE`}
          </Text>
        </group>
      )
    }

    return this.props.children
  }
}
