import type { PartnerLogo } from "@/lib/partner-logos";
import { getPartnerLogos } from "@/lib/partner-logos";

import { CasesSectionClient } from "./CasesSectionClient";

export async function CasesSection() {
  let logos: PartnerLogo[] = [];
  try {
    logos = await getPartnerLogos();
  } catch {
    // logos directory not found — render without logos
  }

  return <CasesSectionClient logos={logos} />;
}
