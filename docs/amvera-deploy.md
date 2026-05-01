# Деплой Rocketmind на Amvera

Монорепо на 5 контейнеров. Все 5 проектов смотрят в один и тот же
GitHub-репозиторий `Rocketmindone/rocketmind`. Различаются Dockerfile
(один — корневой универсальный, другой — апп-специфичный) и ENV.

## Два варианта настройки

### Вариант A — apps/<app>/Dockerfile (предпочтительный)

Если в Amvera **UI проекта** есть возможность указать путь к Dockerfile
(или `amvera.yaml` поддерживает per-project override), используем
готовые апп-специфичные Dockerfile-ы:

| Проект Amvera | Dockerfile path |
|--------------|----------------|
| site         | `apps/site/Dockerfile` |
| site-admin   | `apps/site-admin/Dockerfile` |
| design-system| `apps/design-system/Dockerfile` |
| saas         | `apps/saas/Dockerfile` |
| internal     | `apps/internal/Dockerfile` |

Минимальный, чистый Dockerfile под каждый апп. Build context = корень
репо (для `COPY . .` в Dockerfile).

### Вариант Б — корневой универсальный Dockerfile (fallback)

Если Amvera видит только корневой `Dockerfile` (не позволяет указать
путь), используем универсальный root-Dockerfile с диспетчером. Все 5
проектов используют один и тот же `Dockerfile`, но передают разный
**build arg `APP_NAME`**.

**В Amvera UI проекта:**
- Build args: `APP_NAME=<имя>` (одно из: `site`, `site-admin`,
  `design-system`, `saas`, `internal`)
- Для `internal` ещё 8 Firebase build args (см. ниже).

Логика выбора апп при билде — в `Dockerfile`.
Логика выбора стартовой команды при запуске — в `docker/dispatcher.sh`.

---

## Переменные окружения

### Build args (на этапе сборки образа)

**internal** (все 8 — обязательны):
```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=...
NEXT_PUBLIC_FIREBASE_DATABASE_URL=...
```

**Только для варианта Б:** в каждом проекте задать `APP_NAME=<имя>`.

### Runtime ENV (на этапе старта контейнера)

**site:**
```
DATABASE_URL=postgresql://user:pass@host:5432/dbname
```

**site-admin:**
```
DATABASE_URL=postgresql://user:pass@host:5432/dbname
JWT_SECRET=<64+ символов случайной строки, openssl rand -hex 32>
ADMIN_INITIAL_PASSWORD=<пароль первого админа, нужен только для seed>

# S3 (Yandex Object Storage или совместимый):
S3_ENDPOINT=https://storage.yandexcloud.net
S3_REGION=ru-central1
S3_BUCKET=rocketmind-uploads
S3_ACCESS_KEY=...
S3_SECRET_KEY=...
S3_PUBLIC_URL_BASE=https://storage.yandexcloud.net/rocketmind-uploads
```

**design-system, saas, internal:** runtime ENV не нужны (статика).

---

## Postgres

site и site-admin делят один PostgreSQL. На Amvera поднимается **Managed
Postgres** (не наш контейнер) — Amvera выдаст `DATABASE_URL`.

При первом старте `apps/site` контейнер запустит `prisma migrate deploy`
(см. `apps/site/docker/entrypoint.sh`) — создаст таблицы по миграции
`apps/site/prisma/migrations/20260501000000_init/migration.sql`.

После того как таблицы созданы, нужно один раз запустить seed-скрипт
`scripts/seed-from-markdown.ts` чтобы наполнить БД из markdown-файлов в
`apps/site/content/`. Команда:

```bash
DATABASE_URL=<production-url> ADMIN_INITIAL_PASSWORD=<пароль> \
  npx tsx scripts/seed-from-markdown.ts
```

Можно запустить локально с production DATABASE_URL — нужно только чтобы
Postgres был доступен снаружи.

---

## Volume для site-admin

site-admin сохраняет загруженные файлы в `/data/uploads/` (volume mount
на Amvera). Том должен быть persistent. URL картинок строится как
`https://<cms-домен>/uploads/<path>` и сохраняется в БД, поэтому site
читает картинки напрямую с CMS-домена.

(Альтернатива — S3, см. ENV выше; код site-admin поддерживает оба
варианта через `S3_*` переменные.)

---

## Webhook

GitHub Fine-grained PAT с правами:
- `Contents: Read-only`
- `Metadata: Read-only`
- `Webhooks: Read and write`

Один токен на 5 проектов (все смотрят в один репо). При push в `main`
все 5 проектов получают webhook → пересборка.
