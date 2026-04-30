import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const UPLOADS_DIR = process.env.UPLOADS_DIR ?? "/data/uploads";

const MIME: Record<string, string> = {
  png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg",
  webp: "image/webp", svg: "image/svg+xml", gif: "image/gif",
  mp3: "audio/mpeg", wav: "audio/wav", ogg: "audio/ogg",
  mp4: "video/mp4", webm: "video/webm",
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
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
  const stat = fs.statSync(resolved);
  const stream = fs.createReadStream(resolved);

  return new NextResponse(stream as unknown as ReadableStream, {
    headers: {
      "Content-Type": mimeType,
      "Content-Length": String(stat.size),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
