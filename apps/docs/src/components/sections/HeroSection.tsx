import React from 'react';
import { Button } from '@/components/ui/button';

export function HeroSection() {
    return (
        <section className="relative overflow-hidden bg-background py-24 lg:py-32 ambient-glow-violet dark">
            {/* Animated Grid Lines */}
            <div className="grid-lines">
                <div className="grid-line grid-line--h" style={{ top: '25%', animationDelay: '0.1s' }} />
                <div className="grid-line grid-line--h" style={{ top: '50%', animationDelay: '0.2s' }} />
                <div className="grid-line grid-line--h" style={{ top: '75%', animationDelay: '0.3s' }} />
                <div className="grid-line grid-line--v" style={{ left: '25%', animationDelay: '0.15s' }} />
                <div className="grid-line grid-line--v" style={{ left: '50%', animationDelay: '0.25s' }} />
                <div className="grid-line grid-line--v" style={{ left: '75%', animationDelay: '0.35s' }} />
            </div>

            <div className="container mx-auto px-5 lg:px-20 relative z-10">
                <div className="bracket p-5 lg:p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                        <div className="lg:col-span-8 flex flex-col items-start gap-10">
                            <h1 className="font-heading font-bold text-[64px] md:text-[88px] lg:text-[120px] leading-[0.9] tracking-[-0.02em] uppercase text-foreground">
                                <span className="block text-primary">платформы</span>
                                <span className="block text-primary">экосистемы</span>
                                <span className="block text-primary">сервисы</span>
                                <span className="block mt-6 text-[32px] md:text-[40px] lg:text-[56px] tracking-[-0.01em]">Стратегия и бизнес-модели</span>
                            </h1>

                            <p className="font-body text-base lg:text-lg leading-[1.618] text-muted-foreground w-full max-w-[600px]">
                                Помогаем командам искать, проверять и усиливать бизнес-модели, связывать стратегию с операционными действиями и переходить от продуктовой логики к платформенной и экосистемной архитектуре.
                            </p>

                            <button className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-md bg-[#FFCC00] text-[#121212] font-mono text-[13px] uppercase tracking-[0.08em] transition-all duration-150 hover:bg-[#FFE040] hover:shadow-glow-yellow focus-visible:outline-none focus-visible:shadow-glow-yellow active:bg-[#E6B800] mt-4">
                                Связаться
                            </button>
                        </div>

                        <div className="lg:col-span-4 flex flex-col gap-6 lg:border-l lg:border-white/[0.06] lg:pl-10">
                            <p className="font-heading font-bold text-xl lg:text-2xl uppercase tracking-[-0.005em] text-foreground">
                                Развиваем методологию бизнес-дизайна, представляем Platform Innovation Kit в России и странах Азии
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
