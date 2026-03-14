import React from 'react';
import { Target, Frame, Grid3X3 } from 'lucide-react';

export function MethodologySection() {
    return (
        <section className="py-24 lg:py-32 bg-secondary">
            <div className="container mx-auto px-5 lg:px-20">
                <div className="flex flex-col gap-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="flex flex-col gap-6">
                            <h2 className="font-heading font-bold text-[32px] md:text-[40px] lg:text-[56px] tracking-[-0.01em] uppercase text-foreground">
                                Методология Rocketmind
                            </h2>
                            <div className="flex flex-col gap-4">
                                <p className="font-body text-[length:var(--text-16)] lg:text-[length:var(--text-19)] leading-[1.618] text-muted-foreground">
                                    В арсенале Rocketmind — авторские и международные фреймворки, которые применяют крупнейшие компании мира.
                                </p>
                                <p className="font-body text-[length:var(--text-16)] lg:text-[length:var(--text-19)] leading-[1.618] text-muted-foreground">
                                    Наши инструменты помогают не просто «оформить» идею, а разобраться, работает ли она как бизнес-модель, и на каком этапе зрелости находится ваша инициатива.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="relative flex flex-col gap-4 p-6 rounded-xl border border-border bg-card transition-all duration-150 hover:border-muted-foreground dark:border-white/[0.06] dark:hover:border-white/[0.20] dark:hover:shadow-glow-subtle cursor-pointer group">
                            <div className="w-12 h-12 rounded-lg border border-border bg-muted flex items-center justify-center text-muted-foreground flex-shrink-0">
                                <Target size={24} className="text-[var(--rm-yellow-100)]" />
                            </div>
                            <h4 className="font-heading font-bold text-[length:var(--text-25)] uppercase tracking-[-0.005em] text-foreground">
                                Канвас приоритетизации проблем
                            </h4>
                            <p className="font-body text-[length:var(--text-16)] text-muted-foreground leading-[1.618] flex-grow">
                                Позволяет понять, что действительно беспокоит клиентов, и выбрать задачи, которые стоит решать в первую очередь.
                            </p>
                            <button className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-md border border-[var(--rm-violet-300)] bg-transparent text-[var(--rm-violet-100)] font-mono text-[length:var(--text-12)] uppercase tracking-[0.08em] transition-all duration-150 hover:bg-[var(--rm-violet-900)] hover:shadow-glow-violet focus-visible:outline-none focus-visible:shadow-glow-violet disabled:opacity-40 disabled:pointer-events-none mt-4 w-full">
                                Получить доступ
                            </button>
                        </div>

                        <div className="relative flex flex-col gap-4 p-6 rounded-xl border border-border bg-card transition-all duration-150 hover:border-muted-foreground dark:border-white/[0.06] dark:hover:border-white/[0.20] dark:hover:shadow-glow-subtle cursor-pointer group">
                            <div className="w-12 h-12 rounded-lg border border-border bg-muted flex items-center justify-center text-muted-foreground flex-shrink-0">
                                <Frame size={24} className="text-[var(--rm-yellow-100)]" />
                            </div>
                            <h4 className="font-heading font-bold text-[length:var(--text-25)] uppercase tracking-[-0.005em] text-foreground">
                                Канвас цифровизации
                            </h4>
                            <p className="font-body text-[length:var(--text-16)] text-muted-foreground leading-[1.618] flex-grow">
                                Помогает навести порядок в инициативах и выстроить стратегию трансформации: что менять, зачем и с какими ресурсами.
                            </p>
                            <button className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-md border border-[var(--rm-violet-300)] bg-transparent text-[var(--rm-violet-100)] font-mono text-[length:var(--text-12)] uppercase tracking-[0.08em] transition-all duration-150 hover:bg-[var(--rm-violet-900)] hover:shadow-glow-violet focus-visible:outline-none focus-visible:shadow-glow-violet disabled:opacity-40 disabled:pointer-events-none mt-4 w-full">
                                Получить доступ
                            </button>
                        </div>

                        <div className="relative flex flex-col gap-4 p-6 rounded-xl border border-border bg-card transition-all duration-150 hover:border-muted-foreground dark:border-white/[0.06] dark:hover:border-white/[0.20] dark:hover:shadow-glow-subtle cursor-pointer group">
                            <div className="w-12 h-12 rounded-lg border border-border bg-muted flex items-center justify-center text-muted-foreground flex-shrink-0">
                                <Grid3X3 size={24} className="text-[var(--rm-yellow-100)]" />
                            </div>
                            <h4 className="font-heading font-bold text-[length:var(--text-25)] uppercase tracking-[-0.005em] text-foreground">
                                Матрица корпоративного развития
                            </h4>
                            <p className="font-body text-[length:var(--text-16)] text-muted-foreground leading-[1.618] flex-grow">
                                Синхронизирует цели и инициативы на всех уровнях управления — от совета директоров до команд.
                            </p>
                            <button className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-md border border-[var(--rm-violet-300)] bg-transparent text-[var(--rm-violet-100)] font-mono text-[length:var(--text-12)] uppercase tracking-[0.08em] transition-all duration-150 hover:bg-[var(--rm-violet-900)] hover:shadow-glow-violet focus-visible:outline-none focus-visible:shadow-glow-violet disabled:opacity-40 disabled:pointer-events-none mt-4 w-full">
                                Получить доступ
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
