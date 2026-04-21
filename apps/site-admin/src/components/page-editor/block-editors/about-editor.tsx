"use client";

import { useRef } from "react";
import { Plus, GripVertical, ImagePlus, X as XIcon } from "lucide-react";
import { Switch } from "@rocketmind/ui";
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

interface AboutEditorProps {
  data: Record<string, unknown>;
  onUpdate: (data: Record<string, unknown>) => void;
}

export function AboutEditor({ data, onUpdate }: AboutEditorProps) {
  const caption = (data.caption as string) || "";
  const title = (data.title as string) || "";
  const titleSecondary = (data.titleSecondary as string) || "";
  const legacyUppercase = data.paragraphsUppercase === true;
  const paragraphs = resolveParagraphs(
    data.paragraphs,
    (data.description as string) || "",
    { uppercase: legacyUppercase, color: "secondary" },
  );
  const rawAccordion =
    (data.accordion as Array<{
      title: string;
      paragraphs?: string[];
      description?: string;
    }>) || [];
  const accordion: Array<{ title: string; paragraphs: string[] }> =
    rawAccordion.map((item) => {
      const itemParagraphs =
        Array.isArray(item.paragraphs) && item.paragraphs.length > 0
          ? item.paragraphs
          : typeof item.description === "string" && item.description
            ? [item.description]
            : [];
      return { title: item.title || "", paragraphs: itemParagraphs };
    });
  const collapsible = data.accordionCollapsible !== false;
  const hasImage = data.hasImage === true;
  const imageLeft = data.imageLeft === true;
  const paragraphsRight = data.paragraphsRight === true;
  const aboutImageData = (data.aboutImageData as string) || "";

  const fileInputRef = useRef<HTMLInputElement>(null);

  const dnd = useItemDnd(accordion, (reordered) =>
    onUpdate({ accordion: reordered })
  );

  function setParagraphs(next: StyledParagraph[]) {
    onUpdate({
      paragraphs: next,
      description: undefined,
      paragraphsUppercase: undefined,
    });
  }

  function updateAccordionTitle(index: number, value: string) {
    const updated = accordion.map((item, i) =>
      i === index ? { ...item, title: value } : item
    );
    onUpdate({ accordion: updated });
  }

  function updateAccordionParagraph(
    accIndex: number,
    pIndex: number,
    value: string,
  ) {
    const updated = accordion.map((item, i) =>
      i === accIndex
        ? {
            ...item,
            paragraphs: item.paragraphs.map((p, j) => (j === pIndex ? value : p)),
          }
        : item
    );
    onUpdate({ accordion: updated });
  }

  function addAccordionParagraph(accIndex: number) {
    const updated = accordion.map((item, i) =>
      i === accIndex ? { ...item, paragraphs: [...item.paragraphs, ""] } : item
    );
    onUpdate({ accordion: updated });
  }

  function removeAccordionParagraph(accIndex: number, pIndex: number) {
    const updated = accordion.map((item, i) =>
      i === accIndex
        ? { ...item, paragraphs: item.paragraphs.filter((_, j) => j !== pIndex) }
        : item
    );
    onUpdate({ accordion: updated });
  }

  function reorderAccordionParagraphs(accIndex: number, reordered: string[]) {
    const updated = accordion.map((item, i) =>
      i === accIndex ? { ...item, paragraphs: reordered } : item
    );
    onUpdate({ accordion: updated });
  }

  function addAccordion() {
    onUpdate({
      accordion: [...accordion, { title: "", paragraphs: [] }],
    });
  }

  function removeAccordion(index: number) {
    onUpdate({ accordion: accordion.filter((_, i) => i !== index) });
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      onUpdate({ aboutImageData: reader.result as string });
    };
    reader.readAsDataURL(file);
  }

  function removeImage() {
    onUpdate({ aboutImageData: "" });
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  // ── Paragraphs renderer ───────────────────────────────────────────────────

  function renderParagraphs() {
    return (
      <ParagraphsEditor
        paragraphs={paragraphs}
        onChange={setParagraphs}
        theme="dark"
        defaults={{ uppercase: false, color: "secondary" }}
      />
    );
  }

  // ── Accordion items renderer ──────────────────────────────────────────────

  function renderAccordion() {
    return (
      <div className="flex flex-col">
        {accordion.map((item, index) => {
          const isFirst = index === 0;
          const { draggable, onDragStart, onDragOver, onDrop, onDragEnd, isDragging } =
            dnd.itemProps(index);

          return (
            <div
              key={index}
              draggable={draggable}
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDrop={onDrop}
              onDragEnd={onDragEnd}
              className={`group/acc relative transition-all ${
                isDragging ? "opacity-60" : ""
              }`}
            >
              <div className="absolute -right-1 -top-1 z-10 flex items-center gap-0.5 opacity-0 transition-opacity group-hover/acc:opacity-100">
                <div
                  className="flex h-5 w-5 cursor-grab items-center justify-center rounded-sm bg-[#F0F0F0] text-[#0A0A0A] select-none active:cursor-grabbing"
                  onMouseDown={() => dnd.onGripDown(index)}
                  onMouseUp={dnd.onGripUp}
                >
                  <GripVertical className="h-2.5 w-2.5" />
                </div>
                <ItemMoveButtons index={index} count={accordion.length} onMove={dnd.move} />
                <InlineConfirmDelete
                  onConfirm={() => removeAccordion(index)}
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
                  onSave={(v) => updateAccordionTitle(index, v)}
                  placeholder="Заголовок пункта"
                >
                  <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#F0F0F0]">
                    {item.title || "Пункт аккордеона"}
                  </span>
                </InlineEdit>
                <AccordionParagraphs
                  accIndex={index}
                  paragraphs={item.paragraphs}
                  onUpdate={updateAccordionParagraph}
                  onAdd={addAccordionParagraph}
                  onRemove={removeAccordionParagraph}
                  onReorder={reorderAccordionParagraphs}
                />
              </div>
            </div>
          );
        })}

        <button
          onClick={addAccordion}
          className="flex items-center justify-center gap-1 border border-dashed border-[#404040] py-4 text-[length:var(--text-14)] text-[#939393] transition-colors hover:border-[#FFCC00] hover:text-[#FFCC00]"
        >
          <Plus className="h-3.5 w-3.5" />
          Добавить пункт
        </button>
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="rounded-sm border-t border-[#404040] bg-[#0A0A0A] pb-20">
      {/* Block settings */}
      <div className="mx-auto flex max-w-[1512px] items-center gap-6 px-5 pt-6 md:px-8 xl:px-14">
        <label className="flex items-center gap-2 text-[length:var(--text-12)] text-[#939393]">
          <Switch
            checked={collapsible}
            onCheckedChange={(v) => onUpdate({ accordionCollapsible: v })}
            size="sm"
          />
          Сворачиваемый аккордеон
        </label>
        <label className="flex items-center gap-2 text-[length:var(--text-12)] text-[#939393]">
          <Switch
            checked={hasImage}
            onCheckedChange={(v) => onUpdate({ hasImage: v })}
            size="sm"
          />
          С картинкой
        </label>
        {hasImage && (
          <label className="flex items-center gap-2 text-[length:var(--text-12)] text-[#939393]">
            <Switch
              checked={imageLeft}
              onCheckedChange={(v) => onUpdate({ imageLeft: v })}
              size="sm"
            />
            Картинка слева
          </label>
        )}
        {!hasImage && (
          <label className="flex items-center gap-2 text-[length:var(--text-12)] text-[#939393]">
            <Switch
              checked={paragraphsRight}
              onCheckedChange={(v) => onUpdate({ paragraphsRight: v })}
              size="sm"
            />
            Описание справа
          </label>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />

      {hasImage ? (
        /* ── With image variant ── */
        <div
          className={`mx-auto flex max-w-[1512px] flex-col px-5 py-10 md:px-8 xl:px-14 ${
            imageLeft ? "lg:flex-row-reverse" : "lg:flex-row"
          }`}
        >
          {/* Text + accordion — 50%, same as without-image variant */}
          <div
            className={`flex flex-col gap-4 lg:w-1/2 lg:shrink-0 ${
              imageLeft ? "lg:pl-8" : "lg:pr-8"
            }`}
          >
            <div className="flex max-w-[560px] flex-col gap-4">
              <InlineEdit
                value={caption}
                onSave={(v) => onUpdate({ caption: v })}
                placeholder="О продукте"
              >
                <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#FFCC00]">
                  {caption || "caption"}
                </span>
              </InlineEdit>

              <div className="flex flex-col gap-1">
                <InlineEdit
                  value={title}
                  onSave={(v) => onUpdate({ title: v })}
                  placeholder="Заголовок"
                >
                  <h2 className="h2 text-[#F0F0F0] whitespace-pre-line">
                    {title || "Заголовок блока"}
                  </h2>
                </InlineEdit>
                <InlineEdit
                  value={titleSecondary}
                  onSave={(v) => onUpdate({ titleSecondary: v })}
                  placeholder="Дополнительная часть (серая)"
                >
                  <span className="h2 text-[#939393] block whitespace-pre-line">
                    {titleSecondary || "доп. часть"}
                  </span>
                </InlineEdit>
              </div>

              {renderParagraphs()}
            </div>

            {/* Accordion */}
            {renderAccordion()}
          </div>

          {/* Right: image area — natural aspect ratio, square placeholder when empty */}
          <div className="relative mt-8 flex items-center justify-center bg-[#121212] lg:mt-0 lg:w-1/2 lg:shrink-0 lg:self-start">
            {aboutImageData ? (
              <>
                <img
                  src={aboutImageData}
                  alt="About"
                  className="block h-auto w-full"
                />
                <button
                  onClick={removeImage}
                  className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-sm bg-[#0A0A0A]/80 text-[#F0F0F0] transition-colors hover:bg-[#ED4843]"
                >
                  <XIcon className="h-3 w-3" />
                </button>
              </>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex aspect-square w-full flex-col items-center justify-center gap-2 text-[#939393] transition-colors hover:text-[#FFCC00]"
              >
                <ImagePlus className="h-10 w-10" />
                <span className="text-[length:var(--text-14)]">Добавить изображение</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        /* ── Without image variant — 50/50 ── */
        <div className="mx-auto flex max-w-[1512px] flex-col gap-8 px-5 py-10 md:px-8 lg:flex-row xl:px-14">
          {/* Left: text — 50% */}
          <div className="flex flex-col gap-4 lg:w-1/2 lg:shrink-0 lg:pr-8">
            <div className="flex max-w-[560px] flex-col gap-4">
              <InlineEdit
                value={caption}
                onSave={(v) => onUpdate({ caption: v })}
                placeholder="О продукте"
              >
                <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#FFCC00]">
                  {caption || "caption"}
                </span>
              </InlineEdit>

              <div className="flex flex-col gap-1">
                <InlineEdit
                  value={title}
                  onSave={(v) => onUpdate({ title: v })}
                  placeholder="Заголовок"
                >
                  <h2 className="h2 text-[#F0F0F0] whitespace-pre-line">
                    {title || "Заголовок блока"}
                  </h2>
                </InlineEdit>
                <InlineEdit
                  value={titleSecondary}
                  onSave={(v) => onUpdate({ titleSecondary: v })}
                  placeholder="Дополнительная часть (серая)"
                >
                  <span className="h2 text-[#939393] block whitespace-pre-line">
                    {titleSecondary || "доп. часть"}
                  </span>
                </InlineEdit>
              </div>

              {!paragraphsRight && renderParagraphs()}
            </div>
          </div>

          {/* Right: accordion (optionally with paragraphs above) — 50% */}
          <div className="flex flex-col gap-6 lg:w-1/2">
            {paragraphsRight && renderParagraphs()}
            {renderAccordion()}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Accordion paragraphs sub-component ─────────────────────────────────────

interface AccordionParagraphsProps {
  accIndex: number;
  paragraphs: string[];
  onUpdate: (accIndex: number, pIndex: number, value: string) => void;
  onAdd: (accIndex: number) => void;
  onRemove: (accIndex: number, pIndex: number) => void;
  onReorder: (accIndex: number, reordered: string[]) => void;
}

function AccordionParagraphs({
  accIndex,
  paragraphs,
  onUpdate,
  onAdd,
  onRemove,
  onReorder,
}: AccordionParagraphsProps) {
  const dnd = useItemDnd(paragraphs, (reordered) => onReorder(accIndex, reordered));

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
            className={`group/accp relative transition-all ${
              isDragging ? "opacity-60" : ""
            }`}
          >
            <div className="absolute -right-1 -top-1 z-10 flex items-center gap-0.5 opacity-0 transition-opacity group-hover/accp:opacity-100">
              <div
                className="flex h-5 w-5 cursor-grab items-center justify-center rounded-sm bg-[#F0F0F0] text-[#0A0A0A] select-none active:cursor-grabbing"
                onMouseDown={() => dnd.onGripDown(pIndex)}
                onMouseUp={dnd.onGripUp}
              >
                <GripVertical className="h-2.5 w-2.5" />
              </div>
              <ItemMoveButtons index={pIndex} count={paragraphs.length} onMove={dnd.move} />
              <InlineConfirmDelete
                onConfirm={() => onRemove(accIndex, pIndex)}
                className="bg-[#F0F0F0] text-[#0A0A0A] hover:bg-[#ED4843] hover:text-[#F0F0F0]"
              />
            </div>

            <InlineEdit
              value={p}
              onSave={(v) => onUpdate(accIndex, pIndex, v)}
              multiline
              placeholder="Абзац описания..."
            >
              <MdText
                value={p}
                placeholder="Абзац описания"
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
        Добавить абзац
      </button>
    </div>
  );
}
