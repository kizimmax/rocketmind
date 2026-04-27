"use client";

import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import {
  Breadcrumbs,
  Tag,
  Author,
  KeyThoughts,
  ArticleNav,
  ArticleBody,
  ExpertQuoteStack,
  SectionAsideChip,
  SectionAsideProductCard,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  slugifyArticleHeading,
  type ArticleBodyBlock,
  type ExpertQuoteItem,
} from "@rocketmind/ui";
import type {
  ArticleAside,
  ArticleEntry,
  ArticleSection,
  ArticleSectionQuote,
  ResolvedProductAside,
  ResolvedQuoteExpert,
} from "@/lib/articles";
import {
  FilePreviewModal,
  type FilePreviewFile,
} from "./file-preview-modal";

interface Props {
  article: ArticleEntry;
  expertName: string | null;
  expertAvatarUrl: string | null;
  tagLabels: string[];
  /** Резолвенные данные продуктов (ключ `${category}:${slug}`). */
  resolvedProducts: Record<string, ResolvedProductAside>;
  /** Резолвенные данные экспертов для цитат (ключ — expertSlug). */
  resolvedQuoteExperts: Record<string, ResolvedQuoteExpert>;
}

// ── Quote helpers ──────────────────────────────────────────────────────────

/**
 * Резолвит `ArticleSectionQuote` в `ExpertQuoteItem` для рендера.
 * Порядок приоритетов: ручные поля → expert → пусто. Пустые цитаты
 * (без имени или без контента) отфильтровываются.
 */
function resolveQuote(
  quote: ArticleSectionQuote,
  experts: Record<string, ResolvedQuoteExpert>,
): ExpertQuoteItem | null {
  const expert = quote.expertSlug ? experts[quote.expertSlug] : undefined;
  const name = (quote.name ?? "").trim() || expert?.name || "";
  const role = (quote.role ?? "").trim() || expert?.role || "";
  const avatarUrl = quote.avatarUrl || expert?.avatarUrl || null;
  const label = (quote.label ?? "").trim();
  const paragraphs = (quote.paragraphs ?? [])
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
  if (!name) return null;
  if (!label && paragraphs.length === 0) return null;
  return {
    id: quote.id,
    name,
    role,
    avatarUrl,
    label: label || undefined,
    paragraphs: paragraphs.length > 0 ? paragraphs : undefined,
  };
}

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

// Gap body-колонки (`gap-24` = 96px) и aside-колонки (`gap-10` = 40px)
// в десктопной раскладке. Разница компенсируется в wrapper.height ниже,
// чтобы верх каждого следующего aside-wrapper'а попадал на верх H2 своей секции.
const BODY_GAP_PX = 96;
const ASIDE_GAP_PX = 40;
const GAP_COMPENSATION = BODY_GAP_PX - ASIDE_GAP_PX;

