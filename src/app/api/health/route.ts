import { NextResponse } from 'next/server'
import { converterRegistry } from '@/lib/converters'

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    converters: converterRegistry.map((c) => ({
      id: c.id,
      label: c.labelTh,
      available: c.available,
      comingSoon: c.comingSoon ?? false,
    })),
  })
}
