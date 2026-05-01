import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { readConfig } from "@/lib/storage";
import { DEFAULT_BLOCK_TYPES } from "@/lib/constants";

// ── Block builder ─────────────────────────────────────────────────────────────

type BlockData = Record<string, unknown>;
type Block = { id: string; type: string; enabled: boolean; order: number; data: BlockData };

function buildBlocks(sectionId: string, slug: string, data: Record<string, unknown>): Block[] {
  const blockTypesForSection: string[] =
    sectionId === "unique"
      ? slug === "home"
        ? ["homeHero", "methodology", "homeSections"]
        : slug === "cases-index"
        ? ["hero", "about"]
        : ["hero", "about", "tools", "projects", "process", "experts", "aboutRocketmind", "contacts", "pageBottom"]
      : sectionId === "cases"
      ? ["caseCard"]
      : DEFAULT_BLOCK_TYPES;

  const partnerships = readConfig<Record<string, unknown>>("partnerships.json");

  const blocks = blockTypesForSection.map((type: string, i: number): Block => {
    let blockData: BlockData = {};
    let enabled = true;

    switch (type) {
      case "hero":
        blockData = (data.hero as BlockData) || {};
        enabled = !!data.hero;
        break;
      case "about":
        if (data.about) { blockData = data.about as BlockData; }
        else { enabled = false; }
        break;
      case "projects": {
        const p = data.projects as BlockData | undefined;
        if (p && typeof p === "object") { blockData = p; }
        else { enabled = false; }
        break;
      }
      case "audience": if (data.audience) blockData = data.audience as BlockData; else enabled = false; break;
      case "contacts": if (data.contacts) blockData = data.contacts as BlockData; else enabled = false; break;
      case "tools": if (data.tools) blockData = data.tools as BlockData; else enabled = false; break;
      case "results": if (data.results) blockData = data.results as BlockData; else enabled = false; break;
      case "process": if (data.process) blockData = data.process as BlockData; else enabled = false; break;
      case "services": if (data.services) blockData = data.services as BlockData; else enabled = false; break;
      case "experts": {
        const arr = data.experts as unknown[] | null | undefined;
        if (Array.isArray(arr)) {
          blockData = { experts: arr };
          enabled = true;
        } else {
          blockData = { experts: [] };
          enabled = sectionId === "academy";
        }
        break;
      }
      case "partnerships": {
        if (partnerships) {
          blockData = partnerships;
        }
        enabled = sectionId === "academy";
        break;
      }
      case "aboutRocketmind": {
        enabled = data.aboutRocketmind !== false;
        blockData = data.aboutRocketmind && typeof data.aboutRocketmind === "object" ? (data.aboutRocketmind as BlockData) : {};
        break;
      }
      case "logoMarquee":
        enabled = data.logoMarquee !== false;
        break;
      case "pageBottom":
        enabled = data.pageBottom !== false;
        if (data.pageBottom && typeof data.pageBottom === "object") {
          blockData = data.pageBottom as BlockData;
        }
        break;
      case "homeHero":
        if (data.homeHero && typeof data.homeHero === "object") { blockData = data.homeHero as BlockData; enabled = true; }
        else { enabled = false; }
        break;
      case "methodology":
        if (data.methodology && typeof data.methodology === "object") { blockData = data.methodology as BlockData; enabled = true; }
        else { enabled = false; }
        break;
      case "homeSections":
        if (data.homeSections && typeof data.homeSections === "object") { blockData = data.homeSections as BlockData; enabled = true; }
        else { enabled = false; }
        break;
      case "caseCard":
        if (data.caseCard && typeof data.caseCard === "object") { blockData = data.caseCard as BlockData; enabled = true; }
        else { enabled = false; }
        break;
    }
    return { id: `${slug}_${type}`, type, enabled, order: i, data: blockData };
  });

  // Merge custom sections
  const customSections = Array.isArray(data.customSections) ? data.customSections : [];
  const finalBlocks: Block[] = [];
  for (const b of blocks) {
    finalBlocks.push(b);
    for (const cs of customSections) {
      if (cs && typeof cs === "object" && (cs as Record<string, unknown>).insertAfter === b.type) {
        const c = cs as Record<string, unknown>;
        finalBlocks.push({
          id: typeof c.id === "string" ? c.id : `cs_${Math.random().toString(36).slice(2, 9)}`,
          type: "customSection",
          enabled: c.enabled !== false,
          order: 0,
          data: (c.data && typeof c.data === "object" ? c.data : {}) as BlockData,
        });
      }
    }
  }
  const preBlocks = customSections.filter(
    (cs: Record<string, unknown>) => cs && typeof cs === "object" && (cs.insertAfter === null || cs.insertAfter === "" || cs.insertAfter === undefined),
  );
  for (let i = preBlocks.length - 1; i >= 0; i--) {
    const cs = preBlocks[i] as Record<string, unknown>;
    finalBlocks.unshift({
      id: typeof cs.id === "string" ? cs.id : `cs_${Math.random().toString(36).slice(2, 9)}`,
      type: "customSection",
      enabled: cs.enabled !== false,
      order: 0,
      data: (cs.data && typeof cs.data === "object" ? cs.data : {}) as BlockData,
    });
  }
  finalBlocks.forEach((b, i) => { b.order = i; });
  return finalBlocks;
}

