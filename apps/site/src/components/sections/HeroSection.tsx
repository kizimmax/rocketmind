import { getPartnerLogos } from "@/lib/partner-logos";

import { HeroSectionClient } from "./HeroSectionClient";

export async function HeroSection() {
    const logos = await getPartnerLogos();

    return <HeroSectionClient logos={logos} />;
}
