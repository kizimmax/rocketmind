import type { Metadata } from "next";
import { getAllArticles, getAllTags, getTagUsage } from "@/lib/articles";
import { getExpertBySlug } from "@/lib/experts";
import { MediaListClient } from "@/components/media/media-list-client";

export const metadata: Metadata = {
  title: "Медиа | Rocketmind",
  description:
    "Блог Rocketmind — статьи о стратегии, бизнес-дизайне, AI-продуктах и экспертных сетях.",
};

export default function MediaPage() {
  const articles = getAllArticles();
  const tags = getAllTags();
  const usage = getTagUsage();

  const enriched = articles.map((a) => {
    const expert = a.expertSlug ? getExpertBySlug(a.expertSlug) : null;
    return {
      ...a,
      expertName: expert?.name ?? null,
      expertAvatarUrl: expert?.image ?? null,
    };
  });

  const visibleTags = tags.filter((t) => (usage[t.id] ?? 0) > 0);

  return <MediaListClient articles={enriched} tags={visibleTags} />;
}
