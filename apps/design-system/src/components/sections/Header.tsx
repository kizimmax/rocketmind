"use client";

import { SiteHeader } from "@rocketmind/ui";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function Header() {
  return <SiteHeader basePath={BASE_PATH} />;
}
