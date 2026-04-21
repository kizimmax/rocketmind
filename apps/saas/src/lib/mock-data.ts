import type {
  Agent,
  Artifact,
  Case,
  Conversation,
  Expert,
  ExpertCodename,
  ExpertSession,
  Manager,
  Message,
  Project,
  ReadyArtifact,
  User,
} from "./types";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

// --- Mock User ---
export const mockUser: User = {
  id: "u_1",
  email: "demo@rocketmind.ru",
  created_at: "2026-03-01T10:00:00Z",
  last_login: "2026-03-27T09:00:00Z",
};

// --- Mock Agents ---
export const mockAgents: Agent[] = [
  {
    id: "ag_1",
    slug: "strategy",
    name: "Стратег",
    description:
      "AI-консультант по бизнес-стратегии. Анализирует рынок, конкурентов и помогает сформулировать стратегию роста.",
    avatar_url: `${BASE_PATH}/ai-mascots/alex/alex_base.png`,
    greeting: "Привет! Я помогу выстроить стратегию для вашего бизнеса.",
    suggestions: [
      "Проанализируй конкурентов в моей нише",
      "Помоги составить go-to-market стратегию",
      "Оцени потенциал нового рынка",
      "Предложи каналы привлечения клиентов",
    ],
    config: { webhook_url: "https://n8n.example.com/webhook/strategy" },
  },
  {
    id: "ag_2",
    slug: "copywriter",
    name: "Копирайтер",
    description:
      "Пишет тексты для сайтов, рассылок и соцсетей. Адаптирует tone of voice под вашу аудиторию.",
    avatar_url: `${BASE_PATH}/ai-mascots/kate/kate_base.png`,
    greeting: "Привет! Давайте создадим тексты, которые зацепят вашу аудиторию.",
    suggestions: [
      "Напиши hero-текст для лендинга",
      "Составь серию email-рассылок",
      "Предложи заголовки для блога",
      "Адаптируй текст под tone of voice",
    ],
    config: { webhook_url: "https://n8n.example.com/webhook/copywriter" },
  },
  {
    id: "ag_3",
    slug: "analyst",
    name: "Аналитик",
    description:
      "Помогает анализировать данные, строить отчёты и находить инсайты для принятия решений.",
    avatar_url: `${BASE_PATH}/ai-mascots/sergey/sergey_base.png`,
    greeting: "Привет! Готов помочь разобраться в данных и найти инсайты.",
    suggestions: [
      "Проанализируй трафик за месяц",
      "Найди узкие места в воронке продаж",
      "Сравни метрики с прошлым кварталом",
      "Подготовь дашборд ключевых KPI",
    ],
    config: { webhook_url: "https://n8n.example.com/webhook/analyst" },
  },
];

// --- Mock Cases ---
export const mockCases: Case[] = [
  {
    id: "c_1",
    user_id: "u_1",
    name: "Стратегия выхода на рынок",
    status: "active",
    created_at: "2026-03-20T10:00:00Z",
    updated_at: "2026-03-27T08:30:00Z",
  },
  {
    id: "c_2",
    user_id: "u_1",
    name: "Тексты для лендинга",
    status: "active",
    created_at: "2026-03-22T14:00:00Z",
    updated_at: "2026-03-26T16:00:00Z",
  },
  {
    id: "c_3",
    user_id: "u_1",
    name: "Анализ конкурентов Q1",
    status: "archived",
    created_at: "2026-02-15T09:00:00Z",
    updated_at: "2026-03-10T12:00:00Z",
  },
];

// --- Mock Case-Agent relations ---
export const mockCaseAgents: { case_id: string; agent_id: string }[] = [
  { case_id: "c_1", agent_id: "ag_1" },
  { case_id: "c_2", agent_id: "ag_2" },
  { case_id: "c_3", agent_id: "ag_3" },
  { case_id: "c_1", agent_id: "ag_3" },
];

// --- Mock Conversations ---
export const mockConversations: Conversation[] = [
  {
    id: "conv_1",
    case_id: "c_1",
    agent_id: "ag_1",
    created_at: "2026-03-20T10:00:00Z",
    updated_at: "2026-03-27T08:30:00Z",
  },
  {
    id: "conv_2",
    case_id: "c_2",
    agent_id: "ag_2",
    created_at: "2026-03-22T14:00:00Z",
    updated_at: "2026-03-26T16:00:00Z",
  },
  {
    id: "conv_3",
    case_id: "c_1",
    agent_id: "ag_3",
    created_at: "2026-03-25T11:00:00Z",
    updated_at: "2026-03-27T08:00:00Z",
  },
];

