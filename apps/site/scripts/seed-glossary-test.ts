/**
 * Тестовый сидер для проверки авто-подсветки терминов глоссария в теле статьи.
 *
 * Что делает:
 *  1) проставляет реальные `description` и `aliases` нескольким терминам
 *     (если описание уже есть и непустое — НЕ перезаписываем, чтобы не убить
 *     ручную работу автора);
 *  2) выбирает первую опубликованную статью (или создаёт `test-glossary`)
 *     и подменяет её body на 4 секции с абзацами, в которых эти термины
 *     встречаются естественно — для проверки tooltip'а и переходов.
 *
 * Запуск:
 *   cd apps/site && \
 *   DATABASE_URL='...' npx tsx scripts/seed-glossary-test.ts
 *
 * Скрипт идемпотентен: повторный запуск даёт тот же результат.
 */

import { prisma } from "../src/lib/prisma";

type GlossarySeed = {
  slug: string;
  /** Если у термина уже есть `description` — оставляем; этот текст идёт только когда описание пустое. */
  description: string;
  /** Падежи/синонимы — мерджатся с текущим content.aliases без дублей. */
  aliases: string[];
};

const TERMS: GlossarySeed[] = [
  {
    slug: "a-b-test",
    description:
      "Сплит-эксперимент: пользователей случайным образом делят на группы " +
      "и сравнивают одну метрику между ними. Так проверяют, действительно " +
      "ли изменение в продукте улучшает результат.",
    aliases: [
      "A/B-теста",
      "A/B-тесте",
      "A/B-тестов",
      "A/B тесты",
      "A/B-тесты",
      "сплит-теста",
      "сплит-тесты",
    ],
  },
  {
    slug: "avatar",
    description:
      "Описание типичного клиента: его боли, цели, привычки и язык. " +
      "Помогает командам говорить с пользователем, а не с воображаемой аудиторией.",
    aliases: ["аватара", "аватаров", "портрет клиента", "портрета клиента"],
  },
  {
    slug: "baza-dannyh",
    description:
      "Хранилище структурированной информации с возможностью быстрого " +
      "поиска и обновления. В продукте обычно — реляционная БД (Postgres) " +
      "или специализированная (векторная, аналитическая).",
    aliases: ["БД", "базе данных", "базы данных", "базу данных"],
  },
  {
    slug: "analiz-rynka",
    description:
      "Изучение спроса, конкурентов и сегментов перед запуском продукта: " +
      "проверка, что есть кому продавать и за что готовы платить.",
    aliases: ["анализа рынка", "анализу рынка"],
  },
  {
    slug: "ambassador-brenda",
    description:
      "Лояльный пользователь или эксперт, который публично рассказывает " +
      "о продукте — без рекламного контракта или с лёгкой формой партнёрства. " +
      "Дешёвый и достоверный канал привлечения.",
    aliases: ["амбассадора бренда", "амбассадоры", "адвокат бренда"],
  },
];

type Block = {
  id: string;
  type: "h2" | "h3" | "paragraph";
  data: { text: string };
};

type Section = {
  id: string;
  title: string;
  navLabel: string;
  blocks: Block[];
  factoids: never[];
  asides: never[];
  quotes: never[];
  asidesTitle: string;
  asidesTitleEnabled: boolean;
};

