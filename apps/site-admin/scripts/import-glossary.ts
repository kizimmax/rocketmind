/**
 * Одноразовый импорт глоссария из docs/glossary_start_14.05.26.csv.
 *
 * Поведение:
 *  1. Удаляет все Article (раздел «Медиа»).
 *  2. Удаляет все GlossaryTerm.
 *  3. Удаляет все MediaTag, где system = false (системные `lesson`/`case` остаются).
 *  4. Создаёт MediaTag из уникальных значений столбца «Тег» (id = slugify(label)).
 *  5. Создаёт GlossaryTerm под каждую строку CSV.
 *
 * Маппинг CSV → GlossaryTerm:
 *   №                          → content.order
 *   Тег                        → tagIds: [slugify(tag)]
 *   Термин                     → title, slug = slugify(title)
 *   Описание → осн. текст      → первый абзац → description,
 *                                остальные абзацы → content.sections[0].blocks
 *                                (тип paragraph)
 *   SEO Тайтл                  → metaTitle
 *   SEO Дескрипшн              → metaDescription
 *   Первоначальные варианты    → игнорируем (архив черновиков)
 *
 * Также генерирует content.autoAliases (падежи по generateAutoAliases) и
 * content.gender (guessGender по последнему слову title).
 *
 * Запуск:
 *   cd apps/site-admin && \
 *   DATABASE_URL='...' npx tsx scripts/import-glossary.ts
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { prisma } from "../src/lib/prisma";
import { slugify } from "../src/lib/slugify";
import { generateAutoAliases, guessGender, type Gender } from "../src/lib/glossary-morph";

// ── CSV parser (RFC 4180, с поддержкой переносов внутри кавычек) ──────────────

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  let i = 0;
  // Срезаем BOM, если есть.
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
  while (i < text.length) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i++;
        continue;
      }
      field += ch;
      i++;
      continue;
    }
    if (ch === '"') {
      inQuotes = true;
      i++;
      continue;
    }
    if (ch === ",") {
      row.push(field);
      field = "";
      i++;
      continue;
    }
    if (ch === "\r") {
      i++;
      continue;
    }
    if (ch === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      i++;
      continue;
    }
    field += ch;
    i++;
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

// ── Утилиты ───────────────────────────────────────────────────────────────────

function splitParagraphs(text: string): string[] {
  return text
    .replace(/\r\n?/g, "\n")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
}

function buildSections(restParagraphs: string[]) {
  if (restParagraphs.length === 0) return [];
  return [
    {
      id: "s0",
      title: "",
      navLabel: "",
      blocks: restParagraphs.map((text, idx) => ({
        id: `s0_p${idx}`,
        type: "paragraph" as const,
        data: { text },
      })),
      factoids: [],
      asides: [],
      quotes: [],
      asidesTitle: "Материалы",
      asidesTitleEnabled: true,
    },
  ];
}

// ── Основная логика ───────────────────────────────────────────────────────────

async function main() {
  const csvPath = resolve(__dirname, "../../../docs/glossary_start_14.05.26.csv");
  console.log(`→ Читаю CSV: ${csvPath}`);
  const raw = readFileSync(csvPath, "utf8");
  const rows = parseCsv(raw);
  if (rows.length === 0) throw new Error("CSV пустой");

  const header = rows[0];
  const expected = ["№", "Тег", "Термин", "Описание → осн. текст", "SEO Тайтл", "SEO Дескрипшн"];
  for (let k = 0; k < expected.length; k++) {
    if ((header[k] ?? "").trim() !== expected[k]) {
      throw new Error(`Заголовок колонки ${k} ожидался "${expected[k]}", получено "${header[k]}"`);
    }
  }

  type Record = {
    order: number;
    tagLabels: string[];
    tagIds: string[];
    title: string;
    slug: string;
    description: string;
    sectionParagraphs: string[];
    metaTitle: string;
    metaDescription: string;
  };

  const records: Record[] = [];
  const tagMap = new Map<string, string>(); // id → label
  const slugSet = new Set<string>();

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    if (row.every((c) => !c.trim())) continue; // пустая строка
    const numStr = (row[0] ?? "").trim();
    const tagsCell = (row[1] ?? "").trim();
    const title = (row[2] ?? "").trim();
    const desc = (row[3] ?? "").trim();
    const metaTitle = (row[4] ?? "").trim();
    const metaDescription = (row[5] ?? "").trim();
    if (!title) {
      console.warn(`  строка ${r + 1}: нет заголовка, пропускаю`);
      continue;
    }
    const slug = slugify(title);
    if (!slug) {
      console.warn(`  строка ${r + 1} (${title}): slug не сгенерирован, пропускаю`);
      continue;
    }
    if (slugSet.has(slug)) {
      console.warn(`  строка ${r + 1} (${title}): дубликат slug ${slug}, пропускаю`);
      continue;
    }
    slugSet.add(slug);
    const tagLabels = tagsCell
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    const tagIds: string[] = [];
    for (const label of tagLabels) {
      const id = slugify(label);
      if (!id) continue;
      if (!tagMap.has(id)) tagMap.set(id, label);
      if (!tagIds.includes(id)) tagIds.push(id);
    }
    const paragraphs = splitParagraphs(desc);
    const description = paragraphs[0] ?? "";
    const sectionParagraphs = paragraphs.slice(1);
    records.push({
      order: Number(numStr) || 0,
      tagLabels,
      tagIds,
      title,
      slug,
      description,
      sectionParagraphs,
      metaTitle,
      metaDescription,
    });
  }

  console.log(`→ Распознано ${records.length} терминов, ${tagMap.size} уникальных тегов:`);
  for (const [id, label] of tagMap) console.log(`   ${id} ← "${label}"`);

  // Краткая сводка первых 3 записей для верификации маппинга
  for (const rec of records.slice(0, 3)) {
    console.log(`   • ${rec.slug} | tags=[${rec.tagIds.join(",")}] | desc.len=${rec.description.length} | sections.paragraphs=${rec.sectionParagraphs.length}`);
  }

  if (process.env.DRY_RUN === "1") {
    console.log("→ DRY_RUN=1: пропускаю запись в БД");
    await prisma.$disconnect();
    return;
  }

  // 1. Удаление статей
  const articlesDeleted = await prisma.article.deleteMany({});
  console.log(`→ Удалено статей: ${articlesDeleted.count}`);

  // 2. Удаление терминов
  const termsDeleted = await prisma.glossaryTerm.deleteMany({});
  console.log(`→ Удалено терминов глоссария: ${termsDeleted.count}`);

  // 3. Удаление пользовательских тегов (системные остаются)
  const tagsDeleted = await prisma.mediaTag.deleteMany({ where: { system: false } });
  console.log(`→ Удалено пользовательских MediaTag: ${tagsDeleted.count}`);

  // 4. Создание новых тегов
  for (const [id, label] of tagMap) {
    await prisma.mediaTag.create({
      data: {
        id,
        label,
        disabled: false,
        system: false,
        cardColor: null,
        seo: undefined,
      },
    });
  }
  console.log(`→ Создано MediaTag: ${tagMap.size}`);

  // 5. Создание терминов
  let created = 0;
  for (const rec of records) {
    const gender: Gender = guessGender(rec.title.trim().split(/\s+/).pop() ?? "");
    const autoAliases = generateAutoAliases(rec.title, gender);
    const sections = buildSections(rec.sectionParagraphs);
    await prisma.glossaryTerm.create({
      data: {
        slug: rec.slug,
        status: "published",
        title: rec.title,
        description: rec.description,
        tagIds: rec.tagIds,
        metaTitle: rec.metaTitle,
        metaDescription: rec.metaDescription,
        content: {
          order: rec.order,
          sections,
          pinned: false,
          pinnedOrder: 0,
          aliases: [],
          autoAliases,
          gender,
        },
      },
    });
    created++;
  }
  console.log(`→ Создано терминов: ${created}`);

  await prisma.$disconnect();
  console.log("✓ Готово.");
}

main().catch(async (err) => {
  console.error(err);
  await prisma.$disconnect();
  process.exit(1);
});