// --- Mock Messages ---
export const mockMessages: Record<string, Message[]> = {
  conv_1: [
    {
      id: "m_1",
      conversation_id: "conv_1",
      role: "assistant",
      content:
        "Привет! Я Стратег — AI-консультант по бизнес-стратегии. Расскажите о вашем бизнесе и целях, и я помогу сформулировать стратегию.",
      created_at: "2026-03-20T10:01:00Z",
      is_read: true,
    },
    {
      id: "m_2",
      conversation_id: "conv_1",
      role: "user",
      content:
        "Мы запускаем SaaS-платформу для автоматизации маркетинга. Целевая аудитория — малый бизнес в РФ. Бюджет на маркетинг ограничен.",
      created_at: "2026-03-20T10:05:00Z",
      is_read: true,
    },
    {
      id: "m_3",
      conversation_id: "conv_1",
      role: "assistant",
      content:
        "Отличный сегмент! Давайте разберём по шагам:\n\n**1. Анализ рынка**\nМалый бизнес в РФ активно ищет инструменты автоматизации. Ваши конкуренты: Bitrix24, AmoCRM, Unisender.\n\n**2. Позиционирование**\nРекомендую позицию «простой AI-помощник» — без сложных настроек, результат за 5 минут.\n\n**3. Каналы привлечения**\n- Контент-маркетинг (SEO + блог)\n- Telegram-каналы для малого бизнеса\n- Партнёрства с бизнес-инкубаторами",
      created_at: "2026-03-20T10:06:00Z",
      is_read: true,
    },
    {
      id: "m_4",
      conversation_id: "conv_1",
      role: "user",
      content: "Можно подробнее про контент-стратегию? Какие темы для блога?",
      created_at: "2026-03-20T10:10:00Z",
      is_read: true,
    },
    {
      id: "m_5",
      conversation_id: "conv_1",
      role: "assistant",
      content:
        'Вот план контент-стратегии:\n\n**Темы для блога (по кластерам):**\n\n1. **Образовательные** — «Как автоматизировать email-рассылки за 10 минут»\n2. **Кейсы** — «Как магазин одежды увеличил продажи на 40% с AI»\n3. **Сравнения** — «5 альтернатив Bitrix24 для малого бизнеса»\n4. **Инструменты** — «Чек-лист: готов ли ваш бизнес к автоматизации»\n\n**Частота:** 2-3 статьи в неделю\n**Формат:** 1500-2000 слов, с практическими примерами\n\nХотите, чтобы я подготовил полный отчёт со стратегией?',
      created_at: "2026-03-20T10:12:00Z",
      is_read: true,
    },
    {
      id: "m_6",
      conversation_id: "conv_1",
      role: "user",
      content: "Да, подготовь полный отчёт.",
      created_at: "2026-03-20T10:15:00Z",
      is_read: true,
    },
    {
      id: "m_7",
      conversation_id: "conv_1",
      role: "system",
      content:
        "Отчёт готов. Для доступа к полной версии оформите подписку.",
      metadata: {
        cta: {
          label: "Оформить подписку",
          url: "https://pay.rocketmind.ru/checkout/plan-pro",
        },
      },
      created_at: "2026-03-20T10:16:00Z",
      is_read: false,
    },
  ],
  conv_2: [
    {
      id: "m_10",
      conversation_id: "conv_2",
      role: "assistant",
      content:
        "Привет! Я Копирайтер — помогу написать тексты для вашего лендинга. Расскажите о продукте и целевой аудитории.",
      created_at: "2026-03-22T14:01:00Z",
      is_read: true,
    },
    {
      id: "m_11",
      conversation_id: "conv_2",
      role: "user",
      content:
        "Нужен текст для hero-секции лендинга. Продукт — платформа AI-агентов для бизнеса. Целевая аудитория — предприниматели и маркетологи.",
      created_at: "2026-03-22T14:05:00Z",
      is_read: true,
    },
    {
      id: "m_12",
      conversation_id: "conv_2",
      role: "assistant",
      content:
        "Вот 3 варианта hero-текста:\n\n**Вариант 1 (Прямой):**\n> AI-агенты, которые работают на ваш бизнес 24/7\n> Автоматизируйте рутину — от анализа рынка до написания текстов\n\n**Вариант 2 (Проблема → решение):**\n> Устали делать всё вручную?\n> Подключите AI-команду за 5 минут и сосредоточьтесь на росте\n\n**Вариант 3 (Результат):**\n> +40% продуктивности с первого дня\n> AI-агенты берут на себя стратегию, аналитику и контент\n\nКакой стиль ближе?",
      created_at: "2026-03-22T14:07:00Z",
      is_read: true,
    },
  ],
  conv_3: [
    {
      id: "m_20",
      conversation_id: "conv_3",
      role: "assistant",
      content:
        "Привет! Я Аналитик. Готов помочь с анализом данных. Что нужно проанализировать?",
      created_at: "2026-03-25T11:01:00Z",
      is_read: true,
    },
    {
      id: "m_21",
      conversation_id: "conv_3",
      role: "user",
      content:
        "Мне нужен анализ трафика на сайт за последний месяц. Основные метрики: источники, конверсия, bounce rate.",
      created_at: "2026-03-25T11:05:00Z",
      is_read: true,
    },
    {
      id: "m_22",
      conversation_id: "conv_3",
      role: "assistant",
      content:
        "Для анализа мне нужны данные. Вы можете:\n\n1. **Скопировать данные из GA** — вставьте сюда таблицу\n2. **Описать словами** — примерные цифры\n\nПока могу дать шаблон отчёта:\n\n| Метрика | Значение | Тренд |\n|---------|----------|-------|\n| Визиты | — | — |\n| Уникальные | — | — |\n| Bounce rate | — | — |\n| Конверсия | — | — |\n| Ср. время | — | — |\n\nКакой вариант удобнее?",
      created_at: "2026-03-25T11:07:00Z",
      is_read: true,
    },
  ],
};

