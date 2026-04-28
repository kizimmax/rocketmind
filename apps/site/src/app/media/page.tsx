import type { Metadata } from "next";
import { getAllArticles, getPublicTags, getTagUsage } from "@/lib/articles";
import { getAllGlossaryTerms } from "@/lib/glossary";
import { getExpertBySlug } from "@/lib/experts";
import { MediaListClient } from "@/components/media/media-list-client";

export const metadata: Metadata = {
  title: "Медиа | Rocketmind",
  description:
    "Блог Rocketmind — статьи о стратегии, бизнес-дизайне, AI-продуктах и экспертных сетях.",
};

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** Собирает текстовое представление всех блоков статьи для поиска. */
function flattenBodyText(sections: Array<{ title: string; blocks: Array<{ type: string; data: Record<string, unknown> }> }>): string {
  const parts: string[] = [];
  for (const s of sections) {
    if (s.title) parts.push(s.title);
    for (const b of s.blocks) {
      const text = b.data.text;
      if (typeof text === "string") parts.push(text);
      const caption = b.data.caption;
      if (typeof caption === "string") parts.push(caption);
    }
  }
  return parts.join(" \n ");
}

export default function MediaPage() {
  const articles = getAllArticles();
  const tags = getPublicTags();
  const usage = getTagUsage();
  const glossary = getAllGlossaryTerms();

  const enriched = articles.map((a) => {
    const expert = a.expertSlug ? getExpertBySlug(a.expertSlug) : null;
    return {
      ...a,
      expertName: expert?.name ?? null,
      expertAvatarUrl: expert?.image ?? null,
      bodyText: flattenBodyText(a.sections),
    };
  });

  const visibleTags = tags.filter((t) => (usage[t.id] ?? 0) > 0);

  const glossaryItems = glossary.map((t) => ({
    slug: t.slug,
    title: t.title,
    href: `${BASE}/media/glossary#${t.slug}`,
    tagIds: t.tags,
  }));

  return (
    <MediaListClient
      articles={enriched}
      tags={visibleTags}
      glossaryTerms={glossaryItems}
    />
  );
}
