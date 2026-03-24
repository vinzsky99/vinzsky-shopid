import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: 'export' udah dihapus biar API bisa jalan
  // distDir: 'out' udah dihapus
  reactStrictMode: false,
  images: {
    unoptimized: true,
  }
};

export default nextConfig;