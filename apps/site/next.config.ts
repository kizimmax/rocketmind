import type { NextConfig } from "next";

// Статический экспорт:
// - GitHub Pages: задаётся NEXT_PUBLIC_BASE_PATH
// - Docker/Amvera: задаётся NEXT_STATIC_EXPORT=1
const isStaticExport =
  Boolean(process.env.NEXT_PUBLIC_BASE_PATH) ||
  process.env.NEXT_STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  ...(isStaticExport ? { output: "export" as const } : {}),
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  images: { unoptimized: true },
};

export default nextConfig;
