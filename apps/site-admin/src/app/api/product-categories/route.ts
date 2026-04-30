import { NextResponse } from "next/server";
import path from "path";

const isStatic = process.env.NEXT_PUBLIC_STATIC === "1";
const SITE_ROOT = path.resolve(process.cwd(), "..", "site");
const PRODUCTS_DIR = path.join(SITE_ROOT, "content", "products");
const CATEGORIES_FILE = path.join(PRODUCTS_DIR, "_categories.json");

const VALID_IDS = ["consulting", "academy", "expert", "ai-products"] as const;
type CategoryId = (typeof VALID_IDS)[number];

interface CategorySeo {
  pageTitlePrefix?: string;
  pageTitleAccent?: string;
  metaTitle?: string;
  metaDescription?: string;
  intro?: string;
}

interface CategoryEntry {
  id: CategoryId;
  seo?: CategorySeo;
}

const SEO_KEYS = [
  "pageTitlePrefix",
  "pageTitleAccent",
  "metaTitle",
  "metaDescription",
  "intro",
] as const;

function sanitizeSeo(raw: unknown): CategorySeo | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const r = raw as Record<string, unknown>;
  const out: CategorySeo = {};
  for (const k of SEO_KEYS) {
    const v = r[k];
    if (typeof v === "string" && v.trim()) out[k] = v.trim();
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

function readCategories(fs: typeof import("fs")): CategoryEntry[] {
  if (!fs.existsSync(CATEGORIES_FILE)) {
    return VALID_IDS.map((id) => ({ id }));
  }
  try {
    const raw = fs.readFileSync(CATEGORIES_FILE, "utf-8");
    const json = JSON.parse(raw) as { categories?: unknown[] };
    const incoming = Array.isArray(json.categories) ? json.categories : [];
    const byId = new Map<CategoryId, CategoryEntry>();
    for (const c of incoming) {
      if (!c || typeof c !== "object") continue;
      const r = c as Record<string, unknown>;
      const id = r.id;
      if (typeof id !== "string") continue;
      if (!VALID_IDS.includes(id as CategoryId)) continue;
      const seo = sanitizeSeo(r.seo);
      byId.set(id as CategoryId, seo ? { id: id as CategoryId, seo } : { id: id as CategoryId });
    }
    return VALID_IDS.map((id) => byId.get(id) ?? { id });
  } catch {
    return VALID_IDS.map((id) => ({ id }));
  }
}

/** GET /api/product-categories — категории каталога с SEO-overrides. */
export async function GET() {
  if (isStatic) return NextResponse.json({ categories: [] });
  const fs = await import("fs");
  return NextResponse.json({ categories: readCategories(fs) });
}

/** PUT /api/product-categories — заменить SEO-overrides всех 4 категорий. */
export async function PUT(request: Request) {
  if (isStatic) return NextResponse.json(null, { status: 501 });
  const fs = await import("fs");

  const body = (await request.json().catch(() => null)) as
    | { categories?: unknown }
    | null;
  if (!body) return NextResponse.json({ error: "invalid json" }, { status: 400 });

  const incoming = Array.isArray(body.categories) ? body.categories : [];
  const byId = new Map<CategoryId, CategoryEntry>();
  for (const c of incoming) {
    if (!c || typeof c !== "object") continue;
    const r = c as Record<string, unknown>;
    const id = r.id;
    if (typeof id !== "string") continue;
    if (!VALID_IDS.includes(id as CategoryId)) continue;
    const seo = sanitizeSeo(r.seo);
    byId.set(id as CategoryId, seo ? { id: id as CategoryId, seo } : { id: id as CategoryId });
  }
  const categories = VALID_IDS.map((id) => byId.get(id) ?? { id });

  if (!fs.existsSync(PRODUCTS_DIR)) fs.mkdirSync(PRODUCTS_DIR, { recursive: true });
  fs.writeFileSync(
    CATEGORIES_FILE,
    JSON.stringify({ categories }, null, 2) + "\n",
    "utf-8",
  );

  return NextResponse.json({ ok: true, categories });
}
