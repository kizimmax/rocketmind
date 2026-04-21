"use client";

import { GripVertical, Columns2, Square } from "lucide-react";
import { RichText } from "@rocketmind/ui";
import { InlineEdit } from "@/components/inline-edit";
import { InlineConfirmDelete } from "@/components/inline-confirm";
import { ItemMoveButtons } from "@/components/item-move-buttons";
import { InsertButton } from "@/components/insert-button";
import {
  ParagraphsEditor,
  resolveParagraphs,
  type StyledParagraph,
} from "@/components/paragraphs-editor";
import { useItemDnd } from "@/lib/use-item-dnd";

interface AudienceEditorProps {
  data: Record<string, unknown>;
  onUpdate: (data: Record<string, unknown>) => void;
}

type Fact = { title: string; text: string; wide?: boolean };

export function AudienceEditor({ data, onUpdate }: AudienceEditorProps) {
  const tag = (data.tag as string) || "";
  const title = (data.title as string) || "";
  const titleSecondary = (data.titleSecondary as string) || "";
  const paragraphs = resolveParagraphs(
    data.paragraphs,
    (data.subtitle as string) || "",
    { uppercase: true, color: "primary" },
  );
  const facts = (data.facts as Fact[]) || [];

  function setParagraphs(next: StyledParagraph[]) {
    onUpdate({ paragraphs: next, subtitle: undefined });
  }

  const dnd = useItemDnd(facts, (reordered) => onUpdate({ facts: reordered }));

  function updateFact(index: number, field: string, value: string | boolean) {
    const updated = facts.map((f, i) =>
      i === index ? { ...f, [field]: value } : f
    );
    onUpdate({ facts: updated });
  }

  function toggleWide(index: number) {
    updateFact(index, "wide", !facts[index].wide);
  }

  function insertFact(atIndex: number) {
    const next = [...facts];
    next.splice(atIndex, 0, { title: "", text: "" });
    onUpdate({ facts: next });
  }

  function removeFact(index: number) {
    onUpdate({ facts: facts.filter((_, i) => i !== index) });
  }

  return (
    <div className="rounded-sm border-t border-[#404040] bg-[#F0F0F0] pb-20">
      <div className="mx-auto max-w-[1512px] px-5 py-10 md:px-8 xl:px-14">
        {/* Header row */}
        <div className="mb-8 flex flex-col gap-4 lg:flex-row">
          <div className="lg:w-1/2 lg:shrink-0 lg:pr-8">
            <InlineEdit
              value={tag}
              onSave={(v) => onUpdate({ tag: v })}
              placeholder="для кого"
            >
              <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#0A0A0A]">
                {tag || "тег"}
              </span>
            </InlineEdit>

            <div className="mt-3 flex flex-col gap-1">
              <InlineEdit
                value={title}
                onSave={(v) => onUpdate({ title: v })}
                placeholder="Заголовок"
              >
                <h2 className="h2 text-[#0A0A0A]">
                  {title || "Заголовок"}
                </h2>
              </InlineEdit>
              <InlineEdit
                value={titleSecondary}
                onSave={(v) => onUpdate({ titleSecondary: v })}
                placeholder="Дополнительная часть (серая)"
              >
                <span className="h2 text-[#666666] block">
                  {titleSecondary || "доп. часть"}
                </span>
              </InlineEdit>
            </div>
          </div>

          <div className="lg:w-1/2">
            <ParagraphsEditor
              paragraphs={paragraphs}
              onChange={setParagraphs}
              theme="light"
              defaults={{ uppercase: true, color: "primary" }}
            />
          </div>
        </div>

        {/* Fact cards — flex row with insert buttons between */}
        <div className="flex items-stretch">
          {facts.map((fact, index) => {
            const { draggable, onDragStart, onDragOver, onDrop, onDragEnd, isDragging } =
              dnd.itemProps(index);

            return (
              <div key={index} className="flex items-stretch" style={{ flex: fact.wide ? 2 : 1 }}>
                {/* Insert before first / between cards */}
                {facts.length < 4 && (
                  <InsertButton onClick={() => insertFact(index)} />
                )}

                <div
                  draggable={draggable}
                  onDragStart={onDragStart}
                  onDragOver={onDragOver}
                  onDrop={onDrop}
                  onDragEnd={onDragEnd}
                  className={`group/fact relative flex min-w-0 flex-1 flex-col gap-4 transition-all ${
                    isDragging ? "opacity-60" : ""
                  }`}
                >
                  {/* Controls */}
                  <div className="absolute -right-1 -top-1 z-10 flex items-center gap-0.5 opacity-0 transition-opacity group-hover/fact:opacity-100">
                    <button
                      onClick={() => toggleWide(index)}
                      title={fact.wide ? "Обычная ширина" : "Двойная ширина"}
                      className="flex h-5 w-5 items-center justify-center rounded-sm bg-[#0A0A0A] text-[#F0F0F0] hover:bg-[#FFCC00] hover:text-[#0A0A0A]"
                    >
                      {fact.wide ? (
                        <Square className="h-2.5 w-2.5" />
                      ) : (
                        <Columns2 className="h-2.5 w-2.5" />
                      )}
                    </button>
                    <div
                      className="flex h-5 w-5 cursor-grab items-center justify-center rounded-sm bg-[#0A0A0A] text-[#F0F0F0] select-none active:cursor-grabbing"
                      onMouseDown={() => dnd.onGripDown(index)}
                      onMouseUp={dnd.onGripUp}
                    >
                      <GripVertical className="h-2.5 w-2.5" />
                    </div>
                    <ItemMoveButtons index={index} count={facts.length} onMove={dnd.move} />
                    <InlineConfirmDelete
                      onConfirm={() => removeFact(index)}
                      className="bg-[#0A0A0A] text-[#F0F0F0] hover:bg-[#ED4843]"
                    />
                  </div>

                  {/* Title — top */}
                  <div className="flex flex-1 items-end">
                    <InlineEdit
                      value={fact.title}
                      onSave={(v) => updateFact(index, "title", v)}
                      placeholder="Заголовок факта"
                    >
                      <span className="h4 text-[#0A0A0A]">
                        {fact.title || "Факт"}
                      </span>
                    </InlineEdit>
                  </div>

                  <div className="h-0 w-full border-t border-[#404040]" />

                  {/* Text — bottom */}
                  <div className="flex-1">
                    <InlineEdit
                      value={fact.text}
                      onSave={(v) => updateFact(index, "text", v)}
                      multiline
                      copy
                      placeholder="Описание факта"
                    >
                      {fact.text ? (
                        <RichText
                          text={fact.text}
                          className="max-w-[480px] text-[length:var(--text-16)] leading-[1.28] text-[#0A0A0A]"
                        />
                      ) : (
                        <p className="max-w-[480px] text-[length:var(--text-16)] leading-[1.28] text-[#0A0A0A]">
                          Описание
                        </p>
                      )}
                    </InlineEdit>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Insert after last */}
          {facts.length < 4 && (
            <InsertButton onClick={() => insertFact(facts.length)} />
          )}
        </div>
      </div>
    </div>
  );
}
