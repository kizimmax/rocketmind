"use client";

import { apiFetch } from "@/lib/api-client";
import { useRef, useEffect, useState } from "react";
import { GripVertical, ImagePlus, Upload, Trash2, Plus, Minus } from "lucide-react";
import { HeroExperts } from "@rocketmind/ui";
import { InlineEdit } from "@/components/inline-edit";
import { MdText } from "@/components/md-text";
import { useItemDnd } from "@/lib/use-item-dnd";

interface AboutHeroEditorProps {
  data: Record<string, unknown>;
  /** When true, the top-left slot shows an editable heading instead of a logo upload. */
  useHeading?: boolean;
  onUpdate: (data: Record<string, unknown>) => void;
}

type ResolvedExpert = { name: string; image: string | null };

export function AboutHeroEditor({ data, useHeading = false, onUpdate }: AboutHeroEditorProps) {
  const logoInputRef = useRef<HTMLInputElement>(null);

  const description = (data.description as string) || "";
  const heroLogoData = (data.heroLogoData as string) || "";
  const heading = (data.heading as string) || "";
  const maxExperts = typeof data.maxExperts === "number" ? data.maxExperts : null;

  // Factoids — always 4, pad if needed
  const rawFactoids = (data.factoids as Array<{ number: string; label: string; text: string }>) || [];
  const normalized = [...rawFactoids];
  while (normalized.length < 4) normalized.push({ number: "", label: "", text: "" });
  const displayFactoids = normalized.slice(0, 4);

  // Experts
  const expertSlugs = Array.isArray(data.experts) ? (data.experts as string[]) : [];
  const slugsKey = expertSlugs.join(",");
  const [resolvedExperts, setResolvedExperts] = useState<ResolvedExpert[]>([]);

  useEffect(() => {
    if (!slugsKey) return;
    let cancelled = false;
    apiFetch("/api/experts")
      .then((r) => r.json())
      .then((all: Array<{ slug: string; name: string; image: string | null }>) => {
        if (cancelled) return;
        const map = new Map(all.map((e) => [e.slug, e]));
        setResolvedExperts(
          expertSlugs
            .map((s) => map.get(s))
            .filter((e): e is { slug: string; name: string; image: string | null } => Boolean(e))
            .map((e) => ({ name: e.name, image: e.image }))
        );
      })
      .catch(() => {});
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slugsKey]);

  const totalExperts = resolvedExperts.length || expertSlugs.length;
  // null = no restriction (show all)
  const isRestricted = maxExperts !== null && maxExperts < totalExperts;
  const currentMax = isRestricted ? maxExperts! : totalExperts;
  const visibleExperts = resolvedExperts.slice(0, currentMax);

  function setMax(n: number) {
    if (n >= totalExperts) {
      onUpdate({ maxExperts: null }); // at max → no restriction
    } else {
      onUpdate({ maxExperts: Math.max(1, n) });
    }
  }

  const dnd = useItemDnd(displayFactoids, (reordered) => onUpdate({ factoids: reordered }));

  function updateFactoid(index: number, field: string, value: string) {
    const updated = displayFactoids.map((f, i) => (i === index ? { ...f, [field]: value } : f));
    onUpdate({ factoids: updated });
  }

  return (
    <div className="rounded-sm border-t border-[#404040] bg-[#0A0A0A] pb-20">
      <input
        ref={logoInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = () => onUpdate({ heroLogoData: reader.result as string });
          reader.readAsDataURL(file);
          e.target.value = "";
        }}
      />

      <div className="mx-auto max-w-[1512px] px-5 pt-16 pb-0 md:px-8 xl:px-14">

        {/* ── Row 1: Logo (left 50%) + Description (right 50%) ── */}
        <div className="flex flex-row gap-0 mb-16">
          <div className="w-1/2 pr-11">
            {useHeading ? (
              <InlineEdit
                value={heading}
                onSave={(v) => onUpdate({ heading: v })}
                placeholder="ЗАГОЛОВОК"
              >
                <h1 className="font-[family-name:var(--font-heading-family)] text-[52px] md:text-[64px] lg:text-[80px] font-bold uppercase leading-[1.08] tracking-[-0.02em] text-[#F0F0F0]">
                  {heading || "ЗАГОЛОВОК"}
                </h1>
              </InlineEdit>
            ) : heroLogoData ? (
              <div className="group/logo relative inline-block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={heroLogoData}
                  alt="Логотип"
                  className="h-auto w-full max-w-[482px] object-contain"
                />
                <div className="absolute left-0 top-0 flex items-center gap-1 opacity-0 transition-opacity group-hover/logo:opacity-100">
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    className="flex h-6 items-center gap-1 rounded-sm bg-[#1a1a1a]/80 px-1.5 text-[length:var(--text-10)] text-[#F0F0F0] backdrop-blur hover:bg-[#1a1a1a]"
                  >
                    <Upload className="h-3 w-3" />
                    Заменить
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdate({ heroLogoData: "" })}
                    className="flex h-6 w-6 items-center justify-center rounded-sm bg-[#1a1a1a]/80 text-[#F0F0F0] backdrop-blur hover:bg-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                className="flex h-[118px] w-full max-w-[482px] items-center justify-center gap-3 rounded-sm border border-dashed border-[#404040] text-[#939393] transition-colors hover:border-[#FFCC00] hover:text-[#FFCC00]"
              >
                <ImagePlus className="h-6 w-6 shrink-0" />
                <div className="flex flex-col items-start gap-0.5">
                  <span className="text-[length:var(--text-14)]">Загрузить логотип</span>
                  <span className="text-[length:var(--text-11)] opacity-60">используется дефолтный SVG</span>
                </div>
              </button>
            )}
          </div>

          <div className="flex w-1/2 items-start">
            <InlineEdit
              value={description}
              onSave={(v) => onUpdate({ description: v })}
              multiline
              copy
              placeholder="Описание компании..."
            >
              <MdText
                value={description}
                placeholder="Описание компании"
                className="text-[length:var(--text-18)] leading-[1.3] text-[#F0F0F0]"
              />
            </InlineEdit>
          </div>
        </div>

        {/* ── Row 2: Experts strip ── */}
        {expertSlugs.length > 0 && (
          <div className="mb-10 flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#939393]">
                Команда экспертов
              </span>

              {/* Max experts counter */}
              <div className="flex items-center gap-1 rounded-sm border border-[#404040] bg-[#121212] px-2 py-1">
                <button
                  type="button"
                  onClick={() => setMax(currentMax - 1)}
                  disabled={currentMax <= 1}
                  className="flex h-5 w-5 items-center justify-center text-[#939393] transition-colors hover:text-[#F0F0F0] disabled:opacity-30"
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="min-w-[40px] text-center font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] text-[#F0F0F0]">
                  {isRestricted ? `${currentMax} / ${totalExperts}` : "все"}
                </span>
                <button
                  type="button"
                  onClick={() => setMax(currentMax + 1)}
                  disabled={currentMax >= totalExperts}
                  className="flex h-5 w-5 items-center justify-center text-[#939393] transition-colors hover:text-[#F0F0F0] disabled:opacity-30"
                >
                  <Plus className="h-3 w-3" />
                </button>
                {isRestricted && (
                  <button
                    type="button"
                    onClick={() => onUpdate({ maxExperts: null })}
                    className="ml-1 text-[length:var(--text-11)] text-[#FFCC00] hover:underline"
                  >
                    все
                  </button>
                )}
              </div>
            </div>

            {resolvedExperts.length > 0 ? (
              <HeroExperts experts={visibleExperts} />
            ) : (
              <div className="flex h-10 items-center text-[length:var(--text-12)] text-[#5C5C5C]">
                Загрузка экспертов…
              </div>
            )}
          </div>
        )}

        {/* ── Row 3: Factoids — 4 in a single row ── */}
        <div className="grid grid-cols-4 border-t border-l border-[#404040]">
          {displayFactoids.map((factoid, index) => {
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
                className={`group/fact relative flex min-h-[112px] items-center gap-5 overflow-hidden border-b border-r border-[#404040] p-5 transition-all md:p-7 ${
                  isDragging ? "opacity-60" : ""
                }`}
              >
                {/* Drag handle */}
                <div className="absolute -right-1 -top-1 z-10 flex items-center gap-0.5 opacity-0 transition-opacity group-hover/fact:opacity-100">
                  <div
                    className="flex h-5 w-5 cursor-grab items-center justify-center rounded-sm bg-[#F0F0F0] text-[#0A0A0A] select-none active:cursor-grabbing"
                    onMouseDown={() => dnd.onGripDown(index)}
                    onMouseUp={dnd.onGripUp}
                  >
                    <GripVertical className="h-2.5 w-2.5" />
                  </div>
                </div>

                <InlineEdit
                  value={factoid.number}
                  onSave={(v) => updateFactoid(index, "number", v)}
                  placeholder="120+"
                >
                  <span className="shrink-0 font-[family-name:var(--font-heading-family)] text-[length:var(--text-52)] font-bold uppercase leading-[1.08] tracking-[-0.02em] text-[#F0F0F0]">
                    {factoid.number || "—"}
                  </span>
                </InlineEdit>

                <InlineEdit
                  value={factoid.label}
                  onSave={(v) => updateFactoid(index, "label", v)}
                  placeholder="проектов"
                >
                  <span className="min-w-0 font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#F0F0F0]">
                    {factoid.label || "подпись"}
                  </span>
                </InlineEdit>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
