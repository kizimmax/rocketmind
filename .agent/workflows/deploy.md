---
description: Deploy all local changes to GitHub and trigger an Amvera Docker rebuild
---

# Deploy Workflow

// turbo-all

1. Check what changed (Проверка измененных файлов):
```bash
git status
```

2. Stage all changes (Подготовка файлов к коммиту):
```bash
git add -A
```

3. Verify build stability locally — собираем оба приложения с правильными флагами:
```bash
cd apps/site && NEXT_STATIC_EXPORT=1 npm run build 2>&1 | tail -5
```
```bash
cd apps/site-admin && npm run build 2>&1 | tail -5
```

4. Commit with a descriptive message (Создание коммита с описанием изменений):
```bash
git commit -m "deploy: update content and UI"
```

5. Push to GitHub (Отправка изменений в репозиторий, после чего Amvera начнёт Docker rebuild автоматически):
```bash
git push
```

6. Confirm push was successful and inform the user:
   - ✅ Код отправлен на GitHub
   - 🐳 Amvera автоматически запустит Docker rebuild (~5–10 мин)
   - 🌐 Сайт обновится на https://r-front-rocketmind.amvera.io

### ⚠️ Важные правила сборки

| App | Команда | Зачем |
|-----|---------|-------|
| `apps/site` | `NEXT_STATIC_EXPORT=1 npm run build` | Включает `output: 'export'` → создаёт `/out` для nginx |
| `apps/site-admin` | `npm run build` | Обычная Next.js сборка |
| `apps/saas` | `NEXT_PUBLIC_BASE_PATH=/app npm run build` | Static export с base path |
| `apps/internal` | `npm run build` | Всегда static export (хардкод в next.config) |

> **Никогда не использовать `npm run build` из корня** — turbo падает с ошибкой `Missing packageManager field`.
