"use client";

import { InfiniteLogoMarquee } from "@rocketmind/ui";
import type { PartnerLogo } from "@/lib/partner-logos";

export function LogoMarqueeSectionClient({ logos }: { logos: PartnerLogo[] }) {
  return (
    <section className="border-t border-border py-8">
      <div className="mx-auto max-w-[1400px]">
        <InfiniteLogoMarquee logos={logos} reverse />
      </div>
    </section>
  );
}
