# Вопросы Ивану по API R-Акселератор 1.2

**Цель созвона:** зафиксировать первую пачку API, достаточную для реализации Onboarding + Dashboard + Project Shell + первого эксперта (R1, Роман) на реальном бэке.
**Что мы покажем:** демку Phase 2 на моках (onboarding → dashboard → project shell).
**Что приносит Иван:** структура данных (доменная модель его n8n / БД).

---

## 1. Инфраструктура и контракт в целом

1. **n8n on Amvera** — какая именно версия n8n, self-hosted или cloud? Где домен API (например `https://api.r-akselerator.ru/v1/...`)?
2. **Формат контракта** — пишем OpenAPI 3.x или просто markdown с примерами запросов/ответов?
3. **Версионирование API** — через URL (`/v1/`) или через Accept-header?
4. **Base URL для dev vs prod** — где берём `NEXT_PUBLIC_API_URL`?
5. **CORS** — домены разрешены (`localhost:3002` для dev, прод-домен)? Credentials allowed?
6. **Rate limiting** — лимиты per-user / per-IP? Заголовки типа `X-RateLimit-*`?
7. **Запросы через n8n webhooks vs REST-proxy** — как выглядит endpoint: webhook URL с query или классический REST?

---

## 2. Доменная модель (что Иван приносит)

Наша предполагаемая модель (см. PRD §5 + `migration-plan-1.2.md`):

**Сущности:** `User`, `Workspace`, `Project`, `ProjectMember`, `Expert`, `ExpertPromptVersion`, `ExpertSession`, `Message`, `Artifact`, `ProjectScore`, `Subscription`, `Payment`, `Invitation`, `ProjectCanvas` (Wave 2).

Для каждой сущности, которую приносит Иван:
1. Полный список полей + типы (UUID? ISO-8601 для дат? Как именуются — snake_case / camelCase?)
2. Обязательные vs опциональные
3. Связи (foreign keys)
4. Что возвращается в GET-ответе как полное описание vs expanded
5. Есть ли `created_at` / `updated_at` на всех сущностях
6. Как выглядит `Expert` в его модели: R1-R5 как enum / как отдельная сущность с конфигом / как-то иначе?

---

## 3. Auth (пока откладываем, но базовые вопросы)

1. JWT или session-cookie?
2. Если JWT — access + refresh? Какой срок жизни?
3. Где хранится token у клиента (httpOnly cookie или Authorization header)?
4. Магический код (OTP) через email — какой провайдер (SendGrid / SES / Mailgun)? Сколько цифр, TTL?
5. Есть ли social-login в планах?
6. Endpoint-ы:
   - `POST /auth/request-code` body: `{email}` → ?
   - `POST /auth/verify-code` body: `{email, code}` → ?
   - `GET /auth/me` → ?
   - `POST /auth/logout` → ?
7. 2FA для админов (по PRD обязательно) — TOTP / U2F / что-то другое?

---

## 4. Projects (для Dashboard и Project Shell)

1. `GET /projects` — какая пагинация? Cursor или offset? Лимит по умолчанию?
2. Что возвращается в карточке проекта (Dashboard): имя, стадия, скоринг, прогресс, дата, owner-avatar?
3. `POST /projects` body — что минимально нужно? (`name, role, industry, stage`?)
4. `GET /projects/:id` — возвращает проект + members + current_session? Или отдельными запросами?
5. Как фильтровать: по стадии, по скорингу, по роли участника?
6. Как выглядит **прогресс проекта** — % завершения на основе пройденных экспертов? Или свой алгоритм?

---

## 5. Expert Pipeline (ядро PRD)

1. Как именуются эксперты в API — по codename (roman, regina, roza, ...) или по ID?
2. Как начинается сессия с экспертом?
   - `POST /projects/:id/sessions body: {expert_id, mode?}` → ?
3. **State machine переходов** (R1→R2⇄R+→R3→R4→R5):
   - **Где живёт логика** — в n8n или на фронте?
   - Как фронт узнаёт, разрешён ли переход к следующему эксперту?
   - Можно ли вернуться к предыдущему? При каких условиях?
   - Что такое "калибровка" в API (вход в R3+ напрямую)?
4. **Передача контекста между экспертами:**
   - Формат `context_payload` (полная история? структурированный summary? и то и другое?)
   - Кто формирует сжатый контекст — n8n или запрашивает у LLM отдельно?
   - Как фронт видит, что передалось следующему эксперту (для прозрачности)?
5. Сколько LLM-токенов в среднем на одну сессию (для UX прогресс-индикаторов)?

---

## 6. Messages + Streaming

1. **Протокол streaming:**
   - SSE (`Content-Type: text/event-stream`) или WebSocket?
   - Если WS — какой URL, какой handshake, какие events?
   - Формат чанков: `{delta: "..."}` или `{type, data}`?
2. Reconnect / resume — если соединение оборвалось, как восстановить позицию в streaming-ответе?
3. Остановка генерации — endpoint `POST /sessions/:id/stop`?
4. Attachments (файлы в сообщениях) — как отправлять? Отдельный upload → передаём ID, или multipart?
5. Формат истории сообщений — markdown plain или уже HTML / structured blocks?
6. `is_read` флаг — кто его ставит (фронт при рендере / бэк при доставке)?

---

## 7. Artifacts + HITL-валидация

1. Как генерируется Artifact — автоматически после N сообщений, по триггеру эксперта, или по явной команде пользователя?
2. Формат `Artifact.content` — markdown, JSON-schema per type (market_brief, pitch_deck, unit_economics, ...)? Где спецификация?
3. Версионирование артефактов — хранятся все версии или только финальная?
4. HITL-действия:
   - `POST /artifacts/:id/validate body: {decision: accept|reject|request_changes, feedback?}`
   - Что происходит после `reject` — откат к эксперту с feedback'ом?
   - Ручное редактирование артефакта — `PATCH /artifacts/:id body: {content}` или через диалог с экспертом?
