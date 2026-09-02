/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  webpack: (config, { isServer }) => {
    // Disable disk pack cache in development to prevent ENOENT corruptions on Windows
    if (process.env.NODE_ENV === 'development') {
      config.cache = false;
    }
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/favicon.ico',
        destination: '/api/favicon',
      },
    ];
  },
};

module.exports = nextConfig;
