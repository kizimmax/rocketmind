"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Search } from "lucide-react";
import {
  cn,
  Tag,
  GlossaryList,
  GlossaryScriptToggle,
  type GlossaryTermItem,
  type GlossaryScript,
} from "@rocketmind/ui";
import { ShaderBackground } from "@/components/ui/ShaderBackground";
import type { MediaTag } from "@/lib/articles";

interface Props {
  terms: GlossaryTermItem[];
  tags: MediaTag[];
}

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

// ── Tag-row dynamic layout helpers (shared shape with /media) ──────────────

type TagItem = { id: string; label: string };
const TAG_ROW_HEIGHT = 28; // Tag size=m: min-h-7
const TAG_GAP = 8; // gap-2

/** Делит теги на две строки по суммарному числу символов (такой же алгоритм
 *  как на /media). Порядок сохраняется. */
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

export function GlossaryPageClient({ terms, tags }: Props) {
  const [script, setScript] = useState<GlossaryScript>("cyrillic");
  const [filter, setFilter] = useState<string>("all");
  const [query, setQuery] = useState<string>("");

  // Видимость gradient-хвоста под sticky-шапкой. Скрыт на hero + фильтрах
  // (ниже sticky-шапки ничего не скроллится), появляется когда низ тег-фильтров
  // заехал под низ sticky-шапки.
  const [showFade, setShowFade] = useState(false);
  const stickyRef = useRef<HTMLDivElement>(null);
  const tagsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sticky = stickyRef.current;
    const sentinel = tagsEndRef.current;
    if (!sticky || !sentinel) return;
    function update() {
      const sRect = sentinel!.getBoundingClientRect();
      const hRect = sticky!.getBoundingClientRect();
      setShowFade(sRect.top < hRect.bottom);
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return terms.filter((t) => {
      if (filter !== "all" && !(t.tagIds ?? []).includes(filter)) return false;
      if (!q) return true;
      return t.title.toLowerCase().includes(q);
    });
  }, [terms, filter, query]);

  // ── Tag-row dynamic layout (такая же логика как на /media) ──────────────
  const allTagItems = useMemo<TagItem[]>(
    () => [
      { id: "all", label: "Все термины" },
      ...tags.map((t) => ({ id: t.id, label: t.label })),
    ],
    [tags],
  );

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
    <Tag
      key={t.id}
      size="m"
      state={filter === t.id ? "active" : "interactive"}
      as="button"
      onClick={() => setFilter(t.id)}
    >
      {t.label}
    </Tag>
  );

  return (
    <section className="bg-background text-foreground">
      {/* Hero — исходный: большой заголовок, back-link, ShaderBackground.
          Прокручивается вместе со страницей. */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-0 bottom-[-120px] lg:bottom-[-200px]">
          <ShaderBackground className="absolute inset-0 h-full w-full opacity-10" />
          <div className="absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-background to-transparent" />
        </div>

        <div className="relative z-10 px-5 pt-[102px] pb-8 md:px-8 lg:pt-[144px] lg:pb-12 xl:px-14">
          <div className="mx-auto max-w-[1512px]">
            <a
              href={`${BASE}/media`}
              className="group mb-6 inline-flex items-center gap-2 font-mono text-[12px] font-medium uppercase tracking-[0.02em] text-muted-foreground transition-colors hover:text-[var(--rm-yellow-100)]"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              Назад
            </a>

            <h1 className="font-heading text-[28px] font-bold uppercase leading-[1.08] tracking-[-0.02em] lg:text-[80px] lg:font-extrabold">
              Глоссарий
            </h1>
          </div>
        </div>
      </div>

      {/* Sticky-шапка: только поиск. Заголовок «Глоссарий» и back-link
          остаются в hero (не дублируются в sticky). */}
      <div ref={stickyRef} className="sticky top-16 z-20">
        <div className="bg-background/85 px-5 py-4 backdrop-blur-md md:px-8 md:py-5 xl:px-14">
          <div className="mx-auto max-w-[1512px]">
            <label className="flex w-full items-center gap-2 rounded-sm border border-[color:var(--rm-gray-3)] bg-background/60 px-4 py-3 transition-colors focus-within:border-[color:var(--rm-yellow-100)] md:max-w-md">
              <Search
                className="h-4 w-4 shrink-0 text-[color:var(--rm-gray-fg-sub)]"
                strokeWidth={1.5}
                aria-hidden
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Найти термин"
                className="min-w-0 flex-1 bg-transparent text-[length:var(--text-14)] leading-[1.32] text-[color:var(--rm-gray-fg-main)] placeholder:text-[color:var(--rm-gray-fg-sub)] focus:outline-none"
              />
            </label>
          </div>
        </div>

        {/* Gradient-хвост ниже шапки: контент, проходя под ней, растворяется
            в bg-background. Скрыт пока под шапкой нет проскроллившегося
            контента (hero + фильтры видны целиком). */}
        <div
          aria-hidden
          className={`pointer-events-none h-10 bg-gradient-to-b from-background via-background/80 to-transparent transition-opacity duration-200 ${showFade ? "opacity-100" : "opacity-0"}`}
        />
      </div>

      {/* Прокручиваемая часть: фильтры, script-toggle, список. */}
      <div className="relative z-10 -mt-10 px-5 pb-16 md:px-8 md:pb-24 xl:px-14">
        <div className="mx-auto max-w-[1512px]">
          {/* Теги: раскладка выбирается динамически — как на /media.
                1 ряд — если всё помещается горизонтально;
                2 ряда (flex-wrap) — если одной строки не хватает;
                2 ряда с горизонтальным скроллом и фейдами — если
                естественно потребовалось бы 3+ строки. */}
          <div ref={tagsWrapperRef} className="relative mb-8">
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
              <div className="relative -mx-5 md:-mx-8 xl:-mx-14">
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
                  className="overflow-x-auto px-5 md:px-8 xl:px-14 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
                    "pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-background to-transparent transition-opacity duration-200",
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
          {/* Sentinel для gradient-хвоста sticky-шапки. */}
          <div ref={tagsEndRef} aria-hidden className="h-0 w-full" />

          <div className="mb-10">
            <GlossaryScriptToggle value={script} onChange={setScript} />
          </div>

          <GlossaryList items={filtered} script={script} />
        </div>
      </div>
    </section>
  );
}
