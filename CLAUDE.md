# Claude Code Context for Rocketmind

## Project Overview
**Rocketmind** — SaaS платформа AI-агентов для ведения кейсов с чат-интерфейсом. MVP 1.1, web-only, n8n интеграция.
**PRD:** `docs/PRD Rocketmind AI Agent MVP 1.1 - от 20 февр. 2026.md`

---

## Monorepo Structure
```
/Rocketmind/
├── packages/ui/              # @rocketmind/ui — shared UI components & tokens (tsup)
├── apps/
│   ├── design-system/        # DS documentation (Next.js, port 3000)
│   ├── site/                 # Marketing site (Next.js, port 3001)
│   ├── saas/                 # SaaS app shell (Next.js, port 3002)
│   └── internal/             # Internal tools: r-plan (Next.js, port 3003)
├── design/
│   ├── design-system.md      # Source of truth — design system spec
│   ├── system.pen / landing.pen / auth.pen / app.pen
├── docs/                     # Product documentation
├── assets/                   # Shared assets
└── scripts/                  # Utility scripts
```

### Key Packages
- **`@rocketmind/ui`** (`packages/ui`) — 16 components, full token set, ThemeProvider. All apps import from here.
- **`@rocketmind/design-system`** (`apps/design-system`) — DS web docs
- **`@rocketmind/site`** (`apps/site`) — Marketing landing
- **`@rocketmind/saas`** (`apps/saas`) — SaaS product (login, agents, cases)
- **`@rocketmind/internal`** (`apps/internal`) — R-Plan (firebase)

---

## Design System Rules

### No style without DS check

**Algorithm for any visual/interactive decision:**
1. **Find pattern** in `design/design-system.md` (hover, focus, transition, spacing, color, shadow)
2. **Found** → use verbatim
3. **Not found → STOP.** Write in chat: "Need style for [situation]. Propose: [variant with tokens]. Add to section [N]?" — wait for confirmation
4. **After confirmation:** update DS MD + DS Web first, then implement in code

**Forbidden without check:** `hover:*` not from DS, `ring-*`, `shadow-*`, `animate-*`, Tailwind colors (`bg-blue-*`), non-standard `rounded/gap/p`, `outline/border` in non-standard combos.

### Sync Rule — ALWAYS both files
- `design/design-system.md` — Markdown source of truth
- `apps/design-system/` — web version (Next.js, port 3000)

Never update only one of them.

### Blocks = shared components (zero duplication)

Every live-preview block in DS Web sections «Маркетинг блоки» and «Сквозные блоки» **must** be a component exported from `@rocketmind/ui` (or a local DS-only demo wrapper around one). Inline markup for block previews is forbidden.

When adding a new block:
1. Create the component in `packages/ui/src/components/ui/`
2. Export from `packages/ui/src/index.ts` (under `// Blocks`)
3. Use in DS Web as `<ComponentName />` preview
4. In `apps/site` (or other apps): import from `@rocketmind/ui` directly, or re-export from a local file if the app needs a wrapper

### No component without DS check

**Algorithm for any UI element (button, input, dialog, tooltip, toast, switch, etc.):**
1. **Check** `packages/ui/src/index.ts` for existing component
2. **Found** → import from `@rocketmind/ui` and use
3. **Not found → STOP.** Write in chat: "Need component [X] for [situation]. Create in @rocketmind/ui and add to DS Web?" — wait for confirmation
4. **After confirmation:** create in `packages/ui`, export from `index.ts`, add showcase to DS Web, then use in app

**Forbidden without check:** inline `<button>`, `<input>`, `<dialog>`, custom modals, custom toasts, custom tooltips (`title` attributes), or any UI primitive that has an equivalent in `@rocketmind/ui`.

### Workflow
- **Screen:** design in .pen → screenshot/approval → code
- **Component:** check DS → add to system.pen as reusable → ref everywhere
- **DS change:** update DS MD → update DS Web → implement

---

