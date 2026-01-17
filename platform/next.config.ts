import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // Enable React 19 features
    reactCompiler: false, // Disable for now to avoid build issues
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  typescript: {
    // Allow build to continue even with type errors during development
    ignoreBuildErrors: false,
  },
  eslint: {
    // Allow build to continue even with lint errors during development
    ignoreDuringBuilds: false,
  },
}

export default nextConfig