// --- Helper functions ---

export function getMockCases(userId: string): Case[] {
  return mockCases.filter((c) => c.user_id === userId);
}

export function getMockCase(caseId: string): Case | undefined {
  return mockCases.find((c) => c.id === caseId);
}

export function getMockAgents(): Agent[] {
  return mockAgents;
}

export function getMockAgent(slug: string): Agent | undefined {
  return mockAgents.find((a) => a.slug === slug);
}

export function getMockAgentById(id: string): Agent | undefined {
  return mockAgents.find((a) => a.id === id);
}

export function getMockCaseAgents(caseId: string): Agent[] {
  const agentIds = mockCaseAgents
    .filter((ca) => ca.case_id === caseId)
    .map((ca) => ca.agent_id);
  return mockAgents.filter((a) => agentIds.includes(a.id));
}

export function getMockConversation(
  caseId: string,
  agentId: string
): Conversation | undefined {
  return mockConversations.find(
    (c) => c.case_id === caseId && c.agent_id === agentId
  );
}

export function getMockConversations(caseId: string): Conversation[] {
  return mockConversations.filter((c) => c.case_id === caseId);
}

export function getMockMessages(conversationId: string): Message[] {
  return mockMessages[conversationId] ?? [];
}

// ═════════════════════════════════════════════════════════════════════════════
// R-Акселератор 1.2 — R-менеджер / Experts / Projects / Sessions / Artifacts
// ═════════════════════════════════════════════════════════════════════════════

// --- Mock R-менеджер (Alex) — верхнеуровневая сущность над всеми проектами ---
export const mockManager: Manager = {
  id: "m_main",
  name: "Алекс",
  role: "Оркестратор команды",
  avatar_url: `${BASE_PATH}/ai-mascots/alex/alex_confident.png`,
  greeting_no_projects:
    "Привет! Я Алекс — ваш R-менеджер. Помогаю оркестрировать команду R-экспертов под ваш проект. Начнём?",
  greeting_with_projects:
    "С возвращением! Я Алекс, ваш R-менеджер. Создадим новый проект или нужно пересобрать существующий?",
};

