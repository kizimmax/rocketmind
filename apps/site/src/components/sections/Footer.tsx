"use client";

import { SiteFooter } from "@rocketmind/ui";

const BASE_PATH = process.env.NODE_ENV === "production" ? "/rocketmind" : "";

export function Footer() {
  return <SiteFooter basePath={BASE_PATH} />;
}
