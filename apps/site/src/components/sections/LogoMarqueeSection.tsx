import { getPartnerLogos } from "@/lib/partner-logos";
import { LogoMarqueeSectionClient } from "./LogoMarqueeSectionClient";

export async function LogoMarqueeSection() {
  const logos = await getPartnerLogos();
  return <LogoMarqueeSectionClient logos={logos} />;
}
