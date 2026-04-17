"use client";

import { Info, RotateCcw } from "lucide-react";
import { IS_STATIC } from "@/lib/api-client";

/** Keys touched by the demo: wiped by the "reset" button so the client can
 * return to the original content snapshot without clearing localStorage
 * manually. Update this list if new `cms:demo:v1:*` keys are introduced. */
const DEMO_LS_KEYS = ["cms:demo:v1:pages"];

export function DemoBanner() {
  if (!IS_STATIC) return null;

  function reset() {
    try {
      for (const k of DEMO_LS_KEYS) localStorage.removeItem(k);
    } catch { /* ignore */ }
    window.location.reload();
  }

  return (
    <div className="flex h-8 shrink-0 items-center justify-between gap-3 border-b border-border bg-[var(--rm-purple-1,#f3e9ff)] px-4 text-[length:var(--text-12)] text-foreground">
      <div className="flex items-center gap-2">
        <Info className="h-3.5 w-3.5 shrink-0" />
        <span>
          <b>Демо-режим.</b> Правки видны только у&nbsp;вас в&nbsp;браузере и&nbsp;не&nbsp;попадают в&nbsp;реальный контент.
        </span>
      </div>
      <button
        type="button"
        onClick={reset}
        className="flex items-center gap-1.5 rounded-sm px-2 py-0.5 text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground"
      >
        <RotateCcw className="h-3 w-3" />
        Сбросить демо-правки
      </button>
    </div>
  );
}
