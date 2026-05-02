import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  collectTermResolvedCtas,
  collectTermResolvedProductAsides,
  collectTermResolvedQuoteExperts,
  getAllGlossaryTerms,
  getGlossaryIndex,
  getGlossaryTermBySlug,
} from "@/lib/glossary";
import { getPublicTags } from "@/lib/articles";
import { GlossaryTermPageClient } from "@/components/glossary/term-page-client";
import { PageBottom } from "@/components/sections/PageBottom";

export async function generateStaticParams() {
  return (await getAllGlossaryTerms()).map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const term = await getGlossaryTermBySlug(slug);
  if (!term) return { title: "Термин не найден | Rocketmind" };
  return {
    title: term.metaTitle || `${term.title} | Глоссарий Rocketmind`,
    description: term.metaDescription || undefined,
    alternates: { canonical: `/media/glossary/term/${slug}` },
  };
}

export default async function GlossaryTermPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const term = await getGlossaryTermBySlug(slug);
  if (!term || term.status !== "published") notFound();

  const tags = await getPublicTags();
  const tagLabelById: Record<string, string> = {};
  for (const t of tags) tagLabelById[t.id] = t.label;
  const tagItems = term.tags
    .map((id) => {
      const label = tagLabelById[id];
      return label ? { id, label } : null;
    })
    .filter((t): t is { id: string; label: string } => t !== null);

  const resolvedProducts = await collectTermResolvedProductAsides(term);
  const resolvedQuoteExperts = await collectTermResolvedQuoteExperts(term);
  const resolvedCtas = await collectTermResolvedCtas(term);
  const glossaryIndex = await getGlossaryIndex();

  return (
    <>
      <GlossaryTermPageClient
        term={term}
        tagItems={tagItems}
        resolvedProducts={resolvedProducts}
        resolvedQuoteExperts={resolvedQuoteExperts}
        resolvedCtas={resolvedCtas}
        glossaryIndex={glossaryIndex}
      />
      <PageBottom />
    </>
  );
}
