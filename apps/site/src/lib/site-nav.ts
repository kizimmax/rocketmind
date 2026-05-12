import { prisma } from "./prisma";
import type { NavItem, NavSection } from "@rocketmind/ui/content";

type SectionConfig = { label: string; href: string; category: string; urlPrefix: string };

const SECTIONS: SectionConfig[] = [
  { label: "Консалтинг и стратегии", href: "/products/consulting", category: "consulting", urlPrefix: "/consulting" },
  { label: "Онлайн-школа", href: "/products/academy", category: "academy", urlPrefix: "/academy" },
  { label: "AI-продукты", href: "/products/ai-products", category: "ai-products", urlPrefix: "/ai-products" },
];

const LEGAL_LINKS: { href: string; label: string }[] = [
  { href: "/legal/privacy-policy", label: "Политика конфиденциальности" },
  { href: "/legal/data-consent", label: "Обработка персональных данных" },
  { href: "/legal/marketing-consent", label: "Рекламное согласие" },
];

export type SiteNavData = {
  nav: NavSection[];
  footerNav: NavSection[];
  companyLinks: { href: string; label: string }[];
  legalLinks: { href: string; label: string }[];
};

export async function getSiteNav(): Promise<SiteNavData> {
  const [pages, uniquePages] = await Promise.all([
    prisma.page.findMany({
      where: { category: { in: SECTIONS.map((s) => s.category) }, status: "published" },
      orderBy: [{ category: "asc" }, { sortOrder: "asc" }],
      select: { slug: true, category: true, menuTitle: true, menuDescription: true, sortOrder: true, content: true },
    }).catch(() => []),
    prisma.page.findMany({
      where: { category: "unique", slug: { in: ["about", "rocketmind", "cases-index"] } },
      select: { slug: true, menuTitle: true },
    }).catch(() => []),
  ]);

  const uniqueTitle = (slug: string, fallback: string) =>
    uniquePages.find((p) => p.slug === slug)?.menuTitle?.trim() || fallback;

  type Entry = { slug: string; title: string; description: string; sortOrder: number; showInMenu: boolean; showInFooter: boolean };
  const entriesByCategory = new Map<string, Entry[]>();
  for (const p of pages) {
    if (!p.menuTitle?.trim()) continue;
    const d = (p.content && typeof p.content === "object" ? p.content : {}) as Record<string, unknown>;
    const entry: Entry = { slug: p.slug, title: p.menuTitle.trim(), description: p.menuDescription?.trim() ?? "", sortOrder: p.sortOrder, showInMenu: d.showInMenu !== false, showInFooter: d.showInFooter !== false };
    if (!entriesByCategory.has(p.category)) entriesByCategory.set(p.category, []);
    entriesByCategory.get(p.category)!.push(entry);
  }

  const toNavItem = (urlPrefix: string, e: Entry): NavItem => ({ href: `${urlPrefix}/${e.slug}`, title: e.title, description: e.description });

  const dropdownSections: NavSection[] = SECTIONS.map((cfg) => {
    const entries = (entriesByCategory.get(cfg.category) ?? []).sort((a, b) => a.sortOrder - b.sortOrder);
    return { href: cfg.href, label: cfg.label, items: entries.filter((e) => e.showInMenu).map((e) => toNavItem(cfg.urlPrefix, e)) };
  });

  const footerSections: NavSection[] = SECTIONS.map((cfg) => {
    const entries = (entriesByCategory.get(cfg.category) ?? []).sort((a, b) => a.sortOrder - b.sortOrder);
    return { href: cfg.href, label: cfg.label, items: entries.filter((e) => e.showInFooter).map((e) => toNavItem(cfg.urlPrefix, e)) };
  });

  return {
    nav: [...dropdownSections, { href: "/about", label: uniqueTitle("about", "О Rocketmind") }, { href: "/media", label: "Медиа" }],
    footerNav: footerSections,
    companyLinks: [
      { href: "/about", label: uniqueTitle("about", "О Rocketmind") },
      { href: "/cases", label: uniqueTitle("cases-index", "Кейсы") },
      { href: "/media", label: "Медиа" },
    ],
    legalLinks: LEGAL_LINKS,
  };
}
