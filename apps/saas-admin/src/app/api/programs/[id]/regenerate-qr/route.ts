import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

/**
 * POST /api/programs/:id/regenerate-qr
 *
 * Ротирует joinToken программы. Уже привязанные студенты доступа не теряют —
 * их сессия живёт в JWT-cookie студенческого приложения. Ломаются только
 * новые попытки входа по старому токену из QR.
 */
export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const existing = await prisma.program.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const token = crypto.randomBytes(24).toString("base64url");
  const updated = await prisma.program.update({
    where: { id },
    data: { joinToken: token, joinTokenRotatedAt: new Date() },
  });

  return NextResponse.json({
    joinToken: updated.joinToken,
    joinTokenRotatedAt: updated.joinTokenRotatedAt,
  });
}