const SECTIONS: Section[] = [
  {
    id: "s-intro",
    title: "Гипотеза и аватар",
    navLabel: "Гипотеза",
    blocks: [
      {
        id: "p1",
        type: "paragraph",
        data: {
          text:
            "Перед запуском любого нового флоу команда сначала формулирует " +
            "гипотезу: какому аватару, в какой момент и зачем мы " +
            "предлагаем продукт. Без чёткого портрета клиента анализ " +
            "рынка превращается в догадки, а конверсия проседает уже на " +
            "первом экране.",
        },
      },
      {
        id: "p2",
        type: "paragraph",
        data: {
          text:
            "Хороший аватар описан в языке самого пользователя: его боли, " +
            "сценарии, ограничения. Тогда последующие A/B-тесты проверяют " +
            "не «нравится ли заголовок», а «попадает ли формулировка в боль».",
        },
      },
    ],
    factoids: [],
    asides: [],
    quotes: [],
    asidesTitle: "",
    asidesTitleEnabled: false,
  },
  {
    id: "s-experiments",
    title: "Эксперименты и метрики",
    navLabel: "Эксперименты",
    blocks: [
      {
        id: "p3",
        type: "paragraph",
        data: {
          text:
            "Внутри продукта мы запускаем сплит-тесты на ключевых шагах " +
            "воронки. Каждый A/B тест бьётся в одну метрику — обычно " +
            "конверсию шага или доля повторных входов. Если эксперимент " +
            "трогает несколько метрик сразу, читать результаты будет нечем.",
        },
      },
      {
        id: "p4",
        type: "paragraph",
        data: {
          text:
            "Результаты эксперимента и пользовательские события мы " +
            "складываем в общую базу данных, чтобы можно было пересобрать " +
            "когорту через месяц. Сырьё в БД — это страховка: " +
            "переобработать данные дешевле, чем потерять контекст из-за " +
            "ушедшей агрегации.",
        },
      },
    ],
    factoids: [],
    asides: [],
    quotes: [],
    asidesTitle: "",
    asidesTitleEnabled: false,
  },
  {
    id: "s-market",
    title: "Контекст рынка",
    navLabel: "Рынок",
    blocks: [
      {
        id: "p5",
        type: "paragraph",
        data: {
          text:
            "Любой эксперимент мы перепроверяем через анализ рынка: что " +
            "уже делают конкуренты на этом шаге воронки, какой бенчмарк " +
            "конверсии считается нормой, и есть ли амбассадор бренда, " +
            "который протолкнёт изменение через своё сообщество.",
        },
      },
      {
        id: "p6",
        type: "paragraph",
        data: {
          text:
            "Если данных по рынку мало, мы не пытаемся гадать — собираем " +
            "минимальный собственный аватар по 5-7 интервью, заводим его " +
            "в БД клиентских профилей и идём в A/B тест с осознанным " +
            "риском.",
        },
      },
    ],
    factoids: [],
    asides: [],
    quotes: [],
    asidesTitle: "",
    asidesTitleEnabled: false,
  },
  {
    id: "s-existing-link",
    title: "Что не двойнится",
    navLabel: "Edge cases",
    blocks: [
      {
        id: "p7",
        type: "paragraph",
        data: {
          text:
            "Если в исходнике уже стоит ручная [ссылка на обзор A/B " +
            "тестов](https://example.com/ab-test-overview) — авто-линковка " +
            "её не двойнит. Внутри ссылки термин остаётся обычным текстом, " +
            "а в соседних абзацах подсветка работает как обычно: вот и " +
            "конверсия, и аватар, и анализ рынка снова кликабельны.",
        },
      },
    ],
    factoids: [],
    asides: [],
    quotes: [],
    asidesTitle: "",
    asidesTitleEnabled: false,
  },
];

async function main() {
  console.log("→ Обновляем термины глоссария…");
  for (const seed of TERMS) {
    const existing = await prisma.glossaryTerm.findUnique({
      where: { slug: seed.slug },
    });
    if (!existing) {
      console.warn(`  пропущен: термина '${seed.slug}' нет в БД`);
      continue;
    }
    const c = (existing.content ?? {}) as Record<string, unknown>;
    const currentAliases = Array.isArray(c.aliases)
      ? (c.aliases as unknown[]).filter((v): v is string => typeof v === "string")
      : [];
    const mergedAliases = Array.from(
      new Set([...currentAliases, ...seed.aliases].map((s) => s.trim()).filter(Boolean)),
    );
    const nextDescription = existing.description.trim() || seed.description;
    await prisma.glossaryTerm.update({
      where: { slug: seed.slug },
      data: {
        status: "published",
        description: nextDescription,
        content: { ...c, aliases: mergedAliases },
      },
    });
    console.log(
      `  ${seed.slug}: aliases=${mergedAliases.length}, description=${nextDescription === seed.description ? "(заполнено)" : "(сохранено)"}`,
    );
  }

  console.log("→ Выбираем статью для теста…");
  let article = await prisma.article.findFirst({
    where: { status: "published" },
    orderBy: { createdAt: "asc" },
  });
  if (!article) {
    console.log("  нет опубликованных статей — создаю 'test-glossary'");
    article = await prisma.article.create({
      data: {
        slug: "test-glossary",
        title: "Тестовая статья: автоподсветка глоссария",
        status: "published",
        description:
          "Демонстрационная статья, где термины глоссария подсвечиваются " +
          "автоматически. Используется для ручной проверки фичи.",
        type: "lesson",
        publishedAt: new Date(),
        expertSlug: null,
        tagIds: [],
        coverUrl: null,
        metaTitle: "",
        metaDescription: "",
        content: {},
      },
    });
  }

  console.log(`  выбрана статья: ${article.slug} — ${article.title}`);

  const c = (article.content ?? {}) as Record<string, unknown>;
  const nextContent = {
    ...c,
    body: SECTIONS,
    sections: SECTIONS,
  };
  await prisma.article.update({
    where: { slug: article.slug },
    data: {
      content: nextContent,
      // Гарантируем, что статья опубликована и видна на сайте.
      status: "published",
    },
  });

  console.log(
    `→ готово. Открой /media/${article.slug} — внутри 4 секции с упоминаниями ${TERMS.map((t) => t.slug).join(", ")}.`,
  );
  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error(err);
  await prisma.$disconnect();
  process.exit(1);
});
