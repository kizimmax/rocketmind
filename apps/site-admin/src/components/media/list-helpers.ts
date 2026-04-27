export type ListMode = "none" | "bullet" | "numbered";

const BULLET_LINE_RE = /^\s*[-•·–—]\s+/;
const NUMBERED_LINE_RE = /^\s*\d+[.)]\s+/;
const ANY_MARKER_RE = /^\s*(?:[-•·–—]\s+|\d+[.)]\s+)/;

/** Режим определяется содержимым: если все непустые строки имеют маркер
 *  одного вида — это список; иначе — plain. */
export function detectListMode(text: string): ListMode {
  const lines = text.split("\n").filter((l) => l.trim().length > 0);
  if (lines.length === 0) return "none";
  if (lines.every((l) => BULLET_LINE_RE.test(l))) return "bullet";
  if (lines.every((l) => NUMBERED_LINE_RE.test(l))) return "numbered";
  return "none";
}

/** Переводит текст в целевой режим: снимает существующие маркеры в начале
 *  каждой непустой строки и, если нужно, ставит новые. Пустые строки сохраняются. */
export function transformLines(text: string, mode: ListMode): string {
  const stripped = text.split("\n").map((l) => l.replace(ANY_MARKER_RE, ""));
  if (mode === "none") return stripped.join("\n");
  if (mode === "bullet") {
    return stripped.map((l) => (l.trim() ? `- ${l}` : l)).join("\n");
  }
  let n = 0;
  return stripped
    .map((l) => {
      if (!l.trim()) return l;
      n += 1;
      return `${n}. ${l}`;
    })
    .join("\n");
}
