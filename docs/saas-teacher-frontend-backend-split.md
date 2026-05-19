# saas-teacher: разделение фронт / бэк

Документ фиксирует, какая часть фичи saas-teacher живёт во фронт-коде монорепо, а какая — на бэке (Amvera + n8n у Ивана). Используется как реф-точка перед прод-деплоем.

---

## 🔵 Фронт (Rocketmind monorepo)

### База данных — схема и миграции

- [apps/site/prisma/schema.prisma](apps/site/prisma/schema.prisma) — 11 новых моделей:
  Place, Program, Mascot, AiAgent, ProgramAgent, Student, StudentProject,
  StudentSession, StudentMessage, StudentArtifact, OtpCode.
- [apps/site/prisma/migrations/20260514000000_add_teacher_models/migration.sql](apps/site/prisma/migrations/20260514000000_add_teacher_models/migration.sql) —
  готовая миграция под `prisma migrate deploy`.
- [apps/site-admin/scripts/seed-mascots.ts](apps/site-admin/scripts/seed-mascots.ts) —
  идемпотентный сид builtin-маскотов из `apps/site-admin/public/ai-mascots`.

Фронт **не отвечает** за фактический накат миграции и сида на проде — только за то, чтобы они существовали в репозитории и были корректны.

### CMS (apps/site-admin)

Полностью фронтовая зона: UI + Next.js API-роуты, которые ходят в Postgres напрямую через Prisma.

- `/ai-agents` — глобальный каталог AI-агентов: имя, роль, описание пользы,
  выбор маскота, чекбоксы `saas` / `saas-teacher`, поле `n8nWebhookUrl`,
  опциональный `n8nSecret`.
- `/ai-agents/mascots` — библиотека маскотов: одиночная загрузка + загрузка пака,
  удаление кастомных (builtin защищены).
- `/places` — CRUD мест проведения.
- `/programs` — список и создание программ (название, place, диапазон дат).
- `/programs/[id]` — деталка программы: блок QR (генерация + ротация + копирование
  JPEG), таблица тоглов агентов, список студентов с включением/отключением и
  удалением.

API-роуты под всё это:
`/api/ai-agents`, `/api/mascots`, `/api/places`, `/api/programs`,
`/api/programs/[id]/regenerate-qr`, `/api/program-agents`, `/api/students`.

Навигация в [admin-header.tsx](apps/site-admin/src/components/admin-header.tsx)
расширена тремя табами: AI-агенты, Программы, Места.

Новые зависимости: `qrcode` (клиент-сайд рендер QR + копирование как JPEG в буфер).

### saas-teacher (apps/saas-teacher) — новое приложение, порт 3004

- `/join?p=&t=` — server component, проверяет `Program.joinToken`, кладёт
  `rm_program_intent` cookie и редиректит в `/login`. Если токен ротировали —
  показывает человекочитаемое сообщение, а не молчаливый редирект.
- Email + OTP: `/api/auth/request-code`, `/verify-code`, `/me`, `/logout`.
  Подписывает JWT (`STUDENT_JWT_SECRET`), кладёт в HttpOnly cookie
  `rm_student_token`. Привязка `Student.programId` происходит на этапе
  `verify-code`, читая `rm_program_intent`.
- Onboarding-модалка ([onboarding-modal.tsx](apps/saas-teacher/src/components/onboarding-modal.tsx)):
  4 промо-слайда → анкета профиля → создание первого проекта. Открывается, пока
  не заполнено `firstName` и не создан `StudentProject`.
- Sidebar ([teacher-sidebar.tsx](apps/saas-teacher/src/components/teacher-sidebar.tsx)) —
  имя проекта, список доступных агентов (фильтр `ProgramAgent.isAvailable=true`
  и `AiAgent.targets ∋ 'saas-teacher'`), профиль + logout.
- Чат ([teacher-chat.tsx](apps/saas-teacher/src/components/teacher-chat.tsx)) —
  SSE-стрим с typing-индикатором и авто-скроллом. Парсит события
  `delta`/`done` от собственного `/api/chat`.
