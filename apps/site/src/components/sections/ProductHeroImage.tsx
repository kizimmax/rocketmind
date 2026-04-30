"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  StyledParagraphs,
  resolveStyledParagraphs,
  useFormModal,
  type StyledParagraph,
} from "@rocketmind/ui";
import type { Factoid, HeroTag } from "@/lib/products";

/** Renders next/image for file paths, plain <img> for data URLs */
function HeroImage({ src, className, priority }: { src: string; className?: string; priority?: boolean }) {
  if (src.startsWith("data:")) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt="" className={`absolute inset-0 w-full h-full object-cover ${className ?? ""}`} />;
  }
  return <Image src={src} alt="" fill className={className ?? "object-cover"} priority={priority} />;
}

// ── Types ──────────────────────────────────────────────────────────────────────

type ProductHeroImageProps = {
  caption: string;
  title: string;
  titleSecondary?: string;
  /** Legacy single-string description. Prefer `paragraphs`. */
  description: string;
  /** Structured paragraphs with per-paragraph caps + color. */
  paragraphs?: StyledParagraph[];
  ctaText: string;
  factoids: Factoid[];
  coverImage: string | null;
  tags?: HeroTag[];
  secondaryCta?: string;
  audioSrc?: string;
  /** ID формы для CTA-кнопки. Без него кнопка остаётся «мёртвой». */
  formId?: string | null;
  availableChips?: string[];
  chipsConfig?: { multi?: boolean; label?: string };
};

// ── Factoid Card ───────────────────────────────────────────────────────────────

function FactoidCard({
  number,
  label,
  text,
  className,
}: Factoid & { className?: string }) {
  return (
    <div className={`flex flex-col p-5 md:p-7 min-w-0 ${className ?? ""}`}>
      <div className="flex flex-col justify-between gap-4 h-full">
        <div className="flex items-center gap-5">
          <span className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-52)] font-bold uppercase leading-[1.08] tracking-[-0.02em] text-[#F0F0F0] shrink-0">
            {number}
          </span>
          <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-18)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#F0F0F0] max-w-[148px]">
            {label}
          </span>
        </div>
        <p className="text-[length:var(--text-16)] leading-[1.28] text-[#939393] w-0 min-w-full">
          {text}
        </p>
      </div>
    </div>
  );
}

// ── CTA Button ─────────────────────────────────────────────────────────────────

function HeroCTA({ text, onClick }: { text: string; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col justify-between w-full h-full bg-[#FFCC00] p-5 md:p-7 cursor-pointer transition-colors duration-200 hover:bg-[#FFE040]"
    >
      <div className="flex justify-end w-full">
        <div className="transition-transform duration-200 group-hover:-translate-y-1 group-hover:translate-x-1">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path
              d="M8 8H24M24 8V24M24 8L8 24"
              stroke="#0A0A0A"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      <span className="h4 md:h3 text-[#0A0A0A] text-left">{text}</span>
    </button>
  );
}

// ── Audio Button (play/pause with progress track) ─────────────────────────────

function AudioButton({ text, src }: { text: string; src?: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      audio.play();
    }
    setPlaying(!playing);
  }, [playing]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };
    const onEnded = () => {
      setPlaying(false);
      setProgress(0);
    };
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
  }, []);

  return (
    <button
      type="button"
      onClick={toggle}
      className="relative inline-flex items-center gap-2 self-start rounded-[4px] border border-[#404040] bg-[#121212] px-4 py-[14px] h-12 cursor-pointer overflow-hidden"
    >
      {/* Play / Pause icon */}
      {playing ? (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="3" y="2" width="4" height="12" rx="1" fill="#F0F0F0" />
          <rect x="9" y="2" width="4" height="12" rx="1" fill="#F0F0F0" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M4 2L13 8L4 14V2Z" fill="#F0F0F0" />
        </svg>
      )}
      <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-16)] font-medium uppercase leading-[1.16] tracking-[0.04em] text-[#F0F0F0]">
        {text}
      </span>
      {/* Progress track */}
      <div
        className="absolute bottom-0 left-0 h-1 bg-[#FFCC00] transition-[width] duration-200 ease-linear"
        style={{ width: `${progress}%` }}
      />
      {src && (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <audio ref={audioRef} src={src} preload="metadata" />
      )}
    </button>
  );
}

