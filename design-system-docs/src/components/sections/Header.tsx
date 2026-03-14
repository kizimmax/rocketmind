import React from 'react';
import Link from 'next/link';

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full h-16 bg-background border-b border-border flex items-center">
            <div className="container mx-auto px-5 lg:px-20 flex items-center justify-between w-full">
                <Link href="/" className="logo logo--text logo--header" aria-label="Rocketmind">
                    <span className="font-heading font-bold text-[length:var(--text-25)] uppercase tracking-[-0.005em] text-foreground">
                        Rocketmind
                    </span>
                </Link>

                <nav className="hidden md:flex items-center gap-8">
                    {/* According to design system: ghost-кнопки или plain <a>, font-mono, 13px, uppercase, tracking-[0.08em] */}
                    <Link href="/products" className="font-mono text-[length:var(--text-12)] tracking-[0.08em] uppercase text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:border-b focus-visible:border-ring">
                        Продукты
                    </Link>
                    <Link href="/#academy" className="font-mono text-[length:var(--text-12)] tracking-[0.08em] uppercase text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:border-b focus-visible:border-ring">
                        Академия
                    </Link>
                    <Link href="/cases" className="font-mono text-[length:var(--text-12)] tracking-[0.08em] uppercase text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:border-b focus-visible:border-ring">
                        Кейсы
                    </Link>
                    <Link href="/reviews" className="font-mono text-[length:var(--text-12)] tracking-[0.08em] uppercase text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:border-b focus-visible:border-ring">
                        Отзывы
                    </Link>
                    <Link href="/about" className="font-mono text-[length:var(--text-12)] tracking-[0.08em] uppercase text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:border-b focus-visible:border-ring">
                        О компании
                    </Link>
                </nav>

                <div className="flex items-center gap-4">
                    <button className="hidden sm:inline-flex items-center justify-center gap-2 h-10 px-4 rounded-md bg-[var(--rm-yellow-100)] text-[var(--rm-yellow-fg)] font-mono text-[length:var(--text-12)] uppercase tracking-[0.08em] transition-all duration-150 hover:bg-[var(--rm-yellow-300)] hover:shadow-glow-yellow focus-visible:outline-none focus-visible:shadow-glow-yellow active:bg-[var(--rm-yellow-500)]">
                        Оставить заявку
                    </button>
                    <button className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
                        <span className="sr-only">Toggle menu</span>
                    </button>
                </div>
            </div>
        </header>
    );
}
