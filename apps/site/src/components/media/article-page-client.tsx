"use client";

import { useEffect, useState } from "react";
import {
  Breadcrumbs,
  Tag,
  Author,
  KeyThoughts,
  ArticleNav,
} from "@rocketmind/ui";
import type { ArticleEntry } from "@/lib/articles";

interface Props {
  article: ArticleEntry;
  expertName: string | null;
  expertAvatarUrl: string | null;
  tagLabels: string[];
}

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

/**
 * Клиент-компонент страницы статьи.
 *
 * В текущей итерации:
 *  - Hero (breadcrumbs + title + description + cover + tags + author + key thoughts)
 *  - Левая ToC-навигация (placeholder: items пустые, компонент не рендерится)
 *  - Тело статьи (placeholder — будет собираться из inline-блоков на следующем этапе)
 *
 * ToC auto-builds из H2 в теле статьи (scrollspy через IntersectionObserver). Пока body пуст —
 * items пустые, компонент возвращает null.
 */
export function ArticlePageClient({
  article,
  expertName,
  expertAvatarUrl,
  tagLabels,
}: Props) {
  // Auto-collect H2 headings from the rendered body. Empty in this iteration.
  const [navItems, setNavItems] = useState<{ id: string; label: string }[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    // When body is implemented in next iteration: query all <h2 id="..."> in the body
    // element and set navItems + scrollspy observer.
    const bodyEl = document.getElementById("article-body");
    if (!bodyEl) return;
    const h2s = Array.from(bodyEl.querySelectorAll<HTMLHeadingElement>("h2[id]"));
    setNavItems(h2s.map((h) => ({ id: h.id, label: h.textContent ?? "" })));

    if (h2s.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    h2s.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [article.slug]);

  return (
    <article className="px-5 py-16 md:px-8 md:py-20 xl:px-14">
      <div className="mx-auto max-w-[1512px]">
        <div className="mb-8 md:mb-10 -mx-5 px-5 md:mx-0 md:px-0">
          <Breadcrumbs
            items={[
              { label: "Главная", href: `${BASE}/` },
              { label: "Медиа", href: `${BASE}/media` },
              { label: "Блог", href: `${BASE}/media` },
              { label: article.title },
            ]}
          />
        </div>

        {/* ── HERO: desktop 2-column, mobile 1-column ── */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,696px)_minmax(0,344px)] md:gap-6 xl:gap-2">
          {/* Left column: title + description + image */}
          <div className="flex flex-col gap-8 md:gap-10">
            <div className="flex flex-col gap-4 md:gap-7">
              <h1 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-32)] uppercase tracking-[-0.02em] leading-[1.08] text-[color:var(--rm-gray-fg-main)] md:text-[52px]">
                {article.title}
              </h1>
              {article.description && (
                <p className="text-[length:var(--text-16)] leading-[1.28] text-[color:var(--rm-gray-fg-main)] md:text-[length:var(--text-18)] md:leading-[1.2]">
                  {article.description}
                </p>
              )}
            </div>

            {/* Mobile: tags + author first, then image (per Figma mobile hero) */}
            <div className="flex flex-col gap-5 md:hidden">
              {tagLabels.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tagLabels.map((label) => (
                    <Tag key={label} size="m">
                      {label}
                    </Tag>
                  ))}
                </div>
              )}
              {expertName && (
                <Author
                  variant="full"
                  name={expertName}
                  avatarUrl={expertAvatarUrl}
                  date={article.publishedAt}
                />
              )}
            </div>

            {article.coverUrl ? (
              <div className="relative overflow-hidden rounded-sm bg-[color:var(--rm-gray-1)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={article.coverUrl}
                  alt=""
                  className="h-auto w-full object-cover md:h-[465px]"
                />
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background: "rgba(0,0,0,0.2)",
                  }}
                  aria-hidden
                />
              </div>
            ) : (
              <div
                className="rounded-sm bg-[color:var(--rm-gray-1)] md:h-[465px] aspect-[16/9] md:aspect-auto"
                aria-hidden
              />
            )}
          </div>

          {/* Right column: tags + author + key thoughts (desktop only) */}
          <aside className="hidden flex-col gap-10 md:flex md:pl-[26px] md:pt-[45px]">
            {tagLabels.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tagLabels.map((label) => (
                  <Tag key={label} size="l">
                    {label}
                  </Tag>
                ))}
              </div>
            )}

            {expertName && (
              <Author
                variant="full"
                name={expertName}
                avatarUrl={expertAvatarUrl}
                date={article.publishedAt}
              />
            )}

            {article.keyThoughts.length > 0 && (
              <KeyThoughts thoughts={article.keyThoughts} />
            )}
          </aside>

          {/* Mobile: key thoughts go under everything */}
          {article.keyThoughts.length > 0 && (
            <div className="md:hidden">
              <KeyThoughts thoughts={article.keyThoughts} />
            </div>
          )}
        </div>

        {/* ── BODY + LEFT ToC ── */}
        <div className="mt-16 md:mt-24 grid grid-cols-1 gap-10 lg:grid-cols-[268px_minmax(0,1fr)] lg:gap-12">
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <ArticleNav items={navItems} activeId={activeId} />
              {navItems.length === 0 && (
                <p className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.02em] text-[color:var(--rm-gray-3)]">
                  Навигация появится после добавления заголовков в тело статьи
                </p>
              )}
            </div>
          </aside>

          <div id="article-body" className="max-w-[800px]">
            <div className="flex flex-col items-start gap-3 rounded-sm border border-dashed border-[color:var(--rm-gray-3)] bg-[color:var(--rm-gray-1)]/20 p-6 md:p-10">
              <p className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.02em] text-[color:var(--rm-gray-fg-sub)]">
                Тело статьи
              </p>
              <p className="text-[length:var(--text-14)] leading-[1.4] text-[color:var(--rm-gray-fg-sub)]">
                Редактор тела статьи — следующая итерация. Здесь появятся inline-блоки
                (параграф, заголовок H2, цитата, картинка, список, callout). Левая ToC
                начнёт автоматически собирать пункты из H2.
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
