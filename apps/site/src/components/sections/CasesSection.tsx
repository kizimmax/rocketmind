import type { PartnerLogo } from "@/lib/partner-logos";
import { getPartnerLogos } from "@/lib/partner-logos";
import { getFeaturedCases } from "@/lib/cases";
import { getTestimonials } from "@/lib/testimonials";

import { CasesSectionClient } from "./CasesSectionClient";

export async function CasesSection() {
  let logos: PartnerLogo[] = [];
  try {
    logos = await getPartnerLogos();
  } catch {
    // logos directory not found — render without logos
  }

  const cases = getFeaturedCases();
  const testimonials = getTestimonials();

  if (cases.length === 0) return null;

  return (
    <CasesSectionClient
      logos={logos}
      cases={cases}
      testimonials={testimonials}
    />
  );
}
