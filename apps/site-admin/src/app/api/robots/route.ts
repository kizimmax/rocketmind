import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const KEY = "robots-override";

/**
 * Default robots.txt берёт SITE_URL из env (на проде Amvera задаётся
 * `SITE_URL=https://rocketmind.ru`). Это исключает рассинхрон с canonical-URL
 * сайта (BUG-004). Хранение override унифицировано с sitemap — оба идут через
 * `prisma.systemConfig` (а не filesystem), чтобы сайт и админка читали одно.
 */
const SITE_URL = (process.env.SITE_URL ?? "https://rocketmind.ru").replace(/\/$/, "");
const DEFAULT_ROBOTS = `User-agent: *\nDisallow: /admin/\nAllow: /\nSitemap: ${SITE_URL}/sitemap.xml\n`;

async function readOverride(): Promise<string | null> {
  const row = await prisma.systemConfig.findUnique({ where: { key: KEY } }).catch(() => null);
  if (!row) return null;
  const v = row.value as Record<string, unknown> | null;
  return typeof v?.content === "string" ? (v.content as string) : null;
}

export async function GET() {
  const override = await readOverride();
  const content = override ?? DEFAULT_ROBOTS;
  return new NextResponse(content, {
    status: 200,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const content: string = typeof body.content === "string" ? body.content : "";
    await prisma.systemConfig.upsert({
      where: { key: KEY },
      update: { value: { content } as Prisma.InputJsonValue },
      create: { key: KEY, value: { content } as Prisma.InputJsonValue },
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function DELETE() {
  await prisma.systemConfig.delete({ where: { key: KEY } }).catch(() => null);
  return NextResponse.json({ ok: true });
}
