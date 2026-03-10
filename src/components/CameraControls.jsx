import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import useCinematicCamera from '../utils/useCinematicCamera'
import useGalleryStore from '../store/useGalleryStore'

export default function CameraControls() {
  const { camera } = useThree()
  const controlsRef = useRef()

  // Wire the cinematic dolly hook into this component (same R3F context)
  useCinematicCamera(controlsRef)

  const selectedArtwork = useGalleryStore((s) => s.selectedArtwork)

  // Disable keyboard / orbit interaction while a transition is happening
  const isTransitioning = useGalleryStore((s) => s.isTransitioning)

  // Movement state
  const moveState = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
  })

  // Base movement speed (units per second)
  const moveSpeed = 8.0
  // Sensitivity for mouse look
  const rotateSpeed = 0.6

  useEffect(() => {
    const onKeyDown = (event) => {
      // Block WASD movement during cinematic dolly
      if (isTransitioning) return
      switch (event.code) {
        case 'KeyW': case 'ArrowUp': moveState.current.forward = true; break
        case 'KeyS': case 'ArrowDown': moveState.current.backward = true; break
        case 'KeyA': case 'ArrowLeft': moveState.current.left = true; break
        case 'KeyD': case 'ArrowRight': moveState.current.right = true; break
      }
    }

    const onKeyUp = (event) => {
      switch (event.code) {
        case 'KeyW': case 'ArrowUp': moveState.current.forward = false; break
        case 'KeyS': case 'ArrowDown': moveState.current.backward = false; break
        case 'KeyA': case 'ArrowLeft': moveState.current.left = false; break
        case 'KeyD': case 'ArrowRight': moveState.current.right = false; break
      }
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [isTransitioning])

  useFrame((state, delta) => {
    if (!controlsRef.current) return
    // Suppress manual movement while dollying
    if (isTransitioning || selectedArtwork) return

    const { forward, backward, left, right } = moveState.current
    if (forward || backward || left || right) {
      const direction = new THREE.Vector3()
      const rightVector = new THREE.Vector3()

      camera.getWorldDirection(direction)
      direction.y = 0
      direction.normalize()
      rightVector.crossVectors(camera.up, direction).normalize()

      const moveDelta = new THREE.Vector3()
      const scalar = moveSpeed * delta
      if (forward) moveDelta.add(direction.clone().multiplyScalar(scalar))
      if (backward) moveDelta.add(direction.clone().multiplyScalar(-scalar))
      if (left) moveDelta.add(rightVector.clone().multiplyScalar(scalar))
      if (right) moveDelta.add(rightVector.clone().multiplyScalar(-scalar))

      // Move both camera and target to maintain the same view angle while walking
      camera.position.add(moveDelta)
      controlsRef.current.target.add(moveDelta)
    }
  })

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      enableZoom={false}
      enableDamping
      dampingFactor={0.1} // More responsive stop
      rotateSpeed={rotateSpeed}
      target={[2, 1.6, 4]}
      // Disable user rotation while a modal is open / transitioning
      enabled={!selectedArtwork && !isTransitioning}
      maxPolarAngle={Math.PI * 0.85} // Prevent flipping camera upside down
      minPolarAngle={Math.PI * 0.15}
    />
  )
}