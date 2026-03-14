import React from 'react';
import { ArrowRight, Lightbulb, Link2, GitMerge, Rocket, Workflow, Target, Play, ShieldCheck, Cpu } from 'lucide-react';

const services = [
    {
        title: "Умная аналитика для развития бизнеса",
        description: "Проводим глубокий ресёрч с использованием ИИ. Итог — инсайты, на основе которых можно строить стратегию.",
        icon: Lightbulb
    },
    {
        title: "Цифровая платформа в вашем бизнесе",
        description: "Находим платформенную логику, чтобы масштабироваться и запускать новые потоки дохода.",
        icon: Link2
    },
    {
        title: "Экосистемная стратегия",
        description: "Поможем создать стратегию и портфель бизнес-моделей, которые расширят влияние и сделают бизнес более устойчивым.",
        icon: GitMerge
    },
    {
        title: "Организация дизайн-спринтов",
        description: "За 5 дней проверим идею, создадим прототип и протестируем на реальных пользователях.",
        icon: Rocket
    },
    {
        title: "Стратегические и дизайн-сессии",
        description: "Организуем рабочие сессии для поиска решений, запуска гипотез и формирования общего видения.",
        icon: Workflow
    },
    {
        title: "Диагностика готовности команды",
        description: "Помогаем увидеть, что происходит внутри вашей организации. Определяем зоны роста и слабые места.",
        icon: Target
    },
    {
        title: "Диагностика готовности бизнеса",
        description: "Инструмент поможет быстро оценить риски и выбрать правильное направление для развития.",
        icon: Play
    },
    {
        title: "Получение статуса резидента Сколково",
        description: "Сопроводим вас на всех этапах — от подготовки заявки до заключения договора с Фондом.",
        icon: ShieldCheck
    },
    {
        title: "ИИ-агент по бизнес-гипотезам",
        description: "Помогает быстро формулировать гипотезы, выбирать эксперименты и измерять их успех.",
        icon: Cpu
    }
];

export function ServicesGrid() {
    return (
        <section className="py-24 lg:py-32 bg-secondary" id="products">
            <div className="container mx-auto px-5 lg:px-20">
                <div className="flex flex-col gap-16">
                    <div className="flex flex-col gap-4">
                        <h2 className="font-heading font-bold text-[32px] md:text-[40px] lg:text-[56px] tracking-[-0.01em] uppercase text-foreground">
                            Продукты и Сервисы
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {services.map((service, index) => {
                            const Icon = service.icon;
                            return (
                                <div key={index} className="relative flex flex-col gap-4 p-6 rounded-xl border border-border bg-card text-card-foreground transition-all duration-150 hover:border-muted-foreground dark:border-white/[0.06] dark:hover:border-white/[0.12] dark:hover:shadow-glow-subtle cursor-pointer group">
                                    <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground">
                                        <Icon size={20} className="transition-colors duration-150 group-hover:text-foreground" />
                                    </div>
                                    <h4 className="font-heading font-bold text-[length:var(--text-25)] uppercase tracking-[-0.005em] text-foreground">
                                        {service.title}
                                    </h4>
                                    <p className="font-body text-[length:var(--text-16)] text-muted-foreground leading-[1.618]">
                                        {service.description}
                                    </p>
                                    <span className="link-cta mt-auto">
                                        Подробнее <ArrowRight size={14} className="arrow" />
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
