import { useRef, useCallback, useState } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { TextureLoader } from 'three'
import * as THREE from 'three'
import { motion, AnimatePresence } from 'framer-motion'
import useGalleryStore from '../store/useGalleryStore'

// ─── Inspector frame styles (scaled to inspector canvas size ~3.0 units) ──────

function InspectorFrameDarkOrnate({ accent }) {
    const S = 3.0
    return (
        <>
            <mesh position={[0, 0, -0.18]}>
                <boxGeometry args={[S + 0.42, S + 0.42, 0.28]} />
                <meshStandardMaterial color="#0a0807" roughness={0.55} metalness={0.08} />
            </mesh>
            <mesh position={[0, 0, -0.10]}>
                <boxGeometry args={[S + 0.22, S + 0.22, 0.14]} />
                <meshStandardMaterial color={accent || '#6a4f22'} roughness={0.18} metalness={0.92} envMapIntensity={3} />
            </mesh>
            <mesh position={[0, 0, -0.035]}>
                <boxGeometry args={[S + 0.06, S + 0.06, 0.08]} />
                <meshStandardMaterial color="#060504" roughness={0.7} metalness={0.1} />
            </mesh>
        </>
    )
}

function InspectorFrameMinimal({ accent }) {
    const S = 3.0
    const T = 0.07
    const D = 0.04
    const color = accent || '#7a7a7a'
    return (
        <>
            <mesh position={[0, S / 2 + T / 2, -D / 2]}><boxGeometry args={[S + T * 2, T, D]} /><meshStandardMaterial color={color} roughness={0.08} metalness={0.96} envMapIntensity={2} /></mesh>
            <mesh position={[0, -(S / 2 + T / 2), -D / 2]}><boxGeometry args={[S + T * 2, T, D]} /><meshStandardMaterial color={color} roughness={0.08} metalness={0.96} envMapIntensity={2} /></mesh>
            <mesh position={[-(S / 2 + T / 2), 0, -D / 2]}><boxGeometry args={[T, S, D]} /><meshStandardMaterial color={color} roughness={0.08} metalness={0.96} envMapIntensity={2} /></mesh>
            <mesh position={[S / 2 + T / 2, 0, -D / 2]}><boxGeometry args={[T, S, D]} /><meshStandardMaterial color={color} roughness={0.08} metalness={0.96} envMapIntensity={2} /></mesh>
            <mesh position={[0, 0, -D * 2]}><planeGeometry args={[S + T * 2, S + T * 2]} /><meshStandardMaterial color="#111" roughness={0.9} /></mesh>
        </>
    )
}

function InspectorFrameFloat({ accent }) {
    const S = 3.0
    const T = 0.05
    const glow = accent || '#00aaff'
    return (
        <>
            <mesh position={[0, S / 2 + T / 2, 0.01]}><boxGeometry args={[S + T * 2, T, T]} /><meshStandardMaterial color={glow} emissive={glow} emissiveIntensity={1.2} roughness={0.1} /></mesh>
            <mesh position={[0, -(S / 2 + T / 2), 0.01]}><boxGeometry args={[S + T * 2, T, T]} /><meshStandardMaterial color={glow} emissive={glow} emissiveIntensity={1.2} roughness={0.1} /></mesh>
            <mesh position={[-(S / 2 + T / 2), 0, 0.01]}><boxGeometry args={[T, S, T]} /><meshStandardMaterial color={glow} emissive={glow} emissiveIntensity={1.2} roughness={0.1} /></mesh>
            <mesh position={[S / 2 + T / 2, 0, 0.01]}><boxGeometry args={[T, S, T]} /><meshStandardMaterial color={glow} emissive={glow} emissiveIntensity={1.2} roughness={0.1} /></mesh>
            <mesh position={[0, 0, -0.025]}><planeGeometry args={[S + 0.15, S + 0.15]} /><meshStandardMaterial color="#06060a" roughness={0.9} /></mesh>
            {/* Coloured fill light matching the accent */}
            <pointLight position={[0, 0, 2]} intensity={0.8} color={glow} distance={6} />
        </>
    )
}

