import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sky } from '@react-three/drei'
import * as THREE from 'three'

/**
 * DynamicSky
 *
 * Drives the Drei <Sky> shader + a directional sun light that sweeps
 * across the sky. Shadow direction updates every frame, creating
 * naturally moving shadows across the sand and building.
 *
 * Props:
 *   timeScale  — simulation speed multiplier (default 40)
 *   startHour  — starting hour 0–24 (default 9 = mid-morning)
 */
export default function DynamicSky({ timeScale = 40, startHour = 9 }) {
    const lightRef = useRef()

    // Drei Sky accepts sunPosition as a prop array — we drive it via state
    const [sunPos, setSunPos] = useState(() => {
        const t = startHour / 24
        const el = Math.sin(t * Math.PI * 2 - Math.PI / 2)
        const az = t * Math.PI * 2
        const cosEl = Math.cos(el)
        return [
            Math.sin(az) * cosEl,
            Math.max(Math.sin(el), -0.05),
            Math.cos(az) * cosEl,
        ]
    })

    const hour = useRef(startHour)

    useFrame((_, delta) => {
        // Advance simulated time
        hour.current = (hour.current + (delta * timeScale) / 3600) % 24

        const t = hour.current / 24
        const el = Math.sin(t * Math.PI * 2 - Math.PI / 2)
        const az = t * Math.PI * 2
        const cosEl = Math.cos(el)

        const x = Math.sin(az) * cosEl
        const y = Math.max(Math.sin(el), -0.05)
        const z = Math.cos(az) * cosEl

        // Only re-render the Sky shader when position actually changed noticeably
        setSunPos((prev) => {
            if (
                Math.abs(prev[0] - x) > 0.001 ||
                Math.abs(prev[1] - y) > 0.001 ||
                Math.abs(prev[2] - z) > 0.001
            ) {
                return [x, y, z]
            }
            return prev
        })

        // Drive the directional light to track the sun exactly
        if (lightRef.current) {
            lightRef.current.position.set(x * 100, y * 100, z * 100)
            lightRef.current.target.position.set(0, 0, 0)
            lightRef.current.target.updateMatrixWorld()

            // Brightness — smoothly ramps up from horizon, peaks at zenith
            const sunHeight = Math.max(y, 0)
            const brightness = THREE.MathUtils.smoothstep(sunHeight, 0.0, 0.18)
            lightRef.current.intensity = brightness * 3.0

            // Warm orange at sunrise/sunset, neutral white at high noon
            const warmth = 1 - Math.min(sunHeight * 5, 1)
            lightRef.current.color.setRGB(1.0, 1.0 - warmth * 0.28, 1.0 - warmth * 0.55)
        }
    })

    return (
        <>
            {/* Physically-based atmospheric sky */}
            <Sky
                distance={450000}
                sunPosition={sunPos}
                turbidity={8}
                rayleigh={1.5}
                mieCoefficient={0.003}
                mieDirectionalG={0.97}
            />

            {/* Sun directional light with large shadow frustum to cover terrain */}
            <directionalLight
                ref={lightRef}
                position={[80, 80, 0]}
                intensity={3.0}
                color="#fff8e8"
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                shadow-camera-left={-70}
                shadow-camera-right={70}
                shadow-camera-top={70}
                shadow-camera-bottom={-70}
                shadow-camera-near={0.5}
                shadow-camera-far={300}
                shadow-bias={-0.0003}
                shadow-normalBias={0.025}
                shadow-radius={2}
            />

            {/* Sky-bounce hemisphere: sandy ground, blue sky */}
            <hemisphereLight
                skyColor="#87ceeb"
                groundColor="#c8ad7f"
                intensity={0.6}
            />
        </>
    )
}
