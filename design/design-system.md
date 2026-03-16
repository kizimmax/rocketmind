# Rocketmind Design System

> Единая дизайн-система для SaaS-сервиса и маркетингового сайта Rocketmind.
> Основана на компонентах **shadcn/ui** + кастомизация под бренд.
> Источник правды для всех экранов: лендинг, авторизация, main app, каталог агентов.
>
> **Version:** 1.2.0 · **Updated:** 2026-03-12

---

## Статус документа

| Блок | Статус |
|------|--------|
| 1. Цветовая палитра | ✅ Готово (v1.3 — 5-level scale + fg tokens + .on-color) |
| 2. Типография | ✅ Готово |
| 3. Spacing & Grid | ✅ Готово |
| 4. Border Radius & Shadows | ✅ Готово |
| 6. Компоненты (Button, Input, Card...) | ✅ Готово |
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

Единая числовая шкала `--rm-gray-{N}` — основа всех нейтральных решений. Каждый уровень несёт конкретную UI-роль. shadcn-токены (`background`, `border`, `muted`...) являются алиасами на эту шкалу.

#### Уровни и их роли

| Уровень | CSS-переменная | Light | Dark | Роль |
|---------|---------------|-------|------|------|
| 1 | `--rm-gray-1` | `#FAFAFA` | `#121212` | Фон страницы — `background` |
| 2 | `--rm-gray-2` | `#F5F5F5` | `#1A1A1A` | Тихая поверхность — `card`, `popover` |
| 3 | `--rm-gray-3` | `#EBEBEB` | `#242424` | Hover-фон компонентов — `muted`, `accent`, `secondary` |
| 4 | `--rm-gray-4` | `#CBCBCB` | `#404040` | Дефолтный бордер — `border`, `input` |
| 5 | `--rm-gray-5` | `#A3A3A3` | `#5C5C5C` | Hover/active бордер |
| 6 | `--rm-gray-6` | `#666666` | `#939393` | Второстепенный текст — `muted-foreground` |
| fg | `--rm-gray-fg` | `#2D2D2D` | `#F0F0F0` | Основной текст — `foreground` |

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
| `background` | `--rm-gray-1` | `#FAFAFA` | `#121212` | Основной фон страницы |
| `foreground` | `--rm-gray-fg` | `#2D2D2D` | `#F0F0F0` | Основной текст |
| `muted` | `--rm-gray-3` | `#EBEBEB` | `#242424` | Приглушённый фон |
| `muted-foreground` | `--rm-gray-6` | `#666666` | `#939393` | Второстепенный текст |
| `border` | `--rm-gray-4` | `#CBCBCB` | `#404040` | Разделители, бордеры |
| `input` | `--rm-gray-4` | `#CBCBCB` | `#404040` | Бордер инпутов |
| `ring` | — | `#FFCC00` | `#FFCC00` | Фокус-кольцо (жёлтый) |
| `card` | `--rm-gray-2` | `#F5F5F5` | `#1A1A1A` | Фон карточек |
| `card-foreground` | `--rm-gray-fg` | `#2D2D2D` | `#F0F0F0` | Текст в карточках |
| `popover` | `--rm-gray-2` | `#F5F5F5` | `#1A1A1A` | Фон поповеров/дропдаунов |
| `popover-foreground` | `--rm-gray-fg` | `#2D2D2D` | `#F0F0F0` | Текст в поповерах |
| `secondary` | `--rm-gray-3` | `#EBEBEB` | `#242424` | Второстепенный фон |
| `secondary-foreground` | `--rm-gray-fg` | `#2D2D2D` | `#F0F0F0` | Текст на secondary |
| `accent` | `--rm-gray-3` | `#EBEBEB` | `#242424` | Hover-состояния |
| `accent-foreground` | `--rm-gray-fg` | `#2D2D2D` | `#F0F0F0` | Текст на accent |
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
| **Yellow** L | `#FFCC00` | `#FFE066` | `#FFF0AA` | `#FFF7CC` | `#FFFEF3` | `#3D2E00` | `#5C4200` |
| **Yellow** D | `#FFCC00` | `#B38F00` | `#7A6200` | `#4A3C00` | `#3D3300` | `#0A0800` | `#FFE566` |
| **Violet** L | `#A172F8` | `#C4A0FB` | `#DCC8FF` | `#EDE0FF` | `#FBFAFE` | `#fff` | `#3D1A8A` |
| **Violet** D | `#B48DFA` | `#8A5FF5` | `#5A3D99` | `#2E1F66` | `#20143D` | `#0A050F` | `#DCC8FF` |
| **Sky** L | `#56CAEA` | `#8ADCF2` | `#C3ECF7` | `#E0F6FB` | `#F7FDFF` | `#fff` | `#0D4D5C` |
| **Sky** D | `#7AD6EF` | `#3AAACE` | `#1A5F72` | `#0A2D38` | `#051A20` | `#020D10` | `#C3ECF7` |
| **Terracotta** L | `#FE733A` | `#FFA07A` | `#FFD6AD` | `#FFECE0` | `#FFFAF7` | `#fff` | `#5C1A00` |
| **Terracotta** D | `#FF8A5C` | `#CC5522` | `#7A2E10` | `#3D1507` | `#2A0F05` | `#0A0300` | `#FFD6AD` |
| **Pink** L | `#FF54AC` | `#FF8FCA` | `#FFB8D9` | `#FFE0EF` | `#FFF8FC` | `#fff` | `#6B0033` |
| **Pink** D | `#FF7EC5` | `#CC3D88` | `#7A1A55` | `#3D0D2A` | `#25061A` | `#0A0208` | `#FFB8D9` |
| **Blue** L | `#4A56DF` | `#8A94EC` | `#BFC4F3` | `#E0E2FA` | `#F9FAFF` | `#fff` | `#0D1466` |
| **Blue** D | `#7A84F0` | `#3D4ACC` | `#1E2870` | `#0D1238` | `#060A24` | `#020310` | `#BFC4F3` |
| **Red** L | `#ED4843` | `#F48A87` | `#FFBCBA` | `#FFE0DF` | `#FFF9F8` | `#fff` | `#5C0A08` |
| **Red** D | `#F47370` | `#CC2E2A` | `#7A1715` | `#3D0908` | `#250504` | `#0A0202` | `#FFBCBA` |
| **Green** L | `#9AF576` | `#C0F9A8` | `#D8F4CD` | `#ECFAE6` | `#F7FEF3` | `#1A4A05` | `#1A4A05` |
| **Green** D | `#B5FA97` | `#6ACC44` | `#2A6E15` | `#133808` | `#0A2005` | `#020A01` | `#D8F4CD` |

