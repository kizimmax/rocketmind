import { NextResponse } from "next/server";
import path from "path";
import crypto from "crypto";

const isStatic = process.env.NEXT_PUBLIC_STATIC === "1";
const SITE_ROOT = path.resolve(process.cwd(), "..", "site");
const LIBRARY_DIR = path.join(SITE_ROOT, "public", "media", "logos");
const CLIP_LOGOS_DIR = path.join(SITE_ROOT, "public", "clip-logos");

const SUPPORTED = new Set([".svg", ".png", ".jpg", ".jpeg", ".webp"]);
const UPLOAD_MIME_TO_EXT: Record<string, string> = {
  "image/svg+xml": ".svg",
};
const MAX_BYTES = 512 * 1024; // 512KB — SVG логотипы не должны быть больше

/**
 * Rocketmind-логотипы (наши). Путь — публичный src в apps/site/public.
 * Список фиксированный, не подтягивается из директории: чтобы случайные
 * рабочие картинки в public/ не попали в библиотеку как «наш лого».
 */
const ROCKETMIND_LOGOS: Array<{ src: string; name: string }> = [
  {
    src: "/text_logo_light_background_ru.svg",
    name: "Rocketmind RU (light)",
  },
  {
    src: "/text_logo_light_background_en.svg",
    name: "Rocketmind EN (light)",
  },
  {
    src: "/text_logo_dark_background_ru.svg",
    name: "Rocketmind RU (dark)",
  },
  {
    src: "/text_logo_dark_background_en.svg",
    name: "Rocketmind EN (dark)",
  },
  {
    // Mask-friendly вариант: rect + ellipses объединены одним path с
    // fill-rule="evenodd" — иначе при mask-image кружочки в иконке сливаются
    // со сплошным квадратом (альфа-маска не различает dark/white заливку).
    src: "/images/about/rocketmind-logo-mono.svg",
    name: "Rocketmind mark",
  },
];

export type LogoGroup = "rocketmind" | "partners";

export interface LogoLibraryItem {
  /** Публичный URL. */
  src: string;
  /** Отображаемое имя. */
  name: string;
  /** Группа в пикере: «Rocketmind» (наши) или «Партнёры» (клиенты/admin-загрузки). */
  group: LogoGroup;
}

function listDir(
  dir: string,
  publicPrefix: string,
  group: LogoGroup,
  fs: typeof import("fs"),
): LogoLibraryItem[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => SUPPORTED.has(path.extname(f).toLowerCase()))
    .map((filename) => ({
      src: `${publicPrefix}/${filename}`,
      name: filename.replace(/\.[^.]+$/, ""),
      group,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * GET /api/logos — общая библиотека, сгруппированная по `group`:
 *   rocketmind — фиксированный список наших логотипов из `apps/site/public`;
 *   partners   — мерж `apps/site/public/media/logos/` (админ-апилы) и
 *                `apps/site/public/clip-logos/` (существующий набор).
 */
export async function GET() {
  if (isStatic) return NextResponse.json([]);

  const fs = await import("fs");
  const rocketmind: LogoLibraryItem[] = ROCKETMIND_LOGOS.map((l) => ({
    ...l,
    group: "rocketmind" as const,
  }));
  const media = listDir(LIBRARY_DIR, "/media/logos", "partners", fs);
  const clip = listDir(CLIP_LOGOS_DIR, "/clip-logos", "partners", fs);

  // Дедуп партнёрских лого по имени (media-апилы приоритетнее clip).
  const seen = new Set<string>();
  const partners: LogoLibraryItem[] = [];
  for (const item of [...media, ...clip]) {
    if (seen.has(item.name)) continue;
    seen.add(item.name);
    partners.push(item);
  }

  return NextResponse.json([...rocketmind, ...partners]);
}

function parseDataUrl(
  dataUrl: unknown,
): { mime: string; buffer: Buffer } | null {
  if (typeof dataUrl !== "string") return null;
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) return null;
  return { mime: match[1], buffer: Buffer.from(match[2], "base64") };
}

function safeStem(name: string): string {
  return name
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40) || "logo";
}

/**
 * POST /api/logos — загрузка SVG в общую библиотеку `/public/media/logos/`.
 * body: { dataUrl: string, fileName?: string }
 * Возвращает: { url, fileName }
 */
export async function POST(request: Request) {
  if (isStatic) return NextResponse.json(null, { status: 501 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  if (!body || typeof body !== "object")
    return NextResponse.json({ error: "invalid body" }, { status: 400 });

  const rec = body as Record<string, unknown>;
  const parsed = parseDataUrl(rec.dataUrl);
  if (!parsed)
    return NextResponse.json({ error: "invalid dataUrl" }, { status: 400 });

  const { mime, buffer } = parsed;
  const ext = UPLOAD_MIME_TO_EXT[mime];
  if (!ext)
    return NextResponse.json(
      { error: `unsupported mime: ${mime} (only svg)` },
      { status: 415 },
    );
  if (buffer.byteLength > MAX_BYTES)
    return NextResponse.json(
      { error: `too large (>${MAX_BYTES} bytes)` },
      { status: 413 },
    );

  const fs = await import("fs");
  fs.mkdirSync(LIBRARY_DIR, { recursive: true });

  const hash = crypto.randomBytes(4).toString("hex");
  const stem =
    typeof rec.fileName === "string" && rec.fileName
      ? safeStem(rec.fileName)
      : "logo";
  const diskName = `${stem}-${hash}${ext}`;
  fs.writeFileSync(path.join(LIBRARY_DIR, diskName), buffer);

  return NextResponse.json(
    {
      url: `/media/logos/${diskName}`,
      fileName: diskName,
      mime,
      size: buffer.byteLength,
    },
    { status: 201 },
  );
}
