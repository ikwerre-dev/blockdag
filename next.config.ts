import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // allows images from any HTTPS domain
      },
    ],
    unoptimized: false, // ensures Next.js optimizes images on Vercel
  },
  experimental: {
    optimizeCss: true,
  },
}

export default nextConfig