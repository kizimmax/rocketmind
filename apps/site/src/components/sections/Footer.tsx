import { getSiteNav } from "@/lib/site-nav";
import { FooterShell } from "./FooterShell";

export function Footer() {
  const { footerNav, companyLinks, legalLinks } = getSiteNav();
  return <FooterShell nav={footerNav} companyLinks={companyLinks} legalLinks={legalLinks} />;
}