---

### 1.5 Инвертированные поверхности (`.on-{color}`)

CSS-утилиты для блоков с акцентным фоном. Переопределяют `--foreground`, `--muted-foreground`, `--border` внутри контейнера — все дочерние токены становятся читаемыми автоматически.

```html
<section class="on-yellow rounded-xl px-8 py-10">
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
   * 1 — page bg · 2 — subtle surface · 3 — hover bg
   * 4 — default border · 5 — hover border · 6 — secondary text · fg — primary text
  */
  --rm-gray-1:  #FAFAFA;
  --rm-gray-2:  #F5F5F5;
  --rm-gray-3:  #EBEBEB;
  --rm-gray-4:  #CBCBCB;
  --rm-gray-5:  #A3A3A3;
  --rm-gray-6:  #666666;
  --rm-gray-fg: #2D2D2D;

  /* === Gray Alpha (overlays, tooltips, glass) === */
  --rm-gray-alpha-100: rgba(0,0,0, 0.06);
  --rm-gray-alpha-200: rgba(0,0,0, 0.10);
  --rm-gray-alpha-400: rgba(0,0,0, 0.20);
  --rm-gray-alpha-600: rgba(0,0,0, 0.40);
  --rm-gray-alpha-800: rgba(0,0,0, 0.70);

  /* === shadcn aliases === */
  --background: var(--rm-gray-1);
  --foreground: var(--rm-gray-fg);
  --muted: var(--rm-gray-3);
  --muted-foreground: var(--rm-gray-6);
  --border: var(--rm-gray-4);
  --input: var(--rm-gray-4);
  --ring: #FFCC00;
  --card: #FFFFFF;
  --card-foreground: var(--rm-gray-fg);
  --popover: #FFFFFF;
  --popover-foreground: var(--rm-gray-fg);
  --secondary: var(--rm-gray-3);
  --secondary-foreground: var(--rm-gray-fg);
  --accent: var(--rm-gray-3);
  --accent-foreground: var(--rm-gray-fg);
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
  --rm-gray-1:  #121212;
  --rm-gray-2:  #1A1A1A;
  --rm-gray-3:  #242424;
  --rm-gray-4:  #404040;
  --rm-gray-5:  #5C5C5C;
  --rm-gray-6:  #939393;
  --rm-gray-fg: #F0F0F0;

  /* === Gray Alpha (dark) === */
  --rm-gray-alpha-100: rgba(255,255,255, 0.06);
  --rm-gray-alpha-200: rgba(255,255,255, 0.10);
  --rm-gray-alpha-400: rgba(255,255,255, 0.20);
  --rm-gray-alpha-600: rgba(255,255,255, 0.40);
  --rm-gray-alpha-800: rgba(255,255,255, 0.70);

  /* === shadcn aliases === */
  --background: var(--rm-gray-1);
  --foreground: var(--rm-gray-fg);
  --muted: var(--rm-gray-3);
  --muted-foreground: var(--rm-gray-6);
  --border: var(--rm-gray-4);
  --input: var(--rm-gray-4);
  --ring: #FFCC00;
  --card: var(--rm-gray-2);
  --card-foreground: var(--rm-gray-fg);
  --popover: var(--rm-gray-2);
  --popover-foreground: var(--rm-gray-fg);
  --secondary: var(--rm-gray-3);
  --secondary-foreground: var(--rm-gray-fg);
  --accent: var(--rm-gray-3);
  --accent-foreground: var(--rm-gray-fg);
  --destructive: #FF6B6B;
  --destructive-foreground: #FFFFFF;
  --primary: #FFCC00;
  --primary-foreground: #121212;

  /* === Brand accents (dark) === */
  --rm-yellow-100: #FFCC00; --rm-yellow-50: #7A6200; --rm-yellow-10: #3D3300;
  --rm-violet-100: #B48DFA; --rm-violet-50: #5A3D99; --rm-violet-10: #20143D;
  --border-on-colored: #DBC800;

  /* === Categorical colors (dark) === */
  --rm-terracotta-100: #FF8A5C; --rm-terracotta-50: #7A2E10; --rm-terracotta-10: #2A0F05;
  --rm-sky-100: #7AD6EF;        --rm-sky-50: #1A5F72;        --rm-sky-10: #051A20;
  --rm-pink-100: #FF7EC5;       --rm-pink-50: #7A1A55;       --rm-pink-10: #25061A;
  --rm-blue-100: #7A84F0;       --rm-blue-50: #1E2870;       --rm-blue-10: #060A24;
  --rm-red-100: #F47370;        --rm-red-50: #7A1715;        --rm-red-10: #250504;
  --rm-green-100: #B5FA97;      --rm-green-50: #2A6E15;      --rm-green-10: #0A2005;
}
```

