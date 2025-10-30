import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

export default function CameraControls() {
  const { camera } = useThree()
  const controlsRef = useRef()

  // Movement state
  const moveState = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
  })

  const moveSpeed = 0.05
  const roomBounds = { min: -4.5, max: 4.5 }

  useEffect(() => {
    // Keyboard event handlers
    const onKeyDown = (event) => {
      switch (event.code) {
        case 'KeyW':
        case 'ArrowUp':
          moveState.current.forward = true
          break
        case 'KeyS':
        case 'ArrowDown':
          moveState.current.backward = true
          break
        case 'KeyA':
        case 'ArrowLeft':
          moveState.current.left = true
          break
        case 'KeyD':
        case 'ArrowRight':
          moveState.current.right = true
          break
      }
    }

    const onKeyUp = (event) => {
      switch (event.code) {
        case 'KeyW':
        case 'ArrowUp':
          moveState.current.forward = false
          break
        case 'KeyS':
        case 'ArrowDown':
          moveState.current.backward = false
          break
        case 'KeyA':
        case 'ArrowLeft':
          moveState.current.left = false
          break
        case 'KeyD':
        case 'ArrowRight':
          moveState.current.right = false
          break
      }
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [])

  useFrame(() => {
    if (!controlsRef.current) return

    const { forward, backward, left, right } = moveState.current

    // Update keyboard movement if keys are pressed
    if (forward || backward || left || right) {
      const direction = new THREE.Vector3()
      const rightVector = new THREE.Vector3()

      // Get camera direction
      camera.getWorldDirection(direction)
      direction.y = 0 // Keep movement horizontal
      direction.normalize()

      // Get right vector (perpendicular to direction)
      rightVector.crossVectors(camera.up, direction).normalize()

      // Calculate movement delta
      const moveDelta = new THREE.Vector3()

      if (forward) {
        moveDelta.add(direction.clone().multiplyScalar(moveSpeed))
      }
      if (backward) {
        moveDelta.add(direction.clone().multiplyScalar(-moveSpeed))
      }
      if (left) {
        moveDelta.add(rightVector.clone().multiplyScalar(moveSpeed))
      }
      if (right) {
        moveDelta.add(rightVector.clone().multiplyScalar(-moveSpeed))
      }

      // Save current look direction
      const lookDirection = new THREE.Vector3()
      lookDirection.subVectors(controlsRef.current.target, camera.position)

      // Apply movement with collision detection
      const newPosition = camera.position.clone().add(moveDelta)

      // Check boundaries and update position
      if (newPosition.x > roomBounds.min && newPosition.x < roomBounds.max) {
        camera.position.x = newPosition.x
      }
      if (newPosition.z > roomBounds.min && newPosition.z < roomBounds.max) {
        camera.position.z = newPosition.z
      }

      // Update target to maintain look direction
      controlsRef.current.target.copy(camera.position).add(lookDirection)
    }

    // ALWAYS constrain camera position within room boundaries (runs every frame)
    // This prevents OrbitControls from moving camera through walls via mouse dragging
    camera.position.x = Math.max(roomBounds.min, Math.min(roomBounds.max, camera.position.x))
    camera.position.z = Math.max(roomBounds.min, Math.min(roomBounds.max, camera.position.z))
    camera.position.y = Math.max(0.5, Math.min(2.5, camera.position.y))
  })

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      enableZoom={false}
      enableDamping
      dampingFactor={0.05}
      target={[0, 1.6, -1]}
    />
  )
}
