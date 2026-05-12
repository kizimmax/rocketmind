import { NextRequest, NextResponse } from "next/server";
import { draftMode } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyPreviewToken } from "@/lib/preview-token";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id") ?? "";
  const token = url.searchParams.get("token") ?? "";

  const payload = verifyPreviewToken(token);
  if (!payload || payload.id !== id) {
    return NextResponse.json({ error: "invalid_token" }, { status: 401 });
  }

  const draft = await prisma.previewDraft.findUnique({ where: { id } });
  if (!draft || draft.expiresAt < new Date()) {
    return NextResponse.json({ error: "draft_expired" }, { status: 410 });
  }

  const dm = await draftMode();
  dm.enable();

  const res = NextResponse.redirect(new URL(draft.publicUrl, url.origin), 302);
  res.cookies.set("previewDraftId", id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: draft.expiresAt,
    path: "/",
  });
  return res;
}
