"use client";

import { useRef } from "react";
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
  canvasTitle: "Цифровые платформы\nи экосистемы",
  canvasText: "Развиваем и используем международную методологию Platform Innovation Kit, представляем её в России и странах Азии, помогая компаниям проектировать платформенные модели, находить новые точки роста и выстраивать более сильную архитектуру бизнеса.",
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
  const canvasTitle = (data.canvasTitle as string) || DEFAULTS.canvasTitle;
  const canvasText = (data.canvasText as string) || DEFAULTS.canvasText;
  const features = (data.features as Array<{ title: string; text: string }>) || DEFAULTS.features;
  const leftVariant = (data.leftVariant as string) || "alex";
  const isCanvas = leftVariant === "canvas";
  const alexPhotoData = (data.alexPhotoData as string) || "";
  const canvasPhotoData = (data.canvasPhotoData as string) || "";

  const photoSrc = isCanvas
    ? (canvasPhotoData || "/images/about/canvas-image.png")
    : (alexPhotoData || "/images/about/alexey-eremin.png");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  function updateFeature(index: number, field: string, value: string) {
    const updated = features.map((f, i) =>
      i === index ? { ...f, [field]: value } : f
    );
    onUpdate({ features: updated });
  }

  function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      onUpdate(isCanvas ? { canvasPhotoData: result } : { alexPhotoData: result });
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Controls bar */}
      <div className="flex items-center gap-6">
        <div className="rounded border border-[#FFCC00]/30 bg-[#FFCC00]/5 px-3 py-2 text-[12px] leading-snug text-foreground/80 flex-1">
          <strong className="text-[#FFCC00]">⚠</strong> Редактирование этого блока применяется <strong>ко всем страницам сайта</strong>, где он отображается.
        </div>
        <div className="flex items-center gap-4 shrink-0">
          {/* Left variant switch */}
          <div className="flex items-center gap-2">
            <Switch
              checked={isCanvas}
              onCheckedChange={(v) => onUpdate({ leftVariant: v ? "canvas" : "alex" })}
              size="sm"
            />
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {isCanvas ? "Канвас" : "Алекс"}
            </span>
          </div>
        </div>
      </div>

      {/* ── Preview — same sizes as site desktop layout ── */}
      <div className="rounded-lg overflow-hidden bg-[#0A0A0A]">
        <div className="flex border border-[#404040]">
          {/* ─── Left half: photo + text ─── */}
          <div className="w-1/2 shrink-0 border-r border-[#404040] p-8">
            <div className="flex gap-8 h-full">
              {/* Photo */}
              <div className="group/photo relative w-1/2 shrink-0 self-stretch rounded overflow-hidden bg-[#1a1a1a]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photoSrc}
                  alt=""
                  className="w-full h-full object-cover object-top"
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover/photo:opacity-100 transition-opacity text-[12px] uppercase tracking-wide text-[#F0F0F0]"
                >
                  Загрузить {isCanvas ? "канвас" : "фото"}
                </button>
              </div>

              {/* Text column */}
              <div className="flex flex-col justify-between flex-1">
                {/* Top: logo + heading */}
                <div className="flex flex-col gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/about/rocketmind-logo-dark.svg"
                    alt="Rocketmind"
                    className="h-[52px] w-auto self-start"
                  />
                  <InlineEdit value={heading} onSave={(v) => onUpdate({ heading: v })} placeholder="Заголовок" multiline>
                    <h2 className="font-[family-name:var(--font-heading-family)] text-[32px] font-bold uppercase leading-[1.12] tracking-[-0.01em] text-[#5C5C5C] whitespace-pre-line">
                      {heading}
                    </h2>
                  </InlineEdit>
                </div>

                {/* Bottom: variant-dependent text */}
                {isCanvas ? (
                  <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                      <InlineEdit value={canvasTitle} onSave={(v) => onUpdate({ canvasTitle: v })} placeholder="Заголовок" multiline>
                        <span className="font-[family-name:var(--font-heading-family)] text-[24px] font-bold uppercase leading-[1.2] tracking-[-0.01em] text-[#F0F0F0] whitespace-pre-line">
                          {canvasTitle}
                        </span>
                      </InlineEdit>
                      <InlineEdit value={canvasText} onSave={(v) => onUpdate({ canvasText: v })} placeholder="Описание" multiline>
                        <p className="text-[14px] leading-[1.28] text-[#F0F0F0]">{canvasText}</p>
                      </InlineEdit>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-2">
                      <InlineEdit value={founderName} onSave={(v) => onUpdate({ founderName: v })} placeholder="Имя">
                        <span className="font-[family-name:var(--font-heading-family)] text-[24px] font-bold uppercase leading-[1.2] tracking-[-0.01em] text-[#F0F0F0]">
                          {founderName}
                        </span>
                      </InlineEdit>
                      <InlineEdit value={founderBio} onSave={(v) => onUpdate({ founderBio: v })} placeholder="Подпись" multiline>
                        <p className="text-[14px] leading-[1.28] text-[#F0F0F0]">{founderBio}</p>
                      </InlineEdit>
                    </div>
                    <InlineEdit value={founderRole} onSave={(v) => onUpdate({ founderRole: v })} placeholder="Роль" multiline>
                      <p className="text-[14px] leading-[1.28] text-[#939393]">{founderRole}</p>
                    </InlineEdit>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ─── Right half: feature cards ─── */}
          <div className="w-1/2 flex flex-col">
            {/* AI Agents card */}
            <div className="flex-1 flex flex-col justify-between gap-4 border-b border-[#404040] p-8">
              <div className="flex justify-between gap-8">
                <div className="shrink-0">
                  <InlineEdit value={features[0].title} onSave={(v) => updateFeature(0, "title", v)} placeholder="Заголовок">
                    <h3 className="font-[family-name:var(--font-heading-family)] text-[24px] font-bold uppercase leading-[1.2] tracking-[-0.01em] text-[#F0F0F0]">
                      {features[0].title}
                    </h3>
                  </InlineEdit>
                </div>
                <InlineEdit value={features[0].text} onSave={(v) => updateFeature(0, "text", v)} placeholder="Описание" multiline>
                  <p className="text-[14px] leading-[1.28] text-[#939393]">{features[0].text}</p>
                </InlineEdit>
              </div>
              {/* MascotCarousel placeholder */}
              <div className="flex items-center gap-2 rounded-lg border border-[#404040] bg-[#121212] px-4 py-3">
                <div className="w-10 h-10 rounded bg-[#1a1a1a] flex items-center justify-center text-[14px]">🤖</div>
                <span className="text-[14px] text-[#939393] italic">Карусель AI-агентов</span>
                <div className="ml-auto w-8 h-8 rounded bg-[#FFCC00] flex items-center justify-center text-[14px]">↑</div>
              </div>
            </div>

            {/* Bottom row — 2 cards */}
            <div className="flex">
              <div className="w-1/2 flex flex-col gap-2 border-r border-[#404040] p-8">
                <InlineEdit value={features[1].title} onSave={(v) => updateFeature(1, "title", v)} placeholder="Заголовок">
                  <h3 className="font-[family-name:var(--font-heading-family)] text-[24px] font-bold uppercase leading-[1.2] tracking-[-0.01em] text-[#F0F0F0]">
                    {features[1].title}
                  </h3>
                </InlineEdit>
                <InlineEdit value={features[1].text} onSave={(v) => updateFeature(1, "text", v)} placeholder="Описание" multiline>
                  <p className="text-[14px] leading-[1.28] text-[#939393]">{features[1].text}</p>
                </InlineEdit>
              </div>
              <div className="w-1/2 flex flex-col gap-2 p-8">
                <InlineEdit value={features[2].title} onSave={(v) => updateFeature(2, "title", v)} placeholder="Заголовок">
                  <h3 className="font-[family-name:var(--font-heading-family)] text-[24px] font-bold uppercase leading-[1.2] tracking-[-0.01em] text-[#F0F0F0]">
                    {features[2].title}
                  </h3>
                </InlineEdit>
                <InlineEdit value={features[2].text} onSave={(v) => updateFeature(2, "text", v)} placeholder="Описание" multiline>
                  <p className="text-[14px] leading-[1.28] text-[#939393]">{features[2].text}</p>
                </InlineEdit>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
