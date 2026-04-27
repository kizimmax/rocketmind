"use client"

import React, { useState } from "react"
import {
  Breadcrumbs,
  Tag,
  Author,
  KeyThoughts,
  ArticleNav,
  ArticleCard,
  ArticleBody,
  VideoPlayer,
  type ArticleBodyBlock,
} from "@rocketmind/ui"
import { Section, SubSection } from "@/components/ds/shared"

const DEMO_BREADCRUMBS = [
  { label: "Главная", href: "/" },
  { label: "Медиа", href: "/media" },
  { label: "Блог", href: "/media?tag=blog" },
  { label: "Название статьи блога" },
]

const DEMO_THOUGHTS = [
  "В экспертную сеть объединяются профессионалы из разных стран. Они сами устанавливают правила работы и используют облачные сервисы, чтобы работать без привязки к географии",
  "Минсвязи объединяет государственные сайты в единую систему",
  "В экспертную сеть объединяются профессионалы из разных стран",
]

const DEMO_BODY: ArticleBodyBlock[] = [
  { id: "b1", type: "h2", data: { text: "Начало работы" } },
  {
    id: "b2",
    type: "paragraph",
    data: {
      text: "Летом 2015 года Минкомсвязи объявило конкурс на продвижение нового портала. Победителем стала экспертная сеть Rocketmind — подробности в [анонсе проекта](#).",
    },
  },
  {
    id: "b3",
    type: "quote",
    data: { text: "Портал, как единая точка контакта с государством" },
  },
  { id: "b4", type: "h3", data: { text: "Подзаголовок второго уровня" } },
  { id: "b5", type: "h4", data: { text: "Подзаголовок третьего уровня" } },
  {
    id: "b6",
    type: "paragraph",
    data: {
      text: "Экспертная сеть объединяет профессионалов из разных стран. Они сами устанавливают правила работы и используют облачные сервисы.",
    },
  },
  {
    id: "b7",
    type: "paragraph",
    data: {
      text: "Второй абзац подряд — проверяет плотный ритм 16px между параграфами.",
    },
  },
  { id: "b8", type: "h2", data: { text: "Вторая секция" } },
  {
    id: "b9",
    type: "paragraph",
    data: { text: "Перед этим h2 должен быть большой отступ 56px (44px на mobile)." },
  },
  {
    id: "b10",
    type: "video",
    data: {
      src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
      caption: "Видео во всю ширину колонки, 16/9",
    },
  },
]

const DEMO_VIDEO_SRC =
  "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"

const DEMO_NAV = [
  { id: "intro",   label: "Открытая платформа" },
  { id: "portal",  label: "Закрытый портал" },
  { id: "analysis",label: "Анализ" },
  { id: "ads",     label: "Реклама" },
  { id: "help",    label: "Помощь" },
  { id: "projects",label: "Проекты" },
]

