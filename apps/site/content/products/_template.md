# Product Page Template

> This file describes the structure of a product `.md` file.
> Each product page is driven by a single `.md` file in this directory.
> The slug is derived from the filename (e.g., `ecosystem-strategy.md` → `/consulting/ecosystem-strategy`).

---

## Frontmatter fields

```yaml
---
# ── Routing ─────────────────────────────────────────────────
slug: "ecosystem-strategy"           # URL slug
category: "consulting"               # consulting | academy | ai-products

# ── Menu / Navigation ──────────────────────────────────────
menuTitle: "Экосистемная стратегия"   # Name shown in header dropdown, mobile menu, footer
menuDescription: "Переход от линейной модели к экосистемной архитектуре роста."

# ── Product Card ────────────────────────────────────────────
cardTitle: "Архитектура устойчивых экосистем"    # Title on product cards across the site
cardDescription: "Создадим стратегию и портфель бизнес-моделей, которые расширят влияние и сделают бизнес более устойчивым"

# ── SEO ─────────────────────────────────────────────────────
metaTitle: "Экосистемная стратегия | Rocketmind"
metaDescription: "Переход от линейной модели к экосистемной архитектуре роста."

# ── Hero ────────────────────────────────────────────────────
hero:
  caption: "консалтинг и стратегии"   # Category label (yellow, uppercase)
  title: |
    ЭКОСИСТЕМНАЯ СТРАТЕГИЯ
    ОТ ПРОДУКТА К СЕТИ ПАРТНЕРОВ
  description: "Спроектируем стратегию и портфель бизнес-моделей, ..."
  ctaText: "оставить заявку"
  factoids:
    - number: "600+"
      label: "кейсов платформ"
      text: "Разобранных кейсов платформ и экосистем в базе знаний Rocketmind"
    - number: "+30%"
      label: "Прирост выручки"
      text: "Прирост выручки у компаний, внедривших экосистемный подход."

# ── About Product ──────────────────────────────────────────
# Optional. If present, renders the about-product section.
# Image is auto-resolved: /images/products/<category>/<slug>/about.<ext>
# If image exists → renders with-image variant, otherwise without.
about:
  caption: "О продукте"
  title: "Экосистемная стратегия"
  description: "Описание продукта..."
  accordion:
    - title: "Быстро занимает ключевые позиции в смежных рынках"
      description: "Подробное описание..."
    - title: "Объединяет партнеров, клиентов и технологии"
      description: "Подробное описание..."

# ── Для кого ───────────────────────────────────────────────
# Optional. White background section with 2–4 fact cards.
# wideColumn: "left" or "right" (only for 3 facts — which column gets the single wide card)
audience:
  tag: "для кого"
  title: "Заголовок секции"
  subtitle: "Подзаголовок (опционально)"
  wideColumn: "right"
  facts:
    - title: "Факт 1"
      text: "Описание факта..."
    - title: "Факт 2"
      text: "Описание факта..."

# ── Other Sections (to be filled) ──────────────────────────
socialProof: null       # 2. Социальное доказательство
tools: null             # 5. Инструменты (опционально)
results: null           # 6. Твёрдые результаты
process: null           # 7. Прозрачный процесс (этапы)
duration: null          # 8. Продолжительность (опционально)
whyRocketmind: null     # 9. Почему Rocketmind
expert: null            # 10. Эксперт (опционально)
cases: null             # 11. Кейсы
reviews: null           # 12. Отзывы
---
```

## Image Convention

Each product gets a folder with images by role:

```
/public/images/products/<category>/<slug>/
  cover.svg      ← product card + hero block
  about.jpg      ← about product section (optional, triggers image variant)
  ...            ← future section images
```

Images are auto-resolved by `category + slug + role`. No explicit paths in frontmatter.

Supported extensions (checked in order): `.svg`, `.png`, `.jpg`, `.webp`

Other content types follow the same pattern:
```
/public/images/academy/<slug>/cover.svg
/public/images/media/<slug>/cover.jpg
```
