/**
 * Импорт продуктовых страниц из docs/product_new/{xlsx,csv} в Prisma Page.
 *
 * Pipeline:
 *  1) Python скрипт `dump-products-source.py` → `.products-source.json` (8 продуктов)
 *  2) Этот TS читает JSON, парсит каждый блок ru_label → структуру Page.content,
 *     делает deep-merge поверх существующего content (сохраняет heroImageData,
 *     customSections и прочее что не было в таблице) и upsert.
 *  3) Sync mode: всё что НЕ в таблице (но в категориях consulting/ai-products/academy)
 *     → status="hidden" (не hard delete, для безопасности).
 *
 * Запуск:
 *   cd apps/site-admin
 *   python3 scripts/dump-products-source.py
 *   DATABASE_URL='...' npx tsx scripts/import-products.ts          # dry-run
 *   DATABASE_URL='...' npx tsx scripts/import-products.ts --write
 *   DATABASE_URL='...' npx tsx scripts/import-products.ts --only=consulting/ecosystem-strategy
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

// ── Types ─────────────────────────────────────────────────────────────────────

type SourceItem = {
  category: string;
  slug: string;
  sourceTitle: string;
  source: string;
  blocks: Record<string, string>;
};

type Factoid = { number: string; label: string; text: string };
type Step = { number: string; title: string; text: string; duration: string };
type Card = { title: string; text: string; wide?: boolean };
type AudienceFact = { title: string; text: string; wide: boolean };

const MANAGED_CATEGORIES = new Set(["consulting", "ai-products", "academy"]);

// ── Block label → canonical key ───────────────────────────────────────────────

const LABEL_TO_KEY: Record<string, string> = {
  "Герой (Hero)": "hero",
  "Герой": "hero",
  "Логотипы": "logos",
  "Социальное доказательство": "socialProof",
  "Доверие / Цифры": "socialProof",
  "О продукте (Ключевая ценность)": "about",
  "О продукте (ключевая ценность)": "about",
  "Что это за продукт / формат": "about",
  "Для кого это решение": "audience",
  "Для кого": "audience",
  "Инструменты": "tools",
  "Твердые результаты": "results",
  "Твёрдые результаты": "results",
  "Результаты": "results",
  "Прозрачный процесс (Этапы)": "process",
  "Прозрачный процесс (Как начать работу)": "process",
  "Программа курса": "process_academy",
  "Продолжительность работы": "duration",
  "Эксперт продукта": "expert",
  "Эксперты / преподаватели": "experts",
  "Почему Rocketmind": "whyRocketmind",
  "Призыв к действию (CTA)": "cta",
  "CTA": "cta",
  "Кейсы": "_skip",
  "Отзывы": "_skip",
  "Кейсы+отзывы": "_skip",
  // Product-specific extras — попадут в customSections[]
  "Пакеты сопровождения (список пакетов в виде карточек)": "_custom",
  "Что входит в заявку": "_custom",
  "Поддержка после диагностики": "_custom",
};

function canonicalKey(label: string): string {
  return LABEL_TO_KEY[label] ?? "_unknown";
}

// ── Text utils ────────────────────────────────────────────────────────────────

function cleanLines(text: string): string[] {
  return text
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
}

function splitParagraphs(text: string): string[] {
  return text
    .replace(/\r\n?/g, "\n")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
}

function firstSentence(text: string): string {
  const m = text.match(/^[^.!?]+[.!?]?/);
  return (m ? m[0] : text).trim();
}

// ── Parsers ───────────────────────────────────────────────────────────────────

function parseHero(text: string): { title: string; titleSecondary?: string; description: string } {
  const t = text.trim().replace(/​/g, "");
  const lines = t.split(/\n/).map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) return { title: "", description: "" };

  // Многострочный hero: первая строка = title, остальное = description.
  if (lines.length > 1) {
    return { title: lines[0].replace(/[.!?]+$/, "").trim(), description: lines.slice(1).join("\n\n") };
  }

  const single = lines[0];
  const tokens = single.split(/\s+/);
  const isCaps = (w: string) => {
    const letters = w.replace(/[^\p{L}]/gu, "");
    if (!letters) return true;
    return letters === letters.toUpperCase();
  };
  // Все ведущие ALL-CAPS токены = title.
  let i = 0;
  while (i < tokens.length && isCaps(tokens[i])) i++;
  if (i === 0) return { title: single, description: "" };
  const titlePart = tokens.slice(0, i).join(" ").trim().replace(/[.!?]+$/, "");
  const rest = tokens.slice(i).join(" ").trim();
  // Если title содержит `:` — делим на title и titleSecondary
  const colonIdx = titlePart.indexOf(":");
  if (colonIdx > 0) {
    const title = titlePart.slice(0, colonIdx).trim();
    const titleSecondary = titlePart.slice(colonIdx + 1).trim();
    return { title, titleSecondary, description: rest };
  }
  return { title: titlePart, description: rest };
}

function parseFactoids(text: string): Factoid[] {
  return cleanLines(text).map((line): Factoid => {
    // Phase 1: попробовать `<number> — <text>` (em-dash)
    const dashMatch = line.match(/^([^—]{1,12})\s*[—–-]\s*(.+)$/);
    if (dashMatch && /\d/.test(dashMatch[1])) {
      return { number: dashMatch[1].trim(), label: "", text: dashMatch[2].trim() };
    }
    // Phase 2: первый «numeric token» (с цифрой) + остальное
    const numMatch = line.match(/^([+\-]?[\d–\-+%.,\/×x]+[\s]*[%a-zа-я]*[+]?)\s+(.+)$/i);
    if (numMatch && /\d/.test(numMatch[1])) {
      return { number: numMatch[1].trim(), label: "", text: numMatch[2].trim() };
    }
    // Иначе — кладём всё в text
    return { number: "", label: "", text: line };
  });
}

function parseAbout(text: string): { description: string } {
  // Первая строка — часто это заголовок-фраза; конкатим всё как description.
  return { description: text.trim() };
}

function splitBulletPoints(text: string): string[] {
  // Поддерживает три формата:
  //  1) Строки через \n, каждая начинается с `-` или `•`
  //  2) Inline через ` - ` (space-dash-space)
  //  3) Без буллетов: каждый \n-параграф = пункт
  let t = text.trim();
  // Уберём intro перед первым `-` если он "lead-in:" типа «Кому это необходимо: »
  const introMatch = t.match(/^[^-•\n]{1,120}:\s*-/);
  if (introMatch) t = t.slice(introMatch[0].length - 1);
  // 1. Если есть \n-, делим по \n + опциональный дефис
  if (/\n\s*-/.test(t)) {
    return t.split(/\n\s*-\s*/).map((s) => s.trim()).filter(Boolean);
  }
  // 2. Если есть ` - `, делим по нему
  if (/\s-\s/.test(t)) {
    return t.split(/\s-\s+/).map((s) => s.trim()).filter(Boolean);
  }
  // 3. Иначе строки
  return cleanLines(t);
}

