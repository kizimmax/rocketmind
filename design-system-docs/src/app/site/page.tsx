"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/theme-toggle"
import {
    ArrowRight, Rocket, Target, Layers, Lightbulb, BarChart3,
    Users, Compass, Sparkles, Brain, Zap, GraduationCap,
    BookOpen, Puzzle, TrendingUp, ChevronRight, Menu, X,
    Globe, MessageCircle, Send
} from "lucide-react"
import { useState, useEffect, useRef } from "react"

/* ═══════ HERO DOT GRID ═══════ */
function HeroDotGrid() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const mouseRef = useRef({ x: -9999, y: -9999 })
    const rafRef = useRef(0)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")!
        const container = canvas.parentElement!
        const GAP = 32, BASE = 1.2, MAX_SCALE = 3, RADIUS = 140

        function resize() {
            const dpr = window.devicePixelRatio || 1
            const w = container.clientWidth, h = container.clientHeight
            canvas!.width = w * dpr; canvas!.height = h * dpr
            canvas!.style.width = `${w}px`; canvas!.style.height = `${h}px`
            ctx.scale(dpr, dpr)
        }

        function draw() {
            const w = container.clientWidth, h = container.clientHeight
            ctx.clearRect(0, 0, w, h)
            const isDark = document.documentElement.classList.contains("dark")
            // --rm-gray-4: light ≈ [220,220,220], dark ≈ [40,40,40]
            const base = isDark ? [40, 40, 40] : [220, 220, 220]
            // --rm-violet-100: #A172F8
            const accent = [161, 114, 248]
            const { x: mx, y: my } = mouseRef.current
            for (let i = 0; i <= Math.ceil(w / GAP); i++) {
                for (let j = 0; j <= Math.ceil(h / GAP); j++) {
                    const px = i * GAP, py = j * GAP
                    const d = Math.sqrt((px - mx) ** 2 + (py - my) ** 2)
                    const t = Math.max(0, 1 - d / RADIUS)
                    const s = 1 + (MAX_SCALE - 1) * t * t
                    if (t > 0) {
                        ctx.fillStyle = `rgb(${Math.round(base[0] + (accent[0] - base[0]) * t)},${Math.round(base[1] + (accent[1] - base[1]) * t)},${Math.round(base[2] + (accent[2] - base[2]) * t)})`
                    } else {
                        ctx.fillStyle = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" // --rm-gray-alpha-100
                    }
                    ctx.beginPath(); ctx.arc(px, py, BASE * s, 0, Math.PI * 2); ctx.fill()
                }
            }
        }

        function loop() { draw(); rafRef.current = requestAnimationFrame(loop) }
        resize(); window.addEventListener("resize", resize)
        rafRef.current = requestAnimationFrame(loop)
        return () => { cancelAnimationFrame(rafRef.current); window.removeEventListener("resize", resize) }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            onMouseMove={e => {
                const r = e.currentTarget.parentElement!.getBoundingClientRect()
                mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top }
            }}
            onMouseLeave={() => { mouseRef.current = { x: -9999, y: -9999 } }}
        />
    )
}

