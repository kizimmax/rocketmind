import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const UPLOADS_DIR = process.env.UPLOADS_DIR ?? "/data/uploads";

// Пользовательские загрузки (обложки статей, логотипы, ассеты страниц) пишет
// АДМИНКА в свой /data/uploads. В локальном docker-compose том общий, и сайт
// читает файл напрямую. Но на Amvera у каждого приложения СВОЙ volume — общего
// /data/uploads нет, поэтому если файла нет локально, проксируем его с домена
// админки (источник правды для загрузок). Origin переопределяется через ENV.
const ADMIN_UPLOADS_ORIGIN = (
  process.env.ADMIN_UPLOADS_ORIGIN ?? "https://rocketmind-admin-rocketmind.amvera.io"
).replace(/\/$/, "");

const IMMUTABLE_CACHE = "public, max-age=31536000, immutable";

const MIME: Record<string, string> = {
  png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg",
  webp: "image/webp", svg: "image/svg+xml", gif: "image/gif",
  avif: "image/avif",
  mp3: "audio/mpeg", wav: "audio/wav", ogg: "audio/ogg",
  m4a: "audio/mp4",
  mp4: "video/mp4", webm: "video/webm", mov: "video/quicktime",
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
};

/** Тянет файл с домена админки, когда его нет в локальном /data/uploads. */
async function proxyFromAdmin(segments: string[]): Promise<NextResponse> {
  const upstreamUrl = `${ADMIN_UPLOADS_ORIGIN}/uploads/${segments.map(encodeURIComponent).join("/")}`;
  try {
    const upstream = await fetch(upstreamUrl, { signal: AbortSignal.timeout(10_000) });
    if (!upstream.ok) return new NextResponse(null, { status: upstream.status === 404 ? 404 : 502 });
    const buffer = Buffer.from(await upstream.arrayBuffer());
    const ext = path.extname(upstreamUrl).slice(1).toLowerCase();
    const mimeType = upstream.headers.get("content-type") ?? MIME[ext] ?? "application/octet-stream";
    return new NextResponse(buffer, {
      headers: { "Content-Type": mimeType, "Cache-Control": IMMUTABLE_CACHE },
    });
  } catch {
    return new NextResponse(null, { status: 502 });
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await params;
  const filePath = path.join(UPLOADS_DIR, ...segments);

  // Prevent path traversal
  const resolved = path.resolve(filePath);
  if (!resolved.startsWith(path.resolve(UPLOADS_DIR))) {
    return new NextResponse(null, { status: 403 });
  }

  // Локальный файл (общий том в dev) — отдаём напрямую. Иначе проксируем с админки.
  if (!fs.existsSync(resolved)) {
    return proxyFromAdmin(segments);
  }

  const ext = path.extname(resolved).slice(1).toLowerCase();
  const mimeType = MIME[ext] ?? "application/octet-stream";
  // Buffer вместо createReadStream — Node Readable не совместим с Web
  // ReadableStream, type-cast приводил к битому ответу для строгих
  // клиентов (pdfjs/react-pdf fetch валился). Файлы до 15MB
  // (server upload limit) спокойно влезают в RAM.
  const buffer = fs.readFileSync(resolved);

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": mimeType,
      "Cache-Control": IMMUTABLE_CACHE,
    },
  });
}
