import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  collectResolvedCtas,
  collectResolvedProductAsides,
  collectResolvedQuoteExperts,
  getAllArticles,
  getArticleBySlug,
  getPublicTags,
} from "@/lib/articles";
import { getExpertBySlug } from "@/lib/experts";
import { ArticlePageClient } from "@/components/media/article-page-client";
import {
  SimilarArticlesCarousel,
  type SimilarArticleCard,
} from "@/components/media/similar-articles-carousel";
import { PageBottom } from "@/components/sections/PageBottom";

const SIMILAR_ARTICLES_LIMIT = 12;

export function generateStaticParams() {
  return getAllArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) {
    return { title: "Статья не найдена | Rocketmind" };
  }
  return {
    title: article.metaTitle || `${article.title} | Rocketmind`,
    description: article.metaDescription || article.description,
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const expert = article.expertSlug ? getExpertBySlug(article.expertSlug) : null;
  const tags = getPublicTags();
  const tagLabelById: Record<string, string> = {};
  for (const t of tags) tagLabelById[t.id] = t.label;

  const resolvedProducts = collectResolvedProductAsides(article);
  const resolvedQuoteExperts = collectResolvedQuoteExperts(article);
  const resolvedCtas = collectResolvedCtas(article);

  // Похожие статьи: общий хотя бы один тег с текущей, исключая саму статью.
  // Сортировка — по `publishedAt` desc (свежие выше). Лимит — 12.
  const currentTagSet = new Set(article.tags);
  const similarArticles: SimilarArticleCard[] =
    currentTagSet.size === 0
      ? []
      : getAllArticles()
          .filter(
            (a) =>
              a.slug !== article.slug && a.tags.some((t) => currentTagSet.has(t)),
          )
          .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
          .slice(0, SIMILAR_ARTICLES_LIMIT)
          .map((a) => {
            const exp = a.expertSlug ? getExpertBySlug(a.expertSlug) : null;
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
          });

  return (
    <>
      <ArticlePageClient
        article={article}
        expertName={expert?.name ?? null}
        expertAvatarUrl={expert?.image ?? null}
        tagItems={(() => {
          const items = article.tags
            .map((id) => {
              const label = tagLabelById[id];
              return label ? { id, label } : null;
            })
            .filter((t): t is { id: string; label: string } => t !== null);
          // Системный тег типа («Урок»/«Кейс») добавляем в начало общего списка
          // тегов на странице статьи. Внутри страницы он выглядит как обычный
          // тег (без cardColor) — отличается только id (lesson/case), который
          // ведёт на соответствующий фильтр /media/tag/<id>.
          if (article.type === "lesson" || article.type === "case") {
            const sys = tags.find((t) => t.id === article.type);
            if (sys && !sys.disabled) {
              items.unshift({ id: sys.id, label: sys.label });
            }
          }
          return items;
        })()}
        resolvedProducts={resolvedProducts}
        resolvedQuoteExperts={resolvedQuoteExperts}
        resolvedCtas={resolvedCtas}
      />
      {similarArticles.length > 0 && (
        <SimilarArticlesCarousel articles={similarArticles} />
      )}
      <PageBottom />
    </>
  );
}
