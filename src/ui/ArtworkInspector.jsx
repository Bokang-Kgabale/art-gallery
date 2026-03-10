import { useRef, useCallback, useState } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { TextureLoader } from 'three'
import * as THREE from 'three'
import { motion, AnimatePresence } from 'framer-motion'
import useGalleryStore from '../store/useGalleryStore'

// ─── 3-D artwork mesh inside its own canvas ────────────────────────────────
function ArtworkMesh({ imageUrl, rotationRef }) {
    const meshRef = useRef()
    const frameRef = useRef()
    const texture = useLoader(TextureLoader, imageUrl)

    // Apply smoothed drag rotation every frame
    const smoothRot = useRef({ x: 0, y: 0 })

    useFrame((_, delta) => {
        if (!meshRef.current) return
        const lerpFactor = 1 - Math.pow(0.01, delta)

        smoothRot.current.x = THREE.MathUtils.lerp(smoothRot.current.x, rotationRef.current.x, lerpFactor)
        smoothRot.current.y = THREE.MathUtils.lerp(smoothRot.current.y, rotationRef.current.y, lerpFactor)

        meshRef.current.rotation.x = smoothRot.current.x
        meshRef.current.rotation.y = smoothRot.current.y
        if (frameRef.current) {
            frameRef.current.rotation.x = smoothRot.current.x
            frameRef.current.rotation.y = smoothRot.current.y
        }
    })

    return (
        <group>
            {/* Metallic frame behind */}
            <mesh ref={frameRef} position={[0, 0, -0.07]}>
                <boxGeometry args={[3.35, 3.35, 0.12]} />
                <meshStandardMaterial
                    color="#1a1a1a"
                    roughness={0.25}
                    metalness={0.85}
                    envMapIntensity={1.5}
                />
            </mesh>

            {/* Gold inner edge */}
            <mesh ref={null} position={[0, 0, -0.046]}>
                <boxGeometry args={[3.15, 3.15, 0.05]} />
                <meshStandardMaterial
                    color="#c8a96e"
                    roughness={0.3}
                    metalness={0.9}
                    envMapIntensity={2}
                />
            </mesh>

            {/* Artwork plane */}
            <mesh ref={meshRef}>
                <planeGeometry args={[3.0, 3.0]} />
                <meshStandardMaterial
                    map={texture}
                    roughness={0.45}
                    metalness={0.05}
                    envMapIntensity={0.2}
                />
            </mesh>

            {/* Subtle fill lights */}
            <pointLight position={[0, 0, 3]} intensity={1.8} color="#fff8f0" distance={8} />
            <pointLight position={[2, 2, 2]} intensity={0.5} color="#ffd6aa" distance={6} />
            <pointLight position={[-2, -1, 2]} intensity={0.3} color="#aad4ff" distance={6} />
        </group>
    )
}

// ─── Drag overlay — transparent div that intercepts pointer events ─────────
function DragOverlay({ rotationRef, children }) {
    const isDragging = useRef(false)
    const lastPointer = useRef({ x: 0, y: 0 })
    const [dragging, setDragging] = useState(false)

    const onPointerDown = useCallback((e) => {
        isDragging.current = true
        lastPointer.current = { x: e.clientX, y: e.clientY }
        setDragging(true)
        e.currentTarget.setPointerCapture(e.pointerId)
    }, [])

    const onPointerMove = useCallback((e) => {
        if (!isDragging.current) return
        const dx = e.clientX - lastPointer.current.x
        const dy = e.clientY - lastPointer.current.y
        lastPointer.current = { x: e.clientX, y: e.clientY }

        // Sensitivity — radians per pixel
        rotationRef.current.y += dx * 0.012
        rotationRef.current.x += dy * 0.012

        // Clamp vertical rotation
        rotationRef.current.x = THREE.MathUtils.clamp(
            rotationRef.current.x, -Math.PI / 2.2, Math.PI / 2.2
        )
    }, [rotationRef])

    const onPointerUp = useCallback(() => {
        isDragging.current = false
        setDragging(false)
    }, [])

    return (
        <div
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
            style={{
                position: 'absolute',
                inset: 0,
                cursor: dragging ? 'grabbing' : 'grab',
                touchAction: 'none',
                userSelect: 'none',
            }}
        >
            {children}
        </div>
    )
}

// ─── Backdrop + layout variants ────────────────────────────────────────────
const backdropVars = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.35 } },
}

const canvasVars = {
    hidden: { opacity: 0, scale: 0.88, y: 30 },
    visible: {
        opacity: 1, scale: 1, y: 0,
        transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] }
    },
    exit: {
        opacity: 0, scale: 0.9, y: 20,
        transition: { duration: 0.35, ease: 'easeIn' }
    },
}

const infoVars = {
    hidden: { opacity: 0, x: 60 },
    visible: {
        opacity: 1, x: 0,
        transition: {
            duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.15,
            staggerChildren: 0.07, when: 'beforeChildren'
        }
    },
    exit: { opacity: 0, x: 40, transition: { duration: 0.3 } },
}

const rowVars = {
    hidden: { opacity: 0, y: 14 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
}

const hintVars = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6, delay: 0.7 } },
}

