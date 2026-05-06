# QA Fixes Plan — 2026-05-05

Локальный полный QA-прогон по админке + сайту обнаружил **19 багов**. Этот документ — карта починки. Идём сверху вниз по приоритету. Каждая правка локально проверяется на Docker-стенде; на прод (Amvera) пушим **одним коммитом в конце**, когда всё закрыто.

**Полный отчёт:** [`.gstack/qa-reports/qa-report-rocketmind-local-2026-05-05.md`](../.gstack/qa-reports/qa-report-rocketmind-local-2026-05-05.md)

## Статус-таблица

| # | ID | Severity | Категория | Заголовок | Статус |
|---|----|----------|-----------|-----------|--------|
| 1 | BUG-017 | high | functional | Формы не отправляются (нет fetch, нет endpoint, нет таблицы) | 🟢 Готово локально |
| 2 | BUG-002 | critical | data | Скрытые/неопубликованные страницы доступны на сайте | 🟢 Готово локально |
| 3 | BUG-014 | high | data | Uploads сохраняются с абсолютным `http://localhost:3004/uploads/...` (на проде сломает CORS/CSP) | 🟢 Готово локально |
| 4 | BUG-001 | critical | functional | Auto-redirect создаётся в БД, но сайт его не отдаёт | 🟢 Готово локально |
| 5 | BUG-013 | high | data | Expert/Testimonial avatar принимают PDF без MIME-валидации | 🟢 Готово локально |
| 6 | BUG-016 | medium | data | Бэк принимает кириллические slug в /api/articles, /api/glossary | 🟢 Готово локально |
| 7 | BUG-015 | medium | functional | `/api/articles/{slug}/uploads` не поддерживает `kind:audio` | 🟢 Готово локально |
| 8 | BUG-019 | medium | security | PUT `/api/pages/...` отдаёт сырой stack trace на invalid JSON | 🟢 Готово локально |
| 9 | BUG-018 | cosmetic | api | BMP даёт 400 «invalid dataUrl» вместо 415 «unsupported mime» | 🟢 Готово локально (extractDataUrlMime + 415 в /api/articles/[slug]/uploads) |
| 10 | BUG-003 | high | SEO | Термины глоссария не в sitemap | 🟢 Готово локально |
| 11 | BUG-004 | high | SEO | Рассинхрон baseURL между sitemap/robots/admin | 🟢 Готово локально (env SITE_URL + storage в SystemConfig) |
| 12 | BUG-005 | medium | SEO | Sitemap не содержит /products/{cat} | 🟢 Уже было исправлено в коде, верифицировано |
| 13 | BUG-012 | medium | functional | «Регенерировать sitemap» дублирует устаревший URL | 🟢 Готово локально (унификация storage) |
| 14 | BUG-008 | medium | functional | /media/glossary в админке выдаёт «Статья не найдена» | 🟢 Redirect на /media?tab=glossary |
| 15 | BUG-006 | medium | UI | Глоссарий показывает фильтры «Урок»/«Кейс» от статей | 🟢 Системные теги отфильтрованы |
| 16 | BUG-007 | medium | a11y | Иконочные кнопки на page-card без aria-label | 🟢 Добавлены aria-label + title |
| 17 | BUG-009 | cosmetic | console | Aspect-ratio warning на мascot-картинках | 🟢 Согласовали props=CSS dim |
| 18 | BUG-010 | cosmetic | perf | LCP-фото Alex без priority | 🟢 priority на hero-Image |
| 19 | BUG-011 | medium | console | 404-resource на /cta-forms | 🟢 Не воспроизводится (закрыт ранним фиксом) |

**Легенда:** 🔴 в работе · 🟡 ждёт ответа от тебя · 🟢 готово локально · ⚪ не начато · ✅ запушено

## План

