"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  cn,
  Tag,
  ArticleCard,
  Breadcrumbs,
  GlossaryWidget,
  ShowMore,
  type GlossaryTermItem,
  type ArticleCardVariant,
} from "@rocketmind/ui";
import { ArrowUpRight, Search } from "lucide-react";
import { ShaderBackground } from "@/components/ui/ShaderBackground";
import type { ArticleCardTypeBadgeColor } from "@rocketmind/ui";
import type { MediaTag } from "@/lib/articles";

/**
 * Маппинг `article.type` → системный тег → `{ label, color }` для бейджа на
 * карточке /media. Если соответствующий системный тег отсутствует или
 * `disabled` — бейдж не рисуем.
 */
function typeBadgeFor(
  type: "default" | "lesson" | "case",
  tags: MediaTag[],
): { label: string; color: ArticleCardTypeBadgeColor } | undefined {
  if (type === "default") return undefined;
  const sys = tags.find((t) => t.id === type);
  if (!sys || sys.disabled) return undefined;
  const color = (sys.cardColor ?? (type === "lesson" ? "sky" : "terracotta")) as ArticleCardTypeBadgeColor;
  return { label: sys.label, color };
}

type Item = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  coverUrl: string | null;
  tags: string[];
  /** `default` | `lesson` | `case` — управляет бейджем «Урок»/«Кейс» на карточке. */
  type: "default" | "lesson" | "case";
  expertName: string | null;
  expertAvatarUrl: string | null;
  cardVariant: ArticleCardVariant;
  pinned: boolean;
  /** Нормализованный текст всех блоков (h2/h3/h4/paragraph/quote) — для поиска. */
  bodyText: string;
};

interface Props {
  articles: Item[];
  tags: MediaTag[];
  glossaryTerms: GlossaryTermItem[];
  /** Активный тег из URL (`/media/tag/[slug]`). Если undefined — показ всех. */
  activeTag?: string;
  /** H1 prefix override (default "Медиа"). */
  headingPrefix?: string;
  /** H1 accent (вторая часть, секондарным цветом). */
  headingAccent?: string;
  /** Опциональный лид-текст под H1. */
  intro?: string;
  /** Breadcrumb-крошки (по умолчанию: Главная / Медиа). */
  breadcrumbs?: { label: string; href?: string }[];
}

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";
const PAGE_SIZE = 12;

// Stagger entrance: opacity 0 → 1, slide-up 20px → 0. Easing — easeOutExpo
// (`cubic-bezier(0.16, 1, 0.3, 1)`) для мягкого «прибытия» без жёсткого стопа.
// Шаг 90ms между уровнями — хватает, чтобы глаз поймал последовательность,
// но не растягивает первое впечатление.
function stagger(index: number): React.CSSProperties {
  return {
    opacity: 0,
    animation: `heroFadeIn 700ms cubic-bezier(0.16, 1, 0.3, 1) ${index * 90}ms forwards`,
  };
}

type TagItem = { id: string; label: string };
const TAG_ROW_HEIGHT = 28; // Tag size=m: min-h-7
const TAG_GAP = 8; // gap-2

/**
 * Делит теги на две строки так, чтобы суммарное число символов в строках
 * было максимально близким. Проходим слева направо и выбираем точку
 * разбиения, минимизирующую |topChars - bottomChars|. Порядок тегов
 * сохраняется.
 */
function splitTagsByChars(items: TagItem[]): [TagItem[], TagItem[]] {
  if (items.length <= 1) return [items, []];
  const total = items.reduce((s, t) => s + t.label.length, 0);
  let running = 0;
  let bestDiff = total;
  let bestAt = Math.ceil(items.length / 2);
  for (let i = 0; i < items.length - 1; i++) {
    running += items[i].label.length;
    const diff = Math.abs(running - (total - running));
    if (diff < bestDiff) {
      bestDiff = diff;
      bestAt = i + 1;
    }
  }
  return [items.slice(0, bestAt), items.slice(bestAt)];
}

