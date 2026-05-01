import { NextResponse } from "next/server";
import { generateSitemapXml } from "@/lib/sitemap-generator";
import { readConfigRaw, writeConfigRaw, deleteConfigFile } from "@/lib/storage";

const OVERRIDE_FILE = "sitemap-override.xml";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const source = url.searchParams.get("source");

    let xml: string;
    let actualSource: "override" | "auto";

    const override = readConfigRaw(OVERRIDE_FILE);
    if (source !== "auto" && override) {
      xml = override;
      actualSource = "override";
    } else {
      xml = await generateSitemapXml();
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

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const content: string = typeof body.content === "string" ? body.content : "";
    if (!content.trim()) return NextResponse.json({ error: "empty content" }, { status: 400 });
    writeConfigRaw(OVERRIDE_FILE, content);
    return NextResponse.json({ ok: true, source: "override" });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    deleteConfigFile(OVERRIDE_FILE);
    return NextResponse.json({ ok: true, source: "auto" });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
