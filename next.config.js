/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
  images: {
    remotePatterns: [
      {
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  redirects: async () => {
    return [
      {
        source: '/platform',
        destination: '/platform/staking',
        permanent: true,
      },
      {
        source: '/staking',
        destination: '/platform/staking',
        permanent: true,
      },
    ];
  },
};

// module.exports = nextConfig;

export default nextConfig;
