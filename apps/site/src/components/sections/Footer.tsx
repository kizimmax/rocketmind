import { getSiteNav } from "@/lib/site-nav";
import { FooterShell } from "./FooterShell";

export async function Footer() {
  const { footerNav, companyLinks, legalLinks } = await getSiteNav();
  return <FooterShell nav={footerNav} companyLinks={companyLinks} legalLinks={legalLinks} />;
}
