import { NextResponse } from "next/server";
import path from "path";

const isStatic = process.env.NEXT_PUBLIC_STATIC === "1";
const SITE_ROOT = path.resolve(process.cwd(), "..", "site");
const MEDIA_DIR = path.join(SITE_ROOT, "content", "media");
const TAGS_FILE = path.join(MEDIA_DIR, "_tags.json");

interface MediaTag {
  id: string;
  label: string;
  createdAt?: string;
  disabled?: boolean;
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
      const tag: MediaTag = createdAt ? { id, label, createdAt } : { id, label };
      if (disabled) tag.disabled = true;
      return tag;
    })
    .filter((t): t is MediaTag => t !== null);
}

/** GET /api/media-tags — вернуть массив тегов из _tags.json. */
export async function GET() {
  if (isStatic) return NextResponse.json({ tags: [] });
  const fs = await import("fs");
  return NextResponse.json({ tags: readTags(fs) });
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

  const tags = sanitize(body.tags);

  if (!fs.existsSync(MEDIA_DIR)) fs.mkdirSync(MEDIA_DIR, { recursive: true });
  fs.writeFileSync(TAGS_FILE, JSON.stringify({ tags }, null, 2) + "\n", "utf-8");

  return NextResponse.json({ ok: true, tags });
}
