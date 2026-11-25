/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [], // add any external image domains if needed
  },

  async rewrites() {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8787';
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;