export function ArticlePageClient({
  article,
  resolvedQuoteExperts,
  expertName,
  expertAvatarUrl,
  tagLabels,
  resolvedProducts,
}: Props) {
  // ── ToC: items из section.title/navLabel (пропускаем секции без заголовка) ──
  const navItems = useMemo(
    () =>
      article.sections
        .filter((s) => s.title.trim())
        .map((s) => ({
          id: slugifyArticleHeading(s.title.trim()),
          label: s.navLabel.trim() || s.title.trim(),
        })),
    [article.sections],
  );

  // Scrollspy: активен тот H2, верх которого уже прошёл линию 92px от верха
  // viewport (т.е. пользователь проскроллил «через» него). Если ни один H2
  // ещё не прошёл — пользователь в hero, activeId = null (ни один пункт не
  // подсвечен). Это точнее, чем IntersectionObserver с широкой zone, которая
  // на больших экранах ложно помечала первый H2 как активный ещё в hero.
  const [activeId, setActiveId] = useState<string | null>(null);
  useEffect(() => {
    if (navItems.length === 0) {
      setActiveId(null);
      return;
    }
    let raf = 0;
    function update() {
      raf = 0;
      let lastPassed: string | null = null;
      for (const item of navItems) {
        const el = document.getElementById(item.id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        // 4px epsilon: после scrollIntoView top может оказаться 92.0001/91.9999
        if (top <= 92 + 4) lastPassed = item.id;
        else break; // navItems в документарном порядке — дальше точно не прошли
      }
      setActiveId(lastPassed);
    }
    function schedule() {
      if (raf) return;
      raf = requestAnimationFrame(update);
    }
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [navItems]);

  // Клик по пункту ToC — плавный скролл к заголовку. Используется scrollIntoView;
  // браузер сам считает целевую позицию с учётом CSS scroll-margin-top: 92px
  // на H2 → получается детерминированно и без дрифта при повторных кликах.
  function scrollToSection(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveId(id); // моментальная подсветка, не дожидаясь scrollspy
  }

  const hasAnyContent = article.sections.some(
    (s) => s.title.trim() || s.blocks.length > 0 || s.asides.length > 0,
  );

  // Модал предпросмотра файлов
  const [previewFile, setPreviewFile] = useState<FilePreviewFile | null>(null);

  // Одна из двух раскладок активна в любой момент — мобильная или десктопная.
  // Это критично для корректной работы scrollspy/scrollIntoView: раньше body
  // рендерилось в ОБЕИХ раскладках и H2 c одинаковыми id существовали дважды,
  // и getElementById находил скрытую (display:none) мобильную версию.
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const apply = () => setIsDesktop(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // «Широкий» десктоп ≥1280px — hero разбивается в ту же 4-колоночную сетку,
  // что и body: col-1 ToC (поднимается к верху страницы), cols 2-3
  // breadcrumbs + title + description + cover, col-4 tags/author/keyThoughts.
  const [isWide, setIsWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1280px)");
    const apply = () => setIsWide(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Синхронизация высот для двух независимых колонок:
  //   - aside-wrap.height = bodyH + (bodyGap − asideGap) — компенсируем разницу
  //     gap'ов, чтобы каждая «ячейка секции» в aside-колонке занимала ровно
  //     столько же вертикали, сколько body-секция + её нижний gap. Так верх
  //     каждого следующего wrapper'а попадает ровно на верх h2 следующей секции.
  //     Последний wrapper компенсацию не получает (нет следующей секции —
  //     иначе дорисуем мёртвое место под колонкой).
  //   - aside-sticky-zone.height = innerH + (bodyH − innerH) / 3 — ограничивает
  //     диапазон, в котором inner залипает (sticky родитель). Карточка отлипает
  //     на 1/3 прокрутки сквозь body-секцию, освобождая правую колонку раньше.
  //   - inner всегда вмещается в sticky-zone (минимум = innerH).
  useLayoutEffect(() => {
    function sync() {
      // 1) Hero sync (только для unified-раскладки ≥1280): тянем правую hero-
      //    обёртку (data-hero-aside) до высоты левой (data-hero-left), чтобы
      //    body-bodies и body-asides стартовали на одном Y.
      const heroLeft = document.querySelector<HTMLElement>("[data-hero-left]");
      const heroAside = document.querySelector<HTMLElement>("[data-hero-aside]");
      if (heroLeft && heroAside) {
        const h = heroLeft.getBoundingClientRect().height;
        heroAside.style.minHeight = `${h}px`;
        // Выравниваем верх tags с верхом заголовка: breadcrumbs-wrapper'а
        // высота + его margin-bottom (может меняться при переносе строк).
        const titleBlock = heroLeft.querySelector<HTMLElement>(
          "[data-hero-title-block]",
        );
        if (titleBlock) {
          const offset =
            titleBlock.getBoundingClientRect().top -
            heroLeft.getBoundingClientRect().top;
          heroAside.style.paddingTop = `${offset}px`;
        }
      }

      // 2) Per-section sync: wrapper.height = max(bodyH + GAP_COMPENSATION, innerH).
      //    - если inner помещается в bodyH + COMP → выравнивание с H2 сохраняется;
      //    - если inner ВЫШЕ — wrapper растягивается под inner и пушит следующие
      //      wrapper'ы вниз (как просил user: «толкать ниже»).
      //    sticky-zone = max(innerH, bodyH) — карточка залипает на всю высоту
      //    body-секции, доезжая до её низа; после bodyH card отлипает, и за
      //    счёт COMP в wrap'е плавно уступает место следующему sticky.
      const bodies = Array.from(
        document.querySelectorAll<HTMLElement>("[data-section-body]"),
      );
      bodies.forEach((body, i) => {
        const id = body.getAttribute("data-section-body");
        if (!id) return;
        const wrap = document.querySelector<HTMLElement>(
          `[data-section-aside-wrap="${id}"]`,
        );
        if (!wrap) return;
        const inner = wrap.querySelector<HTMLElement>(
          `[data-section-aside-inner="${id}"]`,
        );
        const zone = wrap.querySelector<HTMLElement>(
          `[data-section-aside-sticky-zone="${id}"]`,
        );
        const bodyH = body.getBoundingClientRect().height;
        const innerH = inner ? inner.getBoundingClientRect().height : 0;
        const isLast = i === bodies.length - 1;
        const baseH = bodyH + (isLast ? 0 : GAP_COMPENSATION);
        const targetH = Math.max(baseH, innerH);
        wrap.style.height = `${targetH}px`;

        // Quote layout: wide если блоки body выше aside, иначе narrow.
        // Измеряем ТОЛЬКО блоки (без цитаты) против aside-inner — так сама
        // высота цитаты не влияет на решение и нет циклической зависимости.
        const quote = document.querySelector<HTMLElement>(
          `[data-section-quote="${id}"]`,
        );
        const blocks = document.querySelector<HTMLElement>(
          `[data-section-body-blocks="${id}"]`,
        );
        const bbH = blocks ? blocks.getBoundingClientRect().height : 0;
        const quoteLayout: "wide" | "narrow" | null = quote
          ? bbH >= innerH
            ? "wide"
            : "narrow"
          : null;

        // Sticky-zone: в wide-режиме цитата перекрывает aside-колонку по ширине,
        // поэтому sticky-карточки должны отлипать ДО цитаты — ограничиваем zone
        // высотой блоков (без цитаты). В остальных случаях — полная bodyH.
        if (zone && innerH > 0) {
          const zoneCap = quoteLayout === "wide" && bbH > 0 ? bbH : bodyH;
          zone.style.height = `${Math.max(innerH, zoneCap)}px`;
        }

        if (quote && quoteLayout) {
          const layout = quoteLayout;
          if (quote.getAttribute("data-quote-layout") !== layout) {
            quote.setAttribute("data-quote-layout", layout);
            // CSS-селектор не сможет пере-шоу-ить через data-attr внутри children
            // без :has/group-data, поэтому переключаем классы вручную.
            const narrow = quote.querySelector<HTMLElement>(
              "[data-quote-variant=narrow]",
            );
            const wide = quote.querySelector<HTMLElement>(
              "[data-quote-variant=wide]",
            );
            if (narrow)
              narrow.style.display = layout === "narrow" ? "" : "none";
            if (wide)
              wide.style.display = layout === "wide" ? "" : "none";
          }
          // Wide-вариант должен вытягиваться из col-2-3 в col-4 (поверх aside-
          // колонки). Считаем extra = ширина aside-col + gap-2 (8px) и применяем
          // как negative marginRight на wide-div. На narrow — сбрасываем.
          const wideEl = quote.querySelector<HTMLElement>(
            "[data-quote-variant=wide]",
          );
          if (wideEl) {
            if (layout === "wide") {
              const asideCol = document.querySelector<HTMLElement>(
                "[data-aside-col]",
              );
              const asideW = asideCol ? asideCol.offsetWidth : 0;
              const extra = asideW > 0 ? asideW + 8 : 0;
              wideEl.style.marginRight = extra > 0 ? `-${extra}px` : "";
            } else {
              wideEl.style.marginRight = "";
            }
          }
        }
      });
    }
    sync();
    const ro = new ResizeObserver(sync);
    document
      .querySelectorAll<HTMLElement>(
        "[data-section-body],[data-section-aside-inner],[data-hero-left],[data-hero-aside]",
      )
      .forEach((el) => ro.observe(el));

    // Медиа в теле (img/video/iframe из галерей) могут подгружаться после
    // первого прогона sync() — наблюдаем их напрямую, слушаем load-события
    // и отслеживаем появление НОВЫХ media-узлов в DOM (переключение таба
    // галереи заменяет <img>, которого не было на момент первого прогона).
    // Логику смещения не меняем — это тот же sync(), просто чаще триггерится.
    const mediaCleanups: Array<() => void> = [];

    function hookMedia(el: Element) {
      if (el instanceof HTMLImageElement) {
        ro.observe(el);
        if (el.complete && el.naturalHeight > 0) return;
        const onLoad = () => sync();
        el.addEventListener("load", onLoad);
        el.addEventListener("error", onLoad);
        mediaCleanups.push(() => {
          el.removeEventListener("load", onLoad);
          el.removeEventListener("error", onLoad);
        });
      } else if (el instanceof HTMLVideoElement) {
        ro.observe(el);
        const onMeta = () => sync();
        el.addEventListener("loadedmetadata", onMeta);
        el.addEventListener("loadeddata", onMeta);
        el.addEventListener("resize", onMeta);
        mediaCleanups.push(() => {
          el.removeEventListener("loadedmetadata", onMeta);
          el.removeEventListener("loadeddata", onMeta);
          el.removeEventListener("resize", onMeta);
        });
      } else if (el instanceof HTMLIFrameElement) {
        ro.observe(el);
        const onLoad = () => sync();
        el.addEventListener("load", onLoad);
        mediaCleanups.push(() => {
          el.removeEventListener("load", onLoad);
        });
      }
    }

    // Первичный проход: все уже отрендеренные медиа-узлы в телах секций.
    document
      .querySelectorAll<HTMLElement>(
        "[data-section-body] img, [data-section-body] video, [data-section-body] iframe",
      )
      .forEach(hookMedia);

    // MutationObserver: когда галерея меняет таб или любой блок добавляет
    // новый <img>/<video>/<iframe>, подцепляем его тоже.
    const mo = new MutationObserver((mutations) => {
      let needsSync = false;
      for (const m of mutations) {
        m.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          if (
            node instanceof HTMLImageElement ||
            node instanceof HTMLVideoElement ||
            node instanceof HTMLIFrameElement
          ) {
            hookMedia(node);
            needsSync = true;
          }
          node
            .querySelectorAll?.("img, video, iframe")
            .forEach((el) => {
              hookMedia(el);
              needsSync = true;
            });
        });
      }
      if (needsSync) sync();
    });
    document
      .querySelectorAll<HTMLElement>("[data-section-body]")
      .forEach((el) =>
        mo.observe(el, { childList: true, subtree: true }),
      );

    // window load — страховка от кэш-мисс: гарантированно пересчитаем, когда
    // все ресурсы страницы подтянутся.
    const onWindowLoad = () => sync();
    window.addEventListener("load", onWindowLoad);

    // Ранние прогоны на случай, если браузер зарезервировал место под медиа
    // асинхронно (aspect-ratio, CSS layout) после useLayoutEffect.
    let raf1 = requestAnimationFrame(sync);
    let raf2 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(sync);
    });

    window.addEventListener("resize", sync);
    return () => {
      ro.disconnect();
      mo.disconnect();
      mediaCleanups.forEach((fn) => fn());
      window.removeEventListener("resize", sync);
      window.removeEventListener("load", onWindowLoad);
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
    // Зависимость от isDesktop/isWide обязательна: десктопная раскладка с
    // [data-section-body] / [data-section-aside-wrap] монтируется ТОЛЬКО когда
    // isDesktop (или isWide) === true. Без этой deps первый прогон sync() ничего
    // не находит, ResizeObserver не подписывается, wrapper'ы остаются с natural height.
  }, [article.sections, isDesktop, isWide]);

  const breadcrumbs = (
    <Breadcrumbs
      items={[
        { label: "Главная", href: `${BASE}/` },
        { label: "Медиа", href: `${BASE}/media` },
        { label: article.title },
      ]}
    />
  );

  // На ≥1280px — единый 4-кол grid для всей страницы: ToC в col-1 с самого
  // верха (поднимается к breadcrumbs), breadcrumbs + hero-content + body-bodies
  // в cols 2-3, hero-aside + body-asides в col-4. Ниже 1280 — прежняя раскладка
  // (отдельный hero + body с ToC), не трогаем.
  if (isWide) {
    return (
      <TooltipProvider delay={200}>
        <article className="px-5 py-16 md:px-8 md:py-20 xl:px-14">
          <div className="mx-auto max-w-[1512px]">
            <div className="grid grid-cols-4 gap-2">
              {/* Col 1 — ToC, sticky через всю страницу */}
              <aside className="col-span-1">
                <div className="sticky top-24">
                  <ArticleNav
                    items={navItems}
                    activeId={activeId}
                    onNavigate={scrollToSection}
                  />
                  {navItems.length === 0 && (
                    <p className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.02em] text-[color:var(--rm-gray-3)]">
                      Навигация появится после добавления заголовков в тело статьи
                    </p>
                  )}
                </div>
              </aside>

              {/* Cols 2-3 — контент: breadcrumbs, hero, секции тела.
                  data-hero-left: высота этой обёртки (breadcrumbs + hero) транслируется
                  в min-height правой (data-hero-aside), чтобы body-bodies и body-asides
                  стартовали на одном Y. */}
              <div className="col-span-2 flex flex-col">
                <div data-hero-left>
                  <div className="mb-10 pt-4">{breadcrumbs}</div>

                  <div className="flex flex-col gap-10" data-hero-title-block>
                    <div className="flex flex-col gap-7">
                      <h1 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-32)] uppercase tracking-[-0.02em] leading-[1.08] text-[color:var(--rm-gray-fg-main)] md:text-[52px]">
                        {article.title}
                      </h1>
                      {article.description && (
                        <p className="text-[length:var(--text-16)] leading-[1.28] text-[color:var(--rm-gray-fg-main)] md:text-[length:var(--text-18)] md:leading-[1.2]">
                          {article.description}
                        </p>
                      )}
                    </div>

                    {article.coverUrl ? (
                      <div className="relative overflow-hidden rounded-sm bg-[color:var(--rm-gray-1)]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={article.coverUrl}
                          alt=""
                          className="h-auto w-full object-cover lg:h-[465px]"
                        />
                        <div
                          className="pointer-events-none absolute inset-0"
                          style={{ background: "rgba(0,0,0,0.2)" }}
                          aria-hidden
                        />
                      </div>
                    ) : (
                      <div
                        className="rounded-sm bg-[color:var(--rm-gray-1)] lg:h-[465px] aspect-[16/9] lg:aspect-auto"
                        aria-hidden
                      />
                    )}
                  </div>
                </div>

                {hasAnyContent ? (
                  <div
                    id="article-body"
                    className="mt-24 flex flex-col gap-24"
                  >
                    {article.sections.map((section) => (
                      <div key={section.id} data-section-body={section.id}>
                        <SectionBody
                          section={section}
                          resolvedQuoteExperts={resolvedQuoteExperts}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-24 flex flex-col items-start gap-3 rounded-sm border border-dashed border-[color:var(--rm-gray-3)] bg-[color:var(--rm-gray-1)]/20 p-6 md:p-10">
                    <p className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.02em] text-[color:var(--rm-gray-fg-sub)]">
                      Тело статьи пусто
                    </p>
                    <p className="text-[length:var(--text-14)] leading-[1.4] text-[color:var(--rm-gray-fg-sub)]">
                      Добавьте секции с блоками в админке.
                    </p>
                  </div>
                )}
              </div>

              {/* Col 4 — aside: hero aside + body asides.
                  data-hero-aside — обёртка, которой useLayoutEffect выставляет
                  min-height = высоте data-hero-left. Так первая body-aside-секция
                  попадает на тот же Y, что и первая body-секция в col-2-3. */}
              <aside data-aside-col className="col-span-1 pl-[45px]">
                <div data-hero-aside className="flex flex-col gap-10">
                  {tagLabels.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {tagLabels.map((label) => (
                        <Tag key={label} size="l">
                          {label}
                        </Tag>
                      ))}
                    </div>
                  )}
                  {expertName && (
                    <Author
                      variant="full"
                      name={expertName}
                      avatarUrl={expertAvatarUrl}
                      date={article.publishedAt}
                    />
                  )}
                  {article.keyThoughts.length > 0 && (
                    <KeyThoughts thoughts={article.keyThoughts} />
                  )}
                </div>

                {hasAnyContent && (
                  <div className="mt-24 flex flex-col gap-10">
                    {article.sections.map((section) => (
                      <div
                        key={section.id}
                        data-section-aside-wrap={section.id}
                        className="relative"
                      >
                        {section.asides.length > 0 && (
                          <div data-section-aside-sticky-zone={section.id}>
                            <div
                              data-section-aside-inner={section.id}
                              className="sticky top-24 flex flex-col gap-3"
                            >
                              {section.asidesTitleEnabled &&
                                section.asidesTitle.trim() && (
                                  <h4 className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.02em] text-[color:var(--rm-gray-fg-sub)]">
                                    {section.asidesTitle}
                                  </h4>
                                )}
                              {section.asides.map((aside) => (
                                <AsideItem
                                  key={aside.id}
                                  aside={aside}
                                  resolvedProducts={resolvedProducts}
                                  onPreviewFile={setPreviewFile}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </aside>
            </div>
          </div>

          <FilePreviewModal
            file={previewFile}
            onClose={() => setPreviewFile(null)}
          />
        </article>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider delay={200}>
    <article className="px-5 py-16 md:px-8 md:py-20 xl:px-14">
      <div className="mx-auto max-w-[1512px]">
        <div className="mb-8 pt-2 md:mb-10 md:pt-0 -mx-5 px-5 md:mx-0 md:px-0">
          {breadcrumbs}
        </div>

        {/* ── HERO ──
            На lg+: та же 4-колоночная сетка, что и body ниже.
            Левая часть (title/description/cover) занимает cols 1-3 (col-span-3),
            aside (tags/author/keyThoughts) — col 4 с pl-[45px] (как aside-колонка body,
            см. Figma 1133:8040). На узких экранах (<lg) стекается в 1 колонку. */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4 lg:gap-2">
          <div className="flex flex-col gap-8 md:gap-10 lg:col-span-3">
            <div className="flex flex-col gap-4 md:gap-7">
              <h1 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-32)] uppercase tracking-[-0.02em] leading-[1.08] text-[color:var(--rm-gray-fg-main)] md:text-[52px]">
                {article.title}
              </h1>
              {article.description && (
                <p className="text-[length:var(--text-16)] leading-[1.28] text-[color:var(--rm-gray-fg-main)] md:text-[length:var(--text-18)] md:leading-[1.2]">
                  {article.description}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-5 lg:hidden">
              {tagLabels.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tagLabels.map((label) => (
                    <Tag key={label} size="m">
                      {label}
                    </Tag>
                  ))}
                </div>
              )}
              {expertName && (
                <Author
                  variant="full"
                  name={expertName}
                  avatarUrl={expertAvatarUrl}
                  date={article.publishedAt}
                />
              )}
            </div>

            {article.coverUrl ? (
              <div className="relative overflow-hidden rounded-sm bg-[color:var(--rm-gray-1)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={article.coverUrl}
                  alt=""
                  className="h-auto w-full object-cover lg:h-[465px]"
                />
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{ background: "rgba(0,0,0,0.2)" }}
                  aria-hidden
                />
              </div>
            ) : (
              <div
                className="rounded-sm bg-[color:var(--rm-gray-1)] lg:h-[465px] aspect-[16/9] lg:aspect-auto"
                aria-hidden
              />
            )}
          </div>

          <aside className="hidden flex-col gap-10 lg:col-span-1 lg:flex lg:pl-[45px]">
            {tagLabels.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tagLabels.map((label) => (
                  <Tag key={label} size="l">
                    {label}
                  </Tag>
                ))}
              </div>
            )}
            {expertName && (
              <Author
                variant="full"
                name={expertName}
                avatarUrl={expertAvatarUrl}
                date={article.publishedAt}
              />
            )}
            {article.keyThoughts.length > 0 && (
              <KeyThoughts
                thoughts={article.keyThoughts}
                className="border-l-0 pl-0"
              />
            )}
          </aside>

          {article.keyThoughts.length > 0 && (
            <div className="lg:hidden">
              <KeyThoughts thoughts={article.keyThoughts} />
            </div>
          )}
        </div>

        {/* ── BODY ──
            На мобилке (<lg): per-section стек — body + asides секции идут одной пачкой.
            На десктопе (lg+): адаптивная 4-колоночная сетка с ДВУМЯ НЕЗАВИСИМЫМИ
            потоками — все bodies текут в col 2-3 (без дыр, даже если aside-колонка
            длиннее), все asides текут в col 4. Asides sticky — стекуются по скроллу. */}
        <div className="mt-16 md:mt-24">
          {hasAnyContent ? (
            !isDesktop ? (
              /* Mobile layout — per-section стек (body + aside одной пачкой) */
              <div
                id="article-body"
                className="flex flex-col gap-16 md:gap-24"
              >
                {article.sections.map((section) => (
                  <SectionMobile
                    key={section.id}
                    section={section}
                    resolvedProducts={resolvedProducts}
                    resolvedQuoteExperts={resolvedQuoteExperts}
                    onPreviewFile={setPreviewFile}
                  />
                ))}
              </div>
            ) : (
              /* Desktop layout — 4-col grid, bodies и asides как ДВА независимых потока */
              <div className="grid grid-cols-4 gap-2">
                <aside className="lg:col-span-1">
                  <div className="sticky top-24">
                    <ArticleNav
                      items={navItems}
                      activeId={activeId}
                      onNavigate={scrollToSection}
                    />
                    {navItems.length === 0 && (
                      <p className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.02em] text-[color:var(--rm-gray-3)]">
                        Навигация появится после добавления заголовков в тело статьи
                      </p>
                    )}
                  </div>
                </aside>

                {/* Bodies — col 2-3, собственный flex-col без учёта asides.
                    data-section-body="<id>" — для height-sync sticky-wrapper'ов asides. */}
                <div className="lg:col-span-2 flex flex-col gap-24">
                  {article.sections.map((section) => (
                    <div key={section.id} data-section-body={section.id}>
                      <SectionBody
                        section={section}
                        resolvedQuoteExperts={resolvedQuoteExperts}
                      />
                    </div>
                  ))}
                </div>

                {/* Asides — col 4, собственный flex-col. pl-[45px] — контент прибит
                    к правому краю колонки (см. Figma 1133:8040).
                    Каждый кластер sticky НО обёрнут в свой wrapper (`data-section-aside-wrap`).
                    JS ниже выставляет wrapper.height = max(body.height, inner.height) —
                    при скролле предыдущий sticky «выталкивается» концом своего wrapper'а,
                    следующий пинится на top-24, без наложения. */}
                <aside data-aside-col className="lg:col-span-1 lg:pl-[45px]">
                  {/* Рендерим wrapper для КАЖДОЙ секции (даже без asides) — так
                      каждый aside-кластер стоит напротив своей секции в body-колонке.
                      gap-10 (40px) — разница (BODY_GAP 96 − ASIDE_GAP 40 = 56px)
                      компенсируется в wrapper.height (см. useLayoutEffect) — верх
                      каждого следующего wrapper'а попадает ровно на верх h2 своей
                      секции. Если aside-кластер выше body-секции + COMP, wrapper
                      расширяется под inner, пушит следующий wrapper вниз. */}
                  <div className="flex flex-col gap-10">
                    {article.sections.map((section) => (
                      <div
                        key={section.id}
                        data-section-aside-wrap={section.id}
                        className="relative"
                      >
                        {section.asides.length > 0 && (
                          <div data-section-aside-sticky-zone={section.id}>
                            <div
                              data-section-aside-inner={section.id}
                              className="sticky top-24 flex flex-col gap-3"
                            >
                              {section.asidesTitleEnabled &&
                                section.asidesTitle.trim() && (
                                  <h4 className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.02em] text-[color:var(--rm-gray-fg-sub)]">
                                    {section.asidesTitle}
                                  </h4>
                                )}
                              {section.asides.map((aside) => (
                                <AsideItem
                                  key={aside.id}
                                  aside={aside}
                                  resolvedProducts={resolvedProducts}
                                  onPreviewFile={setPreviewFile}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </aside>
              </div>
            )
          ) : (
            <div className="flex flex-col items-start gap-3 rounded-sm border border-dashed border-[color:var(--rm-gray-3)] bg-[color:var(--rm-gray-1)]/20 p-6 md:p-10">
              <p className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.02em] text-[color:var(--rm-gray-fg-sub)]">
                Тело статьи пусто
              </p>
              <p className="text-[length:var(--text-14)] leading-[1.4] text-[color:var(--rm-gray-fg-sub)]">
                Добавьте секции с блоками в админке.
              </p>
            </div>
          )}
        </div>
      </div>

      <FilePreviewModal
        file={previewFile}
        onClose={() => setPreviewFile(null)}
      />
    </article>
    </TooltipProvider>
  );
}

// ── Сборка блоков секции (H2 + блоки) для ArticleBody ───────────────────────
// Title добавляется как h2-блок, чтобы переиспользовать логику ritm-отступов
// и slugify id (якоря / ToC) из article-body.tsx.
function sectionBlocks(section: ArticleSection): ArticleBodyBlock[] {
  const title = section.title.trim();
  return title
    ? [
        { id: `${section.id}_h2`, type: "h2", data: { text: title } },
        ...section.blocks,
      ]
    : section.blocks;
}

function SectionBody({
  section,
  resolvedQuoteExperts,
}: {
  section: ArticleSection;
  resolvedQuoteExperts: Record<string, ResolvedQuoteExpert>;
}) {
  const blocks = sectionBlocks(section);
  const quotes = section.quotes
    .map((q) => resolveQuote(q, resolvedQuoteExperts))
    .filter((q): q is ExpertQuoteItem => q !== null);
  if (blocks.length === 0 && quotes.length === 0) return null;
  return (
    <div className="min-w-0">
      {blocks.length > 0 && (
        <div data-section-body-blocks={section.id}>
          <ArticleBody blocks={blocks} />
        </div>
      )}
      {quotes.length > 0 && (
        <div
          data-section-quote={section.id}
          // layout по умолчанию "narrow" — переключается на "wide" в
          // useLayoutEffect по соотношению высот body (блоки) vs aside.
          data-quote-layout="narrow"
          className={blocks.length > 0 ? "mt-[40px]" : ""}
        >
          {/* Оба варианта в DOM, видимым управляет JS через display
              (см. useLayoutEffect sync). До первого measure — narrow (SSR). */}
          <div data-quote-variant="narrow">
            <ExpertQuoteStack quotes={quotes} variant="narrow" />
          </div>
          <div data-quote-variant="wide" style={{ display: "none" }}>
            <ExpertQuoteStack quotes={quotes} variant="wide" />
          </div>
        </div>
      )}
    </div>
  );
}

// Мобильная секция: body + aside-кластер стеком (aside идёт под body секции).
function SectionMobile({
  section,
  resolvedProducts,
  resolvedQuoteExperts,
  onPreviewFile,
}: {
  section: ArticleSection;
  resolvedProducts: Record<string, ResolvedProductAside>;
  resolvedQuoteExperts: Record<string, ResolvedQuoteExpert>;
  onPreviewFile: (file: FilePreviewFile) => void;
}) {
  const blocks = sectionBlocks(section);
  const hasAsides = section.asides.length > 0;
  const quotes = section.quotes
    .map((q) => resolveQuote(q, resolvedQuoteExperts))
    .filter((q): q is ExpertQuoteItem => q !== null);
  return (
    <section className="flex flex-col gap-8">
      {blocks.length > 0 && (
        <div className="min-w-0">
          <ArticleBody blocks={blocks} />
        </div>
      )}
      {quotes.length > 0 && (
        <div className="min-w-0">
          <ExpertQuoteStack quotes={quotes} variant="mobile" />
        </div>
      )}
      {hasAsides && (
        <div className="flex flex-col gap-3">
          {section.asidesTitleEnabled && section.asidesTitle.trim() && (
            <h4 className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.02em] text-[color:var(--rm-gray-fg-sub)]">
              {section.asidesTitle}
            </h4>
          )}
          {section.asides.map((aside) => (
            <AsideItem
              key={aside.id}
              aside={aside}
              resolvedProducts={resolvedProducts}
              onPreviewFile={onPreviewFile}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function AsideItem({
  aside,
  resolvedProducts,
  onPreviewFile,
}: {
  aside: ArticleAside;
  resolvedProducts: Record<string, ResolvedProductAside>;
  onPreviewFile: (file: FilePreviewFile) => void;
}) {
  if (aside.kind === "file") {
    const title = aside.displayName.trim() || aside.fileName || "Файл";
    return (
      <AsideHint action="Открыть предпросмотр файла" detail={title}>
        <SectionAsideChip
          title={title}
          href={aside.fileUrl}
          showPreview={aside.showPreview}
          previewImageUrl={aside.previewImageUrl}
          previewCropMode={aside.previewCropMode}
          external={false}
          onClick={(e) => {
            // Открываем модал предпросмотра вместо перехода по ссылке.
            // Download-функция всё равно доступна — в модале есть кнопка «Скачать».
            e.preventDefault();
            onPreviewFile({
              url: aside.fileUrl,
              fileName: aside.fileName,
              displayName: aside.displayName,
            });
          }}
        />
      </AsideHint>
    );
  }
  if (aside.kind === "link") {
    const title = aside.displayName.trim() || aside.url;
    return (
      <AsideHint
        action="Перейти по внешней ссылке (новая вкладка)"
        detail={title}
      >
        <SectionAsideChip
          title={title}
          href={aside.url}
          showPreview={aside.showPreview}
          previewImageUrl={aside.previewImageUrl}
          previewCropMode={aside.previewCropMode}
          external
        />
      </AsideHint>
    );
  }
  if (aside.kind === "logos") {
    // Монохромная колонка логотипов. Высота каждого лого — авто (по маске),
    // ширина — из widthPx. Вертикальные отступы между лого 32px desktop / 24px mobile.
    return (
      <ul className="flex list-none flex-col gap-6 md:gap-8">
        {aside.logos.map((logo) => (
          <li
            key={logo.id}
            className="block"
            style={{
              width: `${logo.widthPx}px`,
              height: "32px",
              backgroundColor: "var(--rm-gray-fg-sub)",
              WebkitMaskImage: `url("${logo.src}")`,
              maskImage: `url("${logo.src}")`,
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "left center",
              maskPosition: "left center",
              WebkitMaskSize: "contain",
              maskSize: "contain",
            }}
            aria-label="logo"
          />
        ))}
      </ul>
    );
  }
  // product
  const key = `${aside.productCategory}:${aside.productSlug}`;
  const resolved = resolvedProducts[key];
  if (!resolved) return null;
  return (
    <AsideHint
      action="Перейти на страницу продукта"
      detail={resolved.title}
    >
      <SectionAsideProductCard
        href={resolved.href}
        title={resolved.title}
        description={resolved.description}
        coverUrl={resolved.coverUrl}
        experts={resolved.experts}
        variant={
          resolved.category === "academy" ||
          resolved.category === "ai-products"
            ? "image"
            : "default"
        }
      />
    </AsideHint>
  );
}

/**
 * Обёртка с тултипом над asid-карточкой: при hover/focus показывает
 * «что произойдёт при клике» + полное название (актуально когда оно усекается
 * line-clamp'ом).
 *
 * Используется base-ui Tooltip: trigger рендерится через `render={...}` prop —
 * тултип подхватывает ref/события ссылки, без лишней обёртки <button>.
 */
function AsideHint({
  action,
  detail,
  children,
}: {
  action: string;
  detail: string;
  children: React.ReactElement;
}) {
  return (
    <Tooltip>
      <TooltipTrigger render={children} />
      <TooltipContent
        side="left"
        align="start"
        className="max-w-[280px] border border-[#404040] bg-[#0A0A0A] text-[color:var(--rm-gray-fg-main)]"
      >
        <div className="flex flex-col gap-0.5">
          <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-10)] uppercase tracking-[0.02em] text-[color:var(--rm-yellow-100)]">
            {action}
          </span>
          <span className="text-[length:var(--text-12)] leading-[1.35]">
            {detail}
          </span>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
