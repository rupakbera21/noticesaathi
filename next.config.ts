import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // Turbopack is default in `next dev`; `next build` uses webpack.
  // If Turbopack fails in dev on Windows, run: next dev --turbopack=false
  experimental: {},
}

export default nextConfig