function parseAudience(text: string): AudienceFact[] {
  const points = splitBulletPoints(text);
  const items: AudienceFact[] = [];
  for (const point of points) {
    const body = point.replace(/^[-•*]\s*/, "").trim();
    if (body.length < 5) continue;
    let title = "", txt = body;
    const colon = body.match(/^([^:]{2,80}):\s*(.+)$/s);
    const dash = body.match(/^([^—]{2,80})\s+[—–]\s+(.+)$/s);
    if (colon) { title = colon[1].trim(); txt = colon[2].trim(); }
    else if (dash) { title = dash[1].trim(); txt = dash[2].trim(); }
    items.push({ title, text: txt, wide: false });
  }
  if (items.length === 3) items[2].wide = true;
  return items;
}

function parseToolsBlock(text: string): { description: string; tools: { number: string; title: string; text: string }[] } {
  // CSV «Инструменты» обычно — описательный текст без явного нумерованного списка.
  // Кладём в description, tools[] = [].
  return { description: text.trim(), tools: [] };
}

function parseResults(text: string): { cards: Card[]; description: string } {
  // 1) Numbered list (`1. X 2. Y ...`)
  const numbered = [...text.matchAll(/(?:^|\n|\s)(\d+)\.\s+([^\n]+(?:\n(?!\s*\d+\.\s|\s*-\s).+)*)/g)];
  if (numbered.length >= 2) {
    return {
      cards: numbered.map((m): Card => {
        const body = m[2].trim();
        const cm = body.match(/^([^:]{2,80}):\s*(.+)$/s);
        return cm ? { title: cm[1].trim(), text: cm[2].trim() }
                  : { title: firstSentence(body).replace(/[.!?]+$/, "").slice(0, 80), text: body };
      }),
      description: "",
    };
  }
  // 2) Через `\n` строки. Первая может быть subtitle.
  const lines = cleanLines(text);
  let description = "";
  let cardLines = lines;
  if (lines.length > 1 && lines[0].length < 80 && !lines[0].match(/[:—–]/)) {
    description = lines[0];
    cardLines = lines.slice(1);
  }
  if (cardLines.length >= 2) {
    return {
      cards: cardLines.map((line): Card => {
        const body = line.replace(/^[-•*]\s*/, "").trim();
        const cm = body.match(/^([^:]{2,80}):\s*(.+)$/s);
        if (cm) return { title: cm[1].trim(), text: cm[2].trim() };
        // Эвристика: «Title<space><uppercase-letter>...rest» — первое предложение/фраза = title, остальное = text
        const splitMatch = body.match(/^([А-ЯЁA-Z][^.А-ЯЁA-Z]+?[а-яёa-z])\s+([А-ЯЁA-Z].+)$/s);
        if (splitMatch) return { title: splitMatch[1].trim().slice(0, 80), text: splitMatch[2].trim() };
        return { title: firstSentence(body).replace(/[.!?]+$/, "").slice(0, 80), text: body };
      }),
      description,
    };
  }
  // 3) Inline через ` - `
  const bullets = splitBulletPoints(text);
  if (bullets.length >= 2) {
    return {
      cards: bullets.map((b): Card => {
        const body = b.replace(/^[-•*]\s*/, "").trim();
        const cm = body.match(/^([^:]{2,80}):\s*(.+)$/s);
        return cm ? { title: cm[1].trim(), text: cm[2].trim() }
                  : { title: firstSentence(body).replace(/[.!?]+$/, "").slice(0, 80), text: body };
      }),
      description,
    };
  }
  return { cards: [{ title: "", text: text.trim() }], description: "" };
}

