"use client";

import { Switch } from "@rocketmind/ui";
import { InlineEdit } from "@/components/inline-edit";

interface AboutRocketmindEditorProps {
  data: Record<string, unknown>;
  onUpdate: (data: Record<string, unknown>) => void;
}

const DEFAULTS = {
  heading: "От идеи\nдо бизнес-модели",
  founderName: "Алексей Еремин",
  founderBio: "Мы не просто консультируем, мы строим работающие сетевые структуры",
  founderRole: "Основатель Rocketmind, эксперт по экосистемной архитектуре и стратег цифровой трансформации.",
  features: [
    { title: "Доступ к ИИ-агентам", text: "Встроенные интеллектуальные ассистенты, которые усиливают командную работу. Работают внутри каждого продукта Rocketmind." },
    { title: "Более 20 лет в IT", text: "Мы создавали онлайн-продукты, сервисы и платформы, выступали с лекциями для научного и бизнес-сообщества в России и за рубежом." },
    { title: "Экспертная команда", text: "Над исследованиями работают аналитики и маркетологи, команда редакторов делает материалы простыми для восприятия." },
  ],
};

export function AboutRocketmindEditor({ data, onUpdate }: AboutRocketmindEditorProps) {
  const heading = (data.heading as string) || DEFAULTS.heading;
  const founderName = (data.founderName as string) || DEFAULTS.founderName;
  const founderBio = (data.founderBio as string) || DEFAULTS.founderBio;
  const founderRole = (data.founderRole as string) || DEFAULTS.founderRole;
  const features = (data.features as Array<{ title: string; text: string }>) || DEFAULTS.features;
  const variant = (data.variant as string) || "dark";
  const isDark = variant === "dark";

  function updateFeature(index: number, field: string, value: string) {
    const updated = features.map((f, i) =>
      i === index ? { ...f, [field]: value } : f
    );
    onUpdate({ features: updated });
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Controls bar */}
      <div className="flex items-center gap-6">
        <div className="rounded border border-[#FFCC00]/30 bg-[#FFCC00]/5 px-3 py-2 text-[12px] leading-snug text-foreground/80 flex-1">
          <strong className="text-[#FFCC00]">⚠</strong> Текст применяется <strong>ко всем страницам</strong>. Переключатель — только к текущей.
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Switch
            checked={isDark}
            onCheckedChange={(v) => onUpdate({ variant: v ? "dark" : "light" })}
            size="sm"
          />
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {isDark ? "Тёмный" : "Светлый"}
          </span>
        </div>
      </div>

      {/* ── Preview matching site desktop layout ── */}
      <div className="rounded-lg overflow-hidden bg-[#0A0A0A]">
        <div className="flex border border-[#404040]">
          {/* ─── Left half: photo + text side by side ─── */}
          <div className="w-1/2 shrink-0 border-r border-[#404040] p-5">
            <div className="flex gap-5 h-full">
              {/* Photo */}
              <div className="w-1/2 shrink-0 self-stretch rounded overflow-hidden bg-[#1a1a1a]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/about/alexey-eremin.png"
                  alt=""
                  className="w-full h-full object-cover object-top"
                />
              </div>

              {/* Text column: logo+heading top, founder bottom */}
              <div className="flex flex-col justify-between flex-1 min-h-[240px]">
                {/* Top: logo + heading */}
                <div className="flex flex-col gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/about/rocketmind-logo-dark.svg"
                    alt="Rocketmind"
                    className="h-[28px] w-auto self-start"
                  />
                  <InlineEdit value={heading} onSave={(v) => onUpdate({ heading: v })} placeholder="Заголовок" multiline>
                    <h2 className="font-[family-name:var(--font-heading-family)] text-[18px] font-bold uppercase leading-[1.12] tracking-[-0.01em] text-[#5C5C5C] whitespace-pre-line">
                      {heading}
                    </h2>
                  </InlineEdit>
                </div>

                {/* Bottom: founder info */}
                <div className="flex flex-col gap-1">
                  <InlineEdit value={founderName} onSave={(v) => onUpdate({ founderName: v })} placeholder="Имя">
                    <span className="font-[family-name:var(--font-heading-family)] text-[14px] font-bold uppercase leading-[1.2] tracking-[-0.01em] text-[#F0F0F0]">
                      {founderName}
                    </span>
                  </InlineEdit>
                  <InlineEdit value={founderBio} onSave={(v) => onUpdate({ founderBio: v })} placeholder="Подпись" multiline>
                    <p className="text-[11px] leading-[1.3] text-[#F0F0F0]">{founderBio}</p>
                  </InlineEdit>
                  <InlineEdit value={founderRole} onSave={(v) => onUpdate({ founderRole: v })} placeholder="Роль" multiline>
                    <p className="text-[11px] leading-[1.3] text-[#939393]">{founderRole}</p>
                  </InlineEdit>
                </div>
              </div>
            </div>
          </div>

          {/* ─── Right half: feature cards ─── */}
          <div className="w-1/2 flex flex-col">
            {/* AI Agents card — top */}
            <div className="flex-1 flex flex-col gap-3 border-b border-[#404040] p-5">
              <div className="flex gap-4">
                <InlineEdit value={features[0].title} onSave={(v) => updateFeature(0, "title", v)} placeholder="Заголовок">
                  <h3 className="font-[family-name:var(--font-heading-family)] text-[14px] font-bold uppercase leading-[1.2] tracking-[-0.01em] text-[#F0F0F0] shrink-0">
                    {features[0].title}
                  </h3>
                </InlineEdit>
                <InlineEdit value={features[0].text} onSave={(v) => updateFeature(0, "text", v)} placeholder="Описание" multiline>
                  <p className="text-[11px] leading-[1.3] text-[#939393]">{features[0].text}</p>
                </InlineEdit>
              </div>
              {/* MascotCarousel placeholder */}
              <div className="flex items-center gap-2 rounded-md border border-[#404040] bg-[#121212] px-3 py-2">
                <div className="w-8 h-8 rounded bg-[#1a1a1a] flex items-center justify-center text-[10px]">🤖</div>
                <span className="text-[10px] text-[#939393] italic">Карусель AI-агентов</span>
                <div className="ml-auto w-6 h-6 rounded bg-[#FFCC00] flex items-center justify-center text-[10px]">↑</div>
              </div>
            </div>

            {/* Bottom row — 2 cards */}
            <div className="flex">
              <div className="w-1/2 flex flex-col gap-1 border-r border-[#404040] p-5">
                <InlineEdit value={features[1].title} onSave={(v) => updateFeature(1, "title", v)} placeholder="Заголовок">
                  <h3 className="font-[family-name:var(--font-heading-family)] text-[14px] font-bold uppercase leading-[1.2] tracking-[-0.01em] text-[#F0F0F0]">
                    {features[1].title}
                  </h3>
                </InlineEdit>
                <InlineEdit value={features[1].text} onSave={(v) => updateFeature(1, "text", v)} placeholder="Описание" multiline>
                  <p className="text-[11px] leading-[1.3] text-[#939393]">{features[1].text}</p>
                </InlineEdit>
              </div>
              <div className="w-1/2 flex flex-col gap-1 p-5">
                <InlineEdit value={features[2].title} onSave={(v) => updateFeature(2, "title", v)} placeholder="Заголовок">
                  <h3 className="font-[family-name:var(--font-heading-family)] text-[14px] font-bold uppercase leading-[1.2] tracking-[-0.01em] text-[#F0F0F0]">
                    {features[2].title}
                  </h3>
                </InlineEdit>
                <InlineEdit value={features[2].text} onSave={(v) => updateFeature(2, "text", v)} placeholder="Описание" multiline>
                  <p className="text-[11px] leading-[1.3] text-[#939393]">{features[2].text}</p>
                </InlineEdit>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
