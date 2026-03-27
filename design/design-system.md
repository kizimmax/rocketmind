# Rocketmind Design System

> Единая дизайн-система для SaaS-сервиса и маркетингового сайта Rocketmind.
> Основана на компонентах **shadcn/ui** + кастомизация под бренд.
> Источник правды для всех экранов: лендинг, авторизация, main app, каталог агентов.
>
> **Version:** 1.5.7 · **Updated:** 2026-03-20

---

## Статус документа

| Блок | Статус |
|------|--------|
| 1. Цветовая палитра | ✅ Готово (v1.3 — 5-level scale + fg tokens + .on-color) |
| 2. Типография | ✅ Готово |
| 3. Spacing & Grid | ✅ Готово |
| 4. Border Radius & Shadows | ✅ Готово |
| 6. Компоненты (Button, Input, Card...) | ✅ Готово |
| 6.1.1 Badge | ✅ Готово |
| 6.1.2 Tabs | ✅ Готово |
| 6.1.3 Checkbox | ✅ Готово |
| 6.1.4 Radio | ✅ Готово |
| 6.1.5 Switch / Тумблер | ✅ Готово |
| 6.1.6 Notes | ✅ Готово |
| 6.3.1 Специализированные карточки | ✅ Готово |
| 6.5 Logo | ✅ Готово |
| 6.6 Header | ✅ Готово |
| 6.7 Footer | ✅ Готово |
| 7. Иконки | ✅ Готово |
| 8. Анимации и motion | ✅ Готово |
| 9. Маркетинг блоки | ✅ Готово |

---

## 1. Цветовая палитра

### Принципы
- Все цвета определяются через CSS-переменные (shadcn-совместимые, HSL).
- Поддержка двух тем: `light` (по умолчанию) и `dark`.
- Единственный акцентный цвет — **жёлтый #FFCC00** (в обеих темах).
- Фиолетовый **#A172F8** — категориальный цвет (графики, теги), не акцент.
- Никаких хардкодных HEX в компонентах — только токены.

---

### 1.1 Брендовые акцентные цвета

#### Жёлтый (Accent)
*Тёплый, активный, символ энергии и ясности. Архетип Мудреца.*

| Токен | Light | Dark | HEX (light) | HEX (dark) |
|-------|-------|------|------------|-----------|
| `--color-yellow-100` | `54 100% 50%` | `54 100% 50%` | `#FFCC00` | `#FFCC00` |
| `--color-yellow-50` | `54 100% 83%` | `54 100% 24%` | `#FFF0AA` | `#7A6200` |
| `--color-yellow-10` | `54 100% 96%` | `54 60% 20%` | `#FFFEF3` | `#3D3300` |

