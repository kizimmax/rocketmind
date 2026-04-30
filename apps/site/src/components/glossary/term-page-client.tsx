"use client";

import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import {
  ArticleNav,
  Breadcrumbs,
  Tag,
  TooltipProvider,
  slugifyArticleHeading,
} from "@rocketmind/ui";
import {
  AsideItem,
  SectionBody,
  SectionMobile,
} from "@/components/media/article-section-renderers";
import {
  FilePreviewModal,
  type FilePreviewFile,
} from "@/components/media/file-preview-modal";
import type {
  ResolvedProductAside,
  ResolvedQuoteExpert,
} from "@/lib/articles";
import type { CtaEntity } from "@/lib/ctas";
import type { GlossaryTermEntry } from "@/lib/glossary";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

// Gap body-колонки (`gap-24` = 96px) и aside-колонки (`gap-10` = 40px).
// Разница компенсируется в wrapper.height ниже — верх каждого aside-wrapper'а
// попадает на верх H2 своей секции (та же логика, что и у статей).
const BODY_GAP_PX = 96;
const ASIDE_GAP_PX = 40;
const GAP_COMPENSATION = BODY_GAP_PX - ASIDE_GAP_PX;

// Staggered entrance: opacity 0 → 1, slide-up 20px → 0. Easing — easeOutExpo
// для мягкого «прибытия». Шаг 90ms между уровнями: breadcrumbs/ToC →
// заголовок+описание → теги → секции тела + asides.
function stagger(index: number): React.CSSProperties {
  return {
    opacity: 0,
    animation: `heroFadeIn 700ms cubic-bezier(0.16, 1, 0.3, 1) ${index * 90}ms forwards`,
  };
}

interface Props {
  term: GlossaryTermEntry;
  tagItems: { id: string; label: string }[];
  resolvedProducts: Record<string, ResolvedProductAside>;
  resolvedQuoteExperts: Record<string, ResolvedQuoteExpert>;
  resolvedCtas: Record<string, CtaEntity>;
}

/**
 * Страница одного термина глоссария. Сетка идентична статье
 * (`article-page-client.tsx`, ветка standard layout):
 *   - hero: 4-col grid, заголовок+описание (cols 1-3) + теги (col 4);
 *   - body: 4-col grid, ToC (col 1), bodies (cols 2-3), asides (col 4) с
 *     height-sync sticky-кластеров. На мобилке — стек `SectionMobile`.
 *
 * Отличия от статьи: нет обложки, автора, даты, ключевых мыслей и цитат
 * в hero (цитаты внутри body-секций сохраняются — они часть данных секции).
 */