---

### 1.6 Таблица соответствия: твои цвета → shadcn-токены

| Твоё название | HEX | shadcn-токен | Роль |
|--------------|-----|-------------|------|
| Фон светлый | `#FAFAFA` | `--background` | Фон страниц |
| Фон тёмный | `#121212` | `--background` (dark) | Фон страниц (dark) |
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
- **4 категории стилей**: Heading, Label, Copy, Accent — по аналогии с Geist Design System.
- **Shadcn-совместимость** — все размеры маппируются на Tailwind-классы или кастомные CSS-переменные.
- Никаких произвольных размеров вне шкалы.

---

### 2.1 Шрифты

| Шрифт | Роль | Начертание | Характер |
|-------|------|-----------|---------|
| **Roboto Condensed** (All Caps) | Заголовки всех уровней (H1–H4) | Bold / ExtraBold, uppercase | Сдержанный, технологичный, уверенный |
| **Roboto Mono** (All Caps) | Навигация, кнопки, технические обозначения, числовые данные | Medium / SemiBold, uppercase | Инженерный, упорядоченный |
| **Roboto** | Основной текст, описания, body | Regular / Medium | Читабельный, нейтральный, открытый диалог |
| **Shantell Sans** | Подписи в стикерах, акцентные подписи, эмоциональные вставки | Regular | Рукописный, динамичный, акцентирующий внимание |

