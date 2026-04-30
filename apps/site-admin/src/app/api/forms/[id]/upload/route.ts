import { NextResponse } from "next/server";
import path from "path";
import crypto from "crypto";

const isStatic = process.env.NEXT_PUBLIC_STATIC === "1";
const SITE_ROOT = path.resolve(process.cwd(), "..", "site");
const UPLOADS_ROOT = path.join(SITE_ROOT, "public", "forms", "gifts");

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

const MAX_BYTES = 20 * 1024 * 1024; // 20 MB

function parseDataUrl(dataUrl: unknown): { mime: string; buffer: Buffer } | null {
  if (typeof dataUrl !== "string") return null;
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) return null;
  return { mime: match[1], buffer: Buffer.from(match[2], "base64") };
}

function safeId(id: string): string | null {
  if (!/^[a-z0-9][a-z0-9-]*$/.test(id)) return null;
  return id.toLowerCase();
}

/** POST /api/forms/[id]/upload — загрузить файл подарка формы.
 *  body: { dataUrl: string (base64), fileName?: string }
 *  returns: { url, fileName, mime, size }
 *  Файлы хранятся в apps/site/public/forms/gifts/<id>/ → публичный URL /forms/gifts/<id>/<hash>.<ext>
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (isStatic) return NextResponse.json(null, { status: 501 });

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
  if (buffer.byteLength > MAX_BYTES)
    return NextResponse.json({ error: "too large (>20MB)" }, { status: 413 });

  const ext = ALLOWED_MIME[mime];
  if (!ext)
    return NextResponse.json({ error: `unsupported mime: ${mime}` }, { status: 415 });

  const fs = await import("fs");
  const dir = path.join(UPLOADS_ROOT, id);
  fs.mkdirSync(dir, { recursive: true });

  const hash = crypto.randomBytes(6).toString("hex");
  const diskName = `${hash}${ext}`;
  fs.writeFileSync(path.join(dir, diskName), buffer);

  const fileName =
    typeof rec.fileName === "string" && rec.fileName ? rec.fileName : diskName;

  return NextResponse.json(
    { url: `/forms/gifts/${id}/${diskName}`, fileName, mime, size: buffer.byteLength },
    { status: 201 },
  );
}
