import { NextResponse } from "next/server";
import { readConfigRaw, writeConfigRaw } from "@/lib/storage";

const DEFAULT_ROBOTS = `User-agent: *\nDisallow: /admin/\nAllow: /\nSitemap: https://r-front-rocketmind.amvera.io/sitemap.xml\n`;

export async function GET() {
  const content = readConfigRaw("robots.txt") ?? DEFAULT_ROBOTS;
  return new NextResponse(content, {
    status: 200,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const content: string = typeof body.content === "string" ? body.content : "";
    writeConfigRaw("robots.txt", content);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
