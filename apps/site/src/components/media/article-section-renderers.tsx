"use client";

import {
  ArticleBody,
  ExpertQuoteStack,
  FactoidGrid,
  SectionAsideChip,
  SectionAsideProductCard,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  CTASectionMini,
  CTASectionYellow,
  useFormModal,
  type ArticleBodyBlock,
  type ExpertQuoteItem,
} from "@rocketmind/ui";
import type {
  ArticleAside,
  ArticleSection,
  ArticleSectionQuote,
  ResolvedProductAside,
  ResolvedQuoteExpert,
} from "@/lib/articles";
import type { CtaEntity } from "@/lib/ctas";
import { type FilePreviewFile } from "./file-preview-modal";

// ── Quote helpers ──────────────────────────────────────────────────────────

/**
 * Резолвит `ArticleSectionQuote` в `ExpertQuoteItem` для рендера.
 * Порядок приоритетов: ручные поля → expert → пусто. Пустые цитаты
 * (без имени или без контента) отфильтровываются.
 */
export function resolveQuote(
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

// ── Сборка блоков секции (H2 + блоки) для ArticleBody ───────────────────────
// Title добавляется как h2-блок, чтобы переиспользовать логику ritm-отступов
// и slugify id (якоря / ToC) из article-body.tsx.
export function sectionBlocks(section: ArticleSection): ArticleBodyBlock[] {
  const title = section.title.trim();
  return title
    ? [
        { id: `${section.id}_h2`, type: "h2", data: { text: title } },
        ...section.blocks,
      ]
    : section.blocks;
}

// ── SectionBody (десктоп: только body — H2, блоки, CTA, цитаты) ─────────────

export function SectionBody({
  section,
  resolvedQuoteExperts,
  resolvedCtas,
}: {
  section: ArticleSection;
  resolvedQuoteExperts: Record<string, ResolvedQuoteExpert>;
  resolvedCtas: Record<string, CtaEntity>;
}) {
  const title = section.title.trim();
  const hasH2 = title.length > 0;
  const hasFactoids = section.factoids.length > 0;
  const hasBlocks = section.blocks.length > 0;
  const quotes = section.quotes
    .map((q) => resolveQuote(q, resolvedQuoteExperts))
    .filter((q): q is ExpertQuoteItem => q !== null);
  const bottomCta = section.bottomCtaId
    ? resolvedCtas[section.bottomCtaId]
    : undefined;
  if (
    !hasH2 &&
    !hasFactoids &&
    !hasBlocks &&
    quotes.length === 0 &&
    !bottomCta
  )
    return null;
  // H2 рендерим как одиночный блок ArticleBody (для слого/якоря/scroll-mt).
  // Дальше — section-level factoids (под заголовком), потом остальные blocks.
  const h2Block: ArticleBodyBlock | null = hasH2
    ? { id: `${section.id}_h2`, type: "h2", data: { text: title } }
    : null;
  return (
    <div className="min-w-0">
      {(hasH2 || hasFactoids || hasBlocks) && (
        <div data-section-body-blocks={section.id}>
          {h2Block && <ArticleBody blocks={[h2Block]} />}
          {hasFactoids && (
            <div
              data-section-factoids={section.id}
              className={hasH2 ? "mt-[40px]" : ""}
            >
              <FactoidGrid cards={section.factoids} cols={section.factoidCols} />
            </div>
          )}
          {hasBlocks && (
            <div className={hasH2 || hasFactoids ? "mt-[40px]" : ""}>
              <ArticleBody blocks={section.blocks} />
            </div>
          )}
        </div>
      )}
      {bottomCta && (
        <div
          data-section-body-cta={section.id}
          className={hasH2 || hasFactoids || hasBlocks ? "mt-[40px]" : ""}
        >
          <ArticleBottomCta cta={bottomCta} />
        </div>
      )}
      {quotes.length > 0 && (
        <div
          data-section-quote={section.id}
          // layout по умолчанию "narrow" — переключается на "wide" в
          // useLayoutEffect страницы статьи по соотношению высот body vs aside.
          data-quote-layout="narrow"
          className={hasH2 || hasFactoids || hasBlocks ? "mt-[40px]" : ""}
        >
          {/* Оба варианта в DOM, видимым управляет JS через display
              (см. useLayoutEffect в article-page-client). До первого measure — narrow. */}
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

// ── SectionMobile (одна колонка: body + asides стекаются под body) ──────────

export function SectionMobile({
  section,
  resolvedProducts,
  resolvedQuoteExperts,
  resolvedCtas,
  onPreviewFile,
}: {
  section: ArticleSection;
  resolvedProducts: Record<string, ResolvedProductAside>;
  resolvedQuoteExperts: Record<string, ResolvedQuoteExpert>;
  resolvedCtas: Record<string, CtaEntity>;
  onPreviewFile: (file: FilePreviewFile) => void;
}) {
  const blocks = sectionBlocks(section);
  const hasFactoids = section.factoids.length > 0;
  const hasAsides = section.asides.length > 0;
  const quotes = section.quotes
    .map((q) => resolveQuote(q, resolvedQuoteExperts))
    .filter((q): q is ExpertQuoteItem => q !== null);
  const bottomCta = section.bottomCtaId
    ? resolvedCtas[section.bottomCtaId]
    : undefined;
  // На мобиле строим в одну колонку: H2, factoids, остальные блоки.
  // Делим blocks на h2 (если есть) и rest, чтобы вставить factoids между ними.
  const hasH2 = blocks.length > 0 && blocks[0].type === "h2";
  const h2Block = hasH2 ? blocks[0] : null;
  const restBlocks = hasH2 ? blocks.slice(1) : blocks;
  const hasRest = restBlocks.length > 0;
  return (
    <section className="flex flex-col gap-8">
      {h2Block && (
        <div className="min-w-0">
          <ArticleBody blocks={[h2Block]} />
        </div>
      )}
      {hasFactoids && (
        <div className="min-w-0">
          <FactoidGrid cards={section.factoids} cols={section.factoidCols} />
        </div>
      )}
      {hasRest && (
        <div className="min-w-0">
          <ArticleBody blocks={restBlocks} />
        </div>
      )}
      {bottomCta && (
        <div className="min-w-0">
          <ArticleBottomCta cta={bottomCta} />
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
              resolvedCtas={resolvedCtas}
              onPreviewFile={onPreviewFile}
            />
          ))}
        </div>
      )}
    </section>
  );
}

// ── AsideItem (одна карточка в правой колонке) ─────────────────────────────

export function AsideItem({
  aside,
  resolvedProducts,
  resolvedCtas,
  onPreviewFile,
}: {
  aside: ArticleAside;
  resolvedProducts: Record<string, ResolvedProductAside>;
  resolvedCtas: Record<string, CtaEntity>;
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
    // pb-* зеркалит gap, чтобы крайний логотип не прилипал к следующему aside-блоку.
    return (
      <ul className="flex list-none flex-col gap-6 pb-6 md:gap-8 md:pb-8">
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
  if (aside.kind === "cta") {
    const cta = resolvedCtas[aside.ctaId];
    if (!cta) return null;
    return <ArticleAsideCta cta={cta} />;
  }
  // product
  const key = `${aside.productCategory}:${aside.productSlug}`;
  const resolved = resolvedProducts[key];
  if (!resolved) return null;
  return (
    <AsideHint action="Перейти на страницу продукта" detail={resolved.title}>
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

// ── AsideHint (тултип над aside-карточкой) ──────────────────────────────────

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

// ── CTA wrappers (открывают форму через ModalProvider) ──────────────────────

function ArticleBottomCta({ cta }: { cta: CtaEntity }) {
  const { openForm } = useFormModal();
  const formId = cta.formId;
  const handleClick = formId ? () => openForm(formId) : undefined;
  return (
    <CTASectionYellow
      heading={cta.heading || undefined}
      body={cta.body || undefined}
      buttonText={cta.buttonText || undefined}
      onClick={handleClick}
      variant="article"
    />
  );
}

function ArticleAsideCta({ cta }: { cta: CtaEntity }) {
  const { openForm } = useFormModal();
  const formId = cta.formId;
  const handleClick = formId ? () => openForm(formId) : undefined;
  return (
    <CTASectionMini
      heading={cta.heading || undefined}
      body={cta.body || undefined}
      buttonText={cta.buttonText || undefined}
      onClick={handleClick}
    />
  );
}
