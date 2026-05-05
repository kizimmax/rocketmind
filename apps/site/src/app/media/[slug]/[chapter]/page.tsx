import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  collectResolvedCtas,
  collectResolvedProductAsides,
  collectResolvedQuoteExperts,
  getAllArticles,
  getArticleBySlug,
  getPublicTags,
  getSimilarArticles,
} from "@/lib/articles";
import { getExpertBySlug } from "@/lib/experts";
import { getGlossaryIndex } from "@/lib/glossary";
import { ArticlePageClient } from "@/components/media/article-page-client";
import {
  SimilarArticlesCarousel,
  type SimilarArticleCard,
} from "@/components/media/similar-articles-carousel";
import { PageBottom } from "@/components/sections/PageBottom";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

export async function generateStaticParams() {
  const articles = await getAllArticles();
  return articles
    .filter((a) => a.multiPage && a.chapters.length > 0)
    .flatMap((a) => a.chapters.map((c) => ({ slug: a.slug, chapter: c.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; chapter: string }>;
}): Promise<Metadata> {
  const { slug, chapter } = await params;
  const article = await getArticleBySlug(slug);
  if (!article || !article.multiPage) {
    return { title: "Статья не найдена | Rocketmind" };
  }
  const ch = article.chapters.find((c) => c.slug === chapter);
  if (!ch) return { title: "Раздел не найден | Rocketmind" };
  const titleBase = ch.navLabel || article.title;
  return {
    title: article.metaTitle
      ? `${titleBase} — ${article.metaTitle}`
      : `${titleBase} — ${article.title} | Rocketmind`,
    description: article.metaDescription || article.description,
  };
}

export default async function ArticleChapterPage({
  params,
}: {
  params: Promise<{ slug: string; chapter: string }>;
}) {
  const { slug, chapter } = await params;
  const article = await getArticleBySlug(slug);
  if (!article || !article.multiPage) notFound();
  const currentChapter = article.chapters.find((c) => c.slug === chapter);
  if (!currentChapter) notFound();

  const expert = article.expertSlug ? await getExpertBySlug(article.expertSlug) : null;
  const tags = await getPublicTags();
  const tagLabelById: Record<string, string> = {};
  for (const t of tags) tagLabelById[t.id] = t.label;

  const resolvedProducts = await collectResolvedProductAsides(article);
  const resolvedQuoteExperts = await collectResolvedQuoteExperts(article);
  const resolvedCtas = await collectResolvedCtas(article);
  const glossaryIndex = await getGlossaryIndex();

  const similar = await getSimilarArticles(article);
  const similarArticles: SimilarArticleCard[] = await Promise.all(
    similar.map(async (a) => {
      const exp = a.expertSlug ? await getExpertBySlug(a.expertSlug) : null;
      return {
        slug: a.slug,
        title: a.title,
        description: a.description,
        publishedAt: a.publishedAt,
        coverUrl: a.coverUrl,
        tags: a.tags
          .map((id) => tagLabelById[id])
          .filter((label): label is string => Boolean(label)),
        expertName: exp?.name ?? null,
        expertAvatarUrl: exp?.image ?? null,
      };
    }),
  );

  const idx = article.chapters.findIndex((c) => c.id === currentChapter.id);
  const prevCh = idx > 0 ? article.chapters[idx - 1] : null;
  const nextCh = idx < article.chapters.length - 1 ? article.chapters[idx + 1] : null;
  const pagination = {
    prev: prevCh
      ? { label: prevCh.navLabel || prevCh.slug, href: `${BASE}/media/${article.slug}/${prevCh.slug}` }
      : undefined,
    next: nextCh
      ? { label: nextCh.navLabel || nextCh.slug, href: `${BASE}/media/${article.slug}/${nextCh.slug}` }
      : undefined,
  };

  const tagItems = (() => {
    const items = article.tags
      .map((id) => {
        const label = tagLabelById[id];
        return label ? { id, label } : null;
      })
      .filter((t): t is { id: string; label: string } => t !== null);
    if (article.type === "lesson" || article.type === "case") {
      const sys = tags.find((t) => t.id === article.type);
      if (sys && !sys.disabled) items.unshift({ id: sys.id, label: sys.label });
    }
    return items;
  })();

  return (
    <>
      <ArticlePageClient
        article={article}
        currentChapterId={currentChapter.id}
        pagination={pagination}
        expertName={expert?.name ?? null}
        expertAvatarUrl={expert?.image ?? null}
        tagItems={tagItems}
        resolvedProducts={resolvedProducts}
        resolvedQuoteExperts={resolvedQuoteExperts}
        resolvedCtas={resolvedCtas}
        glossaryIndex={glossaryIndex}
      />
      {similarArticles.length > 0 && (
        <SimilarArticlesCarousel articles={similarArticles} />
      )}
      <PageBottom />
      {/* Спейсер под фиксированный бар MobileChapterTabs (64px + safe-area). */}
      <div
        aria-hidden
        className="h-[64px] md:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      />
    </>
  );
}