- Серверный SSE-роут [api/chat/route.ts](apps/saas-teacher/src/app/api/chat/route.ts) —
  авторизует студента, апсёртит `StudentSession`, собирает `context`
  (профиль + анкета проекта + последние 20 артефактов + сводки **других**
  агентов проекта), стримит ответ от транспорта, по завершении сохраняет
  ассистентское сообщение, `summary` и `StudentArtifact`-ы.
- Транспорт-абстракция [lib/agents/](apps/saas-teacher/src/lib/agents/):
  `transport.ts` (интерфейс), `mock.ts` (заглушка для dev), `n8n.ts`
  (продакшен — HMAC-подпись, парсер SSE и JSON-фолбэка), `index.ts`
  переключается env-флагом `AGENT_TRANSPORT=n8n`.

### Документация контракта

- [docs/api-questions-for-ivan-teacher.md](docs/api-questions-for-ivan-teacher.md) —
  формат запроса в n8n webhook, формат ответа (SSE + JSON-фолбэк), HMAC,
  открытые вопросы.

### Что фронту ещё нужно довести руками

- Промо-картинки в `apps/saas-teacher/public/onboarding/slide-1..4.png`
  (через Figma MCP или ручной экспорт; модалка переживает их отсутствие, но
  плейсхолдер уродский).
- `.env.example` и `apps/saas-teacher/README.md` — описать переменные.
- Опциональный `middleware.ts` в saas-teacher для общего auth-гейта API —
  сейчас каждый роут зовёт `getCurrentStudent()` сам.
- `/cso` security-review перед прод-деплоем (auth + webhook поверхность +
  ротация JWT-секрета).

---

## 🟡 Бэк (Amvera + n8n)

### Инфраструктура Amvera

- Postgres-инстанс — расширить под новые таблицы. БД одна для site, site-admin,
  saas-teacher.
- Завести проект `saas-teacher` на Amvera: Dockerfile можно заскелетить по
  образцу `apps/saas/Dockerfile`. Подключить GitHub webhook на `main`.
  Учесть, что Amvera-webhook'и иногда молчаливо проваливаются —
  после деплоя руками дёрнуть `/api/auth/me` и убедиться что приходит 200.
- DNS: домен (или path) для saas-teacher. Это значение вшивается в env
  `NEXT_PUBLIC_TEACHER_URL` в site-admin — оттуда оно попадает в URL внутри QR.
- Накат миграции в проде после первого деплоя:
  `cd apps/site && npx prisma migrate deploy` (один раз).
- Запуск сида маскотов на сервере:
  `cd apps/site-admin && npx tsx scripts/seed-mascots.ts` (один раз).
- Volume для загруженных маскотов: тот же `/data/uploads` что используется
  остальной админкой.
- Бэкапы Postgres — стандартные для прод-инстанса.

### Env-переменные (прописать в Amvera)

