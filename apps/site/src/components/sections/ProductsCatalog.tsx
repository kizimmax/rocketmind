"use client";

import { Suspense, useState, useMemo, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ShaderBackground } from "@/components/ui/ShaderBackground";
import type { CatalogSection, CatalogCard } from "@/app/products/page";

// ── Filter definitions ─────────────────────────────────────────────────────────

type FilterKey = "all" | "consulting" | "academy" | "expert" | "ai-products";

type FilterDef = {
  key: FilterKey;
  label: string;
  icon: React.ReactNode;
};

/* ── SVG icons ──────────────────────────────────────────────────────────────── */

function GridIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function CompassIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10.5 5.5L9 9L5.5 10.5L7 7L10.5 5.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}

function GraduationIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 2L1.5 5.5L8 9L14.5 5.5L8 2Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M3.5 7V11.5L8 14L12.5 11.5V7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14.5 5.5V10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function UserStarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="6.5" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.3" />
      <path d="M1.5 14C1.5 11.2386 3.73858 9 6.5 9C7.5 9 8.4 9.3 9.2 9.8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M12 9L12.5 10.5H14L12.75 11.5L13.25 13L12 12L10.75 13L11.25 11.5L10 10.5H11.5L12 9Z" fill="currentColor" />
    </svg>
  );
}

function SparklesIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 1V15M8 1C8 5 11 8 15 8M8 1C8 5 5 8 1 8M8 15C8 11 11 8 15 8M8 15C8 11 5 8 1 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="13" cy="3" r="1" fill="currentColor" />
    </svg>
  );
}

const FILTERS: FilterDef[] = [
  { key: "all", label: "Все продукты", icon: <GridIcon /> },
  { key: "consulting", label: "Консалтинг и стратегия", icon: <CompassIcon /> },
  { key: "academy", label: "Онлайн-школа", icon: <GraduationIcon /> },
  { key: "expert", label: "Экспертные продукты", icon: <UserStarIcon /> },
  { key: "ai-products", label: "AI-продукты", icon: <SparklesIcon /> },
];

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

// ── Component ──────────────────────────────────────────────────────────────────

type Props = {
  sections: CatalogSection[];
};

export function ProductsCatalog({ sections }: Props) {
  return (
    <Suspense>
      <ProductsCatalogInner sections={sections} />
    </Suspense>
  );
}

