import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/lib/site-url";

export const dynamic = "force-dynamic";

const DEFAULT = `User-agent: *\nDisallow: /admin/\nAllow: /\nSitemap: ${SITE_URL}/sitemap.xml\n`;

export async function GET() {
  let content = DEFAULT;
  try {
    const row = await prisma.systemConfig.findUnique({ where: { key: "robots-override" } }).catch(() => null);
    const override = row?.value as Record<string, unknown> | null;
    if (typeof override?.content === "string" && override.content.trim()) {
      content = override.content as string;
    }
  } catch { /* DB down — return default */ }
  return new NextResponse(content, {
    status: 200,
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
