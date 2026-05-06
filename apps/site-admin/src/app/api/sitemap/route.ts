import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { generateSitemapXml } from "@/lib/sitemap-generator";

export const dynamic = "force-dynamic";

const KEY = "sitemap-override";

/**
 * Storage унифицирован с сайтом: и админка, и сайт читают/пишут override
 * через `prisma.systemConfig` (key="sitemap-override", value={xml: "..."}).
 * Раньше админ писал в файл `/data/config/sitemap-override.xml`, а сайт читал
 * из БД — рассинхрон по умолчанию. Теперь источник один.
 */
async function readOverride(): Promise<string | null> {
  const row = await prisma.systemConfig.findUnique({ where: { key: KEY } }).catch(() => null);
  if (!row) return null;
  const v = row.value as Record<string, unknown> | null;
  return typeof v?.xml === "string" ? (v.xml as string) : null;
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const source = url.searchParams.get("source");
    const override = await readOverride();

    const useOverride = source !== "auto" && override && override.trim().length > 0;
    const xml = useOverride ? override! : await generateSitemapXml();

    return new NextResponse(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "X-Sitemap-Source": useOverride ? "override" : "auto",
      },
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const content: string = typeof body.content === "string" ? body.content : "";
    if (!content.trim()) return NextResponse.json({ error: "empty content" }, { status: 400 });
    await prisma.systemConfig.upsert({
      where: { key: KEY },
      update: { value: { xml: content } as Prisma.InputJsonValue },
      create: { key: KEY, value: { xml: content } as Prisma.InputJsonValue },
    });
    return NextResponse.json({ ok: true, source: "override" });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await prisma.systemConfig.delete({ where: { key: KEY } }).catch(() => null);
    return NextResponse.json({ ok: true, source: "auto" });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
