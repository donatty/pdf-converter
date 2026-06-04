'use client'

import { useState, useCallback, useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import type { UploadState, ConvertFormat } from '@/types'
import { FloatingBlobs } from './FloatingBlobs'
import { ConfettiEffect } from './ConfettiEffect'
import { FormatSelector } from './FormatSelector'
import { ProgressBar } from './ProgressBar'

const MAX_SIZE = 20 * 1024 * 1024 // 20MB

export function ConverterApp() {
  const [uploadState, setUploadState] = useState<UploadState>({
    status: 'idle',
    progress: 0,
  })
  const [selectedFormat, setSelectedFormat] = useState<ConvertFormat>('docx')
  const [dragActive, setDragActive] = useState(false)
  const downloadRef = useRef<HTMLAnchorElement>(null)

  const processFile = useCallback(
    async (file: File) => {
      if (!file.name.toLowerCase().endsWith('.pdf')) {
        setUploadState({ status: 'error', progress: 0, error: 'กรุณาเลือกไฟล์ PDF เท่านั้น 📄' })
        return
      }
      if (file.size > MAX_SIZE) {
        setUploadState({ status: 'error', progress: 0, error: 'ไฟล์ใหญ่เกินไป (สูงสุด 20MB) 😅' })
        return
      }

      setUploadState({ status: 'uploading', progress: 10, filename: file.name })

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadState((prev) => ({
          ...prev,
          progress: Math.min(prev.progress + 8, 60),
        }))
      }, 200)

      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('format', selectedFormat)

        clearInterval(progressInterval)
        setUploadState((prev) => ({ ...prev, status: 'converting', progress: 65 }))

        const response = await fetch('/api/convert', {
          method: 'POST',
          body: formData,
        })

        setUploadState((prev) => ({ ...prev, progress: 85 }))

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'การแปลงไฟล์ล้มเหลว')
        }

        const blob = await response.blob()
        const contentDisposition = response.headers.get('Content-Disposition')
        const filenameMatch = contentDisposition?.match(/filename\*=UTF-8''(.+)/)
        const downloadFilename = filenameMatch
          ? decodeURIComponent(filenameMatch[1])
          : file.name.replace(/\.pdf$/i, `.${selectedFormat}`)

        const downloadUrl = URL.createObjectURL(blob)

        setUploadState({
          status: 'success',
          progress: 100,
          filename: file.name,
          downloadUrl,
          downloadFilename,
        })

        // Auto-download
        setTimeout(() => {
          if (downloadRef.current) {
            downloadRef.current.href = downloadUrl
            downloadRef.current.download = downloadFilename
            downloadRef.current.click()
          }
        }, 500)
      } catch (error) {
        clearInterval(progressInterval)
        setUploadState({
          status: 'error',
          progress: 0,
          error: error instanceof Error ? error.message : 'เกิดข้อผิดพลาด กรุณาลองใหม่ 🔄',
        })
      }
    },
    [selectedFormat]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files) => {
      setDragActive(false)
      if (files[0]) processFile(files[0])
    },
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
    disabled: uploadState.status === 'uploading' || uploadState.status === 'converting',
  })

  const reset = () => {
    if (uploadState.downloadUrl) URL.revokeObjectURL(uploadState.downloadUrl)
    setUploadState({ status: 'idle', progress: 0 })
  }

  const isLoading = uploadState.status === 'uploading' || uploadState.status === 'converting'

  return (
    <div className="app-wrapper">
      <FloatingBlobs />
      {uploadState.status === 'success' && <ConfettiEffect />}
      <a ref={downloadRef} style={{ display: 'none' }} />

      <div className="container">
        {/* Header */}
        <header className="header">
          <div className="logo-wrap">
            <span className="logo-icon animate-float">🌸</span>
            <div>
              <h1 className="title">PDF แปลงไฟล์</h1>
              <p className="subtitle">แปลงง่าย รวดเร็ว รองรับภาษาไทย</p>
            </div>
            <span className="logo-icon animate-float-reverse" style={{ animationDelay: '1s' }}>✨</span>
          </div>
        </header>

        {/* Format Selector */}
        <FormatSelector selected={selectedFormat} onChange={setSelectedFormat} disabled={isLoading} />

        {/* Drop Zone */}
        {uploadState.status === 'idle' || uploadState.status === 'error' ? (
          <div
            {...getRootProps()}
            className={`dropzone ${isDragActive || dragActive ? 'dropzone--active' : ''}`}
          >
            <input {...getInputProps()} />
            <div className="dropzone-content">
              <div className={`drop-icon ${isDragActive ? 'animate-bounce-in' : 'animate-float'}`}>
                {isDragActive ? '🎯' : '📋'}
              </div>
              <h2 className="drop-title">
                {isDragActive ? 'วางไฟล์ได้เลย!' : 'ลากไฟล์ PDF มาวางที่นี่'}
              </h2>
              <p className="drop-hint">หรือ <span className="drop-link">คลิกเพื่อเลือกไฟล์</span></p>
              <div className="drop-specs">
                <span>📄 ไฟล์ PDF</span>
                <span>•</span>
                <span>สูงสุด 20MB</span>
                <span>•</span>
                <span>รองรับภาษาไทย</span>
              </div>
            </div>

            {uploadState.status === 'error' && (
              <div className="error-badge">
                <span>⚠️ {uploadState.error}</span>
              </div>
            )}
          </div>
        ) : null}

        {/* Converting state */}
        {isLoading && (
          <div className="converting-card animate-slide-up">
            <div className="converting-icon animate-spin-slow">⚙️</div>
            <h2 className="converting-title">
              {uploadState.status === 'uploading' ? 'กำลังอัปโหลด...' : 'กำลังแปลงไฟล์...'}
            </h2>
            <p className="converting-file">{uploadState.filename}</p>
            <ProgressBar progress={uploadState.progress} />
            <p className="converting-hint">รอสักครู่นะ ~ กำลังทำงาน ✨</p>
          </div>
        )}

        {/* Success state */}
        {uploadState.status === 'success' && (
          <div className="success-card animate-bounce-in">
            <div className="success-icon">🎉</div>
            <h2 className="success-title">แปลงสำเร็จแล้ว!</h2>
            <p className="success-file">{uploadState.downloadFilename}</p>
            <p className="success-hint">ไฟล์ถูกดาวน์โหลดอัตโนมัติแล้ว</p>
            <div className="success-actions">
              <a
                href={uploadState.downloadUrl}
                download={uploadState.downloadFilename}
                className="btn btn-primary"
              >
                💾 ดาวน์โหลดอีกครั้ง
              </a>
              <button onClick={reset} className="btn btn-outline">
                🔄 แปลงไฟล์ใหม่
              </button>
            </div>
          </div>
        )}

        {/* Features */}
        <div className="features">
          {[
            { icon: '🇹🇭', title: 'รองรับไทย', desc: 'ฟอนต์ TH Sarabun New พร้อมใช้' },
            { icon: '🔒', title: 'ปลอดภัย', desc: 'ไม่บันทึกข้อมูลของคุณ' },
            { icon: '⚡', title: 'รวดเร็ว', desc: 'แปลงใน Vercel Edge' },
            { icon: '🆓', title: 'ฟรีทั้งหมด', desc: 'ไม่มีค่าใช้จ่ายซ่อนเร้น' },
          ].map((f, i) => (
            <div
              key={f.title}
              className="feature-card"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <span className="feature-icon">{f.icon}</span>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>

        <footer className="footer">
          <p>สร้างด้วย Next.js 14 + TypeScript 💜</p>
        </footer>
      </div>

      <style>{`
        .app-wrapper {
          min-height: 100vh;
          padding: 24px 16px 48px;
          position: relative;
          overflow: hidden;
        }
        .container {
          max-width: 720px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }
        .header { text-align: center; margin-bottom: 32px; padding-top: 24px; }
        .logo-wrap {
          display: inline-flex;
          align-items: center;
          gap: 16px;
          background: white;
          padding: 16px 28px;
          border-radius: 999px;
          box-shadow: var(--shadow-soft);
        }
        .logo-icon { font-size: 2rem; display: block; }
        .title {
          font-family: 'Mitr', sans-serif;
          font-size: 1.8rem;
          font-weight: 600;
          color: var(--dark);
          line-height: 1.2;
        }
        .subtitle { color: var(--light-text); font-size: 0.9rem; margin-top: 2px; }

        /* Dropzone */
        .dropzone {
          background: white;
          border: 3px dashed var(--lavender);
          border-radius: var(--radius);
          padding: 48px 32px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          box-shadow: var(--shadow-soft);
          position: relative;
          overflow: hidden;
          margin-bottom: 24px;
        }
        .dropzone::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(200,182,226,0.1) 0%, rgba(181,234,215,0.1) 100%);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .dropzone--active {
          border-color: var(--rose);
          border-style: solid;
          transform: scale(1.02);
          box-shadow: var(--shadow-hover), 0 0 0 4px rgba(255,107,157,0.15);
        }
        .dropzone--active::before { opacity: 1; }
        .dropzone:hover:not(.dropzone--active) {
          border-color: var(--mid);
          transform: scale(1.01);
        }
        .dropzone-content { position: relative; z-index: 1; }
        .drop-icon { font-size: 4rem; display: block; margin-bottom: 16px; }
        .drop-title {
          font-family: 'Mitr', sans-serif;
          font-size: 1.4rem;
          font-weight: 500;
          color: var(--dark);
          margin-bottom: 8px;
        }
        .drop-hint { color: var(--light-text); margin-bottom: 16px; }
        .drop-link {
          color: var(--rose);
          font-weight: 600;
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        .drop-specs {
          display: inline-flex;
          gap: 12px;
          align-items: center;
          background: var(--cream);
          padding: 8px 16px;
          border-radius: 999px;
          font-size: 0.8rem;
          color: var(--mid);
        }
        .error-badge {
          margin-top: 16px;
          background: #FFE4E4;
          color: #C0392B;
          padding: 10px 20px;
          border-radius: 999px;
          font-size: 0.9rem;
          display: inline-block;
          animation: slide-up 0.3s ease-out;
        }

        /* Converting */
        .converting-card {
          background: white;
          border-radius: var(--radius);
          padding: 48px 32px;
          text-align: center;
          box-shadow: var(--shadow-soft);
          margin-bottom: 24px;
        }
        .converting-icon { font-size: 3rem; display: block; margin-bottom: 16px; }
        .converting-title {
          font-family: 'Mitr', sans-serif;
          font-size: 1.3rem;
          color: var(--dark);
          margin-bottom: 8px;
        }
        .converting-file { color: var(--light-text); font-size: 0.85rem; margin-bottom: 20px; }
        .converting-hint { color: var(--light-text); font-size: 0.85rem; margin-top: 16px; }

        /* Success */
        .success-card {
          background: linear-gradient(135deg, #FFF0F5 0%, #F0FFF8 100%);
          border: 2px solid var(--mint);
          border-radius: var(--radius);
          padding: 48px 32px;
          text-align: center;
          box-shadow: var(--shadow-soft);
          margin-bottom: 24px;
        }
        .success-icon { font-size: 4rem; display: block; margin-bottom: 16px; }
        .success-title {
          font-family: 'Mitr', sans-serif;
          font-size: 1.6rem;
          color: var(--dark);
          margin-bottom: 8px;
        }
        .success-file {
          color: var(--mid);
          font-size: 0.9rem;
          margin-bottom: 8px;
          font-weight: 500;
        }
        .success-hint { color: var(--light-text); font-size: 0.85rem; margin-bottom: 24px; }
        .success-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }

        /* Buttons */
        .btn {
          padding: 12px 24px;
          border-radius: 999px;
          font-family: 'Sarabun', sans-serif;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
          border: none;
          text-decoration: none;
          display: inline-block;
        }
        .btn:hover { transform: scale(1.05); }
        .btn:active { transform: scale(0.97); }
        .btn-primary {
          background: linear-gradient(135deg, var(--rose), var(--coral));
          color: white;
          box-shadow: 0 4px 16px rgba(255,107,157,0.3);
        }
        .btn-outline {
          background: white;
          color: var(--mid);
          border: 2px solid var(--lavender);
        }

        /* Features */
        .features {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
          margin-bottom: 32px;
        }
        @media (min-width: 600px) {
          .features { grid-template-columns: repeat(4, 1fr); }
        }
        .feature-card {
          background: white;
          border-radius: var(--radius-sm);
          padding: 20px 16px;
          text-align: center;
          box-shadow: var(--shadow-soft);
          transition: transform 0.2s ease;
          animation: slide-up 0.5s ease-out both;
        }
        .feature-card:hover { transform: translateY(-4px); }
        .feature-icon { font-size: 1.8rem; display: block; margin-bottom: 8px; }
        .feature-title {
          font-family: 'Mitr', sans-serif;
          font-size: 0.95rem;
          font-weight: 500;
          color: var(--dark);
          margin-bottom: 4px;
        }
        .feature-desc { font-size: 0.75rem; color: var(--light-text); }

        .footer { text-align: center; color: var(--light-text); font-size: 0.8rem; }
      `}</style>
    </div>
  )
}
