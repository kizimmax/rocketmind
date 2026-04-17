import type { NextConfig } from "next";

// Статический экспорт включаем только когда CI собирает билд для GitHub Pages
// (там задаётся NEXT_PUBLIC_BASE_PATH). В dev режиме это сильно замедляет
// компиляцию и мешает некоторым HMR-оптимизациям.
const isStaticExport = Boolean(process.env.NEXT_PUBLIC_BASE_PATH);

const nextConfig: NextConfig = {
  ...(isStaticExport ? { output: "export" as const } : {}),
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  images: { unoptimized: true },
};

export default nextConfig;
