"use client";

import { apiFetch } from "@/lib/api-client";
import { useState } from "react";
import { Plus, GripVertical } from "lucide-react";
import { InlineEdit } from "@/components/inline-edit";
import { MdText } from "@/components/md-text";
import { InlineConfirmDelete } from "@/components/inline-confirm";
import { useItemDnd } from "@/lib/use-item-dnd";
import { LogoGridEditor, type LogoCell } from "./logo-grid-editor";

interface ProjectsEditorProps {
  data: Record<string, unknown>;
  onUpdate: (data: Record<string, unknown>) => void;
}

export function ProjectsEditor({ data, onUpdate }: ProjectsEditorProps) {
  const caption = (data.caption as string) || "";
  const title = (data.title as string) || "";
  const titleSecondary = (data.titleSecondary as string) || "";

  type RawParagraph = string | { text?: string };
  const rawParagraphs = data.paragraphs as RawParagraph[] | undefined;
  const paragraphs: Array<{ text: string }> = Array.isArray(rawParagraphs)
    ? rawParagraphs.map((p) => ({ text: typeof p === "string" ? p : p.text ?? "" }))
    : [];

  const rawAccordion = (data.accordion as Array<{ title?: string; paragraphs?: string[] }>) || [];
  const accordion: Array<{ title: string; paragraphs: string[] }> = rawAccordion.map((i) => ({
    title: i.title ?? "",
    paragraphs: Array.isArray(i.paragraphs) ? i.paragraphs : [],
  }));

  // logoGrid is stored as { cells: LogoCell[] } in the content file
  const logoGrid = (data.logoGrid as { cells?: LogoCell[] } | undefined)?.cells ?? [];

  const [loadingLogos, setLoadingLogos] = useState(false);

  const paragraphsDnd = useItemDnd(paragraphs, (reordered) => onUpdate({ paragraphs: reordered }));
  const accordionDnd = useItemDnd(accordion, (reordered) => onUpdate({ accordion: reordered }));

  // ── Paragraphs ────────────────────────────────────────────────────────────────

  function updateParagraph(i: number, text: string) {
    onUpdate({ paragraphs: paragraphs.map((p, idx) => (idx === i ? { text } : p)) });
  }

  function addParagraph() {
    onUpdate({ paragraphs: [...paragraphs, { text: "" }] });
  }

  function removeParagraph(i: number) {
    onUpdate({ paragraphs: paragraphs.filter((_, idx) => idx !== i) });
  }

  // ── Accordion ─────────────────────────────────────────────────────────────────

  function addAccordionItem() {
    onUpdate({ accordion: [...accordion, { title: "", paragraphs: [] }] });
  }

  function updateAccordionTitle(i: number, value: string) {
    onUpdate({ accordion: accordion.map((it, idx) => (idx === i ? { ...it, title: value } : it)) });
  }

  function removeAccordionItem(i: number) {
    onUpdate({ accordion: accordion.filter((_, idx) => idx !== i) });
  }

  function updateAccordionParagraph(accIndex: number, pIndex: number, value: string) {
    onUpdate({
      accordion: accordion.map((it, i) =>
        i === accIndex
          ? { ...it, paragraphs: it.paragraphs.map((p, j) => (j === pIndex ? value : p)) }
          : it
      ),
    });
  }

  function addAccordionParagraph(accIndex: number) {
    onUpdate({
      accordion: accordion.map((it, i) =>
        i === accIndex ? { ...it, paragraphs: [...it.paragraphs, ""] } : it
      ),
    });
  }

  function removeAccordionParagraph(accIndex: number, pIndex: number) {
    onUpdate({
      accordion: accordion.map((it, i) =>
        i === accIndex
          ? { ...it, paragraphs: it.paragraphs.filter((_, j) => j !== pIndex) }
          : it
      ),
    });
  }

  // ── Logo grid ──────────────────────────────────────────────────────────────────

  function updateLogoGrid(cells: LogoCell[]) {
    onUpdate({ logoGrid: { cells } });
  }

  async function loadClipLogos() {
    setLoadingLogos(true);
    try {
      const res = await apiFetch("/api/partner-logos");
      const list = (await res.json()) as Array<{ src: string; alt: string }>;
      const newCells: LogoCell[] = list.map((item, i) => ({
        id: `clip-${Date.now()}-${i}`,
        src: item.src,
        alt: item.alt,
        size: "M" as const,
      }));
      updateLogoGrid(newCells);
    } catch {
      // ignore
    } finally {
      setLoadingLogos(false);
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className="rounded-sm border-t border-[#404040] bg-[#0A0A0A] pb-20">
      <div className="mx-auto flex max-w-[1512px] flex-row gap-8 px-5 py-10 md:px-8 xl:px-14">

        {/* Left column — 560px fixed, matches site layout */}
        <div className="flex w-[500px] shrink-0 flex-col justify-between gap-16">

          {/* Top: caption + title + paragraphs */}
          <div className="flex flex-col gap-6">
            <InlineEdit
              value={caption}
              onSave={(v) => onUpdate({ caption: v })}
              placeholder="тег (например: проекты)"
            >
              <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#FFCC00]">
                {caption || "тег"}
              </span>
            </InlineEdit>

            <div className="flex flex-col gap-1">
              <InlineEdit
                value={title}
                onSave={(v) => onUpdate({ title: v })}
                placeholder="Заголовок"
              >
                <h2 className="h2 text-[#F0F0F0] whitespace-pre-line">
                  {title || "Заголовок"}
                </h2>
              </InlineEdit>
              <InlineEdit
                value={titleSecondary}
                onSave={(v) => onUpdate({ titleSecondary: v })}
                placeholder="Доп. часть заголовка (серая)"
              >
                <span className="h2 block whitespace-pre-line text-[#939393]">
                  {titleSecondary || "доп. часть"}
                </span>
              </InlineEdit>
            </div>

            {/* Paragraphs */}
            <div className="flex flex-col gap-3">
              {paragraphs.map((p, i) => {
                const { draggable, onDragStart, onDragOver, onDrop, onDragEnd, isDragging } =
                  paragraphsDnd.itemProps(i);
                return (
                  <div
                    key={i}
                    draggable={draggable}
                    onDragStart={onDragStart}
                    onDragOver={onDragOver}
                    onDrop={onDrop}
                    onDragEnd={onDragEnd}
                    className={`group/para relative transition-all ${isDragging ? "opacity-60" : ""}`}
                  >
                    <div className="absolute -right-1 -top-1 z-10 flex items-center gap-0.5 opacity-0 transition-opacity group-hover/para:opacity-100">
                      <div
                        className="flex h-5 w-5 cursor-grab items-center justify-center rounded-sm bg-[#F0F0F0] text-[#0A0A0A] select-none active:cursor-grabbing"
                        onMouseDown={() => paragraphsDnd.onGripDown(i)}
                        onMouseUp={paragraphsDnd.onGripUp}
                      >
                        <GripVertical className="h-2.5 w-2.5" />
                      </div>
                      <InlineConfirmDelete
                        onConfirm={() => removeParagraph(i)}
                        className="bg-[#F0F0F0] text-[#0A0A0A] hover:bg-[#ED4843] hover:text-[#F0F0F0]"
                      />
                    </div>
                    <InlineEdit
                      value={p.text}
                      onSave={(v) => updateParagraph(i, v)}
                      multiline
                      copy
                      placeholder="Текст параграфа"
                    >
                      <MdText
                        value={p.text}
                        placeholder="Текст параграфа"
                        className="text-[length:var(--text-18)] leading-[1.2] text-[#939393]"
                      />
                    </InlineEdit>
                  </div>
                );
              })}
              <button
                onClick={addParagraph}
                className="flex items-center justify-center gap-1 border border-dashed border-[#404040] py-3 text-[length:var(--text-14)] text-[#939393] transition-colors hover:border-[#FFCC00] hover:text-[#FFCC00]"
              >
                <Plus className="h-3.5 w-3.5" />
                Добавить абзац
              </button>
            </div>
          </div>

          {/* Bottom: accordion — pushed down with justify-between */}
          <div className="flex flex-col">
            {accordion.map((item, i) => {
              const isFirst = i === 0;
              const { draggable, onDragStart, onDragOver, onDrop, onDragEnd, isDragging } =
                accordionDnd.itemProps(i);
              return (
                <div
                  key={i}
                  draggable={draggable}
                  onDragStart={onDragStart}
                  onDragOver={onDragOver}
                  onDrop={onDrop}
                  onDragEnd={onDragEnd}
                  className={`group/acc relative transition-all ${isDragging ? "opacity-60" : ""}`}
                >
                  <div className="absolute -right-1 -top-1 z-10 flex items-center gap-0.5 opacity-0 transition-opacity group-hover/acc:opacity-100">
                    <div
                      className="flex h-5 w-5 cursor-grab items-center justify-center rounded-sm bg-[#F0F0F0] text-[#0A0A0A] select-none active:cursor-grabbing"
                      onMouseDown={() => accordionDnd.onGripDown(i)}
                      onMouseUp={accordionDnd.onGripUp}
                    >
                      <GripVertical className="h-2.5 w-2.5" />
                    </div>
                    <InlineConfirmDelete
                      onConfirm={() => removeAccordionItem(i)}
                      className="bg-[#F0F0F0] text-[#0A0A0A] hover:bg-[#ED4843] hover:text-[#F0F0F0]"
                    />
                  </div>

                  <div
                    className={`flex w-full flex-col gap-4 py-6 pr-4 border-[#404040] ${
                      isFirst ? "border-t border-b" : "border-b"
                    }`}
                  >
                    <InlineEdit
                      value={item.title}
                      onSave={(v) => updateAccordionTitle(i, v)}
                      placeholder="Название проекта"
                    >
                      <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-16)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#F0F0F0]">
                        {item.title || "Название проекта"}
                      </span>
                    </InlineEdit>
                    <AccordionParagraphs
                      accIndex={i}
                      paragraphs={item.paragraphs}
                      onUpdate={updateAccordionParagraph}
                      onAdd={addAccordionParagraph}
                      onRemove={removeAccordionParagraph}
                    />
                  </div>
                </div>
              );
            })}

            <button
              onClick={addAccordionItem}
              className="flex items-center justify-center gap-1 border border-dashed border-[#404040] py-4 text-[length:var(--text-14)] text-[#939393] transition-colors hover:border-[#FFCC00] hover:text-[#FFCC00]"
            >
              <Plus className="h-3.5 w-3.5" />
              Добавить пункт
            </button>
          </div>
        </div>

        {/* Right column — flex-1, logo grid */}
        <div className="flex-1 self-start">
          <LogoGridEditor
            cells={logoGrid}
            onUpdate={updateLogoGrid}
            onLoadPreset={loadClipLogos}
            loadingPreset={loadingLogos}
          />
        </div>
      </div>
    </div>
  );
}

