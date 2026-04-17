"use client";

import { apiFetch } from "@/lib/api-client";
import { useEffect, useState } from "react";
import { InfiniteLogoMarquee, type LogoMarqueeItem } from "@rocketmind/ui";

interface LogoMarqueeEditorProps {
  data: Record<string, unknown>;
  // Note: this block has no editable fields — it auto-renders partner logos
  // from `apps/site/public/clip-logos/`. The toggle in the block header
  // controls whether the section appears on the live page.
  onUpdate: (data: Record<string, unknown>) => void;
}

export function LogoMarqueeEditor(_props: LogoMarqueeEditorProps) {
  const [logos, setLogos] = useState<LogoMarqueeItem[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    apiFetch("/api/partner-logos")
      .then((r) => r.json())
      .then((data) => { if (!cancelled) setLogos(data as LogoMarqueeItem[]); })
      .catch(() => { if (!cancelled) setLogos([]); });
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="rounded-sm border-t border-[#404040] bg-[#0A0A0A] py-8">
      {/* Shared/auto badge */}
      <div className="mb-4 flex items-center gap-2 px-5 md:px-8 xl:px-14">
        <span className="rounded-sm bg-[var(--rm-yellow-100)]/10 px-2 py-0.5 text-[length:var(--text-10)] font-medium text-[var(--rm-yellow-100)]">
          Авто-блок
        </span>
        <span className="text-[length:var(--text-10)] text-[#939393]">
          Логотипы загружаются автоматически из общего набора
        </span>
      </div>

      {/* Live marquee preview */}
      <div className="mx-auto max-w-[1512px] px-5 md:px-8 xl:px-14">
        {logos === null ? (
          <div className="flex h-[60px] items-center justify-center text-[length:var(--text-12)] text-[#939393]">
            Загрузка логотипов…
          </div>
        ) : logos.length === 0 ? (
          <div className="flex h-[60px] items-center justify-center text-[length:var(--text-12)] text-[#939393]">
            Логотипы не найдены в /public/clip-logos/
          </div>
        ) : (
          <InfiniteLogoMarquee logos={logos} reverse />
        )}
      </div>
    </div>
  );
}
