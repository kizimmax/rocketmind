import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const existing = await prisma.glossaryTerm.findUnique({ where: { slug } });
  if (!existing) return NextResponse.json({ error: "not found" }, { status: 404 });

  const body = await request.json();
  const term = await prisma.glossaryTerm.update({
    where: { slug },
    data: {
      status: body.status ?? "published",
      title: body.title ?? "",
      description: body.description ?? "",
      tagIds: Array.isArray(body.tagIds) ? body.tagIds : [],
      metaTitle: body.metaTitle ?? "",
      metaDescription: body.metaDescription ?? "",
      content: {
        order: typeof body.order === "number" ? body.order : 0,
        sections: Array.isArray(body.sections) ? body.sections : [],
        pinned: body.pinned === true,
        pinnedOrder: typeof body.pinnedOrder === "number" ? body.pinnedOrder : 0,
        aliases: Array.isArray(body.aliases)
          ? body.aliases
              .map((v: unknown) => (typeof v === "string" ? v.trim() : ""))
              .filter((v: string) => v.length > 0)
          : [],
      },
    },
  });
  return NextResponse.json({ ok: true, slug, updatedAt: term.updatedAt.toISOString() });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  await prisma.glossaryTerm.deleteMany({ where: { slug } });
  return NextResponse.json({ ok: true });
}