function ProductsCatalogInner({ sections }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const paramFilter = (searchParams.get("filter") as FilterKey) || "all";
  const [activeFilter, setActiveFilter] = useState<FilterKey>(paramFilter);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  // Sync filter state when URL param changes (e.g. header nav click)
  const prevParam = useRef(paramFilter);
  if (prevParam.current !== paramFilter) {
    prevParam.current = paramFilter;
    setActiveFilter(paramFilter);
  }

  const allCards = useMemo(
    () => sections.flatMap((s) => s.cards),
    [sections],
  );

  const counts = useMemo(() => {
    const c: Record<FilterKey, number> = {
      all: allCards.length,
      consulting: allCards.filter((p) => p.category === "consulting").length,
      academy: allCards.filter((p) => p.category === "academy").length,
      expert: allCards.filter((p) => p.hasExperts).length,
      "ai-products": allCards.filter((p) => p.category === "ai-products").length,
    };
    return c;
  }, [allCards]);

  const handleFilter = useCallback(
    (key: FilterKey) => {
      setActiveFilter(key);
      const url = key === "all" ? "/products" : `/products?filter=${key}`;
      router.replace(url, { scroll: false });
    },
    [router],
  );

  const filteredSections = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return sections
      .map((section) => {
        let cards = section.cards;

        if (activeFilter === "expert") {
          cards = cards.filter((c) => c.hasExperts);
        } else if (activeFilter !== "all") {
          if (section.key !== activeFilter) return { ...section, cards: [] };
        }

        if (q) {
          cards = cards.filter(
            (c) =>
              c.cardTitle.toLowerCase().includes(q) ||
              c.cardDescription.toLowerCase().includes(q),
          );
        }

        return { ...section, cards };
      })
      .filter((s) => s.cards.length > 0);
  }, [sections, activeFilter, searchQuery]);

  return (
    <section className="bg-background text-foreground">

      {/* ═══ Hero with shader background ═══ */}
      <div className="relative">
        <div className="absolute inset-0 bottom-[-120px] lg:bottom-[-200px]">
          <ShaderBackground className="absolute inset-0 w-full h-full" />
          <div className="absolute inset-0 bg-background/50" />
        </div>
        <div className="relative z-10">
          {/* Mobile hero (< lg) */}
          <div className="lg:hidden px-5 pt-[102px] pb-6">
            <div className="flex flex-col gap-6">
              {/* Row: title + animated search */}
              <div className="flex items-end gap-3">
                <h1 className="font-heading text-[28px] font-bold uppercase leading-[1.16] tracking-[-0.01em] shrink-0">
                  Продукты
                </h1>
                {/* Animated search: collapses to chip, expands to input */}
                <div
                  className="relative h-8 overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
                  style={{ width: searchOpen ? "100%" : "auto" }}
                >
                  {searchOpen ? (
                    <>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-[5px] top-1/2 -translate-y-1/2 z-[1] text-muted-foreground pointer-events-none"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                      <input
                        ref={mobileInputRef}
                        type="text"
                        placeholder="Найти"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onBlur={() => { if (!searchQuery) setSearchOpen(false); }}
                        className="h-[42px] w-[133%] origin-top-left scale-75 pl-7 pr-8 bg-[#1A1A1A] border border-border rounded-[5px] font-mono text-[16px] uppercase tracking-[0.02em] text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:border-ring"
                      />
                      {searchQuery && (
                        <button
                          onMouseDown={(e) => { e.preventDefault(); setSearchQuery(""); }}
                          className="absolute right-1 top-1/2 -translate-y-1/2 z-[1] flex items-center justify-center w-5 h-5 text-muted-foreground cursor-pointer"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                        </button>
                      )}
                    </>
                  ) : (
                    <button
                      onClick={() => { setSearchOpen(true); requestAnimationFrame(() => mobileInputRef.current?.focus()); }}
                      className="inline-flex items-center gap-2 h-8 px-2 border border-border rounded-[4px] bg-[#1A1A1A] text-muted-foreground font-mono text-[12px] uppercase tracking-[0.02em] cursor-pointer whitespace-nowrap"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                      <span>Найти продукт</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-[16px] md:text-[18px] leading-[1.2] text-foreground">
                Единый маркетплейс решений для трансформации вашего бизнеса.
                {" "}От бизнес-моделирования и консалтинга до корпоративного обучения
                {" "}и цифровых продуктов.
              </p>
            </div>
          </div>

          {/* Mobile filter chips — horizontal scroll, bleeds edge-to-edge */}
          <div className="lg:hidden overflow-x-auto px-5 pb-6 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: "none" }}>
            <div className="flex gap-1 w-max">
              {FILTERS.map((f) => {
                const isActive = f.key === activeFilter;
                return (
                  <button
                    key={f.key}
                    onClick={() => handleFilter(f.key)}
                    className={[
                      "inline-flex items-center gap-1 h-10 px-2 border rounded-[4px] shrink-0",
                      "font-mono text-[12px] uppercase tracking-[0.02em] transition-colors cursor-pointer whitespace-nowrap",
                      isActive
                        ? "bg-[#1A1A1A] text-[var(--rm-yellow-100)] border-border"
                        : "bg-background text-muted-foreground border-border",
                    ].join(" ")}
                  >
                    {f.icon}
                    <span>{f.label}</span>
                    <span className="text-[11px] text-muted-foreground/60">{counts[f.key]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Desktop hero (>= lg) */}
          <div className="hidden lg:block">
            <div className="mx-auto w-full max-w-[1512px] px-5 md:px-8 xl:px-14 pt-[144px] pb-12">
              <div className="flex flex-col gap-10 mt-10">
                {/* Title + description */}
                <div className="grid grid-cols-2">
                  <div className="pr-10">
                    <h1 className="font-heading text-[80px] font-extrabold uppercase leading-[1.08] tracking-[-0.02em]">
                      продукты
                    </h1>
                  </div>
                  <div className="flex items-center">
                    <p className="text-[18px] leading-[1.2] text-foreground pt-2">
                      Единый маркетплейс решений для трансформации вашего бизнеса.
                      {" "}От бизнес-моделирования и консалтинга до корпоративного обучения
                      {" "}и цифровых продуктов.
                    </p>
                  </div>
                </div>

                {/* Search + filters */}
                <div className="grid grid-cols-2">
                  <div className="pr-10">
                    <div className="relative max-w-[380px]">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3.5 top-1/2 -translate-y-1/2 z-[1] text-muted-foreground pointer-events-none"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                      <input
                        type="text"
                        placeholder="Найти продукт"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="relative w-full h-[48px] pl-10 pr-10 bg-background/60 backdrop-blur-sm border border-border rounded-[4px] font-mono text-[16px] uppercase tracking-[0.02em] text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:border-ring transition-colors"
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery("")}
                          className="absolute right-3 top-1/2 -translate-y-1/2 z-[1] flex items-center justify-center w-6 h-6 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {FILTERS.map((f) => {
                      const isActive = f.key === activeFilter;
                      return (
                        <button
                          key={f.key}
                          onClick={() => handleFilter(f.key)}
                          className={[
                            "inline-flex items-center gap-2 h-[48px] px-3.5 border rounded-[4px]",
                            "font-mono text-[16px] uppercase tracking-[0.02em] transition-colors cursor-pointer whitespace-nowrap",
                            isActive
                              ? "bg-[#1A1A1A]/80 backdrop-blur-sm text-[var(--rm-yellow-100)] border-border"
                              : "bg-background/60 backdrop-blur-sm text-muted-foreground border-border hover:text-foreground hover:border-foreground/40",
                          ].join(" ")}
                        >
                          {f.icon}
                          <span>{f.label}</span>
                          <span className="text-[14px] ml-0.5 text-muted-foreground/60">{counts[f.key]}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1512px] px-5 md:px-8 xl:px-14">

          {/* ═══ Sections (112px gap between major sections) ═══ */}
          <div
            key={activeFilter}
            className="flex flex-col gap-[72px] md:gap-[112px] mt-10 md:mt-[40px] pb-[72px] md:pb-[112px] animate-[slideUp_0.4s_ease-out]"
          >
            {filteredSections.length === 0 && (
              <>
                {/* Mobile: compact inline */}
                <div className="flex items-center gap-2 -mt-5 md:hidden">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-muted-foreground/40">
                    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /><path d="M8 11h6" />
                  </svg>
                  <p className="text-[14px] text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis">
                    {searchQuery
                      ? <>Ничего по &laquo;<span className="text-foreground">{searchQuery}</span>&raquo;</>
                      : "Нет продуктов"}
                  </p>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="shrink-0 ml-auto text-[12px] font-mono uppercase tracking-[0.02em] text-muted-foreground underline underline-offset-2 cursor-pointer"
                    >
                      Сбросить
                    </button>
                  )}
                </div>
                {/* Desktop */}
                <div className="hidden md:flex flex-col items-center justify-center py-24 lg:py-32 gap-4">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground/40">
                    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /><path d="M8 11h6" />
                  </svg>
                  <p className="text-[18px] text-muted-foreground text-center">
                    {searchQuery
                      ? <>Ничего по запросу <span className="text-foreground">&laquo;{searchQuery}&raquo;</span></>
                      : "Нет продуктов в этой категории"}
                  </p>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="inline-flex items-center gap-2 h-10 px-4 border border-border rounded-[4px] bg-background text-foreground font-mono text-[14px] uppercase tracking-[0.02em] transition-colors hover:bg-[#1A1A1A] cursor-pointer"
                    >
                      Сбросить поиск
                    </button>
                  )}
                </div>
              </>
            )}

            {filteredSections.map((section) => (
              <div key={section.key}>
                <div className="flex flex-col gap-8 md:gap-10">

                  {/* Section header — only visible in "all" tab */}
                  {activeFilter === "all" && (
                    <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2 lg:gap-0">
                      <div className="lg:pr-10">
                        <h2 className="font-heading text-[28px] md:text-[36px] lg:text-[52px] font-bold uppercase leading-[1.08] tracking-[-0.02em]">
                          {section.title}
                        </h2>
                      </div>
                      <div className="flex items-center lg:pt-[6px]">
                        <p className="text-[16px] md:text-[18px] leading-[1.2] text-foreground">
                          {section.description}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Cards grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
                    {section.cards.map((card) => (
                      <CatalogCardItem key={card.slug} card={card} />
                    ))}
                  </div>
                </div>

                {/* Partnership — visible in: all, academy, expert */}
                {section.key === "academy" &&
                  (activeFilter === "all" || activeFilter === "academy" || activeFilter === "expert") &&
                  <PartnershipBlock />}
              </div>
            ))}
          </div>

      </div>
    </section>
  );
}

// ── Partnership block ───────────────────────────────────────────────────────────

function PartnershipBlock() {
  return (
    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-10 mt-[72px] md:mt-[112px]">
      {/* Left: text content */}
      <div className="flex flex-col gap-8 lg:max-w-[560px]">
        {/* Tag + Title + Description */}
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[18px] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[var(--rm-yellow-100)]">
            Партнёрства
          </span>
          <div className="flex flex-col gap-6">
            <h3 className="font-heading text-[28px] md:text-[36px] lg:text-[52px] font-bold uppercase leading-[1.08] tracking-[-0.02em]">
              Программы с ведущими бизнес-школами
            </h3>
            <p className="text-[14px] leading-[1.32] tracking-[0.01em] text-muted-foreground">
              Помогают собрать карту участников, связей и ценностных потоков помогают собрать карту участников, связей и ценностных потоков
            </p>
          </div>
        </div>

        {/* Partner logos */}
        <div className="flex items-center gap-8">
          <img
            src={`${BASE_PATH}/images/partnerships/sberuniver.svg`}
            alt="СберУниверситет"
            className="h-auto w-auto max-h-[46px] max-w-[45%] object-contain"
          />
          <img
            src={`${BASE_PATH}/images/partnerships/skolkovo-moscow-school-160103.png`}
            alt="Сколково Московская школа управления"
            className="h-auto w-auto max-h-[56px] max-w-[45%] object-contain"
          />
        </div>
      </div>

      {/* Right: 2×2 photo grid */}
      <div className="grid grid-cols-2 gap-4 lg:w-[696px] shrink-0">
        <div className="aspect-[340/252] overflow-hidden">
          <img
            src={`${BASE_PATH}/images/partnerships/photo-1.png`}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="aspect-[340/252] overflow-hidden">
          <img
            src={`${BASE_PATH}/images/partnerships/photo-4.png`}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="aspect-[340/252] overflow-hidden">
          <img
            src={`${BASE_PATH}/images/partnerships/photo-3.png`}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="aspect-[340/252] overflow-hidden">
          <img
            src={`${BASE_PATH}/images/partnerships/photo-2.png`}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}

// ── Card ────────────────────────────────────────────────────────────────────────

function CatalogCardItem({ card }: { card: CatalogCard }) {
  return (
    <article className="group flex flex-col border border-border [&:not(:first-child)]:md:border-l-0 [&:nth-child(n+3)]:xl:border-t-0 [&:nth-child(n+5)]:xl:border-t-0 bg-[rgba(10,10,10,0.8)] backdrop-blur-[10px] transition-colors hover:bg-[#111]">
      {/* Top image area */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#0d0d0d] border-b border-border">
        <Link
          href={card.href}
          className="absolute top-1 right-1 z-10 flex items-center justify-center w-10 h-10 bg-foreground text-background rounded-[4px] opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label={`Открыть ${card.cardTitle}`}
        >
          <ArrowUpRight size={16} strokeWidth={2} />
        </Link>
        {card.coverImage && (
          <img
            src={card.coverImage}
            alt=""
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Content */}
      <Link href={card.href} className="flex flex-col flex-1 p-6 md:p-8 gap-4">
        {card.hasExperts && (
          <span className="inline-flex self-start px-2.5 py-1 text-[12px] font-mono uppercase tracking-[0.02em] border rounded-[4px] border-[#4A3C00] text-[#FFE466] bg-[#3D3300]">
            Экспертный продукт
          </span>
        )}

        <h3 className="font-heading text-[20px] md:text-[24px] font-bold uppercase leading-[1.2] tracking-[-0.01em] text-foreground">
          {card.cardTitle}
        </h3>
        <p className="text-[14px] leading-[1.32] tracking-[0.01em] text-muted-foreground">
          {card.cardDescription}
        </p>
      </Link>
    </article>
  );
}
