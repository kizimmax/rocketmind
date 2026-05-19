import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/auth";

export async function GET(request: Request) {
  const gate = await requirePermission(request, "redirects", "VIEW");
  if (gate instanceof NextResponse) return gate;
  const redirects = await prisma.redirect.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(redirects);
}

export async function POST(request: Request) {
  const gate = await requirePermission(request, "redirects", "EDIT");
  if (gate instanceof NextResponse) return gate;
  const body = await request.json();
  const fromUrl: string = (body.fromUrl ?? "").trim();
  const toUrl: string = (body.toUrl ?? "").trim();

  if (!fromUrl || !toUrl) {
    return NextResponse.json({ error: "fromUrl and toUrl are required" }, { status: 400 });
  }
  if (fromUrl === toUrl) {
    return NextResponse.json({ error: "fromUrl and toUrl must differ" }, { status: 400 });
  }

  const existing = await prisma.redirect.findUnique({ where: { fromUrl } });
  if (existing) {
    return NextResponse.json({ error: "redirect_exists", id: existing.id }, { status: 409 });
  }

  const statusCode = body.statusCode === 302 ? 302 : 301;
  const redirect = await prisma.redirect.create({
    data: { fromUrl, toUrl, statusCode, kind: "manual", isActive: true },
  });
  return NextResponse.json(redirect, { status: 201 });
}
