import * as React from "react";
import { cn } from "../../lib/utils";

export interface CoverSkeletonProps {
  className?: string;
}

/**
 * Скелетон обложки карточки — показывается, когда у карточки нет изображения.
 * Два круга (бордер 2px, #404040) по центру на тёмном фоне #121212.
 * Геометрия из Figma (node 1971-18016, 389×358): малый круг слева, крупный справа,
 * группа отцентрована по вертикали и горизонтали.
 *
 * Бордер всегда 2px независимо от размера карточки (`vector-effect: non-scaling-stroke`).
 */
export function CoverSkeleton({ className }: CoverSkeletonProps) {
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center overflow-hidden bg-[#121212]",
        className,
      )}
      aria-hidden
    >
      <svg
        viewBox="0 0 389 358"
        preserveAspectRatio="xMidYMid meet"
        className="h-full w-full"
        fill="none"
      >
        <circle
          cx="105.7"
          cy="178.5"
          r="47.36"
          stroke="#404040"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
        <circle
          cx="248.62"
          cy="178.5"
          r="82.03"
          stroke="#404040"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
