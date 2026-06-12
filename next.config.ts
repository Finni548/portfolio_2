import type {NextConfig} from 'next'

const nextConfig: NextConfig = {
  serverExternalPackages: ['sanity', '@sanity/vision'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
}

export default nextConfig
