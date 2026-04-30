import { SiteHeader } from "@rocketmind/ui";
import { getSiteNav } from "@/lib/site-nav";
import { getCtaById } from "@/lib/ctas";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function Header() {
  const { nav } = getSiteNav();
  const headerCta = getCtaById("header");
  return (
    <SiteHeader
      basePath={BASE_PATH}
      nav={nav}
      cta={
        headerCta
          ? { buttonText: headerCta.buttonText, formId: headerCta.formId }
          : undefined
      }
    />
  );
}