> **Подключение через Google Fonts:**
> `Roboto Condensed` (400, 700, 800), `Roboto Mono` (400, 500, 600), `Roboto` (400, 500), `Shantell Sans` (400).

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
| `19` | `19` | `1.1875rem` | `--text-19` | Lead-body, крупный copy, H4 |
| `25` | `25` | `1.5625rem` | `--text-25` | H3, подзаголовки секций |
| `31` | `31` | `1.9375rem` | `--text-31` | H2 medium |
| `50` | `50` | `3.125rem` | `--text-50` | H2 hero, заголовки страниц |
| `81` | `81` | `5.0625rem` | `--text-81` | H1 Hero, главный экранный заголовок |

> Разрыв 26→42→68 заменён на более плавный 25→31→50→81. Все значения получены через φ или √φ от базы 12px.

---

### 2.3 Четыре категории стилей (Geist-подход)

Все текстовые стили делятся на **4 смысловые категории**:

#### Heading — заголовки и дисплейный текст
Roboto Condensed, uppercase. Используются для страниц, секций, Hero-блоков.

| Токен | px | Вес | Line-height | Letter-spacing | Применение |
|-------|----|-----|------------|---------------|-----------|
| `heading-81` | 81 | 800 ExtraBold | 1.0 | -0.02em | H1 Hero |
| `heading-50` | 50 | 700 Bold | 1.05 | -0.02em | H2, заголовки страниц |
| `heading-31` | 31 | 700 Bold | 1.1 | -0.015em | H2 secondary |
| `heading-25` | 25 | 700 Bold | 1.2 | -0.01em | H3, подзаголовки секций |
| `heading-19` | 19 | 700 Bold | 1.3 | -0.005em | H4, заголовки карточек |

#### Label — однострочные UI-элементы
Roboto Mono, uppercase. Кнопки, навигация, теги, числовые данные. **Только однострочный текст.**

| Токен | px | Вес | Line-height | Letter-spacing | Применение |
|-------|----|-----|------------|---------------|-----------|
| `label-19` | 19 | 600 SemiBold | 1.0 | 0.06em | Маркетинговые акценты, hero-теги, крупные badges |
| `label-16` | 16 | 500 Medium | 1.0 | 0.08em | Nav-items, primary button |
| `label-14` | 14 | 500 Medium | 1.0 | 0.08em | Secondary button, tag, badge |
| `label-12` | 12 | 500 Medium | 1.0 | 0.06em | Tiny button в input-field |

#### Copy — многострочный текст
Roboto, normal case. Описания, body, captions. Повышенный line-height для комфортного чтения.

