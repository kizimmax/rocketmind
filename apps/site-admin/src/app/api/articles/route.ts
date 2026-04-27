import { NextResponse } from "next/server";
import path from "path";

const isStatic = process.env.NEXT_PUBLIC_STATIC === "1";
const SITE_ROOT = path.resolve(process.cwd(), "..", "site");
const MEDIA_DIR = path.join(SITE_ROOT, "content", "media");
const PUBLIC_DIR = path.join(SITE_ROOT, "public");

const IMAGE_EXTS = [".svg", ".png", ".jpg", ".jpeg", ".webp", ".gif", ".avif"];
const MIME: Record<string, string> = {
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".avif": "image/avif",
};

function resolveCoverAsDataUrl(
  fs: typeof import("fs"),
  slug: string,
): string | null {
  for (const ext of IMAGE_EXTS) {
    const fp = path.join(PUBLIC_DIR, "images", "media", `${slug}${ext}`);
    if (fs.existsSync(fp)) {
      const buf = fs.readFileSync(fp);
      const mime = MIME[ext] || "application/octet-stream";
      return `data:${mime};base64,${buf.toString("base64")}`;
    }
  }
  return null;
}

/** GET /api/articles — list all articles (frontmatter + body + cover as data URL) */
export async function GET() {
  if (isStatic) return NextResponse.json([]);

  const fs = await import("fs");
  const matter = (await import("gray-matter")).default;

  if (!fs.existsSync(MEDIA_DIR)) return NextResponse.json([]);

  const articles = fs
    .readdirSync(MEDIA_DIR)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
    .map((file) => {
      try {
        const raw = fs.readFileSync(path.join(MEDIA_DIR, file), "utf-8");
        const { data } = matter(raw);
        const slug = (data.slug as string) || file.replace(/\.md$/, "");
        return {
          id: `media/${slug}`,
          slug,
          status: (data.status as string) || "published",
          order: typeof data.order === "number" ? data.order : 0,
          title: (data.title as string) || "",
          description: (data.description as string) || "",
          coverImageData: resolveCoverAsDataUrl(fs, slug) ?? undefined,
          publishedAt: (data.publishedAt as string) || "",
          expertSlug: (data.expertSlug as string) || undefined,
          tagIds: Array.isArray(data.tags)
            ? data.tags.filter((t: unknown): t is string => typeof t === "string")
            : [],
          keyThoughts: Array.isArray(data.keyThoughts)
            ? data.keyThoughts.filter((t: unknown): t is string => typeof t === "string")
            : [],
          body: Array.isArray(data.body) ? data.body : [],
          cardVariant: data.cardVariant === "wide" ? "wide" : "default",
          pinned: data.pinned === true,
          pinnedOrder:
            typeof data.pinnedOrder === "number" ? data.pinnedOrder : 0,
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

  return NextResponse.json(articles);
}

/** POST /api/articles — create a new article (empty body, hidden by default). */
export async function POST(request: Request) {
  if (isStatic) return NextResponse.json(null, { status: 501 });

  const fs = await import("fs");
  const matter = (await import("gray-matter")).default;

  const body = await request.json();
  const { slug, title } = body as { slug?: string; title?: string };
  if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });

  if (!fs.existsSync(MEDIA_DIR)) fs.mkdirSync(MEDIA_DIR, { recursive: true });

  const filePath = path.join(MEDIA_DIR, `${slug}.md`);
  if (fs.existsSync(filePath))
    return NextResponse.json({ error: "exists" }, { status: 409 });

  const now = new Date().toISOString();
  const fm: Record<string, unknown> = {
    slug,
    status: "hidden",
    order: 0,
    title: title || "",
    description: "",
    publishedAt: now.slice(0, 10),
    tags: [],
    keyThoughts: [],
    body: [],
    cardVariant: "default",
    pinned: false,
    pinnedOrder: 0,
    metaTitle: title ? `${title} — Rocketmind` : "",
    metaDescription: "",
    createdAt: now,
    updatedAt: now,
  };
  fs.writeFileSync(filePath, matter.stringify("", fm), "utf-8");

  return NextResponse.json(
    {
      id: `media/${slug}`,
      slug,
      status: fm.status,
      order: fm.order,
      title: fm.title,
      description: "",
      coverImageData: undefined,
      publishedAt: fm.publishedAt,
      expertSlug: undefined,
      tagIds: [],
      keyThoughts: [],
      body: [],
      cardVariant: "default",
      pinned: false,
      pinnedOrder: 0,
      metaTitle: fm.metaTitle,
      metaDescription: "",
      createdAt: fm.createdAt,
      updatedAt: fm.updatedAt,
    },
    { status: 201 },
  );
}
