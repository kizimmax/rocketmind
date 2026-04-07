"use client";

import { SiteFooter } from "@rocketmind/ui";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function Footer() {
  return <SiteFooter basePath={BASE_PATH} />;
}
