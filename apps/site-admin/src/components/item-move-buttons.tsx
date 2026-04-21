"use client";

import { ChevronUp, ChevronDown } from "lucide-react";

interface ItemMoveButtonsProps {
  index: number;
  count: number;
  onMove: (from: number, dir: "up" | "down") => void;
  /** Size of each button in px. Default 20 (matches grip). */
  size?: number;
}

export function ItemMoveButtons({ index, count, onMove, size = 20 }: ItemMoveButtonsProps) {
  const canUp = index > 0;
  const canDown = index < count - 1;
  const activeClass = "bg-[#F0F0F0] text-[#0A0A0A] hover:bg-[#FFCC00]";
  const disabledClass = "bg-[#2A2A2A] text-[#555555] cursor-not-allowed";
  const dim = { width: size, height: size };
  const iconSize = Math.max(10, Math.round(size * 0.6));
  return (
    <>
      <button
        type="button"
        title="Выше"
        disabled={!canUp}
        style={dim}
        onClick={() => canUp && onMove(index, "up")}
        className={`flex items-center justify-center rounded-sm transition-colors ${
          canUp ? activeClass : disabledClass
        }`}
      >
        <ChevronUp style={{ width: iconSize, height: iconSize }} />
      </button>
      <button
        type="button"
        title="Ниже"
        disabled={!canDown}
        style={dim}
        onClick={() => canDown && onMove(index, "down")}
        className={`flex items-center justify-center rounded-sm transition-colors ${
          canDown ? activeClass : disabledClass
        }`}
      >
        <ChevronDown style={{ width: iconSize, height: iconSize }} />
      </button>
    </>
  );
}