| Переменная | Где нужна | Назначение |
|---|---|---|
| `DATABASE_URL` | site-admin, saas-teacher | Postgres connection string |
| `STUDENT_JWT_SECRET` | saas-teacher | подпись JWT студенческой сессии. **Должен отличаться** от админского JWT-секрета — иначе атака повышения привилегий |
| `NEXT_PUBLIC_TEACHER_URL` | site-admin | base URL для QR, напр. `https://teacher.rocketmind.ru` |
| `UPLOADS_DIR` | site-admin | путь к persistent volume (как для остальных Asset) |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` | saas-teacher | доставка OTP на почту |
| `SMTP_SECURE=true` | saas-teacher | опц., если SMTP по 465 |
| `AGENT_TRANSPORT=n8n` | saas-teacher | переключает транспорт чата с мока на боевой |

В dev без SMTP коды OTP логируются в stdout — на проде SMTP обязателен.

### n8n workflows

Главная содержательная зона бэка. На каждого `AiAgent` из CMS — отдельный
workflow с собственным webhook URL, который Алексей вставляет в карточку
агента.

Workflow получает POST от saas-teacher, проверяет HMAC-подпись
(`X-Rocketmind-Signature: sha256=<hex>` от тела сырого JSON по
`AiAgent.n8nSecret`, если секрет задан), формирует system-prompt из
полученного `context` и вызывает OpenAI (Assistants API или Chat Completions —
на усмотрение n8n-стороны).

Ответ — один из двух форматов:
- **SSE** (предпочтительно): события `delta` (текст по чанкам),
  `artifact` (агент сгенерировал канвас/документ), `summary` (авто-сводка
  диалога), `done` (окончание). Контракт — в
  [docs/api-questions-for-ivan-teacher.md](docs/api-questions-for-ivan-teacher.md).
- **JSON-фолбэк**: `{ content, summary?, artifacts? }` целиком. Без стриминга,
  пользователь увидит ответ после паузы.

Артефакты и summary возвращаются именно через эти события — фронт сам
сохраняет их в `StudentArtifact` и `StudentSession.summary`, чтобы другие
агенты получали их в своём `context`.

### OpenAI-side

- Ключи OpenAI хранятся **в n8n**, а не в коде фронта и не в БД CMS.
  Фронт принципиально не имеет доступа к OpenAI API.
- Модели, лимиты, retry-логика, function-calling, RAG — всё это
  конфигурируется внутри n8n-workflow для конкретного агента.
- В CMS у агента есть поле `notes` для внутренних комментариев — туда
  можно класть метаданные для оператора (модель, версия промпта), но
  это справочная информация, никакой автоматизации.

### Вопросы, на которые нужны ответы от бэка

(полный список — в [docs/api-questions-for-ivan-teacher.md](docs/api-questions-for-ivan-teacher.md))

1. Один master-webhook с роутингом по `agent.slug` или раздельные webhook'и на
   агента. Фронт заложился на раздельные (это даёт изоляцию + независимое
   версионирование промптов).
2. Поддерживает ли n8n потоковую отдачу SSE. Если нет — стартуем на JSON-варианте.
3. Какие OpenAI-модели и какие таймауты по умолчанию.
4. Кто триггерит обновление авто-сводок: каждое сообщение / каждые N / по концу
   сессии.

---

## Граница ответственности

### Фронт не трогает
- Сервер Amvera (Docker-runtime, secrets-менеджер, volume, DNS, SSL).
- n8n-инстанс и его кредлы (OpenAI key, секреты HMAC в n8n-сторе).
- SMTP-провайдера.
- Бэкапы Postgres.

### Бэк не трогает
- Код фронта/админки/saas-teacher (всё, что в `apps/`).
- Prisma-схему (но обязан накатить миграцию).
- DS, маскотов, контент агентов в админке — это операционная работа Алексея.

---

## Sequence для запуска фичи в прод

1. **Фронт** — мерж кода в `main`, обновлён `.env.example`, прогнан `/cso`.
2. **Бэк** — обновляет env на Amvera, ловит deploy, накатывает миграцию и сид:
   ```
   cd apps/site && npx prisma migrate deploy
   cd apps/site-admin && npx tsx scripts/seed-mascots.ts
   ```
   Проверяет, что saas-teacher отвечает (`GET /api/auth/me` → 200 с `student: null`).
3. **Алексей** — в CMS создаёт `Mascot`-пак (если нужно), `AiAgent` (вставляя
   `n8nWebhookUrl` от Ивана), `Place`, `Program`. Жмёт «Сгенерировать QR»,
   копирует JPEG в слайды презентации. На странице программы открывает
   агентов тоглами по мере прохождения программы.
4. **Бэк** — на каждый созданный `AiAgent.n8nWebhookUrl` поднимает workflow в n8n.
   До этого момента саас-тичер уже работает на mock-транспорте, что позволяет
   тестировать UX независимо.
5. **Ученик** — сканирует QR → `/join` → `/login` → онбординг → чат.
