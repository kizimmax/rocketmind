"use client";

import { usePathname } from "next/navigation";

import { SITE_URL } from "@/lib/site-url";

export function CanonicalLink() {
  const pathname = usePathname() || "/";
  const path = pathname === "/" ? "/" : pathname.replace(/\/+$/, "");
  const href = `${SITE_URL}${path}`;
  return <link rel="canonical" href={href} />;
}
