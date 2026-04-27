import type { Metadata } from "next";
import { getAllGlossaryTerms } from "@/lib/glossary";
import { getAllTags, getTagUsage } from "@/lib/articles";
import { GlossaryPageClient } from "@/components/glossary/glossary-page-client";

export const metadata: Metadata = {
  title: "Глоссарий | Rocketmind",
  description:
    "Словарь терминов Rocketmind — стратегия, бизнес-дизайн, AI-продукты и экспертные продуктовые команды.",
};

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

export default function GlossaryPage() {
  const terms = getAllGlossaryTerms();
  const allTags = getAllTags();
  const usage = getTagUsage();

  // Показываем только теги, которые встречаются хоть в одном термине или статье.
  const termTagIds = new Set<string>();
  for (const t of terms) for (const tag of t.tags) termTagIds.add(tag);
  const visibleTags = allTags.filter(
    (t) => termTagIds.has(t.id) || (usage[t.id] ?? 0) > 0,
  );

  const items = terms.map((t) => ({
    slug: t.slug,
    title: t.title,
    href: `${BASE}/media/glossary#${t.slug}`,
    tagIds: t.tags,
  }));

  return <GlossaryPageClient terms={items} tags={visibleTags} />;
}