> **Светлая тема:** используются твои исходные значения (#FFCC00, #FFF0AA, #FFFEF3).
> **Тёмная тема:** 100% остаётся ярким (#FFCC00), 50% тёмный насыщенный жёлто-коричневый (#7A6200), 10% уходит в тёмный тон (#3D3300).

#### Фиолетовый (Categorical)
*Символ интуиции, креатива, трансформации. Используется как категориальный цвет в тегах и графиках.*

| Токен | Light | Dark | HEX (light) | HEX (dark) |
|-------|-------|------|------------|-----------|
| `--color-violet-100` | `265 91% 71%` | `265 91% 76%` | `#A172F8` | `#B48DFA` |
| `--color-violet-50` | `265 100% 90%` | `265 60% 40%` | `#DCC8FF` | `#5A3D99` |
| `--color-violet-10` | `265 100% 98%` | `265 40% 18%` | `#FBFAFE` | `#20143D` |

> **Тёмная тема:** 100% чуть светлее для контраста (#B48DFA), 50% уходит в насыщенный тёмно-фиолетовый (#5A3D99), 10% — почти чёрный с фиолетовым оттенком (#20143D).

---

### 1.2 Нейтральная шкала (Gray Scale)

Единая числовая шкала `--rm-gray-{N}` — основа всех нейтральных решений. Каждый уровень несёт конкретную UI-роль. Используй `--rm-gray-{N}` напрямую.

#### Уровни и их роли

| Уровень | CSS-переменная | Light | Dark | Роль |
|---------|---------------|-------|------|------|
| 1 | `--rm-gray-1` | `#F5F5F5` | `#1A1A1A` | Тихая поверхность (badge, инлайн-код, неактивные зоны) |
| 2 | `--rm-gray-2` | `#EBEBEB` | `#242424` | Hover-фон компонентов |
| 3 | `--rm-gray-3` | `#CBCBCB` | `#404040` | Дефолтный бордер — `border`, `input` |
| 4 | `--rm-gray-4` | `#A3A3A3` | `#5C5C5C` | Hover/active бордер |
| fg-sub | `--rm-gray-fg-sub` | `#666666` | `#939393` | Второстепенный текст — `muted-foreground` |
| fg-main | `--rm-gray-fg-main` | `#2D2D2D` | `#F0F0F0` | Основной текст — `foreground` |

#### Gray Alpha (полупрозрачные оверлеи)

Используй вместо `rgba()` в коде — автоматически адаптируются к светлой и тёмной теме.

| Токен | Light | Dark | Применение |
|-------|-------|------|------------|
| `--rm-gray-alpha-100` | `rgba(0,0,0, 0.06)` | `rgba(255,255,255, 0.06)` | Лёгкий тинт (dot-grid, фоны) |
| `--rm-gray-alpha-200` | `rgba(0,0,0, 0.10)` | `rgba(255,255,255, 0.10)` | Разделители на светлых фонах |
| `--rm-gray-alpha-400` | `rgba(0,0,0, 0.20)` | `rgba(255,255,255, 0.20)` | Overlay лёгкий |
| `--rm-gray-alpha-600` | `rgba(0,0,0, 0.40)` | `rgba(255,255,255, 0.40)` | Modal scrim |
| `--rm-gray-alpha-800` | `rgba(0,0,0, 0.70)` | `rgba(255,255,255, 0.70)` | Тяжёлый overlay |

#### shadcn-алиасы на gray scale

| Токен shadcn | Алиас на | Light HEX | Dark HEX | Описание |
|-------------|----------|-----------|----------|----------|
| `background` | — | `#FAFAFA` | `#0A0A0A` | Основной фон страницы |
| `foreground` | `--rm-gray-fg-main` | `#2D2D2D` | `#F0F0F0` | Основной текст |
| `muted-foreground` | `--rm-gray-fg-sub` | `#666666` | `#939393` | Второстепенный текст |
| `border` | `--rm-gray-3` | `#CBCBCB` | `#404040` | Разделители, бордеры |
| `input` | `--rm-gray-3` | `#CBCBCB` | `#404040` | Бордер инпутов |
| `ring` | — | `#FFCC00` | `#FFCC00` | Фокус-кольцо (жёлтый) |
| `card` | — | `#FFFFFF` | `#121212` | Фон карточек |
| `card-foreground` | `--rm-gray-fg-main` | `#2D2D2D` | `#F0F0F0` | Текст в карточках |
| `popover` | — | `#FFFFFF` | `#121212` | Фон поповеров/дропдаунов |
| `popover-foreground` | `--rm-gray-fg-main` | `#2D2D2D` | `#F0F0F0` | Текст в поповерах |
| `destructive` | — | `#ED4843` | `#FF6B6B` | Опасные действия, ошибки |
| `destructive-foreground` | — | `#FFFFFF` | `#FFFFFF` | Текст на destructive |

> **Цветной разделитель** (`--border-on-colored`) — используется только поверх цветных фонов:
> Light: `#7D61B1` (фиолетовый приглушённый), Dark: `#DBC800` (жёлтый приглушённый).

---

### 1.3 Семантические цвета (Primary)

shadcn требует `primary` и `primary-foreground` — маппим на главный акцент:

| Токен shadcn | CSS-переменная | Light | Dark | Описание |
|-------------|---------------|-------|------|----------|
| `primary` | `--primary` | `#FFCC00` | `#FFCC00` | Главный CTA, основные кнопки |
| `primary-foreground` | `--primary-foreground` | `#121212` | `#121212` | Текст на primary (тёмный — для контраста с жёлтым) |

---

### 1.4 Акцентная шкала (5 уровней)

Каждый акцентный и категориальный цвет имеет **5 уровней насыщенности** и **2 foreground-токена**.
Именование: `--rm-{color}-{level}`, `--rm-{color}-fg`, `--rm-{color}-fg-subtle`.

#### Уровни и их роли

| Уровень | CSS-суффикс | Роль |
|---------|------------|------|
| **100** | `-100` | **Solid fill** — filled button, badge filled, иконка-заливка. |
| **300** | `-300` | **Subtle border** — граница chip/тега/карточки в покое. Hover-граница: переход к 100. |
| **500** | `-500` | **Component bg active** — нажатое состояние chip/tab/toggle. |
| **700** | `-700` | **Component bg hover** — наведение на chip/tab/строку таблицы. |
| **900** | `-900` | **Subtle background** — badge ghost, тег, строка таблицы, фон цветной карточки. |
| **fg** | `-fg` | **Текст поверх solid-100 фона** (WCAG AA гарантирован). |
| **fg-subtle** | `-fg-subtle` | **Текст поверх 900/700/500 фона** (WCAG AA гарантирован). |

> **Ключевое правило:** никогда не используй уровень цвета одновременно как фон и как цвет текста поверх него.
> Всегда бери `fg` (на solid) или `fg-subtle` (на tinted фоне).

#### Цветовые шкалы (light / dark)

| Цвет | 100 | 300 | 500 | 700 | 900 | fg | fg-subtle |
|------|-----|-----|-----|-----|-----|----|-----------|
| **Yellow** L | `#FFCC00` | `#FFE066` | `#FFF0AA` | `#FFF4BE` | `#FFF9D9` | `#3D2E00` | `#5C4200` |
| **Yellow** D | `#FFCC00` | `#B38F00` | `#7A6200` | `#4A3C00` | `#3D3300` | `#0A0800` | `#FFE566` |
| **Violet** L | `#A172F8` | `#C4A0FB` | `#DCC8FF` | `#EDE0FF` | `#F7F2FE` | `#fff` | `#3D1A8A` |
| **Violet** D | `#B48DFA` | `#8A5FF5` | `#5A3D99` | `#2E1F66` | `#20143D` | `#0A050F` | `#DCC8FF` |
| **Sky** L | `#56CAEA` | `#8ADCF2` | `#C3ECF7` | `#E0F6FB` | `#EBF9FD` | `#fff` | `#0D4D5C` |
| **Sky** D | `#7AD6EF` | `#3AAACE` | `#1A5F72` | `#0A2D38` | `#051A20` | `#020D10` | `#C3ECF7` |
| **Terracotta** L | `#FE733A` | `#FFA07A` | `#FFD6AD` | `#FFECE0` | `#FFF3EB` | `#fff` | `#5C1A00` |
| **Terracotta** D | `#FF8A5C` | `#CC5522` | `#7A2E10` | `#3D1507` | `#2A0F05` | `#0A0300` | `#FFD6AD` |
| **Pink** L | `#FF54AC` | `#FF8FCA` | `#FFB8D9` | `#FFE0EF` | `#FFECF5` | `#fff` | `#6B0033` |
| **Pink** D | `#FF7EC5` | `#CC3D88` | `#7A1A55` | `#3D0D2A` | `#25061A` | `#0A0208` | `#FFB8D9` |
| **Blue** L | `#4A56DF` | `#8A94EC` | `#BFC4F3` | `#E0E2FA` | `#F2F3FE` | `#fff` | `#0D1466` |
| **Blue** D | `#7A84F0` | `#3D4ACC` | `#1E2870` | `#0D1238` | `#060A24` | `#020310` | `#BFC4F3` |
| **Red** L | `#ED4843` | `#F48A87` | `#FFBCBA` | `#FFE0DF` | `#FFECEB` | `#fff` | `#5C0A08` |
| **Red** D | `#F47370` | `#CC2E2A` | `#7A1715` | `#3D0908` | `#250504` | `#0A0202` | `#FFBCBA` |
| **Green** L | `#9AF576` | `#C0F9A8` | `#D8F4CD` | `#E4F8DC` | `#F0FBEA` | `#1A4A05` | `#1A4A05` |
| **Green** D | `#B5FA97` | `#6ACC44` | `#2A6E15` | `#133808` | `#0A2005` | `#020A01` | `#D8F4CD` |

---

### 1.5 Инвертированные поверхности (`.on-{color}`)

CSS-утилиты для блоков с акцентным фоном. Переопределяют `--foreground`, `--muted-foreground`, `--border` внутри контейнера — все дочерние токены становятся читаемыми автоматически.

```html
<section class="on-yellow rounded-lg px-8 py-10">
  <h2>Заголовок</h2>         <!-- цвет: --rm-yellow-fg -->
  <p>Текст</p>               <!-- цвет: --rm-yellow-fg / 65% -->
  <button class="border ..."> <!-- граница: --rm-yellow-fg / 25% -->
</section>
```

Доступные классы: `.on-yellow`, `.on-violet`, `.on-sky`, `.on-terracotta`, `.on-pink`, `.on-blue`, `.on-red`, `.on-green`.

> `.on-yellow` — основной CTA-блок бренда, hero-секции, highlight-полосы.
> Используй **только один** такой блок на экране. Остальные `.on-*` — для категориальной маркировки секций.

---

### 1.6 CSS-переменные (актуальный globals.css)

> Источник правды — `design-system-docs/src/app/globals.css`. Блок ниже для справки.

```css
:root {
  /* === Gray Scale (Light) ===
   * 2 — subtle surface · 3 — hover bg
   * 4 — default border · 5 — hover border · 6 — secondary text · fg — primary text
  */
  --rm-gray-1:  #F5F5F5;
  --rm-gray-2:  #EBEBEB;
  --rm-gray-3:  #CBCBCB;
  --rm-gray-4:  #A3A3A3;
  --rm-gray-fg-sub:  #666666;
  --rm-gray-fg-main: #2D2D2D;

  /* === Gray Alpha (overlays, tooltips, glass) === */
  --rm-gray-alpha-100: rgba(0,0,0, 0.06);
  --rm-gray-alpha-200: rgba(0,0,0, 0.10);
  --rm-gray-alpha-400: rgba(0,0,0, 0.20);
  --rm-gray-alpha-600: rgba(0,0,0, 0.40);
  --rm-gray-alpha-800: rgba(0,0,0, 0.70);

  /* === shadcn aliases === */
  --background: #FAFAFA;
  --foreground: var(--rm-gray-fg-main);
  --muted-foreground: var(--rm-gray-fg-sub);
  --border: var(--rm-gray-3);
  --input: var(--rm-gray-3);
  --ring: #FFCC00;
  --card: #FFFFFF;
  --card-foreground: var(--rm-gray-fg-main);
  --popover: #FFFFFF;
  --popover-foreground: var(--rm-gray-fg-main);
  --secondary: #121212;
  --secondary-foreground: #FFFFFF;
  --accent-foreground: var(--rm-gray-fg-main);
  --destructive: #ED4843;
  --destructive-foreground: #FFFFFF;
  --primary: #FFCC00;
  --primary-foreground: #121212;

  /* === Brand accents === */
  --rm-yellow-100: #FFCC00;
  --rm-yellow-50:  #FFF0AA;
  --rm-yellow-10:  #FFFEF3;
  --rm-violet-100: #A172F8;
  --rm-violet-50:  #DCC8FF;
  --rm-violet-10:  #FBFAFE;
  --border-on-colored: #7D61B1;

  /* === Categorical colors === */
  --rm-terracotta-100: #FE733A; --rm-terracotta-50: #FFD6AD; --rm-terracotta-10: #FFFAF7;
  --rm-sky-100: #56CAEA;        --rm-sky-50: #C3ECF7;        --rm-sky-10: #F7FDFF;
  --rm-pink-100: #FF54AC;       --rm-pink-50: #FFB8D9;       --rm-pink-10: #FFF8FC;
  --rm-blue-100: #4A56DF;       --rm-blue-50: #BFC4F3;       --rm-blue-10: #F9FAFF;
  --rm-red-100: #ED4843;        --rm-red-50: #FFBCBA;        --rm-red-10: #FFF9F8;
  --rm-green-100: #9AF576;      --rm-green-50: #D8F4CD;      --rm-green-10: #F7FEF3;
}

.dark {
  /* === Gray Scale (Dark) === */
  --rm-gray-1:  #1A1A1A;
  --rm-gray-2:  #242424;
  --rm-gray-3:  #404040;
  --rm-gray-4:  #5C5C5C;
  --rm-gray-fg-sub:  #939393;
  --rm-gray-fg-main: #F0F0F0;

  /* === Gray Alpha (dark) === */
  --rm-gray-alpha-100: rgba(255,255,255, 0.06);
  --rm-gray-alpha-200: rgba(255,255,255, 0.10);
  --rm-gray-alpha-400: rgba(255,255,255, 0.20);
  --rm-gray-alpha-600: rgba(255,255,255, 0.40);
  --rm-gray-alpha-800: rgba(255,255,255, 0.70);

  /* === shadcn aliases === */
  --background: #0A0A0A;
  --foreground: var(--rm-gray-fg-main);
  --muted-foreground: var(--rm-gray-fg-sub);
  --border: var(--rm-gray-3);
  --input: var(--rm-gray-3);
  --ring: #FFCC00;
  --card: #121212;
  --card-foreground: var(--rm-gray-fg-main);
  --popover: #121212;
  --popover-foreground: var(--rm-gray-fg-main);
  --secondary: #FFFFFF;
  --secondary-foreground: #121212;
  --accent-foreground: var(--rm-gray-fg-main);
  --destructive: #FF6B6B;
  --destructive-foreground: #FFFFFF;
  --primary: #FFCC00;
  --primary-foreground: #121212;

  /* === Brand accents (dark) === */
  --rm-yellow-100: #FFCC00; --rm-yellow-50: #7A6200; --rm-yellow-10: #3D3300;
  --rm-violet-100: #A172F8; --rm-violet-50: #5A3D99; --rm-violet-10: #20143D;
  --border-on-colored: #DBC800;

  /* === Categorical colors (dark) === */
  --rm-terracotta-100: #FE733A; --rm-terracotta-50: #7A2E10; --rm-terracotta-10: #2A0F05;
  --rm-sky-100: #56CAEA;        --rm-sky-50: #1A5F72;        --rm-sky-10: #051A20;
  --rm-pink-100: #FF54AC;       --rm-pink-50: #7A1A55;       --rm-pink-10: #25061A;
  --rm-blue-100: #4A56DF;       --rm-blue-50: #1E2870;       --rm-blue-10: #060A24;
  --rm-red-100: #ED4843;        --rm-red-50: #7A1715;        --rm-red-10: #250504;
  --rm-green-100: #9AF576;      --rm-green-50: #2A6E15;      --rm-green-10: #0A2005;
}
```

---

### 1.6 Таблица соответствия: твои цвета → shadcn-токены

| Твоё название | HEX | shadcn-токен | Роль |
|--------------|-----|-------------|------|
| Фон светлый | `#FAFAFA` | `--background` | Фон страниц |
| Фон тёмный | `#0A0A0A` | `--background` (dark) | Фон страниц (dark) |
| Основной текст | `#2D2D2D` | `--foreground` | Основной текст |
| Основной текст dark | `#F0F0F0` | `--foreground` (dark) | Основной текст (dark) |
| Второстепенный текст | `#666666` | `--muted-foreground` | Подписи, плейсхолдеры |
| Второстепенный dark | `#939393` | `--muted-foreground` (dark) | Подписи (dark) |
| Разделители | `#CBCBCB` | `--border` / `--input` | Линии, бордеры инпутов |
| Разделители dark | `#404040` | `--border` / `--input` (dark) | Линии (dark) |
| Акцент | `#FFCC00` | `--ring`, `--primary` | Фокус-кольцо, главные кнопки, CTA |
| Фиолетовый | `#A172F8` | `--color-violet-100` | Категориальный цвет (теги, графики) |

---

---

## 2. Типография

### Принципы
- **4 шрифта** с чёткими ролями — не смешивать без причины.
- **Размерная шкала** построена на золотом сечении (φ = 1.618) от минимума `12px`.
- **4 категории стилей**: Heading, Label, Copy, Accent.
- **Shadcn-совместимость** — все размеры маппируются на Tailwind-классы или кастомные CSS-переменные.
- Никаких произвольных размеров вне шкалы.

---

### 2.1 Шрифты

| Шрифт | Роль | Начертание | Характер |
|-------|------|-----------|---------|
| **Roboto Condensed** (All Caps) | Заголовки всех уровней (H1–H4) | Bold / ExtraBold, uppercase | Сдержанный, технологичный, уверенный |
| **Loos Condensed** (All Caps) | Навигация, кнопки, технические обозначения, числовые данные | Medium / SemiBold, uppercase | Инженерный, упорядоченный |
| **Roboto** | Основной текст, описания, body | Regular / Medium | Читабельный, нейтральный, открытый диалог |
| **Roboto Mono** | Code, caption, технические подписи | Regular | Моноширинный, системный, точный |
| **Shantell Sans** | Подписи в стикерах, акцентные подписи, эмоциональные вставки | Regular | Рукописный, динамичный, акцентирующий внимание |

> **Подключение:** Google Fonts: `Roboto Condensed` (400, 700, 800), `Roboto` (400, 500), `Roboto Mono` (400), `Shantell Sans` (400). Локальный шрифт: `Loos Condensed` (OTF, Medium) — `/fonts/LoosCond-Medium.otf`.

---

### 2.2 Размерная шкала (Золотое сечение от 12px)

**Принцип построения:** минимальный размер — `12px`. Каждый следующий ключевой шаг × φ (1.618). Промежуточные через √φ (1.272) для fine-tuning.

```
12px → 19px → 31px → 50px → 81px
  ↑ промежуточные (√φ ≈ 1.272): 15px, 25px, 39px, 64px
```

Полная шкала с маппингом:

| Шаг | px | rem | CSS-переменная | Роль |
|-----|----|-----|---------------|------|
| `12` | `12` | `0.75rem` | `--text-12` | Минимальный: micro, копирайт, tiny label |
| `14` | `14` | `0.875rem` | `--text-14` | Captions, label-sm, code inline |
| `16` | `16` | `1rem` | `--text-16` | Основной body, nav-label |
| `18` | `18` | `1.125rem` | `--text-18` | label-18, H4 mobile |
| `19` | `19` | `1.1875rem` | `--text-19` | Lead-body, крупный copy |
| `24` | `24` | `1.5rem` | `--text-24` | H4, H3 mobile |
| `25` | `25` | `1.5625rem` | `--text-25` | Marketing copy |
| `30` | `30` | `1.875rem` | `--text-30` | H2 mobile |
| `32` | `32` | `2rem` | `--text-32` | H3 |
| `40` | `40` | `2.5rem` | `--text-40` | H1 mobile |
| `52` | `52` | `3.25rem` | `--text-52` | H2 |
| `80` | `80` | `5rem` | `--text-80` | H1 Hero, главный экранный заголовок |

---

### 2.3 Четыре категории стилей

Все текстовые стили делятся на **4 смысловые категории**:

#### Heading — заголовки и дисплейный текст
Roboto Condensed, uppercase. Используются для страниц, секций, Hero-блоков.

| Токен | px desktop | px mobile | Вес | Line-height | Letter-spacing | Применение |
|-------|-----------|---------|----|------------|---------------|-----------|
| `heading-80` | 80 | 40 | 800 ExtraBold | 1.0 | -0.02em | H1 Hero |
| `heading-52` | 52 | 30 | 700 Bold | 1.05 | -0.02em | H2, заголовки страниц |
| `heading-32` | 32 | 24 | 700 Bold | 1.1 | -0.015em | H3, подзаголовки секций |
| `heading-24` | 24 | 18 | 700 Bold | 1.2 | -0.01em | H4, заголовки карточек |

**CSS-классы:** `.heading-80`, `.heading-52`, `.heading-32`, `.heading-24` — определены в `packages/ui/src/styles/globals.css`. Автоматически применяют мобильный размер на `< 768px` и десктопный на `≥ 768px`. Включают font-family, font-weight, line-height, letter-spacing и text-transform.

#### Label — однострочные UI-элементы
Loos Condensed, uppercase. Кнопки, навигация, теги, числовые данные. **Только однострочный текст.**

| Токен | px | Вес | Line-height | Letter-spacing | Применение |
|-------|----|-----|------------|---------------|-----------|
| `label-18` | 18 | 500 Medium | 1.2 | 0.03em | Маркетинговые акценты, hero-теги, крупные badges |
| `label-16` | 16 | 500 Medium | 1.28 | 0.04em | Nav-items, primary button |
| `label-14` | 14 | 500 Medium | 1.24 | 0.04em | Secondary button, tag, badge |
| `label-12` | 12 | 500 Medium | 1.2 | 0.04em | Tiny button в input-field |

#### Copy — многострочный текст
Roboto, normal case. Описания и body. Повышенный line-height для комфортного чтения.

| Токен | px | Вес | Line-height | Letter-spacing | Применение |
|-------|----|-----|------------|---------------|-----------|
| `copy-24` | 24 | 400 Regular | 1.32 | 0 | Маркетинговый крупный текст, hero-субтайтл |
| `copy-18` | 18 | 400 Regular | 1.32 | 0 | Lead / intro paragraph |
| `copy-16` | 16 | 400 Regular | 1.32 | 0 | **Body** — основной текст |
| `copy-16-strong` | 16 | 500 Medium | 1.618 | 0 | Body strong, акцент в тексте |
| `caption-14` | 14 | 400 Regular | 1.4 | 0.01em | Caption, подпись, служебная поясняющая строка |
| `code-14` | 14 | 400 Regular | 1.4 | 0.02em | Inline code, технические строки |
| `copy-12` | 12 | 400 Regular | 1.4 | 0.02em | Micro, copyright, служебный текст |

#### Правило для DS Web: token-spec и поясняющий текст
- Все токены, CSS-переменные, class-name и технические значения в `design-system-docs` показываются только на `Roboto Mono` (`--font-caption-family`).
- Визуальная форма токена всегда одна: bordered chip с `border: --border`, фоном `bg-card` или `--rm-gray-1`, без `Loos Condensed`.
- Колонки `Описание`, `Когда использовать`, `Правило`, а также поясняющие подписи в showcase-блоках набираются только `Copy` (`Roboto`) или `Caption` (`Roboto Mono`) по смыслу.
- `Loos Condensed` допускается только для однострочных UI-label: кнопки, навигация, badge/tag, табы и другие интерактивные control-лейблы.

#### Accent — эмоциональные вставки
Shantell Sans, normal case. Только для стикеров, акцентных подписей, emotional highlights.

| Токен | px | Вес | Line-height | Letter-spacing | Применение |
|-------|----|-----|------------|---------------|-----------|
| `accent-16` | 16 | 400 Regular | 1.4 | 0 | Подписи к иллюстрациям, стикеры |
| `accent-14` | 14 | 400 Regular | 1.4 | 0 | Микро-акценты, эмоциональные теги |

---

### 2.4 Line-height шкала

Базовый line-height body = **1.618** (φ):

| Токен | Значение | Расчёт | Применение |
|-------|---------|--------|-----------|
| `--leading-none` | `1.0` | — | Hero H1, дисплейные заголовки |
| `--leading-tight` | `1.05` | — | H1 |
| `--leading-snug` | `1.1` | — | H2 |
| `--leading-normal` | `1.2` | — | H3 |
| `--leading-relaxed` | `1.3` | √φ | H4, lead |
| `--leading-copy` | `1.5` | — | Small, captions, label |
| `--leading-body` | `1.618` | **φ** | Основной body текст |

---

### 2.5 CSS-переменные (globals.css)

```css
@layer base {
  :root {
    /* === Шрифтовые семьи === */
    --font-heading: 'Roboto Condensed', sans-serif;
    --font-mono: 'Loos Condensed', sans-serif;
    --font-caption: 'Roboto Mono', monospace;
    --font-body: 'Roboto', sans-serif;
    --font-accent: 'Shantell Sans', cursive;

    /* === Размерная шкала === */
    --text-12: 0.75rem;     /* 12px */
    --text-14: 0.875rem;    /* 14px */
    --text-16: 1rem;        /* 16px */
    --text-18: 1.125rem;    /* 18px — label-18, H4 mobile */
    --text-19: 1.1875rem;   /* 19px — lead, copy */
    --text-24: 1.5rem;      /* 24px — H4 */
    --text-25: 1.5625rem;   /* 25px — marketing copy */
    --text-30: 1.875rem;    /* 30px — H2 mobile */
    --text-32: 2rem;        /* 32px — H3 */
    --text-40: 2.5rem;      /* 40px — H1 mobile */
    --text-52: 3.25rem;     /* 52px — H2 */
    --text-80: 5rem;        /* 80px — H1 hero */

    /* === Line-height шкала === */
    --leading-none:    1;
    --leading-tight:   1.05;
    --leading-snug:    1.1;
    --leading-normal:  1.2;
    --leading-relaxed: 1.3;
    --leading-copy:    1.5;
    --leading-body:    1.618;

    /* === Letter-spacing === */
    --tracking-tight:  -0.02em;
    --tracking-normal: 0;
    --tracking-wide:   0.01em;
    --tracking-wider:  0.06em;
    --tracking-widest: 0.08em;
  }
}
```

---

### 2.6 Tailwind config (расширение для кастомных размеров)

```js
// tailwind.config.js
theme: {
  extend: {
    fontFamily: {
      heading: ['Roboto Condensed', 'sans-serif'],
      mono: ['Loos Condensed', 'sans-serif'],
      caption: ['Roboto Mono', 'monospace'],
      body: ['Roboto', 'sans-serif'],
      accent: ['Shantell Sans', 'cursive'],
    },
    fontSize: {
      // Размерная шкала
      '12': ['0.75rem',    { lineHeight: '1.4' }],   // micro
      '14': ['0.875rem',   { lineHeight: '1.5' }],   // caption / label-sm
      '16': ['1rem',       { lineHeight: '1.618' }], // body base
      '18': ['1.125rem',   { lineHeight: '1.2' }],   // label-18, H4 mobile
      '19': ['1.1875rem',  { lineHeight: '1.5' }],   // lead / copy
      '24': ['1.5rem',     { lineHeight: '1.2' }],   // H4
      '25': ['1.5625rem',  { lineHeight: '1.32' }],  // marketing copy
      '30': ['1.875rem',   { lineHeight: '1.05' }],  // H2 mobile
      '32': ['2rem',       { lineHeight: '1.1' }],   // H3
      '40': ['2.5rem',     { lineHeight: '1.0' }],   // H1 mobile
      '52': ['3.25rem',    { lineHeight: '1.05' }],  // H2
      '80': ['5rem',       { lineHeight: '1.0' }],   // H1 hero
    },
  },
}
```

---

---

## 3. Spacing & Grid

### Принципы
- **Базовый модуль — 8px.** Все внутренние отступы (padding, gap, margin) кратны 8.
- **Модуль сетки страницы — 20px.** Внешние отступы, разделение блоков и секций кратны 20.
- **Золотое сечение (φ = 1.618)** — опционально задаёт асимметрию макетных пропорций. Создаёт ощущение роста и движения вместо статичной симметрии.
- Никаких произвольных отступов вне шкал.

---

### 3.1 Базовая spacing-шкала (модуль 8px)

Используется для всех внутренних отступов компонентов: padding, gap, margin.

| Токен | px | rem | Tailwind | Применение |
|-------|----|-----|---------|-----------|
| `--space-1` | `4` | `0.25rem` | `p-1` | Микро-отступы внутри элементов (иконка + текст) |
| `--space-2` | `8` | `0.5rem` | `p-2` | **Базовый модуль.** Минимальный padding кнопки, gap в inline-группе |
| `--space-3` | `12` | `0.75rem` | `p-3` | Padding small-компонентов (badge, chip, tag) |
| `--space-4` | `16` | `1rem` | `p-4` | Стандартный padding кнопок, input, card header |
| `--space-5` | `20` | `1.25rem` | `p-5` | **Модуль сетки.** Минимальный отступ блоков, gap колонок |
| `--space-6` | `24` | `1.5rem` | `p-6` | Padding карточек, sidebar секций |
| `--space-8` | `32` | `2rem` | `p-8` | Padding крупных card, внутренние отступы панелей |
| `--space-10` | `40` | `2.5rem` | `p-10` | Отступы между компонентами внутри секции |
| `--space-12` | `48` | `3rem` | `p-12` | Вертикальный padding секций на мобайле |
| `--space-16` | `64` | `4rem` | `p-16` | Вертикальный padding секций на desktop |
| `--space-20` | `80` | `5rem` | `p-20` | Крупные отступы между секциями страницы |
| `--space-24` | `96` | `6rem` | `p-24` | Hero-секция, максимальный вертикальный ритм |

> `4px` (half-unit) допустим только для точной подгонки внутри компонентов. Не использовать как структурный отступ.

---

### 3.2 Сетка страницы (модуль 20px)

Сетка задаёт ритм на уровне секций и макета. Все структурные отступы кратны 20.

#### Контейнеры

| Контекст | Max-width | Горизонтальный padding | Применение |
|---------|-----------|----------------------|-----------|
| Mobile | `100%` | `20px` | Все экраны до 768px |
| Tablet | `768px` | `40px` | 768–1024px |
| Desktop | `1280px` | `80px` | 1024–1440px |
| Wide | `1440px` | `120px` | 1440px+ |

#### Колоночная сетка

| Брейкпоинт | Колонок | Gutter | Margin |
|-----------|--------|--------|--------|
| Mobile (`< 768px`) | `4` | `0px` | `20px` |
| Tablet (`768–1024px`) | `8` | `0px` | `40px` |
| Desktop (`1024–1440px`) | `12` | `0px` | `80px` |
| Wide (`> 1440px`) | `12` | `0px` | `120px` |

#### Вертикальный ритм секций

Отступы между секциями кратны 20 и масштабируются по брейкпоинтам:

| Уровень | Mobile | Desktop | Применение |
|---------|--------|---------|-----------|
| `--section-gap-sm` | `40px` | `60px` | Между подсекциями, блоками внутри секции |
| `--section-gap-md` | `60px` | `100px` | Стандартный разрыв между секциями |
| `--section-gap-lg` | `80px` | `140px` | Крупные структурные разрывы (Hero → Features) |
| `--section-gap-xl` | `100px` | `200px` | Максимальный разрыв (перед Footer) |

---

### 3.3 Макетные пропорции (Золотое сечение) — опционально

Асимметрия вместо равных долей. Применяется там, где это усиливает визуальную динамику.

**Принцип:** деление пространства не `50/50`, а `38/62` (≈ 1/φ и 1/φ²) или `62/38`.

#### Типовые пропорции макета

| Контекст | Меньшая часть | Большая часть | Соотношение |
|---------|-------------|--------------|------------|
| Sidebar / Рабочая область (SaaS app) | `~260px` | `~420px+` | ≈ 38 / 62 |
| Текст / Визуал в hero-блоке | `38%` | `62%` | 1 : φ |
| Лид-колонка / контент-колонка | `5 кол.` | `7 кол.` | ≈ 1 : 1.4 |
| Карточка: заголовок / body | `38%` высоты | `62%` высоты | 1 : φ |
| Блок с иллюстрацией слева | `4 кол.` | `8 кол.` | 1 : 2 (ближайший к φ² в 12-кол. сетке) |

> **Правило применения:** пропорция задаётся на уровне макета секции/экрана, не на уровне padding отдельного компонента. Компоненты всегда используют базовую шкалу (кратно 8).

#### Sidebar SaaS-приложения (конкретный пример)

12-колоночная сетка, desktop 1280px с gutter 0px:

```
Sidebar:   3 колонки = ~240px   (18.75% ширины)
Content:   9 колонок = ~960px+  (75% ширины)
Отношение: 1 : 3.8  — намеренно не φ, но sidebar «легче» контента
```

> Sidebar визуально уступает рабочей области — пользователь смотрит вправо. Это поддерживает фокус на чате.

#### Асимметрия в блоках сайта

На лендинге и страницах сайта блоки намеренно нарушают симметрию:

- **Текст + иллюстрация:** не 6+6 колонок, а `5+7` или `4+8`.
- **Feature-карточки:** не равная 3-колонка, а чередование крупной + мелкой.
- **Цитата / Pull-quote:** смещена от центра в золотое сечение строки.
- **Padding секций:** верхний отступ ≠ нижнему (например `60px top / 100px bottom`) — блок «стремится вниз».

---

### 3.4 Брейкпоинты

Совпадают с Tailwind-дефолтом для совместимости:

| Токен | px | Tailwind | Контекст |
|-------|-----|---------|---------|
| `sm` | `640` | `sm:` | Крупный мобайл / малый планшет |
| `md` | `768` | `md:` | Планшет |
| `lg` | `1024` | `lg:` | Ноутбук |
| `xl` | `1280` | `xl:` | Стандартный desktop |
| `2xl` | `1440` | `2xl:` | Wide desktop |

---

### 3.5 CSS-переменные (globals.css)

```css
@layer base {
  :root {
    /* === Spacing (модуль 8px) === */
    --space-1:  0.25rem;   /* 4px */
    --space-2:  0.5rem;    /* 8px  — базовый модуль */
    --space-3:  0.75rem;   /* 12px */
    --space-4:  1rem;      /* 16px */
    --space-5:  1.25rem;   /* 20px — модуль сетки */
    --space-6:  1.5rem;    /* 24px */
    --space-8:  2rem;      /* 32px */
    --space-10: 2.5rem;    /* 40px */
    --space-12: 3rem;      /* 48px */
    --space-16: 4rem;      /* 64px */
    --space-20: 5rem;      /* 80px */
    --space-24: 6rem;      /* 96px */

    /* === Контейнеры === */
    --container-padding-mobile:  1.25rem;  /* 20px */
    --container-padding-tablet:  2.5rem;   /* 40px */
    --container-padding-desktop: 5rem;     /* 80px */
    --container-padding-wide:    7.5rem;   /* 120px */
    --container-max-width:       90rem;    /* 1440px */

    /* === Вертикальный ритм секций === */
    --section-gap-sm:  2.5rem;   /* 40px mobile / 60px desktop */
    --section-gap-md:  3.75rem;  /* 60px mobile / 100px desktop */
    --section-gap-lg:  5rem;     /* 80px mobile / 140px desktop */
    --section-gap-xl:  6.25rem;  /* 100px mobile / 200px desktop */

    /* === Макетные пропорции (φ) === */
    --ratio-minor: 38%;    /* меньшая часть золотого сечения */
    --ratio-major: 62%;    /* большая часть золотого сечения */
  }
}
```

---

### 3.6 Tailwind config (spacing-расширение)

```js
// tailwind.config.js
theme: {
  extend: {
    spacing: {
      // Базовая шкала Tailwind покрывает всё кратное 4px — не переопределяем.
      // Кастомные токены сетки:
      '13': '3.25rem',  // 52px (промежуточный)
      '15': '3.75rem',  // 60px — section-gap-sm desktop
      '18': '4.5rem',   // 72px
      '22': '5.5rem',   // 88px
      '25': '6.25rem',  // 100px — section-gap-xl mobile
      '35': '8.75rem',  // 140px — section-gap-lg desktop
      '50': '12.5rem',  // 200px — section-gap-xl desktop
    },
    maxWidth: {
      'container': '90rem',   // 1440px
      'content':   '80rem',   // 1280px
    },
  },
}
```

---

### 3.7 Сетка как визуальный стиль

**Принцип:** сетка — часть дизайн-кода. Направляющие линии между колонками — не декор, а материализация структуры и логики, на которых держится весь визуальный язык.

#### Механика

Вместо CSS `gap` между колонками — реальные **1px CSS-колонки**. Для `cols=3`:

```
grid-template-columns: 1fr 1px 1fr 1px 1fr
                        col1  G  col2  G  col3
```

- **Нечётные** CSS-колонки (1, 3, 5…) — ячейки контента.
- **Чётные** CSS-колонки (2, 4…) — направляющие (1px шириной).
- `guideVisible` управляет видимостью без изменения раскладки.

#### Компонент `GridGuides`

```tsx
import { GridGuides } from "@/components/ui/guide-grid"

<GridGuides
  cols={3}              // количество колонок контента
  guideVisible={true}   // показывать направляющие
  guideColor="rgba(0,0,0,0.07)"  // цвет направляющих
  cellPadding={12}      // внутренний отступ ячейки (px)
  rowGap={0}            // вертикальный отступ между строками (px)
>
  <Card>…</Card>
  <Card>…</Card>
  <Card>…</Card>
</GridGuides>
```

#### Два режима

| Контекст | `guideVisible` | Поведение |
|----------|---------------|-----------|
| **Лендинг / маркетинг** | `true` | Направляющие видны как часть визуального языка. Структура читается через линии. |
| **SaaS-интерфейс** | `false` | Те же 1px-колонки, но прозрачны. Раскладка идентична — меняется только вид. |
| **Тёмный фон** | `true`, `guideColor="rgba(255,255,255,0.08)"` | Светлые направляющие на тёмном фоне. |

#### Поведение ячеек

- Каждая ячейка — обёртка с `display: grid`, что обеспечивает **равную высоту** всех карточек в строке (`align-self: stretch`).
- `cellPadding` задаёт визуальный gap между карточками (вместо CSS `gap`).
- Количество строк вычисляется автоматически: `Math.ceil(items / cols)`.

#### Правила применения

1. На лендинге и маркетинговых страницах — `guideVisible={true}`. Направляющие усиливают ощущение технологичной архитектуры.
2. В SaaS-интерфейсе — `guideVisible={false}`. Чистая сетка без визуального шума.
3. `cellPadding` подчиняется базовому модулю 8px: `8`, `12`, `16`.
4. `guideColor` использует только допустимые цвета из палитры с прозрачностью.

---

### 3.8 Bento Grid (нерегулярная сетка карточек)

**Источник:** Dark Bento Grid (Dribbble).
**Суть:** секция «возможностей/функций» как мозаика карточек разных размеров. Каждая ячейка — отдельная история с реальным превью UI внутри.

**Правила применения:**
- Используется как секция Features / «Что умеет сервис» на лендинге
- Минимум 4, максимум 6 ячеек
- Ячейки **разного размера** — нет одинаковых рядов (принцип асимметрии φ)
- Внутри каждой: иконка (outline, 16px) в верхнем левом углу + заголовок + 2-3 строки описания + **реальный UI-скриншот** или мокап (не иллюстрация)
- Вторичный CTA: `See More →` — plain текст со стрелкой, без кнопки
- Центральная ячейка (самая крупная) — только заголовок без описания, смена темпа
- Бордеры ячеек: `1px solid rgba(255,255,255,0.06)` — почти невидимые
- Фон ячеек на `1–2` ступени светлее/темнее фона секции, без явного контраста

**Типовая раскладка (desktop, 12 колонок):**
```
[ 6 кол. — Функция A ] [ 6 кол. — Функция B ]
[ 4 кол. — Функция C ] [ 8 кол. — ЦЕНТРАЛЬНАЯ ]
[ 5 кол. — Функция D ] [ 7 кол. — Функция E  ]
```

---

## 4. Border Radius & Shadows

### Принципы
- **Стиль — flat.** Никаких box-shadow для создания глубины или имитации материальности.
- **Border radius — small.** Лёгкое скругление для мягкости без закруглённости «bubble»-стиля.
- **Акцентное свечение** — единственный допустимый вид эффекта. Только для интерактивных состояний (focus, hover CTA, active) и только акцентными цветами (#FFCC00, #A172F8).

---

### 4.1 Border Radius

Шкала минимальная — small-first. Базовый модуль скругления — `4px`, без промежуточного лишнего шага.

| Токен | px | rem | Tailwind | Применение |
|-------|-----|-----|---------|-----------|
| `--radius-none` | `0` | `0` | `rounded-none` | **Column**, секции-обёртки, крупные layout-контейнеры; разделители, таблицы, code-блоки |
| `--radius-sm` | `4` | `0.25rem` | `rounded-sm` | **Button, Input, Select, Dropdown**, badge, tag, tooltip, kbd |
| `--radius-lg` | `8` | `0.5rem` | `rounded-lg` | **Card**, панели, Sidebar, Modal, Popover |
| `--radius-xl` | `12` | `0.75rem` | `rounded-xl` | Крупные карточки, preview-блоки |
| `--radius-full` | `9999` | `624.9375rem` | `rounded-full` | Аватары, pill-badges, toggle |

#### Наглядные сценарии применения

| Радиус | Когда использовать | Наглядный пример |
|--------|--------------------|------------------|
| `--radius-none` / `rounded-none` | Самые крупные layout-контейнеры (column), внутри которых уже лежат карточки и заголовки | Section, column-обёртка, hero-блок, full-width panel |
| `--radius-sm` / `rounded-sm` | Мелкие controls и интерактивные элементы | Button, Input, Select, Dropdown, Badge, Tooltip |
| `--radius-lg` / `rounded-lg` | Контейнеры контента и самостоятельные поверхности | Card, Modal, Panel, Sidebar, Toast |
| `--radius-full` / `rounded-full` | Только отдельные pill / circular-элементы | Avatar, counter, standalone label |

#### Правило выбора

1. Если элемент — крупная column-обёртка, секция или layout-контейнер, внутри которого уже лежат карточки и заголовки, это `0px`.
2. Если элемент нажимается, вводит данные или является частью control-group, почти всегда это `4px`.
3. Если элемент является поверхностью и содержит контент внутри, почти всегда это `8px`.
4. `rounded-full` не используется для обычных кнопок, инпутов, карточек и таблиц.

#### Копирование в DS web

- Кнопка `Token` копирует CSS token: `--radius-none`, `--radius-sm`, `--radius-lg`, `--radius-full`
- Кнопка `Tailwind` копирует utility-класс: `rounded-none`, `rounded-sm`, `rounded-lg`, `rounded-full`
- Визуальный пример не должен быть единственным источником для копирования значения

---

### 4.2 Shadows — Flat стиль

**Тени отключены.** Глубина и иерархия передаются через:
- цвет фона (`--card` vs `--background`)
- бордеры (`--border`)
- spacing (отступы создают визуальное разделение)

```css
/* Глобальный сброс теней для всех shadcn-компонентов */
--shadow-sm:  none;
--shadow:     none;
--shadow-md:  none;
--shadow-lg:  none;
--shadow-xl:  none;
--shadow-2xl: none;
```

---

### 4.3 CSS-переменные (globals.css)

```css
@layer base {
  :root {
    /* === Border Radius === */
    --radius-none: 0;
    --radius-sm:   0.25rem;    /* 4px */
    --radius:      0.25rem;    /* 4px — базовый */
    --radius-lg:   0.5rem;     /* 8px */
    --radius-xl:   0.75rem;    /* 12px */
    --radius-full: 624.9375rem;

    /* === Shadows (flat) === */
    --shadow-sm:  none;
    --shadow:     none;
    --shadow-md:  none;
    --shadow-lg:  none;
    --shadow-xl:  none;
    --shadow-2xl: none;

  }
}
```

---

### 4.5 Tailwind config

```js
// tailwind.config.js
theme: {
  extend: {
    borderRadius: {
      'none': '0',
      'sm':   '0.25rem',   // 4px
      DEFAULT: '0.25rem',  // 4px — базовый
      'lg':   '0.5rem',    // 8px
      'xl':   '0.75rem',   // 12px
      'full': '624.9375rem',
    },
    boxShadow: {
      'none':   'none',
      // Переопределяем все стандартные тени в none
      'sm':     'none',
      DEFAULT:  'none',
      'md':     'none',
      'lg':     'none',
      'xl':     'none',
      '2xl':    'none',
    },
  },
}
```

---

---

## 6. Компоненты

Все компоненты — надстройка над shadcn/ui. Переопределяются только токены и классы, структура shadcn не трогается. Каждый компонент описан через: варианты → размеры → состояния → токены → CSS/Tailwind.

**Общие правила для всех компонентов:**
- Шрифт интерактивных элементов (кнопки, nav, теги) — Loos Condensed, uppercase, `letter-spacing: 0.04em`
- Flat-стиль — никаких теней, глубина через бордер и цвет фона
- Свечений нет — flat-стиль без glow-эффектов
- Radius кнопок и инпутов `4px` (`--radius-sm`), pill-форм нет

---

### 6.1 Button

#### Варианты

| Вариант | Роль | Когда использовать |
|---------|------|-------------------|
| `primary` | Главный CTA | Одна кнопка на экране/секции. «Попробовать», «Начать», «Отправить» |
| `secondary` | Вторичный CTA | Рядом с primary или как самостоятельное второстепенное действие |
| `ghost` | Третичный / quiet-CTA | Использует прежний нейтральный filled-style: серый фон, border и foreground-text без инверсии по теме |
| `destructive` | Опасное действие | Удаление, архивация. Всегда с подтверждением |
| `outline` | Нейтральный | Фильтры, чипы-выборы, состояния on/off |

#### Размеры

| Размер | Height | Padding H | Font | Tailwind | Применение |
|--------|--------|-----------|------|---------|-----------|
| `xs` | `28px` | `12px` | `12px` (`label-12`, `--text-12`) | `h-7 px-3` | Compact-действие внутри карточек, pricing, inline |
| `sm` | `32px` | `12px` | `12px` (`label-12`, `--text-12`) | `h-8 px-3` | Inline-действия, compact UI (sidebar, теги) |
| `md` *(default)* | `40px` | `16px` | `14px` (`label-14`, `--text-14`) | `h-10 px-4` | Основной размер — формы, карточки |
| `lg` | `48px` | `24px` | `16px` (`label-16`, `--text-16`) | `h-12 px-6` | Hero CTA, главные призывы к действию |
| `icon` | `40px` | `0` / `10px` | — | `h-10 w-10` | Квадратная кнопка с иконкой, без текста |

> Вариант (`btn-primary` и т.д.) и размер — ортогональные оси: вариант определяет стиль, размер — контекст (hero → lg, форма → md, compact UI → sm, pricing-карточки → xs). Размеры шрифта привязаны к стилям `label-12/14/16` из раздела 2.2 Типографика.

#### Состояния

| Состояние | Primary | Secondary | Ghost |
|-----------|---------|-----------|-------|
| `default` | bg `#FFCC00`, text `#121212` | light: bg `#121212`, text `#FFFFFF`; dark: bg `#FFFFFF`, text `#121212` | bg `--rm-gray-1`, border `--border`, text `--foreground` |
| `hover` | bg `#FFE040` (–10% яркости) | opacity `0.88` | bg `--rm-gray-2` |
| `active` | bg `#E6B800` (–20%) | opacity `0.76` | bg `--rm-gray-3` |
| `focus` | outline: `--ring` | outline: `--ring` | outline: `--ring` |
| `disabled` | opacity `0.4`, cursor not-allowed | opacity `0.4` | opacity `0.4` |
| `loading` | Spinner вместо текста, opacity `0.8` | Spinner | Spinner |

#### Tailwind-классы (базовый button)

```tsx
// primary / md
className="
  inline-flex items-center justify-center gap-2
  h-10 px-4
  rounded-sm
  bg-[#FFCC00] text-[#121212]
  font-mono text-[13px] uppercase tracking-[0.08em]
  transition-all duration-150
  hover:bg-[#FFE040]
  focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring
  active:bg-[#E6B800]
  disabled:opacity-40 disabled:pointer-events-none
"

// secondary / md
className="
  inline-flex items-center justify-center gap-2
  h-10 px-4
  rounded-sm border border-transparent
  bg-secondary text-secondary-foreground
  font-mono text-[13px] uppercase tracking-[0.08em]
  transition-all duration-150
  hover:opacity-[0.88] active:opacity-[0.76]
  focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring
  disabled:opacity-40 disabled:pointer-events-none
"

// ghost / md
className="
  inline-flex items-center justify-center gap-2
  h-10 px-4
  rounded-sm border border-border
  bg-[var(--rm-gray-1)] text-foreground
  font-mono text-[13px] uppercase tracking-[0.08em]
  transition-all duration-150
  hover:bg-[var(--rm-gray-2)] active:bg-[var(--rm-gray-3)]
  focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring
  disabled:opacity-40 disabled:pointer-events-none
"
```

#### Вариант `interactive` (dot-fill hover)

Используется для главного CTA на акцентном фоне (on-yellow). При наведении маленький кружок расширяется и заполняет всю кнопку (`scale-[1.8]`), одновременно текст уезжает вправо, а иконка + текст появляются из правой стороны.

Реализован как переиспользуемый компонент: `components/ui/interactive-hover-button.tsx`.

```tsx
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button"

// Использование
<InteractiveHoverButton text="Попробовать" />

// Кастомная иконка
<InteractiveHoverButton text="Запустить" icon={<Rocket size={14} />} />
```

```tsx
// Внутренняя структура компонента
<button className="group relative cursor-pointer overflow-hidden rounded-sm border border-border bg-transparent font-mono text-[13px] uppercase tracking-[0.08em]">
  {/* Текст по умолчанию — уезжает вправо */}
  <span className="... transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
    {text}
  </span>

  {/* Иконка + текст — появляются из правой стороны */}
  <div className="absolute ... translate-x-12 opacity-0 transition-all duration-300 group-hover:-translate-x-1 group-hover:opacity-100"
    style={{ color: "var(--rm-yellow-100)" }}>
    {icon}
    <span>{text}</span>
  </div>

  {/* Расширяющийся кружок */}
  <div className="absolute left-[20%] top-[40%] h-2 w-2 rounded-sm transition-all duration-300
    group-hover:left-[0%] group-hover:top-[0%] group-hover:h-full group-hover:w-full group-hover:scale-[1.8]"
    style={{ backgroundColor: "var(--foreground)" }}
  />
</button>
```

**Правила:** `duration-300` — намеренно медленнее для театрального эффекта. Иконка = тематическая (по умолчанию `Coffee`). Один на странице. Кружок использует `var(--foreground)`, текст внутри — `var(--rm-yellow-100)` (брендовый жёлтый).

---

### 6.1.1 Badge

Лейбл для маркировки статусов, категорий, тегов и мета-информации. Реализован поверх shadcn/ui `Badge` с заменой вариантов на токены Rocketmind.

**Шрифт:** Loos Latin, Cyrillic Condensed-Medium (`--font-mono-family`), uppercase, `letter-spacing: 0.04em` (`label-12/14` из раздела 2.2).
**Форма:** `rounded-sm` (4px, `--radius-sm`) — flat-стиль, без pill-форм.
**Стиль:** flat, без теней, без glow.

#### Варианты

| Вариант | Фон | Цвет текста | Применение |
|---------|-----|------------|-----------|
| `neutral` | `--rm-gray-1` + `border: --border` | `--rm-gray-fg-sub` | Статус по умолчанию, нейтральная метка |
| `{color}-subtle` | `--rm-{color}-900` + `border: --rm-{color}-700` | `--rm-{color}-fg-subtle` | Цветовая категоризация, статусные акценты без перегруза, фоновые теги |

Доступные цвета для `{color}-subtle`: `yellow`, `violet`, `sky`, `terracotta`, `pink`, `blue`, `red`, `green`.

> **Правило выбора:** `neutral` — единственный нейтральный filled-стиль для вспомогательной мета-информации и архивных состояний. Все цветные бейджи использовать в стиле `subtle`, без отдельного `solid`-набора в дизайн-системе.

#### Размеры

| Размер | Высота | Шрифт | Tailwind | Применение |
|--------|--------|-------|---------|-----------|
| `sm` | `20px` | `12px` (`label-12`) | `h-5` | Компактные теги в карточках, inline-мета |
| `md` *(default)* | `24px` | `12px` (`label-12`) | `h-6` | Основной размер — сайдбары, списки, таблицы |
| `lg` | `28px` | `14px` (`label-14`) | `h-7` | Маркетинговые акценты, hero-теги |

#### Tailwind-классы (базовый badge)

```tsx
// neutral / md
<Badge variant="neutral">статус</Badge>

// subtle / md
<Badge variant="green-subtle">активен</Badge>
<Badge variant="yellow-subtle">новый</Badge>
<Badge variant="red-subtle">ошибка</Badge>
<Badge variant="violet-subtle">категория</Badge>

// lg
<Badge variant="sky-subtle" size="lg">продвинутый</Badge>
```

```tsx
// Внутренняя структура
<span className="
  inline-flex items-center gap-1
  h-6 px-2
  rounded-sm
  border-[var(--rm-violet-700)]
  bg-[var(--rm-violet-900)] text-[var(--rm-violet-fg-subtle)]
  font-[family-name:var(--font-mono-family)] text-[12px] uppercase tracking-[0.04em]
  whitespace-nowrap transition-all
">
  Новый
</span>
```

#### Правила использования

- Никаких произвольных цветов — только токены из таблицы выше.
- Бейдж не несёт действия (не кнопка) — для кликабельных тегов использовать `Button outline xs`.
- Максимум 3 бейджа в одной строке карточки.
- Рядом с текстом выравнивать через `items-center` в flex-контейнере.

---

### 6.1.2 Tabs

Компонент для переключения соседних панелей контента без смены экрана. `Default` подходит для равноправных наборов данных, `secondary` для тихой локальной навигации.

**Ключевые сценарии:** `Default`, `Disabled`, `Disable specific tabs`, `With icons`, `Secondary`.

#### Когда использовать

- Переключение соседних наборов данных: `Все / Активные / Архив`
- Локальная навигация внутри карточки, кейса или панели агента
- Линейные сценарии, где часть шагов ещё недоступна, но должна быть видимой

> **Не использовать** для перехода между полноценными страницами и длинными маршрутами. Для этого есть sidebar / header navigation.

#### Варианты

| Вариант | Контейнер | Активное состояние | Применение |
|---------|-----------|--------------------|-----------|
| `default` | `bg: --rm-gray-1`, `border: --border`, `rounded-sm`, `p-1` | `bg: --background`, `border: --border`, `text: --foreground` | Сегментированные переключатели равноправных наборов данных |
| `secondary` | `bg: transparent`, `border-bottom: --border`, без общей подложки | `text: --foreground` + underline `--rm-yellow-100` | Тихая локальная навигация внутри выбранной сущности |

#### Размеры

| Часть | Высота | Шрифт | Tailwind | Примечание |
|------|--------|-------|---------|-----------|
| `TabsList default` | `40px` | — | `min-h-10` | Контейнер segmented tabs |
| `TabsTrigger` | `32px` | `label-12` | `h-8 px-3` | Основной размер для всех вкладок |
| `TabsList secondary` | `40px` | — | `h-10` | Нижняя линия контейнера вместо подложки |

#### Состояния

| Состояние | Токены | Описание |
|-----------|--------|----------|
| `default` | `text: --muted-foreground` | Неактивная вкладка видима, но не конкурирует с контентом |
| `hover` | `bg: --rm-gray-2`, `text: --foreground` | Hover только на trigger, без тени и glow |
| `active / default` | `bg: --background`, `border: --border`, `text: --foreground` | Активный сегмент читается как вложенная surface |
| `active / secondary` | `text: --foreground`, underline `--rm-yellow-100` | Тихий индикатор текущей вкладки |
| `focus-visible` | `border: --ring` + outer ring 3px / 50% | Повторяет общую focus-логику controls Rocketmind |
| `disabled` | `opacity: 0.4`, `pointer-events: none` | Вкладка остаётся видимой в структуре, но недоступна |

#### Анатомия

```text
Tabs.Root
├── Tabs.List                ← default или secondary контейнер
│   ├── Tabs.Trigger         ← label, optional icon, states
│   ├── Tabs.Trigger
│   └── Tabs.Trigger
└── Tabs.Content             ← surface panel: bg-card + border-border + rounded-lg
```

#### Tailwind-классы

```tsx
// TabsList / default
className="
  inline-flex min-h-10 w-fit items-center gap-1
  rounded-sm border border-border
  bg-[var(--rm-gray-1)] p-1
"

// TabsList / secondary
className="
  inline-flex h-10 w-fit items-center gap-1
  border-b border-border
  bg-transparent p-0 rounded-none
"

// TabsTrigger
className="
  inline-flex h-8 items-center justify-center gap-1.5 px-3
  rounded-sm border border-transparent
  text-[length:var(--text-12)]
  font-[family-name:var(--font-mono-family)]
  uppercase tracking-[0.08em]
  text-muted-foreground
  transition-[color,background-color,border-color,opacity] duration-150
  hover:bg-[var(--rm-gray-2)] hover:text-foreground
  data-active:bg-background data-active:border-border data-active:text-foreground
  focus-visible:outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50
  disabled:opacity-40 disabled:pointer-events-none
"
```

#### Примеры

```tsx
// Default
<Tabs defaultValue="all">
  <TabsList>
    <TabsTrigger value="all">Все</TabsTrigger>
    <TabsTrigger value="active">Активные</TabsTrigger>
    <TabsTrigger value="archive">Архив</TabsTrigger>
  </TabsList>
  <TabsContent value="all">...</TabsContent>
</Tabs>

// Disable specific tabs
<Tabs defaultValue="brief">
  <TabsList>
    <TabsTrigger value="brief">Brief</TabsTrigger>
    <TabsTrigger value="analysis">Analysis</TabsTrigger>
    <TabsTrigger value="payment" disabled>Payment</TabsTrigger>
  </TabsList>
</Tabs>

// With icons
<Tabs defaultValue="agents">
  <TabsList>
    <TabsTrigger value="agents"><Rocket size={14} /> Agents</TabsTrigger>
    <TabsTrigger value="search"><Search size={14} /> Search</TabsTrigger>
    <TabsTrigger value="academy"><BookOpen size={14} /> Academy</TabsTrigger>
  </TabsList>
</Tabs>

// Secondary
<Tabs defaultValue="overview">
  <TabsList variant="secondary">
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="activity">Activity</TabsTrigger>
    <TabsTrigger value="files">Files</TabsTrigger>
  </TabsList>
</Tabs>
```

#### Правила использования

- Label вкладки: 1–2 слова. Если название длиннее, использовать sidebar или segmented filter другого типа.
- Иконка всегда вторична и наследует цвет текста — никаких отдельных accent-цветов.
- В `default` все вкладки равноправны. В `secondary` активная вкладка не превращается в filled-chip.
- Disabled-вкладки не скрывать, если они помогают объяснить структуру шага или сценария.
- Panel после переключения остаётся обычной surface-поверхностью: `bg-card`, `border-border`, `rounded-lg`.

---

### 6.1.3 Checkbox

Компонент для независимого бинарного выбора: включить / выключить, согласен / не согласен, показывать / скрывать. Основа: 16×16 control, общий focus-visible и один акцент для checked и indeterminate.

**Ключевые состояния:** `Default`, `Disabled`, `Disabled Checked`, `Disabled Indeterminate`, `Indeterminate`.

#### Когда использовать

- Независимый yes/no-выбор внутри формы, фильтра или таблицы
- Согласия и подтверждения: политика, уведомления, способ показа результата
- Master-checkbox для bulk-операций по списку

> **Не использовать** там, где пользователь должен выбрать ровно один вариант из нескольких. Для этого есть `Radio`.

#### Размер и форма

| Параметр | Значение | Токен |
|----------|----------|-------|
| Размер control | `16px × 16px` | фиксированный |
| Radius | `4px` | `--radius-sm` |
| Border default | `1px solid --border` | `--border` |
| Background default | `--rm-gray-1` | `--rm-gray-1` |

#### Состояния

| Состояние | Токены | Описание |
|-----------|--------|----------|
| `default` | `border: --border`, `bg: --rm-gray-1` | Нейтральный control в покое |
| `checked` | `border: --rm-yellow-100`, `bg: --rm-yellow-100`, icon `--rm-yellow-fg` | Подтверждённый выбор |
| `indeterminate` | те же токены, что `checked`, иконка `Minus` | Частичный выбор в master-checkbox |
| `focus-visible` | `border: --ring` + outer ring 3px / 50% | Повторяет общий keyboard-focus для controls |
| `disabled` | `opacity: 0.4`, `cursor: not-allowed` | Контроль виден, но недоступен |
| `disabled checked` | `checked` + `disabled` | Недоступный, но уже зафиксированный выбор |
| `disabled indeterminate` | `indeterminate` + `disabled` | Частичный выбор в заблокированном состоянии |

#### Tailwind-классы

```tsx
// Checkbox control
className="
  peer size-4 shrink-0 appearance-none
  rounded-sm border border-border bg-rm-gray-1
  transition-[background-color,border-color,opacity] duration-150
  outline-none
  checked:border-[var(--rm-yellow-100)] checked:bg-[var(--rm-yellow-100)]
  focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50
  disabled:opacity-40 disabled:cursor-not-allowed
"
```

#### Примеры

```tsx
// Default
<label className="flex items-start gap-3">
  <Checkbox />
  <span>Согласен с политикой обработки данных</span>
</label>

// Checked
<label className="flex items-start gap-3">
  <Checkbox defaultChecked />
  <span>Получать обновления по кейсу</span>
</label>

// Indeterminate
<label className="flex items-center gap-3">
  <Checkbox indeterminate readOnly />
  <span>Выбрано 2 из 5 кейсов</span>
</label>
```

#### Правила использования

- `Indeterminate` разрешён только у master-checkbox, который управляет дочерним списком.
- Разница между `checked` и `indeterminate` читается через пиктограмму, а не через отдельный цвет.
- Если checkbox юридически или продуктово важен, рядом обязательно есть короткое пояснение последствия выбора.
- Не добавлять отдельный hover-эффект: у Rocketmind checkbox живёт как тихий control без декоративной анимации.

---

### 6.1.4 Radio

Компонент для выбора одного варианта из группы. Основа: 16×16 control, один активный выбор и headless-композиция внутри строки.

**Ключевые сценарии:** `Default`, `Disabled`, `Required`, `Headless`, `Standalone`.

#### Когда использовать

- Выбор одного маршрута запуска: `автозапуск` или `сначала бриф`
- Выбор одного канала ответа, тарифа, способа авторизации
- Headless-строки выбора, где radio встроен в карточку или строку списка

> **Не использовать** для множественного выбора. Для этого есть `Checkbox`.

#### Размер и форма

| Параметр | Значение | Токен |
|----------|----------|-------|
| Размер control | `16px × 16px` | фиксированный |
| Форма | `rounded-full` | `--radius-full` |
| Border default | `1px solid --border` | `--border` |
| Dot active | `8px`, `bg: --rm-yellow-100` | `--rm-yellow-100` |

#### Состояния

| Состояние | Токены | Описание |
|-----------|--------|----------|
| `default` | `border: --border`, `bg: --rm-gray-1` | Нейтральный вариант в группе |
| `checked` | `border: --rm-yellow-100`, inner dot `--rm-yellow-100`, bg `--background` | Активный вариант |
| `focus-visible` | `border: --ring` + outer ring 3px / 50% | Общий keyboard-focus Rocketmind |
| `disabled` | `opacity: 0.4`, `cursor: not-allowed` | Вариант виден, но недоступен |
| `required` | отдельного визуального стиля нет | Обязательность задаётся логикой формы и текстом |
| `headless` | тот же control внутри `bg-card` / `border-border` строки | Большая зона выбора без нового control-стиля |
| `standalone` | только radio + однострочный label | Плотные списки и компактные настройки |

#### Tailwind-классы

```tsx
// Radio control
className="
  peer size-4 shrink-0 appearance-none
  rounded-full border border-border bg-rm-gray-1
  transition-[background-color,border-color,opacity] duration-150
  outline-none
  checked:border-[var(--rm-yellow-100)] checked:bg-background
  focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50
  disabled:opacity-40 disabled:cursor-not-allowed
"
```

#### Примеры

```tsx
// Default group
<fieldset className="space-y-3">
  <label className="flex items-start gap-3">
    <Radio name="launch-mode" defaultChecked />
    <span>Запускать агента сразу</span>
  </label>
  <label className="flex items-start gap-3">
    <Radio name="launch-mode" />
    <span>Сначала собрать бриф</span>
  </label>
</fieldset>

// Headless row
<label className="block rounded-lg border border-border bg-card p-4">
  <div className="flex items-start gap-3">
    <Radio name="route" />
    <span>Подобрать AI-агента</span>
  </div>
</label>

// Standalone
<label className="flex items-center gap-3">
  <Radio name="channel" defaultChecked />
  <span>Отправить ответ в текущий чат</span>
</label>
```

#### Правила использования

- В одной группе может быть выбран только один вариант; все radio внутри группы делят один `name`.
- `Required` не получает отдельный цвет или бейдж. Обязательность объясняем текстом или валидацией формы.
- Headless-строка может использовать только существующие surface-токены: `bg-card`, `border-border`, при выборе допустим мягкий accent-фон `900`-уровня.
- Если вариант недоступен, оставляем его видимым disabled, когда это помогает объяснить структуру сценария.

---

### 6.1.5 Switch / Тумблер

Бинарный on/off для немедленного применения настроек. Squircle-форма (`rounded-sm`, 4px) — как у всех контролов DS.

> **Не использовать** для юридических согласий (→ Checkbox) и выбора из группы (→ Radio).

#### Размеры

| Вариант | Rail | Thumb | Применение |
|---------|------|-------|-----------|
| `default` | `36 × 20px` | `16 × 16px` | Строки настроек, формы |
| `sm` | `28 × 16px` | `12 × 12px` | Toolbar, compact inline-строки |

#### Состояния

| Состояние | Rail | Thumb |
|-----------|------|-------|
| `unchecked` | `border-border`, `bg-rm-gray-1` | `bg-foreground` |
| `checked` | `border / bg: --rm-yellow-100` | `bg: --rm-yellow-fg` |
| `focus-visible` | `border-ring` + ring 3px / 50% | — |
| `disabled` | `opacity-40`, `cursor-not-allowed` | — |

#### Tailwind-классы

```tsx
// Rail
  rounded-sm border border-border bg-rm-gray-1 p-[1px]
  data-[size=default]:h-5 data-[size=default]:w-9
  data-[size=sm]:h-4 data-[size=sm]:w-7
  data-checked:border-[var(--rm-yellow-100)] data-checked:bg-[var(--rm-yellow-100)]

// Thumb
  rounded-sm bg-foreground
  group-data-[size=default]/switch:size-4
  group-data-[size=sm]/switch:size-3
  group-data-checked/switch:bg-[var(--rm-yellow-fg)]
```

#### Композиция

Основной паттерн — full-width row: label слева, switch справа. Tooltip и иконка — внешняя обёртка строки, не внутри rail.

#### Text switch / Icon switch

Сегментированный переключатель из двух пунктов (по референсу Geist Switch). Реализуется через существующий `Tabs` с двумя `TabsTrigger`, без нового компонента. Стилизация идентична default Tabs: `rounded-sm`, `border-border`, `bg-rm-gray-1`, active = `bg-background`.

```tsx
// Text switch
<Tabs defaultValue="yearly">
  <TabsList>
    <TabsTrigger value="monthly">Monthly</TabsTrigger>
    <TabsTrigger value="yearly">Yearly</TabsTrigger>
  </TabsList>
</Tabs>

// Icon switch
<Tabs defaultValue="light">
  <TabsList>
    <TabsTrigger value="light"><Sun size={16} /></TabsTrigger>
    <TabsTrigger value="dark"><Moon size={16} /></TabsTrigger>
  </TabsList>
</Tabs>
```

---

### 6.1.6 Notes

Постоянные сервисные сообщения внутри экрана: подсказки, предупреждения, подтверждения и локальные CTA. Используют только operational-состояния и существующие status/surface-токены.

**Ключевые сценарии:** `Default`, `Action`, `Success`, `Warning`, `Error`, `Disabled`, `Labels`.

**Что не добавляем:** новые декоративные цвета. Note не должен конкурировать с badge и маркетинговыми акцентами.

#### Когда использовать

- Постоянный контекст внутри карточки, кейса, формы или модального окна
- Подтверждение завершённого шага, которое должно оставаться на экране
- Предупреждение о риске, ограничении или следующем обязательном действии
- Локальный CTA, который исправляет или завершает конкретное сообщение

> **Не использовать** вместо toast, если сообщение краткоживущее и не должно занимать место в лейауте после действия.

#### Варианты

| Вариант | Токены | Применение |
|---------|--------|-----------|
| `neutral` | `border: --border`, `bg: --card` или `--rm-gray-1`, `text: --foreground` | Нейтральное пояснение, help-copy, meta-комментарий |
| `info` | `blue 300 / 900 / fg-subtle` или `blue 100 / fg` | Операционный контекст: sync, импорт, системная подсказка |
| `success` | `green 300 / 900 / fg-subtle` или `green 100 / fg` | Успешное завершение шага, подтверждение оплаты, сохранения |
| `warning` | `yellow 300 / 900 / fg-subtle` или `yellow 100 / fg` | Внимание без блокировки: задержка, неполные данные, ограничение |
| `error` | `red 300 / 900 / fg-subtle` или `red 100 / fg` | Блокирующая проблема, ошибка интеграции, некорректный slug |
| `action` | та же поверхность, что `neutral` + один CTA `Button sm` | Сервисное сообщение с прямым следующим действием |

#### Режимы плотности

| Режим | Токены | Когда использовать |
|------|--------|-------------------|
| `soft` *(default)* | subtle-background (`900`) + border (`300`) для статусных, `bg-card` + `border` для neutral | Основной режим: note не спорит с карточками и формами |
| `filled` | solid-background (`100`) + `fg` | Усиленный режим, когда note должен считываться быстрее соседних surfaces |

#### Состояния

| Состояние | Описание |
|-----------|---------|
| `default` | Note читается как обычная flat-surface без тени и glow |
| `filled` | Та же семантика, но фон становится `100`-уровнем статусной палитры |
| `action` | Справа один CTA размера `sm`; само сообщение остаётся нейтральным |
| `disabled` | `opacity: 0.4`, `pointer-events: none` — блок видим в структуре, но временно недоступен |
| `eyebrow` | По умолчанию сверху может стоять короткий текстовый подзаголовок |
| `custom-eyebrow` | Подзаголовок можно заменить сценарием: `sync`, `payment`, `onboarding` |
| `no-eyebrow` | Убираем подзаголовок только там, где контекст уже задаётся заголовком секции |

#### Анатомия

```text
Note
├── icon (16px, currentColor)
├── optional eyebrow (text 12, uppercase, mono)
├── title
├── description
└── optional action (Button sm, max 1)
```

#### Tailwind / структура

```tsx
// Base
className="
  rounded-lg border p-4
  transition-[border-color,background-color,color,opacity] duration-150
"

// info / soft
className="
  border-[var(--rm-blue-300)]
  bg-[var(--rm-blue-900)]
  text-[var(--rm-blue-fg-subtle)]
"

// success / filled
className="
  border-[var(--rm-green-100)]
  bg-[var(--rm-green-100)]
  text-[var(--rm-green-fg)]
"

// disabled
className="
  opacity-40 pointer-events-none
"
```

#### Примеры

```tsx
// Neutral
<Note variant="neutral">
  <NoteEyebrow>Нейтральное пояснение</NoteEyebrow>
  <NoteTitle>Сначала соберите факты по кейсу</NoteTitle>
  <NoteDescription>
    Используй neutral-note, когда сообщение должно помогать, но не конкурировать с главным CTA.
  </NoteDescription>
</Note>

// Action
<Note variant="action">
  <NoteEyebrow>Следующий шаг</NoteEyebrow>
  <NoteTitle>Подключите оплату, чтобы завершать кейс автоматически</NoteTitle>
  <NoteDescription>CTA живёт внутри note только тогда, когда действие напрямую относится к сообщению.</NoteDescription>
  <Button size="sm" variant="outline">Подключить</Button>
</Note>

// Warning / filled
<Note variant="warning" tone="filled">
  <NoteTitle>Ответ ИИ может занять до 2 минут</NoteTitle>
  <NoteDescription>
    Filled warning уместен перед долгой операцией, если пользователь должен скорректировать ожидание.
  </NoteDescription>
</Note>
```

#### Правила использования

- Note нужен для постоянного контекста внутри текущего экрана. Для краткоживущего фидбэка использовать `Toast`.
- Не добавлять новые декоративные цвета. Разрешены только `neutral`, `info`, `success`, `warning`, `error`, `action`.
- CTA внутри note — максимум один, размер `sm`, всегда связан с текстом сообщения.
- Внутри note не использовать badge-лейблы. Если нужен дополнительный смысловой слой, ставить короткий текстовый подзаголовок.
- Иконка опциональна, размер `16px`, цвет всегда наследуется от текста note.
- Note остаётся flat-компонентом: без shadow, без glow, без кастомных ring-утилит поверх токенов Rocketmind.

---

### 6.1.6 Table

Семантическая HTML-таблица для плотных сравнимых данных: кейсы, платежи, документы, usage-отчёты, списки файлов. Таблица собирается на существующих surface, border, badge и control-токенах без отдельного декоративного стиля.

**Ключевые паттерны:** `Basic table`, `Striped table`, `Bordered table`, `Interactive table`, `Full featured table`, `Large dataset`.

#### Когда использовать

- Когда строки повторяют одну и ту же структуру колонок и пользователь реально сравнивает значения по вертикали
- Для bulk-операций: выбрать кейсы, документы, платежи
- Для финансовых, временных и статусных списков, где важны числовые колонки и summary

> **Не использовать** таблицу, если каждая строка превращается в карточку с длинным текстом, несколькими CTA и произвольной высотой. В таком случае нужен list/card pattern.

#### Базовая анатомия

```text
Table
├── thead
│   └── tr
│       └── th × N
├── tbody
│   └── tr × N
│       └── td × N
└── optional tfoot
    └── tr
        └── td × N
```

#### Состояния и паттерны

| Паттерн | Rocketmind | Правило |
|------|-------------|---------|
| `Базовая таблица` | `base` | `bg-card`, `border-border`, header на `--rm-gray-1`, текст заголовков `text-muted-foreground` |
| `Полосы` | `striped` | Чередование `bg-card` / `--rm-gray-1` только для длинных однотипных списков |
| `Вертикальные разделители` | `bordered` | Вертикальные разделители = `--border`, без inset/shadow |
| `Hover / selection` | `interactive / selectable` | Hover строки = `--rm-gray-2`, selected = `--rm-yellow-900` + border `--rm-yellow-300` |
| `Операционная таблица` | `operational table` | Таблица собирается из уже существующих `Badge`, `Checkbox`, `Button`, `Note` |
| `Большой набор данных` | `large dataset / progressive reveal` | В MVP стиль тот же; для длинных наборов используем `Show more` или пагинацию, а не новый визуальный режим |

#### Токены

| Слой | Токены | Применение |
|------|--------|-----------|
| Контейнер | `bg-card`, `border-border`, `rounded-lg` | Любая таблица Rocketmind |
| Header row | `bg --rm-gray-1`, `text-muted-foreground` | Тихая шапка без конкуренции с данными |
| Hover row | `bg --rm-gray-2` | Наведение на интерактивную строку |
| Selected row | `bg --rm-yellow-900`, `border --rm-yellow-300`, `text --rm-yellow-fg-subtle` | Bulk-выбор или активная строка |
| Numeric cells | `--font-caption-family` | Суммы, id, usage, даты-коды |
| Status cell | существующие `Badge` subtle-варианты | Семантика статуса без ручной окраски текста |

#### Размеры и ритм

| Элемент | Значение |
|--------|----------|
| Высота header | `40px` |
| Padding header | `16px` по горизонтали |
| Padding body cell | `12px 16px` |
| Типографика header | `--font-mono-family`, `--text-12`, uppercase, `tracking: 0.08em` |
| Типографика body | `--text-14` |

#### Tailwind / структура

```tsx
// Base table
<table className="w-full border-collapse bg-card">
  <thead>
    <tr className="bg-[var(--rm-gray-1)]">
      <th className="h-10 px-4 text-left border-b border-border font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">
        Кейс
      </th>
    </tr>
  </thead>
  <tbody>
    <tr className="transition-colors duration-150 hover:bg-[var(--rm-gray-2)]">
      <td className="px-4 py-3 border-b border-border text-foreground">
        Аудит воронки продаж
      </td>
    </tr>
  </tbody>
</table>

// Selected row
<tr className="bg-[var(--rm-yellow-900)]">
  <td className="px-4 py-3 border-b border-[var(--rm-yellow-300)] text-foreground">
    ...
  </td>
</tr>
```

#### Примеры

```tsx
// Basic
<div className="rounded-lg border border-border overflow-hidden">
  <table className="w-full bg-card">
    <thead>
      <tr className="bg-[var(--rm-gray-1)]">
        <th className="h-10 px-4 text-left border-b border-border font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">Агент</th>
        <th className="h-10 px-4 text-left border-b border-border font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">Статус</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td className="px-4 py-3 border-b border-border">Маркетолог</td>
        <td className="px-4 py-3 border-b border-border"><Badge variant="green-subtle">Активен</Badge></td>
      </tr>
    </tbody>
  </table>
</div>

// Striped
<tbody>
  <tr className="bg-card">...</tr>
  <tr className="bg-[var(--rm-gray-1)]">...</tr>
</tbody>

// Interactive + bulk select
<tr className="transition-colors duration-150 hover:bg-[var(--rm-gray-2)] data-[selected=true]:bg-[var(--rm-yellow-900)]">
  <td className="px-4 py-3 border-b border-border"><Checkbox /></td>
  <td className="px-4 py-3 border-b border-border">Кейс</td>
</tr>
```

#### Правила использования

- Таблица живёт на flat-surface: никаких теней, glow и кастомных ring вокруг всей таблицы.
- Header всегда quieter, чем данные. Не красить шапку акцентными цветами.
- `Striped` использовать только на длинных плотных списках; если данных мало, достаточно обычных row dividers.
- `Selected` и `hover` не должны конфликтовать: selected определяется цветом фона `900` и бордером `300`, hover остаётся серым.
- Для статусов внутри ячеек использовать существующие `Badge`. Не вводить новые цветовые правила специально для таблиц.
- `Virtualized` в нашей ДС фиксируется как поведение large dataset, а не как отдельный декоративный вариант компонента.

---

### 6.2 Input

Используется в: авторизация (email, code), чат (поле ввода сообщения), поиск в каталоге агентов, фильтры.

#### Варианты

| Вариант | Применение |
|---------|-----------|
| `default` | Стандартное текстовое поле (email, имя, поиск) |
| `code` | Поле ввода 6-значного кода авторизации. Моноширинный шрифт, крупный |
| `search` | С иконкой лупы слева, очищающей кнопкой справа |

#### Размеры

Размеры идентичны кнопкам по высоте и padding H — инпуты и кнопки можно ставить в одну строку без подгонки.

| Размер | Height | Padding H | Font | Tailwind | Применение |
|--------|--------|-----------|------|---------|-----------|
| `xs` | `28px` | `12px` | `12px` (`--text-12`) | `h-7 px-3` | Compact-поля в плотном UI (фильтры, inline-формы) |
| `sm` | `32px` | `12px` | `12px` (`--text-12`) | `h-8 px-3` | Вторичные поля, compact UI |
| `md` *(default)* | `40px` | `16px` | `14px` (`--text-14`) | `h-10 px-4` | Основной размер — формы, авторизация |
| `lg` | `48px` | `24px` | `16px` (`--text-16`) | `h-12 px-6` | Hero-формы, широкие поля |

#### Состояния

| Состояние | Описание |
|-----------|---------|
| `default` | border `--border`, bg `--rm-gray-1`, text `--foreground` |
| `placeholder` | text `--muted-foreground` |
| `focus` | border `--ring`. Bg без изменений |
| `filled` | border `--border`. Нет отдельного стиля — текст говорит сам |
| `error` | border `--destructive`, text `--destructive` под полем (caption, 13px) |
| `disabled` | opacity `0.4`, cursor `not-allowed`, bg `--rm-gray-1` |

#### Tailwind-классы

```tsx
// xs — h-7 px-3 text-[length:var(--text-12)]
// sm — h-8 px-3 text-[length:var(--text-12)]
// md — h-10 px-4 text-[length:var(--text-14)]  ← default
// lg — h-12 px-6 text-[length:var(--text-16)]

// default / md
className="
  w-full h-10 px-4
  rounded-sm border border-border
  bg-rm-gray-1 text-foreground
  text-[length:var(--text-14)]
  placeholder:text-muted-foreground
  transition-all duration-150
  focus:outline-none focus:border-ring
  disabled:opacity-40 disabled:cursor-not-allowed
"

// code — 6 символов авторизации
className="
  w-14 h-14 text-center
  rounded-sm border border-border
  bg-rm-gray-1 text-foreground
  font-mono text-2xl tracking-[0.08em]
  transition-all duration-150
  focus:outline-none focus:border-ring
"
```

#### Структура поля с лейблом

```tsx
<div className="flex flex-col gap-1.5">
  <label className="font-mono text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">
    Email
  </label>
  <input ... />
  {/* error */}
  <span className="font-body text-[length:var(--text-12)] text-destructive">
    Введите корректный email
  </span>
</div>
```

---

### 6.2.1 Textarea

Паттерн для multiline-ввода. Базовые состояния: `Default`, `Disabled`, `Error`. Focus меняет только border; без теней и дополнительных glow-эффектов.

#### Когда использовать

- Multiline-формы: brief, описание кейса, комментарий, заметка
- Поле ввода сообщения в чате с AI-агентом
- Сценарии, где одной строки недостаточно и важна читаемая высота блока

#### Варианты

| Вариант | Применение |
|---------|-----------|
| `default` | Основной multiline-input для форм и длинного текста |
| `chat` | Компактный textarea в composer чата. Растёт по контенту, ограничен по высоте |

#### Состояния

| Состояние | Описание |
|-----------|---------|
| `default` | border `--border`, bg `--rm-gray-1`, text `--foreground` |
| `placeholder` | text `--muted-foreground` |
| `focus` | меняется только border на `--ring` |
| `error` | `aria-invalid="true"` + border `--destructive`, текст ошибки под полем |
| `disabled` | opacity `0.4`, cursor `not-allowed` |

#### Размеры и поведение

| Вариант | Min height | Padding | Font | Поведение |
|---------|------------|---------|------|-----------|
| `default` | `120px` | `16px 12px` | `14px` (`--text-14`) | `resize-y`, подходит для форм и заметок |
| `chat` | `48px` | `16px 12px` | `16px` (`--text-16`) | `resize-none`, `max-h: 200px`, внутренний scroll |

#### Tailwind-классы

```tsx
// default
className="
  w-full min-h-[120px] px-4 py-3
  rounded-sm border border-border
  bg-rm-gray-1 text-foreground
  text-[length:var(--text-14)] leading-[1.5]
  placeholder:text-muted-foreground
  resize-y
  transition-all duration-150
  outline-none focus-visible:border-ring
  disabled:opacity-40 disabled:cursor-not-allowed
  aria-invalid:border-destructive
"

// chat
className="
  w-full min-h-[48px] max-h-[200px] px-4 py-3
  rounded-sm border border-border
  bg-rm-gray-1 text-foreground
  text-[length:var(--text-16)] leading-[1.618]
  placeholder:text-muted-foreground
  resize-none overflow-auto
  transition-all duration-150
  outline-none focus-visible:border-ring
  disabled:opacity-40 disabled:cursor-not-allowed
  aria-invalid:border-destructive
"
```

#### Композиция `chat composer`

Компактный паттерн для chat-composer: textarea сверху, action-ряд снизу.

```tsx
<div className="rounded-lg border border-border bg-background p-3">
  <div className="flex flex-col gap-3">
    <Textarea variant="chat" rows={2} placeholder="Напишите сообщение..." />
    <div className="flex items-center justify-between gap-3">
      <p className="text-[length:var(--text-12)] text-muted-foreground font-[family-name:var(--font-caption-family)]">
        Enter отправляет, Shift + Enter переносит строку.
      </p>
      <Button size="sm">Send</Button>
    </div>
  </div>
</div>
```

#### Правила

- `Textarea` не заменяет `Input`: если контент ожидается в одну строку, используем `Input`
- Для focus допустима только смена border на `--ring`; не добавляем `ring-*`, `shadow-*`, `animate-*`
- Error показываем под полем, а не через отдельный badge или toast
- В chat-варианте ручной resize отключён, чтобы не ломать высоту composer

---

### 6.2.2 Search / Combobox

Полноценный компонент поиска для Rocketmind: inline-search, выпадающий список результатов, история запросов, preset-подсказки и запуск внутри модального окна.

#### Когда использовать

- Глобальный поиск по агентам, кейсам и действиям
- Поиск в каталоге агентов
- Быстрый переход внутри модального окна (`Cmd/Ctrl + K`)
- Стартовые сценарии, когда пользователь ещё не вводил запрос

#### Варианты

| Вариант | Применение |
|---------|-----------|
| `default` | Базовый inline-search под инпутом с выпадающим списком |
| `with-label` | Поиск внутри формы или панели, когда нужен контекст поля |
| `disabled` | Поиск временно недоступен из-за состояния кейса / загрузки |
| `error` | Некорректный slug, пустой результат интеграции, невалидный запрос |
| `modal-search` | Глобальный поиск в модальном окне: desktop center modal, mobile bottom sheet |

#### Размеры

Размеры совпадают с `Input` и `Button`, чтобы search bar, фильтры и CTA выстраивались в одну строку.

| Размер | Height | Padding H | Font | Tailwind | Применение |
|--------|--------|-----------|------|---------|-----------|
| `xs` | `28px` | `12px` | `12px` (`--text-12`) | `h-7 px-3` | Inline-search в плотных тулбарах |
| `sm` | `32px` | `12px` | `12px` (`--text-12`) | `h-8 px-3` | Sidebar, compact-фильтры |
| `md` *(default)* | `40px` | `16px` | `14px` (`--text-14`) | `h-10 px-4` | Основной поиск в приложении |
| `lg` | `48px` | `24px` | `16px` (`--text-16`) | `h-12 px-6` | Поиск в hero и в modal-search |

#### Состояния

| Состояние | Описание |
|-----------|---------|
| `default` | border `--border`, bg `--rm-gray-1`, text `--foreground` |
| `focus` | border `--ring`, popover остаётся flat, без тени |
| `open` | input остаётся в `focus`, список открывается на поверхности `--popover` |
| `filled` | справа кнопка очистки, слева иконка поиска |
| `disabled` | opacity `0.4`, cursor `not-allowed`, список не открывается |
| `error` | border `--destructive`, под полем сообщение `12px`, `text-destructive` |
| `empty` | вместо списка результатов показывается одно текстовое сообщение без иллюстраций |

#### Анатомия

```
┌───────────────────────────────────────────────┐
│ 🔍  Найти агента, кейс или действие...    ˅  │  ← input / searchbox
└───────────────────────────────────────────────┘
┌───────────────────────────────────────────────┐  ← popover, bg: --popover
│ История поиска                                 │
│  Юрист                           recent        │
│  Диагностика кейса               recent        │
│                                               │
│ Популярные сценарии                           │
│  Собрать бриф по клиенту          preset      │
│  Проверить воронку продаж         preset      │
└───────────────────────────────────────────────┘
```

#### Правила подсказок и истории

- При пустом запросе сначала показывать `Историю поиска`, затем `preset`-подсказки.
- Если истории нет, блок не скрывать: показать текст `"История пока пуста"` и сразу ниже — готовые сценарии.
- Если есть и история, и preset-подсказки, оба блока остаются видимыми.
- После ввода текста список переключается из режима подсказок в режим результатов.
- Если совпадений нет, показывать одну строку empty-state без дополнительных иконок и декоративных блоков.

#### Modal Search

- Desktop: центрированное модальное окно с search bar размера `lg`
- Mobile: bottom sheet с тем же search bar
- Overlay: `--rm-gray-alpha-600`
- Поверхность: `bg-card`, `border-border`, `rounded-lg`
- Анимация: использовать правила из раздела `8.5 Модальное окно / Sheet`

#### Tailwind-классы

```tsx
// Search field / md
className="
  w-full h-10 px-4
  rounded-sm border border-border
  bg-rm-gray-1 text-foreground
  text-[length:var(--text-14)]
  placeholder:text-muted-foreground
  transition-all duration-150
  focus:outline-none focus:border-ring
"

// Combobox list
className="
  absolute left-0 right-0 top-[calc(100%+8px)] z-20
  overflow-hidden rounded-lg border border-border
  bg-popover
"

// Result row
className="
  flex w-full items-start justify-between gap-3
  rounded-md border border-transparent
  px-2.5 py-2 text-left
  transition-all duration-150
  hover:bg-rm-gray-1 hover:border-border
"

// Error message
className="
  mt-1.5 text-[length:var(--text-12)] text-destructive
"
```

#### Базовая структура

```tsx
<div className="w-full">
  <div className="relative">
    <div className="w-full rounded-sm border border-border bg-rm-gray-1 focus-within:border-ring">
      <div className="flex items-center gap-2 h-10 px-4">
        <Search className="size-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Найти агента, кейс или действие..."
          className="min-w-0 flex-1 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
        <button type="button" className="text-muted-foreground">⌄</button>
      </div>
    </div>

    <div className="absolute left-0 right-0 top-[calc(100%+8px)] rounded-lg border border-border bg-popover">
      <div className="p-1.5">
        <button type="button" className="flex w-full items-start justify-between gap-3 rounded-md border border-transparent px-2.5 py-2 text-left hover:bg-rm-gray-1 hover:border-border">
          <div>
            <p className="text-[length:var(--text-14)] text-popover-foreground">Юрист</p>
            <p className="text-[length:var(--text-12)] text-muted-foreground">Агент: договоры и риски сделки</p>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">agent</span>
        </button>
      </div>
    </div>
  </div>
</div>
```

#### Правила использования

- Использовать для больших списков и навигации по сущностям, не для выбора 2–3 статичных опций.
- Для каталога агентов и глобального поиска по приложению — `md` или `lg`.
- В toolbar и compact-панелях — `xs` или `sm`.
- Empty-state должен подсказывать следующий шаг, а не просто констатировать пустоту.
- В модальном поиске input всегда первый интерактивный элемент после заголовка.

---

### 6.3 Card

Базовый контейнер для агентов, кейсов, элементов каталога.

#### Варианты

| Вариант | Применение |
|---------|-----------|
| `default` | Стандартная карточка — каталог агентов, список кейсов |
| `bento` | Ячейка bento-сетки на лендинге. Содержит UI-превью |
| `agent` | Карточка агента с аватаром, именем, описанием и CTA |
| `case` | Карточка кейса в sidebar: название + статус + последнее сообщение |
| `stat` | Минималистичная карточка-цифра для статистики |

#### Анатомия (default card)

```
┌─────────────────────────────┐  ← border 1px --border, radius 8px
│  [Иконка / Аватар]          │
│                             │  ← padding 24px
│  Заголовок (H4, Roboto Cond)│
│  Описание (body, Roboto)    │
│                             │
│  [See More →]               │  ← .link-cta (5.7)
└─────────────────────────────┘
```

#### Состояния

| Состояние | light | dark |
|-----------|-------|------|
| `default` | bg `--card`, border `--border` | bg `--card`, border `rgba(255,255,255,0.06)` |
| `hover` | border `--muted-foreground` | border `rgba(255,255,255,0.20)` |
| `active` / `selected` | border `--ring` | border `--ring` |
| `loading` | skeleton `--rm-gray-1` пульсирует | skeleton `--rm-gray-1` |

#### Tailwind-классы

```tsx
// default card
className="
  relative flex flex-col gap-4 p-6
  rounded-lg border border-border
  bg-card text-card-foreground
  transition-all duration-150
  hover:border-muted-foreground
  dark:border-white/[0.06]
  dark:hover:border-white/[0.20]
  cursor-pointer
"

// agent card — с нейтральным hover
className="
  relative flex flex-col gap-3 p-6
  rounded-lg border border-border
  bg-card text-card-foreground
  transition-all duration-200
  hover:border-muted-foreground
  dark:border-white/[0.06]
  dark:hover:border-white/[0.20]
  cursor-pointer
"

// case card — compact, для sidebar
className="
  flex flex-col gap-1 px-4 py-3
  rounded-lg border border-transparent
  transition-all duration-150
  hover:bg-accent hover:border-border
  data-[active=true]:bg-accent data-[active=true]:border-[--ring]
  cursor-pointer
"

// bento cell
className="
  relative overflow-hidden flex flex-col gap-4 p-6
  rounded-lg border
  bg-card
  border-white/[0.06]
  transition-all duration-200
  hover:border-white/[0.20]
"
```

#### Карточка агента — полная структура

```tsx
<div className="agent-card ...">
  {/* Иконка в верхнем левом — outline, 16px */}
  <div className="w-8 h-8 rounded-full border border-border
                  flex items-center justify-center text-muted-foreground">
    <Icon size={16} />
  </div>

  {/* Заголовок */}
  <h4 className="font-heading font-bold text-xl uppercase
                 tracking-[-0.005em] text-foreground">
    Маркетолог
  </h4>

  {/* Описание */}
  <p className="font-body text-base text-muted-foreground leading-[1.618]">
    Разрабатывает стратегии, анализирует рынок и конкурентов.
  </p>

  {/* CTA */}
  <a className="link-cta mt-auto">Запустить →</a>
</div>
```

---

---

## 6.3.1 Специализированные карточки

Набор типовых карточек для маркетплейса, каталога и лендинга. Все строятся на базовых токенах карточки (`--card`, `--border`, `--radius-lg`).

### Размерные варианты

Каждый тип карточки существует в трёх размерах:

| Размер | Ширина | Макет | Применение |
|--------|--------|-------|-----------|
| **S** (Small) | 20–30% экрана | Вертикальный | Сетка 3–4 колонки, каталог |
| **M** (Medium) | ~50% экрана | Вертикальный | Сетка 2 колонки, детальный список |
| **L** (Large) | 100% экрана | Горизонтальный | Медиа/иконка слева, контент справа |

**Правила L (горизонтальный):**
- Медиа/иконка: `w-48–w-52 flex-shrink-0` — фиксированная ширина
- Контент: `flex-1` — занимает оставшееся место
- Контейнер: `flex flex-row items-center gap-6`
- CTA и цена: `flex-shrink-0` по правому краю

### Общие правила

- **Radius:** `rounded-lg` (`8px`)
- **Padding:** `p-6` (`24px`) для M/L, `p-5` (`20px`) для S
- **Hover:** `hover:border-muted-foreground` в светлой, `dark:hover:border-white/[0.20]` в тёмной (единственный вариант для всех bg-card карточек)
- **Image-area (S/M):** фото/обложка занимает верхние `38%` карточки (золотое сечение)
- **Badge:** mono-шрифт, uppercase, `4px` radius, `--rm-gray-1` фон

---

### Card: Продукт / Услуга (`product`)

Используется в каталоге продуктов или услуг эксперта.

```
┌──────────────────────────────┐  ← radius 8px, border --border
│  [Обложка / иллюстрация]     │  ← h-40, object-cover, overflow-hidden
│                              │
├──────────────────────────────┤
│  [Badge: тег категории]      │  ← badge muted, 13px mono uppercase
│                              │  ← padding 24px
│  Название продукта           │  ← H4: Roboto Condensed Bold, 20px, uppercase
│  Краткое описание 1–2 строки │  ← body, 16px, --muted-foreground
│                              │
│  ╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌ │  ← separator --border
│  [Цена]          [Купить →]  │  ← цена: mono bold; кнопка: primary sm
└──────────────────────────────┘
```

**Элементы:**
| Элемент | Спецификация |
|---------|-------------|
| Обложка | `h-40` (`160px`), `object-cover`, `rounded-t-lg`, `overflow-hidden` |
| Категория | Badge: `bg-muted`, mono 10px uppercase, `rounded-sm` |
| Название | H4: `font-heading font-bold text-xl uppercase tracking-[-0.005em]` |
| Описание | `font-body text-base text-muted-foreground leading-[1.618]` line-clamp-2 |
| Цена | `font-mono font-semibold text-xl` + опционально перечёркнутая старая цена |
| CTA | Button `primary sm` или `link-cta` |

```tsx
<div className="
  flex flex-col overflow-hidden
  rounded-lg border border-border bg-card
  transition-all duration-150
  hover:border-muted-foreground
  dark:border-white/[0.06] dark:hover:border-white/[0.20]
  cursor-pointer
">
  {/* Обложка */}
  <div className="h-40 bg-muted overflow-hidden">
    <img src="..." alt="..." className="w-full h-full object-cover" />
  </div>
  {/* Контент */}
  <div className="flex flex-col gap-3 p-6">
    <span className="inline-flex w-fit px-2 py-0.5 rounded-sm bg-muted
                     font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
      Курс
    </span>
    <h4 className="font-heading font-bold text-xl uppercase tracking-[-0.005em]">
      Название продукта
    </h4>
    <p className="font-body text-base text-muted-foreground leading-[1.618] line-clamp-2">
      Краткое описание продукта или услуги.
    </p>
    <div className="flex items-center justify-between pt-3 border-t border-border mt-auto">
      <span className="font-mono font-semibold text-xl">9 900 ₽</span>
      <button className="h-8 px-3 rounded-sm bg-primary text-primary-foreground
                         font-mono text-[13px] uppercase tracking-[0.08em]">
        Купить →
      </button>
    </div>
  </div>
</div>
```

---

### Card: Эксперт (`expert`)

Карточка эксперта/автора в каталоге или на лендинге.

```
┌──────────────────────────────┐  ← radius 8px
│  [Фото эксперта]             │  ← h-48, object-cover, grayscale → color on hover
│                              │
├──────────────────────────────┤
│  Имя Фамилия                 │  ← H4, uppercase
│  Специализация               │  ← mono 13px uppercase, --muted-foreground
│                              │  ← padding 24px
│  Краткое bio                 │  ← body 16px, line-clamp-2
│                              │
│  [Тег] [Тег] [Тег]           │  ← skill-теги, badge --muted
│                              │
│  Подробнее →                 │  ← link-cta, mt-auto
└──────────────────────────────┘
```

**Элементы:**
| Элемент | Спецификация |
|---------|-------------|
| Фото | `h-48` (`192px`), `object-cover`, `rounded-t-lg`, ч/б фильтр (hover → color) |
| Имя | H4: `font-heading font-bold text-xl uppercase` |
| Специализация | `font-mono text-[13px] uppercase tracking-[0.08em] text-muted-foreground` |
| Bio | `font-body text-base text-muted-foreground` line-clamp-2 |
| Теги | Badge `bg-muted rounded-sm` 10px mono, max 3 тега |

```tsx
<div className="
  flex flex-col overflow-hidden
  rounded-lg border border-border bg-card
  transition-all duration-200
  hover:border-muted-foreground
  dark:border-white/[0.06]
  cursor-pointer group
">
  <div className="h-48 bg-muted overflow-hidden">
    <img src="..." alt="..." className="w-full h-full object-cover
              grayscale group-hover:grayscale-0 transition-all duration-300" />
  </div>
  <div className="flex flex-col gap-3 p-6">
    <div>
      <h4 className="font-heading font-bold text-xl uppercase tracking-[-0.005em]">
        Иван Петров
      </h4>
      <span className="font-mono text-[13px] uppercase tracking-[0.08em] text-muted-foreground">
        Бизнес-аналитик
      </span>
    </div>
    <p className="font-body text-base text-muted-foreground leading-[1.618] line-clamp-2">
      10 лет в консалтинге, помог 200+ компаниям выйти на новые рынки.
    </p>
    <div className="flex flex-wrap gap-1.5">
      {["Стратегия", "EdTech", "SaaS"].map(tag => (
        <span key={tag} className="px-2 py-0.5 rounded-sm bg-muted
                                   font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
          {tag}
        </span>
      ))}
    </div>
    <span className="inline-flex items-center gap-1.5 font-mono text-[13px] uppercase
                     tracking-[0.08em] text-muted-foreground hover:text-foreground
                     transition-all group/cta mt-auto">
      Подробнее <ArrowRight size={14} className="transition-transform group-hover/cta:translate-x-1" />
    </span>
  </div>
</div>
```

---

### Card: ИИ-агент (`ai-agent`)

Карточка агента в каталоге агентов. Расширенная версия существующей `agent card` — с маскотом и деталями.

```
┌──────────────────────────────┐  ← radius 8px, violet hover border
│  [Аватар-маскот 80px]        │  ← круглый, border violet-50
│  ●  Онлайн                   │  ← статус-бейдж
│                              │
│  Имя агента                  │  ← H4 uppercase
│  @slug                       │  ← mono 13px, --muted-foreground
│                              │  ← padding 24px
│  Описание роли               │  ← body 16px, line-clamp-3
│                              │
│  [Кейсов: 124]               │  ← micro-стат, mono
│                              │
│  Запустить →                 │  ← link-cta violet
└──────────────────────────────┘
```

**Элементы:**
| Элемент | Спецификация |
|---------|-------------|
| Аватар | `w-20 h-20` (`80px`), `rounded-full`, `border-2 border-[--color-violet-50]` |
| Статус | Зелёная точка `8px` + `font-mono text-[10px]` `--color-green` |
| Имя | H4: `font-heading font-bold text-xl uppercase` |
| Slug | `font-mono text-[13px] text-muted-foreground` |
| Описание | `font-body text-base text-muted-foreground` line-clamp-3 |
| Стат | `font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground` |
| CTA | `link-cta` со стилем `text-muted-foreground` |

```tsx
<div className="
  relative flex flex-col gap-4 p-6
  rounded-lg border border-border bg-card
  transition-all duration-200
  hover:border-muted-foreground
  dark:border-white/[0.06]
  cursor-pointer
">
  {/* Аватар + статус */}
  <div className="relative w-fit">
    <div className="w-20 h-20 rounded-full border-2 border-[var(--rm-yellow-50)] overflow-hidden bg-muted">
      <img src="..." alt="..." className="w-full h-full object-cover" />
    </div>
    <span className="absolute bottom-1 right-1 flex items-center gap-1
                     px-1.5 py-0.5 rounded-full bg-card border border-border">
      <span className="w-1.5 h-1.5 rounded-full bg-[#9AF576]" />
      <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
        Активен
      </span>
    </span>
  </div>
  {/* Имя + slug */}
  <div className="flex flex-col gap-0.5">
    <h4 className="font-heading font-bold text-xl uppercase tracking-[-0.005em]">
      Маркетолог
    </h4>
    <span className="font-mono text-[13px] text-muted-foreground">@maks</span>
  </div>
  {/* Описание */}
  <p className="font-body text-base text-muted-foreground leading-[1.618] line-clamp-3">
    Анализирует рынок, разрабатывает стратегии и помогает находить точки роста бизнеса.
  </p>
  {/* Стат */}
  <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
    Кейсов: 124
  </span>
  {/* CTA */}
  <span className="inline-flex items-center gap-1.5 font-mono text-[13px] uppercase
                   tracking-[0.08em] text-[#A172F8] hover:text-foreground
                   transition-all group mt-auto">
    Запустить <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
  </span>
</div>
```

---

### Card: Отзыв (`review`)

Карточка отзыва клиента / пользователя. Используется в секции социального доказательства.

```
┌──────────────────────────────┐  ← radius 8px, без hover CTA
│  ★ ★ ★ ★ ★                  │  ← звёзды: yellow-100
│                              │
│  «Текст отзыва в кавычках»   │  ← body 16px, italic, foreground
│                              │  ← padding 24px
│  ╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌ │
│  [Аватар 40px]  Имя          │  ← аватар rounded-full
│                 Должность    │  ← mono 13px uppercase muted
└──────────────────────────────┘
```

**Элементы:**
| Элемент | Спецификация |
|---------|-------------|
| Звёзды | `★` символ, `text-[#FFCC00]`, `text-base` (16px), gap-0.5 |
| Текст | `font-body text-base italic leading-[1.618]` + `"` открывающая кавычка крупнее |
| Аватар | `w-10 h-10 rounded-full`, `border border-border` |
| Имя | `font-body text-[13px] font-medium` |
| Роль | `font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground` |

```tsx
<div className="
  flex flex-col gap-4 p-6
  rounded-lg border border-border bg-card
  dark:border-white/[0.06]
">
  {/* Звёзды */}
  <div className="flex gap-0.5 text-[#FFCC00] text-base">
    {"★★★★★".split("").map((s, i) => <span key={i}>{s}</span>)}
  </div>
  {/* Текст */}
  <blockquote className="font-body text-base italic leading-[1.618] text-foreground">
    «Агент помог мне за 2 дня разобраться в структуре рынка, на что раньше уходило 2 недели.»
  </blockquote>
  {/* Автор */}
  <div className="flex items-center gap-3 pt-3 border-t border-border">
    <div className="w-10 h-10 rounded-full border border-border bg-muted overflow-hidden flex-shrink-0">
      <img src="..." alt="..." className="w-full h-full object-cover" />
    </div>
    <div className="flex flex-col gap-0.5">
      <span className="font-body text-[13px] font-medium">Анна Смирнова</span>
      <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
        CEO, TechStartup
      </span>
    </div>
  </div>
</div>
```

---

### Card: Кейс (`case-full`)

Полноценная карточка кейса (не sidebar-компакт), для списка кейсов в профиле или витрине.

```
┌──────────────────────────────┐  ← radius 8px
│  [Статус-бейдж]  [Агент]     │  ← строка мета-данных
│                              │
│  Название кейса              │  ← H4 uppercase
│  Последнее обновление        │  ← mono 10px uppercase muted  ← padding 24px
│                              │
│  Превью последнего сообщения │  ← body 13px, line-clamp-2, muted
│                              │
│  ╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌ │
│  [Иконка агента] [3 сообщ.]  │  ← footer-строка, mono 10px
└──────────────────────────────┘
```

**Статусы:**
| Статус | Цвет бейджа | Hex |
|--------|------------|-----|
| `active` | Зелёный | `bg-[#9AF576]/20 text-[#9AF576]` |
| `pending` | Жёлтый | `bg-[#FFCC00]/20 text-[#FFCC00]` |
| `closed` | Серый | `bg-muted text-muted-foreground` |

```tsx
<div className="
  flex flex-col gap-4 p-6
  rounded-lg border border-border bg-card
  transition-all duration-150 hover:border-muted-foreground
  dark:border-white/[0.06] dark:hover:border-white/[0.20]
  cursor-pointer
">
  {/* Мета-строка */}
  <div className="flex items-center justify-between">
    <span className="px-2 py-0.5 rounded-sm bg-[#9AF576]/20 text-[#9AF576]
                     font-mono text-[10px] uppercase tracking-[0.08em]">
      Активен
    </span>
    <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
      @maks
    </span>
  </div>
  {/* Название + дата */}
  <div className="flex flex-col gap-1">
    <h4 className="font-heading font-bold text-xl uppercase tracking-[-0.005em]">
      Анализ рынка EdTech
    </h4>
    <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
      Обновлён 2 часа назад
    </span>
  </div>
  {/* Превью */}
  <p className="font-body text-[13px] text-muted-foreground leading-[1.5] line-clamp-2">
    Агент завершил анализ конкурентов и подготовил сводный отчёт...
  </p>
  {/* Footer */}
  <div className="flex items-center justify-between pt-3 border-t border-border">
    <div className="w-6 h-6 rounded-full bg-muted border border-border" />
    <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
      3 сообщения
    </span>
  </div>
</div>
```

---

### Card: Курс (`course`)

Карточка образовательного курса в каталоге.

```
┌──────────────────────────────┐  ← radius 8px
│  [Обложка / тематическая     │  ← h-36, с gradient overlay
│   иллюстрация]               │
│                              │
├──────────────────────────────┤
│  [Уровень] [Формат]          │  ← два badge
│                              │  ← padding 24px
│  Название курса              │  ← H4 uppercase
│  Автор · N уроков            │  ← mono 13px uppercase muted
│                              │
│  Описание курса              │  ← body 16px, line-clamp-2, muted
│                              │
│  ╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌ │
│  [Прогресс-бар / рейтинг]    │
│  Цена          [Начать →]    │
└──────────────────────────────┘
```

**Элементы:**
| Элемент | Спецификация |
|---------|-------------|
| Обложка | `h-36`, `rounded-t-lg`, gradient overlay `from-transparent to-card/60` |
| Уровень | Badge: `bg-[#56CAEA]/20 text-[#56CAEA]` — начинающий / продвинутый |
| Формат | Badge: `bg-muted` — видео / текст / воркшоп |
| Прогресс | `h-1 rounded-full bg-muted` + `bg-primary` для заполненной части |
| Рейтинг | `★` + `font-mono text-[10px]` число |

```tsx
<div className="
  flex flex-col overflow-hidden
  rounded-lg border border-border bg-card
  transition-all duration-150 hover:border-muted-foreground
  dark:border-white/[0.06] dark:hover:border-white/[0.20]
  cursor-pointer
">
  {/* Обложка */}
  <div className="relative h-36 bg-muted overflow-hidden">
    <img src="..." alt="..." className="w-full h-full object-cover" />
    <div className="absolute inset-0 bg-gradient-to-t from-card/60 to-transparent" />
  </div>
  {/* Контент */}
  <div className="flex flex-col gap-3 p-6">
    {/* Бейджи */}
    <div className="flex gap-2">
      <span className="px-2 py-0.5 rounded-sm bg-[#56CAEA]/20 text-[#56CAEA]
                       font-mono text-[10px] uppercase tracking-[0.08em]">
        Начинающий
      </span>
      <span className="px-2 py-0.5 rounded-sm bg-muted text-muted-foreground
                       font-mono text-[10px] uppercase tracking-[0.08em]">
        Видео
      </span>
    </div>
    {/* Название */}
    <h4 className="font-heading font-bold text-xl uppercase tracking-[-0.005em]">
      Маркетинг для стартапов
    </h4>
    {/* Мета */}
    <span className="font-mono text-[13px] uppercase tracking-[0.08em] text-muted-foreground">
      Иван Петров · 12 уроков
    </span>
    <p className="font-body text-base text-muted-foreground leading-[1.618] line-clamp-2">
      Практический курс по привлечению первых клиентов без большого бюджета.
    </p>
    {/* Рейтинг + прогресс */}
    <div className="flex items-center gap-2">
      <span className="text-[#FFCC00] text-sm">★</span>
      <span className="font-mono text-[10px] text-muted-foreground">4.8 (234)</span>
    </div>
    {/* Footer */}
    <div className="flex items-center justify-between pt-3 border-t border-border mt-auto">
      <span className="font-mono font-semibold text-xl">4 900 ₽</span>
      <button className="h-8 px-3 rounded-sm bg-primary text-primary-foreground
                         font-mono text-[13px] uppercase tracking-[0.08em]">
        Начать →
      </button>
    </div>
  </div>
</div>
```

---

### Card: Инструмент (`tool`)

Карточка инструмента / интеграции / сервиса в каталоге.

```
┌──────────────────────────────┐  ← radius 8px
│  [Логотип инструмента 48px]  │  ← квадрат с radius 8px, border
│                              │
│  Название инструмента        │  ← H4 uppercase         ← padding 24px
│  Категория                   │  ← mono 13px uppercase muted
│                              │
│  Описание что делает         │  ← body 16px, line-clamp-2
│                              │
│  [Тег интеграции]            │  ← badge: n8n / Webhook / API
│                              │
│  Подключить →                │  ← link-cta mt-auto
└──────────────────────────────┘
```

**Элементы:**
| Элемент | Спецификация |
|---------|-------------|
| Логотип | `w-12 h-12 rounded-sm border border-border bg-muted flex items-center justify-center` |
| Название | H4 uppercase |
| Категория | mono 13px uppercase muted |
| Интеграция-тег | `bg-[#4A56DF]/20 text-[#4A56DF]` для API/Webhook, `bg-muted` для остальных |

```tsx
<div className="
  flex flex-col gap-4 p-6
  rounded-lg border border-border bg-card
  transition-all duration-150 hover:border-muted-foreground
  dark:border-white/[0.06] dark:hover:border-white/[0.20]
  cursor-pointer
">
  {/* Логотип */}
  <div className="w-12 h-12 rounded-sm border border-border bg-muted
                  flex items-center justify-center text-muted-foreground flex-shrink-0">
    <img src="..." alt="..." className="w-7 h-7 object-contain" />
  </div>
  {/* Текст */}
  <div className="flex flex-col gap-1">
    <h4 className="font-heading font-bold text-xl uppercase tracking-[-0.005em]">
      Notion
    </h4>
    <span className="font-mono text-[13px] uppercase tracking-[0.08em] text-muted-foreground">
      База знаний
    </span>
  </div>
  <p className="font-body text-base text-muted-foreground leading-[1.618] line-clamp-2">
    Синхронизирует кейсы с вашей базой знаний Notion автоматически.
  </p>
  {/* Тег интеграции */}
  <span className="w-fit px-2 py-0.5 rounded-sm bg-[#4A56DF]/20 text-[#4A56DF]
                   font-mono text-[10px] uppercase tracking-[0.08em]">
    Webhook
  </span>
  {/* CTA */}
  <span className="inline-flex items-center gap-1.5 font-mono text-[13px] uppercase
                   tracking-[0.08em] text-muted-foreground hover:text-foreground
                   transition-all group mt-auto">
    Подключить <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
  </span>
</div>
```

---

### Card: Партнёрская программа (`partner`)

Карточка партнёрской программы / реферального предложения.

```
┌──────────────────────────────┐  ← radius 8px, yellow accent
│  ⚡ [Иконка программы]       │  ← жёлтый bg-circle, 48px
│                              │
│  Название программы          │  ← H4 uppercase         ← padding 24px
│  Условия одной строкой       │  ← mono 13px uppercase muted
│                              │
│  Описание преимуществ        │  ← body 16px, 2–3 строки
│                              │
│  ╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌ │
│  Комиссия: [30%]             │  ← ключевая цифра, H3 yellow
│                              │
│  [Стать партнёром]           │  ← button primary sm
└──────────────────────────────┘
```

**Элементы:**
| Элемент | Спецификация |
|---------|-------------|
| Иконка | `w-12 h-12 rounded-full bg-[#FFCC00]/15 text-[#FFCC00] flex items-center justify-center` |
| Название | H4 uppercase |
| Условия | mono 13px uppercase muted (напр. «Доход: до 30%  ·  Пожизненно») |
| Ключевая цифра | `font-heading font-bold text-[26px] text-[#FFCC00]` |
| CTA | Button `primary sm` — один на карточку |

```tsx
<div className="
  flex flex-col gap-4 p-6
  rounded-lg border border-border bg-card
  transition-all duration-150
  hover:border-muted-foreground
  dark:border-white/[0.06] dark:hover:border-white/[0.20]
  cursor-pointer
">
  {/* Иконка */}
  <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
       style={{ backgroundColor: "color-mix(in srgb, #FFCC00 15%, transparent)" }}>
    <Gem size={22} className="text-[#FFCC00]" />
  </div>
  {/* Текст */}
  <div className="flex flex-col gap-1">
    <h4 className="font-heading font-bold text-xl uppercase tracking-[-0.005em]">
      Реферальная программа
    </h4>
    <span className="font-mono text-[13px] uppercase tracking-[0.08em] text-muted-foreground">
      Доход: до 30% · Пожизненно
    </span>
  </div>
  <p className="font-body text-base text-muted-foreground leading-[1.618]">
    Приглашайте клиентов и получайте процент от каждой их оплаты навсегда.
  </p>
  {/* Ключевая цифра */}
  <div className="flex flex-col gap-0.5 pt-3 border-t border-border">
    <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
      Комиссия
    </span>
    <span className="font-heading font-bold text-[26px] uppercase tracking-tight leading-none text-[#FFCC00]">
      30%
    </span>
  </div>
  {/* CTA */}
  <button className="h-8 px-3 rounded-sm bg-primary text-primary-foreground
                     font-mono text-[13px] uppercase tracking-[0.08em] w-full">
    Стать партнёром
  </button>
</div>
```

---

### Сводная таблица карточек

| Тип | Вариант | Размеры | Hover | CTA |
|-----|---------|---------|-------|-----|
| Продукт/Услуга | `product` | S / M / L | `muted-foreground` border | Button primary sm |
| Эксперт | `expert` | S / M / L | Violet border | link-cta |
| ИИ-агент | `ai-agent` | S / M / L | Violet border | link-cta violet |
| Отзыв | `review` | S / M / L | нет | — |
| Кейс | `case-full` | S / M / L | `muted-foreground` border | — (клик на всю карточку) |
| Курс | `course` | S / M / L | `muted-foreground` border | Button primary sm |
| Инструмент | `tool` | S / M / L | `muted-foreground` border | link-cta |
| Партнёр | `partner` | S / M / L | Yellow border | Button primary sm |

**Особенности L-варианта по типам:**

| Тип | Левая часть (фиксированная) | Правая часть | Выравнивание |
|-----|-----------------------------|-------------|-------------|
| Продукт | Обложка `w-48` | Название + описание + цена + CTA | `items-center` |
| Эксперт | Фото `w-52` | Имя + специализация + bio + теги + CTA | `items-center` |
| ИИ-агент | Аватар `w-20` round | Имя + slug + кейсы + описание + CTA | `items-center` |
| Отзыв | Аватар `w-36` + имя | Звёзды + дата + цитата | `items-start` |
| Кейс | Статус `w-40` | Название + агент | Превью + кол-во сообщений | `items-center` |
| Курс | Обложка `w-52` | Бейджи + название + автор + рейтинг + цена | `items-center` |
| Инструмент | Логотип `w-14` | Название + категория + описание + тег + CTA | `items-center` |
| Партнёр | Иконка `w-14` | Название + условия + описание | Комиссия + CTA | `items-center` |

---

---

### 6.3.2 Dialog / Modal

Модальное окно для подтверждений, коротких форм и критических действий. Блокирует фоновый контент scrim-оверлеем и требует явного закрытия.

**Ключевые сценарии:** подтверждение удаления/архивации, короткие формы (переименование кейса), информационные алерты.

**Что не добавляем:** сложные multi-step wizard. Для пошаговых сценариев использовать полноэкранные view, не модальные окна.

#### Когда использовать

- Необратимое действие требует подтверждения (удаление, архивация)
- Короткая форма ввода (1–3 поля), которая не заслуживает отдельного экрана
- Системное сообщение, требующее реакции пользователя

> **Не использовать** для длинных форм, навигации или контента, который нужно скроллить. В этих случаях — отдельный экран или Sheet.

#### Варианты

| Вариант | Применение |
|---------|-----------|
| `default` | Стандартное окно: заголовок + контент + действия |
| `alert` | Предупреждение с деструктивным действием (красный CTA) |

#### Анатомия

```text
Overlay (scrim)
└── Dialog
    ├── header
    │   ├── title (H4, heading font)
    │   ├── description (text-14, muted-foreground)
    │   └── close button (icon-only, ghost, top-right)
    ├── content (произвольный контент)
    └── footer
        ├── cancel (Button ghost)
        └── confirm (Button default | destructive)
```

#### Токены

| Часть | Значение |
|-------|----------|
| Overlay | `bg: --rm-gray-alpha-600` (rgba 0.40) |
| Panel bg | `--card` |
| Panel border | `--border` |
| Panel radius | `--radius-lg` (8px) |
| Panel shadow | `none` (flat design) |
| Panel width | `sm: 400px`, `md: 480px`, `lg: 640px` |
| Panel max-height | `85vh` |
| Panel padding | `p-6` (24px) |
| Footer gap | `gap-3` (12px) |
| Title | `--font-heading-family`, `--text-18`, `font-bold`, `uppercase`, `tracking-[-0.005em]` |
| Description | `--text-14`, `--muted-foreground` |
| Z-index | `50` |

#### Анимации

Используются правила из секции 8.5:

```css
/* Overlay */
.dialog-overlay {
  animation: fade-in var(--duration-smooth) var(--ease-enter);
}

/* Panel — desktop: center, mobile: bottom sheet */
.dialog-content {
  animation: slide-in-bottom var(--duration-enter) var(--ease-enter);
}
```

#### Tailwind / структура

```tsx
// Overlay
className="
  fixed inset-0 z-50
  bg-[var(--rm-gray-alpha-600)]
"

// Panel
className="
  fixed left-1/2 top-1/2 z-50
  -translate-x-1/2 -translate-y-1/2
  w-full max-w-[480px]
  rounded-lg border border-border bg-card
  p-6
"

// Footer
className="
  flex justify-end gap-3 pt-4
"
```

#### Правила использования

- Деструктивное действие всегда требует Dialog с явным текстом последствий.
- Cancel — всегда `ghost`, Confirm — `default` или `destructive` в зависимости от контекста.
- Закрытие по Escape и клику на overlay — обязательно для `default`, запрещено для `alert`.
- Focus trap внутри модала — обязателен для доступности.
- Не вкладывать Dialog в Dialog. Если нужна вложенность — пересмотреть UX.

---

### 6.3.3 Dropdown Menu

Контекстное меню для действий над объектом: кейс, агент, сообщение. Появляется по клику (не по hover) и закрывается при выборе действия или клике вне.

**Ключевые сценарии:** действия с кейсом (переименовать, архивировать, удалить), действия с сообщением (копировать, повторить).

#### Когда использовать

- Группа из 2+ действий над конкретным объектом
- Действия не помещаются в одну строку кнопок
- Нужен контекстный вызов (ПКМ, кнопка «...», long-press)

> **Не использовать** для навигации между разделами. Для навигации — `Tabs` или sidebar.

#### Варианты

| Вариант | Применение |
|---------|-----------|
| `default` | Список действий |
| `with-icons` | Действия с иконками слева (icon-sm, 16px) |
| `with-separator` | Группировка секций разделителями |
| `with-destructive` | Последний пункт — деструктивное действие (red) |

#### Анатомия

```text
Trigger (Button icon / ghost)
└── Menu (portal)
    ├── Item
    ├── Item
    ├── Separator
    ├── Item (destructive)
    └── ...
```

#### Токены

| Часть | Значение |
|-------|----------|
| Menu bg | `--popover` |
| Menu border | `--border` |
| Menu radius | `--radius-sm` (4px) |
| Menu shadow | `none` (flat design) |
| Menu padding | `p-1` (4px) |
| Menu min-width | `160px` |
| Item height | `32px` (h-8) |
| Item padding | `px-2 py-1.5` |
| Item radius | `--radius-sm` (4px) |
| Item font | `--text-14`, `--foreground` |
| Item hover | `bg: --rm-gray-2`, `text: --foreground` |
| Item icon | `16px`, `--muted-foreground`, hover → `--foreground` |
| Item destructive | `text: --rm-red-100`, hover `bg: --rm-red-900` |
| Separator | `border-border`, `my-1` |
| Z-index | `50` |

#### Анимации

```css
[data-state="open"] {
  animation: fade-in-down var(--duration-smooth) var(--ease-enter);
}
[data-state="closed"] {
  animation: fade-out-up var(--duration-smooth) var(--ease-exit);
}
```

#### Tailwind / структура

```tsx
// Menu container
className="
  z-50 min-w-[160px]
  rounded-sm border border-border bg-popover p-1
"

// Item
className="
  flex items-center gap-2
  h-8 px-2 py-1.5 rounded-sm
  text-[length:var(--text-14)] text-foreground
  cursor-pointer transition-colors duration-150
  hover:bg-[var(--rm-gray-2)]
  focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50
"

// Destructive item
className="
  text-[var(--rm-red-100)]
  hover:bg-[var(--rm-red-900)]
"
```

#### Правила использования

- Пункт меню всегда ведёт к немедленному действию или открытию Dialog.
- Деструктивные пункты визуально отделены Separator и окрашены в `--rm-red-100`.
- Клавиатурная навигация обязательна (Arrow Up/Down, Enter, Escape).
- Меню закрывается при клике вне, Escape или выборе действия.
- Не более 7 пунктов в одном меню. Больше — пересмотреть UX.

---

### 6.3.4 Avatar

Визуальное представление пользователя или ИИ-агента. Круглое изображение с fallback на инициалы.

#### Когда использовать

- Идентификация пользователя (header, сайдбар, сообщения)
- Представление ИИ-агента (сайдбар, каталог, чат)

#### Варианты

| Вариант | Применение |
|---------|-----------|
| `image` | Фото/аватар загружен |
| `fallback` | Нет изображения — отображаются инициалы или иконка |

#### Размеры

| Размер | Пиксели | CSS | Применение |
|--------|---------|-----|-----------|
| `xs` | 24px | `w-6 h-6` | Inline-метки, компактные списки |
| `sm` | 32px | `w-8 h-8` | Сайдбар, список агентов, чат-сообщения |
| `md` | 40px | `w-10 h-10` | Header, профиль |
| `lg` | 48px | `w-12 h-12` | Карточка агента |
| `xl` | 64px | `w-16 h-16` | Детальный профиль, hero-карточка агента |

#### Токены

| Часть | Значение |
|-------|----------|
| Shape | `--radius-full` (круг) |
| Border | `border border-border` |
| Image fit | `object-cover` |
| Fallback bg | `--rm-gray-1` |
| Fallback text | `--muted-foreground`, `--font-mono-family`, uppercase |
| Fallback font size | `xs: 10px`, `sm: 12px`, `md: 14px`, `lg: 16px`, `xl: 20px` |

#### Tailwind / структура

```tsx
// Image avatar
className="
  relative inline-flex shrink-0
  rounded-full border border-border
  overflow-hidden
  w-10 h-10           // md default
"

// Fallback
className="
  flex items-center justify-center
  rounded-full border border-border
  bg-[var(--rm-gray-1)]
  text-muted-foreground
  font-[family-name:var(--font-mono-family)]
  text-[length:var(--text-14)]
  uppercase
  w-10 h-10
"
```

#### Правила использования

- Всегда предусматривать fallback. Никогда не показывать пустой/битый `<img>`.
- Fallback-текст: первые буквы имени и фамилии (или названия агента). Одна буква для коротких имён.
- Для ИИ-агентов использовать маскот-изображения из `apps/site/public/ai-mascots/`.
- Avatar не имеет hover-состояния сам по себе. Если avatar кликабельный — обернуть в кнопку с hover.

---

### 6.3.5 Scroll Area

Кастомный scroll-контейнер с тонким скроллбаром, стилизованным под дизайн-систему. Заменяет нативный scrollbar для визуальной консистентности.

#### Когда использовать

- Sidebar с большим количеством кейсов/агентов
- Чат-область с длинной историей сообщений
- Любой контейнер с фиксированной высотой и переполнением

> **Не использовать** для основного контента страницы. Основной скролл — нативный body scroll.

#### Токены

| Часть | Значение |
|-------|----------|
| Scrollbar width | `8px` |
| Scrollbar radius | `--radius-full` |
| Track bg | `transparent` |
| Thumb bg | `--rm-gray-3` |
| Thumb hover | `--rm-gray-4` |
| Corner | `transparent` |

#### Tailwind / структура

```tsx
// Container
className="
  relative overflow-hidden
  h-full
"

// Viewport
className="
  h-full w-full overflow-y-auto
  [scrollbar-width:thin]
  [scrollbar-color:var(--rm-gray-3)_transparent]
"

// Scrollbar (webkit fallback)
// ::-webkit-scrollbar { width: 8px; }
// ::-webkit-scrollbar-track { background: transparent; }
// ::-webkit-scrollbar-thumb {
//   background: var(--rm-gray-3);
//   border-radius: var(--radius-full);
// }
// ::-webkit-scrollbar-thumb:hover {
//   background: var(--rm-gray-4);
// }
```

#### Правила использования

- ScrollArea всегда имеет `overflow: hidden` на контейнере — скролл только внутри viewport.
- Auto-hide: скроллбар видим только при скролле или hover на области.
- Горизонтальный скролл допускается только для таблиц и кода.
- Для чата: автоматический scroll-to-bottom при новом сообщении.

---

### 6.3.6 Skeleton

Placeholder-заглушки, занимающие место будущего контента во время загрузки. Предотвращают layout shift и дают пользователю понимание структуры.

**Принцип:** не спиннер, а skeleton-placeholder — элемент сразу занимает место, нет «прыжков» при загрузке.

#### Когда использовать

- Загрузка данных с сервера (список кейсов, история чата, каталог агентов)
- Первый рендер компонента до получения данных
- Замена реального контента на время обновления

> **Не использовать** для действий < 200ms. Если данные приходят мгновенно — показывать сразу, без skeleton.

#### Варианты

| Вариант | Применение |
|---------|-----------|
| `line` | Текстовая строка (заголовок, описание) |
| `block` | Прямоугольный блок (карточка, изображение) |
| `circle` | Круглый placeholder (аватар) |

#### Токены

| Часть | Значение |
|-------|----------|
| Base bg | `--rm-gray-1` |
| Shimmer highlight | `hsl(from var(--rm-gray-1) h s calc(l + 5%))` |
| Radius (line/block) | `--radius-sm` (4px) |
| Radius (circle) | `--radius-full` |
| Animation | `shimmer 1.5s ease-in-out infinite` |
| Background-size | `200% 100%` |

#### CSS

```css
.skeleton {
  background: linear-gradient(
    90deg,
    var(--rm-gray-1) 0%,
    hsl(from var(--rm-gray-1) h s calc(l + 5%)) 50%,
    var(--rm-gray-1) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: var(--radius-sm);
}

@keyframes shimmer {
  from { background-position: 200% 0; }
  to   { background-position: -200% 0; }
}
```

#### Tailwind / структура

```tsx
// Line skeleton
className="
  h-4 w-3/4 rounded-sm
  animate-pulse bg-[var(--rm-gray-1)]
"

// Block skeleton (card-shaped)
className="
  h-32 w-full rounded-lg
  animate-pulse bg-[var(--rm-gray-1)]
"

// Circle skeleton (avatar-shaped)
className="
  h-10 w-10 rounded-full
  animate-pulse bg-[var(--rm-gray-1)]
"
```

#### Композиция (пример для карточки)

```tsx
// Skeleton карточки агента
<div className="flex flex-col gap-3 p-5 rounded-lg border border-border">
  <div className="h-36 rounded-sm animate-pulse bg-[var(--rm-gray-1)]" />
  <div className="h-3 w-16 rounded-sm animate-pulse bg-[var(--rm-gray-1)]" />
  <div className="h-5 w-3/4 rounded-sm animate-pulse bg-[var(--rm-gray-1)]" />
  <div className="h-4 w-full rounded-sm animate-pulse bg-[var(--rm-gray-1)]" />
  <div className="h-4 w-2/3 rounded-sm animate-pulse bg-[var(--rm-gray-1)]" />
</div>
```

#### Правила использования

- Skeleton должен повторять форму и размеры реального контента. Круглый avatar → круглый skeleton.
- Не анимировать skeleton для `prefers-reduced-motion: reduce` — показывать статичный `bg-[var(--rm-gray-1)]`.
- Количество skeleton-элементов должно соответствовать ожидаемому количеству реальных элементов (3 карточки → 3 skeleton-карточки).
- Skeleton заменяется на реальный контент без промежуточного состояния (без fade-анимации между ними).

---

---

## 6.4 AI-агенты — Маскоты

> Подробные описания каждого агента: [design/agents/](agents/)

Восемь персонажей-маскотов — часть визуального языка системы. Каждый представлен 3D-аватаром с уникальным характером, меткой и ролью.

**Где используются:**
- Аватар агента в чат-интерфейсе (круглый контейнер, 40–48px)
- Карточка агента в каталоге (аватар 80px + имя + роль)
- Hero/CTA блоки — крупный аватар 120–160px, «выглядывает» из-за края блока
- Sticker-подпись рядом с текстом (Shantell Sans + аватар 32px)

**Принцип:** персонажи не статичны — всегда с жестом, наклоном или эмоцией. Дополняют технологичный flat-стиль человеческой теплотой.

| Агент | Роль | Slug | Метка |
|-------|------|------|-------|
| **Катя** | Аналитик экосистем | `@katya` | Спираль на щеке |
| **Ник** | Дизраптор | `@nik` | Ракета на кепке |
| **Сергей** | Внешний контекст | `@sergey` | Глобус-графика |
| **Лида** | Тестировщик гипотез | `@lida` | Ракета-клипт |
| **Алекс** | Клиентский агент | `@alex` | Лупа на виске |
| **Макс** | Ценность бизнеса | `@maks` | Лупа и бандана |
| **Марк** | Дизайнер платформ | `@mark` | Бейдж системы |
| **Софи** | Куратор обучения | `@sofi` | Карандаш + стикер |

---

## 6.5 Logo

> Файлы логотипа: `docs/logo/`

Логотип Rocketmind существует в трёх вариантах и двух цветовых схемах (для светлого и тёмного фона).

### Варианты логотипа

| Вариант | Класс | Файлы | Применение |
|---------|-------|-------|-----------|
| `icon` | `.logo--icon` | `icon_*.svg` | Favicon, мобильная шапка (compact), avatar-заглушка |
| `text` | `.logo--text` | `text_logo_*.svg` | Шапка (основной), компактные лейаутовые позиции |
| `full` | `.logo--full` | `with_descriptor_*.svg` | Футер, онбординг, hero-блоки |

### Цветовые схемы

| Тема | Суффикс файла | Когда использовать |
|------|--------------|-------------------|
| Тёмный фон | `_dark_background` | `.dark`-тема, тёмные секции (hero, footer) |
| Светлый фон | `_light_background` | Светлая тема, белые/серые секции |

### Языковые версии

| Версия | Суффикс | Файл-пример |
|--------|---------|-------------|
| Русская | `_ru` | `text_logo_dark_background_ru.svg` |
| Английская | `_en` | `text_logo_dark_background_en.svg` |

> По умолчанию используется русская версия (`_ru`). Английская — для будущей локализации.

### Размеры

| Контекст | Вариант | Высота | Класс-размер |
|----------|---------|--------|-------------|
| Шапка desktop | `text` | `28px` | `.logo--header` |
| Шапка mobile | `icon` | `32px` | `.logo--header-mobile` |
| Футер | `full` | `40px` | `.logo--footer` |
| Favicon | `icon` | `16–32px` | — |

### CSS

```css
/* Базовый компонент */
.logo {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
}

.logo img,
.logo svg {
  display: block;
  height: var(--logo-height, 28px);
  width: auto;
}

/* Размеры по контексту */
.logo--header       { --logo-height: 28px; }
.logo--header-mobile { --logo-height: 32px; } /* icon-вариант */
.logo--footer       { --logo-height: 40px; }

/* Варианты */
.logo--icon   { /* только иконка-ракета */ }
.logo--text   { /* иконка + текст "Rocketmind" */ }
.logo--full   { /* иконка + текст + дескриптор */ }
```

### HTML-пример (шапка)

```html
<!-- Светлая тема, шапка -->
<a href="/" class="logo logo--text logo--header" aria-label="Rocketmind">
  <img src="/docs/logo/text_logo_light_background_ru.svg" alt="Rocketmind" />
</a>

<!-- Тёмная тема / тёмный фон -->
<a href="/" class="logo logo--text logo--header" aria-label="Rocketmind">
  <img src="/docs/logo/text_logo_dark_background_ru.svg" alt="Rocketmind" />
</a>

<!-- Мобильная шапка (icon-only) -->
<a href="/" class="logo logo--icon logo--header-mobile" aria-label="Rocketmind">
  <img src="/docs/logo/icon_dark_background.svg" alt="Rocketmind" />
</a>
```

### Правила использования

- **Не масштабировать непропорционально** — только `height`, `width: auto`
- **Не перекрашивать** — использовать готовые цветовые версии из `docs/logo/`
- **Зона безопасности:** вокруг логотипа не менее `16px` свободного пространства
- **На тёмных секциях** (hero, footer, sidebar) — всегда `_dark_background`
- **На светлых секциях** — всегда `_light_background`
- **Кликабельный:** всегда оборачивается в `<a href="/">` с `aria-label="Rocketmind"`

---

## 6.6 Header (Шапка)

Шапка единая для всех страниц: лендинг, авторизация, main app.

### Структура

```
[Logo] ··············· [Nav Links] ··· [CTA Button]
```

| Зона | Контент | Компоненты |
|------|---------|-----------|
| Лево | Логотип | `Logo` (`.logo--text .logo--header`) |
| Центр | Навигация (только лендинг) | `ghost`-кнопки или plain `<a>` |
| Право | CTA «Попробовать» (лендинг) / Аватар юзера (app) | `Button primary lg` |

### Landing navigation / dropdown

Для маркетингового header допускается variant с выпадающими списками у первых пунктов навигации.

| Часть | Значение |
|------|----------|
| Trigger | текущий label меню, chevron справа, без отдельной подложки в rest |
| Trigger hover / open | только `text: --foreground`, panel без glow и без дополнительной тени |
| Panel | `bg: --popover`, `border: --border`, `rounded-sm`, `p-3` |
| Layout panel | grid `2 cols`, gap `6px` (`gap-1.5`) |
| Item title | `--font-mono-family`, `--text-12`, uppercase, `tracking: 0.08em` |
| Item description | `--text-13`, `text: --muted-foreground`, line-height `~1.45` |
| Item hover | `bg: --rm-gray-2`, title `--foreground`, без shadow/glow |
| Animation | opacity + translateY, `duration-200`, easing standard/smooth |

```tsx
<div className="absolute right-0 top-[calc(100%+12px)] w-[420px] rounded-sm border border-border bg-popover">
  <ul className="grid grid-cols-2 gap-1.5 p-3">
    <li>
      <a className="flex min-h-[84px] flex-col rounded-sm border border-transparent p-2.5 hover:bg-[var(--rm-gray-2)]">
        <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em]">
          AI-консалтинг
        </span>
        <span className="mt-1 text-[13px] leading-[1.45] text-muted-foreground">
          Стратегия внедрения ИИ в бизнес и в операционные процессы.
        </span>
      </a>
    </li>
  </ul>
</div>
```

### Токены

```css
.site-header {
  height: 64px;                         /* фиксированная высота */
  padding: 0 var(--container-padding);  /* адаптируется к grid */
  background: var(--background);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 50;
}
```

### Мобильная версия (< 768px)

- Логотип: icon-вариант (`.logo--icon .logo--header-mobile`)
- Навигация: скрыта → гамбургер-меню (Lucide `Menu`, 24px)
- CTA: скрыта в mobile-nav или заменяется на иконку

---

## 6.7 Footer (Футер)

Футер — только на лендинге и маркетинговых страницах. В main app не используется.

### Структура

```
[Logo full]     [Ссылки: Продукт / Компания / Правовое]     [Соцсети]
─────────────────────────────────────────────────────────────────────
                    © 2026 Rocketmind. Все права защищены.
```

### Логотип в футере

```html
<a href="/" class="logo logo--full logo--footer" aria-label="Rocketmind">
  <img src="/docs/logo/with_descriptor_dark_background_ru.svg" alt="Rocketmind" />
</a>
```

> Футер всегда на тёмном фоне (`--background` в `.dark`-теме или явный `#0A0A0A`). Используется `_dark_background` версия с дескриптором (`with_descriptor`).

### Токены

```css
.site-footer {
  background: var(--background);          /* тёмный фон (#0A0A0A в .dark) */
  padding: 64px var(--container-padding) 40px;
  border-top: 1px solid var(--border);
}

/* Цвет применяется через .dark на <html> или явно на секции */
```

### Минимальный вариант (лендинг MVP)

```html
<footer class="site-footer dark">
  <div class="footer-top">
    <a href="/" class="logo logo--full logo--footer">
      <img src="/docs/logo/with_descriptor_dark_background_ru.svg" alt="Rocketmind" />
    </a>
    <nav class="footer-nav"><!-- ссылки --></nav>
  </div>
  <div class="footer-bottom">
    <p>© 2026 Rocketmind. Все права защищены.</p>
  </div>
</footer>
```

---

## 7. Иконки

### 7.1 Библиотека

**Основная библиотека:** [Lucide Icons](https://lucide.dev/) — outline-стиль, 24px viewbox, stroke 2px (фиксированный).

**Причина выбора:**
- Нативная интеграция с shadcn/ui (`lucide-react`)
- Минималистичный outline-стиль совпадает с flat-эстетикой системы
- Единообразие: все иконки из одного источника, без смешивания библиотек

**Запасной вариант:** если нужная иконка отсутствует в Lucide — Phosphor Icons (`phosphor-react`), только Regular/Light начертание. Не смешивать иконки из разных библиотек в одном компоненте.

---

### 7.2 Размерная шкала

| Токен | px | Контекст |
|-------|----|---------|
| `icon-xs` | `12` | Вспомогательные метки, badge-индикаторы |
| `icon-sm` | `16` | Внутри кнопок, input-prefix, inline-элементы |
| `icon-md` | `20` | Стандарт навигации, sidebar, toolbar |
| `icon-lg` | `24` | Карточки агентов, заголовки секций |
| `icon-xl` | `32` | Иллюстративные иконки, пустые состояния |
| `icon-2xl` | `40` | Connection Graph узлы, крупные аватары-плейсхолдеры |

> Базовое значение — `icon-md: 24px`. От него масштабируется через шкалу 8px.

---

### 7.3 Цвет и стиль

**Правила:**
- Цвет иконки наследуется от родительского элемента (`currentColor`) — никаких захардкоженных fill/stroke
- Интерактивные иконки: `--muted-foreground` в rest-состоянии, `--foreground` при hover
- Акцентные иконки (действие, активное состояние): `--color-yellow-100`
- Stroke-width фиксированный: **2px визуальных** — не масштабируется с размером иконки
- Формула: `strokeWidth={48/size}` (= `2 × viewBox(24) / size`)

```tsx
// Правильно — наследует цвет, фиксированный stroke 2px
<Icon size={20} strokeWidth={2.4} className="text-muted-foreground hover:text-foreground transition-colors" />

// При динамическом размере
<Icon size={iconSize} strokeWidth={48/iconSize} className="text-muted-foreground" />

// Акцент
<Icon size={20} strokeWidth={2.4} className="text-[#FFCC00]" />
```

| Размер | `strokeWidth` |
|--------|--------------|
| 12px (xs) | `4` |
| 16px (sm) | `3` |
| 20px (md) | `2.4` |
| 24px (lg) | `2` |
| 32px (xl) | `1.5` |
| 40px (2xl) | `1.2` |

---

### 7.4 Применение в компонентах

| Компонент | Размер | Цвет |
|-----------|--------|------|
| Button (sm/md) | `icon-sm` (16px) | наследует от кнопки |
| Input prefix/suffix | `icon-sm` (16px) | `--muted-foreground` |
| Sidebar nav item | `icon-md` (20px) | `--muted-foreground` → `--foreground` |
| Card агента | `icon-lg` (24px) | `--muted-foreground` |
| Empty state | `icon-xl` (32px) | `--muted-foreground` |
| Connection Graph | `icon-2xl` (40px) | `--foreground` |
| Toast/Alert | `icon-sm` (16px) | семантический цвет (success/warning/danger) |

---

### 7.5 Иконки-метки агентов

Каждый агент имеет уникальную иконку-метку (см. [design/agents/](agents/)). Правила:
- Отображаются в аватаре агента как overlay-элемент (`12–16px`, нижний правый угол)
- Цвет: `--muted-foreground` (не акцентный, чтобы не конкурировать с аватаром)
- Стиль: outline, тот же stroke 2px визуальных (`strokeWidth={4}` для 12px, `strokeWidth={3}` для 16px)

---

### 7.6 Запрещено

- Filled-иконки (кроме статусных индикаторов — `filled circle` для online/offline)
- Смешивание нескольких иконочных библиотек в одном блоке
- Масштабирование stroke при изменении размера через CSS transform
- Иконки в роли декора без смысловой нагрузки
- Цветные многоцветные иконки (emoji-style)

---

## 8. Анимации и Motion

### 8.1 Принципы

Motion в Rocketmind — функциональный, не декоративный. Каждая анимация решает задачу: подтверждает действие, указывает направление, сообщает о смене состояния.

**Три правила:**
1. **Минимализм** — анимировать только то, что несёт смысл
2. **Скорость** — быстро (`100–300ms`), никаких длинных эффектов
3. **Единообразие** — одни и те же easing-кривые и длительности по всей системе

> Из PRD: «без сложных анимаций» — это означает: без parallax, без scroll-triggered animations, без page-transition с морфингом. Только микроинтерактивы и reveal-паттерны.

---

### 8.2 Timing-шкала

| Токен | ms | Применение |
|-------|----|-----------|
| `--duration-instant` | `50` | Немедленная реакция (cursor, checkmark мгновенный) |
| `--duration-fast` | `100` | Hover-эффекты кнопок, смена цвета |
| `--duration-base` | `200` | Стандарт: переходы состояний (active/disabled/focus) |
| `--duration-smooth` | `300` | Появление/скрытие элементов (dropdown, tooltip) |
| `--duration-enter` | `400` | Входящие элементы (модал, панель) |
| `--duration-grid` | `1600` | Animated Grid Lines hero reveal — единственная длинная анимация |

---

### 8.3 Easing-кривые

```css
:root {
  --ease-standard:  cubic-bezier(0.4, 0, 0.2, 1);   /* Material Standard — для большинства переходов */
  --ease-enter:     cubic-bezier(0, 0, 0.2, 1);      /* Decelerate — для входа элементов */
  --ease-exit:      cubic-bezier(0.4, 0, 1, 1);      /* Accelerate — для выхода */
  --ease-spring:    cubic-bezier(0.34, 1.56, 0.64, 1); /* Пружина — для hover-scale, немного превышает 1 */
}
```

| Кривая | Когда использовать |
|--------|-------------------|
| `--ease-standard` | Смена состояния (hover, focus, active) |
| `--ease-enter` | Появление (модал, дропдаун, toast) |
| `--ease-exit` | Исчезновение (закрытие модала, скрытие tooltip) |
| `--ease-spring` | Hover scale на карточках агентов, pulse-эффект |

---

### 8.4 Микроинтерактивы (компонентный уровень)

#### Кнопки

```css
/* Rest → Hover: только цвет, без scale */
.btn {
  transition:
    background-color var(--duration-fast) var(--ease-standard),
    color var(--duration-fast) var(--ease-standard);
}
```

#### Input

```css
/* Focus ring появляется плавно */
.input {
  transition:
    border-color var(--duration-base) var(--ease-standard),
    box-shadow var(--duration-base) var(--ease-standard);
}
.input:focus {
  border-color: var(--color-yellow-100);
}
```

#### Иконки-навигация (sidebar)

```css
/* Hover: смена цвета */
.nav-icon {
  transition: color var(--duration-fast) var(--ease-standard);
}
```

#### Карточки агентов

```css
/* Hover: border */
.agent-card {
  transition: border-color var(--duration-base) var(--ease-standard);
}
.agent-card:hover {
  border-color: var(--color-violet-100);
}
```

#### Text-link CTA (→ arrow)

```css
.link-cta .arrow {
  display: inline-block;
  transition: transform var(--duration-fast) var(--ease-standard);
}
.link-cta:hover .arrow {
  transform: translateX(4px);
}
```

---

### 8.5 Переходы между состояниями экрана

#### Dropdown / Tooltip

```css
/* Появление */
[data-state="open"] {
  animation: fade-in-down var(--duration-smooth) var(--ease-enter);
}
/* Исчезновение */
[data-state="closed"] {
  animation: fade-out-up var(--duration-smooth) var(--ease-exit);
}

@keyframes fade-in-down {
  from { opacity: 0; transform: translateY(-4px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fade-out-up {
  from { opacity: 1; transform: translateY(0); }
  to   { opacity: 0; transform: translateY(-4px); }
}
```

#### Модальное окно / Sheet

```css
/* Overlay */
.overlay {
  animation: fade-in var(--duration-smooth) var(--ease-enter);
}
/* Panel (bottom sheet на mobile, center modal на desktop) */
.dialog-content {
  animation: slide-in-bottom var(--duration-enter) var(--ease-enter);
}

@keyframes slide-in-bottom {
  from { opacity: 0; transform: translateY(16px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
```

#### Toast / Notification

```css
/* Появляется снизу-справа, уходит вправо */
.toast {
  animation: toast-enter var(--duration-smooth) var(--ease-enter);
}
@keyframes toast-enter {
  from { opacity: 0; transform: translateX(24px); }
  to   { opacity: 1; transform: translateX(0); }
}
```

#### Сообщения в чате

```css
/* Новое сообщение появляется снизу */
.chat-bubble {
  animation: bubble-enter var(--duration-smooth) var(--ease-enter);
}
@keyframes bubble-enter {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

---

### 8.6 Loading / Skeleton

**Принцип:** не спиннер, а skeleton-placeholder — элемент сразу занимает место, нет «прыжков» при загрузке.

```css
/* Skeleton shimmer */
.skeleton {
  background: linear-gradient(
    90deg,
    var(--rm-gray-1) 0%,
    hsl(from var(--rm-gray-1) h s calc(l + 5%)) 50%,
    var(--rm-gray-1) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: var(--radius-sm);
}

@keyframes shimmer {
  from { background-position: 200% 0; }
  to   { background-position: -200% 0; }
}
```

**Typing indicator (чат агента):**

```css
/* Три точки с stagger */
.typing-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--muted-foreground);
  animation: typing-pulse 1.2s ease-in-out infinite;
}
.typing-dot:nth-child(2) { animation-delay: 0.2s; }
.typing-dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes typing-pulse {
  0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
  40%           { opacity: 1;   transform: scale(1);   }
}
```

---

### 8.7 Page-level анимации

**Единственная разрешённая page-level анимация:** Animated Grid Lines при загрузке hero-секции (см. раздел 5.2).

**Запрещено на page-level:**
- Parallax-scrolling
- Scroll-triggered transforms/fade
- Page transitions с морфингом
- Бесконечные фоновые анимации (pulse, float, orbit)
- Particle systems

**Допустимо (одноразово при загрузке):**
- Fade-in hero-контента: `opacity 0→1`, `400ms`, `ease-enter`, без transform
- Grid Lines reveal (8.9) — 1600ms, `--duration-grid`

---

### 8.8 Доступность (Reduced Motion)

Все анимации обязаны уважать системные настройки пользователя:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

> Исключение: typing-indicator в чате — можно заменить на статичный символ `•••`, а не отключать. Это сохраняет UX-функцию при любых настройках.


### 8.9 Animated Grid Lines (анимированная сетка)

**Источник:** 21st.dev hero-minimalism.
**Суть:** тонкие линии-разделители появляются при загрузке страницы, визуализируя структуру/архитектуру. Сетка — не декор, а материализация каркаса дизайна.

**Правила применения:**
- Только в hero-секциях (лендинг, SaaS-лендинг, страница агента)
- Линии горизонтальные + вертикальные, совпадают с колонками/строками сетки
- Цвет: `rgba(0,0,0,0.06)` light / `rgba(255,255,255,0.04)` dark — почти невидимые
- Анимация появления: `scaleX/scaleY` от 0 до 1, `duration: 1.6s`, `easing: ease-out`, `stagger: 0.1s` между линиями
- После появления — статичные, не мигают, не двигаются

```css
/* Базовая реализация через CSS-анимацию */
.grid-lines {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}
.grid-line {
  position: absolute;
  background: rgba(255, 255, 255, 0.04);
  transform-origin: left top;
  animation: line-appear 1.6s ease-out forwards;
  opacity: 0;
}
.grid-line--h { width: 100%; height: 1px; transform: scaleX(0); }
.grid-line--v { width: 1px;  height: 100%; transform: scaleY(0); }

@keyframes line-appear {
  to { opacity: 1; transform: scale(1); }
}
```

---

### 8.10 Dot Grid Lens

#### Концепция

Эффект «линзы» на фоне из точек: сетка мелких dot'ов, при наведении курсора точки вблизи него плавно увеличиваются в размере по радиальному закону — создаётся иллюзия выпуклой линзы. Используется как фоновый элемент на лендинге (hero-секция, CTA-секция).

**Источник вдохновения:** [anubi.io](https://anubi.io) — dot grid с magnification lens на курсоре.

---

#### Визуальные параметры

| Параметр | Значение | Описание |
|----------|---------|----------|
| `--dot-size` | `3px` | Базовый диаметр точки |
| `--dot-size-max` | `10px` | Максимальный диаметр в центре линзы |
| `--dot-gap` | `28px` | Расстояние между центрами точек (шаг сетки) |
| `--dot-color` | `#CBCBCB` (light) / `#404040` (dark) | Цвет точки — `--border` токен |
| `--dot-color-accent` | `#FFCC00` | Акцентный цвет точек в центре линзы (опционально) |
| `--lens-radius` | `120px` | Радиус влияния курсора |
| `--lens-falloff` | `gaussian` | Характер затухания: гауссовый (плавный) |

---

#### Алгоритм расчёта масштаба точки

Для каждой точки с координатами `(x, y)` при позиции курсора `(mx, my)`:

```
distance = sqrt((x - mx)² + (y - my)²)
t = clamp(1 - distance / LENS_RADIUS, 0, 1)
scale = 1 + (MAX_SCALE - 1) * t²   // квадратичный easing
dotRadius = BASE_RADIUS * scale
```

Где:
- `BASE_RADIUS = 1.5` (px, половина `--dot-size`)
- `MAX_SCALE = 3.3` (соответствует `--dot-size-max / --dot-size`)
- `LENS_RADIUS = 120` (px)

---

#### Реализация (Canvas)

Рекомендованный метод: `<canvas>` с requestAnimationFrame для производительности. Не использовать DOM-элементы для каждой точки.

```html
<canvas id="dot-grid" aria-hidden="true"></canvas>
```

```css
#dot-grid {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none; /* клики проходят сквозь */
  z-index: 0;
}
```

```typescript
const GRID_GAP = 28;       // шаг сетки, px
const BASE_R = 1.5;        // базовый радиус точки, px
const MAX_SCALE = 3.3;     // множитель в центре линзы
const LENS_RADIUS = 120;   // радиус влияния, px
const DOT_COLOR_LIGHT = '#CBCBCB';
const DOT_COLOR_DARK  = '#404040';

class DotGridLens {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private mouse = { x: -9999, y: -9999 };
  private raf = 0;
  private cols = 0;
  private rows = 0;
  private isDark: boolean;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.isDark = document.documentElement.classList.contains('dark');
    this.resize();
    this.bindEvents();
    this.loop();
  }

  private resize() {
    const dpr = window.devicePixelRatio || 1;
    const { clientWidth: w, clientHeight: h } = this.canvas.parentElement!;
    this.canvas.width  = w * dpr;
    this.canvas.height = h * dpr;
    this.canvas.style.width  = `${w}px`;
    this.canvas.style.height = `${h}px`;
    this.ctx.scale(dpr, dpr);
    this.cols = Math.ceil(w / GRID_GAP) + 1;
    this.rows = Math.ceil(h / GRID_GAP) + 1;
  }

  private bindEvents() {
    window.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    });
    window.addEventListener('mouseleave', () => {
      this.mouse.x = -9999;
      this.mouse.y = -9999;
    });
    window.addEventListener('resize', () => this.resize());
  }

  private draw() {
    const { ctx, cols, rows } = this;
    const { width: w, height: h } = this.canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, w, h);

    const color = this.isDark ? DOT_COLOR_DARK : DOT_COLOR_LIGHT;
    const { x: mx, y: my } = this.mouse;

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const px = i * GRID_GAP;
        const py = j * GRID_GAP;

        const dx = px - mx;
        const dy = py - my;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const t = Math.max(0, 1 - dist / LENS_RADIUS);
        const scale = 1 + (MAX_SCALE - 1) * t * t; // quadratic falloff
        const r = BASE_R * scale;

        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      }
    }
  }

  private loop() {
    this.draw();
    this.raf = requestAnimationFrame(() => this.loop());
  }

  destroy() {
    cancelAnimationFrame(this.raf);
  }
}

// Инициализация
const canvas = document.getElementById('dot-grid') as HTMLCanvasElement;
new DotGridLens(canvas);
```

---

#### Вариант с акцентным цветом

Для более выразительного эффекта точки в эпицентре окрашиваются в `--color-yellow-100`:

```typescript
// Внутри цикла draw():
const t = Math.max(0, 1 - dist / LENS_RADIUS);
const scale = 1 + (MAX_SCALE - 1) * t * t;
const r = BASE_R * scale;

// Интерполяция цвета: grey → yellow при приближении к курсору
const accent = [255, 204, 0];      // #FFCC00
const base   = [203, 203, 203];    // #CBCBCB (light)
const ri = Math.round(base[0] + (accent[0] - base[0]) * t * t);
const gi = Math.round(base[1] + (accent[1] - base[1]) * t * t);
const bi = Math.round(base[2] + (accent[2] - base[2]) * t * t);

ctx.fillStyle = `rgb(${ri},${gi},${bi})`;
```

> Используй акцентный вариант только в hero-секции лендинга. На нейтральных фонах — монохромный вариант.

---

#### Touch / Mobile

На тач-устройствах (без курсора) линза не активируется — сетка отображается статично с базовым размером точек. Это допустимое поведение: паттерн остаётся декоративным фоном.

```typescript
// Определение touch-устройства:
const isTouchOnly = !window.matchMedia('(pointer: fine)').matches;
if (isTouchOnly) return; // пропустить инициализацию линзы
```

---

#### Производительность

| Сценарий | FPS | Рекомендация |
|----------|-----|--------------|
| 1920×600 hero, gap=28 | ~60 fps | Baseline |
| 1920×600, gap=20 | ~45 fps | Допустимо |
| gap < 16 | < 30 fps | Не использовать |
| Mobile (static) | N/A | Линза отключена |

- Не использовать `shadow` / `blur` в canvas — дорого по CPU.
- При `prefers-reduced-motion: reduce` — отключить анимацию, показывать статичную сетку.

```typescript
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reducedMotion) {
  // нарисовать статичную сетку один раз и остановить loop
  this.draw();
  return;
}
```

---

#### Применение в экранах

| Экран | Секция | Вариант |
|-------|--------|---------|
| Лендинг — Hero | Полный фон hero | Акцентный |
| Лендинг — CTA | Фон CTA-блока | Монохромный |
| Auth | Фоновый декор | Монохромный, opacity: 0.5 |
| Main App | Не используется | — |

---

### 8.11 Hero Background Noise & Bottom Fade

Для тёмного hero-блока лендинга разрешён дополнительный декоративный слой поверх базового фона: мягкая подложка, статичный шум и нижний fade в фон страницы.

#### Состав слоя

| Слой | Токен / приём | Правило |
|------|---------------|---------|
| Base backdrop | `--background`, `--rm-yellow-100`, `--rm-gray-alpha-100` | Глубина строится через 2 radial-gradient + 1 vertical linear-gradient, без новых цветов |
| Noise overlay | SVG noise, `mix-blend-mode: soft-light`, `opacity: 0.04–0.06` | Только статичный шум, без анимации |
| Bottom fade | `linear-gradient(..., transparent 74%, var(--background) 100%)` | Fade применяется только к декоративному слою, контент не исчезает |

#### Правила применения

- Только для hero-секции лендинга и других full-bleed hero на тёмном фоне
- Шум всегда декоративный: `pointer-events: none`, без интерактивности
- Fade уходит в токен `--background`, а не в хардкодный HEX
- Контент, логотипы и CTA располагаются выше fade-слоя и сохраняют полный контраст
- Анимация шума запрещена; допускается только статичная текстура

```css
.hero-background-base {
  background:
    radial-gradient(circle at 16% 18%, color-mix(in srgb, var(--rm-yellow-100) 18%, transparent) 0%, transparent 34%),
    radial-gradient(circle at 78% 8%, var(--rm-gray-alpha-100) 0%, transparent 30%),
    linear-gradient(180deg, color-mix(in srgb, var(--background) 68%, black 32%) 0%, color-mix(in srgb, var(--background) 88%, black 12%) 54%, var(--background) 100%);
}

.hero-background-noise {
  opacity: 0.055;
  mix-blend-mode: soft-light;
}

.hero-background-fade {
  background: linear-gradient(180deg, transparent 0%, transparent 74%, var(--background) 100%);
}
```

---

### 8.12 Hero Round Glass Lens

#### Концепция

Круглая hero-линза следует за курсором в пределах ограниченного смещения от базовой позиции и искажает уже собранную сцену внутри круга. Центр линзы остаётся почти стабильным, а основное fisheye/barrel-искажение собирается в кольце у края. Размытие внутри линзы не используется.

#### Визуальные параметры

| Параметр | Значение | Описание |
|----------|---------|----------|
| Диаметр | `280–360px` (`clamp(280px, 30vw, 360px)`) | Размер линзы в hero |
| Outer stroke | `1px linear-gradient(62deg, #FFE900 1%, #A6A6A6 40%, rgba(64,64,64,0) 100%)` | Тонкая градиентная обводка по кругу |
| Side flares | `blue-white chromatic accents` | Короткие световые вспышки слева и справа, как в макете |
| Inner stroke | `none` | Внутренняя 1px-линия не используется |
| Highlight | `radial-gradient` white/yellow | Лёгкий стеклянный блик без blur |
| Pointer offset limit | `64px` | Максимальное смещение от базовой точки |

#### Реализация

Рекомендованный метод: WebGL canvas внутри контейнера линзы. Шейдер должен брать текстуру не из дублированных DOM-элементов внутри линзы, а из растеризованного снимка всей hero-сцены. Это даёт реальное искажение сцены без ручной сборки копии контента в линзе.

Правила:
- Не вставлять внутрь линзы отдельную копию wordmark, меню, логотипов или background-слоёв.
- Не использовать blur как основной эффект линзы.
- Держать центр линзы визуально спокойным; деформация должна усиливаться к краю.
- На `pointer: coarse` линза остаётся статичной по позиции; на `prefers-reduced-motion: reduce` отключается следование за курсором и останавливаются дополнительные анимации.

#### Вторичная hero-линза

В hero допустима вторая большая линза-окружность без искажения сцены. Она использует такой же градиентный бордер, располагается справа за контентом и двигается за курсором в 3 раза медленнее и с амплитудой в 3 раза меньше, чем основная WebGL-линза.

#### Шейдерная логика

```glsl
normalized = distance(localOffset, center) / radius
rim = smoothstep(0.34, 0.98, normalized)
rimBand = rim * (1.0 - smoothstep(0.82, 1.0, normalized))
sampleOffset = localOffset * (1.0 - 0.22 * rimBand)
sampleOffset -= direction * radius * 0.085 * pow(normalized, 3.0)
```

Смысл:
- до ~`0.34R` искажение почти незаметно;
- основная деформация живёт в кольце `0.34R → 0.82R`;
- самый край остаётся читаемым за счёт мягкого затухания alpha.

---

## 9. Маркетинг блоки

Готовые блоки для лендинга и маркетинговых страниц. Используют токены дизайн-системы — стиль единый с основным приложением.

---

### 9.1 Аккордион — FAQ (Accordion-05)

Аккордион для секций FAQ и «Часто задаваемые вопросы» на лендинге.

#### Анатомия

```
Accordion.Root
└── Accordion.Item (border-b border-border)
    ├── Accordion.Header
    │   └── Accordion.Trigger  ← кнопка
    │       ├── <span> число (--font-mono-family, --text-12)
    │       └── <span> заголовок (--font-heading-family, uppercase, text-3xl / --text-50)
    └── Accordion.Panel  ← .accordion-05-panel (grid-template-rows анимация)
        └── <div overflow-hidden>
            └── <p> контент (--text-14, text-muted-foreground)
```

#### Токены

| Свойство | Токен / значение | Описание |
|----------|-----------------|----------|
| Закрытый заголовок | `text-foreground/20` | Приглушённый текст |
| Открытый заголовок | `text-primary` (`--rm-yellow-100`) | Акцентный жёлтый |
| Hover заголовок | `text-foreground/50` | Промежуточное состояние |
| Типографика | `--font-heading-family`, uppercase | Bold, tracking -0.02em |
| Номер | `--font-mono-family`, `--text-12` | Tabular nums, mt-2, shrink-0 |
| Отступ триггера | `pl-6 md:pl-14` | Левый отступ |
| Контент | `--text-14`, `text-muted-foreground` | Отступ `pl-6 md:px-20` |
| Разделитель | `border-b border-border` | Стандартный бордер ДС |
| Анимация | `grid-template-rows`, 200ms | `cubic-bezier(0.4, 0, 0.2, 1)` |

#### Состояния триггера (`@base-ui/react` data-атрибуты)

| Атрибут | Когда | Tailwind-селектор |
|---------|-------|------------------|
| `data-panel-open` | Панель открыта | `data-[panel-open]:` |
| _(нет атрибута)_ | Панель закрыта | _(дефолтный стиль)_ |

#### CSS-класс анимации

```css
/* globals.css */
.accordion-05-panel {
  display: grid;
  transition: grid-template-rows 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.accordion-05-panel[data-open]   { grid-template-rows: 1fr; }
.accordion-05-panel[data-closed] { grid-template-rows: 0fr; }
```

> Внутренний `<div>` панели должен иметь `overflow-hidden` — иначе контент виден до раскрытия.

#### Применение

| Экран | Секция |
|-------|--------|
| Лендинг | FAQ, «Часто задаваемые вопросы» |
| Страница агента | Детали кейса, параметры |

---

## Changelog

### v1.5.6 · 2026-03-18

**Компонент Switch / Тумблер**

- Добавлен новый подраздел `6.1.5 Switch / Тумблер` в Markdown-версию дизайн-системы и в DS Web.
- Зафиксированы основные сценарии `Switch`: `Default`, `Disabled`, `Sizes`, `Full width`, `Tooltip`, `Icon`.
- Компонент собран только на существующих control-токенах Rocketmind: `--border`, `--ring`, `--rm-gray-1`, `--rm-yellow-100`, `--rm-yellow-fg`.
- Раздел `Notes` перенумерован в `6.1.6 Notes`, чтобы компонентная нумерация оставалась последовательной.

### v1.5.5 · 2026-03-18

**Checkbox, Radio и sync компонентов**

- Добавлены новые подразделы `6.1.3 Checkbox` и `6.1.4 Radio` в Markdown-версию дизайн-системы и в DS Web.
- Зафиксированы состояния `Checkbox`: `Default`, `Disabled`, `Disabled Checked`, `Disabled Indeterminate`, `Indeterminate`.
- Зафиксированы сценарии `Radio`: `Default`, `Disabled`, `Required`, `Headless`, `Standalone`.
- Раздел `Notes` сдвинут в `6.1.5`, чтобы компонентная нумерация оставалась последовательной.

**Компонент Notes**

- Подраздел `Notes` перенумерован в `6.1.5 Notes` и сохранён синхронно в Markdown-версии дизайн-системы и в DS Web.
- Зафиксированы состояния `Note`: `Default`, `Action`, `Success`, `Warning`, `Error`, `Disabled`, `Labels`.
- Добавлен operational-набор вариантов: `neutral`, `info`, `success`, `warning`, `error`, `action`.
- Зафиксированы режимы `soft` и `filled` на существующих токенах Rocketmind.
- Новые декоративные цвета сознательно не добавляются.

### v1.5.4 · 2026-03-18

**Компонент Notes**

- Добавлен новый подраздел `6.1.3 Notes` в Markdown-версию дизайн-системы и в DS Web.
- Зафиксированы состояния `Note`: `Default`, `Action`, `Success`, `Warning`, `Error`, `Disabled`, `Labels`.
- Добавлен operational-набор вариантов: `neutral`, `info`, `success`, `warning`, `error`, `action`.
- Зафиксированы режимы `soft` и `filled` на существующих токенах Rocketmind.
- Новые декоративные цвета сознательно не добавляются.

### v1.5.1 · 2026-03-17

**Typography: Roboto Mono for code & caption**

- Добавлен шрифт `Roboto Mono` (Regular) для ролей `code` и `caption`.
- В разделе 2.1 «Шрифты» обновлён список гарнитур и способ подключения.
- В разделе 2.3 «Типографика» добавлены начертания `caption-14` и `code-14`.
- `Loos Condensed` сохранён для label/navigation/button-паттернов.

### v1.5.0 · 2026-03-17

**Шрифт: Roboto Mono → Loos Condensed**

- Шрифт `label`-типографики заменён: `Roboto Mono` → `Loos Condensed` (Medium, OTF).
- Локальный файл: `/fonts/LoosCond-Medium.otf`. Google Fonts для Roboto Mono удалён из импорта.
- Токен `--font-mono-family` обновлён. Применяется везде: кнопки, навигация, теги, badges.

**Типографика — обновление токенов**

- `copy-25` → `copy-24`, `copy-19` → `copy-18` — выровнены размеры по системе.
- Скорректированы `line-height` для label (1.2–1.28) и copy (1.32–1.4).
- `letter-spacing` для label унифицирован: `0.03–0.04em` вместо `0.06–0.08em`.

**Компонент Badge (6.1.1)**

- Добавлена полная документация компонента Badge.
- Три варианта: `neutral`, `{color}-solid`, `{color}-subtle`.
- 8 акцентных цветов: yellow, violet, sky, terracotta, pink, blue, red, green.
- Три размера: `sm` (20px), `md` (24px), `lg` (28px).

**Input — расширение размерной сетки**

- Добавлен размер `xs` (28px, h-7 px-3, text-12).
- Уточнена типографика размеров: привязана к CSS-токенам `--text-{N}`.
- Фоновый цвет инпутов: `--background` → `--rm-gray-1`.

**Иконки — stroke-width**

- Стандарт изменён с `1.5px` на **2px визуальных**.
- Формула: `strokeWidth={48/size}`. Таблица: 12px→4, 16px→3, 20px→2.4, 24px→2, 32px→1.5.

**Серая шкала — переименование токенов**

- `--rm-gray-2..6/fg` → `--rm-gray-1..4/fg-sub/fg-main` — упрощённая линейная нумерация.

### v1.3.0 · 2026-03-17

**Цветовая палитра — унификация solid-цветов**

- Все акцентные и категориальные цвета (`-100`) теперь имеют **единый hex** для светлой и тёмной темы — используется оттенок светлой темы.
- Цвета текста (`-fg`) на solid-фоне также унифицированы: в тёмной теме совпадают со светлой (белый для насыщенных цветов, `#3D2E00` для yellow).
- Ранее `--rm-yellow-fg` в тёмной теме был `#0A0800` — заменён на `#3D2E00`, чтобы не создавать лишнего цвета.
- `--glow-violet` в тёмной теме обновлён под новый hex `#A172F8` (`rgba(161,114,248,...)`).

**ДС Веб — FgRow**

- Кнопка копирования в строках `fg` / `fg-subtle` теперь копирует **имя CSS-токена** (`--rm-{color}-fg`), а не `#hex`.
- Имя токена отображается справа, левее кнопки копирования (10px mono, opacity 50%).

### v1.2.0 · 2026-03-12

- 5-уровневая шкала (`-100` / `-300` / `-500` / `-700` / `-900`) + токены `fg` / `fg-subtle`
- CSS-утилиты `.on-yellow`, `.on-violet` и др. для блоков с акцентным фоном
- Компонент `InteractiveHoverButton` (dot-fill анимация) для CTA на `on-yellow`

---

## Summary v1.5.0

### Что обновили

- Шрифт `label`-типографики заменён: `Roboto Mono` → `Loos Condensed`.
- Токен `--font-mono-family` обновлён и используется консистентно в кнопках, навигации, тегах и badges.
- Badge-система упрощена: в системе остаются `neutral` и цветные `{color}-subtle` варианты без отдельного `solid`-набора.

### Что почистили

- Удалён бейдж версии в шапке веб-страницы дизайн-системы.
- Удалены бейджи версии у каждого раздела дизайн-системы.
- Бейдж версии в боковом меню приведён к общему стилю всех badge-компонентов.

---

## 10. Сквозные блоки

### 10.1 InfiniteLogoMarquee (Бесконечная бегущая строка логотипов)

Бегущая строка логотипов партнёров/клиентов с бесконечной CSS-анимацией.

- **Анимация**: Горизонтальный бесконечный скролл (справа налево), CSS `translate3d(-50%)`.
- **Эффект угасания (Fade)**: `mask-image` — прозрачность по краям контейнера (без наложения градиентных плашек).
- **Динамичность**: Логотипы загружаются серверным компонентом из папки `public/hero-logos/` через `getPartnerLogos()` (Node.js `fs`). Добавление/удаление файла автоматически обновляет список.

**Компонент:** `InfiniteLogoMarquee` из `@rocketmind/ui`
**Тип данных:** `LogoMarqueeItem` из `@rocketmind/ui`
**Анимация CSS:** `.partner-logo-marquee-track` (определена в `packages/ui/src/styles/globals.css`)

#### Использование

```tsx
import { InfiniteLogoMarquee } from "@rocketmind/ui";

<InfiniteLogoMarquee
  logos={logos}             // LogoMarqueeItem[] — { alt, src, width?, height? }
  speedSeconds={14}         // скорость одного цикла (по умолчанию 14)
  gap={67}                  // расстояние между логотипами в px (по умолчанию 67)
  maxLogoHeight={39}        // макс. высота логотипа в px (по умолчанию 39)
  fadeWidth={44}            // ширина fade-маски по краям в px (по умолчанию 44)
  className="max-w-[1056px]"
/>
```

#### Управление логотипами

| Действие | Инструкция |
|----------|-----------|
| **Добавить логотип** | Положить SVG-файл в `apps/site/public/hero-logos/`. Имя файла = slug в нижнем регистре, например `sberbank.svg`. Перезапустить dev-сервер. |
| **Удалить логотип** | Удалить файл из `apps/site/public/hero-logos/`. |
| **Изменить порядок** | Отредактировать массив `preferredOrder` в `apps/site/src/lib/partner-logos.ts`. Логотипы, не указанные в массиве, встают в конец в алфавитном порядке. |

#### Требования к логотипам

- **Формат:** SVG (предпочтительно), PNG, WebP, AVIF. JPG допустим, но не рекомендуется.
- **Цвет:** Монохромный белый/серый (для тёмного фона) или нейтральный серый (для автоматической инверсии).
- **Размер SVG:** viewBox пропорциональный, ширина 100–170 px при высоте ~32–40 px.
- **Именование:** `kebab-case`, без пробелов. Пример: `mintsifry.svg`, `t-bank.svg`.
- **Директория логотипов:** `apps/site/public/hero-logos/`
- **Поддерживаемые расширения:** `.svg`, `.png`, `.jpg`, `.jpeg`, `.webp`, `.avif`

Применение: Заменяет статичные блоки логотипов; устанавливается в HeroBlock или в любых других «сквозных» секциях, где требуется social proof.

---

### 10.2 RoundGlassLens (WebGL-линза)

Круглая стеклянная линза с оптическим преломлением, хроматической дисперсией и радиальным блуром. Реализована через WebGL + html2canvas: захватывает сцену под собой и рендерит её с эффектами.

**Компонент:** `RoundGlassLens`
**Путь:** `src/components/ui/round-glass-lens.tsx`
**Демо:** `/lens-demo`

#### Применение

Линза позиционируется **абсолютно** внутри родителя с `position: relative`. Сцена захвата (`sceneRef`) — любой DOM-элемент, обычно тот же контейнер.

```tsx
const sceneRef  = useRef<HTMLDivElement>(null);
const anchorRef = useRef<HTMLImageElement>(null);

<div ref={sceneRef} className="relative overflow-hidden">
  <img ref={anchorRef} src="/logo.svg" />

  <RoundGlassLens
    sceneRef={sceneRef}
    anchorRef={anchorRef}   // линза центрируется на этом элементе
    xOffset={60}            // смещение от центра анкора (px)
    yOffset={18}
    size={280}              // диаметр (px)
    motionParallax          // следит за курсором
  />
</div>
```

#### Dev-воркфлоу (настройка под место)

1. Добавить `showControls storageKey="page-name:lens"` — откроется плавающая панель.
2. Настроить параметры; нажать **COPY** — в буфере JSX-пропсы с текущими значениями.
3. Вставить пропсы, убрать `showControls storageKey`.

#### Props (оптика)

| Prop | Range | Default | Описание |
|---|---|---|---|
| `refraction` | 0–0.12 | 0.03 | Сила преломления |
| `depth` | 0–0.5 | 0.18 | Глубина кривизны (кажущаяся толщина стекла) |
| `dispersion` | 0–5 | 0.36 | Хроматическая дисперсия (радужное кольцо) |
| `distortionRadius` | 0.2–1.5 | 1.08 | Ширина зоны искажения |
| `shadowRadius` | 0.2–1.5 | 0.98 | Радиус краевого затемнения |
| `blur` | 0–2 | 0.18 | Радиальный блур |
| `gradientAngle` | 0–360° | 205 | Угол градиента ободка |
| `shadowEnabled` | bool | true | Краевое затемнение вкл/выкл |

#### Props (позиция)

| Prop | Default | Описание |
|---|---|---|
| `size` | 320 | Диаметр линзы (px) |
| `x` / `y` | центр сцены | Явные координаты в пространстве `sceneRef` |
| `anchorRef` | — | Привязка к элементу (приоритет над x/y) |
| `xOffset` / `yOffset` | 0 | Смещение от анкора или центра сцены (px) |

#### Ободок линзы (CSS)

Стили `.round-glass-lens`, `.round-glass-lens--static` и `.round-glass-lens-canvas` находятся в `globals.css`. CSS-переменная `--lens-gradient-angle` управляет углом градиента ободка.

#### Примечания

- Требует `html2canvas` (динамический импорт, не влияет на бандл).
- Автоматически переключается в статичный режим при `prefers-reduced-motion: reduce`.
- Параллакс активируется только на устройствах с `pointer: fine`.
