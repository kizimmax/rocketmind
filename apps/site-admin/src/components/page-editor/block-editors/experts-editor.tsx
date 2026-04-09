"use client";

import { GripVertical } from "lucide-react";
import { InlineEdit } from "@/components/inline-edit";
import { InlineConfirmDelete } from "@/components/inline-confirm";
import { InsertButton } from "@/components/insert-button";
import { useItemDnd } from "@/lib/use-item-dnd";

interface ExpertsEditorProps {
  data: Record<string, unknown>;
  onUpdate: (data: Record<string, unknown>) => void;
}

type Expert = { tag?: string; name: string; bio: string; image: string };

export function ExpertsEditor({ data, onUpdate }: ExpertsEditorProps) {
  const experts = (data.experts as Expert[]) || [];

  const dnd = useItemDnd(experts, (reordered) => onUpdate({ experts: reordered }));

  function updateExpert(index: number, field: string, value: string) {
    const updated = experts.map((e, i) =>
      i === index ? { ...e, [field]: value } : e,
    );
    onUpdate({ experts: updated });
  }

  function insertExpert(atIndex: number) {
    const next = [...experts];
    next.splice(atIndex, 0, { name: "", bio: "", image: "" });
    onUpdate({ experts: next });
  }

  function removeExpert(index: number) {
    onUpdate({ experts: experts.filter((_, i) => i !== index) });
  }

  return (
    <div className="rounded-sm border-t border-[#404040] bg-[#0A0A0A] pb-20">
      <div className="mx-auto max-w-[1512px] px-5 py-10 md:px-8 xl:px-14">
        {/* Cards — vertical stack with insert buttons */}
        <div className="flex flex-col gap-1">
          {experts.map((expert, index) => {
            const { draggable, onDragStart, onDragOver, onDrop, onDragEnd, isDragging } =
              dnd.itemProps(index);

            return (
              <div key={index} className="flex flex-col">
                {/* Insert before */}
                <InsertButton onClick={() => insertExpert(index)} />

                <div
                  draggable={draggable}
                  onDragStart={onDragStart}
                  onDragOver={onDragOver}
                  onDrop={onDrop}
                  onDragEnd={onDragEnd}
                  className={`group/card relative flex gap-8 bg-[#121212] p-8 transition-all ${
                    isDragging ? "opacity-60" : ""
                  }`}
                >
                  {/* Drag & delete controls */}
                  <div className="absolute -right-1 -top-1 z-10 flex items-center gap-0.5 opacity-0 transition-opacity group-hover/card:opacity-100">
                    <div
                      className="flex h-5 w-5 cursor-grab items-center justify-center rounded-sm bg-[#0A0A0A] text-[#F0F0F0] select-none active:cursor-grabbing"
                      onMouseDown={() => dnd.onGripDown(index)}
                      onMouseUp={dnd.onGripUp}
                    >
                      <GripVertical className="h-2.5 w-2.5" />
                    </div>
                    <InlineConfirmDelete
                      onConfirm={() => removeExpert(index)}
                      className="bg-[#0A0A0A] text-[#F0F0F0] hover:bg-[#ED4843]"
                    />
                  </div>

                  {/* Photo placeholder */}
                  <div
                    className="h-[285px] w-[285px] shrink-0 bg-[#2a2a2a] bg-cover bg-center"
                    style={
                      expert.image
                        ? { backgroundImage: `url(${expert.image})` }
                        : undefined
                    }
                  >
                    {!expert.image && (
                      <div className="flex h-full items-center justify-center">
                        <InlineEdit
                          value={expert.image}
                          onSave={(v) => updateExpert(index, "image", v)}
                          placeholder="/images/experts/photo.jpg"
                        >
                          <span className="text-[length:var(--text-14)] text-[#939393] cursor-pointer">
                            + фото (URL)
                          </span>
                        </InlineEdit>
                      </div>
                    )}
                  </div>

                  {/* Text content */}
                  <div className="flex flex-1 flex-col gap-2">
                    <InlineEdit
                      value={expert.tag || ""}
                      onSave={(v) => updateExpert(index, "tag", v)}
                      placeholder="Эксперт продукта"
                    >
                      <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#FFCC00]">
                        {expert.tag || "Эксперт продукта"}
                      </span>
                    </InlineEdit>

                    <div className="flex flex-1 flex-col gap-6">
                      <InlineEdit
                        value={expert.name}
                        onSave={(v) => updateExpert(index, "name", v)}
                        placeholder="Имя Фамилия"
                      >
                        <h3 className="h3 text-[#F0F0F0]">
                          {expert.name || "Имя Фамилия"}
                        </h3>
                      </InlineEdit>

                      <div className="flex flex-1 items-end">
                        <InlineEdit
                          value={expert.bio}
                          onSave={(v) => updateExpert(index, "bio", v)}
                          multiline
                          copy
                          placeholder="Биография эксперта"
                        >
                          <p className="text-[length:var(--text-14)] leading-[1.32] tracking-[0.01em] text-[#939393]">
                            {expert.bio || "Биография эксперта"}
                          </p>
                        </InlineEdit>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Insert after last */}
          <InsertButton onClick={() => insertExpert(experts.length)} />
        </div>
      </div>
    </div>
  );
}