function parseProcess(text: string, variant: "default" | "academy"): { steps: Step[]; subtitle: string; description: string; variant?: string } {
  let chunks: string[];
  let subtitle = "";
  let description = "";

  // Spec формат «СРОК: …» (как у smart-analytics): группы по 3 строки (title / duration / text).
  // CAPS-only, чтобы не зацепить `Срок:` inline в нумерованных списках.
  if (/(^|\n)\s*СРОК:/.test(text)) {
    const lines = cleanLines(text);
    const steps: Step[] = [];
    let i = 0;
    let stepIdx = 0;
    while (i < lines.length) {
      const title = lines[i];
      const next = lines[i + 1] ?? "";
      const dur = next.match(/^СРОК:\s*(.+)$/);
      if (dur) {
        // duration line — title уже считан, дальше собираем текст до следующего "СРОК:" или конца
        let j = i + 2;
        const textLines: string[] = [];
        while (j < lines.length && !/^СРОК:/i.test(lines[j + 1] ?? "")) {
          textLines.push(lines[j]);
          j++;
          // Last step: dump rest if next "СРОК:" не найден
          if (j >= lines.length) break;
        }
        // textLines includes everything до строки прямо ПЕРЕД следующим title (которая идёт перед СРОК:)
        // Точнее: title строки последующих шагов — это lines[i] перед СРОК:. Поэтому собираем до lines[j-1] (текст), а lines[j] = title следующего шага.
        stepIdx++;
        steps.push({
          number: String(stepIdx).padStart(2, "0"),
          title: title.replace(/[.!?]+$/, "").trim(),
          text: textLines.join(" ").trim(),
          duration: dur[1].trim(),
        });
        i = j;
      } else {
        i++;
      }
    }
    if (steps.length > 0) return { steps, subtitle, description };
  }

  if (/Модуль\s+\d+\./i.test(text)) {
    chunks = text.split(/(?:^|\s)Модуль\s+\d+\.\s*/i).map((s) => s.trim()).filter(Boolean);
  } else {
    // Стратегия: найти `1.`, всё что до него = intro/subtitle, всё после = шаги.
    const firstNum = text.search(/(?:^|\s)1\.\s/);
    if (firstNum >= 0) {
      const intro = text.slice(0, firstNum).trim().replace(/[:.]\s*$/, "");
      if (intro) subtitle = intro;
      const rest = text.slice(firstNum).replace(/^[\s]+/, "");
      // После первого `1.` шаги могут идти через `\d+\.` ИЛИ через `\n` (без нумерации)
      // Сначала пробуем сплит по `\d+\.`
      const numbered = rest.split(/(?:^|\s)\d+\.\s+/).map((s) => s.trim()).filter(Boolean);
      if (numbered.length >= 2) {
        chunks = numbered;
      } else {
        // Только первый пункт нумерован — остальные через `\n`
        const lines = rest.split(/\n/).map((l) => l.trim()).filter(Boolean);
        if (lines.length >= 2) {
          // первая строка может содержать `1. Title: ...` — убираем `1. `
          lines[0] = lines[0].replace(/^\d+\.\s*/, "");
          chunks = lines;
        } else {
          chunks = [rest];
        }
      }
    } else {
      // Нет нумерации вообще — параграфы
      chunks = splitParagraphs(text);
    }
  }

  // Academy: первый чанк (до первого "Модуль N.") = intro/description курса, не шаг
  if (variant === "academy" && chunks.length > 1 && !/Модуль\s+\d+/i.test(chunks[0])) {
    const intro = chunks.shift()!.trim();
    const parts = splitParagraphs(intro);
    if (parts.length > 1) {
      subtitle = subtitle || parts[0];
      description = parts.slice(1).join("\n\n");
    } else {
      subtitle = subtitle || intro;
    }
  }

  // Уберём «вовлекаются ...» хвост — это participants, не шаг
  if (chunks.length > 0 && /^вовлекаются|^вовлечены/i.test(chunks[chunks.length - 1])) {
    chunks.pop();
  }

  const steps: Step[] = chunks.map((chunk, idx): Step => {
    const body = chunk.trim();
    const colon = body.match(/^([^:]{2,80}):\s*(.+)$/s);
    const dash = body.match(/^([^—]{2,80})\s+[—–]\s+(.+)$/s);
    let title = "", txt = body;
    if (colon) { title = colon[1]; txt = colon[2]; }
    else if (dash) { title = dash[1]; txt = dash[2]; }
    else {
      // Title = первое предложение (до точки или 60 char)
      const fs = firstSentence(body).replace(/[.!?]+$/, "").trim();
      if (fs.length < body.length - 10) {
        title = fs.slice(0, 80);
        txt = body.slice(fs.length).replace(/^[.!?\s]+/, "").trim();
      }
    }
    return {
      number: variant === "academy" ? `Модуль ${idx + 1}` : String(idx + 1).padStart(2, "0"),
      title: title.trim(),
      text: txt.trim(),
      duration: "",
    };
  });
  return { steps, subtitle, description, variant: variant === "academy" ? "academy" : undefined };
}

