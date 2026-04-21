"use client";

import { useEffect, useState } from "react";
import { ArticleCard } from "@rocketmind/ui";
import { apiFetch } from "@/lib/api-client";
import { useAdminStore } from "@/lib/store";
import type { Article } from "@/lib/types";

type Expert = { slug: string; name: string; image: string | null };

interface Props {
  draft: Article;
}

/**
 * Правая колонка редактора — превью ArticleCard в том виде, в котором
 * карточка появится в списке /media и на разводных страницах.
 */
export function ArticlePreviewCard({ draft }: Props) {
  const { mediaTags } = useAdminStore();

  const [experts, setExperts] = useState<Expert[]>([]);
  useEffect(() => {
    apiFetch("/api/experts")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) =>
        setExperts(
          Array.isArray(data)
            ? data.map((e: { slug: string; name: string; image?: string | null }) => ({
                slug: e.slug,
                name: e.name,
                image: e.image ?? null,
              }))
            : []
        )
      )
      .catch(() => setExperts([]));
  }, []);

  const expert = experts.find((e) => e.slug === draft.expertSlug);
  const tagLabels = draft.tagIds
    .map((id) => mediaTags.find((t) => t.id === id)?.label)
    .filter((l): l is string => Boolean(l));

  return (
    <ArticleCard
      title={draft.title || "Название статьи"}
      description={draft.description || ""}
      coverUrl={draft.coverImageData}
      tags={tagLabels}
      authorName={expert?.name}
      authorAvatarUrl={expert?.image}
      date={draft.publishedAt}
    />
  );
}
