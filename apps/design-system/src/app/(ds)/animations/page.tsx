"use client"

import React from "react"
import { Sparkles, Eye, Zap, Search } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, Separator } from "@rocketmind/ui"
import { CopyButton } from "@/components/copy-button"
import {
  Section, SubSection, SpecBlock, TokenRow, TimingRow, EasingDemo, AnimDemoCard,
  ToggleAnimCard, LinkCTADemo,
} from "@/components/ds/shared"
import { DotGridDemo, AnimatedGridLinesDemo, LensShowcase } from "@/components/ds/animation-demos"
import { WaveAnimation } from "@rocketmind/ui"
import { SceneHero, SceneGradient, SceneMinimal, LensPropsTable } from "@/components/ds/LensDemoScenes"

export default function AnimationsPage() {
  return (
    <>
      <Section id="animations" title="8. Анимации и Движение">
        <style>{`
          @keyframes typing-pulse {
            0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
            40% { opacity: 1; transform: scale(1); }
          }
          @keyframes shimmer-anim {
            from { background-position: 200% 0; }
            to   { background-position: -200% 0; }
          }
          @keyframes fade-in-down {
            from { opacity: 0; transform: translateY(-8px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes slide-in-bottom {
            from { opacity: 0; transform: translateY(16px) scale(0.98); }
            to   { opacity: 1; transform: translateY(0) scale(1); }
          }
          @keyframes toast-enter {
            from { opacity: 0; transform: translateX(24px); }
            to   { opacity: 1; transform: translateX(0); }
          }
          @keyframes bubble-enter {
            from { opacity: 0; transform: translateY(8px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          .skeleton-shimmer {
            background: linear-gradient(90deg, var(--rm-gray-1) 0%, rgba(255,255,255,0.08) 50%, var(--rm-gray-1) 100%);
            background-size: 200% 100%;
            animation: shimmer-anim 1.5s ease-in-out infinite;
            border-radius: var(--radius);
          }
        `}</style>

        {/* Принципы */}
        <p className="text-muted-foreground mb-6">
          Motion в Rocketmind — <strong>функциональный, не декоративный</strong>. Каждая анимация решает задачу: подтверждает действие, указывает направление, сообщает о смене состояния.
        </p>
        <div className="border border-border rounded-lg overflow-hidden grid grid-cols-1 sm:grid-cols-3 mb-10">
          {[
            { num: "01", title: "Минимализм", desc: "Анимировать только то, что несёт смысл. Без декора ради декора." },
            { num: "02", title: "Скорость", desc: "100–300ms. Длинные анимации раздражают и замедляют восприятие." },
            { num: "03", title: "Единообразие", desc: "Одни и те же easing-кривые и длительности по всей системе." },
          ].map((p, i) => (
            <div key={p.num} className={`p-5 bg-card ${i < 2 ? "border-r border-border" : ""}`}>
              <div className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] text-muted-foreground mb-1">{p.num}</div>
              <div className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-16)] uppercase tracking-tight mb-2">{p.title}</div>
              <div className="text-[length:var(--text-14)] text-muted-foreground leading-relaxed">{p.desc}</div>
            </div>
          ))}
        </div>

        {/* 8.2 Timing */}
        <SubSection id="animations-timing" title="8.2 Timing-шкала" first />
        <p className="text-[length:var(--text-14)] text-muted-foreground mb-4">Полоска показывает относительную длину каждого токена.</p>
        <div className="space-y-1 mb-10">
          {[
            { token: "--duration-instant", ms: 50,  desc: "Немедленная реакция (cursor, checkmark мгновенный)" },
            { token: "--duration-fast",    ms: 100, desc: "Hover-эффекты кнопок, смена цвета" },
            { token: "--duration-base",    ms: 200, desc: "Стандарт: переходы состояний (active/disabled/focus)" },
            { token: "--duration-smooth",  ms: 300, desc: "Появление/скрытие элементов (dropdown, tooltip)" },
            { token: "--duration-enter",   ms: 400, desc: "Входящие элементы (модал, панель)" },
            { token: "--duration-grid",    ms: 1600, desc: "Animated Grid Lines hero reveal — единственная длинная анимация" },
          ].map((t) => (
            <TimingRow key={t.token} token={t.token} ms={t.ms} desc={t.desc} />
          ))}
        </div>

        {/* 8.3 Easing */}
        <SubSection id="animations-easing" title="8.3 Easing-кривые" />
        <p className="text-[length:var(--text-14)] text-muted-foreground mb-4">Нажми «Play», чтобы увидеть как шарик движется с данной кривой.</p>
        <div className="border border-border rounded-lg overflow-hidden grid grid-cols-1 sm:grid-cols-2 mb-10">
          <div className="border-r sm:border-r border-b sm:border-b border-border"><EasingDemo token="--ease-standard" curve="cubic-bezier(0.4, 0, 0.2, 1)" desc="Hover, focus, active — большинство переходов" /></div>
          <div className="border-b border-border"><EasingDemo token="--ease-enter" curve="cubic-bezier(0, 0, 0.2, 1)" desc="Появление элементов (модал, дропдаун, toast)" /></div>
          <div className="sm:border-r border-border"><EasingDemo token="--ease-exit" curve="cubic-bezier(0.4, 0, 1, 1)" desc="Исчезновение элементов (закрытие, скрытие)" /></div>
          <div><EasingDemo token="--ease-spring" curve="cubic-bezier(0.34, 1.56, 0.64, 1)" desc="Hover scale на карточках — небольшой перелёт" /></div>
        </div>

        {/* 8.4 Микроинтерактивы */}
        <SubSection id="animations-micro" title="8.4 Микроинтерактивы" />
        <p className="text-[length:var(--text-14)] text-muted-foreground mb-4">Наведи курсор на каждый элемент.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">

          <AnimDemoCard label="Button hover" desc="Primary button: hover меняет цвет. 100ms ease-standard.">
            <button
              className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-sm bg-[var(--rm-yellow-100)] text-[var(--rm-yellow-fg)] font-[family-name:var(--font-mono-family)] text-[length:var(--text-14)] uppercase tracking-[0.08em] cursor-pointer select-none"
              style={{ transition: "background-color 100ms cubic-bezier(0.4,0,0.2,1)" }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--rm-yellow-300)" }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "var(--rm-yellow-100)" }}
            >
              Hover me
            </button>
          </AnimDemoCard>

          <AnimDemoCard label="Ghost button hover" desc="Ghost button использует прежний Secondary-style и на hover меняет серый фон. 100ms ease-standard.">
            <button
              className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-sm border border-border bg-[var(--rm-gray-1)] text-foreground font-[family-name:var(--font-mono-family)] text-[length:var(--text-14)] uppercase tracking-[0.08em] cursor-pointer select-none"
              style={{ transition: "background-color 100ms cubic-bezier(0.4,0,0.2,1)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--rm-gray-2)" }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--rm-gray-1)" }}
            >
              Ghost button
            </button>
          </AnimDemoCard>

          <AnimDemoCard label="Input focus" desc="Input: при фокусе border жёлтый. 200ms ease-standard.">
            <input
              type="text"
              placeholder="Кликни сюда..."
              className="w-full h-10 px-3 rounded-sm border bg-rm-gray-1 text-foreground text-[length:var(--text-14)] outline-none"
              style={{ borderColor: "var(--border)", transition: "border-color 200ms cubic-bezier(0.4,0,0.2,1)" }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "var(--rm-yellow-100)" }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)" }}
            />
          </AnimDemoCard>

          <AnimDemoCard label="Agent card hover" desc="Карточка агента: hover меняет border на фиолетовый. 200ms ease-spring.">
            <div
              className="w-full p-4 rounded-lg border bg-card cursor-pointer"
              style={{ borderColor: "var(--border)", transition: "border-color 200ms cubic-bezier(0.34,1.56,0.64,1)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "var(--rm-violet-100)" }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--rm-violet-100)]/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[var(--rm-violet-100)]" />
                </div>
                <div>
                  <p className="text-[length:var(--text-14)] font-medium">AI-агент</p>
                  <p className="text-[length:var(--text-12)] text-muted-foreground">Hover this card</p>
                </div>
              </div>
            </div>
          </AnimDemoCard>

          <AnimDemoCard label="Link CTA → arrow" desc="Текстовая ссылка: hover сдвигает стрелку на 4px вправо. 100ms ease-standard.">
            <LinkCTADemo />
          </AnimDemoCard>

          <AnimDemoCard label="Nav icon hover" desc="Иконка в сайдбаре: hover меняет цвет с muted-foreground на foreground. 100ms ease-standard.">
            <div className="flex gap-4">
              {[Sparkles, Eye, Zap, Search].map((Icon, i) => (
                <button
                  key={i}
                  className="p-2 rounded-sm cursor-pointer"
                  style={{ color: "var(--muted-foreground)", transition: "color 100ms cubic-bezier(0.4,0,0.2,1), background-color 100ms cubic-bezier(0.4,0,0.2,1)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--foreground)"; (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--rm-gray-1)" }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "var(--muted-foreground)"; (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent" }}
                >
                  <Icon className="w-5 h-5" />
                </button>
              ))}
            </div>
          </AnimDemoCard>
        </div>

        {/* 8.5 Screen transitions */}
        <SubSection title="8.5 Переходы между состояниями экрана" />
        <p className="text-[length:var(--text-14)] text-muted-foreground mb-4">Нажми кнопку, чтобы воспроизвести анимацию появления элемента.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <ToggleAnimCard label="Dropdown / Tooltip" desc="Fade + slide 8px вниз. 300ms ease-enter." animClass="fade-in-down" animDuration="300ms" animEasing="cubic-bezier(0,0,0.2,1)">
            <div className="w-full p-3 rounded-sm border border-border bg-popover text-[length:var(--text-14)]">
              <p className="font-medium mb-1">Опции</p>
              <p className="text-muted-foreground text-[length:var(--text-12)] py-0.5">Редактировать</p>
              <p className="text-muted-foreground text-[length:var(--text-12)] py-0.5">Удалить</p>
            </div>
          </ToggleAnimCard>
          <ToggleAnimCard label="Модальное окно" desc="Slide + scale от 0.98. 400ms ease-enter." animClass="slide-in-bottom" animDuration="400ms" animEasing="cubic-bezier(0,0,0.2,1)">
            <div className="w-full p-4 rounded-lg border border-border bg-card text-[length:var(--text-14)]">
              <p className="font-medium mb-2">Диалог</p>
              <p className="text-muted-foreground text-[length:var(--text-12)] mb-3">Вы уверены в этом действии?</p>
              <div className="flex gap-2">
                <span className="px-3 py-1 rounded bg-[var(--rm-yellow-100)] text-[var(--rm-yellow-fg)] text-[length:var(--text-12)] font-medium">Да</span>
                <span className="px-3 py-1 rounded border border-border text-[length:var(--text-12)] text-muted-foreground">Нет</span>
              </div>
            </div>
          </ToggleAnimCard>
          <ToggleAnimCard label="Toast / Notification" desc="Slide справа-налево. 300ms ease-enter." animClass="toast-enter" animDuration="300ms" animEasing="cubic-bezier(0,0,0.2,1)">
            <div className="w-full p-3 rounded-lg border border-border bg-card flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
              <span className="text-[length:var(--text-12)]">Изменения сохранены</span>
            </div>
          </ToggleAnimCard>
          <ToggleAnimCard label="Сообщение в чате" desc="Fade + slide 8px снизу. 300ms ease-enter." animClass="bubble-enter" animDuration="300ms" animEasing="cubic-bezier(0,0,0.2,1)">
            <div className="w-full px-3 py-2 rounded-xl rounded-tl-none bg-rm-gray-2 border border-border/50">
              <p className="text-[length:var(--text-12)] text-muted-foreground mb-0.5">AI-агент</p>
              <p className="text-[length:var(--text-12)]">Привет! Чем могу помочь?</p>
            </div>
          </ToggleAnimCard>
        </div>

        {/* 8.6 Loading */}
        <SubSection id="animations-loading" title="8.6 Loading / Skeleton" />
        <p className="text-[length:var(--text-14)] text-muted-foreground mb-4">Skeleton занимает место сразу — нет «прыжков» при загрузке. Shimmer движется бесконечно.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <AnimDemoCard label="Skeleton shimmer" desc="Блоки-заглушки с движущимся блеском. Показываются пока грузятся данные.">
            <div className="w-full space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full skeleton-shimmer shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 skeleton-shimmer" />
                  <div className="h-3 w-3/4 skeleton-shimmer" />
                </div>
              </div>
              <div className="h-3 skeleton-shimmer" />
              <div className="h-3 w-5/6 skeleton-shimmer" />
              <div className="h-3 w-2/3 skeleton-shimmer" />
            </div>
          </AnimDemoCard>
          <AnimDemoCard label="Typing indicator" desc="Три точки с stagger 0.2s. Показывает, что агент печатает ответ.">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[var(--rm-violet-100)]/20 flex items-center justify-center shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-[var(--rm-violet-100)]" />
              </div>
              <div className="px-4 py-2.5 rounded-xl rounded-tl-none bg-rm-gray-2 flex gap-1.5 items-center">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-rm-gray-2-foreground"
                    style={{ animation: "typing-pulse 1.2s ease-in-out infinite", animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
              <span className="text-[length:var(--text-12)] text-muted-foreground">агент печатает...</span>
            </div>
          </AnimDemoCard>
        </div>

        {/* 8.7 Page-level */}
        <SpecBlock title="8.7 Page-level правила">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="border border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-[length:var(--text-16)] text-green-600 dark:text-green-400">✓ Допустимо</CardTitle>
              </CardHeader>
              <CardContent className="text-[length:var(--text-14)] text-muted-foreground space-y-1.5">
                <p>Fade-in hero-контента: opacity 0→1, 400ms, ease-enter</p>
                <p>Grid Lines reveal при загрузке (1600ms)</p>
                <p>Skeleton placeholder до загрузки данных</p>
                <p>Typing indicator в чате агента</p>
                <p>Hover-переходы компонентов (100–200ms)</p>
              </CardContent>
            </Card>
            <Card className="border border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-[length:var(--text-16)] text-destructive">✗ Запрещено</CardTitle>
              </CardHeader>
              <CardContent className="text-[length:var(--text-14)] text-muted-foreground space-y-1.5">
                <p>Parallax-scrolling</p>
                <p>Scroll-triggered transforms/fade</p>
                <p>Page transitions с морфингом</p>
                <p>Бесконечные фоновые анимации (pulse, float, orbit)</p>
                <p>Particle systems</p>
              </CardContent>
            </Card>
          </div>
        </SpecBlock>

        {/* 8.8 Reduced Motion */}
        <SpecBlock title="8.8 Доступность (Reduced Motion)">
          <div className="p-4 rounded-lg border border-border bg-rm-gray-2/30">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[length:var(--text-14)] font-medium">prefers-reduced-motion: reduce</p>
              <CopyButton
                value={`@media (prefers-reduced-motion: reduce) {\n  *,\n  *::before,\n  *::after {\n    animation-duration: 0.01ms !important;\n    animation-iteration-count: 1 !important;\n    transition-duration: 0.01ms !important;\n    scroll-behavior: auto !important;\n  }\n}`}
                label="Reduced Motion CSS"
              />
            </div>
            <p className="text-[length:var(--text-14)] text-muted-foreground">
              Все анимации обязаны уважать системные настройки. Исключение — typing-indicator: заменяется на статичный <code className="text-[length:var(--text-12)] bg-rm-gray-2 px-1 py-0.5 rounded font-[family-name:var(--font-caption-family)]">•••</code>.
            </p>
          </div>
        </SpecBlock>

        {/* 8.9 Animated Grid Lines */}
        <SubSection title="8.9 Animated Grid Lines" />
        <p className="text-[length:var(--text-14)] text-muted-foreground mb-4">
          Тонкие линии hero-секции материализуют каркас дизайна. Только одноразовая анимация при загрузке — после появления статичны. Используется с токеном <code className="text-[length:var(--text-12)] bg-rm-gray-2 px-1 py-0.5 rounded font-[family-name:var(--font-caption-family)]">--duration-grid</code> (1600ms).
        </p>
        <AnimatedGridLinesDemo />

        {/* 8.10 Dot Grid Lens */}
        <SubSection title="8.10 Dot Grid Lens" />
        <p className="text-muted-foreground mb-6">
          Фоновый эффект «линзы» на сетке точек: при движении курсора точки вблизи него увеличиваются
          по квадратичному закону. Используется в hero-секции и CTA лендинга. Реализован через Canvas.
        </p>

        <DotGridDemo />

        <SpecBlock title="Токены, алгоритм и применение">
          <div className="space-y-6">
            <div className="space-y-2">
              {[
                { token: "--dot-size",         value: "3px",     desc: "Базовый диаметр точки" },
                { token: "--dot-size-max",     value: "10px",    desc: "Максимальный диаметр в центре линзы" },
                { token: "--dot-gap",          value: "20px",    desc: "Шаг сетки (расстояние между центрами)" },
                { token: "--lens-radius",      value: "120px",   desc: "Радиус влияния курсора" },
                { token: "--dot-color",        value: "#CBCBCB / #404040", desc: "Цвет точек (= --border токен)" },
                { token: "--dot-color-accent", value: "#FFCC00", desc: "Акцентный цвет точек в центре линзы" },
              ].map((t) => (
                <TokenRow key={t.token} token={t.token} value={t.value} desc={t.desc} />
              ))}
            </div>
            <div className="p-4 rounded-lg border border-border bg-rm-gray-2/30 font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] text-muted-foreground space-y-1">
              <p>distance = sqrt((x − mx)² + (y − my)²)</p>
              <p>t = clamp(1 − distance / LENS_RADIUS, 0, 1)</p>
              <p>scale = 1 + (MAX_SCALE − 1) × t²  // квадратичный easing</p>
              <p>dotRadius = BASE_RADIUS × scale</p>
            </div>
            <div className="overflow-auto rounded-lg border border-border">
              <table className="w-full text-[length:var(--text-14)]">
                <thead>
                  <tr className="border-b border-border bg-rm-gray-2/30">
                    <th className="text-left px-4 py-2 font-medium">Экран</th>
                    <th className="text-left px-4 py-2 font-medium">Секция</th>
                    <th className="text-left px-4 py-2 font-medium">Вариант</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  {[
                    ["Лендинг — Hero",  "Полный фон hero",    "Акцентный (#FFCC00 в линзе)"],
                    ["Лендинг — CTA",   "Фон CTA-блока",      "Монохромный"],
                    ["Auth",            "Фоновый декор",       "Монохромный, opacity: 0.5"],
                    ["Main App",        "—",                   "Не используется"],
                  ].map(([screen, section, variant]) => (
                    <tr key={screen} className="border-b border-border last:border-0">
                      <td className="px-4 py-2">{screen}</td>
                      <td className="px-4 py-2">{section}</td>
                      <td className="px-4 py-2">{variant}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </SpecBlock>

        {/* 8.11 Hero Background Noise */}
        <SubSection title="8.11 Hero Background Noise & Bottom Fade" />
        <p className="text-[length:var(--text-14)] text-muted-foreground mb-4">
          Для тёмного hero допустим отдельный декоративный слой: мягкая подложка на токенах, статичный шум
          и нижний fade в <code className="text-[length:var(--text-12)] bg-rm-gray-2 px-1 py-0.5 rounded font-[family-name:var(--font-caption-family)]">--background</code>.
          Эффект применяется только к фону, а не к контенту.
        </p>

        {/* 8.11 Visual comparison demo */}
        <div className="mb-6 overflow-hidden rounded-lg border border-border" style={{ height: 280 }}>
          <div
            className="relative h-full w-full overflow-hidden"
            style={{
              background: [
                "radial-gradient(circle at 16% 18%, rgba(255,204,0,0.18) 0%, transparent 34%)",
                "radial-gradient(circle at 78% 8%, rgba(255,255,255,0.06) 0%, transparent 30%)",
                "linear-gradient(180deg, #060606 0%, #080808 54%, #0A0A0A 100%)",
              ].join(", "),
            }}
          >
            {/* LEFT half — noise + bottom fade */}
            <div className="absolute inset-0" style={{ right: "50%" }}>
              {/* SVG turbulence noise overlay */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")`,
                  backgroundRepeat: "repeat",
                  mixBlendMode: "soft-light",
                  opacity: 0.055,
                  pointerEvents: "none",
                } as React.CSSProperties}
              />
              {/* Bottom fade */}
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(180deg, transparent 0%, transparent 74%, #0A0A0A 100%)",
                  pointerEvents: "none",
                }}
              />
              {/* Label */}
              <div className="absolute bottom-3 left-4 text-[10px] font-[family-name:var(--font-mono-family)] text-white/40 uppercase tracking-[0.15em]">
                Noise + Fade
              </div>
            </div>

            {/* RIGHT half — base backdrop only */}
            <div className="absolute inset-0" style={{ left: "50%" }}>
              <div className="absolute bottom-3 right-4 text-[10px] font-[family-name:var(--font-mono-family)] text-white/40 uppercase tracking-[0.15em] text-right">
                Без шума
              </div>
            </div>

            {/* Divider */}
            <div className="absolute inset-y-0 left-1/2 w-px bg-white/15 pointer-events-none" />

            {/* VS badge */}
            <div
              className="absolute top-3 left-1/2 -translate-x-1/2 text-[10px] font-[family-name:var(--font-mono-family)] text-white/35 px-2 py-0.5 rounded uppercase tracking-widest pointer-events-none"
              style={{ background: "rgba(0,0,0,0.4)" }}
            >
              VS
            </div>
          </div>
        </div>

        <SpecBlock title="Токены и правила">
          <div className="space-y-6">
            <div className="space-y-2">
              {[
                { token: "Base backdrop", value: "--background + --rm-yellow-100 + --rm-gray-alpha-100", desc: "2 radial-gradient и 1 vertical linear-gradient без новых цветов" },
                { token: "Noise overlay", value: "soft-light · opacity 0.04-0.06", desc: "Только статичный SVG noise, без анимации" },
                { token: "Bottom fade", value: "transparent 74% -> var(--background) 100%", desc: "Fade затрагивает только декоративный слой" },
              ].map((t) => (
                <TokenRow key={t.token} token={t.token} value={t.value} desc={t.desc} />
              ))}
            </div>
            <div className="p-4 rounded-lg border border-border bg-rm-gray-2/30">
              <p className="text-[length:var(--text-14)] text-muted-foreground">
                Используем только в full-bleed hero на тёмном фоне. Шум всегда неинтерактивный и статичный,
                fade уходит в токен страницы, а логотип, copy и CTA остаются поверх слоя с полным контрастом.
              </p>
            </div>
          </div>
        </SpecBlock>

        {/* 8.12 Hero Round Glass Lens */}
        <SubSection id="animations-round-glass" title="8.12 Hero Round Glass Lens" />
        <p className="text-[length:var(--text-14)] text-muted-foreground mb-4">
          Круглая hero-линза искажает уже собранную сцену внутри круга через WebGL, без blur и без отдельной
          DOM-копии контента внутри линзы. Центр остаётся почти стабильным, а fisheye/barrel-искажение усиливается
          к краю.
        </p>
        <LensShowcase storageKey="ds:lens:8.12:main" size={280} />

        {/* Примеры сцен */}
        <SpecBlock title="Примеры использования">
          <div className="space-y-8">
            <div className="space-y-3">
              <p className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-11)] uppercase tracking-widest text-muted-foreground">
                Пример 1 — anchorRef + motion
              </p>
              <SceneHero storageKey="ds:lens:8.12:hero" />
              <pre className="rounded-xl bg-muted p-5 text-sm overflow-x-auto">
                <code>{`<RoundGlassLens
  sceneRef={sceneRef}
  anchorRef={anchorRef}
  size={280}
  xOffset={60}
  yOffset={18}
  motionParallax
/>`}</code>
              </pre>
            </div>

            <div className="space-y-3">
              <p className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-11)] uppercase tracking-widest text-muted-foreground">
                Пример 2 — Custom optical settings
              </p>
              <SceneGradient storageKey="ds:lens:8.12:gradient" />
              <pre className="rounded-xl bg-muted p-5 text-sm overflow-x-auto">
                <code>{`<RoundGlassLens
  sceneRef={sceneRef}
  size={220}
  xOffset={-40}
  refraction={0.04}
  depth={0.22}
  dispersion={0.55}
  distortionRadius={1.1}
  blur={0.22}
  gradientAngle={135}
  motionParallax
/>`}</code>
              </pre>
            </div>

            <div className="space-y-3">
              <p className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-11)] uppercase tracking-widest text-muted-foreground">
                Пример 3 — Subtle / no shadow
              </p>
              <SceneMinimal storageKey="ds:lens:8.12:minimal" />
              <pre className="rounded-xl bg-muted p-5 text-sm overflow-x-auto">
                <code>{`<RoundGlassLens
  sceneRef={sceneRef}
  size={180}
  refraction={0.025}
  depth={0.14}
  dispersion={0.28}
  blur={0.12}
  shadowEnabled={false}
  motionParallax
/>`}</code>
              </pre>
            </div>
          </div>
        </SpecBlock>

        {/* Props reference */}
        <SpecBlock title="Props">
          <LensPropsTable />
        </SpecBlock>

        {/* Dev workflow */}
        <SpecBlock title="Dev-воркфлоу">
          <ol className="space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-3">
              <span className="font-mono text-xs font-bold text-foreground bg-muted rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">1</span>
              <span>Добавьте <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">showControls storageKey=&quot;my-page:lens&quot;</code> в компонент.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-mono text-xs font-bold text-foreground bg-muted rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">2</span>
              <span>Настраивайте параметры в плавающей панели. Нажмите <strong className="text-foreground">COPY</strong> — в буфере обмена JSX-пропсы.</span>
            </li>
            <li className="flex gap-3">
              <span className="font-mono text-xs font-bold text-foreground bg-muted rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">3</span>
              <span>Вставьте пропсы в код, уберите <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">showControls storageKey</code>.</span>
            </li>
          </ol>
        </SpecBlock>

        <SpecBlock title="Токены, алгоритм и правила">
          <div className="space-y-6">
            <div className="space-y-2">
              {[
                { token: "Diameter", value: "clamp(280px, 30vw, 360px)", desc: "Размер линзы в hero" },
                { token: "Outer stroke", value: "1px linear-gradient(62deg, #FFE900 1%, #A6A6A6 40%, rgba(64,64,64,0) 100%)", desc: "Тонкая градиентная обводка по кругу" },
                { token: "Side flares", value: "blue-white chromatic accents", desc: "Короткие световые вспышки слева и справа" },
                { token: "Inner stroke", value: "none", desc: "Внутренняя 1px-линия не используется" },
                { token: "Pointer offset limit", value: "64px", desc: "Максимальное смещение от базовой точки" },
                { token: "Renderer", value: "WebGL + scene capture texture", desc: "Не дублировать контент внутри линзы" },
              ].map((t) => (
                <TokenRow key={t.token} token={t.token} value={t.value} desc={t.desc} />
              ))}
            </div>
            <div className="p-4 rounded-lg border border-border bg-rm-gray-2/30 font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] text-muted-foreground space-y-1">
              <p>rim = smoothstep(0.34, 0.98, normalized)</p>
              <p>rimBand = rim × (1 − smoothstep(0.82, 1.0, normalized))</p>
              <p>sampleOffset = localOffset × (1 − 0.22 × rimBand)</p>
              <p>sampleOffset −= direction × radius × 0.085 × normalized³</p>
            </div>
            <div className="p-4 rounded-lg border border-border bg-rm-gray-2/30">
              <p className="text-[length:var(--text-14)] text-muted-foreground">
                Не вставляем внутрь линзы копию wordmark, меню, логотипов или background-слоёв. На
                <code className="text-[length:var(--text-12)] bg-rm-gray-2 px-1 py-0.5 rounded font-[family-name:var(--font-caption-family)]"> pointer: coarse </code>
                линза фиксируется на базовой позиции, а при
                <code className="text-[length:var(--text-12)] bg-rm-gray-2 px-1 py-0.5 rounded font-[family-name:var(--font-caption-family)]"> prefers-reduced-motion: reduce </code>
                отключается следование за курсором и дополнительные обновления сцены.
              </p>
            </div>
            <div className="p-4 rounded-lg border border-border bg-rm-gray-2/30">
              <p className="text-[length:var(--text-14)] font-medium mb-1">Secondary Lens</p>
              <p className="text-[length:var(--text-14)] text-muted-foreground">
                Допустима вторая большая линза справа без искажения сцены. Она использует тот же градиентный бордер и
                двигается за курсором в 3 раза медленнее и с амплитудой в 3 раза меньше, чем основная.
              </p>
            </div>
            <div className="p-4 rounded-lg border border-border bg-rm-gray-2/30">
              <p className="text-[length:var(--text-14)] font-medium mb-1">Доступность & Touch</p>
              <p className="text-[length:var(--text-14)] text-muted-foreground">
                На touch-устройствах (<code className="text-[length:var(--text-12)] bg-rm-gray-2 px-1 py-0.5 rounded">pointer: coarse</code>) интерактивные hero-линзы фиксируются или отключаются,
                а декоративные фоны остаются статичными. При <code className="text-[length:var(--text-12)] bg-rm-gray-2 px-1 py-0.5 rounded">prefers-reduced-motion: reduce</code> следование за курсором
                и дополнительные анимации останавливаются.
              </p>
            </div>
          </div>
        </SpecBlock>

        {/* 8.13 Wave Animation */}
        <SubSection id="animations-wave" title="8.13 Wave Animation" />
        <p className="text-[length:var(--text-14)] text-muted-foreground mb-4">
          Фоновый шейдер из бегущей сетки точек. Применяется в футере лендинга и на экране 404 как декоративный слой.
          Точки плавно затухают по мере удаления от камеры (глубина <code className="text-[length:var(--text-12)] bg-rm-gray-2 px-1 py-0.5 rounded font-[family-name:var(--font-caption-family)]">u_fade_near → u_fade_far</code>),
          поэтому нижние точки остаются яркими, а верх плавно растворяется в фоне.
        </p>

        <div className="mb-6 overflow-hidden rounded-lg border border-border bg-black" style={{ height: 360 }}>
          <WaveAnimation
            pointSize={3}
            waveSpeed={2}
            waveIntensity={10}
            particleColor="#ffffff"
            gridDistance={4}
          />
        </div>

        <SpecBlock title="Параметры">
          <div className="space-y-2">
            {[
              { token: "pointSize",      value: "3",       desc: "Размер точки в пикселях" },
              { token: "waveSpeed",      value: "2",       desc: "Скорость бегущей волны" },
              { token: "waveIntensity",  value: "10",      desc: "Частота синусоиды по сетке" },
              { token: "particleColor",  value: "#ffffff", desc: "Цвет точек (применяем с альфой через fade)" },
              { token: "gridDistance",   value: "4",       desc: "Шаг сетки в мировых единицах" },
              { token: "fadeNear",       value: "20",      desc: "Глубина, с которой начинается затухание" },
              { token: "fadeFar",        value: "200",     desc: "Глубина, на которой точка полностью прозрачна" },
            ].map((t) => (
              <TokenRow key={t.token} token={t.token} value={t.value} desc={t.desc} />
            ))}
          </div>
          <pre className="mt-4 rounded-xl bg-muted p-5 text-sm overflow-x-auto">
            <code>{`<WaveAnimation
  pointSize={3}
  waveSpeed={2}
  waveIntensity={10}
  particleColor="#ffffff"
  gridDistance={4}
/>`}</code>
          </pre>
        </SpecBlock>
      </Section>

      <Separator />
    </>
  )
}
