import { getPartnerLogos } from "@/lib/partner-logos";
import { getHomePage } from "@/lib/unique";

import { HeroSectionClient } from "./HeroSectionClient";

export async function HeroSection() {
    const logos = await getPartnerLogos();
    const home = getHomePage();

    return (
      <HeroSectionClient
        logos={logos}
        title={home.hero?.title ?? ""}
        pikCaption={home.hero?.pikCaption ?? ""}
        rotatingLines={home.hero?.rotatingLines ?? []}
      />
    );
}