```
[1] BUG-017 — формы (с расширением scope: 3 канала вывода)  ← начинаем здесь
[2] BUG-002 — фильтр published на сайте
[3] BUG-014 — relative paths для uploads
[4] BUG-001 — middleware redirects
[5] BUG-013 — MIME-валидация avatar/photo
[6] BUG-016 — slugify на бэке
[7] BUG-015 — поддержка audio в article uploads
[8] BUG-019 — sanitize stack trace
[9] BUG-018 — корректные коды ошибок
[10+] остальные SEO/visual мелочи — пакетом
[final] /push в main → Amvera пересобирает админку и сайт
```

---

## BUG-017 — Спецификация: формы и три канала вывода

### Текущее состояние

- На сайте `<form onSubmit={(e) => e.preventDefault()}>` без fetch — заявка никуда не уходит.
- В админке у формы есть scope, поля, consent, successGift — **но нет настроек куда слать заявку**.
- В БД нет таблицы `form_submissions` — даже сервер-side копии не остаётся.

### Целевое состояние

Каждая форма в админке имеет блок настроек **«Куда отправлять заявки»** с тремя независимыми (additive, не XOR) выходами. Можно включить любую комбинацию: только email, email + telegram, всё три, ничего (заявка тогда падает только в БД).

### Архитектура — три канала

#### 1. Bitrix24 (CRM)

**Способ:** Incoming Webhook (REST API Bitrix24).

**Как Bitrix даёт URL:**
1. Юзер заходит в свой портал Bitrix24 (например `rocketmind.bitrix24.ru`).
2. Левое меню → «Разработчикам» → «Прочее» → «Входящий вебхук».
3. Создаёт вебхук, выбирает права: минимум `crm` (создание лидов).
4. Получает URL вида: `https://<portal>.bitrix24.ru/rest/<USER_ID>/<TOKEN>/`

**Что мы шлём:**

```http
POST https://<portal>.bitrix24.ru/rest/1/<TOKEN>/crm.lead.add.json
Content-Type: application/json

{
  "fields": {
    "TITLE": "Заявка с сайта Rocketmind — <название формы>",
    "NAME": "<имя из формы>",
    "PHONE": [{"VALUE": "<телефон>", "VALUE_TYPE": "MOBILE"}],
    "EMAIL": [{"VALUE": "<email>", "VALUE_TYPE": "WORK"}],
    "COMMENTS": "<сообщение + название продукта/страницы>",
    "SOURCE_ID": "WEB",
    "UF_CRM_FORM_ID": "<id формы в админке для трассировки>"
  }
}
```

**Поля админки на форму:**
- Toggle: «Отправлять в Bitrix24»
- Input: «URL вебхука» (полный URL до `/crm.lead.add.json`, юзер вставляет)
- (Опционально, V2): assigned-to — ID ответственного менеджера

#### 2. Email-уведомление

**Способ:** SMTP через `nodemailer` (или Resend API, но nodemailer проще для on-premise).

**Глобальные настройки (env vars, на сервере)**:
```
SMTP_HOST=smtp.yandex.ru
SMTP_PORT=465
SMTP_USER=hello@rocketmind.ru
SMTP_PASS=<password>
SMTP_FROM="Rocketmind <hello@rocketmind.ru>"
```

**Поля админки на форму:**
- Toggle: «Отправлять на email»
- Textarea: «Получатели» (через запятую — можно несколько)
- (Опционально): Subject template — по умолчанию «Новая заявка с {form.name} — Rocketmind»

**Тело письма** — HTML с шапкой Rocketmind:
- Лого (вверху)
- Заголовок «Новая заявка»
- Таблица: каждое поле формы → значение
- Метаданные: страница откуда отправили, дата/время, IP (если фиксируем)
- Footer: «Это автоматическое уведомление от админки Rocketmind»

#### 3. Telegram-бот

**Способ:** Telegram Bot API (`https://api.telegram.org/bot<TOKEN>/sendMessage`).

**Как создать бота:**
1. В Telegram пишем `@BotFather` → `/newbot` → имя → username.
2. Получаем `<TOKEN>`.
3. Чтобы получить `chat_id`: добавить бота в чат/канал, написать что-то, открыть `https://api.telegram.org/bot<TOKEN>/getUpdates` → найти `chat.id`.

