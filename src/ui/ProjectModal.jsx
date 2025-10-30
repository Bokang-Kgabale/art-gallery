import { useEffect } from 'react'

export default function ProjectModal({ artwork, onClose }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  if (!artwork) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        animation: 'fadeIn 0.3s ease',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          padding: '40px',
          borderRadius: '12px',
          maxWidth: '600px',
          width: '90%',
          maxHeight: '80vh',
          overflow: 'auto',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          animation: 'slideUp 0.3s ease',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '15px',
            right: '20px',
            background: 'none',
            border: 'none',
            fontSize: '32px',
            color: '#999',
            cursor: 'pointer',
            transition: 'color 0.2s',
            lineHeight: 1,
          }}
          onMouseOver={(e) => (e.target.style.color = '#333')}
          onMouseOut={(e) => (e.target.style.color = '#999')}
        >
          ×
        </button>

        <div style={{ marginBottom: '20px' }}>
          <img
            src={artwork.image}
            alt={artwork.title}
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: '8px',
              marginBottom: '20px',
            }}
          />
        </div>

        <h2
          style={{
            color: '#333',
            marginBottom: '10px',
            fontSize: '28px',
            fontWeight: 'bold',
          }}
        >
          {artwork.title}
        </h2>

        <div style={{ marginBottom: '20px' }}>
          <p
            style={{
              color: '#666',
              fontSize: '18px',
              marginBottom: '5px',
            }}
          >
            <strong>Artist:</strong> {artwork.artist}
          </p>
          <p
            style={{
              color: '#666',
              fontSize: '18px',
              marginBottom: '5px',
            }}
          >
            <strong>Year:</strong> {artwork.year}
          </p>
          <p
            style={{
              color: '#666',
              fontSize: '16px',
              marginTop: '15px',
              lineHeight: '1.6',
            }}
          >
            {artwork.description}
          </p>
        </div>

        {artwork.category && (
          <div
            style={{
              display: 'inline-block',
              padding: '6px 12px',
              background: '#f0f0f0',
              borderRadius: '4px',
              fontSize: '14px',
              color: '#666',
              textTransform: 'uppercase',
              letterSpacing: '1px',
            }}
          >
            {artwork.category}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
