#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Update design/design-system.md:
- Remove section 5 (Visual Language)
- Move 5.3 Bento Grid → section 3 end
- Move 5.2 Animated Grid Lines → section 8 (as 8.9)
- Move section 9 Dot Grid Lens → section 8 (as 8.10)
"""
import re

path = '/Users/Maxi/GitHub/Rocketmind/design/design-system.md'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

# ── 1. Remove status table row ──────────────────────────────────────────────
c = c.replace('| 5. Visual Language | ✅ Готово |\n', '')

# ── 2. Delete section 5 entirely ────────────────────────────────────────────
# From the --- (section separator before ## 5.) up to (not including) \n---\n\n## 6.
c = re.sub(
    r'\n---\n\n## 5\. Visual Language.*?(?=\n---\n\n## 6\.)',
    '',
    c,
    flags=re.DOTALL,
)

# ── 3. Add Bento Grid (### 3.5) at end of section 3 ─────────────────────────
bento = '''
### 3.5 Bento Grid (нерегулярная сетка карточек)

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

'''

c = c.replace('\n## 4. Border Radius & Shadows', bento + '## 4. Border Radius & Shadows')

# ── 4. Add 8.9 Animated Grid Lines + convert section 9 → 8.10 ───────────────
animated_grid = '''

### 8.9 Animated Grid Lines (анимированная сетка)

**Источник:** 21st.dev hero-minimalism.
**Суть:** тонкие линии-разделители появляются при загрузке страницы, визуализируя структуру/архитектуру. Сетка — не декор, а материализация каркаса дизайна.

**Правила применения:**
- Только в hero-секциях (лендинг, SaaS-лендинг, страница агента)
- Линии горизонтальные + вертикальные, совпадают с колонками/строками сетки
- Цвет: `rgba(0,0,0,0.06)` light / `rgba(255,255,255,0.04)` dark — почти невидимые
- Анимация появления: `scaleX/scaleY` от 0 до 1, `duration: 0.8s`, `easing: ease-out`, `stagger: 0.05s` между линиями
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
  animation: line-appear 0.8s ease-out forwards;
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

'''

# The section 9 starts right after "---\n\n## 9. Микроинтерактивы — Dot Grid Lens\n\n### 9.1 Концепция"
c = c.replace(
    '\n---\n\n## 9. Микроинтерактивы — Dot Grid Lens\n\n### 9.1 Концепция',
    animated_grid + '#### Концепция',
)

# ── 5. Rename remaining 9.x subsections → #### ──────────────────────────────
renames = [
    ('### 9.2 Визуальные параметры',              '#### Визуальные параметры'),
    ('### 9.3 Алгоритм расчёта масштаба точки',   '#### Алгоритм расчёта масштаба точки'),
    ('### 9.4 Реализация (Canvas)',               '#### Реализация (Canvas)'),
    ('### 9.5 Вариант с акцентным цветом в центре линзы', '#### Вариант с акцентным цветом'),
    ('### 9.6 Touch / Mobile',                    '#### Touch / Mobile'),
    ('### 9.7 Производительность',                '#### Производительность'),
    ('### 9.8 Применение в экранах',              '#### Применение в экранах'),
]
for old, new in renames:
    c = c.replace(old, new)

# ── 6. Clean up inline (9.x) cross-references ───────────────────────────────
c = c.replace('монохромный вариант (9.4)', 'монохромный вариант')
c = c.replace('Акцентный (9.5)', 'Акцентный')
c = c.replace('Монохромный (9.4)', 'Монохромный')
c = c.replace('(9.4), opacity: 0.5', 'opacity: 0.5')

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)

print('ДС МД updated successfully')
