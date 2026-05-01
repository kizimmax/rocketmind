import { NextResponse } from "next/server";
import { parseDataUrl, saveBuffer, randomHex } from "@/lib/storage";

const FILE_MIME_TO_EXT: Record<string, string> = {
  "application/pdf": ".pdf",
  "application/msword": ".doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
  "application/vnd.ms-excel": ".xls",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ".xlsx",
  "image/jpeg": ".jpg",
  "image/png": ".png",
};

const IMAGE_MIME_TO_EXT: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/svg+xml": ".svg",
  "image/gif": ".gif",
  "image/avif": ".avif",
};

const VIDEO_MIME_TO_EXT: Record<string, string> = {
  "video/mp4": ".mp4",
  "video/webm": ".webm",
  "video/quicktime": ".mov",
  "video/ogg": ".ogv",
};

const MAX_FILE_BYTES = 15 * 1024 * 1024;
const MAX_PREVIEW_BYTES = 4 * 1024 * 1024;
const MAX_VIDEO_BYTES = 50 * 1024 * 1024;

function safeSlug(slug: string): string | null {
  if (!/^[a-z0-9][a-z0-9-]*$/i.test(slug)) return null;
  return slug.toLowerCase();
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug: rawSlug } = await params;
  const slug = safeSlug(rawSlug);
  if (!slug) return NextResponse.json({ error: "invalid slug" }, { status: 400 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const rec = (body ?? {}) as Record<string, unknown>;
  const kind = rec.kind;
  if (kind !== "file" && kind !== "preview" && kind !== "video") {
    return NextResponse.json({ error: "kind must be 'file' | 'preview' | 'video'" }, { status: 400 });
  }

  const parsed = parseDataUrl(rec.dataUrl);
  if (!parsed) return NextResponse.json({ error: "invalid dataUrl" }, { status: 400 });

  const { mime, buffer } = parsed;
  const maxBytes = kind === "file" ? MAX_FILE_BYTES : kind === "video" ? MAX_VIDEO_BYTES : MAX_PREVIEW_BYTES;
  if (buffer.byteLength > maxBytes) return NextResponse.json({ error: `too large (>${maxBytes} bytes)` }, { status: 413 });

  const mapping = kind === "file" ? FILE_MIME_TO_EXT : kind === "video" ? VIDEO_MIME_TO_EXT : IMAGE_MIME_TO_EXT;
  const ext = mapping[mime];
  if (!ext) return NextResponse.json({ error: `unsupported mime: ${mime}` }, { status: 415 });

  const diskName = `${randomHex()}${ext}`;
  const { publicUrl } = saveBuffer(`articles/${slug}/uploads`, diskName, buffer);
  const fileName = typeof rec.fileName === "string" && rec.fileName ? rec.fileName : diskName;

  return NextResponse.json({ url: publicUrl, fileName, mime, size: buffer.byteLength }, { status: 201 });
}
