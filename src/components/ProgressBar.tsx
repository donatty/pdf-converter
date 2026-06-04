'use client'

interface Props {
  progress: number
}

export function ProgressBar({ progress }: Props) {
  return (
    <div style={{ width: '100%', maxWidth: 400, margin: '0 auto' }}>
      <div style={{
        background: 'var(--cream)',
        borderRadius: 999,
        height: 12,
        overflow: 'hidden',
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.06)',
      }}>
        <div style={{
          height: '100%',
          width: `${progress}%`,
          background: 'linear-gradient(90deg, var(--lavender), var(--rose), var(--coral))',
          backgroundSize: '200% 100%',
          borderRadius: 999,
          transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          animation: 'shimmer 2s linear infinite',
          boxShadow: '0 2px 8px rgba(255,107,157,0.3)',
        }} />
      </div>
      <p style={{
        textAlign: 'center',
        marginTop: 8,
        fontSize: '0.85rem',
        color: 'var(--mid)',
        fontWeight: 600,
      }}>
        {progress}%
      </p>
    </div>
  )
}
