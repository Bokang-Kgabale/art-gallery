import { useMemo, useRef, useEffect } from 'react'
import * as THREE from 'three'
import { useLoader } from '@react-three/fiber'
import { TDSLoader } from 'three/examples/jsm/loaders/TDSLoader'
import { createNoise2D } from 'simplex-noise'

// ─── Module-level noise instances ────────────────────────────────────────────
const terrainNoise = createNoise2D(() => 0.42)
const mountainNoise = createNoise2D(() => 0.91)

// Helper to get terrain height and normal for alignment
function getTerrainData(x, z) {
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
    const normal = new THREE.Vector3().crossVectors(v1, v2).normalize()

    return { h, normal }
}

// ─── Procedural sand colour texture (grain + wind streaks) ───────────────────
function makeSandColorTex(size = 1024) {
    const canvas = document.createElement('canvas')
    canvas.width = size; canvas.height = size
    const ctx = canvas.getContext('2d')

    ctx.fillStyle = '#c4a87a'
    ctx.fillRect(0, 0, size, size)

    // Grains
    for (let i = 0; i < 160000; i++) {
        const x = Math.random() * size
        const y = Math.random() * size
        const w = Math.random() * 3.2 + 0.4
        const h = w * (Math.random() * 0.35 + 0.12)
        const bv = (Math.random() - 0.5) * 72
        const r = Math.max(0, Math.min(255, 196 + bv))
        const g = Math.max(0, Math.min(255, 168 + bv * 0.78))
        const b = Math.max(0, Math.min(255, 122 + bv * 0.58))
        ctx.save()
        ctx.translate(x, y)
        ctx.rotate(Math.random() * Math.PI)
        ctx.fillStyle = `rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`
        ctx.beginPath()
        ctx.ellipse(0, 0, w, h, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
    }

    // Wind ripples
    ctx.globalAlpha = 0.07
    for (let row = 0; row < 80; row++) {
        const yBase = (row / 80) * size
        ctx.strokeStyle = row % 3 === 0 ? '#e8d09a' : (row % 3 === 1 ? '#b08040' : '#d4b880')
        ctx.lineWidth = Math.random() * 2 + 0.5
        ctx.beginPath()
        ctx.moveTo(0, yBase)
        for (let x = 0; x <= size; x += 18) {
            ctx.lineTo(x, yBase + (Math.random() - 0.5) * 12)
        }
        ctx.stroke()
    }
    ctx.globalAlpha = 1

    const tex = new THREE.CanvasTexture(canvas)
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping
    tex.repeat.set(30, 30)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 16
    return tex
}

function makeSandNormalTex(size = 512) {
    const canvas = document.createElement('canvas')
    canvas.width = size; canvas.height = size
    const ctx = canvas.getContext('2d')
    const img = ctx.createImageData(size, size)
    const normNoise = createNoise2D(() => 77)

    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const h = normNoise(x * 0.025, y * 0.14) * 0.65
            const hx = normNoise((x + 1) * 0.025, y * 0.14) * 0.65
            const hy = normNoise(x * 0.025, (y + 1) * 0.14) * 0.65
            const nx = Math.max(0, Math.min(255, Math.round(127 + (hx - h) * 220)))
            const ny = Math.max(0, Math.min(255, Math.round(127 + (hy - h) * 220)))
            const i = (y * size + x) * 4
            img.data[i] = nx; img.data[i + 1] = ny; img.data[i + 2] = 255; img.data[i + 3] = 255
        }
    }

    ctx.putImageData(img, 0, 0)
    const tex = new THREE.CanvasTexture(canvas)
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping
    tex.repeat.set(30, 30)
    return tex
}

const SAND_COLOR = makeSandColorTex(1024)
const SAND_NORMAL = makeSandNormalTex(512)

// ─── Sand terrain ────────────────────────────────────────────────────────────
function SandTerrain() {
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
                color="#c4a87a"
                map={SAND_COLOR}
                normalMap={SAND_NORMAL}
                normalScale={new THREE.Vector2(1.2, 1.2)}
                roughness={0.94}
                metalness={0.0}
            />
        </mesh>
    )
}

// ─── Foggy mountains ──────────────────────────────────────────────────────────
const MOUNTAIN_SPECS = [
    { x: 0, z: -195, h: 80, w: 65 }, { x: 90, z: -180, h: 65, w: 60 },
    { x: -90, z: -170, h: 70, w: 70 }, { x: 160, z: -115, h: 55, w: 55 },
    { x: -160, z: -100, h: 60, w: 60 }, { x: 200, z: 15, h: 50, w: 50 },
    { x: -195, z: 30, h: 55, w: 55 }, { x: 170, z: 125, h: 52, w: 55 },
    { x: -165, z: 110, h: 65, w: 65 }, { x: 30, z: 185, h: 45, w: 60 },
]

