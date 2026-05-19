import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/auth";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const gate = await requirePermission(request, "redirects", "EDIT");
  if (gate instanceof NextResponse) return gate;
  const { id } = await params;
  const body = await request.json();

  const existing = await prisma.redirect.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "not found" }, { status: 404 });

  const fromUrl: string | undefined =
    typeof body.fromUrl === "string" ? body.fromUrl.trim() : undefined;
  const toUrl: string | undefined =
    typeof body.toUrl === "string" ? body.toUrl.trim() : undefined;

  if (fromUrl !== undefined && fromUrl !== existing.fromUrl) {
    const conflict = await prisma.redirect.findUnique({ where: { fromUrl } });
    if (conflict) return NextResponse.json({ error: "redirect_exists" }, { status: 409 });
  }

  const redirect = await prisma.redirect.update({
    where: { id },
    data: {
      ...(fromUrl !== undefined && { fromUrl }),
      ...(toUrl !== undefined && { toUrl }),
      ...(typeof body.statusCode === "number" && { statusCode: body.statusCode === 302 ? 302 : 301 }),
      ...(typeof body.isActive === "boolean" && { isActive: body.isActive }),
    },
  });
  return NextResponse.json(redirect);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const gate = await requirePermission(request, "redirects", "EDIT");
  if (gate instanceof NextResponse) return gate;
  const { id } = await params;
  const existing = await prisma.redirect.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "not found" }, { status: 404 });
  await prisma.redirect.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
