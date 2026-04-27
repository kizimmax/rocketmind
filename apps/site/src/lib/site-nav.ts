import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { NavItem, NavSection } from "@rocketmind/ui/content";

const CONTENT_DIR = path.join(process.cwd(), "content");
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

type SectionConfig = {
  label: string;
  href: string;
  /** Папка внутри `apps/site/content/`. */
  dir: string;
  /** Префикс ссылки страницы продукта (напр. `/consulting`). */
  urlPrefix: string;
};

/**
 * Разделы-источники для шапки/футера. Порядок списка тут определяет
 * порядок дропдаунов; порядок ПУНКТОВ внутри дропдауна тянется из frontmatter-
 * поля `order` соответствующих .md-файлов (админка drag-and-drop -> PUT
 * /api/pages/[slug] -> `order` в frontmatter -> здесь сортируем).
 */
const SECTIONS: SectionConfig[] = [
  {
    label: "Консалтинг и стратегии",
    href: "/products?filter=consulting",
    dir: "products",
    urlPrefix: "/consulting",
  },
  {
    label: "Онлайн-школа",
    href: "/products?filter=academy",
    dir: "academy",
    urlPrefix: "/academy",
  },
  {
    label: "AI-продукты",
    href: "/products?filter=ai-products",
    dir: "ai-products",
    urlPrefix: "/ai-products",
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

type RawNavEntry = {
  slug: string;
  title: string;
  description: string;
  order: number;
  showInMenu: boolean;
  showInFooter: boolean;
};

/**
 * Скан всех .md-страниц раздела — возвращает сырые записи со всеми флагами
 * и order. Дальше вызывающий отфильтрует по showInMenu/showInFooter и
 * смапит в NavItem.
 */
function readSectionEntries(dir: string): RawNavEntry[] {
  const fullDir = path.join(CONTENT_DIR, dir);
  if (!fs.existsSync(fullDir)) return [];
  const files = fs
    .readdirSync(fullDir)
    .filter((f) => f.endsWith(".md") && !f.startsWith("_"));
  const entries: RawNavEntry[] = [];
  for (const file of files) {
    const slug = file.replace(/\.md$/, "");
    const fm = readFrontmatter(path.join(fullDir, file));
    if (!fm) continue;
    const title = typeof fm.menuTitle === "string" ? fm.menuTitle.trim() : "";
    if (!title) continue;
    const description =
      typeof fm.menuDescription === "string" ? fm.menuDescription.trim() : "";
    entries.push({
      slug,
      title,
      description,
      order:
        typeof fm.order === "number" ? fm.order : Number.MAX_SAFE_INTEGER,
      showInMenu: fm.showInMenu !== false,
      showInFooter: fm.showInFooter !== false,
    });
  }
  entries.sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order;
    return a.slug.localeCompare(b.slug);
  });
  return entries;
}

function toNavItem(urlPrefix: string, e: RawNavEntry): NavItem {
  return {
    href: withBasePath(`${urlPrefix}/${e.slug}`),
    title: e.title,
    description: e.description,
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
  /** Навигация в шапке (dropdown-секции + plain-ссылки), отфильтрована по showInMenu. */
  nav: NavSection[];
  /**
   * Навигация для футера. Те же dropdown-секции, но отфильтрованы по
   * showInFooter. Plain-ссылки не включаются — они идут отдельной колонкой
   * `companyLinks`.
   */
  footerNav: NavSection[];
  /** Company-колонка в футере. */
  companyLinks: { href: string; label: string }[];
  /** Legal-колонка в футере (хардкод). */
  legalLinks: { href: string; label: string }[];
};

export function getSiteNav(): SiteNavData {
  // Читаем все секции один раз — один и тот же набор фильтруется по-разному
  // для header'а и footer'а.
  const sectionsRaw = SECTIONS.map((cfg) => ({
    cfg,
    entries: readSectionEntries(cfg.dir),
  }));

  const dropdownSections: NavSection[] = sectionsRaw.map(({ cfg, entries }) => ({
    href: withBasePath(cfg.href),
    label: cfg.label,
    items: entries
      .filter((e) => e.showInMenu)
      .map((e) => toNavItem(cfg.urlPrefix, e)),
  }));

  const footerSections: NavSection[] = sectionsRaw.map(({ cfg, entries }) => ({
    href: withBasePath(cfg.href),
    label: cfg.label,
    items: entries
      .filter((e) => e.showInFooter)
      .map((e) => toNavItem(cfg.urlPrefix, e)),
  }));

  const plainSections: NavSection[] = HEADER_PLAIN_LINKS.map(resolvePlainLink).map(
    ({ href, label }) => ({ href, label }),
  );

  return {
    nav: [...dropdownSections, ...plainSections],
    footerNav: footerSections,
    companyLinks: COMPANY_LINKS.map(resolvePlainLink),
    legalLinks: LEGAL_LINKS.map((l) => ({ href: withBasePath(l.href), label: l.label })),
  };
}
