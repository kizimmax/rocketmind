import { NextResponse } from "next/server";
import path from "path";

const isStatic = process.env.NEXT_PUBLIC_STATIC === "1";
const SITE_ROOT = path.resolve(process.cwd(), "..", "site");
const PUBLIC_DIR = path.join(SITE_ROOT, "public");

type ProductCategory = "consulting" | "academy" | "ai-products";

const CATEGORY_DIRS: Record<ProductCategory, string> = {
  consulting: path.join(SITE_ROOT, "content", "products"),
  academy: path.join(SITE_ROOT, "content", "academy"),
  "ai-products": path.join(SITE_ROOT, "content", "ai-products"),
};

function resolveCover(category: ProductCategory, slug: string): string | null {
  const fs = require("fs") as typeof import("fs");
  const base = `/images/products/${category}/${slug}/cover`;
  for (const ext of [".svg", ".png", ".jpg", ".jpeg", ".webp"]) {
    if (fs.existsSync(path.join(PUBLIC_DIR, base + ext))) return base + ext;
  }
  return null;
}

export interface ProductListItem {
  slug: string;
  category: ProductCategory;
  cardTitle: string;
  cardDescription: string;
  coverUrl: string | null;
}

/** GET /api/products — список продуктов всех трёх категорий для селекта в админке. */
export async function GET() {
  if (isStatic) return NextResponse.json([]);

  const fs = await import("fs");
  const matter = (await import("gray-matter")).default;

  const out: ProductListItem[] = [];

  for (const category of Object.keys(CATEGORY_DIRS) as ProductCategory[]) {
    const dir = CATEGORY_DIRS[category];
    if (!fs.existsSync(dir)) continue;
    const files = fs
      .readdirSync(dir)
      .filter((f: string) => f.endsWith(".md") && !f.startsWith("_"));
    for (const file of files) {
      try {
        const raw = fs.readFileSync(path.join(dir, file), "utf-8");
        const { data } = matter(raw);
        const slug =
          typeof data.slug === "string" && data.slug
            ? data.slug
            : file.replace(/\.md$/, "");
        out.push({
          slug,
          category:
            typeof data.category === "string" &&
            (data.category === "consulting" ||
              data.category === "academy" ||
              data.category === "ai-products")
              ? data.category
              : category,
          cardTitle:
            typeof data.cardTitle === "string" && data.cardTitle
              ? data.cardTitle
              : typeof data.menuTitle === "string"
                ? data.menuTitle
                : slug,
          cardDescription:
            typeof data.cardDescription === "string"
              ? data.cardDescription
              : "",
          coverUrl: resolveCover(category, slug),
        });
      } catch {
        // skip malformed file
      }
    }
  }

  return NextResponse.json(out);
}
