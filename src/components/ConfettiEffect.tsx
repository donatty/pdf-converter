'use client'

import { useEffect, useState } from 'react'

const COLORS = ['#FF6B9D', '#FFD4B2', '#C8B6E2', '#B5EAD7', '#FFE4A0', '#C7E9FB', '#FF8B6A']
const SHAPES = ['🌸', '⭐', '✨', '💫', '🎊', '🎉', '🌟', '💕', '🌷']

interface Particle {
  id: number
  x: number
  shape: string
  color: string
  duration: number
  delay: number
  size: number
}

export function ConfettiEffect() {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    const newParticles: Particle[] = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      duration: 2 + Math.random() * 3,
      delay: Math.random() * 1.5,
      size: 0.8 + Math.random() * 1.2,
    }))
    setParticles(newParticles)
    const timer = setTimeout(() => setParticles([]), 5000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 100, overflow: 'hidden' }}>
      {particles.map((p) => (
        <span
          key={p.id}
          style={{
            position: 'absolute',
            top: '-40px',
            left: `${p.x}%`,
            fontSize: `${p.size}rem`,
            animation: `confetti-fall ${p.duration}s ease-in forwards`,
            animationDelay: `${p.delay}s`,
            opacity: 0,
          }}
        >
          {p.shape}
        </span>
      ))}
    </div>
  )
}
