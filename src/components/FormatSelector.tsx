'use client'

import type { ConvertFormat } from '@/types'

interface FormatOption {
  id: ConvertFormat
  icon: string
  label: string
  desc: string
  available: boolean
  comingSoon?: boolean
}

const FORMAT_OPTIONS: FormatOption[] = [
  {
    id: 'docx',
    icon: '📄',
    label: 'Word (.docx)',
    desc: 'รองรับภาษาไทย',
    available: true,
  },
  {
    id: 'mp3',
    icon: '🎵',
    label: 'เสียง (MP3)',
    desc: 'อ่านออกเสียง',
    available: false,
    comingSoon: true,
  },
]

interface Props {
  selected: ConvertFormat
  onChange: (format: ConvertFormat) => void
  disabled?: boolean
}

export function FormatSelector({ selected, onChange, disabled }: Props) {
  return (
    <div style={{ marginBottom: 24 }}>
      <p style={{
        fontFamily: "'Mitr', sans-serif",
        fontSize: '0.9rem',
        color: 'var(--mid)',
        marginBottom: 12,
        textAlign: 'center',
        fontWeight: 500,
      }}>
        เลือกรูปแบบที่ต้องการ
      </p>
      <div style={{
        display: 'flex',
        gap: 12,
        justifyContent: 'center',
        flexWrap: 'wrap',
      }}>
        {FORMAT_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            onClick={() => opt.available && !disabled && onChange(opt.id)}
            style={{
              position: 'relative',
              padding: '12px 20px',
              borderRadius: 'var(--radius-sm)',
              border: selected === opt.id && opt.available
                ? '2.5px solid var(--rose)'
                : '2px solid var(--lavender)',
              background: selected === opt.id && opt.available
                ? 'linear-gradient(135deg, #FFF0F5, #F8F0FF)'
                : 'white',
              cursor: opt.available && !disabled ? 'pointer' : 'not-allowed',
              opacity: opt.available ? 1 : 0.65,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              boxShadow: selected === opt.id && opt.available
                ? '0 4px 16px rgba(255,107,157,0.2)'
                : 'var(--shadow-soft)',
              transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
              transform: selected === opt.id && opt.available ? 'scale(1.03)' : 'scale(1)',
              minWidth: 140,
            }}
          >
            <span style={{ fontSize: '1.5rem' }}>{opt.icon}</span>
            <div style={{ textAlign: 'left' }}>
              <div style={{
                fontFamily: "'Mitr', sans-serif",
                fontWeight: 500,
                fontSize: '0.9rem',
                color: 'var(--dark)',
              }}>
                {opt.label}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--light-text)' }}>
                {opt.desc}
              </div>
            </div>
            {opt.comingSoon && (
              <span style={{
                position: 'absolute',
                top: -8,
                right: -8,
                background: 'linear-gradient(135deg, var(--coral), var(--rose))',
                color: 'white',
                fontSize: '0.6rem',
                padding: '2px 7px',
                borderRadius: 999,
                fontWeight: 600,
                fontFamily: "'Sarabun', sans-serif",
                whiteSpace: 'nowrap',
                boxShadow: '0 2px 8px rgba(255,107,157,0.35)',
              }}>
                เร็วๆ นี้
              </span>
            )}
            {selected === opt.id && opt.available && (
              <span style={{
                position: 'absolute',
                top: -8,
                right: -8,
                background: 'var(--rose)',
                color: 'white',
                fontSize: '0.7rem',
                padding: '2px 8px',
                borderRadius: 999,
                fontWeight: 600,
              }}>
                ✓
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
