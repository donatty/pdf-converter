import { Suspense } from 'react'
import { ConverterApp } from '@/components/ConverterApp'

export default function Home() {
  return (
    <main>
      <Suspense fallback={<div>กำลังโหลด...</div>}>
        <ConverterApp />
      </Suspense>
    </main>
  )
}
