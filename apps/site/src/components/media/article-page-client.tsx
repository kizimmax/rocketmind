"use client";

import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import {
  Breadcrumbs,
  Tag,
  Author,
  KeyThoughts,
  ArticleNav,
  TooltipProvider,
  slugifyArticleHeading,
} from "@rocketmind/ui";
import type {
  ArticleEntry,
  ResolvedProductAside,
  ResolvedQuoteExpert,
} from "@/lib/articles";
import type { CtaEntity } from "@/lib/ctas";
import {
  FilePreviewModal,
  type FilePreviewFile,
} from "./file-preview-modal";
import {
  SectionBody,
  SectionMobile,
  AsideItem,
} from "./article-section-renderers";

interface Props {
  article: ArticleEntry;
  expertName: string | null;
  expertAvatarUrl: string | null;
  tagItems: { id: string; label: string }[];
  /** Резолвенные данные продуктов (ключ `${category}:${slug}`). */
  resolvedProducts: Record<string, ResolvedProductAside>;
  /** Резолвенные данные экспертов для цитат (ключ — expertSlug). */
  resolvedQuoteExperts: Record<string, ResolvedQuoteExpert>;
  /** Резолвенные CTA-блоки (ключ — id CTA). Используются в bottomCtaId секции и cta-aside. */
  resolvedCtas: Record<string, CtaEntity>;
}

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

// Gap body-колонки (`gap-24` = 96px) и aside-колонки (`gap-10` = 40px)
// в десктопной раскладке. Разница компенсируется в wrapper.height ниже,
// чтобы верх каждого следующего aside-wrapper'а попадал на верх H2 своей секции.
const BODY_GAP_PX = 96;
const ASIDE_GAP_PX = 40;
const GAP_COMPENSATION = BODY_GAP_PX - ASIDE_GAP_PX;

// Staggered entrance: opacity 0 → 1, slide-up 20px → 0. Easing — easeOutExpo
// (`cubic-bezier(0.16, 1, 0.3, 1)`) для мягкого «прибытия». Шаг 90ms между
// уровнями: breadcrumbs/ToC → заголовок → обложка/aside → тело статьи.
function stagger(index: number): React.CSSProperties {
  return {
    opacity: 0,
    animation: `heroFadeIn 700ms cubic-bezier(0.16, 1, 0.3, 1) ${index * 90}ms forwards`,
  };
}

