import { useMemo } from 'react'
import * as THREE from 'three'
import { useLoader } from '@react-three/fiber'
import { TextureLoader, RepeatWrapping } from 'three'
import { createNoise2D } from 'simplex-noise'

// ─── Module-level noise instances ────────────────────────────────────────────
const terrainNoise = createNoise2D(() => 0.42)
const mountainNoise = createNoise2D(() => 0.91)

// Helper to get terrain height and normal for alignment
export function getTerrainData(x, z) {
    const FLAT_IN = 20
    const FLAT_BLEND = 16
    const dist = Math.sqrt(x * x + z * z)
    const blend = THREE.MathUtils.smoothstep(dist, FLAT_IN, FLAT_IN + FLAT_BLEND)

    const getH = (px, pz) => {
        return (terrainNoise(px * 0.010, pz * 0.010) * 12.0 +
            terrainNoise(px * 0.030, pz * 0.030) * 4.5 +
            terrainNoise(px * 0.085, pz * 0.085) * 1.4) * blend
    }

    const h = getH(x, z)
    const eps = 0.5
    const hx = getH(x + eps, z)
    const hz = getH(x, z + eps)

    // Normal in world space
    // We approximate the slope by taking the cross product of tangent vectors
    const v1 = new THREE.Vector3(eps, hx - h, 0)
    const v2 = new THREE.Vector3(0, hz - h, eps)
    const normal = new THREE.Vector3().crossVectors(v2, v1).normalize()

    return { h, normal }
}

// ─── Ground054 texture paths ─────────────────────────────────────────────────
const GROUND054_MAPS = [
    '/textures/Ground054_4K-PNG/Ground054_4K-PNG_Color_2K.jpg',
    '/textures/Ground054_4K-PNG/Ground054_4K-PNG_NormalGL_2K.jpg',
    '/textures/Ground054_4K-PNG/Ground054_4K-PNG_Roughness_2K.jpg',
    '/textures/Ground054_4K-PNG/Ground054_4K-PNG_Displacement_2K.jpg',
    '/textures/Ground054_4K-PNG/Ground054_4K-PNG_AmbientOcclusion_2K.jpg',
]

// ─── Concrete044D texture paths ──────────────────────────────────────────────
const CONCRETE044_MAPS = [
    '/textures/Concrete044D_4K-PNG/Concrete044D_4K-PNG_Color_2K.jpg',
    '/textures/Concrete044D_4K-PNG/Concrete044D_4K-PNG_NormalGL_2K.jpg',
    '/textures/Concrete044D_4K-PNG/Concrete044D_4K-PNG_Roughness_2K.jpg',
    '/textures/Concrete044D_4K-PNG/Concrete044D_4K-PNG_Metalness_2K.jpg',
    '/textures/Concrete044D_4K-PNG/Concrete044D_4K-PNG_Displacement_2K.jpg',
    '/textures/Concrete044D_4K-PNG/Concrete044D_4K-PNG_AmbientOcclusion_2K.jpg',
]

