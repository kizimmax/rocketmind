"use client";

import { useEffect, useState } from "react";
import {
  ArticleCard,
  type ArticleCardTypeBadgeColor,
} from "@rocketmind/ui";
import { apiFetch } from "@/lib/api-client";
import { useAdminStore } from "@/lib/store";
import type { Article } from "@/lib/types";

type Expert = { slug: string; name: string; image: string | null };

const EDITORIAL_EXPERT: Expert = {
  slug: "r-editorial",
  name: "R-Редакция",
  image: null,
};

interface Props {
  draft: Article;
}

/**
 * Правая колонка редактора — превью ArticleCard в том виде, в котором
 * карточка появится в списке /media и на разводных страницах.
 */
export function ArticlePreviewCard({ draft }: Props) {
  const { mediaTags } = useAdminStore();

  const [experts, setExperts] = useState<Expert[]>([EDITORIAL_EXPERT]);
  useEffect(() => {
    apiFetch("/api/experts")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) =>
        setExperts(
          Array.isArray(data)
            ? [
                EDITORIAL_EXPERT,
                ...data.map(
                  (e: { slug: string; name: string; image?: string | null }) => ({
                    slug: e.slug,
                    name: e.name,
                    image: e.image ?? null,
                  }),
                ),
              ]
            : [EDITORIAL_EXPERT]
        )
      )
      .catch(() => setExperts([EDITORIAL_EXPERT]));
  }, []);

  const expert = experts.find((e) => e.slug === draft.expertSlug);
  const tagLabels = draft.tagIds
    .map((id) => mediaTags.find((t) => t.id === id)?.label)
    .filter((l): l is string => Boolean(l));

  // Тип-бейдж берём из системного тега `lesson`/`case` — берём label и
  // cardColor оттуда, чтобы превью точно соответствовало /media.
  let typeBadge: { label: string; color: ArticleCardTypeBadgeColor } | undefined;
  if (draft.type === "lesson" || draft.type === "case") {
    const sys = mediaTags.find((t) => t.id === draft.type);
    if (sys && !sys.disabled) {
      typeBadge = {
        label: sys.label,
        color:
          (sys.cardColor ??
            (draft.type === "lesson" ? "sky" : "terracotta")) as ArticleCardTypeBadgeColor,
      };
    }
  }

  return (
    <ArticleCard
      title={draft.title || "Название статьи"}
      description={draft.description || ""}
      coverUrl={draft.coverImageData}
      tags={tagLabels}
      typeBadge={typeBadge}
      authorName={expert?.name}
      authorAvatarUrl={expert?.image}
      date={draft.publishedAt}
    />
  );
}
