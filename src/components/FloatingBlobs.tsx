'use client'

export function FloatingBlobs() {
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {/* Blob 1 - Lavender */}
      <div style={{
        position: 'absolute', top: '-10%', left: '-10%',
        width: '500px', height: '500px',
        background: 'radial-gradient(circle, rgba(200,182,226,0.35) 0%, transparent 70%)',
        animation: 'blob 8s ease-in-out infinite',
      }} />
      {/* Blob 2 - Peach */}
      <div style={{
        position: 'absolute', top: '30%', right: '-15%',
        width: '450px', height: '450px',
        background: 'radial-gradient(circle, rgba(255,212,178,0.4) 0%, transparent 70%)',
        animation: 'blob 10s ease-in-out infinite reverse',
        animationDelay: '-3s',
      }} />
      {/* Blob 3 - Mint */}
      <div style={{
        position: 'absolute', bottom: '-10%', left: '20%',
        width: '400px', height: '400px',
        background: 'radial-gradient(circle, rgba(181,234,215,0.35) 0%, transparent 70%)',
        animation: 'blob 12s ease-in-out infinite',
        animationDelay: '-6s',
      }} />
      {/* Blob 4 - Sky */}
      <div style={{
        position: 'absolute', top: '60%', left: '-5%',
        width: '300px', height: '300px',
        background: 'radial-gradient(circle, rgba(199,233,251,0.4) 0%, transparent 70%)',
        animation: 'blob 9s ease-in-out infinite reverse',
        animationDelay: '-2s',
      }} />

      {/* Floating decorative elements */}
      {[
        { top: '8%', left: '5%', emoji: '⭐', size: '1.5rem', delay: '0s', duration: '4s' },
        { top: '15%', right: '8%', emoji: '🌷', size: '1.8rem', delay: '1s', duration: '5s' },
        { top: '45%', left: '3%', emoji: '✿', size: '1.4rem', delay: '2s', duration: '6s' },
        { top: '70%', right: '5%', emoji: '🌙', size: '1.6rem', delay: '0.5s', duration: '4.5s' },
        { bottom: '15%', left: '10%', emoji: '🦋', size: '1.5rem', delay: '1.5s', duration: '5.5s' },
        { top: '25%', right: '15%', emoji: '💫', size: '1.2rem', delay: '3s', duration: '3.5s' },
      ].map((el, i) => (
        <span
          key={i}
          style={{
            position: 'absolute',
            top: el.top,
            left: (el as any).left,
            right: (el as any).right,
            bottom: (el as any).bottom,
            fontSize: el.size,
            animation: `float ${el.duration} ease-in-out infinite`,
            animationDelay: el.delay,
            opacity: 0.6,
            userSelect: 'none',
          }}
        >
          {el.emoji}
        </span>
      ))}
    </div>
  )
}
