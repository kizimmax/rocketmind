# План миграции SaaS MVP 1.1 → R-Акселератор 1.2

**Дата:** 2026-04-18
**Статус:** Утверждён (Wave 1 scope — minimal)
**Владелец фронта:** Максим + Claude Code
**Владелец бэка:** Иван (n8n на Amvera)
**Источник правды по продукту:** `docs/R-Akselerator-PRD-Documentation.md`

---

## 0. Принципы работы

1. **Текущий apps/saas = надёжные рельсы.** Не переписываем с нуля. Наращиваем поверх: chat.tsx, message.tsx, sidebar.tsx, streaming-UX, темизация, mobile-header — сохраняем.
2. **Design System сначала.** Любой новый визуальный элемент → проверка `design/design-system.md` → если нет → `ask user` → апрув → апдейт DS MD + DS Web → код.
3. **Wave 1 = minimum viable.** Canvas, полная админка, Partner API, когорты — вне scope.
4. **Параллелизация.** Фронт работает на моках, пока Иван не отдаст API. API-контракт лочится на первом созвоне и становится единым источником правды для обоих.
5. **Commits на русском** через наш `/push` скилл.
6. **gstack-скиллы** интегрированы, но не замещают наши правила (DS-check остаётся выше).

---

## 1. Краткая дельта 1.1 → 1.2

| Измерение | 1.1 | 1.2 |
|---|---|---|
| Ядро | Чат с 1 агентом | Оркестрованный pipeline 6 экспертов R1→R2⇄R+→R3→R4→R5 |
| Контейнер | Case (плоский) | Workspace → Project → ExpertSession[] |
| Роли | Owner | Owner / Executor / Observer / Mentor + Admin |
| Артефакты | Нет | HITL-валидация, версии, финальный пакет, скоринг 0–100 |
| Нелинейный путь | Нет | Калибровка — вход на произвольный этап |
| Canvas | Нет | ~200 типов (Premium Desktop) — **Wave 2** |
| Админка | Нет | 8 модулей — **Wave 1 = только prompt editor** |
| Коллаб | Нет | Приглашения, ментор-режим |
| API | Моки в памяти | n8n/Amvera (Иван) |
| Streaming | UI-таймер | SSE или WebSocket (решить с Иваном) |
| Billing | Нет | 6 тарифов, токены, лимиты — Wave 1 = UI без интеграции |

---

## 2. Wave 1 Scope (утверждено)

### ✅ В Wave 1
- [ ] Onboarding chat с R-менеджером (4 вопроса → создание Project)
- [ ] Dashboard проектов (карточки, прогресс, скоринг, фильтры)
- [ ] Project Shell (sidebar + чат + артефакт-панель + settings)
- [ ] Expert Pipeline R1→R2⇄R+→R3→R4→R5 с HITL
- [ ] Финальные артефакты + PDF + скоринг 0–100
- [ ] Team roles + приглашения
- [ ] Account (профиль, security, notifications, billing UI)
- [ ] Минимальный Admin: prompt editor (в `apps/internal`, не saas)

### ❌ НЕ в Wave 1
- Canvas (~200 типов) → Wave 2
- Admin-панель полная (8 модулей) → Wave 2–3
- Partner API / white-label → Wave 2–3
- Когортное управление → Wave 2
- Mission Canvas онбординг → Wave 2

### ⏸️ Отложено (решается с Иваном)
- Платёжный gateway (CloudPayments / YooKassa / Stripe)
- Streaming протокол (SSE vs WebSocket)
- Auth flow (до первого API от Ивана — используем текущие моки MVP 1.1)

---

## 3. Порядок фаз

### Phase 0 — Alignment & Contracts (1 неделя)
**Цель:** лочим API-контракт, state machine, context strategy с Иваном до написания кода бэк-интеграции.

**Deliverables:**
- [x] План сохранён в `docs/migration-plan-1.2.md`
- [ ] Вопросы для Ивана в `docs/api-questions-for-ivan.md`
- [ ] gstack установлен и прописан в CLAUDE.md
- [ ] `/office-hours`-упражнение — ужатие Wave 1
- [ ] Созвон с Иваном: API-контракт + state machine
- [ ] `docs/api-contract-1.2.md` — согласованный OpenAPI/JSON
- [ ] `docs/state-machine-1.2.md` — диаграмма переходов между экспертами

**gstack:** `/office-hours`, `/autoplan`, `/plan-eng-review`, `/learn`

---

### Phase 1 — Foundation refactor (2 недели)
**Цель:** скелет под новую модель, UX сохранён.

**Задачи:**
1. `src/lib/types.ts` — добавить `Project`, `Expert`, `ExpertSession`, `Artifact`, `ProjectMember`, `Score`, `Subscription`. Legacy-типы (`Case`, `Agent`, `Conversation`) помечены `@deprecated` с алиасами.
2. `src/lib/api/` — fetch-клиент, модули per-сущность, env-флаг `NEXT_PUBLIC_USE_MOCKS=true` для fallback на моки.
3. TanStack Query → `src/lib/queries/`.
4. **Auth откладываем** — пока Иван не отдаст контракт. Используем существующую мок-авторизацию.
5. Streaming — адаптер `src/lib/streaming/` под согласованный протокол (SSE/WS).
6. Переименования роутов с legacy-редиректами: `/cases/[id]` → `/projects/[id]`, `/agents` → `/experts`.

**gstack:** `/plan-eng-review`, `/review`, `/codex`, `/freeze` на время рефакторинга data-слоя.

---

