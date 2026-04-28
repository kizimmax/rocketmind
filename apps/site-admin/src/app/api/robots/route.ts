import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

const ROBOTS_PATH = path.resolve(process.cwd(), "..", "site", "public", "robots.txt");

const DEFAULT_ROBOTS = `User-agent: *
Disallow: /admin/
Allow: /
Sitemap: https://r-front-rocketmind.amvera.io/sitemap.xml
`;

export async function GET() {
  try {
    const content = fs.existsSync(ROBOTS_PATH)
      ? fs.readFileSync(ROBOTS_PATH, "utf-8")
      : DEFAULT_ROBOTS;
    return new NextResponse(content, {
      status: 200,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const content: string = typeof body.content === "string" ? body.content : "";
    const dir = path.dirname(ROBOTS_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(ROBOTS_PATH, content, "utf-8");
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
