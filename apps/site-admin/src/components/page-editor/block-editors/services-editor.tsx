"use client";

import { useState } from "react";
import { GripVertical, Plus, Link2, LayoutGrid, Sparkles, Columns2, Settings2 } from "lucide-react";
import {
  Switch,
  Input,
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  repackBento,
  type ServiceCardData,
} from "@rocketmind/ui";
import { InlineEdit } from "@/components/inline-edit";
import { MdText } from "@/components/md-text";
import { InlineConfirmDelete } from "@/components/inline-confirm";
import { ItemMoveButtons } from "@/components/item-move-buttons";
import {
  ParagraphsEditor,
  resolveParagraphs,
  type StyledParagraph,
} from "@/components/paragraphs-editor";
import { useItemDnd } from "@/lib/use-item-dnd";

interface ServicesEditorProps {
  data: Record<string, unknown>;
  onUpdate: (data: Record<string, unknown>) => void;
}

type Card = ServiceCardData;

const EMPTY_CARD: Card = {
  title: "",
  paragraphs: [""],
  showArrow: true,
  href: "",
  colSpan: 1,
  rowSpan: 1,
};

export function ServicesEditor({ data, onUpdate }: ServicesEditorProps) {
  const tag = (data.tag as string) || "";
  const title = (data.title as string) || "";
  const titleSecondary = (data.titleSecondary as string) || "";
  const paragraphs = resolveParagraphs(
    data.paragraphs,
    (data.description as string) || "",
    { uppercase: false, color: "secondary" },
  );
  const cards = (data.cards as Card[]) || [];

  const [linkEditIdx, setLinkEditIdx] = useState<number | null>(null);

  const dnd = useItemDnd(cards, (reordered) => onUpdate({ cards: reordered }));

  function setParagraphs(next: StyledParagraph[]) {
    onUpdate({ paragraphs: next, description: undefined });
  }

  function updateCard(index: number, patch: Partial<Card>) {
    const updated = cards.map((c, i) => (i === index ? { ...c, ...patch } : c));
    onUpdate({ cards: updated });
  }

  function updateParagraph(index: number, pIdx: number, value: string) {
    const card = cards[index];
    const paragraphs = card.paragraphs.map((p, j) => (j === pIdx ? value : p));
    updateCard(index, { paragraphs });
  }

  function addParagraph(index: number) {
    const card = cards[index];
    updateCard(index, { paragraphs: [...card.paragraphs, ""] });
  }

  function removeParagraph(index: number, pIdx: number) {
    const card = cards[index];
    const paragraphs = card.paragraphs.filter((_, j) => j !== pIdx);
    updateCard(index, { paragraphs: paragraphs.length > 0 ? paragraphs : [""] });
  }

  function insertCard(atIndex: number) {
    const next = [...cards];
    next.splice(atIndex, 0, { ...EMPTY_CARD });
    onUpdate({ cards: next });
  }

  function removeCard(index: number) {
    onUpdate({ cards: cards.filter((_, i) => i !== index) });
  }

  function cycleSize(index: number) {
    const card = cards[index];
    // cycle: 1/1 → 2/1 → 1/2 → 2/2 → 1/1
    const cur = `${card.colSpan ?? 1}/${card.rowSpan ?? 1}`;
    const next = { "1/1": { colSpan: 2 as const, rowSpan: 1 as const }, "2/1": { colSpan: 1 as const, rowSpan: 2 as const }, "1/2": { colSpan: 2 as const, rowSpan: 2 as const }, "2/2": { colSpan: 1 as const, rowSpan: 1 as const } }[cur] || { colSpan: 1 as const, rowSpan: 1 as const };
    updateCard(index, next);
  }

  function rearrange() {
    onUpdate({ cards: repackBento(cards) });
  }

  return (
    <div className="rounded-sm border-t border-[#404040] bg-[#0A0A0A] pb-20">
      <div className="mx-auto max-w-[1512px] px-5 py-10 md:px-8 xl:px-14">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:gap-10">
          <div className="flex flex-col gap-4 lg:w-1/2">
            <InlineEdit
              value={tag}
              onSave={(v) => onUpdate({ tag: v })}
              placeholder="услуги"
            >
              <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#FFCC00]">
                {tag || "услуги"}
              </span>
            </InlineEdit>

            <div className="flex flex-col gap-1">
              <InlineEdit
                value={title}
                onSave={(v) => onUpdate({ title: v })}
                placeholder="Заголовок"
              >
                <h2 className="h2 text-[#F0F0F0]">{title || "Заголовок"}</h2>
              </InlineEdit>
              <InlineEdit
                value={titleSecondary}
                onSave={(v) => onUpdate({ titleSecondary: v })}
                placeholder="Дополнительная часть (серая)"
              >
                <span className="h2 text-[#939393] block">{titleSecondary || "доп. часть"}</span>
              </InlineEdit>
            </div>
          </div>

          <div className="lg:w-1/2 lg:flex lg:items-end">
            <ParagraphsEditor
              paragraphs={paragraphs}
              onChange={setParagraphs}
              theme="dark"
              defaults={{ uppercase: false, color: "secondary" }}
            />
          </div>
        </div>

        {/* Шапка-тулбар: чипсы в форме (свитч + кнопка «Настроить»),
            справа — «Перекомпоновать». */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <FormChipsControl
            value={
              (data.formChips as ServicesFormChips | undefined) ?? {
                enabled: false,
                multi: false,
                label: "Тема обращения",
              }
            }
            onChange={(formChips) => onUpdate({ formChips })}
          />
          <button
            type="button"
            onClick={rearrange}
            disabled={cards.length === 0}
            className="flex items-center gap-1.5 rounded-sm border border-[#404040] bg-[#121212] px-3 py-1.5 text-[length:var(--text-12)] text-[#F0F0F0] transition-colors hover:border-[#FFCC00] hover:text-[#FFCC00] disabled:opacity-40"
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            Перекомпоновать
          </button>
        </div>

        {/* Empty state — no cards yet */}
        {cards.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 border border-dashed border-[#404040] py-16 px-5 text-center">
            <LayoutGrid className="h-6 w-6 text-[#404040]" />
            <div className="flex flex-col gap-1">
              <p className="text-[length:var(--text-14)] text-[#F0F0F0]">
                Опциональный блок «Услуги» пуст
              </p>
              <p className="text-[length:var(--text-12)] text-[#939393]">
                Бенто-сетка из карточек услуг. Добавьте карточки или отключите блок на этой странице.
              </p>
            </div>
            <button
              type="button"
              onClick={() => insertCard(0)}
              className="mt-2 flex items-center gap-1.5 rounded-sm border border-[#404040] bg-[#121212] px-3 py-1.5 text-[length:var(--text-12)] text-[#F0F0F0] transition-colors hover:border-[#FFCC00] hover:text-[#FFCC00]"
            >
              <Plus className="h-3.5 w-3.5" />
              Добавить первую карточку
            </button>
          </div>
        )}

        {/* Cards bento grid */}
        {cards.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 auto-rows-[minmax(260px,auto)] relative">

          {cards.map((card, index) => {
            const { draggable, onDragStart, onDragOver, onDrop, onDragEnd, isDragging } =
              dnd.itemProps(index);
            const colSpan = card.colSpan ?? 1;
            const rowSpan = card.rowSpan ?? 1;

            const featured = card.featured === true;
            return (
              <div
                key={index}
                draggable={draggable}
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                onDrop={onDrop}
                onDragEnd={onDragEnd}
                className={`group/card relative flex flex-col gap-4 p-5 md:p-6 border transition-all ${
                  featured
                    ? "bg-[#FFCC00] border-[#FFCC00] hover:border-[#F0F0F0]"
                    : "bg-[#0A0A0A] border-[#404040] hover:border-[#FFCC00]"
                } ${isDragging ? "opacity-50" : ""} ${colSpan === 2 ? "md:col-span-2" : ""} ${rowSpan === 2 ? "lg:row-span-2" : ""}`}
              >
                {/* Controls — top right */}
                <div className="absolute -top-1 -right-1 z-10 flex items-center gap-0.5 opacity-0 transition-opacity group-hover/card:opacity-100">
                  <button
                    type="button"
                    onClick={() => cycleSize(index)}
                    title={`Размер: ${colSpan}×${rowSpan}`}
                    className="flex h-5 items-center gap-0.5 rounded-sm bg-[#F0F0F0] px-1.5 text-[length:var(--text-10)] font-mono text-[#0A0A0A] hover:bg-[#FFCC00]"
                  >
                    {colSpan}×{rowSpan}
                  </button>
                  <button
                    type="button"
                    onClick={() => updateCard(index, { featured: !featured })}
                    title={featured ? "Снять акцент" : "Сделать акцентной (жёлтой)"}
                    className={`flex h-5 w-5 items-center justify-center rounded-sm ${featured ? "bg-[#0A0A0A] text-[#FFCC00]" : "bg-[#F0F0F0] text-[#0A0A0A]"} hover:bg-[#FFCC00]`}
                  >
                    <Sparkles className="h-2.5 w-2.5" />
                  </button>
                  {colSpan === 2 && (
                    <button
                      type="button"
                      onClick={() => updateCard(index, { paragraphsTwoCol: !card.paragraphsTwoCol })}
                      title={card.paragraphsTwoCol ? "Абзацы в одну колонку" : "Абзацы в две колонки"}
                      className={`flex h-5 w-5 items-center justify-center rounded-sm ${card.paragraphsTwoCol ? "bg-[#FFCC00] text-[#0A0A0A]" : "bg-[#F0F0F0] text-[#0A0A0A]"} hover:bg-[#FFCC00]`}
                    >
                      <Columns2 className="h-2.5 w-2.5" />
                    </button>
                  )}
                  <div
                    className="flex h-5 w-5 cursor-grab items-center justify-center rounded-sm bg-[#F0F0F0] text-[#0A0A0A] select-none active:cursor-grabbing"
                    onMouseDown={() => dnd.onGripDown(index)}
                    onMouseUp={dnd.onGripUp}
                  >
                    <GripVertical className="h-2.5 w-2.5" />
                  </div>
                  <ItemMoveButtons index={index} count={cards.length} onMove={dnd.move} />
                  <InlineConfirmDelete
                    onConfirm={() => removeCard(index)}
                    className="bg-[#F0F0F0] text-[#0A0A0A] hover:bg-[#ED4843] hover:text-[#F0F0F0]"
                  />
                </div>

                {/* Link toggle + URL button — top left */}
                <div className="absolute -top-1 -left-1 z-10 flex items-center gap-1 opacity-0 transition-opacity group-hover/card:opacity-100">
                  <label className="flex items-center gap-1.5 rounded-sm bg-[#121212]/90 backdrop-blur px-1.5 py-0.5 text-[length:var(--text-10)] text-[#939393]">
                    <Switch
                      checked={card.showArrow !== false}
                      onCheckedChange={(v) => updateCard(index, { showArrow: v })}
                      size="sm"
                    />
                    ссылка
                  </label>
                  {card.showArrow !== false && (
                    <button
                      type="button"
                      onClick={() => setLinkEditIdx(linkEditIdx === index ? null : index)}
                      title={card.href ? `Ссылка: ${card.href}` : "Добавить ссылку"}
                      className={`flex h-5 items-center gap-1 rounded-sm px-1.5 text-[length:var(--text-10)] ${card.href ? "bg-[#FFCC00] text-[#0A0A0A]" : "bg-[#F0F0F0] text-[#0A0A0A]"} hover:bg-[#FFCC00]`}
                    >
                      <Link2 className="h-2.5 w-2.5" />
                      {card.href ? "URL" : "добавить"}
                    </button>
                  )}
                </div>

                {/* Link input — when active */}
                {linkEditIdx === index && (
                  <div className="absolute -top-10 left-0 z-20 w-[280px]">
                    <Input
                      size="sm"
                      value={card.href || ""}
                      onChange={(e) => updateCard(index, { href: e.target.value })}
                      placeholder="/consulting/strategy или https://…"
                      autoFocus
                      onBlur={() => setLinkEditIdx(null)}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === "Escape") setLinkEditIdx(null); }}
                      className="text-[length:var(--text-12)]"
                    />
                  </div>
                )}

                {/* Arrow indicator (preview) */}
                {card.showArrow !== false && (
                  <div className={`absolute top-2 right-2 flex h-10 w-10 items-center justify-center pointer-events-none ${featured ? "text-[#0A0A0A]" : "text-[#404040]"}`}>
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                      <path d="M1 10L10 1M10 1H3M10 1V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}

                {/* Title */}
                <InlineEdit
                  value={card.title}
                  onSave={(v) => updateCard(index, { title: v })}
                  placeholder="Название услуги"
                >
                  <h3 className={`font-[family-name:var(--font-heading-family)] text-[24px] font-bold uppercase leading-[1.16] tracking-[-0.01em] pr-10 ${featured ? "text-[#0A0A0A]" : "text-[#F0F0F0]"}`}>
                    {card.title || "Название услуги"}
                  </h3>
                </InlineEdit>

                {/* Paragraphs */}
                <div className="flex flex-col gap-3">
                  <div
                    className={
                      card.paragraphsTwoCol && colSpan === 2
                        ? "grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-x-10"
                        : "flex flex-col gap-2"
                    }
                  >
                    {card.paragraphs.map((p, pIdx) => (
                      <div key={pIdx} className="group/p relative">
                        <InlineEdit
                          value={p}
                          onSave={(v) => updateParagraph(index, pIdx, v)}
                          multiline
                          placeholder="Абзац описания"
                        >
                          <MdText
                            value={p}
                            placeholder="Абзац описания"
                            className={`text-[14px] leading-[1.4] ${featured ? "text-[#0A0A0A]" : "text-[#939393]"}`}
                          />
                        </InlineEdit>
                        {card.paragraphs.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeParagraph(index, pIdx)}
                            className="absolute -right-5 top-0 flex h-4 w-4 items-center justify-center rounded-sm bg-[#404040] text-[#F0F0F0] opacity-0 transition-opacity group-hover/p:opacity-100 hover:bg-destructive"
                            title="Удалить абзац"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => addParagraph(index)}
                    className="flex items-center gap-1 self-start text-[length:var(--text-10)] text-[#939393] transition-colors hover:text-[#FFCC00]"
                  >
                    <Plus className="h-2.5 w-2.5" />
                    абзац
                  </button>
                </div>

                {/* Insert button — after last card in the row */}
                {index === cards.length - 1 && (
                  <button
                    type="button"
                    onClick={() => insertCard(index + 1)}
                    className="absolute top-1/2 -right-3 -translate-y-1/2 z-10 flex h-6 w-6 items-center justify-center rounded-sm bg-[var(--rm-violet-100)] text-[var(--rm-violet-fg)] opacity-0 shadow transition-opacity group-hover/card:opacity-100 hover:scale-110"
                    title="Добавить карточку"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                )}

                {/* Insert button — between cards (on left edge) */}
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => insertCard(index)}
                    className="absolute top-1/2 -left-3 -translate-y-1/2 z-10 flex h-6 w-6 items-center justify-center rounded-sm bg-[var(--rm-violet-100)] text-[var(--rm-violet-fg)] opacity-0 shadow transition-opacity group-hover/card:opacity-100 hover:scale-110"
                    title="Добавить карточку"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
        )}

        {/* Footer — add card button */}
        {cards.length > 0 && (
          <div className="mt-4">
            <button
              type="button"
              onClick={() => insertCard(cards.length)}
              className="flex w-full items-center justify-center gap-1 border border-dashed border-[#404040] py-4 text-[length:var(--text-14)] text-[#939393] transition-colors hover:border-[#FFCC00] hover:text-[#FFCC00]"
            >
              <Plus className="h-3.5 w-3.5" />
              Добавить карточку
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Form chips control (header of services block) ─────────────────────────

type ServicesFormChips = {
  enabled: boolean;
  multi?: boolean;
  label?: string;
};

function FormChipsControl({
  value,
  onChange,
}: {
  value: ServicesFormChips;
  onChange: (next: ServicesFormChips) => void;
}) {
  const [open, setOpen] = useState(false);
  const [draftMulti, setDraftMulti] = useState<boolean>(value.multi === true);
  const [draftLabel, setDraftLabel] = useState<string>(value.label ?? "");

  function openModal() {
    setDraftMulti(value.multi === true);
    setDraftLabel(value.label ?? "");
    setOpen(true);
  }

  function save() {
    onChange({ ...value, multi: draftMulti, label: draftLabel });
    setOpen(false);
  }

  return (
    <>
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 text-[length:var(--text-12)] text-[#F0F0F0]">
          <Switch
            checked={value.enabled === true}
            onCheckedChange={(v) =>
              onChange({ ...value, enabled: v })
            }
            size="sm"
          />
          Показывать услуги в форме
        </label>
        {value.enabled && (
          <button
            type="button"
            onClick={openModal}
            className="flex items-center gap-1.5 rounded-sm border border-[#404040] bg-[#121212] px-2.5 py-1 text-[length:var(--text-12)] uppercase tracking-wide text-[#F0F0F0] transition-colors hover:border-[#FFCC00] hover:text-[#FFCC00]"
          >
            <Settings2 className="h-3.5 w-3.5" />
            Настроить
          </button>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[440px]">
          <DialogHeader>
            <DialogTitle>Чипсы в форме</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-2">
              <span className="text-[length:var(--text-11)] uppercase tracking-wide text-muted-foreground">
                Режим выбора
              </span>
              <label className="flex items-center gap-2 text-[length:var(--text-13)] text-foreground">
                <input
                  type="radio"
                  name="chips-mode"
                  checked={!draftMulti}
                  onChange={() => setDraftMulti(false)}
                />
                Один выбор
              </label>
              <label className="flex items-center gap-2 text-[length:var(--text-13)] text-foreground">
                <input
                  type="radio"
                  name="chips-mode"
                  checked={draftMulti}
                  onChange={() => setDraftMulti(true)}
                />
                Мультивыбор
              </label>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[length:var(--text-11)] uppercase tracking-wide text-muted-foreground">
                Заголовок блока чипсов
              </label>
              <Input
                size="sm"
                value={draftLabel}
                onChange={(e) => setDraftLabel(e.target.value)}
                placeholder="Например: «Тема обращения»"
              />
              <p className="text-[length:var(--text-11)] text-muted-foreground">
                Пусто → блок чипсов без заголовка.
              </p>
            </div>
            <p className="text-[length:var(--text-11)] text-muted-foreground">
              Опции чипсов автоматически берутся из заголовков карточек этого
              блока.
            </p>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Отмена
            </Button>
            <Button onClick={save}>Сохранить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
