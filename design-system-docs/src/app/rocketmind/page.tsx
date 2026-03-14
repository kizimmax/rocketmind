import React from 'react';
import { Header } from '@/components/sections/Header';
import { HeroSection } from '@/components/sections/HeroSection';
import { ServicesGrid } from '@/components/sections/ServicesGrid';
import { AcademySection } from '@/components/sections/AcademySection';
import { MethodologySection } from '@/components/sections/MethodologySection';
import { ContactForm } from '@/components/sections/ContactForm';

export const metadata = {
    title: 'Rocketmind | Стратегия и бизнес-модели',
    description: 'Помогаем командам искать, проверять и усиливать бизнес-модели, связывать стратегию с операционными действиями и переходить от продуктовой логики к платформенной и экосистемной архитектуре.',
};

export default function RocketmindPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col font-body">
            <Header />
            <main className="flex-1">
                <HeroSection />
                <ServicesGrid />
                <AcademySection />
                <MethodologySection />
                <ContactForm />
            </main>

            {/* Simple Footer */}
            <footer className="py-8 bg-background border-t border-border">
                <div className="container mx-auto px-5 lg:px-20 flex justify-center text-center">
                    <p className="text-muted-foreground font-mono text-[length:var(--text-12)] tracking-[0.08em] uppercase">
                        © {new Date().getFullYear()} Rocketmind. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
