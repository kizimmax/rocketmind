import { NextResponse } from "next/server";
import path from "path";

const isStatic = process.env.NEXT_PUBLIC_STATIC === "1";
const SITE_ROOT = path.resolve(process.cwd(), "..", "site");
const FILE = path.join(SITE_ROOT, "content", "_testimonials.json");
const PUBLIC_DIR = path.join(SITE_ROOT, "public");
const TESTIMONIALS_DIR = path.join(PUBLIC_DIR, "images", "testimonials");

const IMAGE_EXTS = [".jpg", ".jpeg", ".png", ".webp", ".svg"];
const MIME_TO_EXT: Record<string, string> = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/webp": ".webp",
  "image/svg+xml": ".svg",
};

type StoredTestimonial = {
  id: string;
  order: number;
  paragraphs: string[];
  name: string;
  position: string;
  avatar: string | null;
  gender: "m" | "f";
};

function readAll(fs: typeof import("fs")): StoredTestimonial[] {
  if (!fs.existsSync(FILE)) return [];
  try {
    const raw = JSON.parse(fs.readFileSync(FILE, "utf-8")) as { items?: Partial<StoredTestimonial>[] };
    const items = Array.isArray(raw.items) ? raw.items : [];
    return items.map((t) => ({
      id: String(t.id ?? ""),
      order: typeof t.order === "number" ? t.order : 0,
      paragraphs: Array.isArray(t.paragraphs) ? t.paragraphs.filter((p): p is string => typeof p === "string") : [],
      name: typeof t.name === "string" ? t.name : "",
      position: typeof t.position === "string" ? t.position : "",
      avatar: typeof t.avatar === "string" ? t.avatar : null,
      gender: t.gender === "f" ? "f" : "m",
    }));
  } catch {
    return [];
  }
}

function writeAll(fs: typeof import("fs"), items: StoredTestimonial[]) {
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify({ items }, null, 2), "utf-8");
}

function parseDataUrl(dataUrl: string): { ext: string; buffer: Buffer } | null {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) return null;
  const ext = MIME_TO_EXT[match[1]] || null;
  if (!ext) return null;
  return { ext, buffer: Buffer.from(match[2], "base64") };
}

function deleteAvatarFiles(fs: typeof import("fs"), id: string) {
  for (const ext of IMAGE_EXTS) {
    const fp = path.join(TESTIMONIALS_DIR, id + ext);
    if (fs.existsSync(fp)) fs.unlinkSync(fp);
  }
}

function saveAvatar(fs: typeof import("fs"), id: string, dataUrl: string): string | null {
  const parsed = parseDataUrl(dataUrl);
  if (!parsed) return null;
  fs.mkdirSync(TESTIMONIALS_DIR, { recursive: true });
  deleteAvatarFiles(fs, id);
  fs.writeFileSync(path.join(TESTIMONIALS_DIR, id + parsed.ext), parsed.buffer);
  return `/images/testimonials/${id}${parsed.ext}`;
}

/** PUT /api/testimonials/[id] — update */
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (isStatic) return NextResponse.json(null, { status: 501 });
  const fs = await import("fs");
  const { id } = await params;
  const body = await request.json();

  const items = readAll(fs);
  const idx = items.findIndex((t) => t.id === id);
  if (idx < 0) return NextResponse.json({ error: "not found" }, { status: 404 });

  const cur = items[idx];

  // Avatar handling: data URL → save file; null → delete; existing path → keep
  let avatar: string | null = cur.avatar;
  if (typeof body.avatar === "string") {
    if (body.avatar.startsWith("data:")) {
      avatar = saveAvatar(fs, id, body.avatar);
    } else if (body.avatar !== cur.avatar) {
      avatar = body.avatar;
    }
  } else if (body.avatar === null) {
    deleteAvatarFiles(fs, id);
    avatar = null;
  }

  items[idx] = {
    ...cur,
    paragraphs: Array.isArray(body.paragraphs)
      ? body.paragraphs.filter((p: unknown): p is string => typeof p === "string")
      : cur.paragraphs,
    name: typeof body.name === "string" ? body.name : cur.name,
    position: typeof body.position === "string" ? body.position : cur.position,
    avatar,
    order: typeof body.order === "number" ? body.order : cur.order,
    gender: body.gender === "m" || body.gender === "f" ? body.gender : (cur.gender ?? "m"),
  };

  writeAll(fs, items);
  return NextResponse.json(items[idx]);
}

/** DELETE /api/testimonials/[id] */
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (isStatic) return NextResponse.json(null, { status: 501 });
  const fs = await import("fs");
  const { id } = await params;
  const items = readAll(fs);
  const idx = items.findIndex((t) => t.id === id);
  if (idx < 0) return NextResponse.json({ error: "not found" }, { status: 404 });
  deleteAvatarFiles(fs, id);
  items.splice(idx, 1);
  // Re-number order
  items.forEach((t, i) => { t.order = i; });
  writeAll(fs, items);
  return NextResponse.json({ ok: true });
}
