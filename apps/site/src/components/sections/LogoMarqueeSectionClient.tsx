"use client";

import { InfiniteLogoMarquee } from "@rocketmind/ui";
import type { PartnerLogo } from "@/lib/partner-logos";

export function LogoMarqueeSectionClient({ logos }: { logos: PartnerLogo[] }) {
  return (
    <section className="border-t border-border py-8">
      <div className="mx-auto max-w-[1512px] px-5 md:px-8 xl:px-14">
        <InfiniteLogoMarquee logos={logos} reverse />
      </div>
    </section>
  );
}
