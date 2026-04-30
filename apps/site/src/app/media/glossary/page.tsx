import type { Metadata } from "next";
import { getAllGlossaryTerms } from "@/lib/glossary";
import { getPublicTags } from "@/lib/articles";
import { GlossaryPageClient } from "@/components/glossary/glossary-page-client";
import { PageBottom } from "@/components/sections/PageBottom";

export const metadata: Metadata = {
  title: "Глоссарий | Rocketmind",
  description:
    "Словарь терминов Rocketmind — стратегия, бизнес-дизайн, AI-продукты и экспертные продуктовые команды.",
};

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

export default function GlossaryPage() {
  const terms = getAllGlossaryTerms();
  const allTags = getPublicTags();

  // Показываем только теги, которые встречаются хотя бы в одном термине —
  // у них есть статическая landing-страница `/media/glossary/tag/<id>`.
  const termTagIds = new Set<string>();
  for (const t of terms) for (const tag of t.tags) termTagIds.add(tag);
  const visibleTags = allTags.filter((t) => termTagIds.has(t.id));

  const items = terms.map((t) => ({
    slug: t.slug,
    title: t.title,
    href: `${BASE}/media/glossary/term/${t.slug}`,
    tagIds: t.tags,
  }));

  return (
    <>
      <GlossaryPageClient terms={items} tags={visibleTags} />
      <PageBottom />
    </>
  );
}
