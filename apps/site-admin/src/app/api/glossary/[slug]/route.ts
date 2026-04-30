import { NextResponse } from "next/server";
import path from "path";

const isStatic = process.env.NEXT_PUBLIC_STATIC === "1";
const SITE_ROOT = path.resolve(process.cwd(), "..", "site");
const GLOSSARY_DIR = path.join(SITE_ROOT, "content", "glossary");

/** PUT /api/glossary/[slug] — обновить frontmatter термина. */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  if (isStatic) return NextResponse.json(null, { status: 501 });

  const { slug } = await params;
  const fs = await import("fs");
  const matter = (await import("gray-matter")).default;

  const filePath = path.join(GLOSSARY_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath))
    return NextResponse.json({ error: "not found" }, { status: 404 });

  const body = await request.json();
  const now = new Date().toISOString();
  const fm: Record<string, unknown> = {
    slug,
    status: body.status ?? "published",
    order: typeof body.order === "number" ? body.order : 0,
    title: body.title ?? "",
    description: body.description ?? "",
    tags: Array.isArray(body.tagIds) ? body.tagIds : [],
    metaTitle: body.metaTitle ?? "",
    metaDescription: body.metaDescription ?? "",
    body: Array.isArray(body.sections) ? body.sections : [],
    createdAt: body.createdAt ?? now,
    updatedAt: now,
  };
  for (const k of Object.keys(fm)) if (fm[k] === undefined) delete fm[k];

  fs.writeFileSync(filePath, matter.stringify("", fm), "utf-8");
  return NextResponse.json({ ok: true, slug, updatedAt: fm.updatedAt });
}

/** DELETE /api/glossary/[slug] — удалить файл термина. */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  if (isStatic) return NextResponse.json(null, { status: 501 });

  const { slug } = await params;
  const fs = await import("fs");
  const filePath = path.join(GLOSSARY_DIR, `${slug}.md`);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  return NextResponse.json({ ok: true });
}