## Stack
- **UI:** @rocketmind/ui (shadcn/ui patterns + Tailwind CSS v4, CSS variables only)
- **Backend:** n8n webhooks
- **Data:** users, cases, agents, conversations, messages

---

## Scope MVP 1.1
- Auth email + code
- Auto-bootstrap via URL `/a/{agent_slug}`
- Chat dialog with AI agent
- Result/payment link in system message

---

## Commands
```bash
# Dev servers
npm run dev:ds         # apps/design-system → localhost:3000
npm run dev:site       # apps/site → localhost:3001
npm run dev:saas       # apps/saas → localhost:3002
npm run dev:internal   # apps/internal → localhost:3003

# Build
npm run ui:build       # Build packages/ui
npm run build          # Build all (turbo)

# Release
npm run release        # bump version + commit + push
```

---

## gstack (скилл-паки Garry Tan / YC)

Установлен в `~/.claude/skills/gstack` (no-prefix mode — команды без `/gstack-`).

**Доступные скиллы:**
`/office-hours`, `/autoplan`, `/plan-ceo-review`, `/plan-eng-review`, `/plan-design-review`, `/plan-devex-review`, `/design-consultation`, `/design-shotgun`, `/design-html`, `/design-review`, `/review`, `/codex`, `/cso`, `/investigate`, `/qa`, `/qa-only`, `/devex-review`, `/ship`, `/land-and-deploy`, `/canary`, `/benchmark`, `/document-release`, `/retro`, `/learn`, `/browse`, `/open-gstack-browser`, `/pair-agent`, `/setup-browser-cookies`, `/setup-deploy`, `/gstack-upgrade`, `/careful`, `/freeze`, `/guard`, `/unfreeze`, `/checkpoint`, `/health`, `/plan-tune`.

### Правила интеграции с нашими процессами

1. **DS-правила выше gstack.** Если `/plan-design-review` или `/design-review` предлагает стиль вне `design/design-system.md` — проходим наш цикл: «check DS → not found → ask → confirm → update DS MD + DS Web → implement». `/design-shotgun` используем как **источник идей**, но итоговые токены/паттерны должны попасть в DS MD до кода.
2. **Коммиты на русском.** Используем наш локальный скилл `/push` (RU, imperative, ≤72 char). `/ship` — только для PR-части; commit message задаём мы до `/ship`.
3. **`/browse` вместо mcp-chrome.** Для браузерного автоматического тестирования — `/browse` и `/qa`. Не используем `mcp__claude-in-chrome__*`.
4. **`/review` перед каждым PR.** Обязателен на не-тривиальных изменениях в `apps/saas`.
5. **`/cso` перед прод-деплоем.** Обязателен для изменений в auth, billing, admin, webhook-поверхности.
6. **`/office-hours` + `/autoplan` на больших задачах.** Перед любой фичей уровня Phase (см. `docs/migration-plan-1.2.md`).
7. **`/investigate` (Iron Law).** Для багов в expert pipeline и streaming: не фиксим без root-cause.
8. **`/learn`** — накапливаем Rocketmind-специфичные паттерны между сессиями.

---

## R-Акселератор 1.2 — Wave 1 scope

- **PRD:** `docs/R-Akselerator-PRD-Documentation.md`
- **План миграции:** `docs/migration-plan-1.2.md`
- **Вопросы для Ивана (бэк):** `docs/api-questions-for-ivan.md`
- **Подход:** текущий `apps/saas` — надёжные рельсы, не rewrite. Рефакторинг поверх с переиспользованием `chat.tsx`, `message.tsx`, `sidebar.tsx`, streaming-UX, темизации.
- **Wave 1:** Onboarding + Dashboard + Project Shell + Expert Pipeline R1→R5 + Artifacts/HITL + Team Roles + Billing UI + минимальный Admin (prompt editor в `apps/internal`).
- **НЕ в Wave 1:** Canvas (~200 типов), полная админка, Partner API, white-label, когорты.
- **Backend:** Иван на n8n (Amvera). Auth откладываем до первого контракта от него.

---

**Last updated:** 2026-04-18 | **Version:** 2.1.0
