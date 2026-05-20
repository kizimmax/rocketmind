import type { ArticleSection, ArticleBodyBlock } from "@/lib/types";

/**
 * Парсер минимального подмножества Markdown → `ArticleSection[]`.
 *
 * Поддерживает:
 *   • `## Heading {#slug}` — новая секция (H2 = section.title, slug = navLabel).
 *     Если `{#slug}` опущен, slug автогенерируется через `slugify(title)`.
 *   • `### Heading` → block { type: "h3" }
 *   • `#### Heading` → block { type: "h4" }
 *   • `> текст` (одна или несколько подряд строк с префиксом `>`) → block { type: "quote" }
 *   • прочие непустые строки, разделённые пустой строкой → block { type: "paragraph" }
 *
 * Содержимое до первого `##` помещается в неявную "вступительную" секцию с
 * пустыми `title`/`navLabel`. Если в MD нет ни одного `##`, всё уходит в одну
 * безымянную секцию.
 */
export function parseMarkdownToSections(md: string): ArticleSection[] {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const sections: ArticleSection[] = [];
  let current = emptySection("", "");

  // Буферы для накопления строк параграфа / цитаты до их завершения.
  let paragraphBuf: string[] = [];
  let quoteBuf: string[] = [];

  function flushParagraph() {
    if (paragraphBuf.length === 0) return;
    current.blocks.push(makeBlock("paragraph", paragraphBuf.join(" ").trim()));
    paragraphBuf = [];
  }
  function flushQuote() {
    if (quoteBuf.length === 0) return;
    current.blocks.push(makeBlock("quote", quoteBuf.join(" ").trim()));
    quoteBuf = [];
  }
  function flushAll() {
    flushParagraph();
    flushQuote();
  }
  function startSection(title: string, navLabel: string) {
    flushAll();
    if (sectionIsEmpty(current) && sections.length === 0) {
      // Сразу первая секция, безымянной "вводной" не было — заменяем её.
    } else {
      sections.push(current);
    }
    current = emptySection(title, navLabel);
  }

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    // Пустая строка — конец текущего параграфа/цитаты.
    if (line.trim() === "") {
      flushAll();
      continue;
    }

    // H2 → новая секция.
    const h2 = line.match(/^##\s+(.+?)(?:\s+\{#([a-z0-9-]+)\})?\s*$/i);
    if (h2) {
      const title = h2[1].trim();
      const slug = h2[2]?.trim() || slugify(title);
      startSection(title, slug);
      continue;
    }

    // H3
    const h3 = line.match(/^###\s+(.+?)\s*$/);
    if (h3) {
      flushAll();
      current.blocks.push(makeBlock("h3", h3[1].trim()));
      continue;
    }

    // H4
    const h4 = line.match(/^####\s+(.+?)\s*$/);
    if (h4) {
      flushAll();
      current.blocks.push(makeBlock("h4", h4[1].trim()));
      continue;
    }

    // Quote line
    const q = line.match(/^>\s?(.*)$/);
    if (q) {
      flushParagraph();
      quoteBuf.push(q[1].trim());
      continue;
    }

    // Обычная строка — продолжение параграфа.
    flushQuote();
    paragraphBuf.push(line.trim());
  }

  flushAll();
  // Если последняя секция не пуста (или это единственная безымянная) — пушим.
  if (!sectionIsEmpty(current) || sections.length === 0) {
    sections.push(current);
  }

  return sections;
}

// ── helpers ─────────────────────────────────────────────────────────────────

function emptySection(title: string, navLabel: string): ArticleSection {
  return {
    id: makeId("s"),
    title,
    navLabel,
    blocks: [],
    factoids: [],
    asides: [],
    quotes: [],
    asidesTitle: "",
    asidesTitleEnabled: false,
  };
}

function sectionIsEmpty(s: ArticleSection): boolean {
  return s.title === "" && s.navLabel === "" && s.blocks.length === 0;
}

function makeBlock(type: "h3" | "h4" | "paragraph" | "quote", text: string): ArticleBodyBlock {
  return { id: makeId("b"), type, data: { text } };
}

function makeId(prefix: string): string {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

/**
 * Транслит RU + sanitize для slug. Простой вариант: пробелы → `-`, кириллица
 * → латиница, спецсимволы выкинуть. Совпадает с тем, что админ генерирует
 * вручную (короткие латинские slug'и).
 */
function slugify(text: string): string {
  const map: Record<string, string> = {
    а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e",
    ж: "zh", з: "z", и: "i", й: "y", к: "k", л: "l", м: "m",
    н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u",
    ф: "f", х: "h", ц: "ts", ч: "ch", ш: "sh", щ: "sch", ъ: "",
    ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
  };
  return text
    .toLowerCase()
    .split("")
    .map((ch) => map[ch] ?? ch)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "section";
}
