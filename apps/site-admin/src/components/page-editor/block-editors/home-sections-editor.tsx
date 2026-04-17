"use client";

import { apiFetch } from "@/lib/api-client";
import { useEffect, useState } from "react";
import { GripVertical, Plus, Trash2, Eye, EyeOff, ChevronDown } from "lucide-react";
import { InlineEdit } from "@/components/inline-edit";
import { useItemDnd } from "@/lib/use-item-dnd";
import { PRODUCTS_FILTER_KEYS } from "@/lib/constants";

type HomeSection = {
  filterKey: string;
  trackName: string;
  headerHighlight: string;
  mobileTitle: string;
  description: string;
  catalogLabel: string;
  hiddenCardSlugs: string[];
};

type ProductLike = {
  id: string;
  sectionId: string;
  slug: string;
  menuTitle: string;
  cardTitle?: string;
  expertProduct?: boolean;
  status: string;
};

interface HomeSectionsEditorProps {
  data: Record<string, unknown>;
  onUpdate: (data: Record<string, unknown>) => void;
}

const EMPTY_SECTION: HomeSection = {
  filterKey: "",
  trackName: "",
  headerHighlight: "",
  mobileTitle: "",
  description: "",
  catalogLabel: "Все продукты",
  hiddenCardSlugs: [],
};

function productsForFilter(all: ProductLike[], filterKey: string): ProductLike[] {
  const filter = PRODUCTS_FILTER_KEYS.find((f) => f.key === filterKey);
  if (!filter) return [];
  if (filterKey === "expert") {
    return all.filter((p) => p.expertProduct === true);
  }
  if (filter.category) {
    return all.filter((p) => p.sectionId === filter.category);
  }
  return [];
}

