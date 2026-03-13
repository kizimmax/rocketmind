import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/rocketmind-design-system',
  images: { unoptimized: true },
};

export default nextConfig;