**Глобальная настройка** (env):
```
TELEGRAM_BOT_TOKEN=123:abc...
```

**Поля админки на форму:**
- Toggle: «Отправлять в Telegram»
- Input: «Chat ID» (число, для группы — отрицательное, для лички — положительное)
- (Опционально): Topic ID для форумных групп

**Сообщение** — Markdown V2:
```
🆕 *Новая заявка с Rocketmind*

📝 *Форма:* {form.name}
📄 *Страница:* {url или "Главная"}

👤 *Имя:* {name}
📞 *Телефон:* {phone}
✉️ *Email:* {email}
💬 *Сообщение:* {message}

🕒 {timestamp}
```

### Backend changes

#### Prisma schema

Добавить модель `FormSubmission` (для server-side копии всех заявок — гарантируем что лиды не теряются даже при отказе всех трёх каналов):

```prisma
model FormSubmission {
  id        String   @id @default(uuid())
  formId    String
  pageUrl   String?
  data      Json     // все поля как { name, phone, email, message, ... }
  ipAddress String?
  userAgent String?
  // Статусы доставки по каналам
  bitrix24Status   String?  // "ok" | "error" | "skipped" — null = выключено
  bitrix24Error    String?
  emailStatus      String?
  emailError       String?
  telegramStatus   String?
  telegramError    String?
  createdAt DateTime @default(now())

  @@map("form_submissions")
  @@index([formId])
  @@index([createdAt])
}
```

#### Новые endpoints

**`POST /api/form-submissions`** (на сайте — site-admin server, либо переиспользуем admin):
- Принимает `{ formId, fields: { name, phone, email, message, ... }, pageUrl }`
- Валидирует обязательные поля по `form.fields.required`
- Записывает `FormSubmission` в БД (всегда, даже если все каналы упадут).
- Параллельно (Promise.allSettled) шлёт по каждому включённому каналу.
- Обновляет статусы каналов в `FormSubmission`.
- Возвращает `{ ok: true, submissionId, gift?: <successGift>}`.

**Раздел админки `/submissions`** (V1.5, не сразу):
- Список всех заявок с фильтрами по форме.
- Статусы доставки по каналам.
- Возможность ретрая (если канал упал).

#### Изменение типа `FormEntity`

```ts
export interface FormIntegrations {
  bitrix24: {
    enabled: boolean;
    webhookUrl: string;        // полный URL до /crm.lead.add.json
    assignedById?: number;     // V2
  };
  email: {
    enabled: boolean;
    recipients: string[];      // массив email
    subject?: string;
  };
  telegram: {
    enabled: boolean;
    chatId: string;
    topicId?: string;
  };
}

export interface FormEntity {
  // ... существующие поля
  integrations: FormIntegrations;
}
```

### Frontend (сайт)

В компоненте формы (нужно найти где рендерится — вероятно `apps/site/src/components/.../Form.tsx`):
- `onSubmit` → `await fetch('/api/form-submissions', { method: 'POST', body: JSON.stringify({...}) })`
- При успехе → показываем success screen с `successGift` если задан
- При ошибке → показываем «Что-то пошло не так, попробуйте позже» (НЕ блокируем — лид всё равно сохранён в БД)

### UI админки — куда вставить блок «Интеграции»

В [`forms-panel.tsx`](../apps/site-admin/src/components/cta-forms/forms-panel.tsx) внутри `FormCard` (когда раскрыта `expanded`), добавить новую секцию **«Куда отправлять заявки»** ниже секции «Подарок после отправки» (или выше, на твой вкус).

Вид:
```
┌─ Куда отправлять заявки ─────────────────────────────────┐
│  [✓] Bitrix24                                              │
│      URL вебхука:  [_______________________________]       │
│                                                            │
│  [✓] Email                                                 │
│      Получатели:   [hello@rm.ru, ivan@rm.ru___________]    │
│                                                            │
│  [ ] Telegram                                              │
│      Chat ID:      [_____________]                         │
└────────────────────────────────────────────────────────────┘
```

