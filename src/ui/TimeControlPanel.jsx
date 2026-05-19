import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import useGalleryStore from '../store/useGalleryStore'
import { Sun, Moon, Sunrise, Sunset, Play, Pause, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react'

export default function TimeControlPanel() {
    const [collapsed, setCollapsed] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const timeOfDay = useGalleryStore((s) => s.timeOfDay)
    const setTimeOfDay = useGalleryStore((s) => s.setTimeOfDay)
    const isTimePaused = useGalleryStore((s) => s.isTimePaused)
    const setTimePaused = useGalleryStore((s) => s.setTimePaused)
    const resetTimeOfDay = useGalleryStore((s) => s.resetTimeOfDay)
    const selectedArtwork = useGalleryStore((s) => s.selectedArtwork)
    const hudVisible = useGalleryStore((s) => s.hudVisible)

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768)
        }
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    // Formats 0-24 hour decimal representation to hh:mm AM/PM format
    const formatTime = (timeDec) => {
        const totalMinutes = Math.floor(timeDec * 60)
        const hrs = Math.floor(totalMinutes / 60)
        const mins = totalMinutes % 60
        const ampm = hrs >= 12 ? 'PM' : 'AM'
        const displayHrs = hrs % 12 === 0 ? 12 : hrs % 12
        const displayMins = mins < 10 ? `0${mins}` : mins
        return `${displayHrs}:${displayMins} ${ampm}`
    }

    // Returns atmospheric stage name based on current hour
    const getTimeStageDetails = (hour) => {
        if (hour >= 5 && hour < 8) return { label: 'Sunrise', icon: Sunrise }
        if (hour >= 8 && hour < 11.5) return { label: 'Morning', icon: Sun }
        if (hour >= 11.5 && hour < 14) return { label: 'Midday', icon: Sun }
        if (hour >= 14 && hour < 17) return { label: 'Afternoon', icon: Sun }
        if (hour >= 17 && hour < 19) return { label: 'Golden Hour', icon: Sunset }
        if (hour >= 19 && hour < 21) return { label: 'Twilight', icon: Moon }
        return { label: 'Night', icon: Moon }
    }

    const presets = [
        { name: 'Sunrise', hour: 6.0, icon: Sunrise },
        { name: 'Midday', hour: 12.0, icon: Sun },
        { name: 'Golden Hour', hour: 17.8, icon: Sunset },
        { name: 'Night', hour: 21.5, icon: Moon }
    ]

    if (isMobile) {
        const stage = getTimeStageDetails(timeOfDay)
        const StageIcon = stage.icon

        const handleCyclePresets = () => {
            let closestIdx = 0
            let minDiff = Infinity
            presets.forEach((preset, index) => {
                const diff = Math.abs(timeOfDay - preset.hour)
                if (diff < minDiff) {
                    minDiff = diff
                    closestIdx = index
                }
            })
            const nextIdx = (closestIdx + 1) % presets.length
            setTimeOfDay(presets[nextIdx].hour)
            setTimePaused(true)
        }

        return (
            <motion.div
                animate={{ opacity: (selectedArtwork || !hudVisible) ? 0 : 1 }}
                transition={{ duration: 0.4 }}
                style={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    zIndex: 100,
                    pointerEvents: (selectedArtwork || !hudVisible) ? 'none' : 'auto',
                }}
            >
                {/* Play/Pause Button */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
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
                        boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                        userSelect: 'none'
                    }}>
                        {isTimePaused ? 'PAUSED' : 'LIVE'}
                    </span>
                    <button
                        onClick={() => setTimePaused(!isTimePaused)}
                        style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '50%',
                            background: isTimePaused ? 'rgba(0, 0, 0, 0.65)' : 'rgba(200, 169, 110, 0.85)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: isTimePaused ? '#c8a96e' : '#0a090a',
                            backdropFilter: 'blur(8px)',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                            outline: 'none',
                        }}
                    >
                        {isTimePaused ? <Play size={16} fill="currentColor" /> : <Pause size={16} fill="currentColor" />}
                    </button>
                </div>

                {/* Atmosphere Preset Cycle Button */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
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
                        letterSpacing: '0.5px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                        userSelect: 'none'
                    }}>
                        {formatTime(timeOfDay)}
                    </span>
                    <button
                        onClick={handleCyclePresets}
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
                        <StageIcon size={18} />
                    </button>
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
                right: 28,
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                zIndex: 100,
                pointerEvents: (selectedArtwork || !hudVisible) ? 'none' : 'auto',
                width: '260px'
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
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
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
                <span>ENVIRONMENT & LIGHTING</span>
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
                    gap: '10px'
                }}
            >
                {/* Main Translucent Control Card */}
                <div
                    style={{
                        background: 'rgba(0, 0, 0, 0.65)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '8px',
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)'
                    }}
                >
                    {/* Time Readout */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ color: '#fff', fontSize: '20px', fontWeight: '500', fontFamily: 'monospace' }}>
                            {formatTime(timeOfDay)}
                        </div>
                        {(() => {
                            const stage = getTimeStageDetails(timeOfDay)
                            const StageIcon = stage.icon
                            return (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#c8a96e', fontSize: '12px', fontWeight: '600', letterSpacing: '0.5px' }}>
                                    <StageIcon size={14} />
                                    <span>{stage.label}</span>
                                </div>
                            )
                        })()}
                    </div>

                    {/* Range Slider */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <input
                            type="range"
                            min="0"
                            max="23.99"
                            step="0.05"
                            value={timeOfDay}
                            onChange={(e) => {
                                setTimeOfDay(parseFloat(e.target.value))
                                // Automatically pause the clock so it doesn't fight manual dragging
                                setTimePaused(true)
                            }}
                            style={{
                                width: '100%',
                                height: '4px',
                                background: 'rgba(255, 255, 255, 0.2)',
                                borderRadius: '2px',
                                outline: 'none',
                                cursor: 'pointer',
                                accentColor: '#c8a96e',
                            }}
                        />
                    </div>

                    {/* Simulation Control Buttons */}
                    <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                        <button
                            onClick={() => setTimePaused(!isTimePaused)}
                            style={{
                                flex: 2,
                                background: isTimePaused ? 'rgba(0, 0, 0, 0.5)' : 'rgba(200, 169, 110, 0.2)',
                                color: isTimePaused ? 'rgba(255, 255, 255, 0.7)' : '#fff',
                                border: '1px solid',
                                borderColor: isTimePaused ? 'rgba(255, 255, 255, 0.15)' : 'rgba(200, 169, 110, 0.5)',
                                padding: '8px 0',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '11px',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                                transition: 'all 0.2s',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = 'rgba(200, 169, 110, 0.8)'
                                e.currentTarget.style.color = '#fff'
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = isTimePaused ? 'rgba(255, 255, 255, 0.15)' : 'rgba(200, 169, 110, 0.5)'
                                e.currentTarget.style.color = isTimePaused ? 'rgba(255, 255, 255, 0.7)' : '#fff'
                            }}
                        >
                            {isTimePaused ? <Play size={12} fill="currentColor" /> : <Pause size={12} fill="currentColor" />}
                            <span>{isTimePaused ? 'Play Time' : 'Pause Time'}</span>
                        </button>
                        
                        <button
                            onClick={resetTimeOfDay}
                            style={{
                                flex: 1,
                                background: 'rgba(0, 0, 0, 0.5)',
                                color: 'rgba(255, 255, 255, 0.7)',
                                border: '1px solid rgba(255, 255, 255, 0.15)',
                                padding: '8px 0',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '11px',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                                transition: 'all 0.2s',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(200, 169, 110, 0.1)'
                                e.currentTarget.style.borderColor = 'rgba(200, 169, 110, 0.5)'
                                e.currentTarget.style.color = '#fff'
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.5)'
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)'
                                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'
                            }}
                        >
                            <RotateCcw size={12} />
                            <span>Reset</span>
                        </button>
                    </div>
                </div>

                {/* Quick Presets Section */}
                <div style={{ color: '#c8a96e', fontSize: '13px', fontWeight: '600', letterSpacing: '0.8px', marginTop: '6px' }}>
                    PRESETS
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                    {presets.map((preset) => {
                        const active = Math.abs(timeOfDay - preset.hour) < 0.15
                        return (
                            <button
                                key={preset.name}
                                onClick={() => {
                                    setTimeOfDay(preset.hour)
                                    setTimePaused(true) // Pause automatically so user can enjoy chosen lighting state
                                }}
                                title={preset.name} // Tooltip showing name
                                style={{
                                    flex: 1,
                                    height: '42px',
                                    background: active ? 'rgba(200, 169, 110, 0.85)' : 'rgba(0, 0, 0, 0.65)',
                                    backdropFilter: 'blur(8px)',
                                    border: '1px solid',
                                    borderColor: active ? '#c8a96e' : 'rgba(255, 255, 255, 0.08)',
                                    borderRadius: '50%',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = active ? 'rgba(200, 169, 110, 1)' : 'rgba(200, 169, 110, 0.25)'
                                    e.currentTarget.style.borderColor = 'rgba(200, 169, 110, 0.6)'
                                    e.currentTarget.style.transform = 'scale(1.1)'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = active ? 'rgba(200, 169, 110, 0.85)' : 'rgba(0, 0, 0, 0.65)'
                                    e.currentTarget.style.borderColor = active ? '#c8a96e' : 'rgba(255, 255, 255, 0.08)'
                                    e.currentTarget.style.transform = 'scale(1.0)'
                                }}
                            >
                                <preset.icon size={18} style={{ color: active ? '#0a090a' : '#c8a96e' }} />
                            </button>
                        )
                    })}
                </div>
            </motion.div>
        </motion.div>
    )
}