function InspectorFrameGilt({ accent }) {
    const S = 3.0
    const gold = accent || '#c8a040'
    return (
        <>
            <mesh position={[0, 0, -0.16]}>
                <boxGeometry args={[S + 0.52, S + 0.52, 0.24]} />
                <meshStandardMaterial color={gold} roughness={0.18} metalness={0.92} envMapIntensity={4} />
            </mesh>
            <mesh position={[0, 0, -0.07]}>
                <boxGeometry args={[S + 0.14, S + 0.14, 0.10]} />
                <meshStandardMaterial color="#1a1208" roughness={0.6} metalness={0.2} />
            </mesh>
            <mesh position={[0, 0, -0.022]}>
                <boxGeometry args={[S + 0.10, S + 0.10, 0.045]} />
                <meshStandardMaterial color="#f0ebe0" roughness={0.92} metalness={0.0} />
            </mesh>
        </>
    )
}

// ─── 3-D artwork mesh ─────────────────────────────────────────────────────────
function ArtworkMesh({ imageUrl, rotationRef, frameStyle, frameAccent }) {
    const meshRef   = useRef()
    const groupRef  = useRef()
    const texture   = useLoader(TextureLoader, imageUrl)

    const smoothRot = useRef({ x: 0, y: 0 })

    useFrame((_, delta) => {
        if (!groupRef.current) return
        const lerpFactor = 1 - Math.pow(0.01, delta)
        smoothRot.current.x = THREE.MathUtils.lerp(smoothRot.current.x, rotationRef.current.x, lerpFactor)
        smoothRot.current.y = THREE.MathUtils.lerp(smoothRot.current.y, rotationRef.current.y, lerpFactor)
        groupRef.current.rotation.x = smoothRot.current.x
        groupRef.current.rotation.y = smoothRot.current.y
    })

    const FrameComp = {
        'minimal':     InspectorFrameMinimal,
        'float':       InspectorFrameFloat,
        'gilt':        InspectorFrameGilt,
        'dark-ornate': InspectorFrameDarkOrnate,
    }[frameStyle] ?? InspectorFrameDarkOrnate

    return (
        <group ref={groupRef}>
            <FrameComp accent={frameAccent} />

            {/* ── Artwork canvas ── */}
            <mesh ref={meshRef}>
                <planeGeometry args={[2.9, 2.9]} />
                <meshStandardMaterial
                    map={texture}
                    roughness={frameStyle === 'float' ? 0.3 : 0.5}
                    metalness={0.04}
                    envMapIntensity={0.15}
                />
            </mesh>

            {/* Lights */}
            <pointLight position={[0, 0, 3.5]} intensity={2.2} color="#fff8f0" distance={10} />
            <pointLight position={[3, 2.5, 2]} intensity={0.6} color="#ffd6a0" distance={7} />
            <pointLight position={[-3, -1.5, 2]} intensity={0.3} color="#aad4ff" distance={6} />
        </group>
    )
}

// ─── Motion variants ──────────────────────────────────────────────────────────
const backdropVars = {
    hidden:  { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.45 } },
    exit:    { opacity: 0, transition: { duration: 0.3 } },
}
const canvasVars = {
    hidden:  { opacity: 0, scale: 0.88, y: 28 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
    exit:    { opacity: 0, scale: 0.9,  y: 20, transition: { duration: 0.3, ease: 'easeIn' } },
}
const infoVars = {
    hidden:  { opacity: 0, x: 55 },
    visible: { opacity: 1, x: 0,  transition: { duration: 0.5, ease: [0.22,1,0.36,1], delay: 0.12, staggerChildren: 0.07, when: 'beforeChildren' } },
    exit:    { opacity: 0, x: 40, transition: { duration: 0.28 } },
}
const rowVars = {
    hidden:  { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0,  transition: { duration: 0.32, ease: 'easeOut' } },
}
const hintVars = {
    hidden:  { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, delay: 0.6 } },
}

// ─── Shared button style ──────────────────────────────────────────────────────
const btnBase = {
    border: '1px solid rgba(200,169,110,0.3)',
    borderRadius: 6,
    padding: '8px 16px',
    cursor: 'pointer',
    fontSize: 11,
    fontFamily: 'monospace',
    letterSpacing: '1.5px',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    transition: 'all 0.2s',
}

