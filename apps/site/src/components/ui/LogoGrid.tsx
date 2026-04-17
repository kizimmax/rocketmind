import Image from "next/image";
import type { LogoGridCell } from "@/lib/unique";

type LogoGridProps = {
  cells: LogoGridCell[];
  className?: string;
};

const SIZE_SPAN: Record<LogoGridCell["size"], number> = {
  S: 1,
  M: 2,
  L: 4,
};

const DEFAULT_PADDING = 20;

/**
 * Bento-style logo grid. 4-column base grid on desktop;
 * S=1 col, M=2 cols, L=4 cols. Auto-flow fills dense.
 * On mobile collapses to 2-column grid.
 * Cell padding controlled per-cell (default 20px).
 */
export function LogoGrid({ cells, className }: LogoGridProps) {
  if (cells.length === 0) {
    return (
      <div
        className={`flex items-center justify-center min-h-[400px] border border-dashed border-[#404040] ${className ?? ""}`}
      >
        <span className="text-[length:var(--text-14)] text-[#5C5C5C]">Логотипы не добавлены</span>
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-2 md:grid-cols-4 auto-rows-[80px] gap-px bg-[#1A1A1A] border border-[#404040] ${className ?? ""}`}
      style={{ gridAutoFlow: "dense" }}
    >
      {cells.map((cell) => (
        <div
          key={cell.id}
          className="relative bg-[#121212]"
          style={{
            gridColumn: `span ${SIZE_SPAN[cell.size]} / span ${SIZE_SPAN[cell.size]}`,
            padding: `${cell.padding ?? DEFAULT_PADDING}px`,
          }}
        >
          {cell.src && (
            <div className="relative w-full h-full">
              <Image
                src={cell.src}
                alt={cell.alt ?? ""}
                fill
                className="object-contain"
                unoptimized={cell.src.endsWith(".svg")}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
