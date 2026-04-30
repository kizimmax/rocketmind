import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { unoptimized: true },
  // SSR mode — контент читается из PostgreSQL на лету
  // output: "export" убран, сайт теперь серверный
};

export default nextConfig;