// --- Mock Experts (R-Team: Роман, Регина, Роза, Римма, Роберт, Рон) ---
// У каждого эксперта: имя, маскот (confident + thinking), 3 сценария (первый primary).
// thinking_avatar_url используется в сообщениях с metadata.thinking=true (цикл углублённой проработки).
export const mockExperts: Expert[] = [
  {
    id: "e_r1",
    codename: "R1",
    name: "Роман",
    role: "Маркет-исследователь",
    description:
      "Помогает понять рынок, конкурентов и ключевые тренды. На выходе — структурированный маркет-бриф.",
    outcome: "Маркет-бриф",
    avatar_url: `${BASE_PATH}/ai-mascots/sergey/sergey_confident.png`,
    thinking_avatar_url: `${BASE_PATH}/ai-mascots/sergey/sergey_thinks.png`,
    greeting:
      "Привет! Я Роман — помогаю разобраться в рынке. Расскажите, что вы хотите делать, и я найду, где это взлетает, а где — нет.",
    suggestions: [
      "Помоги определить размер рынка",
      "Кто мои главные конкуренты?",
      "Какие тренды сейчас на моём рынке?",
    ],
    scenarios: [
      {
        codename: "r1_full_brief",
        label: "Собрать полный маркет-бриф",
        hint: "TAM/SAM/SOM, конкуренты, тренды, позиционирование — всё в одном документе",
        is_primary: true,
      },
      {
        codename: "r1_niches",
        label: "Найти 5 узких ниш",
        hint: "Сфокусированные сегменты, где вы можете быстро занять позицию №1",
        is_primary: false,
      },
      {
        codename: "r1_competitors",
        label: "Конкурентный анализ топ-5",
        hint: "Сильные/слабые стороны, ценообразование, слепые зоны",
        is_primary: false,
      },
    ],
  },
  {
    id: "e_r2",
    codename: "R2",
    name: "Регина",
    role: "Специалист по ЦА",
    description:
      "Помогает сегментировать аудиторию и найти Ideal Customer Profile. Опирается на маркет-бриф R1.",
    outcome: "Сегменты ЦА + ICP",
    avatar_url: `${BASE_PATH}/ai-mascots/kate/kate_confident.png`,
    thinking_avatar_url: `${BASE_PATH}/ai-mascots/kate/kate_thinks.png`,
    greeting:
      "Привет! Я Регина — помогаю понять, кто именно ваш клиент. Давайте найдём правильный ICP, а не «все, кому может пригодиться».",
    suggestions: [
      "Разбей мою аудиторию на сегменты",
      "Кто мой Ideal Customer Profile?",
      "Какие у сегментов главные боли?",
    ],
    scenarios: [
      {
        codename: "r2_segments_icp",
        label: "Сегментация ЦА и ICP",
        hint: "Разбить рынок на сегменты и определить идеальный профиль клиента",
        is_primary: true,
      },
      {
        codename: "r2_jtbd",
        label: "Jobs-to-be-done разбор",
        hint: "Понять, какую «работу» клиент нанимает ваш продукт сделать",
        is_primary: false,
      },
      {
        codename: "r2_personas",
        label: "Персоны и карта болей",
        hint: "2–3 детальные персоны с их болями, страхами и мотивациями",
        is_primary: false,
      },
    ],
  },
  {
    id: "e_rplus",
    codename: "R+",
    name: "Роза",
    role: "Синтетическая аудитория",
    description:
      "Моделирует реакцию целевой аудитории через интервью с синтетическими респондентами. Работает в связке с R2.",
    outcome: "Проверенные гипотезы",
    avatar_url: `${BASE_PATH}/ai-mascots/lida/lida_confident.png`,
    thinking_avatar_url: `${BASE_PATH}/ai-mascots/lida/lida_thinks.png`,
    greeting:
      "Привет! Я Роза — моделирую реакции вашей аудитории. Дайте гипотезу — я проверю её через синтетические интервью.",
    suggestions: [
      "Проверь мою ценностную гипотезу",
      "Смоделируй интервью с ICP",
      "Проверь willingness to pay",
    ],
    scenarios: [
      {
        codename: "rplus_value_hypothesis",
        label: "Проверить ценностную гипотезу",
        hint: "Синтетические интервью с 10 респондентами из ICP — оценка резонанса",
        is_primary: true,
      },
      {
        codename: "rplus_offer_compare",
        label: "Сравнить 2–3 оффера",
        hint: "A/B-симуляция: какой из ваших оффферов зайдёт аудитории лучше",
        is_primary: false,
      },
      {
        codename: "rplus_wtp",
        label: "Willingness-to-pay тест",
        hint: "Сколько аудитория готова платить — Van Westendorp / Gabor-Granger симуляция",
        is_primary: false,
      },
    ],
  },
  {
    id: "e_r3",
    codename: "R3",
    name: "Римма",
    role: "Бизнес-модель и юнит-экономика",
    description:
      "Собирает бизнес-модель и юнит-экономику. Отвечает на вопрос «как мы зарабатываем».",
    outcome: "Бизнес-модель + unit economics",
    avatar_url: `${BASE_PATH}/ai-mascots/sophie/sophie_confident.png`,
    thinking_avatar_url: `${BASE_PATH}/ai-mascots/sophie/sophie_surprised.png`,
    greeting:
      "Привет! Я Римма — собираю бизнес-модель. Обещаю, юнит-экономика не так страшна, как кажется.",
    suggestions: [
      "Помоги собрать бизнес-модель",
      "Посчитай юнит-экономику",
      "Где мой break-even?",
    ],
    scenarios: [
      {
        codename: "r3_bmc_unit",
        label: "BMC + юнит-экономика",
        hint: "Business Model Canvas из 9 блоков + CAC, LTV, payback, margin",
        is_primary: true,
      },
      {
        codename: "r3_pricing",
        label: "Ценообразование",
        hint: "Выбор ценовой стратегии и тарифной сетки под ваши сегменты",
        is_primary: false,
      },
      {
        codename: "r3_ltv_cac",
        label: "Просчёт LTV/CAC",
        hint: "Детальная финансовая модель с проверкой чувствительности",
        is_primary: false,
      },
    ],
  },
  {
    id: "e_r4",
    codename: "R4",
    name: "Роберт",
    role: "MVP и план экспериментов",
    description:
      "Формирует MVP и план экспериментов. Помогает определить самый дешёвый способ валидировать продукт.",
    outcome: "MVP-план + эксперименты",
    avatar_url: `${BASE_PATH}/ai-mascots/nick/nick_confident.png`,
    thinking_avatar_url: `${BASE_PATH}/ai-mascots/nick/nick_thinks.png`,
    greeting:
      "Привет! Я Роберт — собираю MVP. Цель — не идеальный продукт, а минимальный эксперимент, который что-то скажет правдивое о рынке.",
    suggestions: [
      "Помоги определить scope MVP",
      "Какие эксперименты запустить первыми?",
      "Что точно НЕ делать в MVP?",
    ],
    scenarios: [
      {
        codename: "r4_mvp_scope",
        label: "MVP-scope и план экспериментов",
        hint: "Минимальная версия продукта + 3 эксперимента по 2 недели с чёткими метриками",
        is_primary: true,
      },
      {
        codename: "r4_roadmap",
        label: "90-дневный roadmap",
        hint: "Последовательность запусков на 3 месяца с milestones",
        is_primary: false,
      },
      {
        codename: "r4_measurement",
        label: "Measurement plan",
        hint: "Как мерить успех MVP: North Star + leading/lagging метрики",
        is_primary: false,
      },
    ],
  },
  {
    id: "e_r5",
    codename: "R5",
    name: "Рон",
    role: "Питч и инвест-пакет",
    description:
      "Собирает питч-дек, one-pager и инвест-меморандум. Финальный эксперт в pipeline.",
    outcome: "Питч-дек + инвест-меморандум",
    avatar_url: `${BASE_PATH}/ai-mascots/mark/mark_confident.png`,
    thinking_avatar_url: `${BASE_PATH}/ai-mascots/mark/mark_surprised.png`,
    greeting:
      "Привет! Я Рон — помогу собрать питч и инвест-пакет. Перейдём от «что мы делаем» к «почему в это нужно инвестировать».",
    suggestions: [
      "Собери структуру питч-дека",
      "Напиши one-pager",
      "Проверь мой elevator pitch",
    ],
    scenarios: [
      {
        codename: "r5_pitch_deck",
        label: "Питч-дек 12 слайдов",
        hint: "Проблема, рынок, решение, traction, команда, ask — по YC-схеме",
        is_primary: true,
      },
      {
        codename: "r5_one_pager",
        label: "One-pager",
        hint: "Компактный документ для холодной рассылки инвесторам",
        is_primary: false,
      },
      {
        codename: "r5_memo",
        label: "Инвест-меморандум",
        hint: "4–6 страниц с детальным бизнес-обоснованием для due diligence",
        is_primary: false,
      },
    ],
  },
];

