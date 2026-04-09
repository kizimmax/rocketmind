"use client";

import { Switch } from "@rocketmind/ui";
import { InlineEdit } from "@/components/inline-edit";

interface AboutRocketmindEditorProps {
  data: Record<string, unknown>;
  onUpdate: (data: Record<string, unknown>) => void;
}

const DEFAULTS = {
  tag: "О Rocketmind",
  title: "СОЗДАЁМ БУДУЩЕЕ БИЗНЕСА С ПОМОЩЬЮ\nБИЗНЕС-ДИЗАЙНА И ИИ",
  description:
    "Rocketmind — платформа, где бизнес-дизайн и искусственный интеллект работают вместе. Мы помогаем компаниям находить новые точки роста, проектировать платформенные модели и выстраивать стратегию развития с опорой на данные и экспертный опыт.",
};

export function AboutRocketmindEditor({ data, onUpdate }: AboutRocketmindEditorProps) {
  const tag = (data.tag as string) || DEFAULTS.tag;
  const title = (data.title as string) || DEFAULTS.title;
  const description = (data.description as string) || DEFAULTS.description;
  const variant = (data.variant as string) || "dark";
  const isDark = variant === "dark";

  return (
    <div className="flex flex-col gap-6">
      {/* Note about global text */}
      <div className="rounded border border-rm-yellow/30 bg-rm-yellow/5 px-4 py-3 text-[13px] leading-relaxed text-foreground/80">
        <strong className="text-rm-yellow">⚠ Общий текст:</strong> изменения текстовых полей в этом блоке
        применяются <strong>ко всем страницам</strong>. Переключатель вида влияет только на текущую страницу.
      </div>

      {/* Variant switch */}
      <div className="flex items-center gap-3">
        <Switch
          checked={isDark}
          onCheckedChange={(v) => onUpdate({ variant: v ? "dark" : "light" })}
          size="sm"
        />
        <span className="text-sm text-muted-foreground">
          {isDark ? "Тёмный фон" : "Светлый фон"}
        </span>
      </div>

      {/* Tag */}
      <InlineEdit value={tag} onSave={(v) => onUpdate({ tag: v })} placeholder="тег">
        <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#FFCC00]">
          {tag || "тег"}
        </span>
      </InlineEdit>

      {/* Title */}
      <InlineEdit value={title} onSave={(v) => onUpdate({ title: v })} placeholder="Заголовок" multiline>
        <h2 className="h3 text-[#F0F0F0] whitespace-pre-line">
          {title || "Заголовок"}
        </h2>
      </InlineEdit>

      {/* Description */}
      <InlineEdit value={description} onSave={(v) => onUpdate({ description: v })} placeholder="Описание" multiline>
        <p className="text-[length:var(--text-16)] leading-[1.28] text-[#939393]">
          {description || "Описание компании"}
        </p>
      </InlineEdit>
    </div>
  );
}
