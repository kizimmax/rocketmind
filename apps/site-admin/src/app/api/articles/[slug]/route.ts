import { NextResponse } from "next/server";
import path from "path";

const isStatic = process.env.NEXT_PUBLIC_STATIC === "1";
const SITE_ROOT = path.resolve(process.cwd(), "..", "site");
const MEDIA_DIR = path.join(SITE_ROOT, "content", "media");
const MEDIA_IMAGES_DIR = path.join(SITE_ROOT, "public", "images", "media");

const MIME_TO_EXT: Record<string, string> = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/webp": ".webp",
  "image/svg+xml": ".svg",
  "image/gif": ".gif",
  "image/avif": ".avif",
};

const COVER_EXTS = [".svg", ".png", ".jpg", ".jpeg", ".webp", ".gif", ".avif"];

function parseDataUrl(dataUrl: string): { ext: string; buffer: Buffer } | null {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) return null;
  const ext = MIME_TO_EXT[match[1]];
  if (!ext) return null;
  return { ext, buffer: Buffer.from(match[2], "base64") };
}

function deleteCover(fs: typeof import("fs"), slug: string) {
  for (const ext of COVER_EXTS) {
    const fp = path.join(MEDIA_IMAGES_DIR, `${slug}${ext}`);
    if (fs.existsSync(fp)) fs.unlinkSync(fp);
  }
}

/** PUT /api/articles/[slug] — update .md frontmatter + body + cover image */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  if (isStatic) return NextResponse.json(null, { status: 501 });

  const { slug } = await params;
  const fs = await import("fs");
  const matter = (await import("gray-matter")).default;

  const filePath = path.join(MEDIA_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath))
    return NextResponse.json({ error: "not found" }, { status: 404 });

  const body = await request.json();

  // 1. Cover image sync
  //    - Если coverImageData — новый data-URL: декодируем, пишем файл, стираем прочие расширения.
  //    - Если coverImageData === null: удаляем существующие файлы.
  //    - Если coverImageData — путь /images/media/..: оставляем как есть (не перезаписываем).
  //    - Если undefined: ничего не трогаем.
  const coverImageData = body.coverImageData as string | null | undefined;
  if (typeof coverImageData === "string" && coverImageData.startsWith("data:")) {
    const parsed = parseDataUrl(coverImageData);
    if (parsed) {
      if (!fs.existsSync(MEDIA_IMAGES_DIR))
        fs.mkdirSync(MEDIA_IMAGES_DIR, { recursive: true });
      deleteCover(fs, slug);
      fs.writeFileSync(
        path.join(MEDIA_IMAGES_DIR, `${slug}${parsed.ext}`),
        parsed.buffer,
      );
    }
  } else if (coverImageData === null) {
    deleteCover(fs, slug);
  }

  // 2. Frontmatter — собираем в детерминированном порядке, чистим data-URL из значения
  //    (коверимейдж на сайте резолвится по файлу, не хранится в .md).
  const now = new Date().toISOString();
  const fm: Record<string, unknown> = {
    slug,
    status: body.status ?? "published",
    order: typeof body.order === "number" ? body.order : 0,
    title: body.title ?? "",
    description: body.description ?? "",
    publishedAt: body.publishedAt ?? "",
    expertSlug: body.expertSlug || undefined,
    tags: Array.isArray(body.tagIds) ? body.tagIds : [],
    keyThoughts: Array.isArray(body.keyThoughts) ? body.keyThoughts : [],
    body: Array.isArray(body.body) ? body.body : [],
    cardVariant: body.cardVariant === "wide" ? "wide" : "default",
    pinned: body.pinned === true,
    pinnedOrder:
      typeof body.pinnedOrder === "number" ? body.pinnedOrder : 0,
    metaTitle: body.metaTitle ?? "",
    metaDescription: body.metaDescription ?? "",
    createdAt: body.createdAt ?? now,
    updatedAt: now,
  };
  // Уберём undefined (gray-matter.stringify иначе запишет 'undefined').
  for (const k of Object.keys(fm)) if (fm[k] === undefined) delete fm[k];

  fs.writeFileSync(filePath, matter.stringify("", fm), "utf-8");

  return NextResponse.json({ ok: true, slug, updatedAt: fm.updatedAt });
}

/** DELETE /api/articles/[slug] — remove .md + cover image file */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  if (isStatic) return NextResponse.json(null, { status: 501 });

  const { slug } = await params;
  const fs = await import("fs");

  const filePath = path.join(MEDIA_DIR, `${slug}.md`);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  deleteCover(fs, slug);

  return NextResponse.json({ ok: true });
}
