import { cn } from "../../lib/utils";
import { RichText } from "./rich-text";

export type StyledParagraphColor = "primary" | "secondary";

export type StyledParagraph = {
  text: string;
  uppercase?: boolean;
  color?: StyledParagraphColor;
};

export type StyledParagraphsTheme = "dark" | "light";
export type StyledParagraphsSize = "18" | "16";

export type StyledParagraphsProps = {
  paragraphs: StyledParagraph[];
  theme?: StyledParagraphsTheme;
  size?: StyledParagraphsSize;
  className?: string;
};

/**
 * Canonicalize a possibly-legacy paragraphs list + legacy description string.
 *
 * - If `paragraphs` is non-empty → use it (applying defaults).
 * - Else if `legacy` is a non-empty string → wrap it with `legacyDefaults`.
 * - Else return [].
 */
export function resolveStyledParagraphs(
  paragraphs: StyledParagraph[] | undefined,
  legacy: string | undefined,
  legacyDefaults: { uppercase?: boolean; color?: StyledParagraphColor } = {},
): StyledParagraph[] {
  if (paragraphs && paragraphs.length > 0) {
    return paragraphs
      .filter((p) => p && (p.text ?? "").length > 0)
      .map((p) => ({
        text: p.text,
        uppercase: p.uppercase === true,
        color: p.color === "primary" ? "primary" : "secondary",
      }));
  }
  if (legacy && legacy.trim().length > 0) {
    return [
      {
        text: legacy,
        uppercase: legacyDefaults.uppercase ?? false,
        color: legacyDefaults.color ?? "secondary",
      },
    ];
  }
  return [];
}

export function styledParagraphClassName(
  p: StyledParagraph,
  opts: { theme?: StyledParagraphsTheme; size?: StyledParagraphsSize } = {},
): string {
  const theme = opts.theme ?? "dark";
  const size = opts.size ?? "18";
  const isPrimary = p.color === "primary";
  const textColor =
    theme === "light"
      ? isPrimary
        ? "text-[#0A0A0A]"
        : "text-[#666666]"
      : isPrimary
        ? "text-[#F0F0F0]"
        : "text-[#939393]";
  const sizeToken = size === "16" ? "text-[length:var(--text-16)]" : "text-[length:var(--text-18)]";
  if (p.uppercase) {
    return cn(
      "font-[family-name:var(--font-mono-family)]",
      sizeToken,
      "font-medium uppercase leading-[1.12] tracking-[0.02em]",
      textColor,
    );
  }
  return cn(sizeToken, "leading-[1.2]", textColor);
}

/**
 * Renders a list of styled paragraphs with per-paragraph caps + color.
 * Returns null when paragraphs list is empty.
 */
export function StyledParagraphs({
  paragraphs,
  theme = "dark",
  size = "18",
  className,
}: StyledParagraphsProps) {
  if (!paragraphs || paragraphs.length === 0) return null;
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {paragraphs.map((p, i) => (
        <RichText
          key={i}
          text={p.text}
          className={styledParagraphClassName(p, { theme, size })}
        />
      ))}
    </div>
  );
}
