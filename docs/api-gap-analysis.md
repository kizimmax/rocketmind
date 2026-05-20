# API Gap Analysis — наша спека vs реализация Ивана

_Снимок: 2026-05-20. Auto-sync через `node scripts/sync-ivan-api.mjs`._

## TL;DR

Иван имплементировал **31 endpoint** и **8 schemas**, мы спроектировали **40 endpoints** и **15 schemas**. По точному совпадению пути+метода — только `POST /auth/logout`.

**Причина расхождения** — Иван:
- Использует другую номенклатуру (`/course/agents` вместо `/ai-agents`, `/course/groups` вместо `/programs`)
- Унифицировал авторизацию (один `/auth/login` OTP для админов и учеников; нет отдельных `/admin/login` с паролем)
- Унифицировал пользователей (одна сущность `User` с `Role`; нет отдельных AdminUser/Student)
- Role — отдельная сущность с CRUD (как у Stripe), не hardcoded enum
- Чат не стримит SSE — обычный POST + GET history
- OpenAI Assistants API напрямую (нет n8n в спеке)
- Нет `Place`, `StudentProject`, `StudentSession`, `StudentArtifact`, `Mascot`, `AuditLogEntry`

## Что СОВПАДАЕТ концептуально (нужен только rename в нашем фронте)

| Концепт | Наше имя | У Ивана |
|---|---|---|
| OTP-запрос кода | `POST /api/auth/request-code` | `POST /api/v1/auth/login` |
| Проверка OTP | `POST /api/auth/verify-code` | `POST /api/v1/auth/verify` |
| Logout | `POST /api/auth/logout` | `POST /api/v1/auth/logout` ✅ |
| Текущий пользователь | `GET /api/auth/me` | `GET /api/v1/profile` |
| Обновить профиль | `PATCH /api/students/me` | `PUT /api/v1/profile` |
| Каталог AI-агентов | `/api/ai-agents` | `/api/v1/course/agents` |
| Программы | `/api/programs` | `/api/v1/course/groups` |
| Список пользователей | `/api/admin/users` + `/api/students` | `/api/v1/users` |
| Создать сообщение | `POST /api/chat` (SSE) | `POST /api/v1/course/messages` (sync) |
| История сообщений | (выводится из SSE) | `GET /api/v1/course/messages` |
| Вход по QR | `/join` (фронт) + auth flow | `POST /api/v1/course/groups/join` |
| Загрузка файла | `/api/mascots/upload` | `POST /api/v1/file/upload` |

## Что у Ивана **есть**, а у нас отсутствует

| Endpoint | Назначение | Нужно нам? |
|---|---|---|
| `POST /auth/refresh` | Refresh JWT | ✅ Да — добавить в спеку |
| `GET /roles` + CRUD | Управление ролями как сущностями | ✅ Да — заменить наш enum |
| `PUT /users/{id}/role` | Назначить роль | ✅ Да |
| `GET /course/agents/assistants` | Список OpenAI Assistants | ⚠️ Опционально (для UI выбора OpenAI assistant при создании агента) |
| `GET /course/agents/accessible` | Агенты доступные текущему юзеру | ✅ Да — заменяет наш `programs/active`+filter |
| `POST /file/upload` | Универсальная загрузка файлов | ✅ Да — заменяет наш `/api/mascots/upload` |

## Что у нас **есть**, а у Ивана пока нет

| Endpoint | Critical? | Что делать |
|---|---|---|
| `POST /programs/{id}/regenerate-qr` | 🔴 **критично** — Алексей должен уметь ротировать QR программы | Просить Ивана добавить |
| `PATCH /programs/{id}` с `isActive` | 🔴 **критично** — свитч «программа закрыта» | Просить добавить поле + поведение (см. ниже) |
| `POST /program-agents` (включить/выключить агента в программе) | 🔴 **критично** — Алексей должен включать агентов по дням | Просить добавить (либо как отдельный endpoint, либо через update group.agents) |
| `GET /places` | 🟡 средне — справочник мест программ | Можно реализовать как embedded или вообще убрать (поле name+address внутри Group) |
| `GET /admin/audit-log` | 🟢 не критично — отложить на этап 2 | Отложить |
| Mascot library (модель Mascot + CRUD маскотов) | 🟡 средне — нужна для аватаров AI-агентов | Решить: использовать `/file/upload` или ввести Mascot как сущность |
| `Student.industry`, `Student.region` (поля анкеты) | 🔴 **критично** — анкета по скрину | У Ивана `User.fieldOfActivity`, `User.city` + `User.profession` — **уже есть, просто переименовать** |
| `StudentProject` / `StudentSession` / `StudentArtifact` | 🟡 средне — модель «проектов и артефактов» | На MVP-1 можно отложить — чат напрямую к User+Group без проектов |
| `Program.startsAt` / `Program.endsAt` | 🟡 средне — даты программы | Просить добавить в CourseGroup |
| `Program.place` (FK на справочник Place) | 🟢 не критично | Можно строкой внутри Group или совсем убрать |
| SSE-стрим в `/api/chat` | 🔴 **критично для UX** — без стрима ответ агента «висит» секунды | Просить Ивана сделать stream (SSE / WebSocket / chunked HTTP) |
| `Permissions tree` (гранулярный доступ EDITOR) | 🟢 не критично — можно сначала ролями | Использовать Role.permissions массив у Ивана |

