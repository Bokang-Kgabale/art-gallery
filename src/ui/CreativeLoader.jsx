import { useProgress } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { isMobileDevice, requestFullscreenAndLockOrientation } from '../utils/device'
import useGalleryStore from '../store/useGalleryStore'

const QUOTES = [
  { text: "The true work of art is but a shadow of the divine perfection.", author: "Michelangelo" },
  { text: "Choose only one master—nature.", author: "Rembrandt" },
  { text: "All works, no matter what or by whom painted, are nothing but bagatelles unless they are made and painted from life.", author: "Caravaggio" },
  { text: "I paint flowers so they will not die.", author: "Frida Kahlo" },
  { text: "Art is the lie that enables us to realize the truth.", author: "Pablo Picasso" },
  { text: "Architecture should speak of its time and place, but yearn for timelessness.", author: "Frank Gehry" },
  { text: "I found I could say things with color and shapes that I couldn't say any other way—things I had no words for.", author: "Georgia O'Keeffe" },
  { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
  { text: "Brutalism is not a style, it is a way of life, an attitude of mind.", author: "Brutalist Manifesto" },
  { text: "An artist is not paid for his labor but for his vision.", author: "James McNeill Whistler" },
  { text: "Space and light and order. Those are the things that men need just as much as they need bread or a place to sleep.", author: "Le Corbusier" },
  { text: "Color is a power which directly influences the soul.", author: "Wassily Kandinsky" }
]

const TELEMETRY_STEPS = [
  { limit: 15, text: "INITIALIZING GEOMETRIC CORE..." },
  { limit: 30, text: "DEPOSITING SAND DUNES & TERRAIN..." },
  { limit: 45, text: "ERECTING RAW CONCRETE WALLS..." },
  { limit: 60, text: "CALIBRATING SUN ELEVATION & LIGHT SEGMENTS..." },
  { limit: 75, text: "SUSPENDING SCULPTURAL SPOTLIGHT CHANNELS..." },
  { limit: 90, text: "HANGING ARTWORK FRAMES AND SERIES..." },
  { limit: 99, text: "OPTIMIZING VOLUMETRIC DUST SHAFTS..." },
  { limit: 100, text: "EXHIBIT CHAMBER SEAL COMPLETE." }
]

export default function CreativeLoader() {
  const { active, progress, item } = useProgress()
  const [quoteIndex, setQuoteIndex] = useState(0)
  const [telemetry, setTelemetry] = useState("INITIALIZING CORE...")
  const [mounted, setMounted] = useState(true)
  const [userClickedEnter, setUserClickedEnter] = useState(false)
  const [smoothedProgress, setSmoothedProgress] = useState(0)

  // Interpolate progress smoothly to avoid sudden jumps
  useEffect(() => {
    const interval = setInterval(() => {
      setSmoothedProgress((prev) => {
        if (prev < progress) {
          const diff = progress - prev
          // Move faster if gap is large, but minimum 0.5% increment for smooth counts
          return Math.min(prev + Math.max(diff * 0.15, 0.4), progress)
        }
        return prev
      })
    }, 16)
    return () => clearInterval(interval)
  }, [progress])

  // Quote rotation carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % QUOTES.length)
    }, 5500)
    return () => clearInterval(interval)
  }, [])

  // Telemetry status tracker
  useEffect(() => {
    const currentStep = TELEMETRY_STEPS.find(step => smoothedProgress <= step.limit)
    if (currentStep) {
      setTelemetry(currentStep.text)
    }
  }, [smoothedProgress])

  // Automatically fade loader out if finished
  const handleEnter = () => {
    setUserClickedEnter(true)

    // Automatically trigger fullscreen and lock orientation on mobile devices
    if (isMobileDevice()) {
      requestFullscreenAndLockOrientation()
    }

    setTimeout(() => {
      setMounted(false)
    }, 800)
  }

  // Auto-enter if asset loaded fast or user is not interactive
  useEffect(() => {
    if (smoothedProgress >= 100 && !active) {
      const timer = setTimeout(() => {
        if (!userClickedEnter) {
          handleEnter()
        }
      }, 1800) // Give user time to read completed status or click themselves
      return () => clearTimeout(timer)
    }
  }, [smoothedProgress, active])

  if (!mounted) return null

  const displayPercent = Math.floor(smoothedProgress)
  const isLoaded = displayPercent >= 100

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: userClickedEnter ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: '#0a090a',
          color: '#fff',
          zIndex: 99999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          fontFamily: "'Inter', sans-serif",
          userSelect: 'none',
        }}
      >
        {/* Subtle architectural background grid */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `
              linear-gradient(rgba(200, 169, 110, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(200, 169, 110, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            backgroundPosition: 'center',
            pointerEvents: 'none',
            zIndex: 0
          }}
        />

        {/* Dynamic vignette border */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            boxShadow: 'inset 0 0 100px rgba(0,0,0,0.95)',
            pointerEvents: 'none',
            zIndex: 1
          }}
        />

        {/* Glassmorphic Core Container */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          style={{
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '90%',
            maxWidth: '560px',
            padding: 'var(--loader-padding)',
            borderRadius: '20px',
            background: 'rgba(15, 14, 15, 0.65)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(200, 169, 110, 0.08)',
            boxShadow: '0 30px 70px rgba(0,0,0,0.6)',
            textAlign: 'center',
          }}
        >
          {/* Title and Subtitle at the Top of the Card */}
          <h2
            style={{
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '5px',
              color: '#c8a96e',
              textTransform: 'uppercase',
              margin: '0 0 6px 0',
              opacity: 0.95
            }}
          >
            SEBAKA ART GALLERY
          </h2>
          <div
            style={{
              fontSize: '8.5px',
              letterSpacing: '3px',
              color: 'rgba(255,255,255,0.4)',
              textTransform: 'uppercase',
              marginBottom: 'var(--loader-margin)'
            }}
          >
            A VIRTUAL BRUTALIST SPACE
          </div>

          {/* Brutalist Blueprint Drafting Board Canvas */}
          <div style={{
            width: '100%',
            aspectRatio: '400 / 330',
            maxHeight: 'var(--blueprint-max-height)',
            position: 'relative',
            marginBottom: 'var(--loader-margin)',
            background: 'rgba(5, 6, 8, 0.75)',
            border: '1px solid rgba(200, 169, 110, 0.12)',
            borderRadius: '6px',
            overflow: 'hidden',
            display: 'var(--blueprint-display)',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'inset 0 0 25px rgba(0, 0, 0, 0.9)',
          }}>
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 400 360"
              style={{ display: 'block' }}
            >
              {/* Defs for blueprint glow filter */}
              <defs>
                <filter id="blueprint-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="1.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Fine CAD Blueprint Grid */}
              {Array.from({ length: 11 }).map((_, i) => (
                <line key={`grid-h-${i}`} x1={15} y1={40 + i * 28} x2={385} y2={40 + i * 28} stroke="rgba(200, 169, 110, 0.04)" strokeWidth={0.5} />
              ))}
              {Array.from({ length: 13 }).map((_, i) => (
                <line key={`grid-v-${i}`} x1={30 + i * 28} y1={20} x2={30 + i * 28} y2={340} stroke="rgba(200, 169, 110, 0.04)" strokeWidth={0.5} />
              ))}

              {/* Technical Drawing Borders */}
              <rect x={15} y={15} width={370} height={330} fill="none" stroke="rgba(200, 169, 110, 0.22)" strokeWidth={1} />
              <rect x={10} y={10} width={380} height={340} fill="none" stroke="rgba(200, 169, 110, 0.08)" strokeWidth={0.5} />
              
              {/* Drafting Compass Crosshair / Target */}
              <circle cx={200} cy={180} r={3} fill="none" stroke="rgba(200, 169, 110, 0.3)" strokeWidth={0.5} />
              <line x1={190} y1={180} x2={210} y2={180} stroke="rgba(200, 169, 110, 0.2)" strokeWidth={0.5} />
              <line x1={200} y1={170} x2={200} y2={190} stroke="rgba(200, 169, 110, 0.2)" strokeWidth={0.5} />

              {/* Dimension Lines (Technical Callouts) */}
              {/* Bottom horizontal: 20.00m */}
              <g style={{ opacity: smoothedProgress >= 20 ? 0.35 : 0, transition: 'opacity 0.8s' }}>
                <line x1={50} y1={45} x2={350} y2={45} stroke="#c8a96e" strokeWidth={0.75} />
                <line x1={50} y1={40} x2={50} y2={50} stroke="#c8a96e" strokeWidth={0.75} />
                <line x1={350} y1={40} x2={350} y2={50} stroke="#c8a96e" strokeWidth={0.75} />
                <text x={200} y={39} textAnchor="middle" fill="#c8a96e" fontSize={8} fontFamily="monospace" letterSpacing={1}>
                  20.00m
                </text>
              </g>

              {/* Left vertical: 18.00m */}
              <g style={{ opacity: smoothedProgress >= 20 ? 0.35 : 0, transition: 'opacity 0.8s' }}>
                <line x1={35} y1={65} x2={35} y2={335} stroke="#c8a96e" strokeWidth={0.75} />
                <line x1={30} y1={65} x2={40} y2={65} stroke="#c8a96e" strokeWidth={0.75} />
                <line x1={30} y1={335} x2={40} y2={335} stroke="#c8a96e" strokeWidth={0.75} />
                <text x={27} y={200} textAnchor="middle" transform="rotate(-90 27 200)" fill="#c8a96e" fontSize={8} fontFamily="monospace" letterSpacing={1}>
                  18.00m
                </text>
              </g>

              {/* Technical Radar / Compass Sweep centered on Column A */}
              <motion.circle
                cx={162.5}
                cy={173}
                r={75}
                stroke="rgba(200, 169, 110, 0.07)"
                strokeWidth={0.75}
                strokeDasharray="4,5"
                fill="none"
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: '162.5px 173px' }}
              />
              <motion.line
                x1={162.5}
                y1={173}
                x2={162.5 + 75}
                y2={173}
                stroke="rgba(200, 169, 110, 0.22)"
                strokeWidth={1}
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: '162.5px 173px' }}
              />

              {/* Architectural Concrete Underlay (Shadow block of walls) */}
              <path
                d="M 77 65 L 350 65 L 350 275 M 260 260 L 350 335 M 275 335 L 77 335 L 77 65"
                fill="none"
                stroke="rgba(200, 169, 110, 0.05)"
                strokeWidth={8}
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Primary Structuring Walls - Drawn sequentially in real-time */}
              <g filter="url(#blueprint-glow)">
                {/* Wall E (Left Wall - perfectly straight to match GalleryScene.jsx) */}
                <motion.path
                  d="M 77 335 L 77 65"
                  fill="none"
                  stroke="#c8a96e"
                  strokeWidth={2}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: Math.min(1, smoothedProgress / 40) }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                />

                {/* Wall A (Bottom Facade) */}
                <motion.path
                  d="M 77 65 L 350 65"
                  fill="none"
                  stroke="#c8a96e"
                  strokeWidth={2}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: Math.min(1, smoothedProgress / 40) }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                />

                {/* Wall B (Right Wall - split for slit windows) */}
                <motion.path
                  d="M 350 65 L 350 97.6"
                  fill="none"
                  stroke="#c8a96e"
                  strokeWidth={2}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: Math.min(1, smoothedProgress / 40) }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                />
                <motion.path
                  d="M 350 104.4 L 350 121.6"
                  fill="none"
                  stroke="#c8a96e"
                  strokeWidth={2}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: Math.min(1, smoothedProgress / 40) }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                />
                <motion.path
                  d="M 350 128.4 L 350 275"
                  fill="none"
                  stroke="#c8a96e"
                  strokeWidth={2}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: Math.min(1, smoothedProgress / 40) }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                />

                {/* Wall C (Angled Facade - starts at Pillar B to match user sketch) */}
                <motion.path
                  d="M 260 260 L 350 335"
                  fill="none"
                  stroke="#c8a96e"
                  strokeWidth={2}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: Math.min(1, smoothedProgress / 40) }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                />

                {/* Wall D (Top Facade) */}
                <motion.path
                  d="M 275 335 L 77 335"
                  fill="none"
                  stroke="#c8a96e"
                  strokeWidth={2}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: Math.min(1, smoothedProgress / 40) }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                />
              </g>

              {/* Slit Windows (Dynamic Cyan Panels) */}
              <g style={{ opacity: smoothedProgress >= 45 ? 0.75 : 0, transition: 'opacity 0.8s' }}>
                {/* Slit 1 */}
                <line x1={348} y1={97.6} x2={348} y2={104.4} stroke="#00d2ff" strokeWidth={0.5} />
                <line x1={352} y1={97.6} x2={352} y2={104.4} stroke="#00d2ff" strokeWidth={0.5} />
                <line x1={350} y1={97.6} x2={350} y2={104.4} stroke="#00d2ff" strokeWidth={1} />
                {/* Slit 2 */}
                <line x1={348} y1={121.6} x2={348} y2={128.4} stroke="#00d2ff" strokeWidth={0.5} />
                <line x1={352} y1={121.6} x2={352} y2={128.4} stroke="#00d2ff" strokeWidth={0.5} />
                <line x1={350} y1={121.6} x2={350} y2={128.4} stroke="#00d2ff" strokeWidth={1} />
                <text x={330} y={115} fill="#00d2ff" fontSize={6} fontFamily="monospace" transform="rotate(-90 330 115)">
                  LIGHT SLITS (0.45m)
                </text>
              </g>

              {/* Cylindrical Concrete Columns (Erected at 30%) */}
              <g style={{ opacity: smoothedProgress >= 30 ? 1 : 0, transition: 'opacity 0.6s' }}>
                {/* Column A (7.5, 7.2) */}
                <circle cx={162.5} cy={173} r={7.1} fill="rgba(200, 169, 110, 0.15)" stroke="#c8a96e" strokeWidth={1.5} />
                <line x1={150} y1={173} x2={175} y2={173} stroke="rgba(200, 169, 110, 0.4)" strokeWidth={0.75} strokeDasharray="3,3" />
                <line x1={162.5} y1={160.5} x2={162.5} y2={185.5} stroke="rgba(200, 169, 110, 0.4)" strokeWidth={0.75} strokeDasharray="3,3" />
                <text x={172} y={168} fill="rgba(255,255,255,0.3)" fontSize={6} fontFamily="monospace">
                  PILLAR A (ø0.94m)
                </text>

                {/* Column B (14.0, 13.0) */}
                <circle cx={260} cy={260} r={7.1} fill="rgba(200, 169, 110, 0.15)" stroke="#c8a96e" strokeWidth={1.5} />
                <line x1={247.5} y1={260} x2={272.5} y2={260} stroke="rgba(200, 169, 110, 0.4)" strokeWidth={0.75} strokeDasharray="3,3" />
                <line x1={260} y1={247.5} x2={260} y2={272.5} stroke="rgba(200, 169, 110, 0.4)" strokeWidth={0.75} strokeDasharray="3,3" />
                <text x={269} y={255} fill="rgba(255,255,255,0.3)" fontSize={6} fontFamily="monospace">
                  PILLAR B (ø0.94m)
                </text>
              </g>

              {/* Hanging Artwork Canvas Outlines (Fades in at 70%) */}
              <g style={{ opacity: smoothedProgress >= 70 ? 0.85 : 0, transition: 'opacity 0.8s' }}>
                {/* ── Wall D: 051 Scarecrow 3-Part Series ── */}
                <rect x={113.75} y={329} width={37.5} height={5} fill="rgba(200, 169, 110, 0.15)" stroke="#c8a96e" strokeWidth={0.75} />
                <rect x={166.25} y={329} width={37.5} height={5} fill="rgba(200, 169, 110, 0.15)" stroke="#c8a96e" strokeWidth={0.75} />
                <rect x={218.75} y={329} width={37.5} height={5} fill="rgba(200, 169, 110, 0.15)" stroke="#c8a96e" strokeWidth={0.75} />
                <line x1={185} y1={320} x2={185} y2={329} stroke="rgba(200, 169, 110, 0.4)" strokeWidth={0.5} strokeDasharray="2,2" />
                <text x={185} y={316} textAnchor="middle" fill="#c8a96e" fontSize={6.5} fontFamily="monospace" letterSpacing={0.5}>
                  051 3-PART SECTIONS
                </text>

                {/* ── Wall E: Minimal Graphite Collection ── */}
                {/* Cashmere (4.5 width) */}
                <g transform="translate(77, 132.5)">
                  <rect x={-2.5} y={-33.75} width={5} height={67.5} fill="rgba(255,255,255,0.06)" stroke="#c8a96e" strokeWidth={0.75} />
                </g>
                {/* Matelasse */}
                <g transform="translate(77, 222.5)">
                  <rect x={-2.5} y={-11.25} width={5} height={22.5} fill="rgba(255,255,255,0.06)" stroke="#c8a96e" strokeWidth={0.75} />
                </g>
                {/* Oyster */}
                <g transform="translate(77, 282.5)">
                  <rect x={-2.5} y={-18} width={5} height={36} fill="rgba(255,255,255,0.06)" stroke="#c8a96e" strokeWidth={0.75} />
                </g>
                <text transform="translate(64, 200) rotate(-90)" fill="rgba(255,255,255,0.4)" fontSize={5.5} fontFamily="monospace" textAnchor="middle">
                  GRAPHITE SERIES
                </text>

                {/* ── Wall B: Digital Art Collection (Tinted glow frames) ── */}
                {/* Galactic Slayer */}
                <rect x={344} y={137} width={5} height={30} fill="rgba(0, 210, 255, 0.1)" stroke="#00d2ff" strokeWidth={0.75} />
                {/* Untitled */}
                <rect x={344} y={177.5} width={5} height={45} fill="rgba(170, 85, 255, 0.1)" stroke="#aa55ff" strokeWidth={0.75} />
                {/* Daystar Reboot */}
                <rect x={344} y={234.5} width={5} height={27} fill="rgba(255, 119, 0, 0.1)" stroke="#ff7700" strokeWidth={0.75} />

                {/* ── Wall A: Gilt Watercolours & Float ── */}
                {/* Mom's Request */}
                <rect x={104} y={66} width={36} height={5} fill="rgba(200, 160, 64, 0.1)" stroke="#c8a040" strokeWidth={0.75} />
                {/* Inception */}
                <rect x={164} y={66} width={30} height={5} fill="rgba(200, 160, 64, 0.1)" stroke="#c8a040" strokeWidth={0.75} />
                {/* Lighthouse */}
                <rect x={293} y={66} width={36} height={5} fill="rgba(68, 170, 255, 0.1)" stroke="#44aaff" strokeWidth={0.75} />
              </g>
            </svg>
          </div>

          {/* Technical Blueprint Log Console */}
          <div
            style={{
              width: '100%',
              height: '75px',
              background: '#040507',
              border: '1px solid rgba(200, 169, 110, 0.15)',
              borderRadius: '6px',
              padding: '10px 14px',
              fontFamily: 'monospace',
              fontSize: '9.5px',
              color: 'rgba(200, 169, 110, 0.85)',
              textAlign: 'left',
              overflowY: 'hidden',
              display: 'var(--console-display)',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              gap: '4px',
              marginBottom: 'var(--console-margin)',
              boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.8)',
            }}
          >
            {TELEMETRY_STEPS.map((step, idx) => {
              const isDone = smoothedProgress >= step.limit
              const isActive = smoothedProgress < step.limit && (idx === 0 || smoothedProgress >= TELEMETRY_STEPS[idx - 1].limit)
              
              if (!isDone && !isActive) return null

              return (
                <div
                  key={`log-${idx}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    opacity: isDone ? 0.45 : 1.0,
                    color: isActive ? '#fff' : '#c8a96e',
                    fontWeight: isActive ? 'bold' : 'normal',
                  }}
                >
                  <span style={{ color: isDone ? '#4ade80' : '#c8a96e' }}>
                    {isDone ? '[ OK ]' : '[ >> ]'}
                  </span>
                  <span>{step.text}</span>
                  {isActive && (
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.3, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }}
                    >
                      ▊
                    </motion.span>
                  )}
                </div>
              )
            })}
          </div>

          {/* Loading Stats Panel (Glowing minimalist progress bar) */}
          <div style={{ width: '100%', marginBottom: 'var(--stats-margin)' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                fontSize: '9.5px',
                fontFamily: 'monospace',
                letterSpacing: '1px',
                color: 'rgba(255,255,255,0.45)',
                marginBottom: '6px'
              }}
            >
              <div style={{ textTransform: 'uppercase', color: '#c8a96e' }}>PROGRESS MATRIX</div>
              <div style={{ fontWeight: 'bold', fontSize: '11px', color: '#fff' }}>{displayPercent}%</div>
            </div>

            <div
              style={{
                width: '100%',
                height: '3px',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '2px',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <motion.div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  height: '100%',
                  background: 'linear-gradient(90deg, #9a8050 0%, #c8a96e 100%)',
                  boxShadow: '0 0 10px rgba(200, 169, 110, 0.4)'
                }}
                animate={{ width: `${displayPercent}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </div>

          {/* Interactive action / carousel section */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              minHeight: 'var(--action-min-height)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderTop: '1px solid rgba(200, 169, 110, 0.08)',
              paddingTop: 'var(--action-padding-top)'
            }}
          >
            <AnimatePresence mode="wait">
              {!isLoaded ? (
                <motion.div
                  key={quoteIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.6 }}
                  style={{
                    fontSize: '11px',
                    lineHeight: '1.6',
                    fontStyle: 'italic',
                    color: 'rgba(255,255,255,0.65)',
                    maxWidth: '480px'
                  }}
                >
                  "{QUOTES[quoteIndex].text}"
                  <span
                    style={{
                      display: 'block',
                      fontStyle: 'normal',
                      fontSize: '9px',
                      fontWeight: 600,
                      color: '#c8a96e',
                      letterSpacing: '1px',
                      marginTop: '6px',
                      textTransform: 'uppercase'
                    }}
                  >
                    — {QUOTES[quoteIndex].author}
                  </span>
                </motion.div>
              ) : (
                <motion.div
                  key="enter-action"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                >
                  <button
                    onClick={handleEnter}
                    disabled={userClickedEnter}
                    style={{
                      background: 'rgba(200, 169, 110, 0.95)',
                      border: '1px solid rgba(200, 169, 110, 1)',
                      color: '#0a090a',
                      padding: 'var(--enter-button-padding)',
                      borderRadius: '30px',
                      fontSize: 'var(--enter-button-font-size)',
                      fontWeight: '800',
                      letterSpacing: '3px',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      boxShadow: '0 10px 30px rgba(200, 169, 110, 0.3)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      outline: 'none',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#ffffff'
                      e.currentTarget.style.borderColor = '#ffffff'
                      e.currentTarget.style.boxShadow = '0 15px 40px rgba(255, 255, 255, 0.3)'
                      e.currentTarget.style.transform = 'translateY(-2px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(200, 169, 110, 0.95)'
                      e.currentTarget.style.borderColor = 'rgba(200, 169, 110, 1)'
                      e.currentTarget.style.boxShadow = '0 10px 30px rgba(200, 169, 110, 0.3)'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}
                  >
                    {userClickedEnter ? 'ENTERING CHAMBER...' : 'ENTER EXHIBITION'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Keyboard shortcut footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 1 }}
          style={{
            position: 'absolute',
            bottom: '24px',
            fontSize: '9px',
            fontFamily: 'monospace',
            letterSpacing: '1px',
            color: 'rgba(255,255,255,0.7)',
            zIndex: 2,
            textAlign: 'center'
          }}
        >
          USE W A S D / TOUCH JOYSTICK TO NAVIGATE &nbsp;|&nbsp; CLICK ARTWORK TO INSPECT
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