export function MediaListClient({
  articles,
  tags,
  glossaryTerms,
  activeTag,
  headingPrefix,
  headingAccent,
  intro,
  breadcrumbs,
}: Props) {
  const filter: string = activeTag ?? "all";
  const [query, setQuery] = useState<string>("");
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);

  const tagHref = (id: string) =>
    id === "all" ? `${BASE}/media` : `${BASE}/media/tag/${id}`;
  const titlePrefix = headingPrefix ?? "Медиа";

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return articles.filter((a) => {
      if (filter !== "all") {
        // Системные фильтры `lesson`/`case` читают `a.type`, а не `a.tags` —
        // на этих статьях системный тег физически в `tagIds` не хранится.
        if (filter === "lesson" || filter === "case") {
          if (a.type !== filter) return false;
        } else if (!a.tags.includes(filter)) return false;
      }
      if (!q) return true;
      if (a.title.toLowerCase().includes(q)) return true;
      if (a.description.toLowerCase().includes(q)) return true;
      if (a.bodyText.toLowerCase().includes(q)) return true;
      if (a.tags.some((t) => t.toLowerCase().includes(q))) return true;
      return false;
    });
  }, [articles, filter, query]);

  const visible = useMemo(
    () => filtered.slice(0, visibleCount),
    [filtered, visibleCount],
  );

  const tagLabelById = useMemo(() => {
    const map: Record<string, string> = {};
    for (const t of tags) map[t.id] = t.label;
    return map;
  }, [tags]);

  // Все теги (включая "Все статьи") — для probe-измерения и рендера.
  const allTagItems = useMemo<TagItem[]>(
    () => [
      { id: "all", label: "Все статьи" },
      ...tags.map((t) => ({ id: t.id, label: t.label })),
    ],
    [tags],
  );

  // Измеряем, во сколько строк укладываются теги при текущей ширине
  // контейнера. По умолчанию 2 — чтобы на SSR отрендерить wrap-режим.
  const tagsWrapperRef = useRef<HTMLDivElement>(null);
  const tagsProbeRef = useRef<HTMLDivElement>(null);
  const [tagRowCount, setTagRowCount] = useState<number>(2);

  useEffect(() => {
    const wrapper = tagsWrapperRef.current;
    const probe = tagsProbeRef.current;
    if (!wrapper || !probe) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const h = probe.offsetHeight;
      const rows =
        h <= 0
          ? 1
          : Math.max(1, Math.round((h + TAG_GAP) / (TAG_ROW_HEIGHT + TAG_GAP)));
      setTagRowCount(rows);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    schedule();
    const ro = new ResizeObserver(schedule);
    ro.observe(wrapper);
    return () => {
      ro.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [allTagItems]);

  const isTagScroll = tagRowCount > 2;
  const [tagRowTop, tagRowBottom] = useMemo<[TagItem[], TagItem[]]>(
    () => (isTagScroll ? splitTagsByChars(allTagItems) : [allTagItems, []]),
    [allTagItems, isTagScroll],
  );

  // Показ фейдов: правый виден, когда есть контент справа; левый — после
  // начала скролла. Обновляем на скролл + ResizeObserver (меняется ширина).
  const tagScrollRef = useRef<HTMLDivElement>(null);
  const [tagFade, setTagFade] = useState<{ left: boolean; right: boolean }>({
    left: false,
    right: true,
  });

  useEffect(() => {
    if (!isTagScroll) return;
    const el = tagScrollRef.current;
    if (!el) return;
    const update = () => {
      const { scrollLeft, scrollWidth, clientWidth } = el;
      const overflows = scrollWidth - clientWidth > 1;
      const atEnd = scrollLeft + clientWidth >= scrollWidth - 1;
      setTagFade({
        left: overflows && scrollLeft > 1,
        right: overflows && !atEnd,
      });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [isTagScroll, allTagItems]);

  const renderTagButton = (t: TagItem) => (
    <Link key={t.id} href={tagHref(t.id)} scroll={false}>
      <Tag
        size="m"
        state={filter === t.id ? "active" : "interactive"}
        as="span"
      >
        {t.label}
      </Tag>
    </Link>
  );

  return (
    <section className="bg-background text-foreground">
      <div className="relative">
        {/* Shader-декорация только в верхней части страницы.
            Анимируем медленным fade'ом без translate — фон не должен «прыгать». */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[680px] overflow-hidden"
          style={{ opacity: 0, animation: "heroBgFade 900ms ease-out 0ms forwards" }}
        >
          <ShaderBackground className="absolute inset-0 h-full w-full opacity-10" />
          <div className="absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-background to-transparent" />
        </div>

        <div className="relative z-10 pt-[102px] pb-16 md:pb-24 lg:pt-[144px]">
          <div className="mx-auto max-w-[1512px] px-5 md:px-8 xl:px-14">
            {/* Breadcrumbs — над двухколоночной раскладкой */}
            <div className="mb-6" style={stagger(0)}>
              <Breadcrumbs
                items={
                  breadcrumbs ?? [
                    { label: "Главная", href: `${BASE}/` },
                    { label: "Медиа" },
                  ]
                }
              />
            </div>

            {/* 2-колоночная сетка: контент слева + глоссарий справа. Глоссарий
                поднят до уровня H1 (раньше был ниже tag-row). */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_344px] lg:gap-2">
              <div className="flex min-w-0 flex-col gap-10">
                {/* H1 + mobile-only glossary link */}
                <div
                  className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
                  style={stagger(1)}
                >
                  <h1 className="font-heading text-[28px] font-bold uppercase leading-[1.08] tracking-[-0.02em] lg:text-[80px] lg:font-extrabold">
                    {titlePrefix}
                    {headingAccent && (
                      <>
                        {" "}
                        <span className="text-muted-foreground">
                          {headingAccent}
                        </span>
                      </>
                    )}
                  </h1>

                  <a
                    href={`${BASE}/media/glossary`}
                    className="group inline-flex items-center gap-2 self-start font-mono text-[12px] font-medium uppercase tracking-[0.02em] text-muted-foreground transition-colors hover:text-[var(--rm-yellow-100)] lg:hidden"
                  >
                    Глоссарий
                    <ArrowUpRight
                      className="h-4 w-4"
                      strokeWidth={1.5}
                      aria-hidden
                    />
                  </a>
                </div>

                {intro && (
                  <p
                    className="-mt-4 max-w-3xl text-[16px] leading-[1.4] text-foreground md:text-[18px]"
                    style={stagger(2)}
                  >
                    {intro}
                  </p>
                )}

                {/* Search + tag filter row */}
                <div className="flex flex-col gap-4" style={stagger(intro ? 3 : 2)}>
                  <label className="flex w-full items-center gap-2 rounded-sm border border-[color:var(--rm-gray-3)] bg-transparent px-4 py-3 focus-within:border-[color:var(--rm-yellow-100)] md:max-w-md">
                    <Search
                      className="h-4 w-4 shrink-0 text-[color:var(--rm-gray-fg-sub)]"
                      strokeWidth={1.5}
                      aria-hidden
                    />
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value);
                        setVisibleCount(PAGE_SIZE);
                      }}
                      placeholder="Найти статью"
                      className="min-w-0 flex-1 bg-transparent text-[length:var(--text-14)] leading-[1.32] text-[color:var(--rm-gray-fg-main)] placeholder:text-[color:var(--rm-gray-fg-sub)] focus:outline-none"
                    />
                  </label>

                  {/* Теги: раскладка выбирается динамически.
                        1 ряд — если всё помещается горизонтально;
                        2 ряда (flex-wrap) — если одной строки не хватает;
                        2 ряда с горизонтальным скроллом и фейдами — если
                        естественно потребовалось бы 3+ строки. В этом случае
                        теги распределяются между двумя рядами по суммарному
                        числу символов. Probe (невидимый clone) рендерит все
                        теги в flex-wrap для измерения натуральной высоты. */}
                  <div ref={tagsWrapperRef} className="relative">
                    <div
                      ref={tagsProbeRef}
                      aria-hidden
                      className="pointer-events-none invisible absolute inset-x-0 top-0 flex flex-wrap gap-2"
                    >
                      {allTagItems.map((t) => (
                        <Tag key={t.id} size="m" state="default" as="span">
                          {t.label}
                        </Tag>
                      ))}
                    </div>

                    {isTagScroll ? (
                      // На mobile/md нет глоссария — тегам надо уходить до
                      // края вьюпорта (компенсируем section padding через
                      // отрицательные margin). На lg+ глоссарий занимает
                      // правую колонку, и scroll ограничен 1fr-колонкой:
                      // правый край scroll == стык с глоссарием, там же
                      // появляется `right-0` фейд.
                      <div className="relative -mx-5 md:-mx-8 lg:mx-0">
                        <div
                          ref={tagScrollRef}
                          onScroll={(e) => {
                            const el = e.currentTarget;
                            const { scrollLeft, scrollWidth, clientWidth } = el;
                            const overflows = scrollWidth - clientWidth > 1;
                            const atEnd =
                              scrollLeft + clientWidth >= scrollWidth - 1;
                            setTagFade({
                              left: overflows && scrollLeft > 1,
                              right: overflows && !atEnd,
                            });
                          }}
                          className="overflow-x-auto px-5 md:px-8 lg:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                        >
                          <div className="flex w-max flex-col gap-2">
                            <div className="flex gap-2">
                              {tagRowTop.map(renderTagButton)}
                            </div>
                            <div className="flex gap-2">
                              {tagRowBottom.map(renderTagButton)}
                            </div>
                          </div>
                        </div>
                        <div
                          aria-hidden
                          className={cn(
                            "pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-background to-transparent transition-opacity duration-200",
                            tagFade.left ? "opacity-100" : "opacity-0",
                          )}
                        />
                        <div
                          aria-hidden
                          className={cn(
                            "pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-background to-transparent transition-opacity duration-200 lg:w-24 xl:w-32",
                            tagFade.right ? "opacity-100" : "opacity-0",
                          )}
                        />
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {allTagItems.map(renderTagButton)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Articles grid — бордеры сливаются через -mt-px/-ml-px.
                    `-mt-5` сокращает outer flex gap (40px) → 20px между
                    тегами и карточками. */}
                {visible.length === 0 ? (
                  <p
                    className="-mt-5 py-16 text-center text-[length:var(--text-14)] text-[color:var(--rm-gray-fg-sub)]"
                    style={stagger(intro ? 4 : 3)}
                  >
                    {query.trim() || filter !== "all"
                      ? "По выбранным фильтрам статей нет."
                      : "Пока нет опубликованных статей."}
                  </p>
                ) : (
                  <div
                    className="-mt-5 grid grid-flow-dense grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                    style={stagger(intro ? 4 : 3)}
                  >
                    {visible.map((a) => (
                      <div
                        key={a.slug}
                        className={cn(
                          "-mt-px -ml-px",
                          a.cardVariant === "wide" &&
                            "sm:col-span-2 xl:col-span-2",
                        )}
                      >
                        <ArticleCard
                          variant={a.cardVariant}
                          href={`${BASE}/media/${a.slug}`}
                          title={a.title}
                          description={a.description}
                          coverUrl={a.coverUrl}
                          tags={a.tags
                            .map((id) => tagLabelById[id])
                            .filter((label): label is string => Boolean(label))}
                          typeBadge={typeBadgeFor(a.type, tags)}
                          authorName={a.expertName ?? undefined}
                          authorAvatarUrl={a.expertAvatarUrl}
                          date={a.publishedAt}
                          className="h-full rounded-none"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {filtered.length > visible.length && (
                  // -mt pulls ShowMore over the cards visually; matching mb
                  // restores the column's flex-layout height so the cards
                  // don't overflow below the column into the footer.
                  // -ml-px aligns the skirt with the leftmost card cell,
                  // which also has -ml-px to merge borders with neighbours.
                  <div className="relative z-10 -ml-px -mt-[120px] mb-[80px] sm:-mt-[160px] sm:mb-[120px] lg:-mt-[200px] lg:mb-[160px]">
                    <ShowMore
                      expanded={false}
                      onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
                      fade
                      fadeHeight={160}
                      fadeBelow={240}
                    />
                  </div>
                )}
              </div>

              {/* Glossary widget — правая колонка (desktop only), поднята на
                  уровень H1. Шапка закреплена sticky через `stickyTop`. */}
              <div className="hidden lg:block" style={stagger(2)}>
                <GlossaryWidget items={glossaryTerms} stickyTop="4rem" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
