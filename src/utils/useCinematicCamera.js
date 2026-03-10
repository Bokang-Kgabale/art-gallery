import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import useGalleryStore from '../store/useGalleryStore'

/**
 * useCinematicCamera
 *
 * Must be rendered inside the <Canvas> (R3F context).
 * Accepts a ref to the OrbitControls instance so it can
 * also move the orbit target during the dolly.
 */
export default function useCinematicCamera(controlsRef) {
    const { camera } = useThree()
    const {
        cameraTarget,
        defaultCameraPosition,
        defaultCameraLookAt,
        isTransitioning,
        setTransitioning,
    } = useGalleryStore()

    // Scratch vectors (created once, reused every frame — no GC pressure)
    const targetPos = useRef(new THREE.Vector3())
    const targetLook = useRef(new THREE.Vector3())

    useFrame((_, delta) => {
        // Determine where we want to go
        if (cameraTarget) {
            targetPos.current.set(...cameraTarget.position)
            targetLook.current.set(...cameraTarget.lookAt)
        } else {
            targetPos.current.set(...defaultCameraPosition)
            targetLook.current.set(...defaultCameraLookAt)
        }

        if (!isTransitioning) return

        // Cubic-out eased lerp — faster at start, decelerates smoothly
        const lerpFactor = 1 - Math.pow(0.02, delta)

        camera.position.lerp(targetPos.current, lerpFactor)

        if (controlsRef?.current) {
            controlsRef.current.target.lerp(targetLook.current, lerpFactor)
            controlsRef.current.update()
        }

        // Consider "arrived" when we're very close
        const positionDist = camera.position.distanceTo(targetPos.current)
        const lookDist = controlsRef?.current
            ? controlsRef.current.target.distanceTo(targetLook.current)
            : 0

        if (positionDist < 0.01 && lookDist < 0.01) {
            camera.position.copy(targetPos.current)
            if (controlsRef?.current) {
                controlsRef.current.target.copy(targetLook.current)
                controlsRef.current.update()
            }
            setTransitioning(false)
        }
    })
}
