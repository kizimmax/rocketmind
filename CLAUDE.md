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
│   └── internal/             # Internal tools: gantt, lens-demo (Next.js, port 3003)
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
- **`@rocketmind/internal`** (`apps/internal`) — Internal tools (gantt + firebase, lens-demo)

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

**Last updated:** 2026-03-26 | **Version:** 2.0.0