// ─── Sand terrain ────────────────────────────────────────────────────────────
function SandTerrain() {
    // Load Ground054 PBR maps
    const [
        groundColor,
        groundNormal,
        groundRoughness,
        groundDisplacement,
        groundAO,
    ] = useLoader(TextureLoader, GROUND054_MAPS)

    // Tile the 4K maps 28× across the 400-unit plane for dense sand grain detail
    ;[groundColor, groundNormal, groundRoughness, groundDisplacement, groundAO].forEach((t) => {
        t.wrapS = t.wrapT = RepeatWrapping
        t.repeat.set(28, 28)
        t.anisotropy = 16
    })
    groundColor.colorSpace = THREE.SRGBColorSpace

    const geometry = useMemo(() => {
        const size = 400; const segs = 140
        const geo = new THREE.PlaneGeometry(size, size, segs, segs)
        const pos = geo.attributes.position
        const FLAT_IN = 20; const FLAT_BLEND = 16

        for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i); const y = pos.getY(i)
            const dist = Math.sqrt(x * x + y * y)
            const blend = THREE.MathUtils.smoothstep(dist, FLAT_IN, FLAT_IN + FLAT_BLEND)

            const elev =
                terrainNoise(x * 0.010, y * 0.010) * 12.0 +
                terrainNoise(x * 0.030, y * 0.030) * 4.5 +
                terrainNoise(x * 0.085, y * 0.085) * 1.4

            pos.setZ(i, elev * blend)
        }

        geo.computeVertexNormals()
        return geo
    }, [])

    return (
        <mesh geometry={geometry} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
            <meshStandardMaterial
                color="#c9a86c"
                map={groundColor}
                normalMap={groundNormal}
                normalScale={new THREE.Vector2(1.8, 1.8)}
                roughnessMap={groundRoughness}
                roughness={0.95}
                metalness={0.0}
                aoMap={groundAO}
                aoMapIntensity={0.9}
                displacementMap={groundDisplacement}
                displacementScale={0.65}
            />
        </mesh>
    )
}

function ScenicMonoliths({ loadedTextures }) {
    const {
        concreteColor,
        concreteNormal,
        concreteRoughness,
        concreteMetalness,
        concreteDisplacement,
        concreteAO,
    } = loadedTextures

    // Build weathered concrete material properties with beautiful displacement deforming
    // We clone the textures to ensure distinct repeat parameters for the boulders
    const concreteProps = useMemo(() => {
        const cColor = concreteColor.clone()
        const cNormal = concreteNormal.clone()
        const cRoughness = concreteRoughness.clone()
        const cMetalness = concreteMetalness.clone()
        const cDisplacement = concreteDisplacement.clone()
        const cAO = concreteAO.clone()

        ;[cColor, cNormal, cRoughness, cMetalness, cDisplacement, cAO].forEach((t) => {
            t.wrapS = t.wrapT = RepeatWrapping
            t.repeat.set(1.5, 1.5)
        })
        cColor.colorSpace = THREE.SRGBColorSpace

        return {
            color: '#7a7670',
            map: cColor,
            normalMap: cNormal,
            normalScale: new THREE.Vector2(1.5, 1.5),
            roughnessMap: cRoughness,
            roughness: 0.82,
            metalnessMap: cMetalness,
            metalness: 0.05,
            aoMap: cAO,
            aoMapIntensity: 1.0,
            displacementMap: cDisplacement,
            displacementScale: 0.08, // Rugged displacement deforms the outer edges of the rocks beautifully
            displacementBias: -0.04,
        }
    }, [concreteColor, concreteNormal, concreteRoughness, concreteMetalness, concreteAO, concreteDisplacement])

    const { monoliths, debris } = useMemo(() => {
        const rawMonoliths = [
            { x: 18.0, z: -8.0, w: 1.2, h: 9.0, d: 1.2, ry: 0.2, rx: 0.05 },
            { x: 22.0, z: -4.5, w: 1.5, h: 6.5, d: 1.5, ry: -0.4, rx: -0.05 },
            { x: 16.5, z: -2.0, w: 1.0, h: 4.5, d: 1.0, ry: 0.6, rx: 0.1 }
        ]
        const rawDebris = [
            { x: 15.0, z: -9.0, w: 2.2, h: 0.3, d: 1.4, rx: 0.3, ry: 0.5, rz: 0.2 },
            { x: 20.0, z: -6.0, w: 1.8, h: 0.4, d: 1.8, rx: -0.2, ry: 0.8, rz: 0.1 },
            { x: 24.5, z: -3.0, w: 2.5, h: 0.3, d: 1.2, rx: 0.1, ry: -0.3, rz: -0.3 }
        ]

        const formattedMonoliths = rawMonoliths.map(p => {
            const { h: terrainY } = getTerrainData(p.x, p.z)
            return { ...p, y: terrainY + p.h / 2 - 0.2 } // bury slightly
        })

        const formattedDebris = rawDebris.map(p => {
            const { h: terrainY } = getTerrainData(p.x, p.z)
            return { ...p, y: terrainY + 0.05 }
        })

        return { monoliths: formattedMonoliths, debris: formattedDebris }
    }, [])

    return (
        <group>
            {/* Slabs / Ruins */}
            {debris.map((d, idx) => (
                <mesh
                    key={`debris-${idx}`}
                    position={[d.x, d.y, d.z]}
                    rotation={[d.rx, d.ry, d.rz]}
                    castShadow
                    receiveShadow
                >
                    {/* Subdivided boxGeometry to support clean surface displacement mapping */}
                    <boxGeometry args={[d.w, d.h, d.d, 15, 15, 15]} />
                    <meshStandardMaterial {...concreteProps} />
                </mesh>
            ))}

            {/* Monolith Slabs */}
            {monoliths.map((m, idx) => {
                const isLongest = m.h === 9.0;
                return (
                    <mesh
                        key={`monolith-${idx}`}
                        position={[m.x, m.y, m.z]}
                        rotation={[m.rx, m.ry, 0]}
                        castShadow
                        receiveShadow
                    >
                        {isLongest ? (
                            // Subdivided cylinderGeometry to support clean cylindrical displacement mapping
                            <cylinderGeometry args={[m.w / 2, m.w / 2, m.h, 32, 40]} />
                        ) : (
                            // Subdivided boxGeometry to support clean surface displacement mapping
                            <boxGeometry args={[m.w, m.h, m.d, 15, 15, 15]} />
                        )}
                        <meshStandardMaterial {...concreteProps} />
                    </mesh>
                )
            })}
        </group>
    )
}

