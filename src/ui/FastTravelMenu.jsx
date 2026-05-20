import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import useGalleryStore from '../store/useGalleryStore'
import { Compass, Footprints, MapPin, ChevronDown, ChevronUp } from 'lucide-react'

export default function FastTravelMenu() {
    const isMobile = useGalleryStore((s) => s.isMobile)
    const [collapsed, setCollapsed] = useState(false)
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
        if (isMobile) {
            setCollapsed(true)
        }
    }, [isMobile])

    return (
        <motion.div
            animate={{ opacity: (selectedArtwork || !hudVisible) ? 0 : 1 }}
            transition={{ duration: 0.4 }}
            style={{
                position: 'absolute',
                top: 'var(--panel-top)',
                left: 'var(--panel-left)',
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
                    fontSize: 'var(--panel-header-font-size)', 
                    fontWeight: 'bold', 
                    letterSpacing: '1.2px', 
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    userSelect: 'none',
                    background: 'rgba(0,0,0,0.65)',
                    backdropFilter: 'blur(8px)',
                    padding: 'var(--panel-header-padding)',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    transition: 'all 0.2s',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                    width: 'var(--nav-header-width)'
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
                <span>{isMobile ? 'NAV' : 'NAVIGATION'}</span>
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
                    gap: 'var(--panel-content-gap)',
                    width: 'var(--nav-content-width)'
                }}
            >
                <div style={{ color: '#c8a96e', fontSize: 'var(--nav-subheader-font-size)', fontWeight: 'bold', letterSpacing: '0.8px', marginTop: '4px' }}>
                    MOVEMENT MODE
                </div>
                <div style={{ display: 'flex', gap: 'var(--btn-gap)', marginBottom: '4px' }}>
                    <button
                        onClick={() => setMovementMode('float')}
                        style={{
                            flex: 1,
                            background: movementMode === 'float' ? 'rgba(200, 169, 110, 0.3)' : 'rgba(0, 0, 0, 0.6)',
                            backdropFilter: 'blur(8px)',
                            color: movementMode === 'float' ? '#fff' : 'rgba(255, 255, 255, 0.6)',
                            border: '1px solid',
                            borderColor: movementMode === 'float' ? 'rgba(200, 169, 110, 0.8)' : 'rgba(255, 255, 255, 0.1)',
                            padding: 'var(--btn-padding)',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: 'var(--btn-font-size)',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 'var(--btn-gap)',
                            transition: 'all 0.2s',
                        }}
                    >
                        <Compass style={{ width: 'var(--btn-icon-size)', height: 'var(--btn-icon-size)' }} />
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
                            padding: 'var(--btn-padding)',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: 'var(--btn-font-size)',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 'var(--btn-gap)',
                            transition: 'all 0.2s',
                        }}
                    >
                        <Footprints style={{ width: 'var(--btn-icon-size)', height: 'var(--btn-icon-size)' }} />
                        <span>Ground</span>
                    </button>
                </div>

                <div style={{ color: '#c8a96e', fontSize: 'var(--nav-subheader-font-size)', fontWeight: 'bold', letterSpacing: '0.8px' }}>
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
                            padding: 'var(--nav-btn-padding)',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            textAlign: 'left',
                            fontSize: 'var(--nav-btn-font-size)',
                            letterSpacing: '0.5px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--nav-btn-gap)',
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
                        <MapPin style={{ color: '#c8a96e', flexShrink: 0, width: 'var(--nav-btn-icon-size)', height: 'var(--nav-btn-icon-size)' }} />
                        <span>{loc.name}</span>
                    </button>
                ))}
            </motion.div>
        </motion.div>
    )
}
