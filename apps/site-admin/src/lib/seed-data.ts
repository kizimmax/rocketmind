import {
  CONSULTING_SERVICES,
  ACADEMY_COURSES,
  AI_PRODUCTS,
} from "@rocketmind/ui/content";
import type { SitePage, PageBlock, BlockType } from "./types";
import { DEFAULT_BLOCK_TYPES } from "./constants";

function navToPages(
  items: Array<{ href: string; title: string; description: string }>,
  sectionId: string
): SitePage[] {
  return items.map((item, index) => {
    const slug = item.href.split("/").pop() || "";
    const now = new Date().toISOString();
    const blocks: PageBlock[] = DEFAULT_BLOCK_TYPES.map(
      (type: BlockType, i: number) => ({
        id: `${slug}_${type}`,
        type,
        enabled: true,
        order: i,
        data: {},
      })
    );
    return {
      id: `${sectionId}/${slug}`,
      sectionId,
      slug,
      status: "published" as const,
      order: index,
      menuTitle: item.title,
      menuDescription: item.description,
      cardTitle: item.title,
      cardDescription: item.description,
      metaTitle: `${item.title} — Rocketmind`,
      metaDescription: item.description,
      blocks,
      createdAt: now,
      updatedAt: now,
    };
  });
}

export function createSeedPages(): SitePage[] {
  return [
    ...navToPages(CONSULTING_SERVICES, "consulting"),
    ...navToPages(ACADEMY_COURSES, "academy"),
    ...navToPages(AI_PRODUCTS, "ai-products"),
  ];
}
