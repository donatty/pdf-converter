import { docxConverter } from './docx-converter'
import { mp3Converter } from './mp3-converter'
import type { ConverterPlugin, ConvertFormat } from '@/types'

// ============================
// Plugin Registry
// เพิ่ม converter ใหม่ได้ที่นี่
// ============================

export const converterRegistry: ConverterPlugin[] = [
  docxConverter,
  mp3Converter,
  // TODO: เพิ่มตัวแปลงใหม่ตรงนี้
  // txtConverter,
  // htmlConverter,
  // excelConverter,
]

export function getConverter(format: ConvertFormat): ConverterPlugin | undefined {
  return converterRegistry.find((c) => c.id === format)
}

export function getAvailableConverters(): ConverterPlugin[] {
  return converterRegistry.filter((c) => c.available)
}
