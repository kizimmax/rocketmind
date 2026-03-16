#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Update design-system-docs/src/app/page.tsx:
- Remove nav items: visual-language, dot-grid
- Remove Section id="visual-language" block
- Add Bento Grid demo in Spacing section
- Add AnimatedGridLinesDemo function
- Add 8.9 Animated Grid Lines to Animations section
- Move 8.10 Dot Grid Lens from standalone section into Animations section
- Remove standalone Section id="dot-grid" block
"""
import re

path = '/Users/Maxi/GitHub/Rocketmind/design-system-docs/src/app/page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

# ── 1. Remove nav items ──────────────────────────────────────────────────────
c = c.replace('  { id: "visual-language", label: "Визуальный язык" },\n', '')
c = c.replace('  { id: "dot-grid", label: "Точечная сетка" },\n', '')

# ── 2. Remove Visual Language section (including preceding Separator) ────────
c = re.sub(
    r'\n\n          <Separator />\n\n          \{/\* ═══════ 5\. VISUAL LANGUAGE ═══════ \*/\}\n          <Section id="visual-language".*?</Section>',
    '',
    c,
    flags=re.DOTALL,
)

# ── 3. Add AnimatedGridLinesDemo function before the Section wrapper ──────────
animated_grid_demo_fn = '''
/* ───────── ANIMATED GRID LINES DEMO ───────── */
function AnimatedGridLinesDemo() {
  const [key, setKey] = useState(0)
  const hLines = [0, 1, 2, 3]
  const vLines = [0, 1, 2, 3, 4]
  return (
    <div className="space-y-3">
      <button
        onClick={() => setKey((k) => k + 1)}
        className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-wider px-3 py-1 rounded border border-border text-muted-foreground hover:border-foreground transition-colors"
      >
        ↺ Повторить
      </button>
      <div className="relative rounded-md border border-border overflow-hidden h-[200px] bg-background">
        <style>{`
          @keyframes line-h {
            from { opacity: 0; transform: scaleX(0); }
            to   { opacity: 1; transform: scaleX(1); }
          }
          @keyframes line-v {
            from { opacity: 0; transform: scaleY(0); }
            to   { opacity: 1; transform: scaleY(1); }
          }
        `}</style>
        {hLines.map((i) => (
          <div
            key={`h-${key}-${i}`}
            className="absolute left-0 right-0 h-px dark:bg-white/[0.04] bg-black/[0.06]"
            style={{
              top: `${(i + 1) * 20}%`,
              transformOrigin: "left",
              animation: `line-h 0.8s ease-out ${i * 0.05}s both`,
            }}
          />
        ))}
        {vLines.map((i) => (
          <div
            key={`v-${key}-${i}`}
            className="absolute top-0 bottom-0 w-px dark:bg-white/[0.04] bg-black/[0.06]"
            style={{
              left: `${(i + 1) * (100 / (vLines.length + 1))}%`,
              transformOrigin: "top",
              animation: `line-v 0.8s ease-out ${(hLines.length + i) * 0.05}s both`,
            }}
          />
        ))}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-wider text-muted-foreground/40 select-none">
            Hero background grid
          </span>
        </div>
      </div>
      <p className="text-[length:var(--text-12)] text-muted-foreground font-[family-name:var(--font-mono-family)]">
        scaleX/scaleY 0→1 · 800ms ease-out · stagger 0.05s между линиями
      </p>
    </div>
  )
}

'''

c = c.replace('/* ───────── SECTION WRAPPER ───────── */', animated_grid_demo_fn + '/* ───────── SECTION WRAPPER ───────── */')

# ── 4. Add Bento Grid demo to Spacing section ────────────────────────────────
# Insert before the Spacing section's closing </Section>
# The unique anchor is the GridGuides label + </Section> + next Separator comment
bento_demo = '''
            {/* 3.8 Bento Grid */}
            <h3 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] md:text-[length:var(--text-25)] uppercase tracking-[-0.01em] mb-4 mt-10">
              Bento Grid — нерегулярная сетка
            </h3>
            <p className="text-[length:var(--text-14)] text-muted-foreground mb-4 max-w-[640px]">
              Секция Features / «Что умеет сервис» — мозаика карточек разного размера. Минимум 4, максимум 6 ячеек. Ни одна строка не одинакова (принцип асимметрии φ).
            </p>
            <div className="grid grid-cols-12 gap-2 mb-2">
              <div className="col-span-6 border border-border rounded-sm bg-card p-4 flex flex-col gap-1.5 min-h-[100px]">
                <Badge className="w-fit">AI</Badge>
                <p className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-14)] uppercase">Анализ кейса</p>
                <p className="text-[length:var(--text-12)] text-muted-foreground">Агент обрабатывает документы и формирует сводку.</p>
              </div>
              <div className="col-span-6 border border-border rounded-sm bg-card p-4 flex flex-col gap-1.5 min-h-[100px]">
                <Badge variant="secondary" className="w-fit">Авто</Badge>
                <p className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-14)] uppercase">Классификация</p>
                <p className="text-[length:var(--text-12)] text-muted-foreground">Определяет тип дела и маршрутизирует.</p>
              </div>
              <div className="col-span-4 border border-border rounded-sm bg-card p-4 flex flex-col gap-1.5 min-h-[80px]">
                <Badge className="w-fit">Быстро</Badge>
                <p className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-14)] uppercase">Ответ за секунды</p>
              </div>
              <div
                className="col-span-8 border rounded-sm p-5 min-h-[80px] flex items-center"
                style={{ backgroundColor: "var(--rm-yellow-10)", borderColor: "var(--rm-yellow-50)" }}
              >
                <p className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] md:text-[length:var(--text-25)] uppercase tracking-tight leading-tight">
                  AI-система для ведения кейсов
                </p>
              </div>
              <div className="col-span-5 border border-border rounded-sm bg-card p-4 flex flex-col gap-1.5 min-h-[80px]">
                <Badge variant="secondary" className="w-fit">n8n</Badge>
                <p className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-14)] uppercase">Интеграции</p>
                <p className="text-[length:var(--text-12)] text-muted-foreground">Подключается к любому воркфлоу.</p>
              </div>
              <div className="col-span-7 border border-border rounded-sm bg-card p-4 flex flex-col gap-1.5 min-h-[80px]">
                <Badge className="w-fit">Оплата</Badge>
                <p className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-14)] uppercase">Ссылка на оплату</p>
                <p className="text-[length:var(--text-12)] text-muted-foreground">Агент формирует ответ со ссылкой автоматически.</p>
              </div>
            </div>
            <p className="text-[length:var(--text-12)] text-muted-foreground font-[family-name:var(--font-mono-family)]">
              grid-cols-12 → col-span-6+6 / col-span-4+8 / col-span-5+7 — ни одна строка не одинакова
            </p>
'''

c = c.replace(
    '            <p className="text-[length:var(--text-12)] text-muted-foreground font-[family-name:var(--font-mono-family)]">\n              GridGuides cols=3 guideVisible=true cellPadding=12\n            </p>\n          </Section>',
    '            <p className="text-[length:var(--text-12)] text-muted-foreground font-[family-name:var(--font-mono-family)]">\n              GridGuides cols=3 guideVisible=true cellPadding=12\n            </p>' + bento_demo + '          </Section>',
)

# ── 5. Extract dot-grid inner content ────────────────────────────────────────
dg_match = re.search(
    r'<Section id="dot-grid" title="11\. Точечная сетка" version=\{DS_VERSION\}>\n(.*?)\n          </Section>',
    c,
    flags=re.DOTALL,
)

if not dg_match:
    raise RuntimeError('Could not find dot-grid section')

dg_inner = dg_match.group(1)

# ── 6. Add 8.9 + 8.10 to Animations section (before its closing </Section>) ──
anim_addition = '''
            {/* 8.9 Animated Grid Lines */}
            <h3 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] md:text-[length:var(--text-25)] uppercase tracking-[-0.01em] mb-4 mt-8">
              8.9 Animated Grid Lines
            </h3>
            <p className="text-[length:var(--text-14)] text-muted-foreground mb-4">
              Тонкие линии hero-секции материализуют каркас дизайна. Только одноразовая анимация при загрузке — после появления статичны. Используется с токеном <code className="text-[length:var(--text-12)] bg-muted px-1 py-0.5 rounded font-[family-name:var(--font-mono-family)]">--duration-grid</code> (800ms).
            </p>
            <AnimatedGridLinesDemo />

            {/* 8.10 Dot Grid Lens */}
            <h3 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] md:text-[length:var(--text-25)] uppercase tracking-[-0.01em] mb-4 mt-10">
              8.10 Dot Grid Lens
            </h3>
'''

# The closing tag of the Animations section is followed by Tooltips separator
animations_close = '          </Section>\n\n          <Separator />\n\n          {/* ═══════ 10. TOOLTIPS ═══════ */}'
new_animations_close = anim_addition + dg_inner + '\n          </Section>\n\n          <Separator />\n\n          {/* ═══════ 10. TOOLTIPS ═══════ */}'
c = c.replace(animations_close, new_animations_close)

# ── 7. Remove standalone dot-grid section + its preceding Separator ───────────
c = re.sub(
    r'\n\n          <Separator />\n\n          \{/\* ───── DOT GRID LENS ───── \*/\}\n          <Section id="dot-grid".*?</Section>',
    '',
    c,
    flags=re.DOTALL,
)

# ── 8. Fix section title from "11." to "8.10" in dot-grid title (already moved) ─
# The dot-grid content originally had "title="11. Точечная сетка"" - that section is gone.
# The <Section> title attribute no longer exists since we used the inner content only.

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)

print('ДС Вэб (page.tsx) updated successfully')