/* ═══════ ANIMATED CORNER BRACKETS ═══════ */
function CornerBrackets({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={`relative group ${className}`}>
            {/* Top-left */}
            <span className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-[var(--rm-violet-100)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            {/* Top-right */}
            <span className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-[var(--rm-violet-100)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            {/* Bottom-left */}
            <span className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-[var(--rm-yellow-100)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            {/* Bottom-right */}
            <span className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-[var(--rm-yellow-100)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            {children}
        </div>
    )
}

/* ═══════ SECTION HEADING ═══════ */
function SectionHeading({ tag, title, description }: { tag: string; title: string; description?: string }) {
    return (
        <div className="mb-12 md:mb-16">
            <Badge
                variant="outline"
                className="mb-4 text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-[0.08em] border-[var(--rm-violet-100)] text-[var(--rm-violet-100)]"
            >
                {tag}
            </Badge>
            <h2 className="font-[family-name:var(--font-heading-family)] font-bold text-[32px] md:text-[42px] lg:text-[56px] uppercase tracking-[-0.02em] leading-[1.05] mb-4">
                {title}
            </h2>
            {description && (
                <p className="text-[length:var(--text-16)] md:text-[length:var(--text-19)] text-muted-foreground leading-[1.618] max-w-[640px]">
                    {description}
                </p>
            )}
        </div>
    )
}

/* ═══════ SERVICE CARD ═══════ */
function ServiceCard({
    icon: Icon,
    title,
    description,
    tags,
    accent = "violet",
}: {
    icon: React.ElementType
    title: string
    description: string
    tags?: string[]
    accent?: "violet" | "yellow"
}) {
    const accentVar = accent === "yellow" ? "var(--rm-yellow-100)" : "var(--rm-violet-100)"
    const glowVar = accent === "yellow" ? "var(--glow-yellow)" : "var(--glow-violet)"

    return (
        <CornerBrackets>
            <Card className="border border-border bg-card transition-all duration-150 hover:border-muted-foreground dark:border-white/[0.06] dark:hover:border-white/[0.20] h-full group/card">
                <CardContent className="p-6 md:p-8 flex flex-col h-full">
                    <div
                        className="w-10 h-10 rounded-md flex items-center justify-center mb-5 transition-shadow duration-300"
                        style={{ backgroundColor: `color-mix(in srgb, ${accentVar} 15%, transparent)` }}
                    >
                        <Icon size={20} style={{ color: accentVar }} />
                    </div>
                    <h3 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] md:text-[length:var(--text-25)] uppercase tracking-[-0.005em] leading-[1.3] mb-3">
                        {title}
                    </h3>
                    <p className="text-[length:var(--text-14)] text-muted-foreground leading-[1.618] flex-1 mb-4">
                        {description}
                    </p>
                    {tags && (
                        <div className="flex flex-wrap gap-1.5">
                            {tags.map(t => (
                                <Badge key={t} variant="secondary" className="text-[10px] font-[family-name:var(--font-mono-family)] uppercase tracking-wider">
                                    {t}
                                </Badge>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </CornerBrackets>
    )
}

/* ═══════ METHODOLOGY CARD ═══════ */
function MethodCard({ title, description }: { title: string; description: string }) {
    return (
        <div className="p-6 rounded-md border border-border bg-card/50 hover:bg-card transition-colors duration-300 group">
            <h4 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-16)] uppercase tracking-[-0.005em] leading-[1.3] mb-2">
                {title}
            </h4>
            <p className="text-[length:var(--text-14)] text-muted-foreground leading-[1.618]">
                {description}
            </p>
        </div>
    )
}

/* ═══════ NAV DATA ═══════ */
const navItems = [
    { href: "#products", label: "ПРОДУКТЫ" },
    { href: "#academy", label: "АКАДЕМИЯ" },
    { href: "#cases", label: "КЕЙСЫ" },
    { href: "#methodology", label: "МЕТОДОЛОГИЯ" },
    { href: "#about", label: "О КОМПАНИИ" },
]

/* ═══════════════════════════════════ MAIN PAGE ═══════════════════════════════════ */
export default function SitePage() {
    const [mobileNav, setMobileNav] = useState(false)
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 20)
        window.addEventListener("scroll", handler)
        return () => window.removeEventListener("scroll", handler)
    }, [])

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* ═══════ NAVIGATION ═══════ */}
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                        ? "bg-background/80 backdrop-blur-md border-b border-border"
                        : "bg-transparent"
                    }`}
            >
                <div className="max-w-[1920px] mx-auto px-5 md:px-10 lg:px-20 flex items-center justify-between h-16 md:h-20">
                    <a href="#" className="flex items-center gap-2">
                        <img
                            src="/text_logo_dark_background_en.svg"
                            alt="Rocketmind"
                            className="h-6 md:h-7 hidden dark:block"
                        />
                        <img
                            src="/text_logo_light_background_en.svg"
                            alt="Rocketmind"
                            className="h-6 md:h-7 dark:hidden"
                        />
                    </a>

                    {/* Desktop nav */}
                    <nav className="hidden lg:flex items-center gap-8">
                        {navItems.map(item => (
                            <a
                                key={item.href}
                                href={item.href}
                                className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] font-medium uppercase tracking-[0.08em] text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {item.label}
                            </a>
                        ))}
                    </nav>

                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        <a
                            href="https://t.me/otideidomodeli"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hidden md:flex"
                        >
                            <Button variant="default" className="font-[family-name:var(--font-mono-family)] uppercase tracking-[0.08em] text-[length:var(--text-12)]">
                                <Send size={14} />
                                Связаться
                            </Button>
                        </a>
                        <button
                            className="lg:hidden p-1.5 text-muted-foreground hover:text-foreground"
                            onClick={() => setMobileNav(!mobileNav)}
                        >
                            {mobileNav ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    </div>
                </div>

                {/* Mobile nav */}
                {mobileNav && (
                    <nav className="lg:hidden border-t border-border bg-card/95 backdrop-blur-md px-5 py-4 space-y-1">
                        {navItems.map(item => (
                            <a
                                key={item.href}
                                href={item.href}
                                onClick={() => setMobileNav(false)}
                                className="block py-2.5 text-[length:var(--text-14)] font-[family-name:var(--font-mono-family)] font-medium uppercase tracking-[0.06em] text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {item.label}
                            </a>
                        ))}
                    </nav>
                )}
            </header>

            {/* ═══════ HERO ═══════ */}
            <section className="relative min-h-[85vh] md:min-h-screen flex items-center overflow-hidden">
                {/* Dot grid background */}
                <div className="absolute inset-0 pointer-events-auto">
                    <HeroDotGrid />
                </div>

                {/* Ambient glow */}
                <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-[var(--rm-violet-100)] rounded-full blur-[200px] opacity-10 pointer-events-none" />
                <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] bg-[var(--rm-yellow-100)] rounded-full blur-[180px] opacity-8 pointer-events-none" />

                <div className="relative z-10 max-w-[1920px] mx-auto px-5 md:px-10 lg:px-20 pt-20 w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-[62fr_38fr] gap-10 lg:gap-20 items-center">
                        {/* Left — Text */}
                        <div className="space-y-8">
                            <div>
                                <h1 className="font-[family-name:var(--font-heading-family)] font-extrabold text-[length:var(--text-48)] md:text-[80px] lg:text-[110px] xl:text-[130px] uppercase tracking-[-0.02em] leading-[1.02] mb-6">
                                    Стратегия
                                    <br />
                                    <span className="text-muted-foreground/60">и бизнес-</span>
                                    <br />
                                    модели
                                </h1>
                            </div>
                            <p className="text-[length:var(--text-16)] md:text-[length:var(--text-19)] text-muted-foreground leading-[1.618] max-w-[600px]">
                                Помогаем командам искать, проверять и&nbsp;усиливать бизнес-модели,
                                связывать стратегию с&nbsp;операционными действиями и&nbsp;переходить
                                от&nbsp;продуктовой логики к&nbsp;платформенной и&nbsp;экосистемной архитектуре.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <a href="https://t.me/otideidomodeli" target="_blank" rel="noopener noreferrer">
                                    <Button className="h-12 md:h-14 px-8 font-[family-name:var(--font-mono-family)] uppercase tracking-[0.08em] text-[length:var(--text-14)] md:text-[length:var(--text-16)]">
                                        Связаться
                                        <ArrowRight size={18} />
                                    </Button>
                                </a>
                            </div>
                        </div>

                        {/* Right — Keywords stack */}
                        <div className="hidden lg:flex flex-col gap-5 items-start">
                            {["Платформы", "Экосистемы", "Сервисы"].map((word, i) => (
                                <span
                                    key={word}
                                    className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-48)] xl:text-[64px] uppercase tracking-[-0.02em] leading-[1.05]"
                                    style={{
                                        opacity: 0.4 + i * 0.3,
                                        animationDelay: `${i * 200}ms`,
                                    }}
                                >
                                    {word}
                                </span>
                            ))}
                            <p className="text-[length:var(--text-14)] text-muted-foreground leading-[1.618] mt-4 max-w-[380px]">
                                Развиваем методологию бизнес-дизайна, представляем Platform Innovation Kit
                                в&nbsp;России и&nbsp;странах Азии
                            </p>
                        </div>
                    </div>
                </div>

                {/* Separating line */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-border" />
            </section>

            {/* ═══════ TRUST LOGOS BAR ═══════ */}
            <section className="py-8 md:py-10 border-b border-border overflow-hidden bg-muted/30">
                <div className="max-w-[1920px] mx-auto px-5 md:px-10 lg:px-20">
                    <p className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-[0.08em] text-muted-foreground mb-5">
                        Нам доверяют
                    </p>
                    <div className="flex items-center gap-10 md:gap-16 overflow-x-auto pb-2 scrollbar-hide">
                        {["Сбер", "МТС", "Ростелеком", "СКОЛКОВО", "Газпром", "Тинькофф", "Яндекс"].map(name => (
                            <span
                                key={name}
                                className="text-muted-foreground/50 font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-19)] md:text-[length:var(--text-25)] uppercase tracking-wider whitespace-nowrap shrink-0"
                            >
                                {name}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════ PRODUCTS ═══════ */}
            <section id="products" className="py-16 md:py-24 scroll-mt-20">
                <div className="max-w-[1920px] mx-auto px-5 md:px-10 lg:px-20">
                    <SectionHeading
                        tag="Продукты"
                        title="Что мы делаем"
                        description="Применяем бизнес-дизайн, платформенное мышление и AI-инструменты, чтобы помогать компаниям находить новые модели роста."
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        <ServiceCard
                            icon={Layers}
                            title="Цифровая платформа в вашем бизнесе"
                            description="Находим платформенную логику, чтобы масштабироваться и запускать новые потоки дохода."
                            tags={["платформа", "масштабирование"]}
                        />
                        <ServiceCard
                            icon={Users}
                            title="Стратегические и дизайн-сессии"
                            description="Организуем рабочие сессии для поиска решений, запуска гипотез и формирования общего видения."
                            tags={["фасилитация", "стратегия"]}
                            accent="yellow"
                        />
                        <ServiceCard
                            icon={Compass}
                            title="Экосистемная стратегия"
                            description="Проектируем архитектуру экосистемы: роли, ценностные потоки, механизмы создания сетевых эффектов."
                            tags={["экосистема", "архитектура"]}
                        />
                        <ServiceCard
                            icon={Zap}
                            title="Организация дизайн-спринтов"
                            description="Быстро создадим прототип и протестируем на реальных пользователях."
                            tags={["спринт", "прототип"]}
                            accent="yellow"
                        />
                        <ServiceCard
                            icon={BarChart3}
                            title="Умная аналитика для развития бизнеса"
                            description="Проводим глубокий ресёрч с использованием ИИ. Итог — инсайты, на основе которых можно строить стратегию."
                            tags={["аналитика", "AI"]}
                        />
                        <ServiceCard
                            icon={Brain}
                            title="ИИ-агент по тестированию бизнес-гипотез"
                            description="Помогает быстро формулировать гипотезы, выбирать эксперименты и измерять их успех."
                            tags={["AI", "гипотезы"]}
                            accent="yellow"
                        />
                        <ServiceCard
                            icon={Target}
                            title="Диагностика готовности команды"
                            description="Помогаем увидеть, что происходит внутри вашей организации. Определяем зоны роста и слабые места."
                            tags={["диагностика", "команда"]}
                        />
                        <ServiceCard
                            icon={Sparkles}
                            title="ИИзация вашего бизнеса"
                            description="Помогаем компаниям повышать эффективность, улучшать клиентский опыт и ускорять бизнес-процессы с помощью AI."
                            tags={["AI", "трансформация"]}
                            accent="yellow"
                        />
                        <ServiceCard
                            icon={Rocket}
                            title="Получение статуса резидента Сколково"
                            description="Сопроводим вас на всех этапах — от подготовки заявки до заключения договора с Фондом."
                            tags={["сколково", "финансирование"]}
                        />
                    </div>
                </div>
            </section>

            <div className="max-w-[1920px] mx-auto px-5 md:px-10 lg:px-20">
                <Separator />
            </div>

            {/* ═══════ ACADEMY ═══════ */}
            <section id="academy" className="py-16 md:py-24 scroll-mt-20">
                <div className="max-w-[1920px] mx-auto px-5 md:px-10 lg:px-20">
                    <SectionHeading
                        tag="Академия"
                        title="Академия Rocketmind"
                        description="Среда, где управленцы и команды осваивают бизнес-дизайн, платформенное мышление и работу с гипотезами."
                    />

                    <div className="grid grid-cols-1 lg:grid-cols-[38fr_62fr] gap-10">
                        {/* Left — Description */}
                        <div className="space-y-6">
                            <div className="p-6 md:p-8 rounded-md border border-border bg-card">
                                <GraduationCap size={24} className="text-[var(--rm-yellow-100)] mb-4" />
                                <h3 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-25)] uppercase tracking-[-0.005em] mb-3">
                                    Практикум по бизнес-дизайну для команд
                                </h3>
                                <p className="text-[length:var(--text-14)] text-muted-foreground leading-[1.618]">
                                    Навыки стратегического развития бизнеса — от поиска бизнес-модели
                                    до проектирования платформ и экосистем.
                                </p>
                            </div>

                            <div className="p-6 md:p-8 rounded-md border border-border bg-card">
                                <BookOpen size={24} className="text-[var(--rm-violet-100)] mb-4" />
                                <h3 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-25)] uppercase tracking-[-0.005em] mb-3">
                                    Бизнес-дизайн. Быстрый старт
                                </h3>
                                <p className="text-[length:var(--text-14)] text-muted-foreground leading-[1.618]">
                                    Онлайн-курс, который поможет быстро понять суть бизнес-дизайна
                                    и начать мыслить как стратег.
                                </p>
                            </div>
                        </div>

                        {/* Right — Programs with business schools */}
                        <div className="space-y-4">
                            <Badge
                                variant="outline"
                                className="mb-2 text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-[0.08em]"
                            >
                                Программы с ведущими бизнес-школами
                            </Badge>
                            <div className="p-6 md:p-10 rounded-md border border-border bg-muted/30 relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[var(--rm-violet-100)] to-[var(--rm-yellow-100)]" />
                                <p className="text-[length:var(--text-19)] md:text-[length:var(--text-25)] leading-[1.618] max-w-[600px]">
                                    Обучаем топ-менеджеров крупных компаний, помогаем трансформировать бизнес
                                    с&nbsp;помощью бизнес-дизайна. Работаем совместно с&nbsp;ведущими бизнес-школами
                                    России и&nbsp;мира.
                                </p>
                                <div className="flex flex-wrap gap-4 mt-6">
                                    {["СКОЛКОВО", "РАНХиГС", "МШУ"].map(school => (
                                        <span
                                            key={school}
                                            className="text-muted-foreground/60 font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-16)] uppercase tracking-wider"
                                        >
                                            {school}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="max-w-[1920px] mx-auto px-5 md:px-10 lg:px-20">
                <Separator />
            </div>

            {/* ═══════ METHODOLOGY ═══════ */}
            <section id="methodology" className="py-16 md:py-24 scroll-mt-20">
                <div className="max-w-[1920px] mx-auto px-5 md:px-10 lg:px-20">
                    <SectionHeading
                        tag="Методология"
                        title="Методология Rocketmind"
                        description="В арсенале Rocketmind — авторские и международные фреймворки, которые применяют крупнейшие компании мира."
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
                        <MethodCard
                            title="Канвас приоритизации проблем"
                            description="Позволяет понять, что действительно беспокоит клиентов, и выбрать задачи, которые стоит решать в первую очередь."
                        />
                        <MethodCard
                            title="Канвас цифровизации"
                            description="Помогает навести порядок в инициативах и выстроить стратегию трансформации: что менять, зачем и с какими ресурсами."
                        />
                        <MethodCard
                            title="Матрица развития компании"
                            description="Синхронизирует цели и инициативы на всех уровнях управления — от совета директоров до команд."
                        />
                        <MethodCard
                            title="Platform Innovation Kit"
                            description="Методология и набор инструментов, которую используют ведущие компании мира и школы бизнеса."
                        />
                    </div>

                    {/* PIK Block */}
                    <div className="p-8 md:p-12 rounded-md border border-[var(--rm-violet-100)]/30 bg-[var(--rm-violet-900)] relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[var(--rm-violet-100)] rounded-full blur-[200px] opacity-10 pointer-events-none" />
                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[62fr_38fr] gap-8 items-center">
                            <div>
                                <Badge className="mb-4 bg-[var(--rm-violet-100)] text-[var(--rm-violet-fg)] text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-[0.08em] hover:bg-[var(--rm-violet-100)]">
                                    Эксклюзив
                                </Badge>
                                <h3 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-25)] md:text-[36px] uppercase tracking-[-0.015em] leading-[1.1] mb-4">
                                    Platform Innovation Kit
                                </h3>
                                <p className="text-[length:var(--text-16)] text-muted-foreground leading-[1.618] mb-6">
                                    Rocketmind — официальный представитель Platform Innovation Kit.
                                    Это фреймворк, основанный на анализе 100+ успешных платформ по всему миру.
                                </p>
                                <a href="https://t.me/otideidomodeli" target="_blank" rel="noopener noreferrer">
                                    <Button variant="outline" className="font-[family-name:var(--font-mono-family)] uppercase tracking-[0.08em] text-[length:var(--text-12)]">
                                        Узнать больше
                                        <ChevronRight size={14} />
                                    </Button>
                                </a>
                            </div>
                            <div className="flex items-center justify-center">
                                <div className="w-40 h-40 md:w-56 md:h-56 rounded-full border-2 border-[var(--rm-violet-100)]/30 flex items-center justify-center">
                                    <div className="w-28 h-28 md:w-40 md:h-40 rounded-full border border-[var(--rm-violet-100)]/20 flex items-center justify-center">
                                        <Globe size={48} className="text-[var(--rm-violet-100)]" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="max-w-[1920px] mx-auto px-5 md:px-10 lg:px-20">
                <Separator />
            </div>

            {/* ═══════ CASES ═══════ */}
            <section id="cases" className="py-16 md:py-24 scroll-mt-20">
                <div className="max-w-[1920px] mx-auto px-5 md:px-10 lg:px-20">
                    <SectionHeading
                        tag="Кейсы"
                        title="Примеры задач, которые мы решали для клиентов"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {[
                            {
                                title: "Цифровая платформа для логистики",
                                tags: ["платформа", "логистика"],
                                products: ["Цифровая платформа", "Экосистемная стратегия"],
                            },
                            {
                                title: "Трансформация бизнес-модели ритейлера",
                                tags: ["трансформация", "ритейл"],
                                products: ["Стратегические сессии", "Диагностика"],
                            },
                            {
                                title: "Запуск marketplace-модели в EdTech",
                                tags: ["marketplace", "edtech"],
                                products: ["Platform Innovation Kit", "Дизайн-спринт"],
                            },
                            {
                                title: "AI-driven аналитика для банка",
                                tags: ["AI", "финтех"],
                                products: ["Умная аналитика", "ИИ-агент"],
                            },
                            {
                                title: "Экосистема здоровья",
                                tags: ["экосистема", "здоровье"],
                                products: ["Экосистемная стратегия", "Канвас цифровизации"],
                            },
                            {
                                title: "Получение статуса Сколково для агротех-стартапа",
                                tags: ["сколково", "агротех"],
                                products: ["Резидентство Сколково"],
                            },
                        ].map((c, i) => (
                            <div
                                key={i}
                                className="p-6 rounded-md border border-border bg-card transition-all duration-150 hover:border-muted-foreground dark:border-white/[0.06] dark:hover:border-white/[0.20] group cursor-pointer flex flex-col"
                            >
                                <div className="flex-1">
                                    <h3 className="font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-16)] uppercase tracking-[-0.005em] leading-[1.3] mb-3 group-hover:text-[var(--rm-yellow-100)] transition-colors">
                                        {c.title}
                                    </h3>
                                    <div className="flex flex-wrap gap-1.5 mb-4">
                                        {c.tags.map(t => (
                                            <Badge key={t} variant="outline" className="text-[10px] font-[family-name:var(--font-mono-family)] uppercase tracking-wider">
                                                {t}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                                <div className="pt-3 border-t border-border">
                                    <p className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-wider text-muted-foreground mb-1.5">
                                        Продукты:
                                    </p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {c.products.map(p => (
                                            <Badge key={p} variant="secondary" className="text-[10px] font-[family-name:var(--font-mono-family)]">
                                                {p}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <div className="max-w-[1920px] mx-auto px-5 md:px-10 lg:px-20">
                <Separator />
            </div>

            {/* ═══════ CTA ═══════ */}
            <section className="py-20 md:py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--rm-violet-900)] to-background pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--rm-yellow-100)] rounded-full blur-[300px] opacity-5 pointer-events-none" />

                <div className="relative z-10 max-w-[1920px] mx-auto px-5 md:px-10 lg:px-20 text-center">
                    <h2 className="font-[family-name:var(--font-heading-family)] font-extrabold text-[36px] md:text-[56px] lg:text-[72px] uppercase tracking-[-0.02em] leading-[1.05] mb-6">
                        Готовы начать?
                    </h2>
                    <p className="text-[length:var(--text-16)] md:text-[length:var(--text-19)] text-muted-foreground leading-[1.618] max-w-[540px] mx-auto mb-8">
                        Свяжитесь с нами, чтобы обсудить вашу задачу. Мы подберём подходящий продукт
                        и формат работы.
                    </p>
                    <a href="https://t.me/otideidomodeli" target="_blank" rel="noopener noreferrer">
                        <Button className="h-14 px-10 font-[family-name:var(--font-mono-family)] uppercase tracking-[0.08em] text-[length:var(--text-16)]">
                            <MessageCircle size={18} />
                            Связаться с нами
                        </Button>
                    </a>
                </div>
            </section>

            {/* ═══════ FOOTER ═══════ */}
            <footer className="border-t border-border py-10 md:py-14">
                <div className="max-w-[1920px] mx-auto px-5 md:px-10 lg:px-20">
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr] gap-8 md:gap-12 mb-10">
                        {/* Brand */}
                        <div>
                            <img
                                src="/text_logo_dark_background_en.svg"
                                alt="Rocketmind"
                                className="h-6 hidden dark:block mb-4"
                            />
                            <img
                                src="/text_logo_light_background_en.svg"
                                alt="Rocketmind"
                                className="h-6 dark:hidden mb-4"
                            />
                            <p className="text-[length:var(--text-14)] text-muted-foreground leading-[1.618]">
                                Стратегия и бизнес-модели.
                                <br />
                                Представители Platform Innovation Kit
                                <br />
                                в России и странах Азии.
                            </p>
                        </div>

                        {/* Nav */}
                        <div>
                            <p className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-[0.08em] text-muted-foreground mb-4">
                                Навигация
                            </p>
                            <nav className="space-y-2">
                                {navItems.map(item => (
                                    <a
                                        key={item.href}
                                        href={item.href}
                                        className="block text-[length:var(--text-14)] text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {item.label}
                                    </a>
                                ))}
                            </nav>
                        </div>

                        {/* Contacts */}
                        <div>
                            <p className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] uppercase tracking-[0.08em] text-muted-foreground mb-4">
                                Контакты
                            </p>
                            <div className="space-y-2 text-[length:var(--text-14)] text-muted-foreground">
                                <a
                                    href="https://t.me/otideidomodeli"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 hover:text-foreground transition-colors"
                                >
                                    <Send size={14} />
                                    Telegram
                                </a>
                                <a
                                    href="https://rocketmind.ru"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 hover:text-foreground transition-colors"
                                >
                                    <Globe size={14} />
                                    rocketmind.ru
                                </a>
                            </div>
                        </div>
                    </div>

                    <Separator className="mb-6" />

                    <div className="flex flex-col md:flex-row items-center justify-between gap-2">
                        <p className="text-[length:var(--text-12)] text-muted-foreground font-[family-name:var(--font-mono-family)]">
                            © 2024 Rocketmind. Все права защищены.
                        </p>
                        <p className="text-[length:var(--text-12)] text-muted-foreground font-[family-name:var(--font-mono-family)]">
                            Design System v1.1.0
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
