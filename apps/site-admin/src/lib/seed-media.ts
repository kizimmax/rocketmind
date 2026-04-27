import type { Article, GlossaryTerm, MediaTag } from "./types";

/**
 * Стартовый набор тегов для раздела МЕДИА.
 * В демо-режиме создаётся при первой загрузке.
 */
export function createSeedMediaTags(): MediaTag[] {
  const now = new Date("2025-01-01T00:00:00Z").toISOString();
  return [
    { id: "strategy",     label: "Стратегии",            createdAt: now },
    { id: "biz-design",   label: "Бизнес-дизайн",        createdAt: now },
    { id: "expert",       label: "Экспертная статья",    createdAt: now },
    { id: "ai-products",  label: "AI-продукты",          createdAt: now },
    { id: "consulting",   label: "Консалтинг и стратегия", createdAt: now },
    { id: "academy",      label: "Академия",             createdAt: now },
    { id: "team",         label: "Команда",              createdAt: now },
  ];
}

/**
 * Стартовые статьи для демо — без картинок, с базовой мета-информацией.
 * Тело (body) остаётся пустым — редактируется на следующей итерации.
 */
export function createSeedArticles(_tags: MediaTag[]): Article[] {
  const base = (slug: string, offset: number): Omit<
    Article,
    "title" | "description" | "expertSlug" | "tagIds" | "keyThoughts"
  > => ({
    id: `media/${slug}`,
    slug,
    status: "published",
    order: offset,
    coverImageData: undefined,
    publishedAt: new Date(2025, 4 - offset, 16).toISOString().slice(0, 10),
    body: [],
    cardVariant: "default",
    pinned: false,
    pinnedOrder: 0,
    metaTitle: "",
    metaDescription: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  return [
    {
      ...base("arkhitektura-strukturirovannyh-ekosistem", 0),
      title: "Архитектура структурированных экосистем",
      description:
        "Growth Product Owner в OneTwoTrip — о том, что такое North Star Metric и почему это настоящая опора для продакта, даже если фича не взлетела.",
      expertSlug: "alexey-eremin",
      tagIds: ["biz-design", "consulting", "expert"],
      keyThoughts: [
        "В экспертную сеть объединяются профессионалы из разных стран. Они сами устанавливают правила работы и используют облачные сервисы, чтобы работать без привязки к географии",
        "Минсвязи объединяет государственные сайты в единую систему",
        "В экспертную сеть объединяются профессионалы из разных стран",
      ],
    },
    {
      ...base("kak-sobrat-komandu-dlya-ai-produkta", 1),
      title: "Как собрать команду для AI-продукта",
      description:
        "Пять подходов к набору команды разработки ML-проектов, которые мы применяли в акселераторе.",
      expertSlug: "maria-terminasova",
      tagIds: ["ai-products", "team"],
      keyThoughts: [
        "ML-инженер, продуктовый дизайнер и доменный эксперт — минимальная тройка для старта",
      ],
    },
    {
      ...base("severnaya-zvezda-dlya-online-shkoly", 2),
      title: "Северная звезда для онлайн-школы",
      description:
        "Метрика, которая держит продуктовые команды одной школы на одной волне в течение полугода.",
      expertSlug: "kirill-sidorov",
      tagIds: ["academy", "strategy"],
      keyThoughts: [],
    },
  ];
}

/**
 * Стартовые термины для глоссария — минимальный набор, чтобы виджет и страница
 * /media/glossary не были пустыми в демо.
 */
export function createSeedGlossaryTerms(): GlossaryTerm[] {
  const now = new Date().toISOString();
  const term = (title: string, tagIds: string[] = []): GlossaryTerm => ({
    id: `glossary/${slugifyTerm(title)}`,
    slug: slugifyTerm(title),
    status: "published",
    order: 0,
    title,
    tagIds,
    metaTitle: `${title} | Глоссарий Rocketmind`,
    metaDescription: "",
    createdAt: now,
    updatedAt: now,
  });
  return [
    term("A/B тест", ["ai-products"]),
    term("Аватар", ["biz-design"]),
    term("Авитолог"),
    term("Автообзвон клиентов роботом", ["ai-products"]),
    term("Авторизация и аутентификация", ["ai-products"]),
    term("Адаптивная вёрстка", ["biz-design"]),
    term("Алиас"),
    term("Альтернативная стоимость", ["strategy"]),
    term("Амбассадор бренда", ["strategy"]),
    term("Анализ рынка", ["strategy"]),
    term("Апдейт"),
    term("Арбитраж трафика", ["strategy"]),
    term("База данных (БД)", ["ai-products"]),
    term("Бан"),
    term("Баннер"),
    term("Бенчмаркинг", ["strategy"]),
  ];
}

const RU_MAP: Record<string, string> = {
  а:"a",б:"b",в:"v",г:"g",д:"d",е:"e",ё:"e",ж:"zh",з:"z",и:"i",й:"i",к:"k",л:"l",м:"m",н:"n",о:"o",п:"p",р:"r",с:"s",т:"t",у:"u",ф:"f",х:"h",ц:"c",ч:"ch",ш:"sh",щ:"sch",ъ:"",ы:"y",ь:"",э:"e",ю:"yu",я:"ya",
};
function slugifyTerm(input: string): string {
  const lower = input.toLowerCase().trim();
  let out = "";
  for (const ch of lower) out += RU_MAP[ch] ?? ch;
  return out
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 60);
}
