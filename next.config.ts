import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    forceSwcTransforms: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  devIndicators: false,
};

export default nextConfig;