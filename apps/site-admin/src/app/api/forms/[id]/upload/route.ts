import { NextResponse } from "next/server";
import { parseDataUrl, saveBuffer, randomHex } from "@/lib/storage";

const ALLOWED_MIME: Record<string, string> = {
  "application/pdf": ".pdf",
  "application/msword": ".doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
  "application/vnd.ms-excel": ".xls",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ".xlsx",
  "application/zip": ".zip",
  "application/x-zip-compressed": ".zip",
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

const MAX_BYTES = 20 * 1024 * 1024;

function safeId(id: string): string | null {
  if (!/^[a-z0-9][a-z0-9-]*$/.test(id)) return null;
  return id.toLowerCase();
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: rawId } = await params;
  const id = safeId(rawId);
  if (!id) return NextResponse.json({ error: "invalid id" }, { status: 400 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const rec = (body ?? {}) as Record<string, unknown>;
  const parsed = parseDataUrl(rec.dataUrl);
  if (!parsed) return NextResponse.json({ error: "invalid dataUrl" }, { status: 400 });

  const { mime, buffer } = parsed;
  if (buffer.byteLength > MAX_BYTES) return NextResponse.json({ error: "too large (>20MB)" }, { status: 413 });

  const ext = ALLOWED_MIME[mime];
  if (!ext) return NextResponse.json({ error: `unsupported mime: ${mime}` }, { status: 415 });

  const diskName = `${randomHex()}${ext}`;
  const { publicUrl } = saveBuffer(`forms/${id}/gifts`, diskName, buffer);
  const fileName = typeof rec.fileName === "string" && rec.fileName ? rec.fileName : diskName;

  return NextResponse.json({ url: publicUrl, fileName, mime, size: buffer.byteLength }, { status: 201 });
}