export default function ExteriorScene() {
    // Load Concrete044D weathered concrete textures for the platform and monoliths/debris
    const [
        concreteColor,
        concreteNormal,
        concreteRoughness,
        concreteMetalness,
        concreteDisplacement,
        concreteAO,
    ] = useLoader(TextureLoader, CONCRETE044_MAPS)

    // Build weathered concrete material properties for the platform pad
    // We clone the textures to ensure distinct repeat parameters for the pad
    const padProps = useMemo(() => {
        const cColor = concreteColor.clone()
        const cNormal = concreteNormal.clone()
        const cRoughness = concreteRoughness.clone()
        const cMetalness = concreteMetalness.clone()
        const cDisplacement = concreteDisplacement.clone()
        const cAO = concreteAO.clone()

        ;[cColor, cNormal, cRoughness, cMetalness, cDisplacement, cAO].forEach((t) => {
            t.wrapS = t.wrapT = RepeatWrapping
            t.repeat.set(4, 4) // Tile 4x4 across the 28x28m platform for high resolution detail
            t.anisotropy = 16
        })
        cColor.colorSpace = THREE.SRGBColorSpace

        return {
            color: '#7a7670',
            map: cColor,
            normalMap: cNormal,
            normalScale: new THREE.Vector2(1.5, 1.5),
            roughnessMap: cRoughness,
            roughness: 0.82,
            metalnessMap: cMetalness,
            metalness: 0.05,
            aoMap: cAO,
            aoMapIntensity: 1.0,
            displacementMap: cDisplacement,
            displacementScale: 0.04, // Beautiful subtle displacement for the concrete platform
            displacementBias: -0.02,
        }
    }, [concreteColor, concreteNormal, concreteRoughness, concreteMetalness, concreteAO, concreteDisplacement])

    return (
        <group>
            <SandTerrain />
            {/* The outside concrete platform pad - subdivided and textured with displacement */}
            <mesh receiveShadow position={[0.4, -0.06, 4.5]} castShadow>
                <boxGeometry args={[28, 0.18, 28, 100, 2, 100]} />
                <meshStandardMaterial {...padProps} />
            </mesh>
            <ScenicMonoliths loadedTextures={{ concreteColor, concreteNormal, concreteRoughness, concreteMetalness, concreteDisplacement, concreteAO }} />
        </group>
    )
}