// ── Tag ────────────────────────────────────────────────────────────────────────

function HeroTagBadge({ text }: HeroTag) {
  return (
    <span className="inline-flex items-center gap-2.5 rounded-[4px] border border-[#404040] bg-[#121212] px-2.5 py-1 h-7">
      <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-14)] font-medium uppercase leading-[1.16] tracking-[0.02em] text-[#939393]">
        {text}
      </span>
    </span>
  );
}

// ── Stagger animation helper ──────────────────────────────────────────────────

function fadeIn(index: number): React.CSSProperties {
  return {
    opacity: 0,
    transform: "translateY(20px)",
    animation: `heroFadeIn 600ms ease-out ${index * 150}ms forwards`,
  };
}

/** Pure opacity fade-in (no translate) — for background images. */
function bgFade(): React.CSSProperties {
  return {
    opacity: 0,
    animation: "heroBgFade 900ms ease-out 0ms forwards",
  };
}

// ── Product Hero (Image variant) ───────────────────────────────────────────────

export function ProductHeroImage({
  caption,
  title,
  titleSecondary,
  description,
  paragraphs,
  ctaText,
  factoids,
  coverImage,
  tags,
  secondaryCta,
  audioSrc,
  formId,
  availableChips,
  chipsConfig,
}: ProductHeroImageProps) {
  const { openForm } = useFormModal();
  const onCtaClick = formId
    ? () => openForm(formId, { availableChips, chipsConfig })
    : undefined;
  const resolvedParagraphs = resolveStyledParagraphs(paragraphs, description, {
    uppercase: false,
    color: "primary",
  });
  const descriptionEl18 =
    resolvedParagraphs.length > 0 ? (
      <StyledParagraphs paragraphs={resolvedParagraphs} theme="dark" size="18" />
    ) : null;
  const descriptionEl16 =
    resolvedParagraphs.length > 0 ? (
      <StyledParagraphs paragraphs={resolvedParagraphs} theme="dark" size="16" />
    ) : null;
  const visibleFactoids = factoids.filter(
    (f) => f.number?.trim() || f.label?.trim() || f.text?.trim(),
  );
  const hasFactoids = visibleFactoids.length > 0;

  return (
    <section className="relative w-full bg-[#0A0A0A]">
      {/* ── Desktop layout (lg+) ── */}
      <div className="hidden lg:block mx-auto max-w-[1512px]">
        {/* Image area */}
        <div className="relative min-h-[756px] overflow-hidden">
          {/* Background image — right 2/3 */}
          {coverImage && (
            <div className="absolute top-0 right-0 w-[60%] bottom-0" style={bgFade()}>
              <HeroImage src={coverImage} className="object-cover" priority />
            </div>
          )}

          {/* Gradient fade overlay */}
          {coverImage && (
            <div
              className="absolute top-0 right-0 w-[60%] bottom-0 z-[1]"
              style={{
                background:
                  "linear-gradient(-90deg, rgba(10,10,10,0) 34%, rgba(10,10,10,0.86) 71%, rgba(10,10,10,1) 100%)",
              }}
            />
          )}

          {/* Content */}
          <div className="relative z-10 flex flex-col gap-11 max-w-[752px] px-5 md:px-8 xl:px-14 pb-14 pt-[188px]">
            {/* Header */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-5" style={fadeIn(0)}>
                <span className="h4 text-[#FFCC00]">{caption}</span>
                {tags && tags.length > 0 && (
                  <div className="flex items-center gap-5">
                    {tags.map((tag) => (
                      <HeroTagBadge key={tag.text} {...tag} />
                    ))}
                  </div>
                )}
              </div>
              <div className="h1 whitespace-pre-line" style={fadeIn(1)}><span className="text-[#F0F0F0]">{title}</span>{titleSecondary ? <><span className="text-[#F0F0F0]"> </span><span className="text-[#939393]">{titleSecondary}</span></> : null}</div>
            </div>

            {/* Description */}
            {descriptionEl18 && (
              <div className="max-w-[696px]" style={fadeIn(2)}>
                {descriptionEl18}
              </div>
            )}

            {/* Secondary CTA (ghost button) */}
            {secondaryCta && audioSrc && <div style={fadeIn(3)}><AudioButton text={secondaryCta} src={audioSrc} /></div>}
          </div>
        </div>

        {/* Factoids + CTA row — equal columns; factoid widens if content exceeds its share */}
        {hasFactoids && (
          <div
            className="hidden xl:grid px-5 md:px-8 xl:px-14"
            style={{ gridTemplateColumns: `repeat(${visibleFactoids.length + 1}, minmax(max-content, 1fr))` }}
          >
            {visibleFactoids.map((f, i) => (
              <div key={f.number || i} className="self-stretch" style={fadeIn(1 + i)}>
                <FactoidCard
                  {...f}
                  className="border-t border-b border-l border-[#404040] h-full"
                />
              </div>
            ))}
            <div className="border-t border-b border-l border-[#404040] self-stretch" style={fadeIn(1)}>
              <HeroCTA text={ctaText} onClick={onCtaClick} />
            </div>
          </div>
        )}
        {/* Narrow desktop fallback — 2-col grid */}
        {hasFactoids && (
          <div className="hidden lg:grid xl:hidden grid-cols-2 px-5 md:px-8 xl:px-14">
            <div style={fadeIn(1)}><HeroCTA text={ctaText} onClick={onCtaClick} /></div>
            {visibleFactoids.map((f, i) => (
              <div key={f.number || i} style={fadeIn(1 + i)}>
                <FactoidCard
                  {...f}
                  className={i === visibleFactoids.length - 1 && visibleFactoids.length === 3 ? "border-r border-b border-[#404040]" : "border border-[#404040]"}
                />
              </div>
            ))}
          </div>
        )}

        {/* If no factoids, just CTA */}
        {!hasFactoids && (
          <div className="px-5 md:px-8 xl:px-14 pt-4 pb-8">
            <button
              type="button"
              onClick={onCtaClick}
              className="inline-flex items-center gap-2 bg-[#FFCC00] px-6 py-3.5 cursor-pointer transition-colors duration-200 hover:bg-[#FFE040]"
            >
              <span className="h4 text-[#0A0A0A]">{ctaText}</span>
            </button>
          </div>
        )}
      </div>

      {/* ── Tablet layout (md → lg) ── */}
      <div className="hidden md:block lg:hidden mx-auto">
        {/* Image area */}
        <div className="relative min-h-[600px] overflow-hidden">
          {/* Background image */}
          {coverImage && (
            <div className="absolute top-0 right-0 w-[65%] h-full" style={bgFade()}>
              <HeroImage src={coverImage} className="object-cover" priority />
            </div>
          )}

          {/* Gradient fade */}
          {coverImage && (
            <div
              className="absolute top-0 right-0 w-[65%] h-full z-[1]"
              style={{
                background:
                  "linear-gradient(-90deg, rgba(10,10,10,0) 20%, rgba(10,10,10,0.86) 60%, rgba(10,10,10,1) 100%)",
              }}
            />
          )}

          {/* Content */}
          <div className="relative z-10 flex flex-col gap-8 max-w-[600px] px-10 pb-10 pt-[140px]">
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-4 flex-wrap" style={fadeIn(0)}>
                <span className="h4 text-[#FFCC00]">{caption}</span>
                {tags && tags.length > 0 && (
                  <div className="flex items-center gap-3 flex-wrap">
                    {tags.map((tag) => (
                      <HeroTagBadge key={tag.text} {...tag} />
                    ))}
                  </div>
                )}
              </div>
              <div className="h1 whitespace-pre-line" style={fadeIn(1)}><span className="text-[#F0F0F0]">{title}</span>{titleSecondary ? <><span className="text-[#F0F0F0]"> </span><span className="text-[#939393]">{titleSecondary}</span></> : null}</div>
            </div>

            {descriptionEl18 && (
              <div style={fadeIn(2)}>{descriptionEl18}</div>
            )}

            {secondaryCta && audioSrc && <div style={fadeIn(3)}><AudioButton text={secondaryCta} src={audioSrc} /></div>}
          </div>
        </div>

        {/* Factoids + CTA */}
        {hasFactoids ? (
          <div className="grid grid-cols-2 px-10">
            <div style={fadeIn(1)}><HeroCTA text={ctaText} onClick={onCtaClick} /></div>
            {visibleFactoids.map((f, i) => (
              <div key={f.number || i} style={fadeIn(1 + i)}>
                <FactoidCard
                  {...f}
                  className={i === visibleFactoids.length - 1 && visibleFactoids.length === 3 ? "border-r border-b border-[#404040]" : "border border-[#404040]"}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="px-10 pt-4 pb-8">
            <button
              type="button"
              onClick={onCtaClick}
              className="inline-flex items-center gap-2 bg-[#FFCC00] px-6 py-3.5 cursor-pointer transition-colors duration-200 hover:bg-[#FFE040]"
            >
              <span className="h4 text-[#0A0A0A]">{ctaText}</span>
            </button>
          </div>
        )}
      </div>

      {/* ── Mobile layout ── */}
      <div className="flex md:hidden flex-col pt-16">
        {/* Image area */}
        <div className="relative min-h-[360px] overflow-hidden">
          {/* Background image — full width */}
          {coverImage && (
            <div className="absolute inset-0" style={bgFade()}>
              <HeroImage src={coverImage} className="object-cover object-right" priority />
            </div>
          )}

          {/* Gradient fade — bottom-up + left */}
          {coverImage && (
            <div
              className="absolute inset-0 z-[1]"
              style={{
                background:
                  "linear-gradient(0deg, rgba(10,10,10,1) 0%, rgba(10,10,10,0.6) 40%, rgba(10,10,10,0.2) 100%)",
              }}
            />
          )}

          {/* Content overlay */}
          <div className="relative z-10 flex flex-col justify-end h-full min-h-[360px] px-5 pb-6 pt-[100px]">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 flex-wrap" style={fadeIn(0)}>
                <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-16)] font-medium uppercase leading-[1.12] tracking-[0.02em] text-[#FFCC00]">
                  {caption}
                </span>
                {tags && tags.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    {tags.map((tag) => (
                      <HeroTagBadge key={tag.text} {...tag} />
                    ))}
                  </div>
                )}
              </div>
              <h1 className="h1" style={fadeIn(1)}><span className="text-[#F0F0F0]">{title}</span>{titleSecondary ? <><span className="text-[#F0F0F0]"> </span><span className="text-[#939393]">{titleSecondary}</span></> : null}</h1>
            </div>
          </div>
        </div>

        {/* Text content below image */}
        <div className="flex flex-col gap-6 px-5 pt-4">
          {descriptionEl16 && (
            <div style={fadeIn(2)}>{descriptionEl16}</div>
          )}

          {secondaryCta && audioSrc && <div style={fadeIn(3)}><AudioButton text={secondaryCta} src={audioSrc} /></div>}

          {/* CTA */}
          <button
            type="button"
            onClick={onCtaClick}
            style={fadeIn(1)}
            className="group flex items-center justify-between w-full bg-[#FFCC00] p-5 cursor-pointer transition-colors duration-200 hover:bg-[#FFE040]"
          >
            <span className="h4 text-[#0A0A0A]">{ctaText}</span>
            <div className="transition-transform duration-200 group-hover:-translate-y-1 group-hover:translate-x-1">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path
                  d="M8 8H24M24 8V24M24 8L8 24"
                  stroke="#0A0A0A"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </button>
        </div>

        {/* Factoids stacked */}
        {hasFactoids && (
          <div className="flex flex-col px-5">
            {visibleFactoids.map((f, i) => (
              <div key={f.number || i} style={fadeIn(1 + i)}>
                <FactoidCard
                  {...f}
                  className={
                    i === 0
                      ? "border border-[#404040]"
                      : "border-l border-r border-b border-[#404040]"
                  }
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