| Токен | px | Вес | Line-height | Letter-spacing | Применение |
|-------|----|-----|------------|---------------|-----------|
| `copy-25` | 25 | 400 Regular | 1.4 | -0.01em | Маркетинговый крупный текст, hero-субтайтл |
| `copy-19` | 19 | 400 Regular | 1.5 | 0 | Lead / intro paragraph |
| `copy-16` | 16 | 400 Regular | 1.618 | 0 | **Body** — основной текст |
| `copy-16-strong` | 16 | 500 Medium | 1.618 | 0 | Body strong, акцент в тексте |
| `copy-14` | 14 | 400 Regular | 1.5 | 0.01em | Small, caption, подпись |
| `copy-14-mono` | 14 | 400 Regular | 1.5 | 0.02em | Inline code, технические строки |
| `copy-12` | 12 | 400 Regular | 1.4 | 0.02em | Micro, copyright, служебный текст |

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
    --font-mono: 'Roboto Mono', monospace;
    --font-body: 'Roboto', sans-serif;
    --font-accent: 'Shantell Sans', cursive;

    /* === Размерная шкала (Golden Ratio от 12px) === */
    --text-12: 0.75rem;     /* 12px — минимум */
    --text-14: 0.875rem;    /* 14px — √φ от 12 */
    --text-16: 1rem;        /* 16px — стандарт web */
    --text-19: 1.1875rem;   /* 19px — 12 × φ */
    --text-25: 1.5625rem;   /* 25px — 16 × √φ */
    --text-31: 1.9375rem;   /* 31px — 19 × φ */
    --text-50: 3.125rem;    /* 50px — 31 × φ */
    --text-81: 5.0625rem;   /* 81px — 50 × φ */

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
      mono: ['Roboto Mono', 'monospace'],
      body: ['Roboto', 'sans-serif'],
      accent: ['Shantell Sans', 'cursive'],
    },
    fontSize: {
      // Размерная шкала (Golden Ratio от 12px)
      '12': ['0.75rem',    { lineHeight: '1.4' }],   // micro
      '14': ['0.875rem',   { lineHeight: '1.5' }],   // caption / label-sm
      '16': ['1rem',       { lineHeight: '1.618' }], // body base
      '19': ['1.1875rem',  { lineHeight: '1.5' }],   // lead / H4
      '25': ['1.5625rem',  { lineHeight: '1.2' }],   // H3
      '31': ['1.9375rem',  { lineHeight: '1.1' }],   // H2 secondary
      '50': ['3.125rem',   { lineHeight: '1.05' }],  // H2 hero
      '81': ['5.0625rem',  { lineHeight: '1.0' }],   // H1 hero
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

Шкала минимальная — small-first. За основу взят `--radius` из shadcn (`0.5rem`/`8px`), уменьшен вдвое как базовый.

| Токен | px | rem | Tailwind | Применение |
|-------|-----|-----|---------|-----------|
| `--radius-none` | `0` | `0` | `rounded-none` | Острые края: разделители, таблицы, code-блоки |
| `--radius-sm` | `4` | `0.25rem` | `rounded-sm` | Мелкие элементы: badge, tag, tooltip, kbd |
| `--radius` | `6` | `0.375rem` | `rounded-md` | **Базовый.** Button, Input, Card, Select |
| `--radius-lg` | `8` | `0.5rem` | `rounded-lg` | Панели, Sidebar, Modal, Popover |
| `--radius-xl` | `12` | `0.75rem` | `rounded-xl` | Крупные карточки, preview-блоки |
| `--radius-full` | `9999` | `624.9375rem` | `rounded-full` | Аватары, pill-badges, toggle |

> shadcn по умолчанию использует `--radius: 0.5rem`. Переопределяем на `0.375rem` — чуть острее, технологичнее.

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
    --radius:      0.375rem;   /* 6px — базовый, переопределяет shadcn */
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
      DEFAULT: '0.375rem', // 6px — переопределяем дефолт
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
- Шрифт интерактивных элементов (кнопки, nav, теги) — Roboto Mono, uppercase, `letter-spacing: 0.08em`
- Flat-стиль — никаких теней, глубина через бордер и цвет фона
- Свечений нет — flat-стиль без glow-эффектов
- Radius базовый `6px` (`--radius`), pill-форм нет

---

### 6.1 Button

#### Варианты

| Вариант | Роль | Когда использовать |
|---------|------|-------------------|
| `primary` | Главный CTA | Одна кнопка на экране/секции. «Попробовать», «Начать», «Отправить» |
| `secondary` | Вторичный CTA | Рядом с primary или как самостоятельное второстепенное действие |
| `ghost` | Третичный / nav-действие | Внутри панелей, sidebar, toolbar — когда кнопка не должна отвлекать |
| `destructive` | Опасное действие | Удаление, архивация. Всегда с подтверждением |
| `outline` | Нейтральный | Фильтры, чипы-выборы, состояния on/off |

#### Размеры

| Размер | Height | Padding H | Font | Применение |
|--------|--------|-----------|------|-----------|
| `sm` | `32px` | `12px` | `11px` | Inline-действия, compact UI (sidebar, теги) |
| `md` *(default)* | `40px` | `16px` | `13px` | Основной размер — формы, карточки |
| `lg` | `48px` | `24px` | `13px` | Hero CTA, главные призывы к действию |
| `icon` | `40px` | `0` / `10px` | — | Квадратная кнопка с иконкой, без текста |

#### Состояния

| Состояние | Primary | Secondary | Ghost |
|-----------|---------|-----------|-------|
| `default` | bg `#FFCC00`, text `#121212` | bg transparent, border `--border`, text `--foreground` | bg transparent, text `--muted-foreground` |
| `hover` | bg `#FFE040` (–10% яркости) | bg `--accent` | bg `--accent`, text `--foreground` |
| `active` | bg `#E6B800` (–20%) | bg `--accent` | bg `--accent` |
| `focus` | outline: `--ring` | outline: `--ring` | outline: `--ring` |
| `disabled` | opacity `0.4`, cursor not-allowed | opacity `0.4` | opacity `0.3` |
| `loading` | Spinner вместо текста, opacity `0.8` | Spinner | Spinner |

#### Tailwind-классы (базовый button)

```tsx
// primary / md
className="
  inline-flex items-center justify-center gap-2
  h-10 px-4
  rounded-md
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
  rounded-md border border-border
  bg-transparent text-foreground
  font-mono text-[13px] uppercase tracking-[0.08em]
  transition-all duration-150
  hover:bg-accent
  focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring
  disabled:opacity-40 disabled:pointer-events-none
"

// ghost / md
className="
  inline-flex items-center justify-center gap-2
  h-10 px-4
  rounded-md
  bg-transparent text-muted-foreground
  font-mono text-[13px] uppercase tracking-[0.08em]
  transition-all duration-150
  hover:bg-accent hover:text-foreground
  focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring
  disabled:opacity-30 disabled:pointer-events-none
"
```

---

### 6.2 Input

Используется в: авторизация (email, code), чат (поле ввода сообщения), поиск в каталоге агентов, фильтры.

#### Варианты

| Вариант | Применение |
|---------|-----------|
| `default` | Стандартное текстовое поле (email, имя, поиск) |
| `chat` | Поле ввода сообщения в чат-интерфейсе. Multiline, растёт по контенту |
| `code` | Поле ввода 6-значного кода авторизации. Моноширинный шрифт, крупный |
| `search` | С иконкой лупы слева, очищающей кнопкой справа |

#### Размеры

| Размер | Height | Padding H | Font |
|--------|--------|-----------|------|
| `sm` | `32px` | `12px` | `13px` |
| `md` *(default)* | `40px` | `16px` | `16px` |
| `lg` | `48px` | `16px` | `16px` |

#### Состояния

| Состояние | Описание |
|-----------|---------|
| `default` | border `--border`, bg `--background`, text `--foreground` |
| `placeholder` | text `--muted-foreground` |
| `focus` | border `--ring`. Bg без изменений |
| `filled` | border `--border`. Нет отдельного стиля — текст говорит сам |
| `error` | border `--destructive`, text `--destructive` под полем (caption, 13px) |
| `disabled` | opacity `0.4`, cursor `not-allowed`, bg `--muted` |

#### Tailwind-классы

```tsx
// default / md
className="
  w-full h-10 px-4
  rounded-md border border-border
  bg-background text-foreground
  font-body text-base
  placeholder:text-muted-foreground
  transition-all duration-150
  focus:outline-none focus:border-ring
  disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-muted
"

// chat — multiline textarea
className="
  w-full min-h-[48px] max-h-[200px] px-4 py-3
  rounded-lg border border-border
  bg-background text-foreground
  font-body text-base leading-[1.618]
  placeholder:text-muted-foreground
  resize-none overflow-auto
  transition-all duration-150
  focus:outline-none focus:border-ring
"

// code — 6 символов авторизации
className="
  w-14 h-14 text-center
  rounded-md border border-border
  bg-background text-foreground
  font-mono text-2xl tracking-[0.08em]
  transition-all duration-150
  focus:outline-none focus:border-ring
"
```

#### Структура поля с лейблом

```tsx
<div className="flex flex-col gap-1.5">
  <label className="font-mono text-[13px] uppercase tracking-[0.08em] text-muted-foreground">
    Email
  </label>
  <input ... />
  {/* error */}
  <span className="font-body text-[13px] text-destructive">
    Введите корректный email
  </span>
</div>
```

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
┌─────────────────────────────┐  ← border 1px --border, radius 4px
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
| `loading` | skeleton `--muted` пульсирует | skeleton `--muted` |

#### Tailwind-классы

```tsx
// default card
className="
  relative flex flex-col gap-4 p-6
  rounded-sm border border-border
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
  rounded-sm border border-border
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
  rounded-sm border border-transparent
  transition-all duration-150
  hover:bg-accent hover:border-border
  data-[active=true]:bg-accent data-[active=true]:border-[--ring]
  cursor-pointer
"

// bento cell
className="
  relative overflow-hidden flex flex-col gap-4 p-6
  rounded-sm border
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

Набор типовых карточек для маркетплейса, каталога и лендинга. Все строятся на базовых токенах карточки (`--card`, `--border`, `--radius-sm`).

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

- **Radius:** `rounded-sm` (`4px`)
- **Padding:** `p-6` (`24px`) для M/L, `p-5` (`20px`) для S
- **Hover:** `hover:border-muted-foreground` в светлой, `dark:hover:border-white/[0.20]` в тёмной (единственный вариант для всех bg-card карточек)
- **Image-area (S/M):** фото/обложка занимает верхние `38%` карточки (золотое сечение)
- **Badge:** mono-шрифт, uppercase, `4px` radius, `--muted` фон

---

### Card: Продукт / Услуга (`product`)

Используется в каталоге продуктов или услуг эксперта.

```
┌──────────────────────────────┐  ← radius 4px, border --border
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
| Обложка | `h-40` (`160px`), `object-cover`, `rounded-t-sm`, `overflow-hidden` |
| Категория | Badge: `bg-muted`, mono 10px uppercase, `rounded-sm` |
| Название | H4: `font-heading font-bold text-xl uppercase tracking-[-0.005em]` |
| Описание | `font-body text-base text-muted-foreground leading-[1.618]` line-clamp-2 |
| Цена | `font-mono font-semibold text-xl` + опционально перечёркнутая старая цена |
| CTA | Button `primary sm` или `link-cta` |

```tsx
<div className="
  flex flex-col overflow-hidden
  rounded-sm border border-border bg-card
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
┌──────────────────────────────┐  ← radius 12px
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
| Фото | `h-48` (`192px`), `object-cover`, `rounded-t-sm`, ч/б фильтр (hover → color) |
| Имя | H4: `font-heading font-bold text-xl uppercase` |
| Специализация | `font-mono text-[13px] uppercase tracking-[0.08em] text-muted-foreground` |
| Bio | `font-body text-base text-muted-foreground` line-clamp-2 |
| Теги | Badge `bg-muted rounded-sm` 10px mono, max 3 тега |

```tsx
<div className="
  flex flex-col overflow-hidden
  rounded-sm border border-border bg-card
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
┌──────────────────────────────┐  ← radius 4px, violet hover border
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
  rounded-sm border border-border bg-card
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
┌──────────────────────────────┐  ← radius 4px, без hover CTA
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
  rounded-sm border border-border bg-card
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
┌──────────────────────────────┐  ← radius 4px
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
  rounded-sm border border-border bg-card
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
┌──────────────────────────────┐  ← radius 4px
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
| Обложка | `h-36`, `rounded-t-sm`, gradient overlay `from-transparent to-card/60` |
| Уровень | Badge: `bg-[#56CAEA]/20 text-[#56CAEA]` — начинающий / продвинутый |
| Формат | Badge: `bg-muted` — видео / текст / воркшоп |
| Прогресс | `h-1 rounded-full bg-muted` + `bg-primary` для заполненной части |
| Рейтинг | `★` + `font-mono text-[10px]` число |

```tsx
<div className="
  flex flex-col overflow-hidden
  rounded-sm border border-border bg-card
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
┌──────────────────────────────┐  ← radius 4px
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
  rounded-sm border border-border bg-card
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
┌──────────────────────────────┐  ← radius 4px, yellow accent
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
  rounded-sm border border-border bg-card
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

> Футер всегда на тёмном фоне (`--background` в `.dark`-теме или явный `#121212`). Используется `_dark_background` версия с дескриптором (`with_descriptor`).

### Токены

```css
.site-footer {
  background: var(--background);          /* тёмный фон (#121212 в .dark) */
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

**Основная библиотека:** [Lucide Icons](https://lucide.dev/) — outline-стиль, 24px viewbox, stroke 1.5px.

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
- Stroke-width фиксированный: `1.5px` — не масштабируется при resize

```tsx
// Правильно — наследует цвет
<Icon size={20} className="text-muted-foreground hover:text-foreground transition-colors" />

// Акцент
<Icon size={20} className="text-[#FFCC00]" />
```

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
- Стиль: outline, тот же stroke 1.5px

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
    var(--muted) 0%,
    hsl(from var(--muted) h s calc(l + 5%)) 50%,
    var(--muted) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: var(--radius);
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
