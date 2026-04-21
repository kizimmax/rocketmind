import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllArticles, getArticleBySlug, getAllTags } from "@/lib/articles";
import { getExpertBySlug } from "@/lib/experts";
import { ArticlePageClient } from "@/components/media/article-page-client";

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
  const tags = getAllTags();
  const tagLabelById: Record<string, string> = {};
  for (const t of tags) tagLabelById[t.id] = t.label;

  return (
    <ArticlePageClient
      article={article}
      expertName={expert?.name ?? null}
      expertAvatarUrl={expert?.image ?? null}
      tagLabels={article.tags.map((id) => tagLabelById[id] ?? id)}
    />
  );
}
