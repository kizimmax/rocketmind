import Image from "next/image";
import type { CSSProperties } from "react";

import type { PartnerLogo } from "@/lib/partner-logos";
import { cn } from "@/lib/utils";

const logoSizes: Record<string, { width: number; height: number }> = {
  "beeline.svg": { width: 125, height: 24 },
  "rusal.svg": { width: 113, height: 34 },
  "mintsifry.svg": { width: 146, height: 32 },
  "vtb.svg": { width: 90, height: 33 },
  "tbank.svg": { width: 116, height: 37 },
  "rosatom.svg": { width: 109, height: 39 },
};

export type InfiniteLogoMarqueeProps = {
  className?: string;
  logos: PartnerLogo[];
  speedSeconds?: number;
};

// We use pr-[67px] instead of pr-11 so that the gap at the end matches the gap-[67px] between items exactly.
// This allows the infinite scrolling to loop seamlessly.
function LogoSequence({ logos }: { logos: PartnerLogo[] }) {
  return (
    <div className="flex shrink-0 items-center justify-between gap-[67px] py-[10px] pl-1 pr-[67px]">
      {logos.map((logo) => {
        const size = logoSizes[logo.filename] ?? { width: 120, height: 32 };

        return (
          <div
            key={logo.filename}
            className="flex shrink-0 items-center justify-center opacity-90"
          >
            <Image
              src={logo.src}
              alt={logo.alt}
              width={size.width}
              height={size.height}
              className="h-auto w-auto max-h-[39px] object-contain"
            />
          </div>
        );
      })}
    </div>
  );
}

const fadeMaskStyle = {
  maskImage:
    "linear-gradient(90deg, transparent 0, #000 44px, #000 calc(100% - 44px), transparent 100%)",
  WebkitMaskImage:
    "linear-gradient(90deg, transparent 0, #000 44px, #000 calc(100% - 44px), transparent 100%)",
} satisfies CSSProperties;

export function InfiniteLogoMarquee({
  className,
  logos,
  speedSeconds = 14, // 50% faster than previous 28s
}: InfiniteLogoMarqueeProps) {
  if (logos.length === 0) {
    return null;
  }

  const marqueeStyle = {
    "--hero-marquee-duration": `${speedSeconds}s`,
  } as CSSProperties;

  return (
    <div
      data-lens-hide="true"
      className={cn("relative w-full max-w-[1056px] overflow-hidden", className)}
      style={fadeMaskStyle}
    >
      {/* 
        For a seamless loop without jumps, we use two identical sequences and 
        animate from translateX(0) to translateX(-50%).
      */}
      <div className="partner-logo-marquee-track" style={marqueeStyle}>
        <LogoSequence logos={logos} />
        <LogoSequence logos={logos} />
      </div>
    </div>
  );
}
