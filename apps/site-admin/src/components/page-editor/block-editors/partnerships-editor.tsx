"use client";

import { useRef } from "react";
import { Upload, ImagePlus } from "lucide-react";
import { InlineEdit } from "@/components/inline-edit";
import {
  ParagraphsEditor,
  resolveParagraphs,
  type StyledParagraph,
} from "@/components/paragraphs-editor";

interface PartnershipsEditorProps {
  data: Record<string, unknown>;
  onUpdate: (data: Record<string, unknown>) => void;
}

type Logo = { src: string; alt: string };
type Photo = { src: string; alt?: string };

export function PartnershipsEditor({ data, onUpdate }: PartnershipsEditorProps) {
  const photoInputRefs = useRef<(HTMLInputElement | null)[]>([null, null, null, null]);

  const caption = (data.caption as string) || "Партнёрства";
  const title = (data.title as string) || "Программы с ведущими бизнес-школами";
  const paragraphs = resolveParagraphs(
    data.paragraphs,
    (data.description as string) || "Помогают собрать карту участников, связей и ценностных потоков",
    { uppercase: false, color: "secondary" },
  );
  const logos = (data.logos as Logo[]) || [];
  const photos = (data.photos as Photo[]) || [];

  function setParagraphs(next: StyledParagraph[]) {
    onUpdate({ paragraphs: next, description: undefined });
  }

  // Ensure 4 photo slots
  const photoSlots: (Photo | null)[] = [
    photos[0] || null,
    photos[1] || null,
    photos[2] || null,
    photos[3] || null,
  ];

  function handlePhotoUpload(index: number, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const src = reader.result as string;
      const updated = [...photoSlots.map((p) => p || { src: "", alt: "" })];
      updated[index] = { src, alt: "" };
      onUpdate({ photos: updated.filter((p) => p.src) });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  return (
    <div className="rounded-sm bg-[#0A0A0A] px-5 py-10 md:px-8 xl:px-14">
      {/* Shared badge */}
      <div className="mb-8 flex items-center gap-2">
        <span className="rounded-sm bg-[var(--rm-yellow-100)]/10 px-2 py-0.5 text-[length:var(--text-10)] font-medium text-[var(--rm-yellow-100)]">
          Общий блок
        </span>
        <span className="text-[length:var(--text-10)] text-[#939393]">
          Изменения синхронизируются на все страницы
        </span>
      </div>

      {/* ── Design-faithful layout ── */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-10">
        {/* Left: text content */}
        <div className="flex flex-col gap-8 lg:max-w-[560px]">
          {/* Caption + Title + Description — inline editable */}
          <div className="flex flex-col gap-2">
            <InlineEdit
              value={caption}
              onSave={(v) => onUpdate({ caption: v })}
              placeholder="Партнёрства"
            >
              <span className="font-[family-name:var(--font-mono-family)] text-[18px] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#FFCC00]">
                {caption}
              </span>
            </InlineEdit>

            <div className="flex flex-col gap-6">
              <InlineEdit
                value={title}
                onSave={(v) => onUpdate({ title: v })}
                multiline
                placeholder="Заголовок блока"
              >
                <h3 className="font-[family-name:var(--font-heading-family)] text-[28px] md:text-[36px] lg:text-[52px] font-bold uppercase leading-[1.08] tracking-[-0.02em] text-[#F0F0F0]">
                  {title}
                </h3>
              </InlineEdit>

              <ParagraphsEditor
                paragraphs={paragraphs}
                onChange={setParagraphs}
                theme="dark"
                defaults={{ uppercase: false, color: "secondary" }}
                size="16"
              />
            </div>
          </div>

          {/* Partner logos — static display */}
          {logos.length > 0 && (
            <div className="flex items-center gap-8">
              {logos.map((logo, i) => (
                <img
                  key={i}
                  src={logo.src}
                  alt={logo.alt}
                  className="h-auto w-auto max-h-[56px] max-w-[45%] object-contain"
                />
              ))}
            </div>
          )}
        </div>

        {/* Right: 2×2 photo grid — replaceable on hover */}
        <div className="grid grid-cols-2 gap-4 lg:w-[696px] shrink-0">
          {photoSlots.map((photo, i) => (
            <div key={i} className="group/photo relative aspect-[340/252] overflow-hidden">
              {photo?.src ? (
                <>
                  <img
                    src={photo.src}
                    alt={photo.alt || ""}
                    className="h-full w-full object-cover"
                  />
                  {/* Replace overlay on hover */}
                  <button
                    type="button"
                    onClick={() => photoInputRefs.current[i]?.click()}
                    className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover/photo:opacity-100"
                  >
                    <div className="flex items-center gap-1.5 rounded-sm bg-[#1a1a1a]/90 px-3 py-1.5 text-[#F0F0F0] backdrop-blur">
                      <Upload className="h-3.5 w-3.5" />
                      <span className="text-[length:var(--text-12)]">Заменить</span>
                    </div>
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => photoInputRefs.current[i]?.click()}
                  className="flex h-full w-full items-center justify-center border border-dashed border-[#404040] text-[#939393] transition-colors hover:border-[#FFCC00] hover:text-[#FFCC00]"
                >
                  <div className="flex flex-col items-center gap-1">
                    <ImagePlus className="h-5 w-5" />
                    <span className="text-[length:var(--text-10)]">Фото</span>
                  </div>
                </button>
              )}
              <input
                ref={(el) => { photoInputRefs.current[i] = el; }}
                type="file"
                accept="image/*"
                onChange={(e) => handlePhotoUpload(i, e)}
                className="hidden"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
