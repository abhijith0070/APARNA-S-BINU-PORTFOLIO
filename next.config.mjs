/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: '/work',
        destination: '/#work',
        permanent: false,
      },
    ]
  },
}

export default nextConfig
