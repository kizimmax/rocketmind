"use client";

import { useRef } from "react";
import { GripVertical, Upload } from "lucide-react";
import { Switch } from "@rocketmind/ui";
import { InlineEdit } from "@/components/inline-edit";
import { InlineConfirmDelete } from "@/components/inline-confirm";
import { InsertButton } from "@/components/insert-button";
import { useItemDnd } from "@/lib/use-item-dnd";

interface ToolsEditorProps {
  data: Record<string, unknown>;
  onUpdate: (data: Record<string, unknown>) => void;
}

type Tool = { number: string; title: string; text: string; icon?: string | null };

export function ToolsEditor({ data, onUpdate }: ToolsEditorProps) {
  const tag = (data.tag as string) || "";
  const title = (data.title as string) || "";
  const description = (data.description as string) || "";
  const useIcons = (data.useIcons as boolean) || false;
  const tools = (data.tools as Tool[]) || [];

  const dnd = useItemDnd(tools, (reordered) => onUpdate({ tools: reordered }));

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
        <div className="mb-8 flex items-start justify-between">
          <div className="flex max-w-[560px] flex-col gap-2">
            <InlineEdit
              value={tag}
              onSave={(v) => onUpdate({ tag: v })}
              placeholder="инструменты"
            >
              <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#FFCC00]">
                {tag || "инструменты"}
              </span>
            </InlineEdit>

            <InlineEdit
              value={title}
              onSave={(v) => onUpdate({ title: v })}
              placeholder="Заголовок"
            >
              <h2 className="h2 text-[#F0F0F0]">{title || "Заголовок"}</h2>
            </InlineEdit>

            <InlineEdit
              value={description}
              onSave={(v) => onUpdate({ description: v })}
              multiline
              copy
              placeholder="Описание"
            >
              <p className="text-[length:var(--text-18)] leading-[1.2] text-[#939393]">
                {description || "Описание"}
              </p>
            </InlineEdit>
          </div>

          {/* Icons toggle */}
          <div className="flex items-center gap-2">
            <span className="text-[length:var(--text-12)] text-[#939393]">
              Иконки
            </span>
            <Switch
              checked={useIcons}
              onCheckedChange={(v) => onUpdate({ useIcons: v })}
            />
          </div>
        </div>

        {/* Cards */}
        <div className="flex items-stretch">
          {tools.map((tool, index) => {
            const { draggable, onDragStart, onDragOver, onDrop, onDragEnd, isDragging } =
              dnd.itemProps(index);

            return (
              <div key={index} className="flex flex-1 items-stretch">
                {tools.length < 6 && (
                  <InsertButton onClick={() => insertTool(index)} />
                )}

                <div
                  draggable={draggable}
                  onDragStart={onDragStart}
                  onDragOver={onDragOver}
                  onDrop={onDrop}
                  onDragEnd={onDragEnd}
                  className={`group/card relative flex min-w-0 flex-1 flex-col gap-4 border border-[#404040] p-8 transition-all ${
                    isDragging ? "opacity-60" : ""
                  }`}
                >
                  {/* Controls */}
                  <div className="absolute -right-1 -top-1 z-10 flex items-center gap-0.5 opacity-0 transition-opacity group-hover/card:opacity-100">
                    <div
                      className="flex h-5 w-5 cursor-grab items-center justify-center rounded-sm bg-[#0A0A0A] text-[#F0F0F0] select-none active:cursor-grabbing"
                      onMouseDown={() => dnd.onGripDown(index)}
                      onMouseUp={dnd.onGripUp}
                    >
                      <GripVertical className="h-2.5 w-2.5" />
                    </div>
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
                    <span className="font-[family-name:var(--font-mono-family)] text-[80px] font-medium leading-[1.08] tracking-[0.02em] text-transparent [-webkit-text-stroke:1px_#404040]">
                      {tool.number}
                    </span>
                  )}

                  {/* Title */}
                  <InlineEdit
                    value={tool.title}
                    onSave={(v) => updateTool(index, "title", v)}
                    placeholder="Название"
                  >
                    <h4 className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-24)] font-bold uppercase leading-[1.2] tracking-[-0.01em] text-[#F0F0F0]">
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
                    <p className="text-[length:var(--text-16)] leading-[1.28] text-[#939393]">
                      {tool.text || "Описание инструмента"}
                    </p>
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