function parseExpert(text: string, expertsByName: Map<string, string>): { slug: string | null; name: string; role: string } {
  const t = text.trim();
  if (!t) return { slug: null, name: "", role: "" };
  // Найдём имя в первой строке (1-3 русских слова с заглавных)
  const firstLine = t.split("\n")[0].trim();
  const nameMatch = firstLine.match(/^([А-ЯЁA-Z][А-Яа-яёЁA-Za-z-]+(?:\s+[А-ЯЁA-Z][А-Яа-яёЁA-Za-z-]+){0,3})/);
  if (!nameMatch) return { slug: null, name: "", role: t };
  const name = nameMatch[1].trim();
  const slug = expertsByName.get(name.replace(/ё/g, "е").toLowerCase()) ?? null;
  let role = t.slice(firstLine.length).trim();
  if (!role) {
    // Имя и роль в одной строке через `—`
    const dashed = firstLine.match(/^(.+?)\s+[—–-]\s+(.+)$/);
    if (dashed) {
      const nm = dashed[1].trim();
      const slug2 = expertsByName.get(nm.replace(/ё/g, "е").toLowerCase()) ?? null;
      return { slug: slug2, name: nm, role: dashed[2].trim() };
    }
  }
  // Срежем ведущий разделитель если остался
  role = role.replace(/^[—–\-\.\s]+/, "").trim();
  return { slug, name, role };
}

