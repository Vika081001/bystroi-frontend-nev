import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    ppr: true,
    dynamicIO: true,
    serverSourceMaps: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'app.tablecrm.com',
        port: '',
        pathname: '/photos/**',
        search: '',
      },],
  },
};

export default nextConfig;
