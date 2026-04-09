import { NextResponse } from "next/server";

const isStatic = process.env.NEXT_PUBLIC_STATIC === "1";

export async function PUT(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  if (isStatic) return NextResponse.json(null, { status: 501 });

  const fs = await import("fs");
  const path = await import("path");
  const matter = (await import("gray-matter")).default;
  const { getAllContentDirs } = await import("@/lib/content-paths");

  const { slug: rawSlug } = await params;
  const pageId = decodeURIComponent(rawSlug);
  const page = await request.json();

  const parts = pageId.split("/");
  if (parts.length < 2) return NextResponse.json({ error: "bad id" }, { status: 400 });
  const [sectionId, ...rest] = parts;
  const slug = rest.join("/");

  let filePath: string | null = null;
  for (const { sectionId: sid, dir } of getAllContentDirs()) {
    if (sid !== sectionId) continue;
    const fp = path.join(dir, `${slug}.md`);
    if (fs.existsSync(fp)) { filePath = fp; break; }
  }
  if (!filePath) return NextResponse.json({ error: "not found" }, { status: 404 });

  const heroBlock = page.blocks?.find((b: { type: string }) => b.type === "hero");
  const aboutBlock = page.blocks?.find((b: { type: string }) => b.type === "about");
  const audienceBlock = page.blocks?.find((b: { type: string }) => b.type === "audience");
  const resultsBlock = page.blocks?.find((b: { type: string }) => b.type === "results");
  const processBlock = page.blocks?.find((b: { type: string }) => b.type === "process");

  const hasContent = (d: Record<string, unknown>) => d && !!(d.title as string)?.trim();

  const fm: Record<string, unknown> = {
    slug: page.slug, category: page.sectionId,
    menuTitle: page.menuTitle, menuDescription: page.menuDescription,
    cardTitle: page.cardTitle, cardDescription: page.cardDescription,
    metaTitle: page.metaTitle, metaDescription: page.metaDescription,
    hero: heroBlock?.enabled ? heroBlock.data : null,
    about: aboutBlock?.enabled && hasContent(aboutBlock.data) ? aboutBlock.data : null,
    audience: audienceBlock?.enabled && hasContent(audienceBlock.data) ? audienceBlock.data : null,
    results: resultsBlock?.enabled && hasContent(resultsBlock.data) ? resultsBlock.data : null,
    process: processBlock?.enabled && hasContent(processBlock.data) ? processBlock.data : null,
    socialProof: null, tools: null, duration: null, whyRocketmind: null, expert: null, cases: null, reviews: null,
  };

  const newPath = path.join(path.dirname(filePath), `${page.slug}.md`);
  if (newPath !== filePath) fs.unlinkSync(filePath);
  fs.writeFileSync(newPath, matter.stringify("", fm), "utf-8");
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  if (isStatic) return NextResponse.json(null, { status: 501 });

  const fs = await import("fs");
  const path = await import("path");
  const { getAllContentDirs } = await import("@/lib/content-paths");

  const { slug: rawSlug } = await params;
  const pageId = decodeURIComponent(rawSlug);
  const parts = pageId.split("/");
  if (parts.length < 2) return NextResponse.json({ error: "bad id" }, { status: 400 });
  const [sectionId, ...rest] = parts;
  const slug = rest.join("/");

  for (const { sectionId: sid, dir } of getAllContentDirs()) {
    if (sid !== sectionId) continue;
    const fp = path.join(dir, `${slug}.md`);
    if (fs.existsSync(fp)) { fs.unlinkSync(fp); return NextResponse.json({ ok: true }); }
  }
  return NextResponse.json({ error: "not found" }, { status: 404 });
}

export function generateStaticParams() {
  return [];
}