// --- Mock Projects ---
export const mockProjects: Project[] = [
  {
    id: "p_1",
    owner_id: "u_1",
    name: "AI-платформа для SMB",
    role: "founder",
    industry: "SaaS / B2B",
    stage: "mvp",
    status: "in_progress",
    experts_completed: 2,
    experts_total: 6,
    current_expert_codename: "R+",
    score: 58,
    created_at: "2026-04-05T10:00:00Z",
    updated_at: "2026-04-17T16:30:00Z",
  },
  {
    id: "p_2",
    owner_id: "u_1",
    name: "EdTech для корпоративного обучения",
    role: "founder",
    industry: "EdTech",
    stage: "idea",
    status: "in_progress",
    experts_completed: 0,
    experts_total: 6,
    current_expert_codename: "R1",
    score: null,
    created_at: "2026-04-16T14:00:00Z",
    updated_at: "2026-04-16T14:10:00Z",
  },
  {
    id: "p_3",
    owner_id: "u_1",
    name: "Маркетплейс для независимых консультантов",
    role: "founder",
    industry: "Marketplace",
    stage: "seed",
    status: "completed",
    experts_completed: 6,
    experts_total: 6,
    current_expert_codename: null,
    score: 82,
    created_at: "2026-03-10T09:00:00Z",
    updated_at: "2026-04-02T18:00:00Z",
  },
  // --- Архивированные проекты ---
  {
    id: "p_arc1",
    owner_id: "u_1",
    name: "PoC голосового помощника для ритейла",
    role: "founder",
    industry: "Retail / Voice AI",
    stage: "idea",
    status: "archived",
    experts_completed: 1,
    experts_total: 6,
    current_expert_codename: null,
    score: null,
    created_at: "2026-02-01T10:00:00Z",
    updated_at: "2026-02-14T16:00:00Z",
  },
  {
    id: "p_arc2",
    owner_id: "u_1",
    name: "Сервис подписки на обучение B2B-продажам",
    role: "sme-lead",
    industry: "B2B / Sales training",
    stage: "mvp",
    status: "archived",
    experts_completed: 3,
    experts_total: 6,
    current_expert_codename: null,
    score: 44,
    created_at: "2026-01-10T09:00:00Z",
    updated_at: "2026-02-20T12:00:00Z",
  },
];

