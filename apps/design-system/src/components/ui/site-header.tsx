'use client'

import React from 'react'
import { createPortal } from 'react-dom'
import { Menu, X, LucideIcon, Sparkles, Zap, Layers, BarChart2, GraduationCap, Users, BookOpen, FileText, Bot, Code2, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@rocketmind/ui'

/* ── Hook: detect scroll past threshold ── */
function useScroll(threshold: number) {
  const [scrolled, setScrolled] = React.useState(false)
  const onScroll = React.useCallback(() => {
    setScrolled(window.scrollY > threshold)
  }, [threshold])
  React.useEffect(() => {
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [onScroll])
  React.useEffect(() => { onScroll() }, [onScroll])
  return scrolled
}

/* ── Dropdown data ── */
type NavItem = { title: string; href: string; description: string; icon: LucideIcon }

const SERVICES: NavItem[] = [
  { title: 'AI-консалтинг',  href: '#', description: 'Стратегия внедрения ИИ в бизнес', icon: Sparkles },
  { title: 'Автоматизация',  href: '#', description: 'Автоматизируем рутину через n8n', icon: Zap },
  { title: 'Кейс-система',   href: '#', description: 'Платформа для ведения кейсов',    icon: Layers },
  { title: 'Аналитика',      href: '#', description: 'Дашборды, данные и отчёты',        icon: BarChart2 },
]

const ACADEMY: NavItem[] = [
  { title: 'Курсы',          href: '#', description: 'Обучение работе с ИИ',              icon: GraduationCap },
  { title: 'Мастер-классы',  href: '#', description: 'Практические воркшопы с экспертами',icon: Users },
  { title: 'База знаний',    href: '#', description: 'Статьи, гайды, шаблоны промптов',  icon: BookOpen },
  { title: 'Корп. обучение', href: '#', description: 'Тренинги для команд и отделов',    icon: FileText },
]

const AI_PRODUCTS: NavItem[] = [
  { title: 'AI-агенты',      href: '#', description: 'Персональные агенты под ваши задачи', icon: Bot },
  { title: 'AI-аналитик',    href: '#', description: 'Анализирует данные и строит гипотезы', icon: BarChart2 },
  { title: 'AI-маркетолог',  href: '#', description: 'Стратегии, контент, продвижение',      icon: Sparkles },
  { title: 'AI-разработчик', href: '#', description: 'Помогает с кодом и архитектурой',      icon: Code2 },
]

/* ── Dropdown item ── */
function DropdownItem({ item }: { item: NavItem }) {
  return (
    <NavigationMenuLink asChild>
      <a
        href={item.href}
        className="flex items-center gap-3 rounded-sm p-2.5 hover:bg-accent transition-colors duration-150 group/item"
      >
        <div className="flex size-9 shrink-0 items-center justify-center rounded-sm border border-border bg-background">
          <item.icon size={16} strokeWidth={1.5} className="text-muted-foreground group-hover/item:text-foreground transition-colors duration-150" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-foreground leading-none mb-0.5">
            {item.title}
          </span>
          <span className="text-[length:var(--text-12)] text-muted-foreground leading-snug line-clamp-1">
            {item.description}
          </span>
        </div>
      </a>
    </NavigationMenuLink>
  )
}

/* ── Mobile accordion group ── */
function MobileGroup({ label, items, onClose }: { label: string; items: NavItem[]; onClose: () => void }) {
  const [open, setOpen] = React.useState(false)
  return (
    <div>
      <button
        className="flex w-full items-center justify-between px-3 py-2.5 rounded-sm font-[family-name:var(--font-mono-family)] text-[length:var(--text-14)] uppercase tracking-[0.08em] text-muted-foreground hover:text-foreground hover:bg-accent transition-colors duration-150 cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        {label}
        <ChevronDown size={14} strokeWidth={1.5} className={cn('transition-transform duration-200', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="mt-0.5 ml-3 flex flex-col gap-0.5">
          {items.map((item) => (
            <a
              key={item.title}
              href={item.href}
              onClick={onClose}
              className="flex items-center gap-2.5 px-3 py-2 rounded-sm text-[length:var(--text-14)] text-muted-foreground hover:text-foreground hover:bg-accent transition-colors duration-150"
            >
              <item.icon size={14} strokeWidth={1.5} className="shrink-0" />
              {item.title}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

/* ── Component ── */
type SiteHeaderProps = {
  /** Base path for logo images (e.g. "/rocketmind-design-system" in prod) */
  basePath?: string
  /** Preview mode: disables sticky positioning (for DS docs demos) */
  preview?: boolean
}

export function SiteHeader({ basePath = '', preview = false }: SiteHeaderProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const scrolled = useScroll(10)

  React.useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const headerBg = scrolled || preview
    ? 'border-border bg-background/95 supports-[backdrop-filter]:bg-background/60 backdrop-blur-lg'
    : 'border-transparent bg-transparent'

  return (
    <header
      className={cn(
        'z-50 w-full border-b transition-all duration-300',
        preview ? 'relative' : 'sticky top-0',
        headerBg,
      )}
    >
      {/* ── Full-width row: [icon] [content] ── */}
      <div className="flex h-16 w-full items-center">

        {/* Icon logo — flush left, no padding */}
        <a href="#" aria-label="Rocketmind" className="flex-shrink-0">
          <img
            src={`${basePath}/icon_light_background.svg`}
            alt=""
            className="h-16 w-auto dark:hidden"
          />
          <img
            src={`${basePath}/icon_dark_background.svg`}
            alt=""
            className="h-16 w-auto hidden dark:block"
          />
        </a>

        {/* ── Inner padded content ── */}
        <div className="flex flex-1 items-center px-5 min-w-0">

          {/* Text logo */}
          <a
            href="#"
            aria-label="Rocketmind"
            className="flex items-center px-1 mr-4 shrink-0"
          >
            <img
              src={`${basePath}/text_logo_dark_background_en.svg`}
              alt="Rocketmind"
              className="h-6 w-auto hidden dark:block"
            />
            <img
              src={`${basePath}/text_logo_light_background_en.svg`}
              alt="Rocketmind"
              className="h-6 w-auto dark:hidden"
            />
          </a>

          <div className="hidden md:flex items-center gap-2 ml-auto pl-6">
            {/* Desktop nav with dropdowns */}
            <NavigationMenu className="flex justify-end">
              <NavigationMenuList>
                {/* Услуги */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Услуги</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[480px] grid-cols-2 gap-1.5 p-3">
                      {SERVICES.map((item) => (
                        <li key={item.title}><DropdownItem item={item} /></li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Академия */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Академия</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[480px] grid-cols-2 gap-1.5 p-3">
                      {ACADEMY.map((item) => (
                        <li key={item.title}><DropdownItem item={item} /></li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* ИИ-продукты */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger>ИИ-продукты</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[480px] grid-cols-2 gap-1.5 p-3">
                      {AI_PRODUCTS.map((item) => (
                        <li key={item.title}><DropdownItem item={item} /></li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Plain links */}
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <a
                      href="#"
                      className="inline-flex items-center px-3 py-2 rounded-sm font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground hover:text-foreground hover:bg-accent transition-colors duration-150"
                    >
                      Тарифы
                    </a>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <a
                      href="#"
                      className="inline-flex items-center px-3 py-2 rounded-sm font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground hover:text-foreground hover:bg-accent transition-colors duration-150"
                    >
                      О нас
                    </a>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* Desktop CTA */}
            <div className="flex items-center gap-2 ml-4 shrink-0">
              <button className="inline-flex items-center justify-center h-9 px-4 rounded-sm border border-transparent bg-secondary text-secondary-foreground font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] transition-all duration-150 hover:opacity-[0.88] active:opacity-[0.76] cursor-pointer">
                Войти
              </button>
              <button className="inline-flex items-center justify-center h-9 px-4 rounded-sm bg-[var(--rm-yellow-100)] text-[var(--rm-yellow-fg)] font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] transition-all duration-150 hover:bg-[var(--rm-yellow-300)] cursor-pointer">
                Попробовать
              </button>
            </div>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden ml-auto inline-flex items-center justify-center h-9 w-9 rounded-sm border border-border bg-transparent text-muted-foreground hover:bg-accent hover:text-foreground transition-colors duration-150 cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Закрыть меню' : 'Открыть меню'}
          >
            {mobileOpen ? <X size={18} strokeWidth={1.5} /> : <Menu size={18} strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {/* Mobile menu (portal) */}
      {mobileOpen && typeof window !== 'undefined' && createPortal(
        <div
          id="site-mobile-menu"
          className="fixed top-16 left-0 right-0 bottom-0 z-40 bg-background/95 supports-[backdrop-filter]:bg-background/60 backdrop-blur-lg border-t border-border md:hidden overflow-y-auto"
        >
          <div className="flex flex-col p-4 gap-0.5">
            <MobileGroup label="Услуги"      items={SERVICES}     onClose={() => setMobileOpen(false)} />
            <MobileGroup label="Академия"    items={ACADEMY}      onClose={() => setMobileOpen(false)} />
            <MobileGroup label="ИИ-продукты" items={AI_PRODUCTS}  onClose={() => setMobileOpen(false)} />
            <a href="#" onClick={() => setMobileOpen(false)}
              className="block px-3 py-2.5 rounded-sm font-[family-name:var(--font-mono-family)] text-[length:var(--text-14)] uppercase tracking-[0.08em] text-muted-foreground hover:text-foreground hover:bg-accent transition-colors duration-150">
              Тарифы
            </a>
            <a href="#" onClick={() => setMobileOpen(false)}
              className="block px-3 py-2.5 rounded-sm font-[family-name:var(--font-mono-family)] text-[length:var(--text-14)] uppercase tracking-[0.08em] text-muted-foreground hover:text-foreground hover:bg-accent transition-colors duration-150">
              О нас
            </a>
            <div className="flex flex-col gap-2 pt-4 mt-2 border-t border-border">
              <button className="w-full inline-flex items-center justify-center h-10 px-4 rounded-sm border border-transparent bg-secondary text-secondary-foreground font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] transition-all duration-150 hover:opacity-[0.88] active:opacity-[0.76] cursor-pointer">
                Войти
              </button>
              <button className="w-full inline-flex items-center justify-center h-10 px-4 rounded-sm bg-[var(--rm-yellow-100)] text-[var(--rm-yellow-fg)] font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] transition-all duration-150 hover:bg-[var(--rm-yellow-300)] cursor-pointer">
                Попробовать
              </button>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </header>
  )
}
