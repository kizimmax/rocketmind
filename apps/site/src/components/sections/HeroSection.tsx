import { getPartnerLogos } from "@/lib/partner-logos";
import { getHomePage } from "@/lib/unique";
import { getSiteNav } from "@/lib/site-nav";

import { HeroSectionClient } from "./HeroSectionClient";

export async function HeroSection() {
    const logos = await getPartnerLogos();
    const home = await getHomePage();
    const { nav } = await getSiteNav();

    return (
      <HeroSectionClient
        logos={logos}
        title={home.hero?.title ?? ""}
        pikCaption={home.hero?.pikCaption ?? ""}
        rotatingLines={home.hero?.rotatingLines ?? []}
        nav={nav}
      />
    );
}