// --- Mock Expert Sessions (per project) ---
export const mockExpertSessions: ExpertSession[] = [
  // p_1 — первые 2 эксперта завершены, R+ в работе
  {
    id: "es_1_r1",
    project_id: "p_1",
    expert_codename: "R1",
    status: "completed",
    started_at: "2026-04-05T10:00:00Z",
    completed_at: "2026-04-08T15:30:00Z",
    message_count: 18,
  },
  {
    id: "es_1_r2",
    project_id: "p_1",
    expert_codename: "R2",
    status: "completed",
    started_at: "2026-04-08T16:00:00Z",
    completed_at: "2026-04-12T14:00:00Z",
    message_count: 22,
  },
  {
    id: "es_1_rplus",
    project_id: "p_1",
    expert_codename: "R+",
    status: "awaiting_validation",
    started_at: "2026-04-12T15:00:00Z",
    completed_at: null,
    message_count: 11,
  },
  // p_2 — только что создан, R1 не начата
  {
    id: "es_2_r1",
    project_id: "p_2",
    expert_codename: "R1",
    status: "not_started",
    started_at: null,
    completed_at: null,
    message_count: 0,
  },
  // p_3 — все 6 завершены
  {
    id: "es_3_r1",
    project_id: "p_3",
    expert_codename: "R1",
    status: "completed",
    started_at: "2026-03-10T09:00:00Z",
    completed_at: "2026-03-13T12:00:00Z",
    message_count: 24,
  },
  {
    id: "es_3_r2",
    project_id: "p_3",
    expert_codename: "R2",
    status: "completed",
    started_at: "2026-03-13T13:00:00Z",
    completed_at: "2026-03-16T17:00:00Z",
    message_count: 19,
  },
  {
    id: "es_3_rplus",
    project_id: "p_3",
    expert_codename: "R+",
    status: "completed",
    started_at: "2026-03-17T10:00:00Z",
    completed_at: "2026-03-19T15:00:00Z",
    message_count: 14,
  },
  {
    id: "es_3_r3",
    project_id: "p_3",
    expert_codename: "R3",
    status: "completed",
    started_at: "2026-03-20T09:00:00Z",
    completed_at: "2026-03-24T18:00:00Z",
    message_count: 27,
  },
  {
    id: "es_3_r4",
    project_id: "p_3",
    expert_codename: "R4",
    status: "completed",
    started_at: "2026-03-25T10:00:00Z",
    completed_at: "2026-03-30T16:00:00Z",
    message_count: 21,
  },
  {
    id: "es_3_r5",
    project_id: "p_3",
    expert_codename: "R5",
    status: "completed",
    started_at: "2026-03-31T11:00:00Z",
    completed_at: "2026-04-02T18:00:00Z",
    message_count: 16,
  },
];