export default function ArticlePage() {
  const [activeFilter, setActiveFilter] = useState<string>("all")
  const [navActive, setNavActive] = useState<string>("projects")

  return (
    <>
      <Section id="article" title="Статья">
        <p className="text-muted-foreground mb-8">
          Паттерны страницы статьи (<code>/media/[slug]</code>) и её карточки в списке <code>/media</code>. Шесть примитивов, покрывающих hero, тело с левой ToC, «ключевые мысли» и карточку.
        </p>

        {/* ═══════════════ 1. BREADCRUMBS ═══════════════ */}
        <SubSection id="article-breadcrumbs" title="Хлебные крошки" first />
        <p className="text-[length:var(--text-14)] text-muted-foreground mb-6">
          Путь над hero статьи. Desktop — row, gap 12. Mobile — горизонтальный скролл, прижатый к концу (видно текущее положение).
        </p>

        <div className="rounded-lg border border-border p-8 mb-6 bg-rm-gray-1/30">
          <div className="text-[length:var(--text-11)] uppercase tracking-wider text-muted-foreground mb-3">Desktop</div>
          <Breadcrumbs items={DEMO_BREADCRUMBS} />
        </div>

        <div className="rounded-lg border border-border overflow-hidden mb-10 bg-rm-gray-1/30">
          <div className="px-4 py-2 text-[length:var(--text-11)] uppercase tracking-wider text-muted-foreground border-b border-border">Mobile (375px) — скролл прижат к концу</div>
          <div className="mx-auto" style={{ maxWidth: 375 }}>
            <div className="px-5 py-4">
              <Breadcrumbs items={DEMO_BREADCRUMBS.map((b, i) => i === DEMO_BREADCRUMBS.length - 1 ? { ...b, label: "Название статьи блога если очень длинный заголовок" } : b)} />
            </div>
          </div>
        </div>

        {/* ═══════════════ 2. TAG ═══════════════ */}
        <SubSection id="article-tag" title="Tag / Тег" />
        <p className="text-[length:var(--text-14)] text-muted-foreground mb-6">
          Три размера (L/M/S) и четыре состояния. Используется для рубрикации, карточек и фильтра на /media.
        </p>

        <div className="grid gap-6 md:grid-cols-3 mb-6">
          {[
            { size: "l" as const, label: "L — Article hero", specs: "h-28, pad 4×10, Label 14" },
            { size: "m" as const, label: "M — Mobile / filter", specs: "h-28, pad 4×10, Label 12" },
            { size: "s" as const, label: "S — ArticleCard", specs: "auto h, pad 4×8, Label 12" },
          ].map(({ size, label, specs }) => (
            <div key={size} className="rounded-lg border border-border p-6 bg-rm-gray-1/30">
              <div className="text-[length:var(--text-11)] uppercase tracking-wider text-muted-foreground mb-1">{label}</div>
              <div className="text-[length:var(--text-12)] text-muted-foreground mb-4">{specs}</div>
              <div className="flex flex-wrap gap-2">
                <Tag size={size}>Стратегии</Tag>
                <Tag size={size}>Бизнес-дизайн</Tag>
                <Tag size={size}>Экспертная статья</Tag>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-lg border border-border p-6 mb-6 bg-rm-gray-1/30">
          <div className="text-[length:var(--text-11)] uppercase tracking-wider text-muted-foreground mb-4">Состояния</div>
          <div className="flex flex-wrap gap-3">
            <Tag size="l" state="default">Default</Tag>
            <Tag size="l" state="interactive" as="button">Interactive (hover)</Tag>
            <Tag size="l" state="active" as="button">Active (yellow)</Tag>
            <Tag size="l" state="disabled">Disabled</Tag>
          </div>
        </div>

        <div className="rounded-lg border border-border p-6 mb-10 bg-rm-gray-1/30">
          <div className="text-[length:var(--text-11)] uppercase tracking-wider text-muted-foreground mb-4">Пример фильтра /media</div>
          <div className="flex flex-wrap gap-2">
            {["all", "design", "strategy", "ai-products", "academy"].map((k) => {
              const label = k === "all" ? "Все статьи" : { design: "Дизайн", strategy: "Стратегии", "ai-products": "AI-продукты", academy: "Академия" }[k] ?? k
              return (
                <Tag
                  key={k}
                  size="m"
                  state={activeFilter === k ? "active" : "interactive"}
                  as="button"
                  onClick={() => setActiveFilter(k)}
                >
                  {label}
                </Tag>
              )
            })}
          </div>
        </div>

        {/* ═══════════════ 3. AUTHOR ═══════════════ */}
        <SubSection id="article-author" title="Author / Автор" />
        <p className="text-[length:var(--text-14)] text-muted-foreground mb-6">
          Блок «аватар + имя + дата». Вариант <code>full</code> — для hero статьи, <code>short</code> — для ArticleCard.
        </p>

        <div className="grid gap-6 md:grid-cols-2 mb-10">
          <div className="rounded-lg border border-border p-8 bg-rm-gray-1/30">
            <div className="text-[length:var(--text-11)] uppercase tracking-wider text-muted-foreground mb-4">Full — Hero статьи</div>
            <Author variant="full" name="Алексей Ерёмин" date="2025-05-16" />
          </div>
          <div className="rounded-lg border border-border p-8 bg-rm-gray-1/30">
            <div className="text-[length:var(--text-11)] uppercase tracking-wider text-muted-foreground mb-4">Short — ArticleCard</div>
            <Author variant="short" name="Алексей Ерёмин" date="2025-05-16" />
          </div>
        </div>

        {/* ═══════════════ 4. KEY THOUGHTS ═══════════════ */}
        <SubSection id="article-key-thoughts" title="Key Thoughts / Ключевые мысли" />
        <p className="text-[length:var(--text-14)] text-muted-foreground mb-6">
          Закреплённый блок тезисов, которые редактор выносит из тела статьи. Отображается в правой колонке hero на desktop.
        </p>

        <div className="rounded-lg border border-border p-8 mb-10 bg-rm-gray-1/30 max-w-[400px]">
          <KeyThoughts thoughts={DEMO_THOUGHTS} />
        </div>

        {/* ═══════════════ 5. ARTICLE NAV ═══════════════ */}
        <SubSection id="article-nav" title="ArticleNav / Левая ToC" />
        <p className="text-[length:var(--text-14)] text-muted-foreground mb-6">
          Левая навигация по разделам статьи на desktop. Пункты автогенерируются из H2 в теле. Активный пункт — жёлтый.
        </p>

        <div className="rounded-lg border border-border p-8 mb-10 bg-rm-gray-1/30">
          <ArticleNav
            items={DEMO_NAV}
            activeId={navActive}
            onNavigate={setNavActive}
          />
        </div>

        {/* ═══════════════ 6. ARTICLE CARD ═══════════════ */}
        <SubSection id="article-card" title="ArticleCard / Карточка" />
        <p className="text-[length:var(--text-14)] text-muted-foreground mb-6">
          Карточка статьи для списка <code>/media</code> и админского превью. 350×auto, glass-панель, картинка с градиентом, теги, заголовок, описание и автор.
        </p>

        <div className="rounded-lg border border-border p-10 mb-10 flex flex-wrap gap-6 justify-center bg-[#0A0A0A]">
          <ArticleCard
            href="#"
            title="Архитектура структурированных экосистем"
            description="Growth Product Owner в OneTwoTrip, — о том, что такое North Star Metric и почему это настоящая опора для продакта, даже если фича не взлетела"
            tags={["Бизнес-дизайн", "Консалтинг и стратегия", "Экспертные продукты"]}
            authorName="Алексей Ерёмин"
            date="2025-05-16"
          />
          <ArticleCard
            href="#"
            title="Как собрать команду для AI-продукта"
            description="Пять подходов к набору команды разработки ML-проектов, которые мы применяли в акселераторе."
            tags={["AI-продукты", "Команда"]}
            authorName="Мария Терминасова"
            date="2025-04-02"
          />
        </div>

        {/* ═══════════════ 7. ARTICLE BODY ═══════════════ */}
        <SubSection id="article-body" title="ArticleBody / Тело статьи" />
        <p className="text-[length:var(--text-14)] text-muted-foreground mb-6">
          Сквозной поток блоков <code>h2 / h3 / paragraph / quote</code> с единой логикой вертикального ритма.
          H2 → DS H3 (32/28), H3 → DS H4 (24/20). Перед h2 отступ 56px (desktop) / 44px (mobile) — начало новой секции.
          После h2 — 32px. Параграфы подряд — 16px. Подробности в §11.7 DS MD.
        </p>

        <div className="rounded-lg border border-border p-10 mb-10 bg-[#0A0A0A]">
          <div className="mx-auto max-w-[800px]">
            <ArticleBody blocks={DEMO_BODY} />
          </div>
        </div>

        {/* ═══════════════ 8. VIDEO PLAYER ═══════════════ */}
        <SubSection id="article-video" title="VideoPlayer / Видео" />
        <p className="text-[length:var(--text-14)] text-muted-foreground mb-6">
          Плеер для видео-блоков тела статьи. Кастомные контролы на нативном <code>&lt;video&gt;</code>: play/pause, scrubber с буферизацией и миниатюрой,
          таймер, регулятор громкости, fullscreen. Клавиши: <code>Space</code>/<code>K</code> — play/pause, <code>←</code>/<code>→</code> — ±5s, <code>↑</code>/<code>↓</code> — громкость,
          <code>M</code> — mute, <code>F</code> — fullscreen, <code>Home</code>/<code>End</code> — в начало/конец. Контролы автоскрываются через 2s во время
          воспроизведения, появляются на hover/mousemove/focus. Аспект 16/9 по умолчанию, цвет прогресса — <code>--rm-yellow-100</code>.
        </p>

        <div className="rounded-lg border border-border p-6 mb-6 bg-rm-gray-1/30">
          <div className="text-[length:var(--text-11)] uppercase tracking-wider text-muted-foreground mb-4">Standalone</div>
          <div className="mx-auto max-w-[800px]">
            <VideoPlayer src={DEMO_VIDEO_SRC} />
          </div>
        </div>

        <div className="rounded-lg border border-border p-6 mb-10 bg-rm-gray-1/30">
          <div className="text-[length:var(--text-11)] uppercase tracking-wider text-muted-foreground mb-4">
            В теле статьи (<code>type: &quot;video&quot;</code>, отступ 40px сверху/снизу как у <code>image</code>)
          </div>
          <div className="mx-auto max-w-[800px]">
            <ArticleBody
              blocks={[
                { id: "v1", type: "paragraph", data: { text: "Абзац перед видео — 40px до него." } },
                {
                  id: "v2",
                  type: "video",
                  data: {
                    src: DEMO_VIDEO_SRC,
                    caption: "Подпись — mono, 12px, uppercase, под плеером",
                  },
                },
                { id: "v3", type: "paragraph", data: { text: "Абзац после — 40px от видео." } },
              ]}
            />
          </div>
        </div>

        {/* ═══════════════ 9. MIXED GALLERY (image + video) ═══════════════ */}
        <SubSection id="article-gallery" title="Gallery / Смешанные табы (image + video)" />
        <p className="text-[length:var(--text-14)] text-muted-foreground mb-6">
          Таб-свитчер в теле статьи. Элемент галереи может быть изображением (<code>kind: &quot;image&quot;</code>, default) или видео
          (<code>kind: &quot;video&quot;</code>). Image-табы сохраняют slide-анимацию и overlay <code>bg-black/20</code>. Video-табы рендерятся
          через <code>VideoPlayer</code> без slide и overlay.
        </p>

        <div className="rounded-lg border border-border p-6 mb-10 bg-rm-gray-1/30">
          <div className="mx-auto max-w-[800px]">
            <ArticleBody
              blocks={[
                {
                  id: "g1",
                  type: "gallery",
                  data: {
                    items: [
                      {
                        id: "gi1",
                        title: "Кадр 1",
                        src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
                        kind: "image",
                      },
                      {
                        id: "gv1",
                        title: "Видео",
                        src: DEMO_VIDEO_SRC,
                        kind: "video",
                      },
                      {
                        id: "gi2",
                        title: "Кадр 2",
                        src: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80",
                        kind: "image",
                      },
                    ],
                  },
                },
              ]}
            />
          </div>
        </div>
      </Section>
    </>
  )
}
