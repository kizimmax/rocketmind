"use client";

import Link from "next/link";
import { Button } from "@rocketmind/ui";
import { Plus, Sparkles } from "lucide-react";
import { useProjects } from "@/lib/hooks";
import { ProjectCard } from "@/components/project-card";

export default function DashboardPage() {
  const { inProgressProjects, completedProjects } = useProjects();

  const hasProjects =
    inProgressProjects.length > 0 || completedProjects.length > 0;

  if (!hasProjects) {
    return (
      <div className="flex h-full flex-1 items-center justify-center px-6">
        <div className="max-w-sm space-y-4 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-sm bg-rm-gray-1">
            <Sparkles className="h-6 w-6 text-[var(--rm-yellow-100)]" />
          </div>
          <h2 className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-24)] font-bold uppercase">
            Добро пожаловать
          </h2>
          <p className="text-[length:var(--text-14)] text-muted-foreground">
            Создайте первый проект — R-Команда из 6 экспертов поможет
            пройти путь от идеи до инвест-пакета за пару дней.
          </p>
          <Link href="/onboarding">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Новый проект
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      <div className="mx-auto w-full max-w-5xl space-y-10 px-5 py-8 lg:px-8 lg:py-12">
        {/* Header */}
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-32)] font-bold uppercase">
              Проекты
            </h1>
            <p className="mt-1 text-[length:var(--text-14)] text-muted-foreground">
              Ваши текущие и завершённые проекты
            </p>
          </div>
          <Link href="/onboarding">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Новый проект
            </Button>
          </Link>
        </div>

        {/* In-progress projects */}
        {inProgressProjects.length > 0 && (
          <section className="space-y-4">
            <h2 className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">
              В работе ({inProgressProjects.length})
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {inProgressProjects.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          </section>
        )}

        {/* Completed projects */}
        {completedProjects.length > 0 && (
          <section className="space-y-4">
            <h2 className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">
              Завершённые ({completedProjects.length})
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {completedProjects.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
