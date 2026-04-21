"use client";

import { useMemo, useState } from "react";
import { Tag, ArticleCard, Breadcrumbs } from "@rocketmind/ui";
import type { MediaTag } from "@/lib/articles";

type Item = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  coverUrl: string | null;
  tags: string[];
  expertName: string | null;
  expertAvatarUrl: string | null;
};

interface Props {
  articles: Item[];
  tags: MediaTag[];
}

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function MediaListClient({ articles, tags }: Props) {
  const [filter, setFilter] = useState<string>("all");

  const filtered = useMemo(() => {
    if (filter === "all") return articles;
    return articles.filter((a) => a.tags.includes(filter));
  }, [articles, filter]);

  const tagLabelById = useMemo(() => {
    const map: Record<string, string> = {};
    for (const t of tags) map[t.id] = t.label;
    return map;
  }, [tags]);

  return (
    <div className="px-5 py-20 md:px-8 md:py-24 xl:px-14">
      <div className="mx-auto max-w-[1512px]">
        <div className="mb-6">
          <Breadcrumbs
            items={[
              { label: "Главная", href: `${BASE}/` },
              { label: "Медиа" },
            ]}
          />
        </div>

        <div className="mb-10 flex flex-col gap-6">
          <h1 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-30)] uppercase tracking-[-0.02em] leading-[1.08] md:text-[length:var(--text-52)]">
            Медиа
          </h1>
          <p className="max-w-2xl text-[length:var(--text-18)] leading-[1.4] text-[color:var(--rm-gray-fg-sub)]">
            Статьи, разборы и заметки Rocketmind — про стратегию, бизнес-дизайн и AI-продукты.
          </p>
        </div>

        {/* Tag filter strip */}
        <div className="mb-10 flex flex-wrap gap-2">
          <Tag
            size="m"
            state={filter === "all" ? "active" : "interactive"}
            as="button"
            onClick={() => setFilter("all")}
          >
            Все статьи
          </Tag>
          {tags.map((t) => (
            <Tag
              key={t.id}
              size="m"
              state={filter === t.id ? "active" : "interactive"}
              as="button"
              onClick={() => setFilter(t.id)}
            >
              {t.label}
            </Tag>
          ))}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <p className="py-16 text-center text-[length:var(--text-14)] text-[color:var(--rm-gray-fg-sub)]">
            По выбранному тегу статей нет.
          </p>
        ) : (
          <div className="flex flex-wrap gap-6 md:gap-8">
            {filtered.map((a) => (
              <ArticleCard
                key={a.slug}
                href={`${BASE}/media/${a.slug}`}
                title={a.title}
                description={a.description}
                coverUrl={a.coverUrl}
                tags={a.tags.map((id) => tagLabelById[id] ?? id)}
                authorName={a.expertName ?? undefined}
                authorAvatarUrl={a.expertAvatarUrl}
                date={a.publishedAt}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
