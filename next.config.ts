import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    unoptimized: true,
  },
  // INI TAMBAHAN BUAT NGIZININ MIDTRANS JALAN DI WEB LU
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://app.midtrans.com https://api.midtrans.com https://snap-assets.al-pc-id-p.cdn.gtflabs.io https://pay.google.com https://www.googletagmanager.com; frame-src 'self' https://app.midtrans.com; connect-src 'self' https://api.midtrans.com https://app.midtrans.com *.supabase.co;",
          },
        ],
      },
    ]
  },
};

export default nextConfig;