# Локальный dev-стек (Docker)

Изолированная копия prod-окружения для отладки админки и сайта **без
дёрганья Amvera/Ивана**. Postgres + admin + site в одной docker-сети,
hot reload работает, данные пишутся в `./.docker-data/` (git-ignored).

## Что внутри

- **postgres** (`postgres:16-alpine`) — на хост-порту `5433` (5432 не занимаем).
- **admin** (`apps/site-admin`) — на `http://localhost:3004`.
- **site** (`apps/site`) — на `http://localhost:3001`.

Оба Next.js контейнера запускают `npm run dev` поверх bind-mounted
кода — правки в IDE подхватываются автоматически.

## Первый запуск

```bash
npm run docker:up:build
```

Что произойдёт:
1. Билдится один общий dev-образ `rocketmind-dev:latest` (`docker/dev/Dockerfile.dev`) — `npm install`, сборка `@rocketmind/ui`, `prisma generate`.
2. Стартует Postgres, ждёт healthcheck.
3. Стартует admin: `prisma migrate deploy` → `node scripts/seed-admin.mjs` (создаёт юзера `admin` / `admin123`) → `next dev`.
4. Стартует site: `next dev`.

Готовность ~30-90 сек на первом запуске (npm install внутри контейнера),
далее `docker:up` поднимает всё за 5 секунд.

## Логин в админку

Открыть http://localhost:3004/login

- **Login:** `admin`  (хардкод в `auth-context.tsx`)
- **Password:** `admin123`

(Можно переопределить через env `SEED_ADMIN_PASSWORD` в `docker-compose.dev.yml`.)

## Команды

| Команда | Что делает |
|---------|-----------|
| `npm run docker:up` | Поднять стек (без rebuild) |
| `npm run docker:up:build` | Поднять с пересборкой образа |
| `npm run docker:down` | Остановить контейнеры (данные сохранятся) |
| `npm run docker:reset` | **Полный сброс**: контейнеры + Postgres volume + `.docker-data/` |
| `npm run docker:logs` | Стримить логи всех сервисов |
| `npm run docker:logs:admin` | Только admin |
| `npm run docker:logs:site` | Только site |
| `npm run docker:psql` | Открыть `psql` к локальной БД |

## Когда нужен rebuild

`docker:up:build` (а не `docker:up`) обязательно если:
- Поменялся `package.json` любого workspace (новые/обновлённые npm-зависимости).
- Изменилась Prisma-схема (`apps/site/prisma/schema.prisma`).
- Изменился `Dockerfile.dev`.

Изменения в **коде** (apps/*, packages/*) подхватываются hot-reload'ом — rebuild не нужен.

## Структура файлов

```
docker-compose.dev.yml          # main compose
docker/dev/Dockerfile.dev       # один образ для admin и site
scripts/seed-admin.mjs          # сидит дефолтного юзера в БД
.docker-data/                   # uploads + config (gitignored)
  ├─ uploads/                   # картинки/видео из админки
  └─ config/                    # JSON-конфиги (about-rocketmind, partnerships, ...)
```

## Зачем это всё

Раньше отладка серверной ошибки в админке требовала:
1. Запушить → Amvera пересобрать (5-15 мин).
2. Попросить Ивана посмотреть логи (синхронно).
3. Понять причину → запушить фикс → ждать ещё 15 мин.

Локально:
1. Поправить → Next подхватил → попробовать.
2. Если 500 — стектрейс прямо в `docker:logs:admin`.
3. Поправить → Next подхватил → проверить.

Цикл: 30 секунд вместо 30 минут.

## Troubleshooting

**`port is already allocated` на `5433`/`3001`/`3004`** — занят другим процессом, отбей или поменяй порт в `docker-compose.dev.yml`.

**`Prisma Client is not generated`** — забыли `--build` после изменения схемы. Запусти `docker:up:build`.

**`bcrypt: invalid ELF`** — установился macOS-binary вместо linux. `docker:reset` + `docker:up:build`.

**Картинки 404** — БД пустая, в страницах нет ссылок на загруженные файлы. Загрузи через админку — попадут в `./.docker-data/uploads/`.

**Нужен дамп прода** — пока вручную: `pg_dump $PROD_URL | docker compose -f docker-compose.dev.yml exec -T postgres psql -U rm -d rocketmind`. Если будет регулярно нужно — добавлю `npm run docker:seed-from-prod`.
