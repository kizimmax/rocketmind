import { SiteHeader } from "@rocketmind/ui";
import { getSiteNav } from "@/lib/site-nav";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function Header() {
  const { nav } = getSiteNav();
  return <SiteHeader basePath={BASE_PATH} nav={nav} />;
}
