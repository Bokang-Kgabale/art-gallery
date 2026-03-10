import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useGalleryStore from '../store/useGalleryStore'

// ─── Animation variants ────────────────────────────────────────────────────

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.35, ease: 'easeIn' },
  },
}

const panelVariants = {
  hidden: { opacity: 0, x: '100%' },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1], // cubic-out spring feel
      when: 'beforeChildren',
      staggerChildren: 0.08,
    },
  },
  exit: {
    opacity: 0,
    x: '100%',
    transition: { duration: 0.4, ease: [0.55, 0, 1, 0.45] },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
}

const imageVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.55, ease: 'easeOut' },
  },
}

// ─── Component ─────────────────────────────────────────────────────────────

export default function ProjectModal() {
  const artwork = useGalleryStore((s) => s.selectedArtwork)
  const clearArtwork = useGalleryStore((s) => s.clearArtwork)

  // Close on ESC
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') clearArtwork()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [clearArtwork])

  return (
    <AnimatePresence>
      {artwork && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={clearArtwork}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(4px)',
              zIndex: 900,
            }}
          />

          {/* Side panel */}
          <motion.div
            key="panel"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              height: '100vh',
              width: 'min(480px, 100vw)',
              background: 'linear-gradient(160deg, #111 0%, #1c1a17 100%)',
              borderLeft: '1px solid rgba(255,255,255,0.08)',
              overflowY: 'auto',
              zIndex: 1000,
              padding: '0 0 60px 0',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-20px 0 60px rgba(0,0,0,0.6)',
            }}
          >
            {/* Close button */}
            <motion.button
              variants={itemVariants}
              onClick={clearArtwork}
              whileHover={{ scale: 1.15, color: '#ffffff' }}
              whileTap={{ scale: 0.9 }}
              style={{
                alignSelf: 'flex-end',
                margin: '20px 24px 0 0',
                background: 'none',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '50%',
                width: 40,
                height: 40,
                cursor: 'pointer',
                color: 'rgba(255,255,255,0.5)',
                fontSize: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'color 0.2s, border-color 0.2s',
              }}
              aria-label="Close"
            >
              ✕
            </motion.button>

            {/* Artwork image */}
            <motion.div
              variants={imageVariants}
              style={{ padding: '24px 32px 0' }}
            >
              <img
                src={artwork.image}
                alt={artwork.title}
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 8,
                  display: 'block',
                  boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
                }}
              />
            </motion.div>

            {/* Divider line */}
            <motion.div
              variants={itemVariants}
              style={{
                height: 1,
                background:
                  'linear-gradient(90deg, transparent, rgba(200,169,110,0.6), transparent)',
                margin: '28px 32px 0',
              }}
            />

            {/* Category badge */}
            {artwork.category && (
              <motion.div
                variants={itemVariants}
                style={{ padding: '20px 32px 0' }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    background: 'rgba(200,169,110,0.15)',
                    border: '1px solid rgba(200,169,110,0.4)',
                    borderRadius: 4,
                    fontSize: 11,
                    color: '#c8a96e',
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    fontFamily: 'monospace',
                  }}
                >
                  {artwork.category}
                </span>
              </motion.div>
            )}

            {/* Title */}
            <motion.h2
              variants={itemVariants}
              style={{
                padding: '16px 32px 0',
                margin: 0,
                fontSize: 28,
                fontWeight: 700,
                color: '#f0ece4',
                fontFamily: 'Georgia, serif',
                lineHeight: 1.2,
                letterSpacing: '-0.3px',
              }}
            >
              {artwork.title}
            </motion.h2>

            {/* Artist & Year */}
            <motion.div
              variants={itemVariants}
              style={{ padding: '12px 32px 0' }}
            >
              <p style={{ margin: 0, color: '#a09880', fontSize: 15 }}>
                <span style={{ color: '#c8a96e', marginRight: 6 }}>by</span>
                <strong style={{ color: '#d4c9b4', fontWeight: 500 }}>
                  {artwork.artist}
                </strong>
              </p>
              <p
                style={{
                  margin: '4px 0 0',
                  color: '#6b6456',
                  fontSize: 13,
                  fontFamily: 'monospace',
                  letterSpacing: '1px',
                }}
              >
                {artwork.year}
              </p>
            </motion.div>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              style={{
                padding: '20px 32px 0',
                margin: 0,
                color: '#9a9080',
                fontSize: 15,
                lineHeight: 1.75,
              }}
            >
              {artwork.description}
            </motion.p>

            {/* "Return to gallery" link */}
            <motion.div
              variants={itemVariants}
              style={{ padding: '32px 32px 0' }}
            >
              <motion.button
                onClick={clearArtwork}
                whileHover={{ x: -4 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#c8a96e',
                  fontSize: 14,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: 0,
                  fontFamily: 'monospace',
                  letterSpacing: '1px',
                }}
              >
                ← Back to gallery
              </motion.button>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
