# 🌸 PDF แปลงไฟล์ — PDF Converter

แปลงไฟล์ PDF เป็น Word รองรับภาษาไทย ฟรี ไม่ต้องติดตั้ง
Built with Next.js 14 + TypeScript, deployed on Vercel.

## ✨ Features

- 📄 แปลง PDF → Word (.docx) พร้อมรองรับภาษาไทย (TH Sarabun New)
- 🎵 PDF → MP3 (Coming Soon — โครงสร้างพร้อมแล้ว)
- 🎨 Animation น่ารัก pastel theme
- 🔒 ไม่บันทึกข้อมูล ไม่มีฐานข้อมูล
- ⚡ Deploy บน Vercel Edge

## 🚀 Quick Start

```bash
# 1. Clone
git clone https://github.com/YOUR_USERNAME/pdf-converter.git
cd pdf-converter

# 2. Install
npm install

# 3. Run
npm run dev
```

เปิด http://localhost:3000

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── convert/route.ts    ← API endpoint หลัก
│   │   └── health/route.ts     ← Health check
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ConverterApp.tsx         ← Main UI
│   ├── FloatingBlobs.tsx        ← Background animation
│   ├── ConfettiEffect.tsx       ← Success animation
│   ├── FormatSelector.tsx       ← Format picker
│   └── ProgressBar.tsx         ← Upload progress
├── lib/
│   └── converters/
│       ├── index.ts             ← Plugin registry
│       ├── docx-converter.ts   ← PDF → Word
│       └── mp3-converter.ts    ← PDF → MP3 (stub)
└── types/index.ts               ← TypeScript types
```

## 🔧 เพิ่ม Converter ใหม่ (Plugin Architecture)

### ตัวอย่าง: เพิ่ม PDF → TXT

1. สร้างไฟล์ `src/lib/converters/txt-converter.ts`:

```typescript
import type { ConverterPlugin } from '@/types'

async function convertToTxt(text: string, filename: string) {
  const buffer = Buffer.from(text, 'utf-8')
  return {
    success: true,
    filename: filename.replace(/\.pdf$/i, '.txt'),
    mimeType: 'text/plain',
    buffer,
  }
}

export const txtConverter: ConverterPlugin = {
  id: 'txt',
  label: 'Plain Text',
  labelTh: 'ไฟล์ข้อความ',
  description: 'Convert PDF to plain text',
  descriptionTh: 'แปลง PDF เป็นข้อความธรรมดา',
  icon: '📝',
  available: true,
  convert: convertToTxt,
}
```

2. ลงทะเบียนใน `src/lib/converters/index.ts`:
```typescript
import { txtConverter } from './txt-converter'
export const converterRegistry = [docxConverter, mp3Converter, txtConverter]
```

3. เพิ่มใน `FormatSelector.tsx`:
```typescript
{ id: 'txt', icon: '📝', label: 'ข้อความ (.txt)', desc: 'ข้อความธรรมดา', available: true }
```

### เปิดใช้งาน PDF → MP3 (TTS)

แก้ `src/lib/converters/mp3-converter.ts` — เพิ่ม TTS API:
- Google Cloud Text-to-Speech (รองรับ `th-TH`)
- Azure Cognitive Services
- ElevenLabs API

## 🌐 Deploy to Vercel

```bash
# ติดตั้ง Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

หรือ push ขึ้น GitHub แล้ว import ใน vercel.com

## 📦 Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 14.2 | Framework |
| TypeScript | 5 | Type safety |
| pdf-parse | 1.1.1 | PDF text extraction |
| docx | 8.5 | Word file generation |
| react-dropzone | 14 | Drag & drop UI |
| framer-motion | 11 | Animations |
| Vercel | - | Hosting |

## 📝 License

MIT