// ─── Main Inspector ───────────────────────────────────────────────────────────
export default function ArtworkInspector() {
    const artwork     = useGalleryStore((s) => s.selectedArtwork)
    const clearArtwork = useGalleryStore((s) => s.clearArtwork)

    // rotation target driven by drag (only when freelook is on)
    const rotationRef = useRef({ x: 0, y: 0 })

    // Lock state — locked = artwork is fixed, no drag
    const [freeLook, setFreeLook] = useState(false)

    // Reset rotation + lock when artwork changes
    const prevId = useRef(null)
    if (artwork?.id !== prevId.current) {
        rotationRef.current = { x: 0, y: 0 }
        prevId.current = artwork?.id ?? null
        // auto-lock whenever a new piece is opened
    }

    // ── Drag handlers (only active in free-look mode) ─────────────────────────
    const isDragging   = useRef(false)
    const lastPointer  = useRef({ x: 0, y: 0 })
    const [dragging, setDragging] = useState(false)

    const onPointerDown = useCallback((e) => {
        if (!freeLook) return
        isDragging.current = true
        lastPointer.current = { x: e.clientX, y: e.clientY }
        setDragging(true)
        e.currentTarget.setPointerCapture(e.pointerId)
    }, [freeLook])

    const onPointerMove = useCallback((e) => {
        if (!isDragging.current || !freeLook) return
        const dx = e.clientX - lastPointer.current.x
        const dy = e.clientY - lastPointer.current.y
        lastPointer.current = { x: e.clientX, y: e.clientY }

        rotationRef.current.y += dx * 0.010
        rotationRef.current.x += dy * 0.010
        rotationRef.current.x  = THREE.MathUtils.clamp(rotationRef.current.x, -Math.PI / 2.4, Math.PI / 2.4)
    }, [freeLook])

    const onPointerUp = useCallback(() => {
        isDragging.current = false
        setDragging(false)
    }, [])

    const handleReset = () => {
        rotationRef.current = { x: 0, y: 0 }
        setFreeLook(false)
    }

    return (
        <AnimatePresence>
            {artwork && (
                <motion.div
                    key="inspector-backdrop"
                    variants={backdropVars}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    style={{
                        position: 'fixed', inset: 0, zIndex: 800,
                        background: 'rgba(6,5,4,0.97)',
                        backdropFilter: 'blur(10px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 0,
                    }}
                >
                    {/* ── Left: 3-D artwork ── */}
                    <div style={{ position: 'relative', flex: '0 0 auto', width: 'min(54vh,54vw)', height: 'min(54vh,54vw)' }}>

                        <motion.div
                            variants={canvasVars} initial="hidden" animate="visible" exit="exit"
                            style={{
                                width: '100%', height: '100%', borderRadius: 12, overflow: 'hidden',
                                boxShadow: '0 40px 100px rgba(0,0,0,0.9), 0 0 0 1px rgba(200,169,110,0.18)',
                            }}
                        >
                            <Canvas
                                camera={{ position: [0, 0, 5.2], fov: 40 }}
                                gl={{ antialias: true, alpha: false }}
                                style={{ background: '#0a0908' }}
                            >
                                <Environment preset="studio" background={false} />
                                <ArtworkMesh 
                                    imageUrl={artwork.image} 
                                    rotationRef={rotationRef} 
                                    frameStyle={artwork.frameStyle}
                                    frameAccent={artwork.frameAccent}
                                />
                            </Canvas>
                        </motion.div>

                        {/* Drag capture layer — only active in free-look */}
                        <div
                            onPointerDown={onPointerDown}
                            onPointerMove={onPointerMove}
                            onPointerUp={onPointerUp}
                            onPointerLeave={onPointerUp}
                            style={{
                                position: 'absolute', inset: 0,
                                cursor: freeLook ? (dragging ? 'grabbing' : 'grab') : 'default',
                                touchAction: 'none', userSelect: 'none',
                            }}
                        />

                        {/* ── Bottom controls bar ── */}
                        <motion.div
                            variants={hintVars} initial="hidden" animate="visible"
                            style={{
                                position: 'absolute', bottom: 14, left: '50%',
                                transform: 'translateX(-50%)',
                                display: 'flex', gap: 8, alignItems: 'center',
                            }}
                        >
                            {/* Free-look toggle */}
                            <button
                                onClick={() => setFreeLook(f => !f)}
                                style={{
                                    ...btnBase,
                                    background: freeLook
                                        ? 'rgba(200,169,110,0.18)'
                                        : 'rgba(0,0,0,0.65)',
                                    color: freeLook ? '#c8a96e' : 'rgba(255,255,255,0.45)',
                                    borderColor: freeLook ? 'rgba(200,169,110,0.55)' : 'rgba(255,255,255,0.12)',
                                }}
                            >
                                {freeLook ? '⊕ ROTATE ON' : '⊕ ROTATE'}
                            </button>

                            {/* Reset — only visible in free-look */}
                            <AnimatePresence>
                                {freeLook && (
                                    <motion.button
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        transition={{ duration: 0.2 }}
                                        onClick={handleReset}
                                        style={{
                                            ...btnBase,
                                            background: 'rgba(0,0,0,0.65)',
                                            color: 'rgba(255,255,255,0.45)',
                                            borderColor: 'rgba(255,255,255,0.12)',
                                        }}
                                    >
                                        ↺ RESET
                                    </motion.button>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>

                    {/* ── Right: info panel ── */}
                    <motion.div
                        key="inspector-info"
                        variants={infoVars} initial="hidden" animate="visible" exit="exit"
                        style={{ width: 'min(340px,90vw)', padding: '0 40px', display: 'flex', flexDirection: 'column', gap: 0 }}
                    >
                        {/* Medium badge */}
                        {artwork.medium && (
                            <motion.span variants={rowVars} style={{
                                display: 'inline-block', padding: '4px 12px',
                                background: 'rgba(200,169,110,0.10)',
                                border: '1px solid rgba(200,169,110,0.3)',
                                borderRadius: 4, fontSize: 10, color: '#c8a96e',
                                textTransform: 'uppercase', letterSpacing: '2.5px',
                                fontFamily: 'monospace', marginBottom: 18, alignSelf: 'flex-start',
                            }}>
                                {artwork.medium}
                            </motion.span>
                        )}

                        {/* Title */}
                        <motion.h2 variants={rowVars} style={{
                            margin: '0 0 10px',
                            fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 700,
                            color: '#f0ece4', fontFamily: 'Georgia, serif',
                            lineHeight: 1.15, letterSpacing: '-0.3px',
                        }}>
                            {artwork.title}
                        </motion.h2>

                        {/* Artist */}
                        <motion.p variants={rowVars} style={{ margin: '0 0 4px', color: '#d4c9b4', fontSize: 15 }}>
                            <span style={{ color: '#c8a96e', marginRight: 6 }}>by</span>
                            <strong style={{ fontWeight: 500 }}>{artwork.artist}</strong>
                        </motion.p>

                        {/* Year */}
                        {artwork.year && (
                            <motion.p variants={rowVars} style={{
                                margin: '0 0 22px', color: '#6b6456',
                                fontSize: 12, fontFamily: 'monospace', letterSpacing: '1px',
                            }}>
                                {artwork.year}
                            </motion.p>
                        )}

                        {/* Divider */}
                        <motion.div variants={rowVars} style={{
                            height: 1,
                            background: 'linear-gradient(90deg, rgba(200,169,110,0.5), transparent)',
                            margin: '4px 0 22px',
                        }} />

                        {/* Description */}
                        <motion.p variants={rowVars} style={{
                            margin: '0 0 32px', color: '#9a9080',
                            fontSize: 14, lineHeight: 1.85,
                        }}>
                            {artwork.description}
                        </motion.p>

                        {/* Close */}
                        <motion.button
                            variants={rowVars}
                            onClick={clearArtwork}
                            whileHover={{ x: -4, color: '#c8a96e' }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                                alignSelf: 'flex-start', background: 'none',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: 6, padding: '10px 20px',
                                cursor: 'pointer', color: 'rgba(255,255,255,0.5)',
                                fontSize: 12, fontFamily: 'monospace',
                                letterSpacing: '1.5px',
                                display: 'flex', alignItems: 'center', gap: 8,
                                transition: 'color 0.2s, border-color 0.2s',
                            }}
                        >
                            ← CLOSE
                        </motion.button>
                    </motion.div>

                    {/* ESC hint */}
                    <motion.div
                        variants={hintVars} initial="hidden" animate="visible"
                        style={{
                            position: 'absolute', top: 24, right: 28,
                            color: 'rgba(255,255,255,0.18)', fontSize: 11,
                            fontFamily: 'monospace', letterSpacing: '1px',
                        }}
                    >
                        ESC to close
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