### ✅ Ответы (зафиксированы 2026-05-06)

1. **Bitrix24** — сейчас не подключаем реально, но **поля в админке делаем** (toggle + URL вебхука + assignedById опц.). Юзер впишет когда понадобится. Sender вызывает `fetch` и логирует ошибку — отсутствие URL = `enabled=false` фактически.
2. **Email** — Google Workspace на `@rocketmind.ru`, SMTP smtp.gmail.com:465. Локально — мок (пишет HTML-файлы в `./.docker-data/emails/`). На проде — переменные `SMTP_*` в env Amvera, тогда мок отключается автоматически.
3. **Telegram** — поля в админке (toggle + chatId + topicId опц.), бота сейчас не делаем. Sender ведёт себя так же как Bitrix: нет `TELEGRAM_BOT_TOKEN` в env → возвращает skipped.
4. **Заявки в БД** — да, обязательно. Таблица `FormSubmission` со статусом доставки по каждому каналу.
5. **Раздел `/submissions`** (название в навигации: **«Заявки»**) — делаем сейчас. Простой список + детальный просмотр + фильтр по форме.
6. **Bitrix custom fields** — отложено. Всё кладём в `COMMENTS` пока.

### Открытые вопросы — нужны ответы перед стартом

1. **Bitrix24 портал** — у тебя уже есть `*.bitrix24.ru`? Сможешь сейчас создать тестовый incoming webhook, чтобы я мог проверить локально? (Нужен в `.env.local` для тестов; на проде юзер вставит свой URL в админке.)

2. **Email — SMTP куда?**
   - (а) Свой почтовый сервис: Yandex 360 / Mail.ru для бизнеса / Google Workspace — нужны SMTP-креды.
   - (б) Транзакционный: Resend / SendGrid / Mailgun — проще, но платный сверх лимита.
   - (в) Пока в моке: писать в `console.log` и в файл `./.docker-data/emails/{timestamp}.html`, чтобы локально тестить без реального SMTP.
   - **Моя рекомендация** для V1: (в) для теста + (а) для прода. Тогда смогу всё проверить локально не дёргая твою почту.

3. **Telegram бот** — у тебя есть существующий бот, или создать новый? Если новый — могу написать инструкцию что нажимать в `@BotFather`. **Token** будет жить в env-vars, не в репозитории.

4. **Persistence заявок** — окей добавить таблицу `form_submissions`? Или ты хочешь, чтобы заявки шли только во внешние каналы и в БД не оставались?  
   **Моя рекомендация:** обязательно сохранять. Каналы могут упасть, тогда заявка потерялась. БД-копия = страховка + аудит + UI-список «все заявки».

5. **Раздел `/submissions` в админке** — делаем сейчас или V2? Я бы сделал минимум сейчас (просто список), чтобы видно было что приходит. Развернуть в полноценный CRM-вид — V2.

6. **Форма uniq id для Bitrix-трассировки** — окей класть `formId` в Bitrix custom field? Если у вас уже есть UF-поля в CRM (типа `UF_CRM_SOURCE_FORM`), скажи названия — пропишем. Если нет — оставим в `COMMENTS` строкой.

### Этапы (после ответов на вопросы)

1. ✏️ Prisma migration: добавить `FormSubmission`, расширить FormEntity content.
2. 🔧 Backend: `/api/form-submissions` POST endpoint + три integration sender'а в `apps/site/src/lib/integrations/{bitrix24,email,telegram}.ts`.
3. 🎨 Admin UI: блок «Куда отправлять заявки» в `forms-panel.tsx` с тремя toggle'ами.
4. 🌐 Site: подключить fetch в form `onSubmit`.
5. 🧪 Локальная проверка через Docker-стенд: submit → проверка БД + проверка моков (пока нет реальных кредов).
6. 📦 Перейти к BUG-002 (следующий по плану).

---

## История ревизий

- 2026-05-05 — создан, добавлен план + спека BUG-017
