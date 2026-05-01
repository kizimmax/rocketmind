import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseDataUrl, saveBuffer, deleteFilesWithBase } from "@/lib/storage";

const COVER_EXTS = [".svg", ".png", ".jpg", ".jpeg", ".webp", ".gif", ".avif"];

function deleteCover(slug: string) {
  deleteFilesWithBase("articles", slug, COVER_EXTS);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const existing = await prisma.article.findUnique({ where: { slug } });
  if (!existing) return NextResponse.json({ error: "not found" }, { status: 404 });

  const body = await request.json();
  const type = body.type === "lesson" || body.type === "case" ? body.type : "default";

  let coverPath = existing.coverPath;
  const coverImageData = body.coverImageData as string | null | undefined;
  if (typeof coverImageData === "string" && coverImageData.startsWith("data:")) {
    const parsed = parseDataUrl(coverImageData);
    if (parsed) {
      deleteCover(slug);
      const { publicUrl } = saveBuffer("articles", `${slug}${parsed.ext}`, parsed.buffer);
      coverPath = publicUrl;
    }
  } else if (coverImageData === null) {
    deleteCover(slug);
    coverPath = null;
  }

  const article = await prisma.article.update({
    where: { slug },
    data: {
      type,
      status: body.status ?? "published",
      title: body.title ?? "",
      description: body.description ?? "",
      content: {
        body: Array.isArray(body.body) ? body.body : [],
        keyThoughts: Array.isArray(body.keyThoughts) ? body.keyThoughts : [],
        ...(type === "case" && body.caseCard ? { caseCard: body.caseCard } : {}),
        sortOrder: typeof body.order === "number" ? body.order : 0,
      },
      coverPath,
      expertSlug: body.expertSlug || null,
      publishedAt: body.publishedAt ?? "",
      tagIds: Array.isArray(body.tagIds) ? body.tagIds : [],
      pinned: body.pinned === true,
      pinnedOrder: typeof body.pinnedOrder === "number" ? body.pinnedOrder : 0,
      featured: type === "case" ? body.featured === true : false,
      cardVariant: body.cardVariant === "wide" ? "wide" : "default",
      metaTitle: body.metaTitle ?? "",
      metaDescription: body.metaDescription ?? "",
    },
  });

  return NextResponse.json({ ok: true, slug, updatedAt: article.updatedAt.toISOString() });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  deleteCover(slug);
  await prisma.article.deleteMany({ where: { slug } });
  return NextResponse.json({ ok: true });
}
