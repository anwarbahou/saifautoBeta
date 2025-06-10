/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias.canvas = false
    config.resolve.alias.encoding = false
    return config
  },
  images: {
    domains: ['randomuser.me', 'fqqdeakracrpezvvvkuy.supabase.co'],
  },
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  }
}

module.exports = nextConfig 