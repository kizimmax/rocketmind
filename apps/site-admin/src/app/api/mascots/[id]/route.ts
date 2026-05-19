import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { deleteStorageFile } from "@/lib/storage";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const mascot = await prisma.mascot.findUnique({ where: { id } });
  if (!mascot) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (mascot.isBuiltIn) {
    return NextResponse.json({ error: "builtin_protected" }, { status: 403 });
  }

  await prisma.mascot.delete({ where: { id } });

  // /uploads/<rel> → <rel>
  if (mascot.imagePath.startsWith("/uploads/")) {
    deleteStorageFile(mascot.imagePath.replace(/^\/uploads\//, ""));
  }

  return NextResponse.json({ ok: true });
}
