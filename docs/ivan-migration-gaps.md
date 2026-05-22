# Контракт перехода фронта на API Ивана (Mongo) — РЕШЕНО

_Дата: 2026-05-21. Все гэпы закрыты Иваном. Сверено с `docs/ivan-current-api.json` + `docs/api-gap-analysis.md`._

**Контекст:** фронты `saas-admin` и `saas-teacher` переезжают на API Ивана. Свою Postgres-базу и свою авторизацию для них убираем — данные и токены на стороне Ивана (Mongo). `site` + `site-admin` остаются на нашем Postgres.

**Env в Amvera (для обоих фронтов):** Иван заводит `BACK_API` = `https://r-accel-back-rocketmind.amvera.io/api/v1`. `DATABASE_URL` / `JWT_SECRET` / `STUDENT_JWT_SECRET` больше не нужны.

> ⚠️ Концептуально: **`CourseGroup` — это НЕ программа/мероприятие**, а бандл контроля доступа: набор агентов + какие группы пользователей к ним допущены. Поэтому нет ни `place`, ни (пока) дат. Наша UI-модель «Программа» = группа доступа users↔agents.

---

## ✅ Решено с Иваном (2026-05-21)

### Авторизация
- **Оба токена (access + refresh) — в http-only cookies**, которые ставит API Ивана. Тело ответа `/auth/verify` пустое именно поэтому.
- **Refresh вызываем при 401** от защищённых endpoints.
- **Единый вход для всех по OTP** — один `POST /auth/login` (код на email) и для учеников, и для админов. Пароля для админов нет.

### Чат / стриминг
- Иван стримит ответ ассистента через OpenAI (`openai.beta.threads.runs.stream` → события `textDelta`, колбэк `onDelta(chunk)`). Стрим есть, опираемся на это.
- ⏳ **Уточнить на Phase 3 (chat):** HTTP-формат стрима наружу (SSE / chunked) и как именно `POST /course/messages` отдаёт дельты.

### CourseGroup
- **Даты (`startsAt/endsAt`) — НЕ используем пока**, доступ регулируется вручную через `active` (open/close).
- **Обновление QR — без отдельного endpoint:** в `PUT /course/groups/{id}` передать в теле `updateQRCode=true`. (PUT уже есть в спеке.)
- **Place — не нужен вообще** (группа = контроль доступа, не организация встреч).

### Файлы
- `POST /file/upload` — общее хранилище файлов, возвращает публичный URL. Пока используем для аватаров агентов (`CourseAgent.avatar`).

### CourseAgent доп. поля (из прошлого раунда)
- Добавляем `role` (роль агента, напр. «наставник по бизнес-модели») + `docs` (на будущее, под векторную БД / RAG).
- `targets` НЕ нужен — акселератор = отдельный namespace `/accelerator/agents`, в админке два таба в разные endpoints.
- `slug` пока не нужен — на фронте обходимся ObjectId.

### Анкета / прочее (из прошлого раунда)
- «Регион» = `User.city` (отдельного `region` нет). Фамилия не нужна (только `firstName`).
- n8n выпадает — агенты целиком на OpenAI Assistants (поля `n8nWebhookUrl/n8nSecret` не нужны).
- Доступность агентов — через open/close самой группы (`active`), не per-agent.

---

## Следствия для нашей реализации

1. **Auth = BFF с relay http-only cookies.** Так как куки ставит Ивановский домен, наш Next.js-прокси:
   - форвардит входящие куки браузера → в запрос к Ивану (`Cookie` header);
   - копирует `Set-Cookie` от Ивана → в ответ браузеру, переписывая `Domain/Path` на наш;
   - на 401 от Ивана → зовёт `POST /auth/refresh` (с куками), получает новый `Set-Cookie`, ретраит исходный запрос.
   - CORS не нужен (браузер общается только с нашим доменом). Direct-from-browser отвергаем — потребовал бы `SameSite=None`+CORS на стороне Ивана.

2. **QR-ротация** — не новый роут, а `PUT /course/groups/{id}` c `updateQRCode=true`.

3. **«Программа» в UI = CourseGroup (контроль доступа).** Убрать из админки программ поля места/дат как обязательные; «закрыть программу» = `active=false`.

