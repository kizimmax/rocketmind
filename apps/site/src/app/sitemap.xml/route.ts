import { generateSitemapXml } from "@/lib/sitemap";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  let xml: string;
  try {
    const override = await prisma.systemConfig.findUnique({ where: { key: "sitemap-override" } }).catch(() => null);
    const overrideXml = typeof (override?.value as Record<string, unknown> | null)?.xml === "string"
      ? ((override!.value as Record<string, unknown>).xml as string).trim()
      : "";
    xml = overrideXml || await generateSitemapXml();
  } catch {
    xml = await generateSitemapXml();
  }
  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
