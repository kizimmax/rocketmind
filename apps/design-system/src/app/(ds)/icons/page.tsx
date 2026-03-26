"use client"

import React from "react"
import {
  Rocket, Sparkles, Eye, Zap, Search, User, Gem, BookOpen,
  ChevronRight, Loader2,
} from "lucide-react"
import { Separator } from "@rocketmind/ui"
import { Section } from "@/components/ds/shared"
import { CopyButton } from "@/components/copy-button"
import { MascotSection } from "@/components/ds/mascot"

export default function IconsPage() {
  return (
    <>
      <Section id="icons" title="7. Иконки">
        <p className="text-muted-foreground mb-6">
          Основная библиотека — <strong>Lucide Icons</strong>. Outline, 24px viewbox, stroke 2px (фиксированный).
          Цвет наследуется через currentColor. Толщина не масштабируется с размером:{" "}
          <code className="text-[length:var(--text-12)] font-[family-name:var(--font-caption-family)] bg-rm-gray-3 px-1 py-0.5 rounded">strokeWidth={"{48/size}"}</code>.
        </p>

        <h3 id="icons-scale" className="scroll-mt-20 font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-24)] md:text-[length:var(--text-32)] uppercase tracking-[-0.01em] mb-4">
          Размерная шкала
        </h3>
        <div className="flex flex-wrap items-end gap-6 mb-8">
          {[
            { size: 12, label: "xs (12px)", tw: "size={12} strokeWidth={4}" },
            { size: 16, label: "sm (16px)", tw: "size={16} strokeWidth={3}" },
            { size: 20, label: "md (20px)", tw: "size={20} strokeWidth={2.4}" },
            { size: 24, label: "lg (24px)", tw: "size={24} strokeWidth={2}" },
            { size: 32, label: "xl (32px)", tw: "size={32} strokeWidth={1.5}" },
            { size: 40, label: "2xl (40px)", tw: "size={40} strokeWidth={1.2}" },
          ].map((icon) => (
            <div key={icon.size} className="flex flex-col items-center gap-2">
              <div className="flex items-center justify-center w-16 h-16 rounded-lg border border-border">
                <Rocket size={icon.size} strokeWidth={48/icon.size} className="text-muted-foreground" />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] text-muted-foreground">{icon.label}</span>
                <CopyButton value={icon.tw} label={icon.label} />
              </div>
            </div>
          ))}
        </div>

        <h3 id="icons-lucide" className="scroll-mt-20 font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-24)] md:text-[length:var(--text-32)] uppercase tracking-[-0.01em] mb-4">
          Примеры иконок (Lucide)
        </h3>
        <div className="flex flex-wrap gap-3 mb-8">
          {[
            { icon: <Rocket size={20} strokeWidth={2.4} />, name: "Rocket" },
            { icon: <Sparkles size={20} strokeWidth={2.4} />, name: "Sparkles" },
            { icon: <Eye size={20} strokeWidth={2.4} />, name: "Eye" },
            { icon: <Zap size={20} strokeWidth={2.4} />, name: "Zap" },
            { icon: <Search size={20} strokeWidth={2.4} />, name: "Search" },
            { icon: <User size={20} strokeWidth={2.4} />, name: "User" },
            { icon: <Gem size={20} strokeWidth={2.4} />, name: "Gem" },
            { icon: <BookOpen size={20} strokeWidth={2.4} />, name: "BookOpen" },
            { icon: <ChevronRight size={20} strokeWidth={2.4} />, name: "ChevronRight" },
            { icon: <Loader2 size={20} strokeWidth={2.4} className="animate-spin" />, name: "Loader2" },
          ].map((item) => (
            <div key={item.name} className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-border hover:bg-rm-gray-3 transition-colors cursor-pointer group">
              <div className="text-muted-foreground group-hover:text-foreground transition-colors">
                {item.icon}
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[length:var(--text-12)] font-[family-name:var(--font-mono-family)] text-muted-foreground">{item.name}</span>
                <CopyButton value={`<${item.name} size={20} strokeWidth={2.4} />`} label={item.name} />
              </div>
            </div>
          ))}
        </div>

        <h3 id="icons-mascots" className="scroll-mt-20 font-[family-name:var(--font-heading-family)] font-bold text-[length:var(--text-24)] md:text-[length:var(--text-32)] uppercase tracking-[-0.01em] mb-4">
          AI-агенты (Маскоты)
        </h3>
        <MascotSection />
      </Section>

      <Separator />
    </>
  )
}
