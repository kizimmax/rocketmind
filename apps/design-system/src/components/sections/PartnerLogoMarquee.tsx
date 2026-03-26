import Image from "next/image";
import type { CSSProperties } from "react";

import type { PartnerLogo } from "@/lib/partner-logos";
import { cn } from "@/lib/utils";

type PartnerLogoMarqueeProps = {
  className?: string;
  logos: PartnerLogo[];
  speedSeconds?: number;
};

function LogoSequence({ logos }: { logos: PartnerLogo[] }) {
  return (
    <div className="flex shrink-0 items-center gap-16 pr-16 lg:gap-20 lg:pr-20">
      {logos.map((logo) => (
        <div
          key={logo.filename}
          className="flex h-[39px] shrink-0 items-center justify-center"
        >
          <Image
            src={logo.src}
            alt={logo.alt}
            width={168}
            height={56}
            className="h-auto max-h-[39px] w-auto max-w-[170px] object-contain opacity-90"
          />
        </div>
      ))}
    </div>
  );
}

export function PartnerLogoMarquee({
  className,
  logos,
  speedSeconds = 24,
}: PartnerLogoMarqueeProps) {
  if (logos.length === 0) {
    return null;
  }

  const marqueeStyle = {
    animation: `hero-marquee ${speedSeconds}s linear infinite`,
  } as CSSProperties;

  return (
    <div
      className={cn(
        "relative h-[58px] overflow-hidden bg-transparent",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/85 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[#0A0A0A] via-[#0A0A0A]/85 to-transparent" />

      <div className="flex w-max items-center" style={marqueeStyle}>
        <LogoSequence logos={logos} />
        <LogoSequence logos={logos} />
      </div>
    </div>
  );
}
