"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ArticleCard } from "@rocketmind/ui";

export type SimilarArticleCard = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  coverUrl: string | null;
  /** Tag labels (already resolved on the server). */
  tags: string[];
  expertName: string | null;
  expertAvatarUrl: string | null;
};

interface Props {
  articles: SimilarArticleCard[];
  /** Optional override (default: «Похожие статьи»). */
  heading?: string;
}

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

/**
 * Горизонтальная карусель похожих статей. Логика повторяет блок карточек
 * на главной (`ServicesGridClient`): mobile — нативный snap-scroll, desktop —
 * grid-transform с кнопками и drag-to-scroll. Карточки — `ArticleCard`
 * variant="default" (одна колонка) — те же, что на странице /media.
 */
export function SimilarArticlesCarousel({
  articles,
  heading = "Похожие статьи",
}: Props) {
  const [cardsPerView, setCardsPerView] = useState(3);
  const [isMobile, setIsMobile] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const dragRef = useRef<{ startX: number; dragged: boolean } | null>(null);

  // Responsive: desktop (≥1280) — 4 в ряд, tablet (768–1280) — 3, mobile —
  // нативный snap-scroll с шириной карточки 66vw (≈1.5 карточки в кадре).
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      const mobile = w < 768;
      setIsMobile(mobile);
      if (mobile) setCardsPerView(1);
      else if (w < 1280) setCardsPerView(3);
      else setCardsPerView(4);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // При смене breakpoint'а возвращаемся в начало.
  useEffect(() => {
    setCarouselIndex(0);
  }, [cardsPerView]);

  const max = Math.max(0, articles.length - cardsPerView);
  const canLeft = carouselIndex > 0;
  const canRight = carouselIndex < max;

  const scrollCarousel = useCallback(
    (direction: "left" | "right") => {
      setCarouselIndex((cur) => {
        const next = direction === "left" ? cur - 1 : cur + 1;
        return Math.max(0, Math.min(max, next));
      });
    },
    [max],
  );

  // Desktop drag-to-scroll: те же пороги/паттерн, что на главной.
  const handleDragStart = useCallback(
    (e: React.PointerEvent) => {
      if (isMobile) return;
      if (e.button !== 0) return;
      dragRef.current = { startX: e.clientX, dragged: false };
    },
    [isMobile],
  );
  const handleDragMove = useCallback(
    (e: React.PointerEvent) => {
      const d = dragRef.current;
      if (!d) return;
      const dx = d.startX - e.clientX;
      if (!d.dragged && Math.abs(dx) > 30) {
        d.dragged = true;
        scrollCarousel(dx > 0 ? "right" : "left");
      }
    },
    [scrollCarousel],
  );
  const handleDragEnd = useCallback((e: React.PointerEvent) => {
    const wasDrag = dragRef.current?.dragged;
    dragRef.current = null;
    if (wasDrag) {
      // Глушим click, который полетит после mouseup, чтобы он не открыл
      // карточку, по которой завершился drag.
      const el = e.currentTarget as HTMLElement;
      const suppress = (ev: Event) => {
        ev.preventDefault();
        ev.stopPropagation();
      };
      el.addEventListener("click", suppress, { capture: true, once: true });
    }
  }, []);

  if (articles.length === 0) return null;

  return (
    <section className="dark bg-background text-foreground">
      <div className="mx-auto w-full max-w-[1512px] md:px-8 xl:px-14">
        <div className="border-t border-border pt-12 pb-12 md:pt-16 md:pb-16 lg:pt-24 lg:pb-24">
          {/* Header row */}
          <div className="mb-6 flex items-end justify-between gap-6 px-5 md:mb-8 md:px-0 lg:mb-10 lg:gap-10">
            <h2 className="font-heading text-[28px] font-bold uppercase leading-[1.16] tracking-[-0.01em] text-foreground md:text-[42px] md:leading-[1.08] md:tracking-[-0.02em] lg:text-[52px]">
              {heading}
            </h2>

            {/* Arrows — hidden on mobile (native scroll вместо них). */}
            <div className="hidden shrink-0 items-center gap-2 md:flex">
              <button
                type="button"
                onClick={() => scrollCarousel("left")}
                disabled={!canLeft}
                className="flex h-10 w-10 items-center justify-center border border-border text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
                aria-label="Прокрутить влево"
              >
                <ChevronLeft size={16} strokeWidth={2} />
              </button>
              <button
                type="button"
                onClick={() => scrollCarousel("right")}
                disabled={!canRight}
                className="flex h-10 w-10 items-center justify-center border border-border text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
                aria-label="Прокрутить вправо"
              >
                <ChevronRight size={16} strokeWidth={2} />
              </button>
            </div>
          </div>

          {/* Cards */}
          {isMobile ? (
            /* Mobile — native horizontal scroll с snap. */
            <div
              className="flex overflow-x-auto overflow-y-hidden snap-x snap-mandatory pl-5 [&::-webkit-scrollbar]:hidden"
              style={{ scrollbarWidth: "none", scrollPaddingLeft: 20 }}
            >
              {articles.map((a) => (
                <div
                  key={a.slug}
                  className="-ml-px w-[66vw] flex-none snap-start first:ml-0"
                >
                  <ArticleCard
                    variant="default"
                    href={`${BASE}/media/${a.slug}`}
                    title={a.title}
                    description={a.description}
                    coverUrl={a.coverUrl}
                    tags={a.tags}
                    authorName={a.expertName ?? undefined}
                    authorAvatarUrl={a.expertAvatarUrl}
                    date={a.publishedAt}
                    className="h-full rounded-none"
                  />
                </div>
              ))}
              {/* Right spacer — последняя карточка не липнет к краю viewport. */}
              <div className="flex-none w-5" aria-hidden />
            </div>
          ) : (
            /* Desktop/tablet — grid-transform карусель. */
            <div
              className="relative cursor-grab select-none overflow-hidden md:-mr-8 md:pr-8 xl:-mr-14 xl:pr-14 active:cursor-grabbing"
              onPointerDown={handleDragStart}
              onPointerMove={handleDragMove}
              onPointerUp={handleDragEnd}
              onPointerCancel={handleDragEnd}
              onDragStart={(e) => e.preventDefault()}
            >
              {/* Left fade */}
              <div
                aria-hidden
                className="pointer-events-none absolute left-0 top-0 z-10 h-full w-10 transition-opacity duration-300"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(10,10,10,1) 0%, rgba(10,10,10,0) 100%)",
                  opacity: canLeft ? 1 : 0,
                }}
              />
              {/* Right fade */}
              <div
                aria-hidden
                className="pointer-events-none absolute right-0 top-0 z-10 h-full w-10 transition-opacity duration-300"
                style={{
                  background:
                    "linear-gradient(-90deg, rgba(10,10,10,1) 0%, rgba(10,10,10,0) 100%)",
                  opacity: canRight ? 1 : 0,
                }}
              />
              <div
                className="grid transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                  // minmax(0, 1fr) — без него `1fr` = `minmax(auto, 1fr)` и
                  // длинные заголовки растягивают свою колонку, ломая
                  // равенство ширин.
                  gridTemplateColumns: `repeat(${articles.length}, minmax(0, 1fr))`,
                  width: `${(articles.length * 100) / cardsPerView}%`,
                  transform: `translateX(-${(carouselIndex * 100) / articles.length}%)`,
                }}
              >
                {articles.map((a) => (
                  <ArticleCard
                    key={a.slug}
                    variant="default"
                    href={`${BASE}/media/${a.slug}`}
                    title={a.title}
                    description={a.description}
                    coverUrl={a.coverUrl}
                    tags={a.tags}
                    authorName={a.expertName ?? undefined}
                    authorAvatarUrl={a.expertAvatarUrl}
                    date={a.publishedAt}
                    className="h-full rounded-none [&:not(:first-child)]:border-l-0"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
