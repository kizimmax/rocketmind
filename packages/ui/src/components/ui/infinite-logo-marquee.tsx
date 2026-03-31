import type { CSSProperties } from "react";

import { cn } from "../../lib/utils";

export type LogoMarqueeItem = {
  alt: string;
  src: string;
  width?: number;
  height?: number;
};

export type InfiniteLogoMarqueeProps = {
  className?: string;
  logos: LogoMarqueeItem[];
  /** Duration of one full loop in seconds. Default: 25 */
  speedSeconds?: number;
  /** Gap between logos in pixels. Default: 67 */
  gap?: number;
  /** Maximum logo height in pixels. Default: 39 */
  maxLogoHeight?: number;
  /** Width of the fade mask on each edge in pixels. Default: 44 */
  fadeWidth?: number;
  /** Reverse scroll direction (left-to-right). Default: false */
  reverse?: boolean;
};

function LogoSequence({
  logos,
  gap,
  maxLogoHeight,
}: {
  logos: LogoMarqueeItem[];
  gap: number;
  maxLogoHeight: number;
}) {
  return (
    <div
      className="flex shrink-0 items-center py-[10px] pl-1"
      style={{ gap: `${gap}px`, paddingRight: `${gap}px` }}
    >
      {logos.map((logo) => (
        <div
          key={logo.src}
          className="flex shrink-0 items-center justify-center opacity-90"
        >
          <img
            src={logo.src}
            alt={logo.alt}
            width={logo.width}
            height={logo.height}
            loading="lazy"
            className="h-auto w-auto object-contain"
            style={{ maxHeight: `${maxLogoHeight}px` }}
          />
        </div>
      ))}
    </div>
  );
}

const buildFadeMask = (fadeWidth: number): CSSProperties => ({
  maskImage: `linear-gradient(90deg, transparent 0, #000 ${fadeWidth}px, #000 calc(100% - ${fadeWidth}px), transparent 100%)`,
  WebkitMaskImage: `linear-gradient(90deg, transparent 0, #000 ${fadeWidth}px, #000 calc(100% - ${fadeWidth}px), transparent 100%)`,
});

export function InfiniteLogoMarquee({
  className,
  logos,
  speedSeconds = 25,
  gap = 67,
  maxLogoHeight = 39,
  fadeWidth = 44,
  reverse = false,
}: InfiniteLogoMarqueeProps) {
  if (logos.length === 0) {
    return null;
  }

  const marqueeStyle = {
    "--hero-marquee-duration": `${speedSeconds}s`,
  } as CSSProperties;

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden",
        className,
      )}
      style={buildFadeMask(fadeWidth)}
    >
      <div className={`partner-logo-marquee-track${reverse ? " partner-logo-marquee-track--ltr" : ""}`} style={marqueeStyle}>
        <LogoSequence logos={logos} gap={gap} maxLogoHeight={maxLogoHeight} />
        <LogoSequence logos={logos} gap={gap} maxLogoHeight={maxLogoHeight} />
      </div>
    </div>
  );
}
