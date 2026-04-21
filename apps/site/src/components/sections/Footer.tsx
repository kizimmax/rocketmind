import { getSiteNav } from "@/lib/site-nav";
import { FooterShell } from "./FooterShell";

export function Footer() {
  const { nav, companyLinks, legalLinks } = getSiteNav();
  return <FooterShell nav={nav} companyLinks={companyLinks} legalLinks={legalLinks} />;
}
