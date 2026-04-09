import type { NextConfig } from "next";

const isGHPages = process.env.GITHUB_PAGES === "1";
const BASE_PATH = isGHPages ? "/rocketmind/cms" : "";

const nextConfig: NextConfig = {
  ...(isGHPages ? { output: "export" } : {}),
  basePath: BASE_PATH,
  env: {
    NEXT_PUBLIC_STATIC: isGHPages ? "1" : "0",
    NEXT_PUBLIC_BASE_PATH: BASE_PATH,
  },
  images: { unoptimized: true },
};

export default nextConfig;
