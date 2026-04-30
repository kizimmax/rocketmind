import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getAllArticles,
  getPublicTags,
  getTagUsage,
  getTagById,
} from "@/lib/articles";
import { getAllGlossaryTerms } from "@/lib/glossary";
import { getExpertBySlug } from "@/lib/experts";
import { MediaListClient } from "@/components/media/media-list-client";
import { PageBottom } from "@/components/sections/PageBottom";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

function flattenBodyText(
  sections: Array<{
    title: string;
    blocks: Array<{ type: string; data: Record<string, unknown> }>;
  }>,
): string {
  const parts: string[] = [];
  for (const s of sections) {
    if (s.title) parts.push(s.title);
    for (const b of s.blocks) {
      const text = b.data.text;
      if (typeof text === "string") parts.push(text);
      const caption = b.data.caption;
      if (typeof caption === "string") parts.push(caption);
      if (b.type === "factoid-grid" && Array.isArray(b.data.cards)) {
        for (const c of b.data.cards) {
          if (c && typeof c === "object") {
            const rec = c as Record<string, unknown>;
            if (typeof rec.number === "string") parts.push(rec.number);
            if (typeof rec.text === "string") parts.push(rec.text);
          }
        }
      }
    }
  }
  return parts.join(" \n ");
}

/** SSG: только используемые публичные теги. */
export function generateStaticParams() {
  const usage = getTagUsage();
  return getPublicTags()
    .filter((t) => (usage[t.id] ?? 0) > 0)
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
  const prefix = tag.seo?.pageTitlePrefix ?? "Медиа";
  const title = tag.seo?.metaTitle ?? `${prefix} — ${accent} | Rocketmind`;
  const description =
    tag.seo?.metaDescription ??
    `Статьи Rocketmind по теме «${accent.toLowerCase()}».`;

  return {
    title,
    description,
    alternates: { canonical: `/media/tag/${slug}` },
  };
}

export default async function MediaTagPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tag = getTagById(slug);
  if (!tag || tag.disabled) return notFound();

  const articles = getAllArticles();
  const tags = getPublicTags();
  const usage = getTagUsage();
  const glossary = getAllGlossaryTerms();

  // Доступ к "удалённой" странице (тег без статей) — 404, иначе SEO-индексация
  // пустых разделов.
  if ((usage[slug] ?? 0) === 0) return notFound();

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
    href: `${BASE}/media/glossary/term/${t.slug}`,
    tagIds: t.tags,
  }));

  return (
    <>
      <MediaListClient
        articles={enriched}
        tags={visibleTags}
        glossaryTerms={glossaryItems}
        activeTag={slug}
        headingPrefix={tag.seo?.pageTitlePrefix ?? "Медиа"}
        headingAccent={tag.seo?.pageTitleAccent ?? tag.label}
        intro={tag.seo?.intro}
        breadcrumbs={[
          { label: "Главная", href: `${BASE}/` },
          { label: "Медиа", href: `${BASE}/media` },
          { label: tag.seo?.pageTitleAccent ?? tag.label },
        ]}
      />
      <PageBottom />
    </>
  );
}
