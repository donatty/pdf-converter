import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx'
import type { ConverterPlugin, ConversionResult } from '@/types'

// ============================
// PDF → Word (.docx) Converter
// รองรับภาษาไทยเต็มรูปแบบ
// ============================

function detectHeading(line: string): { isHeading: boolean; level: 1 | 2 | 3 } {
  const trimmed = line.trim()
  // ตรวจจับหัวข้อจากรูปแบบต่างๆ
  if (trimmed.length < 80 && trimmed.length > 0) {
    if (/^[A-ZÀ-Ÿก-๛\d]/.test(trimmed) && trimmed === trimmed.toUpperCase() && !/[.,:;]$/.test(trimmed)) {
      return { isHeading: true, level: 1 }
    }
    if (/^\d+\.\s/.test(trimmed) || /^[กขคงจฉชซ]\.\s/.test(trimmed)) {
      return { isHeading: true, level: 2 }
    }
  }
  return { isHeading: false, level: 1 }
}

async function convertToDocx(text: string, originalFilename: string): Promise<ConversionResult> {
  try {
    const lines = text.split('\n')
    const paragraphs: Paragraph[] = []

    // Title paragraph
    paragraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: originalFilename.replace(/\.pdf$/i, ''),
            bold: true,
            size: 36,
            font: 'TH Sarabun New',
            color: '2D3748',
          }),
        ],
        heading: HeadingLevel.TITLE,
        spacing: { after: 400 },
      })
    )

    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed) {
        // บรรทัดว่าง → เพิ่ม spacing
        paragraphs.push(new Paragraph({ spacing: { after: 100 } }))
        continue
      }

      const { isHeading, level } = detectHeading(trimmed)

      if (isHeading) {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: trimmed,
                bold: true,
                size: level === 1 ? 28 : 24,
                font: 'TH Sarabun New',
                color: '1A202C',
              }),
            ],
            heading: level === 1 ? HeadingLevel.HEADING_1 : HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 150 },
          })
        )
      } else {
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: trimmed,
                size: 24, // 12pt → รองรับไทย
                font: 'TH Sarabun New',
                color: '2D3748',
              }),
            ],
            alignment: AlignmentType.BOTH, // justify
            spacing: { after: 120, line: 360 }, // 1.5 line spacing
          })
        )
      }
    }

    const doc = new Document({
      creator: 'PDF Converter',
      description: `แปลงจาก ${originalFilename}`,
      styles: {
        paragraphStyles: [
          {
            id: 'Normal',
            name: 'Normal',
            run: { font: 'TH Sarabun New', size: 24 },
          },
        ],
      },
      sections: [
        {
          properties: {
            page: {
              margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }, // 1 inch margins
            },
          },
          children: paragraphs,
        },
      ],
    })

    const buffer = await Packer.toBuffer(doc)
    const filename = originalFilename.replace(/\.pdf$/i, '') + '.docx'

    return {
      success: true,
      filename,
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      buffer,
    }
  } catch (error) {
    return {
      success: false,
      filename: '',
      mimeType: '',
      error: error instanceof Error ? error.message : 'แปลงไฟล์ไม่สำเร็จ',
    }
  }
}

export const docxConverter: ConverterPlugin = {
  id: 'docx',
  label: 'Word Document',
  labelTh: 'ไฟล์ Word',
  description: 'Convert PDF to .docx with Thai font support',
  descriptionTh: 'แปลง PDF เป็นไฟล์ Word รองรับภาษาไทย',
  icon: '📄',
  available: true,
  convert: convertToDocx,
}
