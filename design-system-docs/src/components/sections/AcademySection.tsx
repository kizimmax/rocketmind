import React from 'react';

export function AcademySection() {
    return (
        <section className="py-24 lg:py-32 bg-background" id="academy">
            <div className="container mx-auto px-5 lg:px-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    <div className="lg:col-span-5 flex flex-col gap-8">
                        <h2 className="font-heading font-bold text-[32px] md:text-[40px] lg:text-[56px] tracking-[-0.01em] uppercase text-foreground">
                            Академия
                        </h2>
                        <div className="flex flex-col gap-4">
                            <p className="font-body text-[length:var(--text-16)] lg:text-[length:var(--text-19)] leading-[1.618] text-muted-foreground">
                                Академия Rocketmind — это среда, где управленцы и команды осваивают бизнес-дизайн, платформенное мышление и работу с гипотезами.
                            </p>
                            <p className="font-body text-[length:var(--text-16)] lg:text-[length:var(--text-19)] leading-[1.618] text-muted-foreground">
                                Мы обучаем тому, что сами применяем в проектах: от системной стратегии до запуска цифровых инициатив.
                            </p>
                        </div>
                    </div>

                    <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div className="relative flex flex-col gap-4 p-6 rounded-xl border border-border bg-card transition-all duration-150 hover:border-muted-foreground dark:border-white/[0.06] dark:hover:border-white/[0.20] dark:hover:shadow-glow-subtle cursor-pointer group">
                            <h4 className="font-heading font-bold text-[length:var(--text-25)] uppercase tracking-[-0.005em] text-foreground">
                                Практикум по бизнес-дизайну
                            </h4>
                            <p className="font-body text-[length:var(--text-16)] text-muted-foreground leading-[1.618] flex-grow">
                                Навыки стратегического развития бизнеса — от поиска бизнес-модели до проектирования платформ и экосистем.
                            </p>
                            <button className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-md border border-[var(--rm-violet-300)] bg-transparent text-[var(--rm-violet-100)] font-mono text-[length:var(--text-12)] uppercase tracking-[0.08em] transition-all duration-150 hover:bg-[var(--rm-violet-900)] hover:shadow-glow-violet focus-visible:outline-none focus-visible:shadow-glow-violet disabled:opacity-40 disabled:pointer-events-none mt-4 w-full">
                                Подробнее
                            </button>
                        </div>

                        <div className="relative flex flex-col gap-4 p-6 rounded-xl border border-border bg-card transition-all duration-150 hover:border-muted-foreground dark:border-white/[0.06] dark:hover:border-white/[0.20] dark:hover:shadow-glow-subtle cursor-pointer group">
                            <h4 className="font-heading font-bold text-[length:var(--text-25)] uppercase tracking-[-0.005em] text-foreground">
                                Бизнес-дизайн. Быстрый старт
                            </h4>
                            <p className="font-body text-[length:var(--text-16)] text-muted-foreground leading-[1.618] flex-grow">
                                Онлайн-курс, который поможет быстро понять суть бизнес-дизайна и начать мыслить как стратег.
                            </p>
                            <button className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-md border border-[var(--rm-violet-300)] bg-transparent text-[var(--rm-violet-100)] font-mono text-[length:var(--text-12)] uppercase tracking-[0.08em] transition-all duration-150 hover:bg-[var(--rm-violet-900)] hover:shadow-glow-violet focus-visible:outline-none focus-visible:shadow-glow-violet disabled:opacity-40 disabled:pointer-events-none mt-4 w-full">
                                Подробнее
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
