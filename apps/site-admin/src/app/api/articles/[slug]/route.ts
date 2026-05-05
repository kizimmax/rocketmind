import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseDataUrl, saveBuffer, deleteFilesWithBase } from "@/lib/storage";
import { createAutoRedirect } from "@/lib/redirects";

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
  const newSlug: string = typeof body.slug === "string" && body.slug.trim() ? body.slug.trim() : slug;
  const slugChanged = newSlug !== slug;

  if (slugChanged) {
    const conflict = await prisma.article.findUnique({ where: { slug: newSlug } });
    if (conflict) return NextResponse.json({ error: "slug_taken" }, { status: 409 });
  }

  let coverPath = existing.coverPath;
  const coverImageData = body.coverImageData as string | null | undefined;
  const coverSlug = slugChanged ? newSlug : slug;
  if (typeof coverImageData === "string" && coverImageData.startsWith("data:")) {
    const parsed = parseDataUrl(coverImageData);
    if (parsed) {
      deleteCover(slug);
      const { publicUrl } = saveBuffer("articles", `${coverSlug}${parsed.ext}`, parsed.buffer);
      coverPath = publicUrl;
    }
  } else if (coverImageData === null) {
    deleteCover(slug);
    coverPath = null;
  }

  const article = await prisma.article.update({
    where: { slug },
    data: {
      slug: newSlug,
      type,
      status: body.status ?? "published",
      title: body.title ?? "",
      description: body.description ?? "",
      content: {
        body: Array.isArray(body.body) ? body.body : [],
        keyThoughts: Array.isArray(body.keyThoughts) ? body.keyThoughts : [],
        ...(type === "case" && body.caseCard ? { caseCard: body.caseCard } : {}),
        ...(body.multiPage === true
          ? { multiPage: true, chapters: Array.isArray(body.chapters) ? body.chapters : [] }
          : { multiPage: false }),
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

  if (slugChanged) {
    await createAutoRedirect(`/media/${slug}`, `/media/${newSlug}`, "article", existing.id);
  }

  return NextResponse.json({ ok: true, slug: newSlug, updatedAt: article.updatedAt.toISOString() });
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