function pageToDto(p: {
  id: string; slug: string; url: string; category: string; status: string; sortOrder: number;
  content: unknown; menuTitle: string; menuDescription: string; cardTitle: string; cardDescription: string;
  metaTitle: string; metaDescription: string; createdAt: Date; updatedAt: Date;
}, index?: number) {
  const data = (p.content ?? {}) as Record<string, unknown>;
  const sectionId = p.category;
  const blocks = buildBlocks(sectionId, p.slug, data);

  return {
    id: p.url.startsWith("/") ? p.url.slice(1) : p.url,
    sectionId,
    slug: p.slug,
    status: p.status,
    order: typeof index === "number" ? index : p.sortOrder,
    menuTitle: p.menuTitle,
    menuDescription: p.menuDescription,
    cardTitle: p.cardTitle,
    cardDescription: p.cardDescription,
    metaTitle: p.metaTitle,
    metaDescription: p.metaDescription,
    expertProduct: typeof data.expertProduct === "boolean" ? data.expertProduct : undefined,
    caseType: data.caseType === "mini" ? "mini" : undefined,
    featured: typeof data.featured === "boolean" ? data.featured : undefined,
    showInMenu: typeof data.showInMenu === "boolean" ? data.showInMenu : undefined,
    showInFooter: typeof data.showInFooter === "boolean" ? data.showInFooter : undefined,
    formId: typeof data.formId === "string" && data.formId ? data.formId : undefined,
    blocks,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  };
}

export async function GET() {
  const allPages = await prisma.page.findMany({ orderBy: [{ category: "asc" }, { sortOrder: "asc" }] });
  const grouped = new Map<string, typeof allPages>();
  for (const p of allPages) {
    if (!grouped.has(p.category)) grouped.set(p.category, []);
    grouped.get(p.category)!.push(p);
  }

  const result: ReturnType<typeof pageToDto>[] = [];
  for (const [, pages] of grouped) {
    pages.forEach((p, index) => {
      try {
        result.push(pageToDto(p, index));
      } catch { /* skip malformed */ }
    });
  }
  return NextResponse.json(result);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { sectionId, slug, menuTitle } = body;
  if (!slug || !sectionId) return NextResponse.json({ error: "sectionId and slug required" }, { status: 400 });

  const url = sectionId === "unique" ? `/${slug}` : `/${sectionId}/${slug}`;
  const existing = await prisma.page.findUnique({ where: { url } });
  if (existing) return NextResponse.json({ error: "exists" }, { status: 409 });

  const captions: Record<string, string> = {
    consulting: "консалтинг и стратегии", academy: "онлайн-школа",
    "ai-products": "ии-продукты", cases: "кейсы", media: "медиа",
  };

  let content: Record<string, unknown>;
  if (sectionId === "cases") {
    content = {
      slug, category: sectionId, caseType: "mini", featured: false, order: 0,
      caseCard: { title: menuTitle, description: "", stats: [{ value: "", label: "", description: "" }, { value: "", label: "", description: "" }, { value: "", label: "", description: "" }], result: "" },
    };
  } else {
    content = {
      slug, category: sectionId,
      hero: { caption: captions[sectionId] || sectionId, title: (menuTitle || "").toUpperCase(), description: "", ctaText: "оставить заявку", factoids: [] },
      about: null, audience: null, results: null, process: null, experts: null,
      socialProof: null, tools: null, duration: null, whyRocketmind: null, expert: null, cases: null, reviews: null,
    };
  }

  const page = await prisma.page.create({
    data: {
      slug, url, category: sectionId, name: menuTitle || slug,
      status: "published", sortOrder: 0,
      menuTitle: menuTitle || "", menuDescription: "",
      cardTitle: menuTitle || "", cardDescription: "",
      metaTitle: menuTitle ? `${menuTitle} | Rocketmind` : "",
      metaDescription: "",
      content: content as Prisma.InputJsonValue,
    },
  });
  return NextResponse.json(pageToDto(page, 0), { status: 201 });
}