// ── AccordionParagraphs sub-component ──────────────────────────────────────────

interface AccordionParagraphsProps {
  accIndex: number;
  paragraphs: string[];
  onUpdate: (accIndex: number, pIndex: number, value: string) => void;
  onAdd: (accIndex: number) => void;
  onRemove: (accIndex: number, pIndex: number) => void;
}

function AccordionParagraphs({
  accIndex,
  paragraphs,
  onUpdate,
  onAdd,
  onRemove,
}: AccordionParagraphsProps) {
  const dnd = useItemDnd(paragraphs, (reordered) => {
    // reorder by updating each paragraph sequentially
    reordered.forEach((p, j) => onUpdate(accIndex, j, p));
  });

  return (
    <div className="flex flex-col gap-2">
      {paragraphs.map((p, pIndex) => {
        const { draggable, onDragStart, onDragOver, onDrop, onDragEnd, isDragging } =
          dnd.itemProps(pIndex);
        return (
          <div
            key={pIndex}
            draggable={draggable}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onDragEnd={onDragEnd}
            className={`group/accp relative transition-all ${isDragging ? "opacity-60" : ""}`}
          >
            <div className="absolute -right-1 -top-1 z-10 flex items-center gap-0.5 opacity-0 transition-opacity group-hover/accp:opacity-100">
              <div
                className="flex h-5 w-5 cursor-grab items-center justify-center rounded-sm bg-[#F0F0F0] text-[#0A0A0A] select-none active:cursor-grabbing"
                onMouseDown={() => dnd.onGripDown(pIndex)}
                onMouseUp={dnd.onGripUp}
              >
                <GripVertical className="h-2.5 w-2.5" />
              </div>
              <InlineConfirmDelete
                onConfirm={() => onRemove(accIndex, pIndex)}
                className="bg-[#F0F0F0] text-[#0A0A0A] hover:bg-[#ED4843] hover:text-[#F0F0F0]"
              />
            </div>
            <InlineEdit
              value={p}
              onSave={(v) => onUpdate(accIndex, pIndex, v)}
              multiline
              placeholder="Описание..."
            >
              <MdText
                value={p}
                placeholder="Описание"
                className="text-[length:var(--text-14)] leading-[1.32] tracking-[0.01em] text-[#939393]"
              />
            </InlineEdit>
          </div>
        );
      })}

      <button
        onClick={() => onAdd(accIndex)}
        className="flex items-center justify-center gap-1 border border-dashed border-[#404040] py-2 text-[length:var(--text-12)] text-[#939393] transition-colors hover:border-[#FFCC00] hover:text-[#FFCC00]"
      >
        <Plus className="h-3 w-3" />
        Добавить описание
      </button>
    </div>
  );
}
