import { NextRequest, NextResponse } from 'next/server'
import pdfParse from 'pdf-parse'
import { getConverter } from '@/lib/converters'
import type { ConvertFormat } from '@/types'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const format = (formData.get('format') as ConvertFormat) || 'docx'

    if (!file) {
      return NextResponse.json({ error: 'ไม่พบไฟล์ PDF' }, { status: 400 })
    }

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json({ error: 'กรุณาอัปโหลดไฟล์ PDF เท่านั้น' }, { status: 400 })
    }

    const maxSize = 20 * 1024 * 1024 // 20MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'ไฟล์มีขนาดใหญ่เกินไป (สูงสุด 20MB)' }, { status: 400 })
    }

    // แปลงไฟล์เป็น Buffer
    const arrayBuffer = await file.arrayBuffer()
    const pdfBuffer = Buffer.from(arrayBuffer)

    // สกัดข้อความจาก PDF (รองรับไทย)
    let extractedText = ''
    try {
      const pdfData = await pdfParse(pdfBuffer, {
        // ตัวเลือกสำหรับ PDF ภาษาไทย
        max: 0, // ไม่จำกัดจำนวนหน้า
      })
      extractedText = pdfData.text
    } catch (pdfError) {
      return NextResponse.json(
        { error: 'ไม่สามารถอ่านไฟล์ PDF ได้ อาจเป็นไฟล์ที่ถูกป้องกัน' },
        { status: 422 }
      )
    }

    if (!extractedText.trim()) {
      return NextResponse.json(
        { error: 'PDF ไม่มีข้อความที่สามารถแปลงได้ (อาจเป็นไฟล์สแกน)' },
        { status: 422 }
      )
    }

    // หา converter ที่ตรงกับ format
    const converter = getConverter(format)
    if (!converter) {
      return NextResponse.json({ error: `ไม่รองรับรูปแบบ: ${format}` }, { status: 400 })
    }

    if (!converter.available) {
      return NextResponse.json({ error: `${converter.labelTh} กำลังจะมาเร็วๆ นี้!` }, { status: 503 })
    }

    // แปลงไฟล์
    const result = await converter.convert(extractedText, file.name)

    if (!result.success || !result.buffer) {
      return NextResponse.json({ error: result.error || 'การแปลงไฟล์ล้มเหลว' }, { status: 500 })
    }

    // ส่งไฟล์กลับ
    return new NextResponse(result.buffer, {
      status: 200,
      headers: {
        'Content-Type': result.mimeType,
        'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(result.filename)}`,
        'Content-Length': result.buffer.length.toString(),
        'X-Filename': result.filename,
      },
    })
  } catch (error) {
    console.error('Conversion error:', error)
    return NextResponse.json({ error: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' }, { status: 500 })
  }
}
