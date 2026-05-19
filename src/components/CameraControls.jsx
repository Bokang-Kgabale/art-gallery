import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import useCinematicCamera from '../utils/useCinematicCamera'
import useGalleryStore from '../store/useGalleryStore'
import { getTerrainData } from '../scenes/ExteriorScene'

export default function CameraControls() {
  const { camera } = useThree()
  const controlsRef = useRef()

  // Wire the cinematic dolly hook into this component (same R3F context)
  useCinematicCamera(controlsRef)

  const selectedArtwork = useGalleryStore((s) => s.selectedArtwork)

  // Disable keyboard / orbit interaction while a transition is happening
  const isTransitioning = useGalleryStore((s) => s.isTransitioning)

  // Movement state
  const setMoveState = useGalleryStore((s) => s.setMoveState)
  const moveState = useGalleryStore((s) => s.moveState)

  // Head bobbing state
  const bobbingTime = useRef(0)

  // Base movement speed (units per second)
  const moveSpeed = useRef(8.0)
  // Sensitivity for mouse look
  const rotateSpeed = 0.6

  useEffect(() => {
    const onKeyDown = (event) => {
      // Block WASD movement during cinematic dolly
      if (isTransitioning) return
      switch (event.code) {
        case 'KeyW': case 'ArrowUp': setMoveState('forward', true); break
        case 'KeyS': case 'ArrowDown': setMoveState('backward', true); break
        case 'KeyA': case 'ArrowLeft': setMoveState('left', true); break
        case 'KeyD': case 'ArrowRight': setMoveState('right', true); break
        case 'Space': setMoveState('up', true); break
        case 'ShiftLeft': case 'ShiftRight': setMoveState('down', true); break
      }
    }

    const onKeyUp = (event) => {
      switch (event.code) {
        case 'KeyW': case 'ArrowUp': setMoveState('forward', false); break
        case 'KeyS': case 'ArrowDown': setMoveState('backward', false); break
        case 'KeyA': case 'ArrowLeft': setMoveState('left', false); break
        case 'KeyD': case 'ArrowRight': setMoveState('right', false); break
        case 'Space': setMoveState('up', false); break
        case 'ShiftLeft': case 'ShiftRight': setMoveState('down', false); break
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

    const { forward, backward, left, right, up, down } = useGalleryStore.getState().moveState
    const mode = useGalleryStore.getState().movementMode

    if (forward || backward || left || right || up || down) {
      const direction = new THREE.Vector3()
      const rightVector = new THREE.Vector3()

      camera.getWorldDirection(direction)

      if (mode === 'ground') {
        direction.y = 0
      }
      direction.normalize()

      const horizontalDir = direction.clone()
      horizontalDir.y = 0
      if (horizontalDir.lengthSq() < 0.001) {
        horizontalDir.set(0, 0, -1).applyQuaternion(camera.quaternion)
        horizontalDir.y = 0
      }
      horizontalDir.normalize()
      rightVector.crossVectors(camera.up, horizontalDir).normalize()

      const moveDelta = new THREE.Vector3()
      const scalar = moveSpeed.current * delta
      if (forward) moveDelta.add(direction.clone().multiplyScalar(scalar))
      if (backward) moveDelta.add(direction.clone().multiplyScalar(-scalar))
      if (left) moveDelta.add(rightVector.clone().multiplyScalar(scalar))
      if (right) moveDelta.add(rightVector.clone().multiplyScalar(-scalar))

      // Vertical flight for float mode
      if (mode === 'float') {
        if (up) moveDelta.y += scalar
        if (down) moveDelta.y -= scalar
      }

      // Move both camera and target to maintain the same view angle while walking
      camera.position.add(moveDelta)
      controlsRef.current.target.add(moveDelta)

      // Update bobbing time for Ground mode
      if (mode === 'ground' && (forward || backward || left || right)) {
        const walkSpeed = 12;
        bobbingTime.current += delta * walkSpeed;
      }
    } else {
      // Reset bobbing slowly back to center
      if (mode === 'ground' && Math.abs(Math.sin(bobbingTime.current)) > 0.01) {
        bobbingTime.current += (Math.round(bobbingTime.current / Math.PI) * Math.PI - bobbingTime.current) * 0.1;
      }
    }

    // Y-Axis Positioning & Collision (Gravity & Bobbing)
    if (mode === 'ground') {
      // Evaluate terrain height at camera's world position
      const terrainHeight = getTerrainData(camera.position.x, camera.position.z).h
      // Clamp to gallery flat floor (approx 0) to avoid dipping too low
      const groundY = Math.max(0, terrainHeight)

      // Smoothly fall/rise to human eye level, integrating head bob
      const targetHeight = groundY + 1.6 + Math.sin(bobbingTime.current) * 0.08
      if (Math.abs(camera.position.y - targetHeight) > 0.001) {
        // Reduced lerp speed from 15 to 8 to give the camera more "weight"
        const yDelta = (targetHeight - camera.position.y) * 8 * delta
        camera.position.y += yDelta
        controlsRef.current.target.y += yDelta
      } else {
        const yDelta = targetHeight - camera.position.y
        camera.position.y = targetHeight
        controlsRef.current.target.y += yDelta
      }
    } else {
      // Float mode ground collision constraint
      if (camera.position.y < 0.5) {
        const yDelta = 0.5 - camera.position.y
        camera.position.y = 0.5
        controlsRef.current.target.y += yDelta
      }
    }
  })

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      enableZoom={false}
      enableDamping
      dampingFactor={0.08} // Slower damping for natural head inertia
      rotateSpeed={0.4} // Smooth head turn.
      target={[7.96, 2.196, 17.908]}
      // Disable user rotation while a modal is open / transitioning
      enabled={!selectedArtwork && !isTransitioning}
      maxPolarAngle={Math.PI * 0.85} // Prevent flipping camera upside down
      minPolarAngle={Math.PI * 0.15}
    />
  )
}