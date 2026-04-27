import { NextResponse } from "next/server";
import path from "path";

const isStatic = process.env.NEXT_PUBLIC_STATIC === "1";
const SITE_ROOT = path.resolve(process.cwd(), "..", "site");
const GLOSSARY_DIR = path.join(SITE_ROOT, "content", "glossary");

/** GET /api/glossary — вернуть все термины из apps/site/content/glossary/*.md. */
export async function GET() {
  if (isStatic) return NextResponse.json([]);

  const fs = await import("fs");
  const matter = (await import("gray-matter")).default;

  if (!fs.existsSync(GLOSSARY_DIR)) return NextResponse.json([]);

  const terms = fs
    .readdirSync(GLOSSARY_DIR)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
    .map((file) => {
      try {
        const raw = fs.readFileSync(path.join(GLOSSARY_DIR, file), "utf-8");
        const { data } = matter(raw);
        const slug = (data.slug as string) || file.replace(/\.md$/, "");
        return {
          id: `glossary/${slug}`,
          slug,
          status: (data.status as string) || "published",
          order: typeof data.order === "number" ? data.order : 0,
          title: (data.title as string) || "",
          tagIds: Array.isArray(data.tags)
            ? data.tags.filter((t: unknown): t is string => typeof t === "string")
            : [],
          metaTitle: (data.metaTitle as string) || "",
          metaDescription: (data.metaDescription as string) || "",
          createdAt: (data.createdAt as string) || "",
          updatedAt: (data.updatedAt as string) || "",
        };
      } catch {
        return null;
      }
    })
    .filter(Boolean);

  return NextResponse.json(terms);
}

/** POST /api/glossary — создать термин. Body: { slug, title }. */
export async function POST(request: Request) {
  if (isStatic) return NextResponse.json(null, { status: 501 });

  const fs = await import("fs");
  const matter = (await import("gray-matter")).default;

  const body = await request.json();
  const { slug, title } = body as { slug?: string; title?: string };
  if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });

  if (!fs.existsSync(GLOSSARY_DIR)) fs.mkdirSync(GLOSSARY_DIR, { recursive: true });

  const filePath = path.join(GLOSSARY_DIR, `${slug}.md`);
  if (fs.existsSync(filePath))
    return NextResponse.json({ error: "exists" }, { status: 409 });

  const now = new Date().toISOString();
  const fm: Record<string, unknown> = {
    slug,
    status: "hidden",
    order: 0,
    title: title || "",
    tags: [],
    metaTitle: title ? `${title} | Глоссарий Rocketmind` : "",
    metaDescription: "",
    createdAt: now,
    updatedAt: now,
  };
  fs.writeFileSync(filePath, matter.stringify("", fm), "utf-8");

  return NextResponse.json(
    {
      id: `glossary/${slug}`,
      slug,
      status: fm.status,
      order: fm.order,
      title: fm.title,
      tagIds: [],
      metaTitle: fm.metaTitle,
      metaDescription: "",
      createdAt: fm.createdAt,
      updatedAt: fm.updatedAt,
    },
    { status: 201 },
  );
}