function Mountain({ x, z, h, w }) {
    const geometry = useMemo(() => {
        const geo = new THREE.ConeGeometry(w, h, 7, 5)
        const pos = geo.attributes.position
        for (let i = 0; i < pos.count; i++) {
            const py = pos.getY(i); const px = pos.getX(i); const pz = pos.getZ(i)
            if (py < h * 0.4) {
                const t = 1 - (py + h / 2) / h
                const n = mountainNoise((px + x) * 0.04, (pz + z) * 0.04)
                pos.setX(i, px + n * w * 0.18 * t)
                pos.setZ(i, pz + mountainNoise((px + x) * 0.07, (pz + z) * 0.07) * w * 0.14 * t)
            }
        }
        geo.computeVertexNormals()
        return geo
    }, [x, z, h, w])

    return (
        <mesh geometry={geometry} position={[x, h * 0.5 - 3, z]} castShadow receiveShadow>
            <meshStandardMaterial color="#8a97a4" roughness={0.9} />
        </mesh>
    )
}

// ─── Flora & Rocks ────────────────────────────────────────────────────────────

// JoshuaTree component is kept as the primary flora
function JoshuaTree({ scale = 1, rotY = 0 }) {
    const model = useLoader(TDSLoader, '/assets/gpx5vko5gcg0-JoshuaTree/JoshuaTree.3ds', (loader) => {
        loader.setResourcePath('/assets/gpx5vko5gcg0-JoshuaTree/')
    })

    // Clone and prepare model for shadow support
    const scene = useMemo(() => {
        const cloned = model.clone()
        cloned.traverse((node) => {
            if (node.isMesh) {
                node.castShadow = true
                node.receiveShadow = true
                // 3DS materials sometimes need a roughness/metalness adjustment for PBR
                if (node.material) {
                    node.material.roughness = 0.8
                    node.material.metalness = 0.1
                }
            }
        })
        return cloned
    }, [model])

    return (
        <group scale={scale * 0.15} rotation={[-Math.PI / 2, 0, rotY]}>
            <primitive object={scene} />
        </group>
    )
}

// ─── Placement Logic with Alignment ───────────────────────────────────────────

function AlignedObject({ x, z, children }) {
    const groupRef = useRef()
    const { h, normal } = useMemo(() => {
        const data = getTerrainData(x, z)
        console.log(`Placing object at [${x}, ${data.h}, ${z}] with normal`, data.normal)
        return data
    }, [x, z])

    useEffect(() => {
        if (groupRef.current) {
            groupRef.current.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal)
        }
    }, [normal])

    return (
        <group ref={groupRef} position={[x, h - 0.05, z]}>
            {children}
        </group>
    )
}

const PLACEMENTS = [
    // Near Ring (20m - 40m)
    { type: 'joshua', x: -35, z: -10, s: 1.1 }, { type: 'joshua', x: 38, z: -5, s: 1.3 },
    { type: 'joshua', x: 10, z: -38, s: 1.0 }, { type: 'joshua', x: -12, z: 40, s: 1.4 },
    { type: 'joshua', x: 35, z: 25, s: 0.9 }, { type: 'joshua', x: -38, z: 25, s: 1.2 },
    { type: 'joshua', x: 20, z: 35, s: 1.1 }, { type: 'joshua', x: -25, z: -35, s: 1.3 },

    // Medium Ring (40m - 60m)
    { type: 'joshua', x: -55, z: -50, s: 1.3 }, { type: 'joshua', x: 60, z: -45, s: 1.5 },
    { type: 'joshua', x: -65, z: 30, s: 1.1 }, { type: 'joshua', x: 70, z: 50, s: 1.4 },
    { type: 'joshua', x: 80, z: -20, s: 1.2 }, { type: 'joshua', x: -75, z: 15, s: 1.0 },
    { type: 'joshua', x: -50, z: 55, s: 1.3 }, { type: 'joshua', x: 55, z: -55, s: 1.1 },

    // Far (60m+)
    { type: 'joshua', x: -90, z: -80, s: 1.6 }, { type: 'joshua', x: 95, z: 85, s: 1.5 },
    { type: 'joshua', x: -110, z: 40, s: 1.4 }, { type: 'joshua', x: 105, z: -45, s: 1.3 },
]

export default function ExteriorScene() {
    return (
        <group>
            <SandTerrain />
            <mesh receiveShadow position={[0.4, -0.06, 4.5]}>
                <boxGeometry args={[28, 0.18, 28]} />
                <meshStandardMaterial color="#9a9490" roughness={0.78} />
            </mesh>

            {PLACEMENTS.map((p, i) => (
                <AlignedObject key={i} x={p.x} z={p.z}>
                    <JoshuaTree scale={p.s} rotY={Math.random() * 6} />
                </AlignedObject>
            ))}

            {MOUNTAIN_SPECS.map((m, i) => (
                <Mountain key={i} {...m} />
            ))}
        </group>
    )
}
