import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllGlossaryTerms } from "@/lib/glossary";
import { getPublicTags, getTagById } from "@/lib/articles";
import { GlossaryPageClient } from "@/components/glossary/glossary-page-client";
import { PageBottom } from "@/components/sections/PageBottom";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** SSG: только теги, у которых есть хоть один термин. */
export function generateStaticParams() {
  const terms = getAllGlossaryTerms();
  const used = new Set<string>();
  for (const t of terms) for (const tag of t.tags) used.add(tag);
  return getPublicTags()
    .filter((t) => used.has(t.id))
    .map((t) => ({ slug: t.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tag = getTagById(slug);
  if (!tag || tag.disabled) return {};

  const accent = tag.seo?.pageTitleAccent ?? tag.label;
  const prefix = tag.seo?.pageTitlePrefix ?? "Глоссарий";
  const title = tag.seo?.metaTitle ?? `${prefix} — ${accent} | Rocketmind`;
  const description =
    tag.seo?.metaDescription ??
    `Термины глоссария Rocketmind по теме «${accent.toLowerCase()}».`;

  return {
    title,
    description,
    alternates: { canonical: `/media/glossary/tag/${slug}` },
  };
}

export default async function GlossaryTagPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tag = getTagById(slug);
  if (!tag || tag.disabled) return notFound();

  const terms = getAllGlossaryTerms();
  const allTags = getPublicTags();

  const termsWithThisTag = terms.filter((t) => t.tags.includes(slug));
  if (termsWithThisTag.length === 0) return notFound();

  // Только теги, реально присутствующие в терминах — у них есть SSG-страницы.
  const termTagIds = new Set<string>();
  for (const t of terms) for (const tagId of t.tags) termTagIds.add(tagId);
  const visibleTags = allTags.filter((t) => termTagIds.has(t.id));

  const items = terms.map((t) => ({
    slug: t.slug,
    title: t.title,
    href: `${BASE}/media/glossary/term/${t.slug}`,
    tagIds: t.tags,
  }));

  return (
    <>
      <GlossaryPageClient
        terms={items}
        tags={visibleTags}
        activeTag={slug}
        headingPrefix={tag.seo?.pageTitlePrefix ?? "Глоссарий"}
        headingAccent={tag.seo?.pageTitleAccent ?? tag.label}
        intro={tag.seo?.intro}
      />
      <PageBottom />
    </>
  );
}
