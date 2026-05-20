/**
 * Импорт 26 кейсов из docs/case_new/*.csv в Prisma Article.
 *
 * Источники:
 *  - "Rocketmind Таблица кейсов 2026  - Кейсы.csv"      (метаданные, фактоиды, итог)
 *  - "Rocketmind Таблица кейсов 2026  - Тело кейса.csv" (markdown body)
 *
 * Маппинг полей см. в README ниже + согласовано в чате.
 *
 * Запуск:
 *   cd apps/site-admin
 *   DATABASE_URL='...' npx tsx scripts/import-cases.ts          # dry-run (default)
 *   DATABASE_URL='...' npx tsx scripts/import-cases.ts --write  # реальная запись
 *   DATABASE_URL='...' npx tsx scripts/import-cases.ts --only=1 # подмножество
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { prisma } from "../src/lib/prisma";
import { slugify } from "../src/lib/slugify";

// ── CLI ───────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const WRITE = args.includes("--write");
const ONLY = (() => {
  const arg = args.find((a) => a.startsWith("--only="));
  if (!arg) return null;
  return new Set(arg.slice("--only=".length).split(",").map((s) => s.trim()).filter(Boolean));
})();

// ── CSV parser (RFC 4180) ─────────────────────────────────────────────────────

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  let i = 0;
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
  while (i < text.length) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') { field += '"'; i += 2; continue; }
        inQuotes = false; i++; continue;
      }
      field += ch; i++; continue;
    }
    if (ch === '"') { inQuotes = true; i++; continue; }
    if (ch === ",") { row.push(field); field = ""; i++; continue; }
    if (ch === "\r") { i++; continue; }
    if (ch === "\n") { row.push(field); rows.push(row); row = []; field = ""; i++; continue; }
    field += ch; i++;
  }
  if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row); }
  return rows;
}

// ── Маппинг тегов (CSV label → mediaTag.id) ───────────────────────────────────
// Существующие в БД помечены EXISTING, новые будут созданы.
const TAG_LABEL_TO_ID: Record<string, { id: string; label: string }> = {
  "Анализ рынка":      { id: "analiz-rynka",   label: "Анализ рынка" },
  "Бизнес-дизайн":     { id: "biznes-dizain",  label: "Бизнес-дизайн" },
  "Бизнес-модели":     { id: "biznes-modeli",  label: "Бизнес-модели" },
  "Бизнес-модель":     { id: "biznes-modeli",  label: "Бизнес-модели" }, // нормализуем к существующему
  "Бизнес‑модель":{ id: "biznes-modeli",  label: "Бизнес-модели" }, // non-breaking hyphen
  "Клиентский опыт":   { id: "klientskii-opyt", label: "Клиентский опыт" },
  "Платформа":         { id: "platforma",      label: "Платформа" },
  "Продукты":          { id: "produkty",       label: "Продукты" },
  "Роли и команда":    { id: "roli-i-komanda", label: "Роли и команда" },
  "Стратегия":         { id: "strategiya",     label: "Стратегия" },
  "Финтех":            { id: "finteh",         label: "Финтех" },
  "Цифровизация":      { id: "cifrovizaciya",  label: "Цифровизация" },
  "Экосистема":        { id: "ekosistema",     label: "Экосистема" },
};

// ── Slug-маппинг для существующих кейсов (сохраняем уже опубликованные URL) ──
const SLUG_BY_NUMBER: Record<string, string> = {
  "1": "optimizatsiya-hr-produktov",
};

const DEFAULT_EXPERT_SLUG = "alexey-eremin";

// ── Утилиты ───────────────────────────────────────────────────────────────────

function normalizeNbsp(s: string): string {
  // non-breaking hyphen U+2011 / U+00AD soft hyphen — оставляем как есть для отображения,
  // но non-breaking space U+00A0 заменяем на обычный для счёта тегов и slug
  return s.replace(/ /g, " ").replace(/‑/g, "-").trim();
}

function csvDateToPublishedAt(raw: string): string {
  const y = raw.trim().match(/^(20\d{2})$/);
  if (y) return `${y[1]}-01-01`;
  return "2025-01-01";
}

function splitKeyThoughts(raw: string): string[] {
  return raw
    .replace(/\r\n?/g, "\n")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
}

// ── Парсер markdown тела ───────────────────────────────────────────────────────
// Грамматика (по реальным телам из bodies.csv):
//   ## Заголовок     → новая секция (title + navLabel)
//   ### Заголовок    → блок h3 в текущей секции
//   **Текст**\s*$    → блок h3 (если строка целиком жирная)
//   - / • / *        → список (объединяем последовательные строки в один paragraph c "• …")
//   ЦИТАТА — …       → начало quote-блока (текст + автор на следующих строках)
//   прочее           → paragraph
// Между блоками — пустая строка.

type Block = { id: string; type: "paragraph" | "h3"; data: { text: string } };
type Quote = {
  id: string;
  expertSlug?: string;
  name?: string;
  role?: string;
  paragraphs: string[];
};
type Section = {
  id: string;
  title: string;
  navLabel: string;
  blocks: Block[];
  quotes: Quote[];
  factoids: never[];
  asides: never[];
  asidesTitle: string;
  asidesTitleEnabled: boolean;
};

function parseBody(
  md: string,
  expertNameToSlug: Map<string, string>,
): Section[] {
  let text = md.replace(/\r\n?/g, "\n").trim();
  if (!text) return [];
  // Strip leading/trailing stray quote chars (Sheets export sometimes wraps cells)
  text = text.replace(/^["'`]+/, "").replace(/["'`]+$/, "").trim();
  if (!text) return [];
  // Split by `##` headers (allow no space: `##Title` and `## Title`)
  const chunks: { title: string; body: string }[] = [];
  const re = /(^|\n)##[ \t]*([^\n]+)\n([\s\S]*?)(?=(?:\n##[ \t]*[^\n])|$)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    chunks.push({ title: m[2].trim(), body: m[3].trim() });
  }
  if (chunks.length === 0) {
    // no `##` headers → put everything into a single anonymous section
    chunks.push({ title: "", body: text });
  }

  return chunks.map((chunk, sIdx): Section => {
    const sectionId = `s${sIdx + 1}`;
    const blocks: Block[] = [];
    const quotes: Quote[] = [];

    // Split body into paragraph-blocks separated by blank lines.
    // BUT: list items may be on consecutive non-empty lines without a blank between them,
    // so we treat them as one block if they all start with "- " or "• ".
    const paragraphs: string[] = [];
    let buf: string[] = [];
    const flush = () => {
      if (buf.length > 0) {
        paragraphs.push(buf.join("\n").trim());
        buf = [];
      }
    };
    for (const line of chunk.body.split("\n")) {
      if (line.trim() === "") { flush(); continue; }
      buf.push(line);
    }
    flush();

    let bIdx = 0;
    let qIdx = 0;

    // ── Quote state machine ─────────────────────────────────────────────────
    // Поддерживаем два формата:
    //  A) «ЦИТАТА — комментарий\nТекст…\nИмя\nДолжность» — один параграф без пустых строк
    //  B) Маркер «ЦИТАТА» отдельной строкой → пустая строка → текст в следующих
    //     параграфах → закрытие маркером «КОММЕНТАРИЙ КЛИЕНТА» (анонимный)
    //     ИЛИ ФИО + должность в одной из строк
    let quoteOpen = false;
    let quoteText: string[] = [];
    let quoteName = "";
    let quoteRole = "";
    let quoteIsClientComment = false;

    function finishQuote() {
      if (!quoteOpen) return;
      qIdx++;
      const id = `${sectionId}_q${qIdx}`;
      const text = quoteText.map((l) => l.trim()).filter(Boolean);
      if (text.length === 0) {
        // Бракованная цитата без текста — отбрасываем
        quoteOpen = false; quoteText = []; quoteName = ""; quoteRole = ""; quoteIsClientComment = false;
        return;
      }
      const slug = !quoteIsClientComment && quoteName
        ? expertNameToSlug.get(quoteName.replace(/ё/g, "е").toLowerCase())
        : undefined;
      if (slug) {
        quotes.push({ id, expertSlug: slug, paragraphs: text });
      } else {
        quotes.push({ id, name: "Комментарий клиента", paragraphs: text });
      }
      quoteOpen = false; quoteText = []; quoteName = ""; quoteRole = ""; quoteIsClientComment = false;
    }

    function looksLikeName(line: string): boolean {
      const words = line.split(/\s+/);
      if (words.length < 1 || words.length > 4) return false;
      return words.every((w) => /^[А-ЯЁA-Z][\wА-Яа-яё-]{1,}$/.test(w));
    }

    for (let pi = 0; pi < paragraphs.length; pi++) {
      const para = paragraphs[pi];
      const lines = para.split("\n").map((l) => l.trim()).filter((l) => l);
      if (lines.length === 0) continue;

      // Format A (inline marker with content in same paragraph)
      if (!quoteOpen && /^цитата[\s—-]/i.test(lines[0])) {
        const rest = lines.slice(1);
        const nameIdx = rest.findIndex(looksLikeName);
        if (nameIdx >= 0) {
          quoteText = rest.slice(0, nameIdx);
          quoteName = rest[nameIdx];
          quoteRole = rest.slice(nameIdx + 1).join(" ");
        } else {
          quoteText = rest;
        }
        quoteOpen = true;
        finishQuote();
        continue;
      }

      // Format B start: первая строка = «ЦИТАТА» (без описания после)
      if (!quoteOpen && /^цитата\s*$/i.test(lines[0])) {
        quoteOpen = true;
        // Остальные строки этого параграфа (редко, но возможно) — текст цитаты
        for (const l of lines.slice(1)) {
          if (/^комментарий\s+клиента\s*$/i.test(l)) {
            quoteIsClientComment = true;
            finishQuote();
            quoteOpen = false;
            break;
          }
          quoteText.push(l);
        }
        continue;
      }

      // Inside quote (Format B): paragraphs продолжают текст до закрытия
      if (quoteOpen) {
        let closed = false;
        for (const l of lines) {
          if (/^комментарий\s+клиента\s*$/i.test(l)) {
            quoteIsClientComment = true;
            finishQuote();
            closed = true;
            break;
          }
          if (looksLikeName(l) && quoteText.length > 0) {
            // Имя автора — следующая строка (если есть) = должность
            const idx = lines.indexOf(l);
            quoteName = l;
            quoteRole = lines.slice(idx + 1).join(" ");
            finishQuote();
            closed = true;
            break;
          }
          quoteText.push(l);
        }
        if (closed) continue;
        // Иначе ждём следующий параграф
        continue;
      }

      // h3 via `### `
      if (lines.length === 1 && /^###\s+/.test(lines[0])) {
        bIdx++;
        blocks.push({
          id: `${sectionId}_b${bIdx}`,
          type: "h3",
          data: { text: lines[0].replace(/^###\s+/, "") },
        });
        continue;
      }

      // h3 via wholly bold single line `**text**`
      if (lines.length === 1 && /^\*\*[^*]+\*\*$/.test(lines[0])) {
        bIdx++;
        blocks.push({
          id: `${sectionId}_b${bIdx}`,
          type: "h3",
          data: { text: lines[0].replace(/^\*\*|\*\*$/g, "") },
        });
        continue;
      }

      // Some paragraphs start with `**Заголовок**  ` followed by content on next lines:
      // emit h3 first, затем paragraph.
      const leadBold = lines[0].match(/^\*\*([^*]+)\*\*\s*$/);
      if (leadBold && lines.length > 1) {
        bIdx++;
        blocks.push({
          id: `${sectionId}_b${bIdx}`,
          type: "h3",
          data: { text: leadBold[1] },
        });
        bIdx++;
        blocks.push({
          id: `${sectionId}_b${bIdx}`,
          type: "paragraph",
          data: { text: lines.slice(1).join("\n") },
        });
        continue;
      }

      // List: каждая строка начинается с "-" или "•" → один paragraph с "•" пунктами
      const isList = lines.every((l) => /^[-•*]\s+/.test(l));
      if (isList && lines.length > 0) {
        const items = lines.map((l) => "• " + l.replace(/^[-•*]\s+/, ""));
        bIdx++;
        blocks.push({
          id: `${sectionId}_b${bIdx}`,
          type: "paragraph",
          data: { text: items.join("\n") },
        });
        continue;
      }

      // Иначе — paragraph (join multiline as single text with line breaks preserved)
      bIdx++;
      blocks.push({
        id: `${sectionId}_b${bIdx}`,
        type: "paragraph",
        data: { text: lines.join("\n") },
      });
    }

    // Если параграфы закончились а цитата осталась открытой — закрываем как client-comment
    if (quoteOpen) {
      quoteIsClientComment = true;
      finishQuote();
    }

    return {
      id: sectionId,
      title: chunk.title,
      navLabel: chunk.title,
      blocks,
      quotes,
      factoids: [],
      asides: [],
      asidesTitle: "Материалы",
      asidesTitleEnabled: true,
    };
  });
}

// ── Главная ───────────────────────────────────────────────────────────────────

async function main() {
  const ROOT = resolve(__dirname, "..", "..", "..");
  const CASES_CSV = resolve(ROOT, "docs/case_new/Rocketmind Таблица кейсов 2026  - Кейсы.csv");
  const BODIES_CSV = resolve(ROOT, "docs/case_new/Rocketmind Таблица кейсов 2026  - Тело кейса.csv");

  const casesRows = parseCsv(readFileSync(CASES_CSV, "utf8"));
  const bodiesRows = parseCsv(readFileSync(BODIES_CSV, "utf8"));

  // Index bodies by №
  const bodyByNum = new Map<string, string>();
  for (const r of bodiesRows.slice(1)) {
    if (r.length < 3) continue;
    if (!r[0]?.trim()) continue;
    bodyByNum.set(r[0].trim(), (r[2] ?? "").trim());
  }

  // Build expert name → slug map from DB
  const allExperts = await prisma.expert.findMany({ select: { slug: true, content: true } });
  const expertNameToSlug = new Map<string, string>();
  for (const e of allExperts) {
    const c = (e.content as Record<string, unknown>) ?? {};
    const name = typeof c.name === "string" ? c.name : "";
    if (!name) continue;
    expertNameToSlug.set(name.replace(/ё/g, "е").toLowerCase(), e.slug);
  }

  // Ensure tags exist (idempotent)
  const tagPlan: { id: string; label: string; existing: boolean }[] = [];
  const seenTagIds = new Set<string>();
  for (const v of Object.values(TAG_LABEL_TO_ID)) {
    if (seenTagIds.has(v.id)) continue;
    seenTagIds.add(v.id);
    const existing = await prisma.mediaTag.findUnique({ where: { id: v.id } });
    tagPlan.push({ id: v.id, label: v.label, existing: !!existing });
  }
  console.log("=== TAGS ===");
  for (const t of tagPlan) {
    console.log(`  ${t.existing ? "[exists]   " : "[CREATE]   "} ${t.id.padEnd(20)} "${t.label}"`);
  }

  if (WRITE) {
    for (const t of tagPlan) {
      if (t.existing) continue;
      await prisma.mediaTag.create({
        data: { id: t.id, label: t.label, disabled: false, system: false, cardColor: null, seo: null },
      });
    }
  }

  // Walk cases
  console.log("\n=== CASES ===");
  // Header at index 0, comment row at index 1, data starts at 2
  const dataRows = casesRows.slice(2);

  let createCount = 0;
  let updateCount = 0;
  let skipCount = 0;

  for (const r of dataRows) {
    if (r.length < 26) continue;
    const num = r[0]?.trim();
    const title = r[3]?.trim();
    if (!num || !title) continue;
    if (ONLY && !ONLY.has(num)) continue;

    const metaTitle = r[4]?.trim() ?? "";
    const metaDescription = r[5]?.trim() ?? "";
    const description = r[6]?.trim() ?? "";
    const tagCell = r[7]?.trim() ?? "";
    const dateCell = r[8]?.trim() ?? "";
    const keyThoughtsCell = r[9]?.trim() ?? "";
    // r[10] = идея обложки — игнорируем (нет файла)
    // r[11] = дубль title — игнорируем
    // r[12] = дубль description (иногда мусор) — игнорируем
    const f = [
      { value: r[13]?.trim() ?? "", label: r[14]?.trim() ?? "", description: r[15]?.trim() ?? "" },
      { value: r[16]?.trim() ?? "", label: r[17]?.trim() ?? "", description: r[18]?.trim() ?? "" },
      { value: r[19]?.trim() ?? "", label: r[20]?.trim() ?? "", description: r[21]?.trim() ?? "" },
    ];
    const resultText = r[22]?.trim() ?? "";

    // Slug strategy: known → fixed; иначе slugify(title) с обрезкой до 60 (из slugify.ts)
    const slug = SLUG_BY_NUMBER[num] ?? slugify(title);

    // Tags: split + normalize + map to ids
    const tagLabels = tagCell.split(/[,;]/).map((s) => normalizeNbsp(s)).filter(Boolean);
    const tagIds = Array.from(new Set(
      tagLabels.map((lbl) => TAG_LABEL_TO_ID[lbl]?.id).filter((id): id is string => !!id),
    ));
    const missingTags = tagLabels.filter((lbl) => !TAG_LABEL_TO_ID[lbl]);
    if (missingTags.length > 0) {
      console.warn(`  #${num}: ⚠ неизвестные теги: ${JSON.stringify(missingTags)}`);
    }

    // Build content
    const body = parseBody(bodyByNum.get(num) ?? "", expertNameToSlug);
    const caseCard = {
      stats: f
        .filter((s) => s.value || s.label)
        .map((s) => ({ value: s.value, label: s.label, description: s.description })),
      title,
      result: resultText,
      description, // тот же текст, что в Article.description
    };
    const content = {
      body,
      caseCard,
      multiPage: false,
      sortOrder: Number(num) || 0,
      keyThoughts: splitKeyThoughts(keyThoughtsCell),
    };

    // Check existing
    const existing = await prisma.article.findUnique({ where: { slug } });

    const data = {
      type: "case",
      status: "published",
      title,
      description,
      content: content as unknown as object,
      coverPath: null as string | null,
      expertSlug: DEFAULT_EXPERT_SLUG,
      publishedAt: csvDateToPublishedAt(dateCell),
      tagIds,
      pinned: false,
      pinnedOrder: 0,
      featured: false,
      cardVariant: "default",
      metaTitle,
      metaDescription,
    };

    const action = existing ? "UPDATE" : "CREATE";
    console.log(`\n--- #${num} [${action}] ${slug} ---`);
    console.log(`  title: ${title}`);
    console.log(`  description (${description.length}): ${description.slice(0, 100)}…`);
    console.log(`  metaDescription (${metaDescription.length}): ${metaDescription.slice(0, 80)}…`);
    console.log(`  tags: ${JSON.stringify(tagIds)}${missingTags.length ? ` (skipped: ${JSON.stringify(missingTags)})` : ""}`);
    console.log(`  publishedAt: ${data.publishedAt}`);
    console.log(`  body sections: ${body.length} | factoids: ${caseCard.stats.length} | keyThoughts: ${content.keyThoughts.length}`);
    const qSum = body.reduce((acc, s) => acc + s.quotes.length, 0);
    const clientCommentSum = body.reduce(
      (acc, s) => acc + s.quotes.filter((q) => !q.expertSlug).length, 0,
    );
    console.log(`  quotes: ${qSum} (client-comments: ${clientCommentSum})`);
    if (existing && action === "UPDATE") {
      const before = existing.description.slice(0, 100);
      console.log(`  description BEFORE: ${before}…`);
    }

    if (WRITE) {
      if (existing) {
        await prisma.article.update({ where: { slug }, data });
        updateCount++;
      } else {
        await prisma.article.create({ data: { slug, ...data } });
        createCount++;
      }
    } else {
      if (existing) updateCount++; else createCount++;
    }
  }

  console.log(`\n=== SUMMARY ===`);
  console.log(`  mode: ${WRITE ? "WRITE" : "DRY-RUN (no changes written)"}`);
  console.log(`  cases planned: create=${createCount}, update=${updateCount}, skip=${skipCount}`);
  if (ONLY) console.log(`  --only filter: ${[...ONLY].join(",")}`);

  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
