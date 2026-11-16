import type { Metadata, Viewport } from 'next'
import Script from 'next/script' 
import './globals.css'
import Backgrounds from '../components/backgrounds'

export const metadata: Metadata = { 
  title: 'VinzSky-ShopID Software | Premium AI Tools',
  description: 'Pusat Software Ultimate, Upscale Video 4K & Photo High Quality by VinzSky-ShopID',
  verification: {
    google: 't06-ey8FjCn2V9JURjq15uMICY-cApT4fSEAzqvXD3c',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        {/* KODE VERIFIKASI GOOGLE */}
        <meta name="google-site-verification" content="t06-ey8FjCn2V9JURjq15uMICY-cApT4fSEAzqvXD3c" />

        {/* KODE CSP FINAL - IZIN SEMUA JALUR (MIDTRANS + ANALYTICS + SUPABASE) */}
        <meta 
          httpEquiv="Content-Security-Policy" 
          content="script-src 'self' 'unsafe-inline' 'unsafe-eval' https://app.midtrans.com https://api.midtrans.com https://snap-assets.al-pc-id-p.cdn.gtflabs.io https://pay.google.com https://www.googletagmanager.com https://www.google-analytics.com; frame-src 'self' https://app.midtrans.com; connect-src 'self' https://api.midtrans.com https://app.midtrans.com *.supabase.co https://www.google-analytics.com *.google-analytics.com *.analytics.google.com;"
        />
      </head>
      <body className="antialiased bg-[#020408] text-white overflow-x-hidden relative">
        
        {/* BACKGROUND ANIMASI GLOBAL */}
        <Backgrounds />

        {/* GOOGLE ANALYTICS SCRIPT */}
        <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=G-BHEWMFCNCH`}
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
        >
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-BHEWMFCNCH', {
              page_path: window.location.pathname,
            });
          `}
        </Script>

        {children}
      </body>
    </html>
  )
}