## Архитектурные решения, которые нужно принять

### 1. Auth модель: unified vs split

**У Ивана:** Один `POST /auth/login` (OTP) для ВСЕХ юзеров. Админы и ученики — одна сущность `User` с разными ролями.

**У нас:** Раздельно — админы по паролю на `/admin/login`, ученики по OTP на `/auth/request-code`.

**Рекомендация:** Принять модель Ивана. Это проще и единообразнее. Если Алексею нужен пароль (не OTP) — добавить в его профиль флаг или сделать спец-роль.

### 2. Chat: SSE vs sync

**У Ивана:** `POST /course/messages` синхронно возвращает ответ агента, `GET /course/messages` — история с пагинацией.

**У нас:** `POST /api/chat` стримит ответ через SSE.

**Рекомендация:** **Просить SSE-стриминг** — без него UX чата сильно деградирует (1-10 секунд тишины перед ответом). NestJS поддерживает SSE из коробки (`@Sse`).

### 3. Programs (CourseGroup): какие поля нужны

**У Ивана сейчас:** `{ id, name, agents[], active, qrCode }`. Это минимум.

**Нам нужны дополнительно:**
- `startsAt`, `endsAt` (даты программы)
- `place` (где проводится — можно строкой)
- `joinToken` отдельно от `qrCode` (rotation through `regenerate-qr` endpoint)
- `joinTokenRotatedAt`

**Рекомендация:** Просить Ивана добавить эти поля.

### 4. CourseAgent: какие поля нужны

**У Ивана сейчас:** `{ id, name, description, avatar, openAiAssistantId, baseMessages[] }`.

**Нам нужны дополнительно:**
- `slug` (для URL и стабильных ссылок)
- `role` (под-заголовок «Бизнес-моделирование»)
- `targets[]` (привязка к saas-teacher / saas-akselerator — чтобы один каталог работал для двух продуктов)
- `systemPrompt` (draft, на будущее)
- `notes` (внутренние)
- `n8nWebhookUrl` + `n8nSecret` — **или** подтвердить что переходим на OpenAI Assistants напрямую и n8n больше не нужен

### 5. ProgramAgent.isAvailable свитч

**У Ивана сейчас:** `CourseGroup.agents` — embedded массив без isAvailable свитча.

**Нам нужно:** Свитч на каждом агенте В рамках программы — Алексей по дням включает.

**Рекомендация:** Заменить embedded array на отдельную коллекцию `GroupAgent { groupId, agentId, isAvailable, availableSince }` ИЛИ хранить как `CourseGroup.agents = [{agentId, isAvailable}]`.

## Workflow синхронизации с Иваном

### Автоматический pull (раз в день / при изменениях)

```bash
node scripts/sync-ivan-api.mjs
```

Что делает:
1. Скачивает текущую спеку Ивана с `https://r-accel-back-rocketmind.amvera.io/api/docs/swagger-ui-init.js`
2. Сохраняет снимок в `docs/ivan-current-api.json` (можно увидеть diff в git)
3. Генерит этот отчёт (`docs/api-sync-status.md`)

### Cycle of work

1. **Иван** — добавляет endpoint → Swagger UI на Amvera обновляется автоматически (NestJS gen).
2. **Мы** — раз в день (или после его уведомления) запускаем `sync-ivan-api.mjs` →
   видим в diff'е что появилось.
3. **Если у Ивана появилось то, что мы спроектировали** — помечаем в `docs/saas-admin-api.yaml`
   запись как `x-status: implemented` (расширение OpenAPI), обновляем pathname под его (`/api/v1/...`).
4. **Если у Ивана появилось что-то новое чего у нас не было** — добавляем в нашу спеку.
5. **Если что-то наше Иван не делает** — обсуждаем (критично / можно адаптировать / отложить).

### TypeScript-типы (на будущее)

Когда контракт стабилизируется — можно сгенерить TS-типы прямо из спеки Ивана:

```bash
npx openapi-typescript https://r-accel-back-rocketmind.amvera.io/api/docs/swagger-ui-init.js -o packages/api-types/src/index.ts
```

(не factually работает из swagger-ui-init.js напрямую — нужна обработка, но это идея). Тогда фронт получит компайл-тайм проверку соответствия.
