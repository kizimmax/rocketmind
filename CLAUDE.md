# Claude Code Context for Rocketmind

## 🎯 Project Overview
**Rocketmind** — SaaS платформа AI-агентов для ведения кейсов с чат-интерфейсом. MVP 1.1, web-only, n8n интеграция.
**PRD:** `docs/PRD Rocketmind AI Agent MVP 1.1 - от 20 февр. 2026.md`

---

## 📂 Key Files & Structure
```
/Rocketmind/
├── design/
│   ├── design-system.md        # Источник правды дизайн-системы
│   ├── system.pen / landing.pen / auth.pen / app.pen
├── design-system-docs/         # Веб-версия (Next.js, localhost:3000)
└── src/                        # Исходный код (структура TBD)
```

---

## 🎨 Дизайн-Система — Правила

### 🚫 ЗАПРЕТ: никакой стиль без проверки в ДС

**Алгоритм при любом визуальном/интерактивном решении:**
1. **Найди паттерн** в `design/design-system.md` (hover, focus, transition, spacing, цвет, тень)
2. **Нашёл** → использовать дословно
3. **Не нашёл → СТОП.** Написать в чат: «Нужен стиль для [ситуация]. Предлагаю: [вариант с токенами]. Добавить в раздел [N]?» — ждать подтверждения
4. **После подтверждения:** сначала обновить ДС МД + ДС Вэб, потом реализовать в коде

**Запрещено без проверки:** `hover:*` не из ДС, `ring-*`, `shadow-*`, `animate-*`, Tailwind-цвета (`bg-blue-*`), нестандартные `rounded/gap/p`, `outline/border` в нестандартных комбинациях.

### ⚠️ Синхронизация — ВСЕГДА оба файла
- `design/design-system.md` — Markdown-источник правды
- `design-system-docs/` — веб-версия (Next.js, localhost:3000)

Никогда не обновлять только один из них.

### Workflow
- **Экран:** дизайн в .pen → скриншот/согласование → код
- **Компонент:** проверить ДС → добавить в system.pen как reusable → ref везде
- **Изменение ДС:** обновить ДС МД → обновить ДС Вэб → реализовать

---

## 💻 Stack
- **UI:** shadcn/ui + Tailwind CSS (только CSS-переменные, не Tailwind-утилиты цветов)
- **Backend:** n8n вебхуки
- **Data:** users, cases, agents, conversations, messages

---

## ✅ Scope MVP 1.1
- Авторизация email + code
- Автобутстрап по URL `/a/{agent_slug}`
- Диалог в чате с ИИ-агентом
- Результат/ссылка на оплату в системном сообщении

---

## 🛠️ Commands
```bash
cd design-system-docs && npm run dev  # localhost:3000
```

**Last updated:** 2026-03-14 | **Version:** 1.3
