"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

export interface MobileChapterTab {
  id: string;
  slug: string;
  label: string;
}

interface Props {
  chapters: MobileChapterTab[];
  articleSlug: string;
  currentChapterId: string;
  basePath?: string;
}

/**
 * Фиксированный нижний бар-навигация по главам для multi-page статей на
 * мобильных. Горизонтальный скролл, активный таб с жёлтым bottom-border.
 * Figma: 1158-12742.
 */
export function MobileChapterTabs({
  chapters,
  articleSlug,
  currentChapterId,
  basePath = "",
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Автоскролл к активному табу при смене главы.
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const active = container.querySelector<HTMLElement>('[data-active="true"]');
    if (!active) return;
    const containerRect = container.getBoundingClientRect();
    const activeRect = active.getBoundingClientRect();
    const offset =
      activeRect.left -
      containerRect.left -
      (containerRect.width - activeRect.width) / 2;
    container.scrollBy({ left: offset, behavior: "smooth" });
  }, [currentChapterId]);

  if (chapters.length === 0) return null;

  return (
    <nav
      aria-label="Главы статьи"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#0A0A0A] pb-[env(safe-area-inset-bottom,0px)] md:hidden"
    >
      <div
        ref={scrollRef}
        className="flex items-center gap-6 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {chapters.map((ch) => {
          const active = ch.id === currentChapterId;
          return (
            <Link
              key={ch.id}
              href={`${basePath}/media/${articleSlug}/${ch.slug}`}
              data-active={active}
              className={`shrink-0 whitespace-nowrap border-b-2 py-[22px] font-[family-name:var(--font-mono-family)] text-[18px] font-medium uppercase leading-[1.12] tracking-[0.02em] transition-colors ${
                active
                  ? "border-[var(--rm-yellow-100)] text-[color:var(--rm-gray-fg-main)]"
                  : "border-transparent text-[color:var(--rm-gray-fg-sub)]"
              }`}
            >
              {ch.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