// ─── Main Inspector ────────────────────────────────────────────────────────
export default function ArtworkInspector() {
    const artwork = useGalleryStore((s) => s.selectedArtwork)
    const clearArtwork = useGalleryStore((s) => s.clearArtwork)
    const rotationRef = useRef({ x: 0, y: 0 })

    // Reset rotation when artwork changes
    const prevArtwork = useRef(null)
    if (artwork?.id !== prevArtwork.current?.id) {
        rotationRef.current = { x: 0.0, y: -0.25 }
        prevArtwork.current = artwork
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
                        position: 'fixed',
                        inset: 0,
                        zIndex: 800,
                        background: 'rgba(6, 5, 4, 0.97)',
                        backdropFilter: 'blur(8px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 0,
                    }}
                >
                    {/* ── Left: 3-D rotatable artwork ── */}
                    <div style={{
                        position: 'relative', flex: '0 0 auto',
                        width: 'min(55vh, 55vw)', height: 'min(55vh, 55vw)'
                    }}>

                        <motion.div
                            variants={canvasVars}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            style={{
                                width: '100%', height: '100%', borderRadius: 16,
                                overflow: 'hidden',
                                boxShadow: '0 32px 80px rgba(0,0,0,0.85), 0 0 0 1px rgba(200,169,110,0.15)'
                            }}
                        >
                            <Canvas
                                camera={{ position: [0, 0, 5], fov: 42 }}
                                gl={{ antialias: true, alpha: false }}
                                style={{ background: '#0d0c0a' }}
                            >
                                <Environment preset="studio" background={false} />
                                <ArtworkMesh imageUrl={artwork.image} rotationRef={rotationRef} />
                            </Canvas>
                        </motion.div>

                        {/* Transparent drag layer over the canvas */}
                        <DragOverlay rotationRef={rotationRef}>
                            <motion.div
                                variants={hintVars}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                style={{
                                    position: 'absolute',
                                    bottom: 14,
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    background: 'rgba(0,0,0,0.6)',
                                    color: 'rgba(200,169,110,0.9)',
                                    padding: '5px 14px',
                                    borderRadius: 20,
                                    fontSize: 11,
                                    fontFamily: 'monospace',
                                    letterSpacing: '1.5px',
                                    pointerEvents: 'none',
                                    whiteSpace: 'nowrap',
                                    border: '1px solid rgba(200,169,110,0.2)',
                                }}
                            >
                                ⊕ DRAG TO ROTATE
                            </motion.div>
                        </DragOverlay>
                    </div>

                    {/* ── Right: info & close ── */}
                    <motion.div
                        key="inspector-info"
                        variants={infoVars}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        style={{
                            width: 'min(340px, 90vw)',
                            padding: '0 40px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 0,
                        }}
                    >
                        {/* Category badge */}
                        {artwork.category && (
                            <motion.span
                                variants={rowVars}
                                style={{
                                    display: 'inline-block',
                                    padding: '4px 12px',
                                    background: 'rgba(200,169,110,0.12)',
                                    border: '1px solid rgba(200,169,110,0.35)',
                                    borderRadius: 4,
                                    fontSize: 10,
                                    color: '#c8a96e',
                                    textTransform: 'uppercase',
                                    letterSpacing: '2.5px',
                                    fontFamily: 'monospace',
                                    marginBottom: 18,
                                    alignSelf: 'flex-start',
                                }}
                            >
                                {artwork.category}
                            </motion.span>
                        )}

                        {/* Title */}
                        <motion.h2
                            variants={rowVars}
                            style={{
                                margin: '0 0 10px',
                                fontSize: 'clamp(22px, 3vw, 32px)',
                                fontWeight: 700,
                                color: '#f0ece4',
                                fontFamily: 'Georgia, serif',
                                lineHeight: 1.15,
                                letterSpacing: '-0.3px',
                            }}
                        >
                            {artwork.title}
                        </motion.h2>

                        {/* Artist */}
                        <motion.p variants={rowVars}
                            style={{ margin: '0 0 4px', color: '#d4c9b4', fontSize: 15 }}
                        >
                            <span style={{ color: '#c8a96e', marginRight: 6 }}>by</span>
                            <strong style={{ fontWeight: 500 }}>{artwork.artist}</strong>
                        </motion.p>

                        {/* Year */}
                        <motion.p variants={rowVars}
                            style={{
                                margin: '0 0 22px', color: '#6b6456', fontSize: 12,
                                fontFamily: 'monospace', letterSpacing: '1px'
                            }}
                        >
                            {artwork.year}
                        </motion.p>

                        {/* Divider */}
                        <motion.div variants={rowVars}
                            style={{
                                height: 1,
                                background: 'linear-gradient(90deg, rgba(200,169,110,0.5), transparent)',
                                marginBottom: 22
                            }}
                        />

                        {/* Description */}
                        <motion.p variants={rowVars}
                            style={{
                                margin: 0, color: '#9a9080', fontSize: 14,
                                lineHeight: 1.8, marginBottom: 32
                            }}
                        >
                            {artwork.description}
                        </motion.p>

                        {/* Close button */}
                        <motion.button
                            variants={rowVars}
                            onClick={clearArtwork}
                            whileHover={{ x: -5, color: '#c8a96e' }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                                alignSelf: 'flex-start',
                                background: 'none',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: 6,
                                padding: '10px 20px',
                                cursor: 'pointer',
                                color: 'rgba(255,255,255,0.5)',
                                fontSize: 12,
                                fontFamily: 'monospace',
                                letterSpacing: '1.5px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                transition: 'color 0.2s, border-color 0.2s',
                            }}
                        >
                            ← CLOSE
                        </motion.button>
                    </motion.div>

                    {/* ESC key hint top-right */}
                    <motion.div
                        variants={hintVars}
                        initial="hidden"
                        animate="visible"
                        style={{
                            position: 'absolute',
                            top: 24,
                            right: 28,
                            color: 'rgba(255,255,255,0.2)',
                            fontSize: 11,
                            fontFamily: 'monospace',
                            letterSpacing: '1px',
                        }}
                    >
                        ESC to close
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
