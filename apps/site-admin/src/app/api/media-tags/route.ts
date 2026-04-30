import { NextResponse } from "next/server";
import path from "path";

const isStatic = process.env.NEXT_PUBLIC_STATIC === "1";
const SITE_ROOT = path.resolve(process.cwd(), "..", "site");
const MEDIA_DIR = path.join(SITE_ROOT, "content", "media");
const TAGS_FILE = path.join(MEDIA_DIR, "_tags.json");

interface MediaTagSeo {
  pageTitlePrefix?: string;
  pageTitleAccent?: string;
  metaTitle?: string;
  metaDescription?: string;
  intro?: string;
}

type DsAccentColor =
  | "yellow"
  | "violet"
  | "sky"
  | "terracotta"
  | "pink"
  | "blue"
  | "red"
  | "green";

interface MediaTag {
  id: string;
  label: string;
  createdAt?: string;
  disabled?: boolean;
  seo?: MediaTagSeo;
  system?: boolean;
  cardColor?: DsAccentColor;
}

const SEO_KEYS = [
  "pageTitlePrefix",
  "pageTitleAccent",
  "metaTitle",
  "metaDescription",
  "intro",
] as const;

const DS_ACCENT_COLORS: ReadonlyArray<DsAccentColor> = [
  "yellow",
  "violet",
  "sky",
  "terracotta",
  "pink",
  "blue",
  "red",
  "green",
];

/**
 * Системные теги. Не могут быть удалены — даже если PUT не содержит их в массиве,
 * сервер дописывает их обратно с дефолтами (или мерджит с пользовательскими
 * правками label/SEO/cardColor, если они присланы).
 */
const SYSTEM_TAG_DEFAULTS: ReadonlyArray<MediaTag> = [
  { id: "lesson", label: "Урок", system: true, cardColor: "sky" },
  { id: "case", label: "Кейс", system: true, cardColor: "terracotta" },
];

function sanitizeSeo(raw: unknown): MediaTagSeo | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const r = raw as Record<string, unknown>;
  const out: MediaTagSeo = {};
  for (const k of SEO_KEYS) {
    const v = r[k];
    if (typeof v === "string" && v.trim()) out[k] = v;
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

function readTags(fs: typeof import("fs")): MediaTag[] {
  if (!fs.existsSync(TAGS_FILE)) return [];
  try {
    const raw = fs.readFileSync(TAGS_FILE, "utf-8");
    const json = JSON.parse(raw) as { tags?: MediaTag[] };
    return Array.isArray(json.tags) ? json.tags : [];
  } catch {
    return [];
  }
}

function sanitize(tags: unknown): MediaTag[] {
  if (!Array.isArray(tags)) return [];
  return tags
    .map((t): MediaTag | null => {
      if (!t || typeof t !== "object") return null;
      const r = t as Record<string, unknown>;
      const id = typeof r.id === "string" ? r.id.trim() : "";
      const label = typeof r.label === "string" ? r.label.trim() : "";
      if (!id || !label) return null;
      const createdAt =
        typeof r.createdAt === "string" ? r.createdAt : undefined;
      const disabled = r.disabled === true ? true : undefined;
      const seo = sanitizeSeo(r.seo);
      const cardColor =
        typeof r.cardColor === "string" &&
        (DS_ACCENT_COLORS as readonly string[]).includes(r.cardColor)
          ? (r.cardColor as DsAccentColor)
          : undefined;
      const tag: MediaTag = createdAt ? { id, label, createdAt } : { id, label };
      if (disabled) tag.disabled = true;
      if (seo) tag.seo = seo;
      if (cardColor) tag.cardColor = cardColor;
      // `system` ставится сервером в `withSystemTags`, не доверяем клиенту.
      return tag;
    })
    .filter((t): t is MediaTag => t !== null);
}

/**
 * Гарантирует, что результат содержит все системные теги, даже если клиент
 * прислал массив без них. Пользовательские правки label/SEO/cardColor у
 * системных тегов сохраняются. Системные теги не могут быть удалены.
 */
function withSystemTags(tags: MediaTag[]): MediaTag[] {
  const byId = new Map(tags.map((t) => [t.id, t]));
  const merged: MediaTag[] = [];

  for (const def of SYSTEM_TAG_DEFAULTS) {
    const user = byId.get(def.id);
    byId.delete(def.id);
    const next: MediaTag = {
      ...def,
      ...(user ?? {}),
      id: def.id,
      label: user?.label?.trim() || def.label,
      system: true,
      cardColor: user?.cardColor ?? def.cardColor,
    };
    if (!user?.createdAt) next.createdAt = new Date().toISOString();
    merged.push(next);
  }

  for (const t of tags) {
    if (!byId.has(t.id)) continue;
    // не системный — пробрасываем без флага `system`.
    const { system: _ignored, ...rest } = t;
    void _ignored;
    merged.push(rest);
  }

  return merged;
}

/** GET /api/media-tags — вернуть массив тегов из _tags.json (+ системные). */
export async function GET() {
  if (isStatic) {
    return NextResponse.json({ tags: withSystemTags([]) });
  }
  const fs = await import("fs");
  return NextResponse.json({ tags: withSystemTags(readTags(fs)) });
}

/**
 * PUT /api/media-tags — заменить весь список тегов в _tags.json.
 *
 * Store на клиенте — источник истины во время сессии: считает next-state
 * локально (upsert/rename/delete), дергает PUT с новым массивом. Для single-
 * admin-юзкейса этого достаточно; конкурентные правки не предполагаются.
 */
export async function PUT(request: Request) {
  if (isStatic) return NextResponse.json(null, { status: 501 });
  const fs = await import("fs");

  const body = (await request.json().catch(() => null)) as
    | { tags?: unknown }
    | null;
  if (!body) return NextResponse.json({ error: "invalid json" }, { status: 400 });

  const tags = withSystemTags(sanitize(body.tags));

  if (!fs.existsSync(MEDIA_DIR)) fs.mkdirSync(MEDIA_DIR, { recursive: true });
  fs.writeFileSync(TAGS_FILE, JSON.stringify({ tags }, null, 2) + "\n", "utf-8");

  return NextResponse.json({ ok: true, tags });
}
