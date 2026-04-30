"use client";

import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Compass, Trash2 } from "lucide-react";
import { Input } from "@rocketmind/ui";
import type {
  ArticleAside,
  ArticleBodyBlock,
  ArticleSection,
  ArticleSectionQuote,
  CtaEntity,
  FactoidCardData,
} from "@/lib/types";
import { apiFetch } from "@/lib/api-client";
import { ArticleBodyEditor } from "./article-body-editor";
import { ArticleBodyFactoidGridEditor } from "./article-body-factoid-grid-editor";
import { ArticleBodyTextarea } from "./article-body-textarea";
import { SectionAsidesEditor } from "./section-asides-editor";
import { SectionQuotesEditor } from "./section-quotes-editor";

interface Props {
  articleSlug: string;
  section: ArticleSection;
  index: number;
  total: number;
  onChange: (next: ArticleSection) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export function ArticleSectionRow({
  articleSlug,
  section,
  index,
  total,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
}: Props) {
  function updateTitle(title: string) {
    onChange({ ...section, title });
  }

  function updateNavLabel(navLabel: string) {
    onChange({ ...section, navLabel });
  }

  function updateBlocks(blocks: ArticleBodyBlock[]) {
    onChange({ ...section, blocks });
  }

  function updateAsides(asides: ArticleAside[]) {
    onChange({ ...section, asides });
  }

  function updateAsidesTitle(asidesTitle: string) {
    onChange({ ...section, asidesTitle });
  }

  function updateAsidesTitleEnabled(asidesTitleEnabled: boolean) {
    onChange({ ...section, asidesTitleEnabled });
  }

  function updateQuotes(quotes: ArticleSectionQuote[]) {
    onChange({ ...section, quotes });
  }

  function updateFactoids(factoids: FactoidCardData[]) {
    onChange({ ...section, factoids });
  }

  function updateFactoidCols(factoidCols: 1 | 2 | 3 | undefined) {
    onChange({ ...section, factoidCols });
  }

  const title = section.title ?? "";
  const navLabel = section.navLabel ?? "";
  const blocks = Array.isArray(section.blocks) ? section.blocks : [];
  const asides = Array.isArray(section.asides) ? section.asides : [];
  const quotes = Array.isArray(section.quotes) ? section.quotes : [];
  const factoids = Array.isArray(section.factoids) ? section.factoids : [];
  const asidesTitle =
    typeof section.asidesTitle === "string" ? section.asidesTitle : "Материалы";
  const asidesTitleEnabled =
    typeof section.asidesTitleEnabled === "boolean"
      ? section.asidesTitleEnabled
      : true;
  const navPreview = navLabel.trim() || title.trim();

  return (
    <section className="group/section relative rounded-sm border border-border bg-[color:var(--rm-gray-1)]/20 p-4">
      {/* Шапка секции: бейдж, инпут «В навигации», подсказка и действия — в одну строку */}
      <header className="mb-2 flex items-center gap-3">
        <span className="shrink-0 flex h-6 items-center gap-1.5 rounded-sm border border-border bg-[color:var(--rm-gray-1)] px-2 font-[family-name:var(--font-mono-family)] text-[length:var(--text-11)] font-medium uppercase tracking-[0.02em] text-muted-foreground">
          Секция {index + 1}
        </span>

        <label className="flex min-w-0 flex-1 items-center gap-2 rounded-sm border border-dashed border-border bg-background/50 px-2 py-1">
          <Compass className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          <span className="shrink-0 font-[family-name:var(--font-mono-family)] text-[length:var(--text-10)] uppercase tracking-[0.02em] text-muted-foreground">
            В&nbsp;навигации
          </span>
          <Input
            value={navLabel}
            onChange={(e) => updateNavLabel(e.target.value)}
            placeholder={
              title.trim()
                ? `Пусто → «${title.trim()}»`
                : "Короткое название для бокового меню"
            }
            className="h-6 border-0 bg-transparent px-1 text-[length:var(--text-12)] shadow-none focus-visible:ring-0"
          />
        </label>

        {!navPreview && (
          <span className="shrink-0 text-[length:var(--text-11)] text-muted-foreground">
            Без заголовка — не попадёт в боковую навигацию
          </span>
        )}

        <div className="shrink-0 flex items-center gap-0.5 opacity-0 transition-opacity group-hover/section:opacity-100">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={index === 0}
            aria-label="Вверх"
            title="Вверх"
            className="flex h-6 w-6 items-center justify-center rounded-sm text-muted-foreground transition-colors enabled:hover:bg-muted enabled:hover:text-foreground disabled:opacity-30"
          >
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={index === total - 1}
            aria-label="Вниз"
            title="Вниз"
            className="flex h-6 w-6 items-center justify-center rounded-sm text-muted-foreground transition-colors enabled:hover:bg-muted enabled:hover:text-foreground disabled:opacity-30"
          >
            <ArrowDown className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={onRemove}
            aria-label="Удалить секцию"
            title="Удалить секцию"
            className="flex h-6 w-6 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-[#ED4843]/10 hover:text-[#ED4843]"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </header>

      {/* Контент секции + правая колонка asides.
          Десктоп: 2 колонки (контент + 300px asides). Мобилка: стакаемся. */}
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="min-w-0">
          {/* H2 — отдельной строкой под шапкой */}
          <div className="mb-4">
            <ArticleBodyTextarea
              value={title}
              onChange={updateTitle}
              blockType="h2"
              placeholder="Заголовок секции (H2)"
              textClassName="font-[family-name:var(--font-heading-family)] font-bold uppercase tracking-[-0.01em] text-[length:var(--text-24)] leading-[1.12]"
            />
          </div>
          {/* Сетка фактоидов — section-level, всегда сверху под H2.
              Если карточек нет — показываем кнопку добавления. */}
          {factoids.length === 0 ? (
            <button
              type="button"
              onClick={() =>
                updateFactoids([
                  {
                    id: `fc_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
                    number: "",
                    text: "",
                    accent: false,
                  },
                ])
              }
              className="mb-4 flex w-full items-center justify-center gap-2 rounded-sm border border-dashed border-border bg-[color:var(--rm-gray-1)]/40 px-3 py-2 text-[length:var(--text-12)] font-medium uppercase tracking-[0.02em] text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
            >
              + Добавить сетку фактоидов
            </button>
          ) : (
            <div className="mb-4">
              <ArticleBodyFactoidGridEditor
                cards={factoids}
                onChange={updateFactoids}
                cols={section.factoidCols}
                onColsChange={updateFactoidCols}
                onRemoveAll={() => {
                  updateFactoids([]);
                  updateFactoidCols(undefined);
                }}
              />
            </div>
          )}
          {/* Inline-блоки секции */}
          <ArticleBodyEditor
            articleSlug={articleSlug}
            blocks={blocks}
            onChange={updateBlocks}
          />

          {/* CTA-блок над цитатами — рендерится между blocks и quotes. */}
          <div className="mt-4 flex flex-col gap-2">
            <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-10)] uppercase tracking-[0.02em] text-muted-foreground">
              CTA-блок (над цитатой эксперта)
            </span>
            <SectionBottomCtaSelector
              value={section.bottomCtaId}
              onChange={(id) => onChange({ ...section, bottomCtaId: id })}
            />
          </div>

          {/* Цитаты экспертов — в конце body-колонки, под блоками.
              На публичной странице: wide если body > aside, narrow иначе,
              mobile-вариант ниже lg. */}
          <div className="mt-4 flex flex-col gap-2">
            <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-10)] uppercase tracking-[0.02em] text-muted-foreground">
              Цитаты экспертов (конец секции)
            </span>
            <SectionQuotesEditor
              articleSlug={articleSlug}
              quotes={quotes}
              onChange={updateQuotes}
            />
          </div>
        </div>

        <aside className="min-w-0">
          <SectionAsidesEditor
            articleSlug={articleSlug}
            asides={asides}
            title={asidesTitle}
            titleEnabled={asidesTitleEnabled}
            onChange={updateAsides}
            onTitleChange={updateAsidesTitle}
            onTitleEnabledChange={updateAsidesTitleEnabled}
          />
        </aside>
      </div>
    </section>
  );
}

function SectionBottomCtaSelector({
  value,
  onChange,
}: {
  value: string | undefined;
  onChange: (next: string | undefined) => void;
}) {
  const [ctas, setCtas] = useState<CtaEntity[]>([]);

  useEffect(() => {
    let cancelled = false;
    apiFetch("/api/ctas")
      .then((r) => r.json() as Promise<CtaEntity[]>)
      .then((all) => {
        if (cancelled) return;
        setCtas(all.filter((c) => c.scope !== "product"));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const selected = ctas.find((c) => c.id === value);

  return (
    <div className="rounded-sm border border-dashed border-border bg-background/30 p-2">
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || undefined)}
        className="h-7 w-full rounded-sm border border-border bg-background px-1.5 text-[length:var(--text-12)] text-foreground"
      >
        <option value="">— нет CTA —</option>
        {ctas.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name || c.id}
          </option>
        ))}
      </select>
      {selected && (
        <p className="mt-1.5 text-[length:var(--text-11)] text-muted-foreground">
          «{selected.heading || "(без заголовка)"}» —{" "}
          {selected.formId
            ? `форма: ${selected.formId}`
            : "форма не задана"}
        </p>
      )}
      {selected && !selected.formId && (
        <p className="mt-1 text-[length:var(--text-11)] text-[#ED4843]">
          У выбранного CTA не задана форма — кнопка не откроет модалку.
        </p>
      )}
    </div>
  );
}
