import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseDataUrl, saveBuffer, deleteFilesWithBase, isImageMime, IMAGE_EXTS } from "@/lib/storage";
import { requirePermission } from "@/lib/auth";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const gate = await requirePermission(request, "testimonials", "EDIT");
  if (gate instanceof NextResponse) return gate;
  const { id } = await params;
  const item = await prisma.testimonial.findUnique({ where: { id } });
  if (!item) return NextResponse.json({ error: "not found" }, { status: 404 });

  const body = await request.json();
  const cur = (item.content ?? {}) as Record<string, unknown>;

  let avatarPath = item.avatarPath;
  if (typeof body.avatar === "string") {
    if (body.avatar.startsWith("data:")) {
      const parsed = parseDataUrl(body.avatar);
      if (!parsed) {
        return NextResponse.json({ error: "invalid_dataUrl" }, { status: 400 });
      }
      if (!isImageMime(parsed.mime)) {
        return NextResponse.json({ error: "unsupported_mime", message: `Только изображения: ${parsed.mime} не принят` }, { status: 415 });
      }
      deleteFilesWithBase("testimonials", id, IMAGE_EXTS);
      const diskName = `${id}${parsed.ext}`;
      const { publicUrl } = saveBuffer("testimonials", diskName, parsed.buffer);
      avatarPath = publicUrl;
    } else {
      avatarPath = body.avatar;
    }
  } else if (body.avatar === null) {
    deleteFilesWithBase("testimonials", id, IMAGE_EXTS);
    avatarPath = null;
  }

  const updated = await prisma.testimonial.update({
    where: { id },
    data: {
      content: {
        ...cur,
        paragraphs: Array.isArray(body.paragraphs)
          ? body.paragraphs.filter((p: unknown): p is string => typeof p === "string")
          : cur.paragraphs,
        name: typeof body.name === "string" ? body.name : cur.name,
        position: typeof body.position === "string" ? body.position : cur.position,
        gender: body.gender === "m" || body.gender === "f" ? body.gender : (cur.gender ?? "m"),
      },
      avatarPath,
      sortOrder: typeof body.order === "number" ? body.order : item.sortOrder,
    },
  });

  return NextResponse.json({
    id: updated.id,
    order: updated.sortOrder,
    ...(updated.content as Record<string, unknown>),
    avatar: updated.avatarPath,
  });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const gate = await requirePermission(request, "testimonials", "EDIT");
  if (gate instanceof NextResponse) return gate;
  const { id } = await params;
  const item = await prisma.testimonial.findUnique({ where: { id } });
  if (!item) return NextResponse.json({ error: "not found" }, { status: 404 });

  deleteFilesWithBase("testimonials", id, IMAGE_EXTS);
  await prisma.testimonial.delete({ where: { id } });

  const remaining = await prisma.testimonial.findMany({ orderBy: { sortOrder: "asc" } });
  await prisma.$transaction(
    remaining.map((t, i) => prisma.testimonial.update({ where: { id: t.id }, data: { sortOrder: i } })),
  );

  return NextResponse.json({ ok: true });
}
