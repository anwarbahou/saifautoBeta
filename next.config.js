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
}

module.exports = nextConfig 