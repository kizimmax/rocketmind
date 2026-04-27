import { NextResponse } from "next/server";
import path from "path";
import crypto from "crypto";

const isStatic = process.env.NEXT_PUBLIC_STATIC === "1";
const SITE_ROOT = path.resolve(process.cwd(), "..", "site");
const UPLOADS_ROOT = path.join(SITE_ROOT, "public", "media", "uploads");

/** Разрешённые типы для aside-файла. */
const FILE_MIME_TO_EXT: Record<string, string> = {
  "application/pdf": ".pdf",
  "application/msword": ".doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    ".docx",
  "application/vnd.ms-excel": ".xls",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ".xlsx",
  "image/jpeg": ".jpg",
  "image/png": ".png",
};

/** Разрешённые типы для ручного превью (вариант A). */
const IMAGE_MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/svg+xml": ".svg",
  "image/gif": ".gif",
  "image/avif": ".avif",
};

/** Разрешённые типы для body-video-блока статьи. */
const VIDEO_MIME_TO_EXT: Record<string, string> = {
  "video/mp4": ".mp4",
  "video/webm": ".webm",
  "video/quicktime": ".mov",
  "video/ogg": ".ogv",
};

const MAX_FILE_BYTES = 15 * 1024 * 1024; // 15MB
const MAX_PREVIEW_BYTES = 4 * 1024 * 1024; // 4MB
const MAX_VIDEO_BYTES = 50 * 1024 * 1024; // 50MB

function parseDataUrl(
  dataUrl: unknown,
): { mime: string; buffer: Buffer } | null {
  if (typeof dataUrl !== "string") return null;
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) return null;
  return { mime: match[1], buffer: Buffer.from(match[2], "base64") };
}

function safeSlug(slug: string): string | null {
  // Разрешаем a-z0-9- для имён директорий (соответствует slug-формату медиа).
  if (!/^[a-z0-9][a-z0-9-]*$/i.test(slug)) return null;
  return slug.toLowerCase();
}

/**
 * POST /api/articles/[slug]/uploads
 * body: { kind: "file" | "preview" | "video", dataUrl: string, fileName?: string }
 * Возвращает: { url, fileName, mime, size }
 *
 * Файлы кладутся в `apps/site/public/media/uploads/<slug>/<hash>.<ext>`
 * — публичный URL `/media/uploads/<slug>/<hash>.<ext>`.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  if (isStatic) return NextResponse.json(null, { status: 501 });

  const { slug: rawSlug } = await params;
  const slug = safeSlug(rawSlug);
  if (!slug)
    return NextResponse.json({ error: "invalid slug" }, { status: 400 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  if (!body || typeof body !== "object")
    return NextResponse.json({ error: "invalid body" }, { status: 400 });

  const rec = body as Record<string, unknown>;
  const kind = rec.kind;
  if (kind !== "file" && kind !== "preview" && kind !== "video")
    return NextResponse.json(
      { error: "kind must be 'file' | 'preview' | 'video'" },
      { status: 400 },
    );

  const parsed = parseDataUrl(rec.dataUrl);
  if (!parsed)
    return NextResponse.json({ error: "invalid dataUrl" }, { status: 400 });

  const { mime, buffer } = parsed;
  const maxBytes =
    kind === "file"
      ? MAX_FILE_BYTES
      : kind === "video"
        ? MAX_VIDEO_BYTES
        : MAX_PREVIEW_BYTES;
  if (buffer.byteLength > maxBytes)
    return NextResponse.json(
      { error: `too large (>${maxBytes} bytes)` },
      { status: 413 },
    );

  const mapping =
    kind === "file"
      ? FILE_MIME_TO_EXT
      : kind === "video"
        ? VIDEO_MIME_TO_EXT
        : IMAGE_MIME_TO_EXT;
  const ext = mapping[mime];
  if (!ext)
    return NextResponse.json(
      { error: `unsupported mime: ${mime}` },
      { status: 415 },
    );

  const fs = await import("fs");
  const dir = path.join(UPLOADS_ROOT, slug);
  fs.mkdirSync(dir, { recursive: true });

  const hash = crypto.randomBytes(6).toString("hex");
  const diskName = `${hash}${ext}`;
  fs.writeFileSync(path.join(dir, diskName), buffer);

  const fileName =
    typeof rec.fileName === "string" && rec.fileName
      ? rec.fileName
      : diskName;

  return NextResponse.json(
    {
      url: `/media/uploads/${slug}/${diskName}`,
      fileName,
      mime,
      size: buffer.byteLength,
    },
    { status: 201 },
  );
}
