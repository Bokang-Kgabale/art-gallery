import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import useGalleryStore from '../store/useGalleryStore'
import { Compass, Footprints, MapPin, ChevronDown, ChevronUp } from 'lucide-react'

export default function FastTravelMenu() {
    const [collapsed, setCollapsed] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const fastTravel = useGalleryStore((s) => s.fastTravel)
    const selectedArtwork = useGalleryStore((s) => s.selectedArtwork)
    const movementMode = useGalleryStore((s) => s.movementMode)
    const setMovementMode = useGalleryStore((s) => s.setMovementMode)
    const hudVisible = useGalleryStore((s) => s.hudVisible)
    const defaultCameraPosition = useGalleryStore((s) => s.defaultCameraPosition)

    const LOCATIONS = [
        { name: 'Outside', position: [8, 2.2, 18], lookAt: [7.96, 2.196, 17.908] },
        { name: 'Inside Gallery', position: [-2, 1.6, 2], lookAt: [-2, 1.6, 1.9] },
    ]

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768)
        }
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    if (isMobile) {
        const handleCycleMovement = () => {
            setMovementMode(movementMode === 'float' ? 'ground' : 'float')
        }

        const handleFastTravelCycle = () => {
            const currentPos = useGalleryStore.getState().defaultCameraPosition || [8, 2.2, 18]
            let closestIndex = 0
            let minDistance = Infinity
            LOCATIONS.forEach((loc, idx) => {
                const dx = loc.position[0] - currentPos[0]
                const dy = loc.position[1] - currentPos[1]
                const dz = loc.position[2] - currentPos[2]
                const dist = Math.sqrt(dx*dx + dy*dy + dz*dz)
                if (dist < minDistance) {
                    minDistance = dist
                    closestIndex = idx
                }
            })
            const nextIndex = (closestIndex + 1) % LOCATIONS.length
            const loc = LOCATIONS[nextIndex]
            fastTravel(loc.position, loc.lookAt)
        }

        // Determine current closest location to show label
        const currentPos = defaultCameraPosition || [8, 2.2, 18]
        let closestIndex = 0
        let minDistance = Infinity
        LOCATIONS.forEach((loc, idx) => {
            const dx = loc.position[0] - currentPos[0]
            const dy = loc.position[1] - currentPos[1]
            const dz = loc.position[2] - currentPos[2]
            const dist = Math.sqrt(dx*dx + dy*dy + dz*dz)
            if (dist < minDistance) {
                minDistance = dist
                closestIndex = idx
            }
        })
        const activeLoc = LOCATIONS[closestIndex]

        return (
            <motion.div
                animate={{ opacity: (selectedArtwork || !hudVisible) ? 0 : 1 }}
                transition={{ duration: 0.4 }}
                style={{
                    position: 'absolute',
                    top: 16,
                    left: 16,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    zIndex: 100,
                    pointerEvents: (selectedArtwork || !hudVisible) ? 'none' : 'auto',
                }}
            >
                {/* Movement Mode Toggle Button */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                        onClick={handleCycleMovement}
                        style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '50%',
                            background: 'rgba(0, 0, 0, 0.65)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: '#c8a96e',
                            backdropFilter: 'blur(8px)',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                            outline: 'none',
                        }}
                    >
                        {movementMode === 'float' ? <Compass size={18} /> : <Footprints size={18} />}
                    </button>
                    <span style={{ 
                        color: '#c8a96e', 
                        fontSize: '10px', 
                        fontWeight: '700', 
                        background: 'rgba(0,0,0,0.65)', 
                        padding: '4px 10px', 
                        borderRadius: '12px', 
                        border: '1px solid rgba(255,255,255,0.08)',
                        backdropFilter: 'blur(8px)',
                        fontFamily: 'monospace',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                        userSelect: 'none'
                    }}>
                        {movementMode}
                    </span>
                </div>

                {/* Fast Travel Location Button */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                        onClick={handleFastTravelCycle}
                        style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '50%',
                            background: 'rgba(0, 0, 0, 0.65)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: '#c8a96e',
                            backdropFilter: 'blur(8px)',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                            outline: 'none',
                        }}
                    >
                        <MapPin size={18} />
                    </button>
                    <span style={{ 
                        color: '#fff', 
                        fontSize: '10px', 
                        fontWeight: '600', 
                        background: 'rgba(0,0,0,0.65)', 
                        padding: '4px 10px', 
                        borderRadius: '12px', 
                        border: '1px solid rgba(255,255,255,0.08)',
                        backdropFilter: 'blur(8px)',
                        fontFamily: 'monospace',
                        letterSpacing: '0.5px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                        userSelect: 'none'
                    }}>
                        {activeLoc.name}
                    </span>
                </div>
            </motion.div>
        )
    }

    return (
        <motion.div
            animate={{ opacity: (selectedArtwork || !hudVisible) ? 0 : 1 }}
            transition={{ duration: 0.4 }}
            style={{
                position: 'absolute',
                top: 28,
                left: 28,
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                zIndex: 100,
                pointerEvents: (selectedArtwork || !hudVisible) ? 'none' : 'auto',
            }}
        >
            {/* Header / Toggle Button */}
            <div 
                onClick={() => setCollapsed(!collapsed)}
                style={{ 
                    color: '#c8a96e', 
                    fontSize: '13px', 
                    fontWeight: 'bold', 
                    letterSpacing: '1.2px', 
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    userSelect: 'none',
                    background: 'rgba(0,0,0,0.65)',
                    backdropFilter: 'blur(8px)',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    transition: 'all 0.2s',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                    width: '200px'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(200, 169, 110, 0.5)'
                    e.currentTarget.style.background = 'rgba(200, 169, 110, 0.15)'
                    e.currentTarget.style.color = '#fff'
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'
                    e.currentTarget.style.background = 'rgba(0,0,0,0.65)'
                    e.currentTarget.style.color = '#c8a96e'
                }}
            >
                <span>NAVIGATION</span>
                {collapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            </div>

            {/* Collapsible Content */}
            <motion.div
                initial={false}
                animate={{ 
                    height: collapsed ? 0 : 'auto',
                    opacity: collapsed ? 0 : 1,
                    marginTop: collapsed ? 0 : 2
                }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                style={{
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    width: '228px'
                }}
            >
                <div style={{ color: '#c8a96e', fontSize: '12px', fontWeight: 'bold', letterSpacing: '0.8px', marginTop: '4px' }}>
                    MOVEMENT MODE
                </div>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '4px' }}>
                    <button
                        onClick={() => setMovementMode('float')}
                        style={{
                            flex: 1,
                            background: movementMode === 'float' ? 'rgba(200, 169, 110, 0.3)' : 'rgba(0, 0, 0, 0.6)',
                            backdropFilter: 'blur(8px)',
                            color: movementMode === 'float' ? '#fff' : 'rgba(255, 255, 255, 0.6)',
                            border: '1px solid',
                            borderColor: movementMode === 'float' ? 'rgba(200, 169, 110, 0.8)' : 'rgba(255, 255, 255, 0.1)',
                            padding: '8px 0',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            transition: 'all 0.2s',
                        }}
                    >
                        <Compass size={14} />
                        <span>Float</span>
                    </button>
                    <button
                        onClick={() => setMovementMode('ground')}
                        style={{
                            flex: 1,
                            background: movementMode === 'ground' ? 'rgba(200, 169, 110, 0.3)' : 'rgba(0, 0, 0, 0.6)',
                            backdropFilter: 'blur(8px)',
                            color: movementMode === 'ground' ? '#fff' : 'rgba(255, 255, 255, 0.6)',
                            border: '1px solid',
                            borderColor: movementMode === 'ground' ? 'rgba(200, 169, 110, 0.8)' : 'rgba(255, 255, 255, 0.1)',
                            padding: '8px 0',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            transition: 'all 0.2s',
                        }}
                    >
                        <Footprints size={14} />
                        <span>Ground</span>
                    </button>
                </div>

                <div style={{ color: '#c8a96e', fontSize: '12px', fontWeight: 'bold', letterSpacing: '0.8px' }}>
                    FAST TRAVEL
                </div>
                {LOCATIONS.map((loc) => (
                    <button
                        key={loc.name}
                        onClick={() => fastTravel(loc.position, loc.lookAt)}
                        style={{
                            background: 'rgba(0, 0, 0, 0.6)',
                            backdropFilter: 'blur(8px)',
                            color: 'rgba(255, 255, 255, 0.8)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            textAlign: 'left',
                            fontSize: '13px',
                            letterSpacing: '0.5px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(200, 169, 110, 0.2)'
                            e.currentTarget.style.borderColor = 'rgba(200, 169, 110, 0.5)'
                            e.currentTarget.style.color = '#fff'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(0, 0, 0, 0.6)'
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'
                        }}
                    >
                        <MapPin size={14} style={{ color: '#c8a96e', flexShrink: 0 }} />
                        <span>{loc.name}</span>
                    </button>
                ))}
            </motion.div>
        </motion.div>
    )
}
