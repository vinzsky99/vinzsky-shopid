import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = { 
  title: 'VinzSky Shop Ultimate',
  description: 'Software Ultimate by VinzSky'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="antialiased bg-[#020408] text-white overflow-x-hidden">
        {children}
      </body>
    </html>
  )
}