export function GlossaryTermPageClient({
  term,
  tagItems,
  resolvedProducts,
  resolvedQuoteExperts,
  resolvedCtas,
}: Props) {
  const [previewFile, setPreviewFile] = useState<FilePreviewFile | null>(null);

  // ToC: items из section.title (пропускаем секции без заголовка).
  const navItems = useMemo(
    () =>
      term.sections
        .filter((s) => s.title.trim())
        .map((s) => ({
          id: slugifyArticleHeading(s.title.trim()),
          label: s.navLabel?.trim() || s.title.trim(),
        })),
    [term.sections],
  );

  const hasAnyContent = term.sections.some(
    (s) =>
      s.title.trim() ||
      s.blocks.length > 0 ||
      s.asides.length > 0 ||
      s.quotes.length > 0,
  );

  // Scrollspy: активен тот H2, верх которого уже прошёл линию 92px от верха
  // viewport. Логика 1-в-1 как у article-page-client.
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
        if (top <= 92 + 4) lastPassed = item.id;
        else break;
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

  function scrollToSection(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveId(id);
  }

  // Mobile vs desktop — single source of truth для рендера body.
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const apply = () => setIsDesktop(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // ≥1280px — unified 4-кол grid для всей страницы (как у статьи в isWide).
  // ToC уезжает в col 1 на самый верх, breadcrumbs + hero + body — в cols 2-3,
  // hero aside (теги) + body asides — в col 4. Ниже 1280 — стандартная раскладка
  // (отдельный hero + body с ToC).
  const [isWide, setIsWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1280px)");
    const apply = () => setIsWide(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Height-sync для sticky-asides: wrapper.height = max(bodyH + COMP, innerH),
  // sticky-zone = max(innerH, bodyH). Дополнительно — wide/narrow цитаты по
  // соотношению высот блоков и aside-кластера + hero sync (data-hero-aside
  // подтягивается под высоту data-hero-left в unified-раскладке ≥1280).
  // Логика идентична статье.
  useLayoutEffect(() => {
    function sync() {
      // 1) Hero sync (unified-раскладка ≥1280): правая hero-обёртка (теги)
      //    тянется до высоты левой (заголовок+описание) — чтобы первая
      //    body-секция и первая body-aside-секция стартовали на одном Y.
      const heroLeft = document.querySelector<HTMLElement>("[data-hero-left]");
      const heroAside = document.querySelector<HTMLElement>("[data-hero-aside]");
      if (heroLeft && heroAside) {
        const h = heroLeft.getBoundingClientRect().height;
        heroAside.style.minHeight = `${h}px`;
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

        if (zone && innerH > 0) {
          const zoneCap = quoteLayout === "wide" && bbH > 0 ? bbH : bodyH;
          zone.style.height = `${Math.max(innerH, zoneCap)}px`;
        }

        if (quote && quoteLayout) {
          const layout = quoteLayout;
          if (quote.getAttribute("data-quote-layout") !== layout) {
            quote.setAttribute("data-quote-layout", layout);
            const narrow = quote.querySelector<HTMLElement>(
              "[data-quote-variant=narrow]",
            );
            const wide = quote.querySelector<HTMLElement>(
              "[data-quote-variant=wide]",
            );
            if (narrow)
              narrow.style.display = layout === "narrow" ? "" : "none";
            if (wide) wide.style.display = layout === "wide" ? "" : "none";
          }
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
    window.addEventListener("resize", sync);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", sync);
    };
  }, [term.sections, isDesktop, isWide]);

  const breadcrumbs = (
    <Breadcrumbs
      items={[
        { label: "Главная", href: `${BASE}/` },
        { label: "Медиа", href: `${BASE}/media` },
        { label: "Глоссарий", href: `${BASE}/media/glossary` },
        { label: term.title },
      ]}
    />
  );

  // ≥1280px — unified 4-кол grid: ToC col 1 поднимается к breadcrumbs,
  // breadcrumbs + hero (заголовок+описание) + body — cols 2-3, hero aside
  // (теги) + body asides — col 4. Точная сетка статьи (article-page-client.tsx).
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
                      Навигация появится после добавления заголовков
                    </p>
                  )}
                </div>
              </aside>

              {/* Cols 2-3 — breadcrumbs + hero + body sections.
                  data-hero-left: высота этой обёртки транслируется в min-height
                  правой (data-hero-aside) — чтобы body-bodies и body-asides
                  стартовали на одном Y. */}
              <div className="col-span-2 flex flex-col">
                <div data-hero-left>
                  <div className="mb-10 pt-4" style={stagger(0)}>
                    {breadcrumbs}
                  </div>

                  <div
                    className="flex flex-col gap-7"
                    data-hero-title-block
                    style={stagger(1)}
                  >
                    <h1 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-32)] uppercase tracking-[-0.02em] leading-[1.08] text-[color:var(--rm-gray-fg-main)] md:text-[52px]">
                      {term.title}
                    </h1>
                    {term.description && (
                      <p className="text-[length:var(--text-16)] leading-[1.28] text-[color:var(--rm-gray-fg-main)] md:text-[length:var(--text-18)] md:leading-[1.2] whitespace-pre-line">
                        {term.description}
                      </p>
                    )}
                  </div>
                </div>

                {hasAnyContent ? (
                  <div
                    id="article-body"
                    className="mt-24 flex flex-col gap-24"
                    style={stagger(3)}
                  >
                    {term.sections.map((section) => (
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
                  <p
                    className="mt-24 text-[length:var(--text-14)] leading-[1.4] text-[color:var(--rm-gray-fg-sub)]"
                    style={stagger(3)}
                  >
                    Описание термина пока не добавлено.
                  </p>
                )}
              </div>

              {/* Col 4 — hero aside (теги) + body asides.
                  data-hero-aside — обёртка, которой useLayoutEffect выставляет
                  min-height = высоте data-hero-left, и paddingTop = смещению
                  заголовка от верха left-обёртки. Так теги встают напротив h1. */}
              <aside data-aside-col className="col-span-1 pl-[45px]">
                <div data-hero-aside style={stagger(2)}>
                  {tagItems.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {tagItems.map((t) => (
                        <a
                          key={t.id}
                          href={`${BASE}/media/glossary/tag/${t.id}`}
                          className="inline-flex"
                        >
                          <Tag size="l" state="interactive" as="span">
                            {t.label}
                          </Tag>
                        </a>
                      ))}
                    </div>
                  )}
                </div>

                {hasAnyContent && (
                  <div className="mt-24 flex flex-col gap-10" style={stagger(3)}>
                    {term.sections.map((section) => (
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
          {/* Breadcrumbs */}
          <div
            className="mb-8 pt-2 md:mb-10 md:pt-0"
            style={stagger(0)}
          >
            {breadcrumbs}
          </div>

          {/* HERO — та же 4-кол сетка, что и body. Заголовок+описание в cols 1-3,
              теги — col 4 с pl-[45px]. На мобилке стекается в 1 колонку. */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4 lg:gap-2">
            <div className="flex flex-col gap-8 md:gap-10 lg:col-span-3">
              <div className="flex flex-col gap-4 md:gap-7" style={stagger(1)}>
                <h1 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-32)] uppercase tracking-[-0.02em] leading-[1.08] text-[color:var(--rm-gray-fg-main)] md:text-[52px]">
                  {term.title}
                </h1>
                {term.description && (
                  <p className="text-[length:var(--text-16)] leading-[1.28] text-[color:var(--rm-gray-fg-main)] md:text-[length:var(--text-18)] md:leading-[1.2] whitespace-pre-line">
                    {term.description}
                  </p>
                )}
              </div>

              {/* mobile-only: теги под описанием (на lg+ они уйдут в правую колонку) */}
              {tagItems.length > 0 && (
                <div
                  className="flex flex-wrap gap-2 lg:hidden"
                  style={stagger(2)}
                >
                  {tagItems.map((t) => (
                    <a
                      key={t.id}
                      href={`${BASE}/media/glossary/tag/${t.id}`}
                      className="inline-flex"
                    >
                      <Tag size="m" state="interactive" as="span">
                        {t.label}
                      </Tag>
                    </a>
                  ))}
                </div>
              )}
            </div>

            <aside
              className="hidden flex-col gap-10 lg:col-span-1 lg:flex lg:pl-[45px]"
              style={stagger(2)}
            >
              {tagItems.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tagItems.map((t) => (
                    <a
                      key={t.id}
                      href={`${BASE}/media/glossary/tag/${t.id}`}
                      className="inline-flex"
                    >
                      <Tag size="l" state="interactive" as="span">
                        {t.label}
                      </Tag>
                    </a>
                  ))}
                </div>
              )}
            </aside>
          </div>

          {/* BODY — мобилка: per-section стек. Десктоп: 4-кол grid, два независимых
              потока (bodies в col 2-3, asides в col 4) и ToC в col 1. */}
          <div className="mt-16 md:mt-24" style={stagger(3)}>
            {hasAnyContent ? (
              !isDesktop ? (
                <div
                  id="article-body"
                  className="flex flex-col gap-16 md:gap-24"
                >
                  {term.sections.map((section) => (
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
                <div className="grid grid-cols-4 gap-2">
                  {/* Col 1 — ToC */}
                  <aside className="lg:col-span-1">
                    <div className="sticky top-24">
                      <ArticleNav
                        items={navItems}
                        activeId={activeId}
                        onNavigate={scrollToSection}
                      />
                      {navItems.length === 0 && (
                        <p className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.02em] text-[color:var(--rm-gray-3)]">
                          Навигация появится после добавления заголовков
                        </p>
                      )}
                    </div>
                  </aside>

                  {/* Cols 2-3 — bodies. data-section-body="<id>" для height-sync asides. */}
                  <div className="lg:col-span-2 flex flex-col gap-24">
                    {term.sections.map((section) => (
                      <div key={section.id} data-section-body={section.id}>
                        <SectionBody
                          section={section}
                          resolvedQuoteExperts={resolvedQuoteExperts}
                          resolvedCtas={resolvedCtas}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Col 4 — asides. Те же data-* атрибуты, что и у статей. */}
                  <aside data-aside-col className="lg:col-span-1 lg:pl-[45px]">
                    <div className="flex flex-col gap-10">
                      {term.sections.map((section) => (
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
              <p className="text-[length:var(--text-14)] leading-[1.4] text-[color:var(--rm-gray-fg-sub)]">
                Описание термина пока не добавлено.
              </p>
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
