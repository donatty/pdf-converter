// ===================================================
// Types & Plugin Architecture
// เพิ่ม converter ใหม่ได้ง่ายๆ โดย implement interface นี้
// ===================================================

export type ConvertFormat = 'docx' | 'mp3' | 'txt' | 'html'

export interface ConversionResult {
  success: boolean
  filename: string
  mimeType: string
  buffer?: Buffer
  error?: string
}

export interface ConverterPlugin {
  id: ConvertFormat
  label: string
  labelTh: string
  description: string
  descriptionTh: string
  icon: string
  available: boolean
  comingSoon?: boolean
  convert: (text: string, filename: string) => Promise<ConversionResult>
}

export interface ConvertRequest {
  file: Buffer
  filename: string
  targetFormat: ConvertFormat
}

export interface UploadState {
  status: 'idle' | 'uploading' | 'converting' | 'success' | 'error'
  progress: number
  filename?: string
  error?: string
  downloadUrl?: string
  downloadFilename?: string
}