// --- Mock Artifacts ---
export const mockArtifacts: Artifact[] = [
  {
    id: "a_1_r1",
    project_id: "p_1",
    session_id: "es_1_r1",
    expert_codename: "R1",
    type: "market_brief",
    title: "Маркет-бриф: SMB SaaS в РФ",
    preview:
      "Рынок SMB SaaS в РФ растёт на 18% в год. Три главных конкурента — Bitrix24, AmoCRM, Мой Склад. Узкие ниши…",
    status: "validated",
    created_at: "2026-04-08T15:30:00Z",
    updated_at: "2026-04-08T15:30:00Z",
  },
  {
    id: "a_1_r2",
    project_id: "p_1",
    session_id: "es_1_r2",
    expert_codename: "R2",
    type: "ua_segments",
    title: "Сегменты ЦА + ICP",
    preview:
      "Три сегмента: микробизнес (1–5 чел), малый (6–50), средний (51–250). ICP — малый 10–30 человек, оборот 30–150 млн…",
    status: "validated",
    created_at: "2026-04-12T14:00:00Z",
    updated_at: "2026-04-12T14:00:00Z",
  },
  {
    id: "a_1_rplus_draft",
    project_id: "p_1",
    session_id: "es_1_rplus",
    expert_codename: "R+",
    type: "synth_audience",
    title: "Проверенные гипотезы",
    preview:
      "Резонанс оффера высокий (7/10). Ключевой барьер — страх «AI напишет что-то не то от моего имени». 3 из 10 респондентов требуют явного режима предпросмотра/approval. Рекомендация: добавить preview-режим до релиза.",
    status: "draft",
    created_at: "2026-04-17T16:28:00Z",
    updated_at: "2026-04-17T16:28:00Z",
  },
  // p_3 — полный набор артефактов (completed project)
  {
    id: "a_3_r1",
    project_id: "p_3",
    session_id: "es_3_r1",
    expert_codename: "R1",
    type: "market_brief",
    title: "Маркет-бриф: рынок консалтинга в РФ",
    preview: "Рынок независимых консультантов в РФ — ~₽45 млрд…",
    status: "validated",
    created_at: "2026-03-13T12:00:00Z",
    updated_at: "2026-03-13T12:00:00Z",
  },
  {
    id: "a_3_r2",
    project_id: "p_3",
    session_id: "es_3_r2",
    expert_codename: "R2",
    type: "ua_segments",
    title: "Сегменты ЦА консультантов",
    preview: "Два типа клиентов: SMB-фаундеры и команды корпоратов…",
    status: "validated",
    created_at: "2026-03-16T17:00:00Z",
    updated_at: "2026-03-16T17:00:00Z",
  },
  {
    id: "a_3_r3",
    project_id: "p_3",
    session_id: "es_3_r3",
    expert_codename: "R3",
    type: "biz_model",
    title: "Бизнес-модель",
    preview: "Комиссия 15% с сделки + ежемесячная подписка для консультантов…",
    status: "validated",
    created_at: "2026-03-24T18:00:00Z",
    updated_at: "2026-03-24T18:00:00Z",
  },
  {
    id: "a_3_r3_ue",
    project_id: "p_3",
    session_id: "es_3_r3",
    expert_codename: "R3",
    type: "unit_economics",
    title: "Юнит-экономика",
    preview: "CAC ~₽8k, LTV ~₽54k, payback 6 месяцев, gross margin 68%…",
    status: "validated",
    created_at: "2026-03-24T18:10:00Z",
    updated_at: "2026-03-24T18:10:00Z",
  },
  {
    id: "a_3_r4",
    project_id: "p_3",
    session_id: "es_3_r4",
    expert_codename: "R4",
    type: "mvp_plan",
    title: "MVP-план и эксперименты",
    preview:
      "MVP: landing + формы заявок, без оплаты через платформу. 3 эксперимента по 2 недели…",
    status: "validated",
    created_at: "2026-03-30T16:00:00Z",
    updated_at: "2026-03-30T16:00:00Z",
  },
  {
    id: "a_3_r5",
    project_id: "p_3",
    session_id: "es_3_r5",
    expert_codename: "R5",
    type: "pitch_deck",
    title: "Питч-дек",
    preview: "12 слайдов — проблема, рынок, решение, traction, команда, ask…",
    status: "validated",
    created_at: "2026-04-02T17:00:00Z",
    updated_at: "2026-04-02T17:00:00Z",
  },
  {
    id: "a_3_r5_memo",
    project_id: "p_3",
    session_id: "es_3_r5",
    expert_codename: "R5",
    type: "investment_memo",
    title: "Инвест-меморандум",
    preview:
      "Полный инвест-меморандум на 4 страницы для seed-раунда ₽15M @ pre-money ₽80M…",
    status: "validated",
    created_at: "2026-04-02T18:00:00Z",
    updated_at: "2026-04-02T18:00:00Z",
  },
];