function parseExperts(text: string, expertsByName: Map<string, string>): Array<{ slug: string | null; name: string; role: string }> {
  // Список нескольких экспертов, разделённых пустой строкой или явно "ФИО.\n"
  const paragraphs = splitParagraphs(text);
  return paragraphs.map((p) => parseExpert(p, expertsByName));
}

function parseWhyRocketmind(text: string): Array<{ title: string; text: string }> {
  // Удалим хвост типа «АЛЕКСЕЙ ЕРЁМИН\n Основатель Rocketmind…» — это про-эксперта,
  // не пункт «почему мы».
  let t = text.replace(/\r\n?/g, "\n").trim();
  t = t.replace(/\n\s*[А-ЯЁ]{3,}[\s А-ЯЁ]*\n[\s\S]*$/u, "").trim();

  // Format A: маркированные `-Заголовок\n текст\n -Заголовок2\n…`
  if (/^\s*-/.test(t) || /\n\s*-/.test(t)) {
    const lines = t.split("\n").map((l) => l.trim()).filter(Boolean);
    const items: Array<{ title: string; text: string }> = [];
    let current: { title: string; text: string } | null = null;
    for (const line of lines) {
      const bullet = line.match(/^-\s*(.+)$/);
      if (bullet) {
        if (current) items.push(current);
        current = { title: bullet[1].trim(), text: "" };
      } else if (current) {
        current.text = current.text ? current.text + " " + line : line;
      }
    }
    if (current) items.push(current);
    if (items.length > 0) return items;
  }

  // Format B: без буллетов, через `\n` параграфы. Title до `:`, text после.
  const lines = cleanLines(t);
  const items: Array<{ title: string; text: string }> = [];
  for (const line of lines) {
    const colon = line.match(/^([^:]{2,80}):\s*(.+)$/s);
    if (colon) {
      items.push({ title: colon[1].trim(), text: colon[2].trim() });
    } else {
      // первое предложение = title
      const fs = firstSentence(line).replace(/[.!?]+$/, "").trim();
      if (fs.length < line.length - 5) {
        items.push({ title: fs.slice(0, 80), text: line.slice(fs.length).replace(/^[.!?\s]+/, "").trim() });
      } else {
        items.push({ title: fs.slice(0, 80), text: "" });
      }
    }
  }
  return items;
}

function parseCta(text: string): { title: string; text: string } {
  // Чистим хвосты типа «👉 [Кнопка: ...]» и «rocketmind_products_content.xlsx​»
  let t = text.trim()
    .replace(/​/g, "")
    .replace(/[👉↗→]+\s*\[[^\]]*\]\s*/g, " ")
    .replace(/rocketmind_products_content\.xlsx/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();
  // Inline split: заголовок ВЕРХНЕМ регистром + остальной текст
  const headerMatch = t.match(/^([А-ЯЁA-Z][А-ЯЁA-Z\s ?!.:,]{5,80}[?!.])\s+(.+)$/s);
  if (headerMatch) {
    return { title: headerMatch[1].trim(), text: headerMatch[2].trim() };
  }
  const lines = t.split(/\n/).map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) return { title: "", text: "" };
  const first = lines[0];
  if (first === first.toUpperCase() && first.length < 100 && lines.length > 1) {
    return { title: first, text: lines.slice(1).join(" ") };
  }
  return { title: "", text: t };
}