5. **PDF-экспорт** — кто рендерит PDF (n8n через puppeteer / внешний сервис / фронт через react-pdf)?
6. Финальный пакет — это виртуальная сборка из артефактов или отдельная сущность `FinalArtifactBundle`?

---

## 8. Scoring

1. **Алгоритм скоринга 0–100** — где описан? Кто его считает (контролёр-агент в n8n)?
2. Когда обновляется — после каждого эксперта или после завершения всех?
3. Разбивка по измерениям (рынок / ЦА / модель / MVP / питч) — возвращается в API?
4. Пример `GET /projects/:id/score` response для фронта?

---

## 9. R-менеджер (поддержка)

1. Это отдельный эксперт в pipeline или отдельный service?
2. Как создаётся ticket / session с ним — `POST /support/tickets` с категорией?
3. Escalation к человеку — как работает? Email? Slack?

---

## 10. Billing (Wave 1 — только UI)

1. Есть ли уже в БД сущности Subscription / Payment?
2. Какой платёжный gateway — CloudPayments / YooKassa / Stripe? Кто решает?
3. Модель монетизации:
   - **Лимит проектов** на тариф (Base = ?, Optimal = ?, Premium = ?)
   - **Лимит токенов** в месяц — как отслеживаем расход?
   - Per-seat (для Team) — как считается?
4. Как UI получает текущий usage (`GET /billing/usage` → `{tokens_used, tokens_balance, renewal_date}`)?
5. Пробный период — есть, нет, сколько?

---

## 11. Team & Roles

1. Invitations — как работают ссылки?
   - `POST /projects/:id/members body: {email, role}` → создаёт Invitation с token → email юзеру
   - Юзер кликает ссылку `/invite/:token` — что происходит, если он не залогинен?
2. Проверка прав — на фронте по `user.role_in_project` или всегда на бэке?
3. Mentor — как отличается от Observer в API?

---

## 12. Файлы и storage

1. Куда загружаются файлы — S3-совместимое (MinIO? Amvera S3?)?
2. Как отдаются URL — pre-signed (истекают) или публичные?
3. Лимиты: размер файла, кол-во на проект, общий объём на пользователя?
4. Антивирус / content-scanning?

---

## 13. Error handling

1. Общий формат ошибки:
   ```json
   { "error": { "code": "...", "message": "...", "details": {} } }
   ```
   Или другой?
2. Какие стандартные коды ошибок:
   - 400 VALIDATION_ERROR
   - 401 UNAUTHENTICATED
   - 403 FORBIDDEN
   - 404 NOT_FOUND
   - 409 CONFLICT
   - 422 BUSINESS_RULE_VIOLATION
   - 429 RATE_LIMITED
   - 500 INTERNAL_ERROR
3. Как передаются validation errors по полям (`{field: message}` или массив)?
4. Traceid в заголовках (для дебага)?

---

## 14. Webhooks и async events

1. Для Partner API (Wave 2–3) — формат webhook payload?
2. Retry policy?
3. Подпись webhook (HMAC)?

---

## 15. Observability

1. Что логируется на бэке?
2. Sentry / другой error tracker — куда фронт шлёт ошибки?
3. Есть ли request_id, который фронт может прикрепить к своим логам для корреляции?

---

## 16. Критические риски, которые хочу услышать от Ивана

1. **n8n ограничения** — может ли n8n держать long-running streaming (30+ секунд) без обрывов?
2. **Масштаб** — сколько одновременных пользователей n8n тянет? Что с WebSocket-конкурентностью?
3. **Стоимость LLM** — как мы увидим на фронте превышение бюджета?
4. **Retention данных** — сколько хранятся сообщения / артефакты? Что с GDPR «право на удаление»?
5. **Tenant isolation** — как изолированы данные разных Workspace (когда добавится team mode)?

---

## 17. Что я предлагаю для первого созвона как минимальный achievable scope

**Первая пачка API для Wave 1 фазы 2–3:**

| Endpoint | Метод | Зачем | Приоритет |
|---|---|---|---|
| `/auth/request-code` + `/verify-code` + `/me` | POST / POST / GET | Auth | 🔴 |
| `/onboarding/submit` | POST | Завершить онбординг → создать Project | 🔴 |
| `/projects` | GET / POST | Dashboard + создание | 🔴 |
| `/projects/:id` | GET / PATCH / DELETE | Project Shell | 🔴 |
| `/projects/:id/sessions` | GET / POST | Список диалогов + старт | 🔴 |
| `/sessions/:id` | GET | Контекст и история | 🔴 |
| `/sessions/:id/messages` | POST + stream | Чат | 🔴 |
| `/projects/:id/artifacts` | GET | Правая панель | 🟡 |
| `/artifacts/:id/validate` | POST | HITL | 🟡 |
| `/projects/:id/score` | GET | Карточка проекта | 🟢 |

Остальное — следующей пачкой.

---

## 18. Что я обещаю Ивану

1. Фронт на моках будет следовать **ровно** той структуре данных, которую он принесёт — без "а давай поля по-другому называть".
2. Мок-адаптер в `src/lib/api/` — один интерфейс, две реализации (mock + real). Свап по endpoint'ам по мере готовности бэка.
3. Все вопросы по контракту — через PR в `docs/api-contract-1.2.md`, не в переписке.
4. Критичные несогласования (например state machine) — сначала обсуждаем, потом пишем код.
