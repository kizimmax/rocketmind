import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { NavItem, NavSection } from "@rocketmind/ui/content";

const CONTENT_DIR = path.join(process.cwd(), "content");
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

type SectionConfig = {
  label: string;
  href: string;
  dir: string;
  urlPrefix: string;
  /** Explicit slug order — also acts as the inclusion list for nav. */
  order: string[];
};

const SECTIONS: SectionConfig[] = [
  {
    label: "Консалтинг и стратегии",
    href: "/products?filter=consulting",
    dir: "products",
    urlPrefix: "/consulting",
    order: [
      "ecosystem-strategy",
      "digital-platform",
      "smart-analytics",
      "team-readiness",
      "strategy-sessions",
      "design-sprints",
      "skolkovo",
      "business-readiness",
    ],
  },
  {
    label: "Онлайн-школа",
    href: "/products?filter=academy",
    dir: "academy",
    urlPrefix: "/academy",
    order: ["business-design-teams", "business-design-quickstart"],
  },
  {
    label: "AI-продукты",
    href: "/products?filter=ai-products",
    dir: "ai-products",
    urlPrefix: "/ai-products",
    order: ["hypothesis-testing", "business-modeling"],
  },
];

type PlainLinkConfig = {
  href: string;
  /** If set, look up `menuTitle` from `content/unique/<uniqueSlug>.md`. */
  uniqueSlug?: string;
  fallbackLabel: string;
};

const HEADER_PLAIN_LINKS: PlainLinkConfig[] = [
  { href: "/about", uniqueSlug: "about", fallbackLabel: "О Rocketmind" },
  { href: "/media", fallbackLabel: "Медиа" },
];

const COMPANY_LINKS: PlainLinkConfig[] = [
  { href: "/about", uniqueSlug: "about", fallbackLabel: "О Rocketmind" },
  { href: "/cases", uniqueSlug: "cases-index", fallbackLabel: "Кейсы" },
  { href: "/media", fallbackLabel: "Медиа" },
];

const LEGAL_LINKS: { href: string; label: string }[] = [
  { href: "/legal/privacy-policy", label: "Политика конфиденциальности" },
  { href: "/legal/data-consent", label: "Обработка персональных данных" },
  { href: "/legal/marketing-consent", label: "Рекламное согласие" },
];

function withBasePath(href: string): string {
  return href.startsWith("/") ? BASE_PATH + href : href;
}

function readFrontmatter(filePath: string): Record<string, unknown> | null {
  if (!fs.existsSync(filePath)) return null;
  try {
    return matter(fs.readFileSync(filePath, "utf-8")).data as Record<string, unknown>;
  } catch {
    return null;
  }
}

function readNavItem(dir: string, slug: string, urlPrefix: string): NavItem | null {
  const fm = readFrontmatter(path.join(CONTENT_DIR, dir, `${slug}.md`));
  if (!fm) return null;
  const title = typeof fm.menuTitle === "string" ? fm.menuTitle.trim() : "";
  const description = typeof fm.menuDescription === "string" ? fm.menuDescription.trim() : "";
  if (!title) return null;
  return {
    href: withBasePath(`${urlPrefix}/${slug}`),
    title,
    description,
  };
}

function readUniqueLabel(uniqueSlug: string): string | null {
  const fm = readFrontmatter(path.join(CONTENT_DIR, "unique", `${uniqueSlug}.md`));
  if (!fm) return null;
  const title = typeof fm.menuTitle === "string" ? fm.menuTitle.trim() : "";
  return title || null;
}

function resolvePlainLink({ href, uniqueSlug, fallbackLabel }: PlainLinkConfig): {
  href: string;
  label: string;
} {
  const label = (uniqueSlug && readUniqueLabel(uniqueSlug)) || fallbackLabel;
  return { href: withBasePath(href), label };
}

export type SiteNavData = {
  /** Full header navigation (dropdown sections + plain links). */
  nav: NavSection[];
  /** Company column links in the footer. */
  companyLinks: { href: string; label: string }[];
  /** Legal column links in the footer (currently hardcoded). */
  legalLinks: { href: string; label: string }[];
};

export function getSiteNav(): SiteNavData {
  const dropdownSections: NavSection[] = SECTIONS.map(({ label, href, dir, urlPrefix, order }) => ({
    href: withBasePath(href),
    label,
    items: order
      .map((slug) => readNavItem(dir, slug, urlPrefix))
      .filter((i): i is NavItem => i !== null),
  }));

  const plainSections: NavSection[] = HEADER_PLAIN_LINKS.map(resolvePlainLink).map(
    ({ href, label }) => ({ href, label }),
  );

  return {
    nav: [...dropdownSections, ...plainSections],
    companyLinks: COMPANY_LINKS.map(resolvePlainLink),
    legalLinks: LEGAL_LINKS.map((l) => ({ href: withBasePath(l.href), label: l.label })),
  };
}
