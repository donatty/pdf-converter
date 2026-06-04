import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PDF แปลงไฟล์ | PDF Converter',
  description: 'แปลงไฟล์ PDF เป็น Word รองรับภาษาไทย ฟรี ไม่ต้องติดตั้งโปรแกรม',
  keywords: 'pdf to word, แปลง pdf, pdf ภาษาไทย, pdf converter',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Mitr:wght@300;400;500;600&family=Sarabun:ital,wght@0,300;0,400;0,600;1,300&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
