import type { Agent, Case, Conversation, Message, User } from "./types";

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
