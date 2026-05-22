/**
 * Серверный конвертер: SitePage из редактора → JSON `page.content`, в каком его
 * хранит таблица `pages` в БД. Используется только для предпросмотра — без
 * побочных эффектов (никаких file writes, никаких записей в SystemConfig).
 *
 * Зеркалит «Build content object» в `apps/site-admin/src/app/api/pages/[slug]/route.ts`,
 * но оставляет data:URL'ы как есть (браузер сам их рендерит).
 */
type Block = {
  id: string;
  type: string;
  enabled: boolean;
  order?: number;
  data?: Record<string, unknown>;
};

interface SitePageLike {
  slug: string;
  sectionId: string;
  blocks?: Block[];
  expertProduct?: boolean;
  caseType?: string;
  featured?: boolean;
  showInMenu?: boolean;
  showInFooter?: boolean;
  formId?: string;
  order?: number;
  status?: string;
  menuTitle?: string;
  menuDescription?: string;
  cardTitle?: string;
  cardDescription?: string;
  metaTitle?: string;
  metaDescription?: string;
}

export function buildPagePreviewContent(page: SitePageLike): Record<string, unknown> {
  const blocks: Block[] = page.blocks ?? [];
  const block = (t: string) => blocks.find((b) => b.type === t);
  const enabled = (b: Block | undefined) => (b?.enabled ? (b.data ?? {}) : null);

  const sortedBlocks = [...blocks].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  const customSections: Array<{
    id: string;
    insertAfter: string | null;
    enabled: boolean;
    data: Record<string, unknown>;
  }> = [];
  let lastBuiltinType: string | null = null;
  for (const b of sortedBlocks) {
    if (b.type === "customSection") {
      customSections.push({
        id: b.id,
        insertAfter: lastBuiltinType,
        enabled: b.enabled !== false,
        data: b.data ?? {},
      });
    } else {
      lastBuiltinType = b.type;
    }
  }

  const heroBlock = block("hero");
  const aboutBlock = block("about");
  const aboutRmBlock = block("aboutRocketmind");
  const projectsBlock = block("projects");
  const expertsBlock = block("experts");
  const expertsValue = expertsBlock?.enabled
    ? Array.isArray((expertsBlock.data as Record<string, unknown>)?.experts)
      ? ((expertsBlock.data as Record<string, unknown>).experts as unknown[])
      : []
    : null;

  return {
    slug: page.slug,
    category: page.sectionId,
    expertProduct: typeof page.expertProduct === "boolean" ? page.expertProduct : null,
    caseType: page.caseType === "mini" ? "mini" : null,
    featured: typeof page.featured === "boolean" ? page.featured : null,
    showInMenu: typeof page.showInMenu === "boolean" ? page.showInMenu : null,
    showInFooter: typeof page.showInFooter === "boolean" ? page.showInFooter : null,
    formId: typeof page.formId === "string" && page.formId ? page.formId : null,
    order: typeof page.order === "number" ? page.order : null,
    caseCard: enabled(block("caseCard")),
    homeHero: enabled(block("homeHero")),
    methodology: enabled(block("methodology")),
    homeSections: enabled(block("homeSections")),
    partnershipsMini: (() => {
      const b = block("partnershipsMini");
      if (b?.enabled === false) return false;
      const d = (b?.data ?? {}) as Record<string, unknown>;
      return Object.keys(d).length > 0 ? d : null;
    })(),
    hero: enabled(heroBlock),
    logoMarquee: block("logoMarquee")?.enabled === false ? false : null,
    about: enabled(aboutBlock),
    audience: enabled(block("audience")),
    contacts: enabled(block("contacts")),
    tools: enabled(block("tools")),
    results: enabled(block("results")),
    services: enabled(block("services")),
    process: enabled(block("process")),
    experts: expertsValue,
    aboutRocketmind: (() => {
      const b = aboutRmBlock;
      if (b?.enabled === false) return false;
      const d = (b?.data ?? {}) as Record<string, unknown>;
      return Object.keys(d).length > 0 ? d : null;
    })(),
    projects: enabled(projectsBlock),
    pageBottom: (() => {
      const b = block("pageBottom");
      if (!b || b.enabled === false) return false;
      const d = (b.data ?? {}) as Record<string, unknown>;
      const ctaId = typeof d.ctaId === "string" ? d.ctaId.trim() : "";
      return ctaId ? { ctaId } : true;
    })(),
    customSections: customSections.length > 0 ? customSections : null,
  };
}

/**
 * Полный синтетический Page row, который можно подсунуть `pageToProductData`
 * и аналогичным лоадерам сайта. Поля совпадают с колонками `pages` Prisma.
 */
export function buildPagePreviewRow(page: SitePageLike): Record<string, unknown> {
  const content = buildPagePreviewContent(page);
  const category = page.sectionId;
  const slug = page.slug;
  const url = category === "unique" ? `/${slug}` : `/${category}/${slug}`;
  return {
    id: `preview-${slug}`,
    slug,
    url,
    category,
    name: page.menuTitle || slug,
    status: typeof page.status === "string" ? page.status : "published",
    sortOrder: typeof page.order === "number" ? page.order : 0,
    content,
    menuTitle: page.menuTitle ?? "",
    menuDescription: page.menuDescription ?? "",
    cardTitle: page.cardTitle ?? "",
    cardDescription: page.cardDescription ?? "",
    metaTitle: page.metaTitle ?? "",
    metaDescription: page.metaDescription ?? "",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}