// --- Mock helpers for 1.2 ---

export function getMockManager(): Manager {
  return mockManager;
}

export function getMockExperts(): Expert[] {
  return mockExperts;
}

export function getMockExpert(codename: ExpertCodename): Expert | undefined {
  return mockExperts.find((e) => e.codename === codename);
}

export function getMockProjects(userId: string): Project[] {
  return mockProjects.filter((p) => p.owner_id === userId);
}

export function getMockProject(projectId: string): Project | undefined {
  return mockProjects.find((p) => p.id === projectId);
}

export function getMockExpertSessions(projectId: string): ExpertSession[] {
  return mockExpertSessions.filter((s) => s.project_id === projectId);
}

export function getMockArtifacts(projectId: string): Artifact[] {
  return mockArtifacts.filter((a) => a.project_id === projectId);
}

/**
 * Вычисляет стартового эксперта исходя из stage и списка уже готовых артефактов.
 * Используется R-менеджером при создании проекта для skip уже пройденных этапов.
 */
const PIPELINE_ORDER: ExpertCodename[] = ["R1", "R2", "R+", "R3", "R4", "R5"];

const STAGE_BASELINE: Record<string, ExpertCodename> = {
  idea: "R1",
  mvp: "R1",
  seed: "R2",
  early: "R3",
  growth: "R4",
};

const READY_TO_SKIP: Record<ReadyArtifact, ExpertCodename> = {
  market: "R1",
  ua_segments: "R2",
  synth: "R+",
  biz_model: "R3",
  mvp_plan: "R4",
  pitch: "R5",
};

export function computeStartingExpert(
  stage: string,
  readiness: ReadyArtifact[] = []
): ExpertCodename {
  const baseline = STAGE_BASELINE[stage] ?? "R1";
  const baselineIdx = PIPELINE_ORDER.indexOf(baseline);
  const completed = new Set(readiness.map((r) => READY_TO_SKIP[r]));

  // Первый эксперт >= baseline, которого нет в completed
  for (let i = baselineIdx; i < PIPELINE_ORDER.length; i++) {
    const c = PIPELINE_ORDER[i];
    if (!completed.has(c)) return c;
  }
  // Все эксперты «уже сделаны» — отправим к R5 (финальный пакет)
  return "R5";
}