export function ArticlePageClient({
  article,
  resolvedQuoteExperts,
  expertName,
  expertAvatarUrl,
  tagItems,
  resolvedProducts,
  resolvedCtas,
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
        // Bottom CTA — full-bleed только по ширине body-колонки, aside-колонку
        // НЕ перекрывает. Поэтому sticky-карточки должны оставаться в потоке
        // на всю высоту CTA (видимы рядом с ним), а не отлипать на его верху.
        const cta = document.querySelector<HTMLElement>(
          `[data-section-body-cta="${id}"]`,
        );
        const ctaH = cta ? cta.getBoundingClientRect().height : 0;
        const quoteLayout: "wide" | "narrow" | null = quote
          ? bbH >= innerH
            ? "wide"
            : "narrow"
          : null;

        // Sticky-zone: в wide-режиме цитата перекрывает aside-колонку по ширине,
        // поэтому sticky-карточки должны отлипать ДО цитаты — ограничиваем zone
        // высотой блоков + CTA (CTA остаётся в body-колонке, не пересекается
        // с aside). В остальных случаях — полная bodyH (она уже включает CTA).
        if (zone && innerH > 0) {
          const blocksAndCta = bbH + ctaH;
          const zoneCap =
            quoteLayout === "wide" && blocksAndCta > 0 ? blocksAndCta : bodyH;
          zone.style.height = `${Math.max(innerH, zoneCap)}px`;
        }

        // Factoid-grid sync (section-level). Сетка живёт строго сверху секции,
        // под H2 — поэтому offset для aside-inner детерминирован.
        //   - в 3-кол layout растягиваем обёртку в col-4 negative marginRight'ом
        //     (как wide-quote), чтобы 3-я карточка визуально жила в aside-col;
        //   - суммируем высоты рядов, где есть 3-я карточка (только они
        //     перекрывают aside-колонку), и применяем как paddingTop на
        //     aside-inner — sticky-карточки начинают зону ниже 3-х
        //     карточек фактоидов и не пересекаются с ними.
        const factoidsEl = body.querySelector<HTMLElement>(
          `[data-section-factoids="${id}"]`,
        );
        let factoidOffset = 0;
        if (factoidsEl) {
          const grid = factoidsEl.querySelector<HTMLElement>(
            "[data-factoid-grid]",
          );
          if (grid) {
            const cells = Array.from(
              grid.querySelectorAll<HTMLElement>("[data-factoid-card]"),
            );
            // cols берём из реальной CSS-сетки. На сайте grid-template-columns
            // выставляется inline (`repeat(N, ...)`).
            const tpl = window
              .getComputedStyle(grid)
              .getPropertyValue("grid-template-columns")
              .trim();
            const cols = tpl ? tpl.split(/\s+/).length : 1;

            // Col-4 overflow — только в 3-кол layout (≥1280).
            const asideCol = document.querySelector<HTMLElement>(
              "[data-aside-col]",
            );
            const asideW = asideCol ? asideCol.offsetWidth : 0;
            // 3-я карточка визуально полностью занимает col-4 (как wide-quote).
            // Aside-контент НЕ накладывается потому, что мы сдвигаем его вниз
            // через paddingTop на aside-inner (см. ниже).
            if (cols >= 3 && asideW > 0 && cells.length >= 3) {
              factoidsEl.style.marginRight = `-${asideW + 8}px`;
            } else {
              factoidsEl.style.marginRight = "";
            }

            // Группируем клетки по фактическому viewport-Y — это даёт
            // ряды независимо от newRow / auto-wrap логики FactoidGrid.
            // Берём BOTTOM-Y последнего ряда, в котором >=3 карточки
            // (=есть 3-я карточка в col-4-зоне), относительно top'а
            // aside-inner. Это даёт точный paddingTop: aside-контент
            // начнётся РОВНО под этим рядом + 24px воздуха.
            if (cols >= 3 && cells.length > 0 && inner) {
              type RowInfo = { top: number; bottom: number; count: number };
              const rows: RowInfo[] = [];
              for (const cell of cells) {
                const r = cell.getBoundingClientRect();
                const top = Math.round(r.top);
                let row = rows.find((x) => Math.abs(x.top - top) < 2);
                if (!row) {
                  row = { top, bottom: r.bottom, count: 0 };
                  rows.push(row);
                }
                row.count += 1;
                if (r.bottom > row.bottom) row.bottom = r.bottom;
              }
              let lastConflictBottom = 0;
              for (const row of rows) {
                if (row.count >= 3 && row.bottom > lastConflictBottom) {
                  lastConflictBottom = row.bottom;
                }
              }
              if (lastConflictBottom > 0) {
                // Берём wrap.top (не inner.top) — wrap не sticky, его top
                // соответствует НАТУРАЛЬНОЙ позиции inner. Если inner уже
                // pinned, его getBoundingClientRect().top = 96, что даст
                // неверный paddingTop при последующем re-sync.
                const wrapTop = wrap.getBoundingClientRect().top;
                factoidOffset = Math.max(0, lastConflictBottom - wrapTop + 24);
              }
            }
          }
        }
        // Применяем offset через spacer внутри aside-zone (перед inner),
        // а НЕ через padding-top на inner. paddingTop сделал бы inner таким
        // же высоким, и при sticky-pinned контент инера оказывался бы на
        // viewport y = 96 + paddingTop (= где-то в середине экрана). Spacer
        // же — обычный элемент в потоке, пушит inner natural-top вниз, но
        // pinned-позиция inner остаётся на top:24 viewport.
        const spacer = wrap.querySelector<HTMLElement>(
          `[data-section-aside-spacer="${id}"]`,
        );
        if (spacer) {
          spacer.style.height = factoidOffset > 0 ? `${factoidOffset}px` : "";
        }
        if (inner) {
          // Зачищаем старый paddingTop (от предыдущих версий sync).
          inner.style.paddingTop = "";
        }
        // Пересчитываем zone height, учитывая spacer перед inner.
        // Без этого zone может оказаться меньше (innerH + factoidOffset), и
        // sticky inner упрётся в bottom зоны раньше, чем нужно.
        if (zone && innerH > 0 && factoidOffset > 0) {
          const blocksAndCta = bbH + ctaH;
          const zoneCap =
            quoteLayout === "wide" && blocksAndCta > 0 ? blocksAndCta : bodyH;
          zone.style.height = `${Math.max(innerH + factoidOffset, zoneCap)}px`;
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
        <article className="py-16 md:py-20">
          <div className="mx-auto max-w-[1512px] px-5 md:px-8 xl:px-14">
            <div className="grid grid-cols-4 gap-2">
              {/* Col 1 — ToC, sticky через всю страницу */}
              <aside className="col-span-1" style={stagger(0)}>
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
                  <div className="mb-10 pt-4" style={stagger(0)}>{breadcrumbs}</div>

                  <div className="flex flex-col gap-10" data-hero-title-block>
                    <div className="flex flex-col gap-7" style={stagger(1)}>
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
                      <div
                        className="relative overflow-hidden rounded-sm bg-[color:var(--rm-gray-1)]"
                        style={stagger(2)}
                      >
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
                        style={stagger(2)}
                      />
                    )}
                  </div>
                </div>

                {hasAnyContent ? (
                  <div
                    id="article-body"
                    className="mt-24 flex flex-col gap-24"
                    style={stagger(3)}
                  >
                    {article.sections.map((section) => (
                      <div key={section.id} data-section-body={section.id}>
                        <SectionBody
                          section={section}
                          resolvedQuoteExperts={resolvedQuoteExperts}
                          resolvedCtas={resolvedCtas}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    className="mt-24 flex flex-col items-start gap-3 rounded-sm border border-dashed border-[color:var(--rm-gray-3)] bg-[color:var(--rm-gray-1)]/20 p-6 md:p-10"
                    style={stagger(3)}
                  >
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
                <div data-hero-aside className="flex flex-col gap-10" style={stagger(2)}>
                  {tagItems.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {tagItems.map(({ id, label }) => (
                        <Tag
                          key={id}
                          as="a"
                          href={`${BASE}/media/tag/${id}`}
                          size="l"
                          state="interactive"
                        >
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
                  <div className="mt-24 flex flex-col gap-10" style={stagger(3)}>
                    {article.sections.map((section) => (
                      <div
                        key={section.id}
                        data-section-aside-wrap={section.id}
                        className="relative"
                      >
                        {section.asides.length > 0 && (
                          <div data-section-aside-sticky-zone={section.id}>
                            {/* Spacer пушит inner вниз в потоке зоны на
                                высоту ряда factoid'ов с 3-й карточкой —
                                но НЕ влияет на pinned-позицию (sticky сам
                                встаёт на top:24 viewport). Высоту spacer'а
                                выставляет sync в article-page-client. */}
                            <div data-section-aside-spacer={section.id} />
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
                                  resolvedCtas={resolvedCtas}
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
    <article className="py-16 md:py-20">
      <div className="mx-auto max-w-[1512px] px-5 md:px-8 xl:px-14">
        <div
          className="mb-8 pt-2 md:mb-10 md:pt-0"
          style={stagger(0)}
        >
          {breadcrumbs}
        </div>

        {/* ── HERO ──
            На lg+: та же 4-колоночная сетка, что и body ниже.
            Левая часть (title/description/cover) занимает cols 1-3 (col-span-3),
            aside (tags/author/keyThoughts) — col 4 с pl-[45px] (как aside-колонка body,
            см. Figma 1133:8040). На узких экранах (<lg) стекается в 1 колонку. */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4 lg:gap-2">
          <div className="flex flex-col gap-8 md:gap-10 lg:col-span-3">
            <div className="flex flex-col gap-4 md:gap-7" style={stagger(1)}>
              <h1 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-32)] uppercase tracking-[-0.02em] leading-[1.08] text-[color:var(--rm-gray-fg-main)] md:text-[52px]">
                {article.title}
              </h1>
              {article.description && (
                <p className="text-[length:var(--text-16)] leading-[1.28] text-[color:var(--rm-gray-fg-main)] md:text-[length:var(--text-18)] md:leading-[1.2]">
                  {article.description}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-5 lg:hidden" style={stagger(2)}>
              {tagItems.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tagItems.map(({ id, label }) => (
                    <Tag
                      key={id}
                      as="a"
                      href={`${BASE}/media/tag/${id}`}
                      size="m"
                      state="interactive"
                    >
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
              <div
                className="relative overflow-hidden rounded-sm bg-[color:var(--rm-gray-1)]"
                style={stagger(2)}
              >
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
                style={stagger(2)}
              />
            )}
          </div>

          <aside
            className="hidden flex-col gap-10 lg:col-span-1 lg:flex lg:pl-[45px]"
            style={stagger(2)}
          >
            {tagItems.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tagItems.map(({ id, label }) => (
                  <Tag
                    key={id}
                    as="a"
                    href={`${BASE}/media/tag/${id}`}
                    size="l"
                    state="interactive"
                  >
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
            <div className="lg:hidden" style={stagger(3)}>
              <KeyThoughts thoughts={article.keyThoughts} />
            </div>
          )}
        </div>

        {/* ── BODY ──
            На мобилке (<lg): per-section стек — body + asides секции идут одной пачкой.
            На десктопе (lg+): адаптивная 4-колоночная сетка с ДВУМЯ НЕЗАВИСИМЫМИ
            потоками — все bodies текут в col 2-3 (без дыр, даже если aside-колонка
            длиннее), все asides текут в col 4. Asides sticky — стекуются по скроллу. */}
        <div className="mt-16 md:mt-24" style={stagger(3)}>
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
                    resolvedCtas={resolvedCtas}
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
                        resolvedCtas={resolvedCtas}
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
                            {/* Spacer пушит inner вниз в потоке зоны на
                                высоту ряда factoid'ов с 3-й карточкой —
                                но НЕ влияет на pinned-позицию (sticky сам
                                встаёт на top:24 viewport). Высоту spacer'а
                                выставляет sync в article-page-client. */}
                            <div data-section-aside-spacer={section.id} />
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
                                  resolvedCtas={resolvedCtas}
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

