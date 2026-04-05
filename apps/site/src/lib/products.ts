import fs from "fs";
import path from "path";
import matter from "gray-matter";

// ── Types ──────────────────────────────────────────────────────────────────────

export type Factoid = {
  number: string;
  label: string;
  text: string;
};

export type ProductHeroData = {
  caption: string;
  title: string;
  description: string;
  ctaText: string;
  factoids: Factoid[];
};

export type AccordionItem = {
  title: string;
  description: string;
};

export type AboutProductData = {
  caption: string;
  title: string;
  description: string;
  accordion: AccordionItem[];
  /** Whether an image is shown (resolved from filesystem) */
  hasImage: boolean;
};

export type ProductData = {
  slug: string;
  category: string;
  // Menu / Navigation
  menuTitle: string;
  menuDescription: string;
  // Product Card
  cardTitle: string;
  cardDescription: string;
  // SEO
  metaTitle: string;
  metaDescription: string;
  // Hero
  hero: ProductHeroData;
  // About product
  about: AboutProductData | null;
  // Image paths (auto-resolved)
  coverImage: string;
  aboutImage: string | null;
};

// ── Paths ──────────────────────────────────────────────────────────────────────

const PRODUCTS_DIR = path.join(process.cwd(), "content", "products");
const PUBLIC_DIR = path.join(process.cwd(), "public");

/**
 * Auto-resolve product image by role.
 *
 * Convention:
 *   /images/products/<category>/<slug>/cover.svg
 *   /images/products/<category>/<slug>/about.jpg
 *
 * Checks svg, png, jpg, webp in order.
 */
function resolveImage(
  category: string,
  slug: string,
  role: string,
): string | null {
  const base = `/images/products/${category}/${slug}/${role}`;
  for (const ext of [".svg", ".png", ".jpg", ".webp"]) {
    if (fs.existsSync(path.join(PUBLIC_DIR, base + ext))) {
      return base + ext;
    }
  }
  return null;
}

// ── API ────────────────────────────────────────────────────────────────────────

export function getProductBySlug(slug: string): ProductData | null {
  const filePath = path.join(PRODUCTS_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data } = matter(raw);

  const coverImage =
    resolveImage(data.category, data.slug, "cover") ??
    `/images/products/${data.category}/${data.slug}/cover.svg`;

  const aboutImage = resolveImage(data.category, data.slug, "about");

  const about: AboutProductData | null = data.about
    ? {
        caption: data.about.caption,
        title: data.about.title,
        description: data.about.description,
        accordion: data.about.accordion ?? [],
        hasImage: aboutImage !== null,
      }
    : null;

  return {
    slug: data.slug,
    category: data.category,
    menuTitle: data.menuTitle,
    menuDescription: data.menuDescription,
    cardTitle: data.cardTitle,
    cardDescription: data.cardDescription,
    metaTitle: data.metaTitle,
    metaDescription: data.metaDescription,
    hero: {
      ...data.hero,
      title: (data.hero.title as string).trimEnd(),
    },
    about,
    coverImage,
    aboutImage,
  };
}

export function getAllProducts(): ProductData[] {
  if (!fs.existsSync(PRODUCTS_DIR)) return [];

  return fs
    .readdirSync(PRODUCTS_DIR)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
    .map((f) => getProductBySlug(f.replace(/\.md$/, "")))
    .filter(Boolean) as ProductData[];
}

export function getProductsByCategory(category: string): ProductData[] {
  return getAllProducts().filter((p) => p.category === category);
}
