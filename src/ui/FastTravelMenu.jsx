import { motion } from 'framer-motion'
import useGalleryStore from '../store/useGalleryStore'

export default function FastTravelMenu() {
    const fastTravel = useGalleryStore((s) => s.fastTravel)
    const selectedArtwork = useGalleryStore((s) => s.selectedArtwork)

    const LOCATIONS = [
        { name: 'Outside', position: [8, 2.2, 18], lookAt: [2, 1.6, 4] },
        { name: 'Inside Gallery', position: [-2, 1.6, 2], lookAt: [-2, 1.6, -2] },
    ]

    return (
        <motion.div
            animate={{ opacity: selectedArtwork ? 0 : 1 }}
            transition={{ duration: 0.4 }}
            style={{
                position: 'absolute',
                top: 28,
                left: 28,
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                zIndex: 100,
                pointerEvents: selectedArtwork ? 'none' : 'auto',
            }}
        >
            <div style={{ color: '#c8a96e', fontSize: '14px', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '4px' }}>
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
                    {loc.name}
                </button>
            ))}
        </motion.div>
    )
}
