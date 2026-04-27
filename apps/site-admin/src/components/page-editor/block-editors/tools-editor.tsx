"use client";

import { useRef } from "react";
import { GripVertical, Upload, Columns2, Square, Palette } from "lucide-react";
import { Switch } from "@rocketmind/ui";
import { InlineEdit } from "@/components/inline-edit";
import { MdText } from "@/components/md-text";
import { InlineConfirmDelete } from "@/components/inline-confirm";
import { ItemMoveButtons } from "@/components/item-move-buttons";
import { InsertButton } from "@/components/insert-button";
import {
  ParagraphsEditor,
  resolveParagraphs,
  type StyledParagraph,
} from "@/components/paragraphs-editor";
import { useItemDnd } from "@/lib/use-item-dnd";

interface ToolsEditorProps {
  data: Record<string, unknown>;
  onUpdate: (data: Record<string, unknown>) => void;
}

type Tool = { number: string; title: string; text: string; icon?: string | null; wide?: boolean; accent?: boolean };

export function ToolsEditor({ data, onUpdate }: ToolsEditorProps) {
  const tag = (data.tag as string) || "";
  const title = (data.title as string) || "";
  const titleSecondary = (data.titleSecondary as string) || "";
  const paragraphs = resolveParagraphs(
    data.paragraphs,
    (data.description as string) || "",
    { uppercase: false, color: "secondary" },
  );
  const useIcons = (data.useIcons as boolean) || false;
  const descriptionBelow = (data.descriptionBelow as boolean) || false;
  const tools = (data.tools as Tool[]) || [];

  const dnd = useItemDnd(tools, (reordered) => {
    const renumbered = reordered.map((t, i) => ({
      ...t,
      number: String(i + 1).padStart(2, "0"),
    }));
    onUpdate({ tools: renumbered });
  });

  function setParagraphs(next: StyledParagraph[]) {
    onUpdate({ paragraphs: next, description: undefined });
  }

  function updateTool(index: number, field: string, value: string) {
    const updated = tools.map((t, i) =>
      i === index ? { ...t, [field]: value } : t,
    );
    onUpdate({ tools: updated });
  }

  function insertTool(atIndex: number) {
    const next = [...tools];
    const num = String(atIndex + 1).padStart(2, "0");
    next.splice(atIndex, 0, { number: num, title: "", text: "" });
    // Renumber all
    const renumbered = next.map((t, i) => ({
      ...t,
      number: String(i + 1).padStart(2, "0"),
    }));
    onUpdate({ tools: renumbered });
  }

  function toggleWide(index: number) {
    const updated = tools.map((t, i) =>
      i === index ? { ...t, wide: !t.wide } : t,
    );
    onUpdate({ tools: updated });
  }

  function toggleAccent(index: number) {
    const updated = tools.map((t, i) =>
      i === index ? { ...t, accent: !t.accent } : t,
    );
    onUpdate({ tools: updated });
  }

  function removeTool(index: number) {
    const next = tools.filter((_, i) => i !== index);
    const renumbered = next.map((t, i) => ({
      ...t,
      number: String(i + 1).padStart(2, "0"),
    }));
    onUpdate({ tools: renumbered });
  }

  function handleIconUpload(index: number, file: File) {
    const reader = new FileReader();
    reader.onload = () => {
      const updated = tools.map((t, i) =>
        i === index ? { ...t, icon: reader.result as string } : t,
      );
      onUpdate({ tools: updated });
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="rounded-sm border-t border-[#404040] bg-[#0A0A0A] pb-20">
      <div className="mx-auto max-w-[1512px] px-5 py-10 md:px-8 xl:px-14">
        {/* Header */}
        <div className="relative mb-8">
          {/* Toggles — absolute top-right */}
          <div className="absolute right-0 top-0 z-10 flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[length:var(--text-12)] text-[#939393]">
                Иконки
              </span>
              <Switch
                checked={useIcons}
                onCheckedChange={(v) => onUpdate({ useIcons: v })}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[length:var(--text-12)] text-[#939393]">
                Описание снизу
              </span>
              <Switch
                checked={descriptionBelow}
                onCheckedChange={(v) => onUpdate({ descriptionBelow: v })}
              />
            </div>
          </div>

          {descriptionBelow ? (
            <div className="flex max-w-[668px] flex-col gap-4 pr-[220px]">
              <div className="flex flex-col gap-2">
                <InlineEdit
                  value={tag}
                  onSave={(v) => onUpdate({ tag: v })}
                  placeholder="инструменты"
                >
                  <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#FFCC00]">
                    {tag || "инструменты"}
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
              <ParagraphsEditor
                paragraphs={paragraphs}
                onChange={setParagraphs}
                theme="dark"
                defaults={{ uppercase: false, color: "secondary" }}
              />
            </div>
          ) : (
            <div className="flex gap-8 pr-[220px]">
              <div className="flex w-1/2 flex-col gap-2">
                <InlineEdit
                  value={tag}
                  onSave={(v) => onUpdate({ tag: v })}
                  placeholder="инструменты"
                >
                  <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#FFCC00]">
                    {tag || "инструменты"}
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
              <div className="flex w-1/2 items-end">
                <div className="max-w-[668px] w-full">
                  <ParagraphsEditor
                    paragraphs={paragraphs}
                    onChange={setParagraphs}
                    theme="dark"
                    defaults={{ uppercase: false, color: "secondary" }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Cards */}
        <div className="flex items-stretch">
          {tools.map((tool, index) => {
            const { draggable, onDragStart, onDragOver, onDrop, onDragEnd, isDragging } =
              dnd.itemProps(index);

            return (
              <div key={index} className="flex items-stretch" style={{ flex: tool.wide ? 2 : 1 }}>
                {tools.length < 6 && (
                  <InsertButton onClick={() => insertTool(index)} />
                )}

                <div
                  draggable={draggable}
                  onDragStart={onDragStart}
                  onDragOver={onDragOver}
                  onDrop={onDrop}
                  onDragEnd={onDragEnd}
                  className={`group/card relative flex min-w-0 flex-1 flex-col gap-4 p-8 transition-all ${
                    tool.accent ? "bg-[#FFCC00]" : "border border-[#404040]"
                  } ${isDragging ? "opacity-60" : ""}`}
                >
                  {/* Controls */}
                  <div className="absolute -right-1 -top-1 z-10 flex items-center gap-0.5 opacity-0 transition-opacity group-hover/card:opacity-100">
                    <button
                      onClick={() => toggleAccent(index)}
                      title={tool.accent ? "Обычный цвет" : "Акцентный жёлтый"}
                      className="flex h-5 w-5 items-center justify-center rounded-sm bg-[#0A0A0A] text-[#F0F0F0] hover:bg-[#FFCC00] hover:text-[#0A0A0A] cursor-pointer"
                    >
                      <Palette className="h-2.5 w-2.5" />
                    </button>
                    <button
                      onClick={() => toggleWide(index)}
                      title={tool.wide ? "Обычная ширина" : "Двойная ширина"}
                      className="flex h-5 w-5 items-center justify-center rounded-sm bg-[#0A0A0A] text-[#F0F0F0] hover:bg-[#FFCC00] hover:text-[#0A0A0A] cursor-pointer"
                    >
                      {tool.wide ? <Square className="h-2.5 w-2.5" /> : <Columns2 className="h-2.5 w-2.5" />}
                    </button>
                    <div
                      className="flex h-5 w-5 cursor-grab items-center justify-center rounded-sm bg-[#0A0A0A] text-[#F0F0F0] select-none active:cursor-grabbing"
                      onMouseDown={() => dnd.onGripDown(index)}
                      onMouseUp={dnd.onGripUp}
                    >
                      <GripVertical className="h-2.5 w-2.5" />
                    </div>
                    <ItemMoveButtons index={index} count={tools.length} onMove={dnd.move} />
                    <InlineConfirmDelete
                      onConfirm={() => removeTool(index)}
                      className="bg-[#0A0A0A] text-[#F0F0F0] hover:bg-[#ED4843]"
                    />
                  </div>

                  {/* Number or icon upload */}
                  {useIcons ? (
                    <IconUpload
                      icon={tool.icon}
                      onUpload={(file) => handleIconUpload(index, file)}
                    />
                  ) : (
                    <span
                      className={`font-[family-name:var(--font-mono-family)] text-[80px] font-medium leading-[1.08] tracking-[0.02em] text-transparent ${
                        tool.accent ? "[-webkit-text-stroke:1px_#0A0A0A]" : "[-webkit-text-stroke:1px_#404040]"
                      }`}
                    >
                      {tool.number}
                    </span>
                  )}

                  {/* Title */}
                  <InlineEdit
                    value={tool.title}
                    onSave={(v) => updateTool(index, "title", v)}
                    placeholder="Название"
                  >
                    <h4
                      className={`font-[family-name:var(--font-heading-family)] text-[length:var(--text-24)] font-bold uppercase leading-[1.2] tracking-[-0.01em] ${
                        tool.accent ? "text-[#0A0A0A]" : "text-[#F0F0F0]"
                      }`}
                    >
                      {tool.title || "Название"}
                    </h4>
                  </InlineEdit>

                  {/* Text */}
                  <InlineEdit
                    value={tool.text}
                    onSave={(v) => updateTool(index, "text", v)}
                    multiline
                    copy
                    placeholder="Описание"
                  >
                    <MdText
                      value={tool.text}
                      placeholder="Описание инструмента"
                      className={`text-[length:var(--text-16)] leading-[1.28] ${
                        tool.accent ? "text-[#0A0A0A]" : "text-[#939393]"
                      }`}
                    />
                  </InlineEdit>
                </div>
              </div>
            );
          })}

          {tools.length < 6 && (
            <InsertButton onClick={() => insertTool(tools.length)} />
          )}
        </div>
      </div>
    </div>
  );
}

// ── Icon Upload Button ───────────────────────────────────────────────────────

function IconUpload({
  icon,
  onUpload,
}: {
  icon?: string | null;
  onUpload: (file: File) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <div className="group/icon relative">
      {icon ? (
        <div
          className="h-[86px] w-[86px] bg-contain bg-center bg-no-repeat cursor-pointer"
          style={{ backgroundImage: `url(${icon})` }}
          onClick={() => ref.current?.click()}
        />
      ) : (
        <button
          type="button"
          onClick={() => ref.current?.click()}
          className="flex h-[86px] w-[86px] items-center justify-center rounded border border-dashed border-[#404040] text-[#939393] hover:border-[#FFCC00] hover:text-[#FFCC00] cursor-pointer"
        >
          <Upload className="h-4 w-4" />
        </button>
      )}
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onUpload(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