// ── Build new content from blocks ─────────────────────────────────────────────

function deepClone<T>(x: T): T { return JSON.parse(JSON.stringify(x)); }

function buildContent(
  item: SourceItem,
  existing: Record<string, unknown> | null,
  expertsByName: Map<string, string>,
): Record<string, unknown> {
  const out: Record<string, unknown> = existing ? deepClone(existing) : {};
  out.slug = item.slug;
  out.category = item.category;

  const isAcademy = item.category === "academy";
  const customSections: Array<{ title: string; text: string }> = Array.isArray(out.customSections)
    ? (out.customSections as Array<{ title: string; text: string }>)
    : [];
  // Очищаем customSections перед re-добавлением из CSV (avoids duplication on re-run)
  customSections.length = 0;

  for (const [label, raw] of Object.entries(item.blocks)) {
    const text = raw?.trim() ?? "";
    if (!text) continue;
    const key = canonicalKey(label);
    switch (key) {
      case "hero": {
        const h = parseHero(text);
        const prev = (out.hero ?? {}) as Record<string, unknown>;
        out.hero = {
          ...prev,
          title: h.title,
          ...(h.titleSecondary ? { titleSecondary: h.titleSecondary } : {}),
          description: h.description || prev.description || "",
          caption: prev.caption ||
            (item.category === "consulting" ? "консалтинг и стратегии" :
             item.category === "academy" ? "онлайн-школа" : "ии-продукты"),
          ctaText: prev.ctaText || "оставить заявку",
          factoids: prev.factoids ?? [],
          ...(prev.heroImageData ? { heroImageData: prev.heroImageData } : {}),
        };
        break;
      }
      case "socialProof": {
        const factoids = parseFactoids(text);
        const heroObj = (out.hero ?? {}) as Record<string, unknown>;
        heroObj.factoids = factoids;
        out.hero = heroObj;
        out.socialProof = { proofs: factoids };
        break;
      }
      case "about": {
        const a = parseAbout(text);
        const prev = (out.about ?? {}) as Record<string, unknown>;
        out.about = {
          ...prev,
          title: prev.title || item.sourceTitle.toLowerCase(),
          caption: prev.caption || "О продукте",
          description: a.description,
          accordion: Array.isArray(prev.accordion) ? prev.accordion : [],
          accordionCollapsible: typeof prev.accordionCollapsible === "boolean" ? prev.accordionCollapsible : true,
          hasImage: prev.hasImage ?? false,
        };
        break;
      }
      case "audience": {
        const facts = parseAudience(text);
        const prev = (out.audience ?? {}) as Record<string, unknown>;
        out.audience = {
          ...prev,
          tag: prev.tag || "для кого",
          title: prev.title || "Для кого это решение",
          subtitle: prev.subtitle || "",
          facts,
          wideColumn: prev.wideColumn || "right",
        };
        break;
      }
      case "tools": {
        const t = parseToolsBlock(text);
        const prev = (out.tools ?? {}) as Record<string, unknown>;
        out.tools = {
          ...prev,
          tag: prev.tag || "инструменты",
          title: prev.title || "С чем вы работаете",
          description: t.description,
          tools: Array.isArray(prev.tools) && (prev.tools as unknown[]).length > 0 ? prev.tools : t.tools,
        };
        break;
      }
      case "results": {
        const r = parseResults(text);
        const prev = (out.results ?? {}) as Record<string, unknown>;
        out.results = {
          ...prev,
          tag: prev.tag || "результат",
          title: prev.title || (isAcademy ? "Результаты" : "Твёрдые результаты"),
          description: r.description || prev.description || "",
          cards: r.cards,
        };
        break;
      }
      case "process": {
        const p = parseProcess(text, "default");
        const prev = (out.process ?? {}) as Record<string, unknown>;
        out.process = {
          ...prev,
          tag: prev.tag || "этапы",
          title: prev.title || "Прозрачный процесс",
          subtitle: p.subtitle || prev.subtitle || "",
          description: p.description || prev.description || "",
          steps: p.steps,
          participants: Array.isArray(prev.participants) ? prev.participants : [],
          participantsTag: prev.participantsTag || "кого важно включить в процесс",
        };
        break;
      }
      case "process_academy": {
        const p = parseProcess(text, "academy");
        const prev = (out.process ?? {}) as Record<string, unknown>;
        out.process = {
          ...prev,
          tag: prev.tag || "этапы",
          title: prev.title || "программа курса",
          variant: "academy",
          subtitle: p.subtitle || prev.subtitle || "",
          description: p.description || prev.description || "",
          steps: p.steps,
          participants: Array.isArray(prev.participants) ? prev.participants : [],
          participantsTag: prev.participantsTag || "Что важно иметь при себе",
        };
        break;
      }
      case "duration": {
        out.duration = text;
        break;
      }
      case "expert": {
        const e = parseExpert(text, expertsByName);
        out.expert = e.slug ? { slug: e.slug, name: e.name, role: e.role } : { name: e.name, role: e.role };
        break;
      }
      case "experts": {
        const list = parseExperts(text, expertsByName);
        out.experts = list.map((e) => e.slug ? { slug: e.slug, name: e.name, role: e.role } : { name: e.name, role: e.role });
        break;
      }
      case "whyRocketmind": {
        const items = parseWhyRocketmind(text);
        const prev = (out.whyRocketmind ?? {}) as Record<string, unknown>;
        out.whyRocketmind = {
          ...prev,
          tag: prev.tag || "почему мы",
          title: prev.title || "Почему Rocketmind",
          items,
        };
        break;
      }
      case "cta": {
        const c = parseCta(text);
        out.ctaBlock = c;
        break;
      }
      case "_custom": {
        customSections.push({ title: label, text });
        break;
      }
      case "_skip":
      case "logos":
        break;
      default:
        // unknown — кладём в customSections
        customSections.push({ title: label, text });
        break;
    }
  }
  out.customSections = customSections;
  return out;
}