export function HomeSectionsEditor({ data, onUpdate }: HomeSectionsEditorProps) {
  const sections = Array.isArray(data.sections) ? (data.sections as HomeSection[]) : [];

  const [allPages, setAllPages] = useState<ProductLike[]>([]);
  const [addMenuOpen, setAddMenuOpen] = useState(false);

  useEffect(() => {
    apiFetch("/api/pages")
      .then((r) => r.json())
      .then((all: ProductLike[]) => setAllPages(all))
      .catch(() => {});
  }, []);

  const dnd = useItemDnd(sections, (reordered) =>
    onUpdate({ sections: reordered }),
  );

  function updateSection(index: number, patch: Partial<HomeSection>) {
    const next = sections.map((s, i) => (i === index ? { ...s, ...patch } : s));
    onUpdate({ sections: next });
  }

  function deleteSection(index: number) {
    onUpdate({ sections: sections.filter((_, i) => i !== index) });
  }

  function addSection(filterKey: string) {
    if (sections.some((s) => s.filterKey === filterKey)) return;
    const filter = PRODUCTS_FILTER_KEYS.find((f) => f.key === filterKey);
    if (!filter) return;
    onUpdate({
      sections: [
        ...sections,
        {
          ...EMPTY_SECTION,
          filterKey,
          trackName: filter.label,
          headerHighlight: filter.label.toLowerCase(),
          mobileTitle: filter.label,
        },
      ],
    });
    setAddMenuOpen(false);
  }

  function toggleCard(index: number, slug: string) {
    const section = sections[index];
    const hidden = section.hiddenCardSlugs.includes(slug)
      ? section.hiddenCardSlugs.filter((s) => s !== slug)
      : [...section.hiddenCardSlugs, slug];
    updateSection(index, { hiddenCardSlugs: hidden });
  }

  const usedFilters = new Set(sections.map((s) => s.filterKey));
  const availableFilters = PRODUCTS_FILTER_KEYS.filter(
    (f) => !usedFilters.has(f.key) && productsForFilter(allPages, f.key).length > 0,
  );

  return (
    <div className="rounded-sm border-t border-[#404040] bg-[#0A0A0A] pb-20">
      <div className="mx-auto max-w-[1512px] px-5 pt-14 md:px-8 xl:px-14">
        <div className="mb-6 flex items-center justify-between gap-4">
          <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-11)] uppercase tracking-[0.06em] text-[#939393]">
            Блок «Разделы» — табы, заголовки, карточки, привязанные к фильтрам /products
          </span>
          <div className="relative">
            <button
              type="button"
              onClick={() => setAddMenuOpen((v) => !v)}
              disabled={availableFilters.length === 0}
              className="flex h-7 items-center gap-1 rounded-[4px] border border-dashed border-[#404040] px-2 text-[#939393] transition-colors hover:border-[#FFCC00] hover:text-[#FFCC00] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[#404040] disabled:hover:text-[#939393]"
            >
              <Plus className="h-3 w-3" />
              <span className="text-[length:var(--text-11)]">Добавить раздел</span>
              <ChevronDown className="h-3 w-3" />
            </button>
            {addMenuOpen && availableFilters.length > 0 && (
              <div className="absolute right-0 top-full z-20 mt-1 w-[260px] rounded-sm border border-[#404040] bg-[#121212] shadow-xl">
                {availableFilters.map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => addSection(f.key)}
                    className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-[length:var(--text-12)] text-[#F0F0F0] transition-colors hover:bg-[#1a1a1a]"
                  >
                    <span>{f.label}</span>
                    <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-10)] uppercase tracking-[0.06em] text-[#5C5C5C]">
                      {f.key}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {sections.map((section, index) => {
            const cards = productsForFilter(allPages, section.filterKey);
            const {
              draggable,
              onDragStart,
              onDragOver,
              onDrop,
              onDragEnd,
              isDragging,
            } = dnd.itemProps(index);

            return (
              <div
                key={index}
                draggable={draggable}
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                onDrop={onDrop}
                onDragEnd={onDragEnd}
                className={`group/section relative flex flex-col gap-5 rounded-sm border border-[#404040] bg-[#0F0F0F] p-5 transition-all ${
                  isDragging ? "opacity-60" : ""
                }`}
              >
                {/* Toolbar */}
                <div className="absolute -right-2 -top-2 z-10 flex items-center gap-0.5 opacity-0 transition-opacity group-hover/section:opacity-100">
                  <div
                    className="flex h-6 w-6 cursor-grab items-center justify-center rounded-sm bg-[#F0F0F0] text-[#0A0A0A] select-none active:cursor-grabbing"
                    onMouseDown={() => dnd.onGripDown(index)}
                    onMouseUp={dnd.onGripUp}
                  >
                    <GripVertical className="h-3 w-3" />
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteSection(index)}
                    className="flex h-6 w-6 items-center justify-center rounded-sm bg-[#1a1a1a]/80 text-[#F0F0F0] backdrop-blur hover:bg-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>

                {/* Header: filter key + track name */}
                <div className="flex flex-wrap items-baseline gap-3">
                  <span className="inline-flex items-center rounded-[4px] border border-[#FFCC00]/40 bg-[#3D3300] px-2 py-0.5 font-[family-name:var(--font-mono-family)] text-[length:var(--text-10)] uppercase tracking-[0.06em] text-[#FFE466]">
                    Фильтр: {section.filterKey}
                  </span>
                  <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-10)] uppercase tracking-[0.06em] text-[#5C5C5C]">
                    Название таба
                  </span>
                  <InlineEdit
                    value={section.trackName}
                    onSave={(v) => updateSection(index, { trackName: v })}
                    placeholder="Консалтинг и стратегии"
                  >
                    <span className="text-[length:var(--text-14)] text-[#F0F0F0]">
                      {section.trackName || "—"}
                    </span>
                  </InlineEdit>
                </div>

                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                  {/* Header highlight */}
                  <div className="flex flex-col gap-1">
                    <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-10)] uppercase tracking-[0.06em] text-[#5C5C5C]">
                      Подсветка заголовка (desktop)
                    </span>
                    <InlineEdit
                      value={section.headerHighlight}
                      onSave={(v) => updateSection(index, { headerHighlight: v })}
                      placeholder="Стратегия и бизнес-модели"
                    >
                      <span className="text-[length:var(--text-18)] font-bold uppercase text-[#F0F0F0]">
                        {section.headerHighlight || "—"}
                      </span>
                    </InlineEdit>
                  </div>

                  {/* Mobile title */}
                  <div className="flex flex-col gap-1">
                    <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-10)] uppercase tracking-[0.06em] text-[#5C5C5C]">
                      Мобильный заголовок (\n — перенос)
                    </span>
                    <InlineEdit
                      value={section.mobileTitle}
                      onSave={(v) => updateSection(index, { mobileTitle: v })}
                      multiline
                      placeholder={"Стратегия\nи бизнес-модели"}
                    >
                      <span className="whitespace-pre-wrap text-[length:var(--text-16)] font-bold uppercase text-[#F0F0F0]">
                        {section.mobileTitle || "—"}
                      </span>
                    </InlineEdit>
                  </div>
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1">
                  <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-10)] uppercase tracking-[0.06em] text-[#5C5C5C]">
                    Описание
                  </span>
                  <InlineEdit
                    value={section.description}
                    onSave={(v) => updateSection(index, { description: v })}
                    multiline
                    placeholder="Описание раздела…"
                  >
                    <p className="text-[length:var(--text-14)] leading-[1.3] text-[#F0F0F0]">
                      {section.description || "—"}
                    </p>
                  </InlineEdit>
                </div>

                {/* Catalog label */}
                <div className="flex items-center gap-3">
                  <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-10)] uppercase tracking-[0.06em] text-[#5C5C5C]">
                    Кнопка «Все»
                  </span>
                  <InlineEdit
                    value={section.catalogLabel}
                    onSave={(v) => updateSection(index, { catalogLabel: v })}
                    placeholder="Все продукты"
                  >
                    <span className="text-[length:var(--text-12)] text-[#F0F0F0]">
                      {section.catalogLabel || "—"}
                    </span>
                  </InlineEdit>
                </div>

                {/* Cards list */}
                <div className="border-t border-[#404040] pt-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-10)] uppercase tracking-[0.06em] text-[#939393]">
                      Карточки раздела ({cards.length})
                    </span>
                    <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-10)] uppercase tracking-[0.06em] text-[#5C5C5C]">
                      Свитч — показывать ли на главной
                    </span>
                  </div>
                  {cards.length === 0 ? (
                    <p className="text-[length:var(--text-12)] text-[#5C5C5C]">
                      Нет опубликованных карточек под этот фильтр.
                    </p>
                  ) : (
                    <div className="flex flex-col divide-y divide-[#262626] rounded-sm border border-[#262626]">
                      {cards.map((card) => {
                        const hidden = section.hiddenCardSlugs.includes(card.slug);
                        return (
                          <button
                            key={card.id}
                            type="button"
                            onClick={() => toggleCard(index, card.slug)}
                            className="flex items-center justify-between gap-3 px-3 py-2 text-left transition-colors hover:bg-[#121212]"
                          >
                            <div className="flex min-w-0 flex-col">
                              <span
                                className={`truncate text-[length:var(--text-13)] ${
                                  hidden ? "text-[#5C5C5C] line-through" : "text-[#F0F0F0]"
                                }`}
                              >
                                {card.cardTitle || card.menuTitle || card.slug}
                              </span>
                              <span className="truncate font-[family-name:var(--font-mono-family)] text-[length:var(--text-10)] uppercase tracking-[0.06em] text-[#5C5C5C]">
                                {card.sectionId} · {card.slug}
                              </span>
                            </div>
                            <span
                              className={`flex h-5 w-5 items-center justify-center rounded-sm ${
                                hidden
                                  ? "text-[#5C5C5C]"
                                  : "text-[#FFCC00]"
                              }`}
                            >
                              {hidden ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {sections.length === 0 && (
            <div className="rounded-sm border border-dashed border-[#404040] p-10 text-center text-[length:var(--text-12)] text-[#5C5C5C]">
              Нет разделов. Нажмите «Добавить раздел».
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
