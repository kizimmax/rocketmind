import fs from "fs";
import {
  generateSitemapXml,
  getSitemapOverridePath,
} from "@/lib/sitemap";

export const dynamic = "force-static";

/**
 * `/sitemap.xml`. Если в `content/_sitemap-override.xml` есть ручная правка,
 * отдаём её как есть. Иначе — генерим из текущего контента (страницы, продукты,
 * статьи, глоссарий, legal). С `output: "export"` пре-рендерится в `out/sitemap.xml`.
 */
export async function GET() {
  let xml: string;
  try {
    const overridePath = getSitemapOverridePath();
    if (fs.existsSync(overridePath)) {
      const content = fs.readFileSync(overridePath, "utf-8").trim();
      xml = content || generateSitemapXml();
    } else {
      xml = generateSitemapXml();
    }
  } catch {
    xml = generateSitemapXml();
  }
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