---

## 🔴 Раунд 2 — открыто (отправлено Ивану 2026-05-21)

### Чат — стрим (Phase 3) — ✅ РЕШЕНО (Иван уже сделал SSE)
`POST /course/messages` — теперь **SSE-стриминг** (тело `{agentId, messageText}`, messageText ≤4000). События:
- `message_created` → `{ userMessage }` (сохранённое сообщение юзера, с _id)
- `delta` → `{ text: "..." }` (фрагмент ответа агента)
- `done` → `{ agentMessage }` (финальное сохранённое сообщение агента, с _id/createdAt)
- `error` → `{ message, code }`
Заголовки корректные (text/event-stream, no-cache, X-Accel-Buffering: no). Диалог по `(user, agent)`, без project; история `GET /course/messages?agentId&page&limit`.

**Дизайн-вопрос про thread — РЕШЕНО (Maxi):** один thread на пользователя, общий для всех агентов — by design. Историю **объединяем** (единая лента на юзера, выбор агента = кто отвечает следующим). Фронт уже сделан так (Phase 3).

**Наша сторона (Phase 3):** BFF должен стримить SSE насквозь — текущий `ivanCall` буферит JSON, нужен отдельный стрим-путь (fetch → ReadableStream → NextResponse, форвард кук).

### Роли и права (saas-admin)
- ✅ **Гейт доступа в админку (ответ Ивана 2026-05-21):** у юзеров по умолчанию роли нет / `role = null`. **Есть роль (non-null) → пускаем в saas-admin**, нет → только saas-teacher. → `requireAuth` админки = `profile.role != null`.
- ⏳ Формат/словарь `Role.permissions[]` (строки вида `users.read`/`agents.write`?) — для гранулярного гейтинга разделов. На MVP гейтим присутствием роли; гранулярность позже.
- `GET /profile` отдаёт `role` с populated `permissions[]` (предполагаем да — `User.role: Role`); `GET /roles` — список ролей с `_id` (для `PUT /users/{id}/role`).

## Раунд 3 — data-слой saas-admin

Auth админки уже на Иване. Переводим CRUD админки (agents/programs/users) с нашего Postgres на API Ивана. **Новых переменных не добавляем** (решение Maxi).

### ✅ Решено (2026-05-21)
- **CourseAgent — финальные поля:** `name, description, avatar, openAiAssistantId, baseMessages, role, docs, serial`. `serial` (порядок в списке) уже добавлен. Флаг «в разработке», `notes` — НЕ делаем. `targets`/`n8n*` — выкинули. `slug` — нет (ObjectId).
- **baseMessages:** инпут в админке оставляем как есть, к бэку пока НЕ привязываем. В будущем (при отказе от `openAiAssistantId`) через него будет редактироваться промпт каждого агента.
- **CourseGroup:** `startsAt/endsAt/place` — выкинули, доступ через `active`. Поля: `name, agents[], active, qrCode`.
- **Выкинули совсем** (нет у Ивана и не надо): Place, библиотека маскотов (аватары через `/file/upload`), audit-log (этап 2), password-reset/смена пароля (OTP), permissions-дерево (гейтим ролью), freeze.

### ✅ Ответы Ивана (2026-05-21) — контракт data-слоя закрыт
1. **Управление юзерами — ограниченное:** только назначить роль (`PUT /users/{id}/role`, доступ в админку) + редактировать данные (`PUT /users/{id}`). Ручного управления членством в группе НЕТ — членство = `User.courseGroup`, ставится только self-join по QR (`POST /course/groups/join`). Freeze нет.
2. **`PUT /course/groups/{id}`:** `agents[]` = массив `agentId`, PUT **заменяет массив целиком** (так вкл/выкл агента в группе). ✓
3. **Фильтрации `GET /users` НЕТ** (только валидация/пагинация/поиск). → «ученики группы» и «только админы» фильтруем на клиенте по `courseGroup`/`role`.

**Следствия для админ-UI:** убрать ручное добавление/удаление ученика из группы (нельзя), убрать freeze; список учеников группы и список админов — клиентский фильтр по всем `/users`.

## 🟢 Этап 2 (отложено)
- `audit-log` админских действий.
- Модель сессий/артефактов ученика.
