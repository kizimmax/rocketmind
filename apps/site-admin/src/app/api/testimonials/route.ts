import { NextResponse } from "next/server";
import path from "path";

const isStatic = process.env.NEXT_PUBLIC_STATIC === "1";
const SITE_ROOT = path.resolve(process.cwd(), "..", "site");
const FILE = path.join(SITE_ROOT, "content", "_testimonials.json");
const PUBLIC_DIR = path.join(SITE_ROOT, "public");

const EXT_TO_MIME: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
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

/** Inline avatar files as data URLs for admin display. */
function inlineAvatar(fs: typeof import("fs"), src: string | null): string | null {
  if (!src) return null;
  if (src.startsWith("data:")) return src;
  const fp = path.join(PUBLIC_DIR, src);
  if (!fs.existsSync(fp)) return src;
  const ext = path.extname(fp).toLowerCase();
  const mime = EXT_TO_MIME[ext] || "application/octet-stream";
  return `data:${mime};base64,${fs.readFileSync(fp).toString("base64")}`;
}

/** GET /api/testimonials — list */
export async function GET() {
  if (isStatic) return NextResponse.json([]);
  const fs = await import("fs");
  const items = readAll(fs).sort((a, b) => a.order - b.order);
  return NextResponse.json(
    items.map((t) => ({ ...t, avatar: inlineAvatar(fs, t.avatar) })),
  );
}

/** POST /api/testimonials — create */
export async function POST(request: Request) {
  if (isStatic) return NextResponse.json(null, { status: 501 });
  const fs = await import("fs");
  const body = await request.json();

  const name = typeof body.name === "string" ? body.name : "";
  // Generate id from name (simple slug) + random suffix
  const baseId = name
    .toLowerCase()
    .trim()
    .replace(/[^a-zа-яё0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 32) || "testimonial";

  const items = readAll(fs);
  let id = baseId;
  let n = 1;
  while (items.some((t) => t.id === id)) {
    id = `${baseId}-${n++}`;
  }

  const newItem: StoredTestimonial = {
    id,
    order: items.length,
    paragraphs: Array.isArray(body.paragraphs)
      ? body.paragraphs.filter((p: unknown): p is string => typeof p === "string")
      : [""],
    name,
    position: typeof body.position === "string" ? body.position : "",
    avatar: null,
    gender: body.gender === "f" ? "f" : "m",
  };

  items.push(newItem);
  writeAll(fs, items);
  return NextResponse.json(newItem, { status: 201 });
}
