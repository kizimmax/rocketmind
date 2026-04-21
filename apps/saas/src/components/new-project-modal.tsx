"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Upload, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
} from "@rocketmind/ui";
import type { ProjectStage, ReadyArtifact } from "@/lib/types";

const STAGE_OPTIONS: { value: ProjectStage; label: string }[] = [
  { value: "idea", label: "Идея" },
  { value: "mvp", label: "MVP" },
  { value: "seed", label: "Seed" },
  { value: "early", label: "Early Stage" },
  { value: "growth", label: "Growth" },
];

const READINESS_OPTIONS: { value: ReadyArtifact; label: string }[] = [
  { value: "market", label: "Маркет-анализ" },
  { value: "ua_segments", label: "Сегментация ЦА / ICP" },
  { value: "synth", label: "Проверенные гипотезы" },
  { value: "biz_model", label: "Бизнес-модель / unit-эконом." },
  { value: "mvp_plan", label: "MVP-план" },
  { value: "pitch", label: "Питч-дек" },
];

interface NewProjectModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function NewProjectModal({ open, onOpenChange }: NewProjectModalProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [stage, setStage] = useState<ProjectStage | null>(null);
  const [readiness, setReadiness] = useState<ReadyArtifact[]>([]);
  const [files, setFiles] = useState<string[]>([]);

  function toggleReadiness(item: ReadyArtifact) {
    setReadiness((prev) =>
      prev.includes(item) ? prev.filter((r) => r !== item) : [...prev, item]
    );
  }

  function onFilesPicked(e: React.ChangeEvent<HTMLInputElement>) {
    const list = e.target.files;
    if (!list) return;
    const names = Array.from(list).map((f) => f.name);
    setFiles((prev) => [...prev, ...names]);
    // Сбрасываем input, чтобы можно было выбрать тот же файл снова при необходимости
    e.target.value = "";
  }

  function removeFile(idx: number) {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  }

  function handleSubmit() {
    // Собираем prefill и уходим в R-менеджер
    const prefill = {
      name: name.trim() || undefined,
      stage: stage ?? undefined,
      readiness: readiness.length > 0 ? readiness : undefined,
      files: files.length > 0 ? files : undefined,
    };
    const encoded = encodeURIComponent(JSON.stringify(prefill));
    onOpenChange(false);
    router.push(`/manager?prefill=${encoded}`);
  }

  function handleCancel() {
    onOpenChange(false);
    // Сбрасываем форму
    setName("");
    setStage(null);
    setReadiness([]);
    setFiles([]);
  }

  const isValid = name.trim().length > 0 && stage !== null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Быстрый путь — новый проект</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-5 pt-2">
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">
              Название
            </label>
            <Input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Например: AI-ассистент для ритейла"
            />
          </div>

          {/* Stage */}
          <div className="flex flex-col gap-1.5">
            <label className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">
              Стадия
            </label>
            <div className="flex flex-wrap gap-1.5">
              {STAGE_OPTIONS.map((opt) => {
                const isOn = stage === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setStage(opt.value)}
                    className={`rounded-full border px-3 py-1 text-[length:var(--text-12)] transition-colors ${
                      isOn
                        ? "border-[var(--rm-yellow-100)] bg-background text-foreground"
                        : "border-border bg-background text-muted-foreground hover:border-foreground hover:text-foreground"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Readiness */}
          <div className="flex flex-col gap-1.5">
            <label className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">
              Что уже готово (опционально)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {READINESS_OPTIONS.map((opt) => {
                const isOn = readiness.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => toggleReadiness(opt.value)}
                    className={`rounded-full border px-3 py-1 text-[length:var(--text-12)] transition-colors ${
                      isOn
                        ? "border-[var(--rm-yellow-100)] bg-background text-foreground"
                        : "border-border bg-background text-muted-foreground hover:border-foreground hover:text-foreground"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Files (placeholder) */}
          <div className="flex flex-col gap-1.5">
            <label className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">
              Файлы (опционально)
            </label>
            <label className="flex cursor-pointer items-center gap-2 rounded-sm border border-dashed border-border bg-background/50 px-3.5 py-3 text-muted-foreground transition-colors hover:border-foreground hover:text-foreground">
              <Upload className="h-4 w-4" />
              <span className="text-[length:var(--text-14)]">
                Прикрепить документы (PDF, DOCX, MD)
              </span>
              <input
                type="file"
                multiple
                className="hidden"
                onChange={onFilesPicked}
              />
            </label>
            {files.length > 0 && (
              <ul className="flex flex-col gap-1">
                {files.map((f, i) => (
                  <li
                    key={`${f}-${i}`}
                    className="flex items-center gap-2 rounded-sm bg-rm-gray-1 px-2 py-1 text-[length:var(--text-12)]"
                  >
                    <span className="flex-1 truncate">{f}</span>
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="shrink-0 rounded-sm p-0.5 text-muted-foreground hover:bg-rm-gray-2 hover:text-foreground transition-colors"
                      aria-label={`Убрать ${f}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 rounded-sm border border-border py-2 text-[length:var(--text-14)] text-muted-foreground transition-colors hover:bg-rm-gray-1 hover:text-foreground"
            >
              Отмена
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isValid}
              className="flex flex-1 items-center justify-center gap-2 rounded-sm bg-foreground py-2 text-[length:var(--text-14)] font-medium text-background transition-opacity hover:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Plus className="h-3.5 w-3.5" />К R-менеджеру →
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
