import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import {
  generateSitemapXml,
  SITEMAP_OVERRIDE_PATH,
} from "@/lib/sitemap-generator";

const isStatic = process.env.NEXT_PUBLIC_STATIC === "1";

/**
 * GET — отдаёт текущий эффективный sitemap.xml (override или авто).
 *   ?source=auto    — игнорирует override, возвращает свежесгенерированный XML
 *                     (используется для кнопки «сгенерировать заново»).
 * Заголовок `X-Sitemap-Source` равен `override` или `auto`.
 */
export async function GET(request: Request) {
  if (isStatic) {
    return new NextResponse("", {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "X-Sitemap-Source": "auto",
      },
    });
  }

  try {
    const url = new URL(request.url);
    const source = url.searchParams.get("source");

    let xml: string;
    let actualSource: "override" | "auto";

    if (source !== "auto" && fs.existsSync(SITEMAP_OVERRIDE_PATH)) {
      xml = fs.readFileSync(SITEMAP_OVERRIDE_PATH, "utf-8");
      actualSource = "override";
    } else {
      xml = generateSitemapXml();
      actualSource = "auto";
    }

    return new NextResponse(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "X-Sitemap-Source": actualSource,
      },
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

/** PUT — сохранить ручную правку (override). Body: `{ content: string }`. */
export async function PUT(request: Request) {
  if (isStatic)
    return NextResponse.json({ error: "static" }, { status: 501 });

  try {
    const body = await request.json();
    const content: string =
      typeof body.content === "string" ? body.content : "";
    if (!content.trim()) {
      return NextResponse.json(
        { error: "empty content" },
        { status: 400 },
      );
    }
    const dir = path.dirname(SITEMAP_OVERRIDE_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(SITEMAP_OVERRIDE_PATH, content, "utf-8");
    return NextResponse.json({ ok: true, source: "override" });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

/** DELETE — снять ручную правку, вернуться к автогенерации. */
export async function DELETE() {
  if (isStatic)
    return NextResponse.json({ error: "static" }, { status: 501 });

  try {
    if (fs.existsSync(SITEMAP_OVERRIDE_PATH)) {
      fs.unlinkSync(SITEMAP_OVERRIDE_PATH);
    }
    return NextResponse.json({ ok: true, source: "auto" });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
