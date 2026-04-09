import { NextResponse } from "next/server";

const isStatic = process.env.NEXT_PUBLIC_STATIC === "1";

export async function GET() {
  if (isStatic) return NextResponse.json([]);

  const fs = await import("fs");
  const path = await import("path");
  const matter = (await import("gray-matter")).default;
  const { getAllContentDirs } = await import("@/lib/content-paths");
  const { DEFAULT_BLOCK_TYPES } = await import("@/lib/constants");

  const pages: unknown[] = [];

  for (const { sectionId, dir } of getAllContentDirs()) {
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir).filter((f: string) => f.endsWith(".md") && !f.startsWith("_"));
    files.forEach((file: string, index: number) => {
      try {
        const raw = fs.readFileSync(path.join(dir, file), "utf-8");
        const { data } = matter(raw);
        if (!data.slug) return;
        const blocks = DEFAULT_BLOCK_TYPES.map((type: string, i: number) => {
          let blockData: Record<string, unknown> = {};
          let enabled = true;
          switch (type) {
            case "hero": blockData = data.hero || {}; enabled = !!data.hero; break;
            case "about": if (data.about) blockData = data.about; else enabled = false; break;
            case "audience": if (data.audience) blockData = data.audience; else enabled = false; break;
            case "results": if (data.results) blockData = data.results; else enabled = false; break;
            case "process": if (data.process) blockData = data.process; else enabled = false; break;
          }
          return { id: `${data.slug}_${type}`, type, enabled, order: i, data: blockData };
        });
        const stat = fs.statSync(path.join(dir, file));
        pages.push({
          id: `${sectionId}/${data.slug}`,
          sectionId,
          slug: data.slug,
          status: "published",
          order: index,
          menuTitle: data.menuTitle || "",
          menuDescription: data.menuDescription || "",
          cardTitle: data.cardTitle || "",
          cardDescription: data.cardDescription || "",
          metaTitle: data.metaTitle || "",
          metaDescription: data.metaDescription || "",
          blocks,
          createdAt: stat.birthtime.toISOString(),
          updatedAt: stat.mtime.toISOString(),
        });
      } catch { /* skip */ }
    });
  }
  return NextResponse.json(pages);
}

export async function POST(request: Request) {
  if (isStatic) return NextResponse.json(null, { status: 501 });

  const fs = await import("fs");
  const path = await import("path");
  const matter = (await import("gray-matter")).default;
  const { getContentDir } = await import("@/lib/content-paths");

  const body = await request.json();
  const { sectionId, slug, menuTitle } = body;
  const dir = getContentDir(sectionId);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const filePath = path.join(dir, `${slug}.md`);
  if (fs.existsSync(filePath)) return NextResponse.json({ error: "exists" }, { status: 409 });

  const captions: Record<string, string> = {
    consulting: "консалтинг и стратегии", academy: "онлайн-школа",
    "ai-products": "ии-продукты", cases: "кейсы", media: "медиа",
  };
  const fm: Record<string, unknown> = {
    slug, category: sectionId, menuTitle, menuDescription: "",
    cardTitle: menuTitle, cardDescription: "",
    metaTitle: `${menuTitle} | Rocketmind`, metaDescription: "",
    hero: { caption: captions[sectionId] || sectionId, title: menuTitle.toUpperCase(), description: "", ctaText: "оставить заявку", factoids: [] },
    about: null, audience: null, results: null, process: null,
    socialProof: null, tools: null, duration: null, whyRocketmind: null, expert: null, cases: null, reviews: null,
  };
  fs.writeFileSync(filePath, matter.stringify("", fm), "utf-8");
  return NextResponse.json({ id: `${sectionId}/${slug}`, sectionId, slug, status: "published", order: 0, menuTitle, menuDescription: "", cardTitle: menuTitle, cardDescription: "", metaTitle: `${menuTitle} | Rocketmind`, metaDescription: "", blocks: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, { status: 201 });
}
