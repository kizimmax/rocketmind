import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const UPLOADS_DIR = process.env.UPLOADS_DIR ?? "/data/uploads";

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

  if (!fs.existsSync(resolved)) {
    return new NextResponse(null, { status: 404 });
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
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