### Phase 2 — Onboarding + Dashboard + Project Shell (2 недели) 🎯 ДЕМО ИВАНУ
**Цель:** новая IA на моках. Показать Ивану на созвоне.

**Задачи:**
1. `/onboarding/chat` — R-менеджер с 4 вопросами (роль, отрасль, стадия, результат), на выходе создание Project.
2. `/dashboard` — карточки проектов (имя, стадия, скоринг-прогресс, дата), поиск, фильтры, CTA «Новый проект», floating R-менеджер.
3. `/projects/[id]` — shell: sidebar (диалоги/артефакты/settings), центр (чат), правая панель (артефакты).
4. `/projects/[id]/settings` — профиль проекта, участники (моковые), опасная зона.

**gstack:** `/design-shotgun`, `/design-html`, `/plan-design-review`, `/design-review`, `/qa localhost:3002`

**DS-риск:** progress bar скоринга, artifact preview card, session timeline, chip'ы этапов — обязательно через DS-цикл.

---

### Phase 3 — Expert Pipeline + Streaming + Artifacts (3 недели) 🔴 СЕРДЦЕ
**Задачи:**
1. State machine на фронте (зеркалит правила Ивана).
2. Чек-листы этапа (вход/выход).
3. Реальный streaming (SSE/WS → посимвольный рендер).
4. HITL-валидация: accept / reject / request changes, inline редактор.
5. Переход между экспертами + восстановление контекста.
6. Калибровка — вход в R3+ напрямую, загрузка документов.
7. Финальные артефакты + PDF + скоринг-карточка 0–100.

**gstack:** `/plan-eng-review`, `/investigate` (Iron Law — нет фикса без RCA), `/qa`, `/codex`, `/benchmark`, `/review`

---

### Phase 4 — Account & Billing UI (1.5 недели)
**Задачи:** `/account/profile`, `/security`, `/notifications`, `/billing` (тариф, токены, история, upgrade-flow). Интеграция с платёжкой — после выбора gateway.

**gstack:** `/cso`, `/plan-design-review`, `/qa`

---

### Phase 5 — Team Roles & Invitations (1.5 недели)
**Задачи:** приглашения (email+role+token), ролевая модель Owner/Executor/Observer/Mentor на фронте + enforcement на бэке.

**gstack:** `/plan-eng-review`, `/cso`, `/qa`

**→ Конец Wave 1. Закрытая бета.**

---

### Phase 6 — Minimal Admin (1 неделя)
**Scope:** только prompt editor с версионированием + базовая аналитика. В `apps/internal`, за VPN/IP-allowlist.

**gstack:** `/cso`, `/plan-devex-review`

---

### Phase 7 — Production readiness (1 неделя)
- Sentry, GA4 / Amplitude
- Полный QA regress
- Security audit (`/cso` + `/codex`)
- Performance baseline (`/benchmark`)
- Document release (`/document-release`)
- Deploy на Amvera (с Иваном)
- `/canary` — пост-деплой 48h

---

### Phase 8 — Wave 2 backlog
Canvas, Partner API, white-label, когорты, полная админка, mission-canvas. Приоритизация на основе обратной связи от первых пользователей.

---

## 4. Mapping gstack-скиллов

| Фаза | Основные | Power-tools |
|---|---|---|
| 0. Alignment | `/office-hours`, `/autoplan`, `/plan-eng-review` | `/learn` |
| 1. Foundation | `/plan-eng-review`, `/review`, `/codex` | `/freeze`, `/guard` |
| 2. Dashboard+Shell | `/design-shotgun`, `/design-html`, `/plan-design-review`, `/design-review`, `/qa` | `/learn` |
| 3. Pipeline | `/plan-eng-review`, `/investigate`, `/qa`, `/codex`, `/benchmark`, `/review` | `/careful`, `/freeze` |
| 4. Billing | `/cso`, `/plan-design-review`, `/qa` | `/guard` |
| 5. Roles | `/plan-eng-review`, `/cso`, `/qa` | — |
| 6. Admin | `/cso`, `/plan-devex-review`, `/review` | — |
| 7. Prod | `/qa`, `/cso`, `/codex`, `/benchmark`, `/document-release`, `/canary` | `/ship` → `/land-and-deploy` |
| Cross-cut | `/retro` (еженедельно), `/learn` (после фазы), наш `/push` для коммитов RU | `/gstack-upgrade` |

---

## 5. Риски и митигации

| Риск | Митигация |
|---|---|
| API-контракт разойдётся с UX-потребностями | Phase 0 — лочим контракт на демке Phase 2 |
| Долгий контекст между экспертами ломает LLM | Владение у Ивана; фронт только отображает сводку |
| Streaming-обрыв (сеть) | Reconnect + resume с позиции |
| Canvas «хочется в Wave 1» | Жёсткий scope-gate: ссылка на этот документ |
| DS-размывание в спешке | Правило CLAUDE.md, `/plan-design-review` перед каждым новым экраном |
| Регресс в существующем UX | `/qa` до и после каждой крупной доработки |

---

## 6. Прогресс

- [x] PRD 1.2 проанализирован
- [x] apps/saas 1.1 заауджен
- [x] Gap-анализ
- [x] План утверждён (Wave 1 scope)
- [ ] gstack установлен
- [ ] CLAUDE.md обновлён с gstack-секцией
- [ ] Вопросы для Ивана подготовлены
- [ ] Office-hours упражнение проведено
- [ ] Phase 2 демка готова для созвона
- [ ] Созвон с Иваном прошёл, контракт зафиксирован
