"use client";

import { Plus, GripVertical, CaseUpper } from "lucide-react";
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

interface ProcessEditorProps {
  data: Record<string, unknown>;
  onUpdate: (data: Record<string, unknown>) => void;
}

export function ProcessEditor({ data, onUpdate }: ProcessEditorProps) {
  const tag = (data.tag as string) || "";
  const title = (data.title as string) || "";
  const titleSecondary = (data.titleSecondary as string) || "";
  const subtitle = (data.subtitle as string) || "";
  const subtitleUppercase = data.subtitleUppercase !== false;
  const subtitleUppercaseClass =
    "font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#F0F0F0]";
  const subtitleNormalClass =
    "text-[length:var(--text-18)] leading-[1.2] text-[#F0F0F0]";

  // ── Description paragraphs (multi, per-paragraph caps + color) ────────────
  const paragraphs = resolveParagraphs(
    data.paragraphs ?? data.descriptionParagraphs,
    (data.description as string) || "",
    { uppercase: true, color: "secondary" },
  );

  const steps =
    (data.steps as Array<{
      number: string;
      title: string;
      text: string;
      duration: string;
    }>) || [];
  const participantsTag = (data.participantsTag as string) || "";
  const participants =
    (data.participants as Array<{ role: string; text: string }>) || [];
  const showParticipants = data.showParticipants !== false;
  const variant = (data.variant as string) || "product";
  const isAcademy = variant === "academy";

  const stepsDnd = useItemDnd(steps, (reordered) =>
    onUpdate({ steps: reordered })
  );
  const partDnd = useItemDnd(participants, (reordered) =>
    onUpdate({ participants: reordered })
  );

  function setParagraphs(next: StyledParagraph[]) {
    onUpdate({ paragraphs: next, descriptionParagraphs: undefined, description: undefined });
  }

  function updateStep(index: number, field: string, value: string) {
    const updated = steps.map((s, i) =>
      i === index ? { ...s, [field]: value } : s
    );
    onUpdate({ steps: updated });
  }

  function addStep() {
    onUpdate({
      steps: [
        ...steps,
        {
          number: String(steps.length + 1).padStart(2, "0"),
          title: "",
          text: "",
          duration: "",
        },
      ],
    });
  }

  function removeStep(index: number) {
    onUpdate({ steps: steps.filter((_, i) => i !== index) });
  }

  function updateParticipant(index: number, field: string, value: string) {
    const updated = participants.map((p, i) =>
      i === index ? { ...p, [field]: value } : p
    );
    onUpdate({ participants: updated });
  }

  function addParticipant() {
    onUpdate({ participants: [...participants, { role: "", text: "" }] });
  }

  function removeParticipant(index: number) {
    onUpdate({ participants: participants.filter((_, i) => i !== index) });
  }

  return (
    <div className="rounded-sm border-t border-[#404040] bg-[#0A0A0A] pb-20">
      {/* Block settings */}
      <div className="mx-auto flex max-w-[1512px] items-center gap-6 px-5 pt-6 md:px-8 xl:px-14">
        <label className="flex items-center gap-2 text-[length:var(--text-12)] text-[#939393]">
          <Switch
            checked={isAcademy}
            onCheckedChange={(v) => onUpdate({ variant: v ? "academy" : "product" })}
            size="sm"
          />
          Вид для школы
        </label>
      </div>

      <div className="mx-auto flex max-w-[1512px] flex-col gap-8 px-5 py-10 md:px-8 lg:flex-row xl:px-14">
        {/* Left: header + participants — 50% */}
        <div className="flex flex-col gap-6 lg:w-1/2 lg:shrink-0 lg:pr-8">
          <div className="flex flex-col gap-2">
            <InlineEdit
              value={tag}
              onSave={(v) => onUpdate({ tag: v })}
              placeholder="этапы"
            >
              <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#FFCC00]">
                {tag || "тег"}
              </span>
            </InlineEdit>

            <div className="flex flex-col gap-1">
              <InlineEdit
                value={title}
                onSave={(v) => onUpdate({ title: v })}
                placeholder="Заголовок"
              >
                <h2 className="h2 text-[#F0F0F0]">
                  {title || "Заголовок"}
                </h2>
              </InlineEdit>
              <InlineEdit
                value={titleSecondary}
                onSave={(v) => onUpdate({ titleSecondary: v })}
                placeholder="Дополнительная часть (серая)"
              >
                <span className="h2 text-[#939393] block">
                  {titleSecondary || "доп. часть"}
                </span>
              </InlineEdit>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <div className="group/sub relative">
              <div className="absolute -right-1 -top-1 z-10 flex items-center gap-0.5 opacity-0 transition-opacity group-hover/sub:opacity-100">
                <button
                  type="button"
                  title="Капсом (label-18)"
                  onClick={() => onUpdate({ subtitleUppercase: !subtitleUppercase })}
                  className={`flex h-5 w-5 items-center justify-center rounded-sm transition-colors ${
                    subtitleUppercase
                      ? "bg-[#FFCC00] text-[#0A0A0A]"
                      : "bg-[#F0F0F0] text-[#0A0A0A] hover:bg-[#FFCC00]"
                  }`}
                >
                  <CaseUpper className="h-3 w-3" />
                </button>
              </div>
              <InlineEdit
                value={subtitle}
                onSave={(v) => onUpdate({ subtitle: v })}
                placeholder="Общий срок проекта: ~10 недель"
              >
                <MdText
                  value={subtitle}
                  placeholder="подзаголовок"
                  as="span"
                  className={subtitleUppercase ? subtitleUppercaseClass : subtitleNormalClass}
                />
              </InlineEdit>
            </div>

            <ParagraphsEditor
              paragraphs={paragraphs}
              onChange={setParagraphs}
              theme="dark"
              defaults={{ uppercase: false, color: "secondary" }}
            />
          </div>

          {/* Participants block — optional, toggle with eye icon */}
          <div className="relative mt-4 rounded bg-[#121212] p-8">
            {/* Toggle visibility */}
            <div className="absolute right-3 top-3">
              <Switch
                checked={showParticipants}
                onCheckedChange={(v) => onUpdate({ showParticipants: v })}
                size="sm"
              />
            </div>

            <div className={showParticipants ? "" : "opacity-30 pointer-events-none"}>
              <InlineEdit
                value={participantsTag}
                onSave={(v) => onUpdate({ participantsTag: v })}
                placeholder="кого важно включить"
              >
                <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#FFCC00]">
                  {participantsTag || "участники"}
                </span>
              </InlineEdit>

              <div className="mt-8 flex flex-col gap-5">
                {participants.map((p, index) => {
                  const { draggable, onDragStart, onDragOver, onDrop, onDragEnd, isDragging } =
                    partDnd.itemProps(index);

                  return (
                    <div
                      key={index}
                      draggable={draggable}
                      onDragStart={onDragStart}
                      onDragOver={onDragOver}
                      onDrop={onDrop}
                      onDragEnd={onDragEnd}
                      className={`group/part relative flex flex-col gap-2 transition-all ${
                        isDragging ? "opacity-60" : ""
                      }`}
                    >
                      {/* Controls — top right */}
                      <div className="absolute -right-1 -top-1 z-10 flex items-center gap-0.5 opacity-0 transition-opacity group-hover/part:opacity-100">
                        <div
                          className="flex h-5 w-5 cursor-grab items-center justify-center rounded-sm bg-[#F0F0F0] text-[#0A0A0A] select-none active:cursor-grabbing"
                          onMouseDown={() => partDnd.onGripDown(index)}
                          onMouseUp={partDnd.onGripUp}
                        >
                          <GripVertical className="h-2.5 w-2.5" />
                        </div>
                        <ItemMoveButtons index={index} count={participants.length} onMove={partDnd.move} />
                        <InlineConfirmDelete
                          onConfirm={() => removeParticipant(index)}
                          className="bg-[#F0F0F0] text-[#0A0A0A] hover:bg-[#ED4843] hover:text-[#F0F0F0]"
                        />
                      </div>

                      <InlineEdit
                        value={p.role}
                        onSave={(v) => updateParticipant(index, "role", v)}
                        placeholder="Роль"
                      >
                        <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-16)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#F0F0F0]">
                          {p.role || "Роль"}
                        </span>
                      </InlineEdit>

                      <InlineEdit
                        value={p.text}
                        onSave={(v) => updateParticipant(index, "text", v)}
                        placeholder="Описание"
                      >
                        <MdText
                          value={p.text}
                          placeholder="Описание"
                          as="span"
                          className="text-[length:var(--text-16)] leading-[1.28] text-[#939393]"
                        />
                      </InlineEdit>
                    </div>
                  );
                })}

                <button
                  onClick={addParticipant}
                  className="flex items-center justify-center gap-1 border border-dashed border-[#404040] py-3 text-[length:var(--text-12)] text-[#939393] transition-colors hover:border-[#FFCC00] hover:text-[#FFCC00]"
                >
                  <Plus className="h-3 w-3" />
                  Добавить участника
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: steps — 50% */}
        <div className="flex flex-col lg:w-1/2 lg:pt-10">
          {steps.map((step, index) => {
            const { draggable, onDragStart, onDragOver, onDrop, onDragEnd, isDragging } =
              stepsDnd.itemProps(index);
            const isLast = index === steps.length - 1;
            const isFirst = index === 0;

            return (
              <div
                key={index}
                draggable={draggable}
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                onDrop={onDrop}
                onDragEnd={onDragEnd}
                className={`group/step relative transition-all ${isDragging ? "opacity-60" : ""}`}
              >
                {/* Controls — top right */}
                <div className="absolute -right-1 -top-1 z-10 flex items-center gap-0.5 opacity-0 transition-opacity group-hover/step:opacity-100">
                  <div
                    className="flex h-5 w-5 cursor-grab items-center justify-center rounded-sm bg-[#F0F0F0] text-[#0A0A0A] select-none active:cursor-grabbing"
                    onMouseDown={() => stepsDnd.onGripDown(index)}
                    onMouseUp={stepsDnd.onGripUp}
                  >
                    <GripVertical className="h-2.5 w-2.5" />
                  </div>
                  <ItemMoveButtons index={index} count={steps.length} onMove={stepsDnd.move} />
                  <InlineConfirmDelete
                    onConfirm={() => removeStep(index)}
                    className="bg-[#F0F0F0] text-[#0A0A0A] hover:bg-[#ED4843] hover:text-[#F0F0F0]"
                  />
                </div>

                {isAcademy ? (
                  /* ── Academy variant: horizontal flat step ── */
                  <div
                    className={`flex flex-col gap-2 border-[#404040] py-8 lg:flex-row lg:items-center lg:gap-4 ${
                      isFirst ? "border-t border-b" : "border-b"
                    }`}
                  >
                    {/* Left: number + title */}
                    <div className="flex items-center gap-6 lg:w-1/2">
                      <InlineEdit
                        value={step.number}
                        onSave={(v) => updateStep(index, "number", v)}
                        placeholder="Модуль 1"
                      >
                        <span className="w-[100px] shrink-0 font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#FFCC00]">
                          {step.number || "—"}
                        </span>
                      </InlineEdit>

                      <InlineEdit
                        value={step.title}
                        onSave={(v) => updateStep(index, "title", v)}
                        placeholder="Название модуля"
                      >
                        <span className="h4 text-[#F0F0F0]">
                          {step.title || "Модуль"}
                        </span>
                      </InlineEdit>
                    </div>
                    {/* Right: description */}
                    <div className="lg:w-1/2">
                      <InlineEdit
                        value={step.text}
                        onSave={(v) => updateStep(index, "text", v)}
                        multiline
                        copy
                        placeholder="Описание модуля"
                      >
                        <MdText
                          value={step.text}
                          placeholder="Описание"
                          className="text-[length:var(--text-16)] leading-[1.28] text-[#939393]"
                        />
                      </InlineEdit>
                    </div>
                  </div>
                ) : (
                  /* ── Product variant: timeline step ── */
                  <div className="flex max-w-[364px] gap-10">
                    {/* Timeline column */}
                    <div className="relative flex w-4 shrink-0 flex-col items-center self-stretch">
                      <div className="h-[2px] w-px bg-[#404040]" />
                      <div className="h-4 w-4 shrink-0 border-2 border-[#F0F0F0] bg-[#F0F0F0]" />
                      {!isLast && (
                        <div className="w-px flex-1 bg-[#404040]" />
                      )}
                    </div>

                    {/* Step content */}
                    <div className="flex flex-col gap-3 pb-16">
                      <div className="flex flex-col gap-2">
                        <InlineEdit
                          value={step.number}
                          onSave={(v) => updateStep(index, "number", v)}
                          placeholder="01"
                        >
                          <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#F0F0F0]">
                            {step.number || "—"}
                          </span>
                        </InlineEdit>

                        <InlineEdit
                          value={step.title}
                          onSave={(v) => updateStep(index, "title", v)}
                          placeholder="Название этапа"
                        >
                          <h3 className="h3 text-[#F0F0F0]">
                            {step.title || "Этап"}
                          </h3>
                        </InlineEdit>
                      </div>

                      <InlineEdit
                        value={step.text}
                        onSave={(v) => updateStep(index, "text", v)}
                        multiline
                        copy
                        placeholder="Описание этапа"
                      >
                        <MdText
                          value={step.text}
                          placeholder="Описание"
                          className="text-[length:var(--text-16)] leading-[1.28] text-[#939393]"
                        />
                      </InlineEdit>

                      <InlineEdit
                        value={step.duration}
                        onSave={(v) => updateStep(index, "duration", v)}
                        placeholder="2 недели"
                      >
                        <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-14)] font-medium uppercase leading-[1.16] tracking-[0.02em] text-[#FFCC00]">
                          {step.duration || "срок"}
                        </span>
                      </InlineEdit>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Add step */}
          <button
            onClick={addStep}
            className="flex items-center justify-center gap-1 border border-dashed border-[#404040] py-6 text-[length:var(--text-14)] text-[#939393] transition-colors hover:border-[#FFCC00] hover:text-[#FFCC00]"
          >
            <Plus className="h-3.5 w-3.5" />
            Добавить этап
          </button>
        </div>
      </div>
    </div>
  );
}
