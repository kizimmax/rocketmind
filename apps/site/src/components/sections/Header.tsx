"use client";

import { SiteHeader } from "@rocketmind/ui";

const BASE_PATH = process.env.NODE_ENV === "production" ? "/rocketmind" : "";

export function Header() {
  return <SiteHeader basePath={BASE_PATH} />;
}