// ── Page meta from content/source ─────────────────────────────────────────────

function buildPageMeta(item: SourceItem, content: Record<string, unknown>, existing: { name?: string; menuTitle?: string; menuDescription?: string; cardTitle?: string; cardDescription?: string; metaTitle?: string; metaDescription?: string } | null) {
  const hero = (content.hero ?? {}) as Record<string, unknown>;
  const title = (hero.title as string)?.trim() || item.sourceTitle;
  const description = (hero.description as string)?.trim() || "";
  // Меню/карточка/мета — пытаемся сохранить вручную выставленные значения, иначе генерим из таблицы
  const menuTitle = existing?.menuTitle?.trim() || title.replace(/[.!?]+$/, "").trim();
  const menuDescription = existing?.menuDescription || description.split(/[.!?]\s/)[0]?.slice(0, 160) || "";
  const cardTitle = existing?.cardTitle?.trim() || title.replace(/[.!?]+$/, "").trim();
  const cardDescription = existing?.cardDescription || description.slice(0, 200);
  const metaTitle = existing?.metaTitle || `${title.replace(/[.!?]+$/, "").trim()} | Rocketmind`;
  const metaDescription = existing?.metaDescription || description.slice(0, 200);
  // name — обычно technical (= slug), оставляем существующий
  const name = existing?.name || item.slug;
  return { name, menuTitle, menuDescription, cardTitle, cardDescription, metaTitle, metaDescription };
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const sourcePath = resolve(__dirname, ".products-source.json");
  const items: SourceItem[] = JSON.parse(readFileSync(sourcePath, "utf-8"));

  // Build expert name → slug map
  const allExperts = await prisma.expert.findMany({ select: { slug: true, content: true } });
  const expertsByName = new Map<string, string>();
  for (const e of allExperts) {
    const c = (e.content as Record<string, unknown>) ?? {};
    const name = typeof c.name === "string" ? c.name : "";
    if (!name) continue;
    expertsByName.set(name.replace(/ё/g, "е").toLowerCase(), e.slug);
  }

  console.log(`=== UPSERT ${items.length} products ===\n`);

  const sourceUrls = new Set(items.map((i) => `/${i.category}/${i.slug}`));

  for (const item of items) {
    const url = `/${item.category}/${item.slug}`;
    if (ONLY && !ONLY.has(`${item.category}/${item.slug}`) && !ONLY.has(item.slug)) continue;

    const existing = await prisma.page.findUnique({ where: { url } });
    const content = buildContent(item, (existing?.content as Record<string, unknown> | null) ?? null, expertsByName);
    const meta = buildPageMeta(item, content, existing ?? null);

    const action = existing ? "UPDATE" : "CREATE";
    console.log(`--- [${action}] ${url} (${item.sourceTitle}) ---`);
    const hero = content.hero as Record<string, unknown>;
    console.log(`  hero.title: ${(hero.title as string)?.slice(0, 80) || "(пусто)"}`);
    if (hero.titleSecondary) console.log(`  hero.titleSecondary: ${(hero.titleSecondary as string).slice(0, 80)}`);
    console.log(`  hero.description (${((hero.description as string) || "").length}): ${((hero.description as string) || "").slice(0, 100)}…`);
    console.log(`  hero.factoids: ${(hero.factoids as unknown[])?.length ?? 0}`);
    console.log(`  about.description (${((content.about as Record<string, unknown>)?.description as string || "").length})`);
    console.log(`  audience.facts: ${((content.audience as Record<string, unknown>)?.facts as unknown[])?.length ?? 0}`);
    console.log(`  tools: ${content.tools ? "✓" : "—"}`);
    console.log(`  process.steps: ${((content.process as Record<string, unknown>)?.steps as unknown[])?.length ?? 0}`);
    console.log(`  results.cards: ${((content.results as Record<string, unknown>)?.cards as unknown[])?.length ?? 0}`);
    console.log(`  expert: ${content.expert ? JSON.stringify((content.expert as { slug?: string; name?: string }).slug || (content.expert as { name?: string }).name) : "—"}`);
    console.log(`  experts: ${Array.isArray(content.experts) ? (content.experts as unknown[]).length : 0}`);
    console.log(`  whyRocketmind.items: ${((content.whyRocketmind as Record<string, unknown>)?.items as unknown[])?.length ?? 0}`);
    console.log(`  ctaBlock: ${content.ctaBlock ? ((content.ctaBlock as { text?: string }).text?.slice(0, 60) || "✓") : "—"}`);
    console.log(`  customSections: ${(content.customSections as unknown[])?.length ?? 0}`);
    console.log(`  → meta: menuTitle="${meta.menuTitle.slice(0, 50)}", cardTitle="${meta.cardTitle.slice(0, 50)}"`);

    if (WRITE) {
      const data = {
        slug: item.slug,
        url,
        category: item.category,
        ...meta,
        status: "published" as const,
        content: content as unknown as object,
      };
      if (existing) {
        await prisma.page.update({ where: { id: existing.id }, data });
      } else {
        await prisma.page.create({ data });
      }
    }
  }

  // Sync: hide pages in managed categories that are not in source
  console.log(`\n=== HIDE pages not in source ===\n`);
  const managedDb = await prisma.page.findMany({
    where: { category: { in: ["consulting", "ai-products", "academy"] } },
    select: { id: true, slug: true, url: true, category: true, status: true },
  });
  let hideCount = 0;
  let untouched = 0;
  for (const pg of managedDb) {
    if (sourceUrls.has(pg.url)) continue;
    untouched++;
    if (pg.status === "hidden") {
      console.log(`  [already hidden] ${pg.url}`);
      continue;
    }
    console.log(`  [HIDE] ${pg.url} (was: ${pg.status})`);
    if (WRITE) {
      await prisma.page.update({ where: { id: pg.id }, data: { status: "hidden" } });
    }
    hideCount++;
  }

  console.log(`\n=== SUMMARY ===`);
  console.log(`  mode: ${WRITE ? "WRITE" : "DRY-RUN"}`);
  console.log(`  upserts: ${items.length}${ONLY ? ` (filter: ${[...ONLY].join(",")})` : ""}`);
  console.log(`  to hide: ${hideCount} (already hidden / non-source: ${untouched - hideCount})`);

  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
