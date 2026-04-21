"use client";

import Link from "next/link";
import { Badge } from "@rocketmind/ui";
import type { Project, ProjectStage } from "@/lib/types";
import { formatDate } from "@/lib/utils";

// Маппинг стадии на DS-badge variant (используем существующую палитру badge 6.1.1)
const STAGE_VARIANT: Record<
  ProjectStage,
  Parameters<typeof Badge>[0]["variant"]
> = {
  idea: "neutral",
  mvp: "yellow-subtle",
  seed: "sky-subtle",
  early: "violet-subtle",
  growth: "blue-subtle",
};

const STAGE_LABEL: Record<ProjectStage, string> = {
  idea: "Идея",
  mvp: "MVP",
  seed: "Seed",
  early: "Early Stage",
  growth: "Growth",
};

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const progressPct =
    project.experts_total > 0
      ? (project.experts_completed / project.experts_total) * 100
      : 0;

  const isCompleted = project.status === "completed";

  return (
    <Link
      href={`/projects/${project.id}?expert=${encodeURIComponent(project.current_expert_codename ?? "R1")}`}
      className="group flex flex-col gap-4 rounded-sm border border-border bg-background p-5 transition-colors hover:border-foreground"
    >
      {/* Header: title + stage badge */}
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-20)] font-bold uppercase leading-tight">
          {project.name}
        </h3>
        <Badge variant={STAGE_VARIANT[project.stage]} className="shrink-0">
          {STAGE_LABEL[project.stage]}
        </Badge>
      </div>

      {/* Meta: industry */}
      <p className="text-[length:var(--text-14)] text-muted-foreground">
        {project.industry}
      </p>

      {/* Progress bar — паттерн из DS 6.3.1 course-card (h-1 rounded-full bg-muted + bg-primary) */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-baseline justify-between">
          <span className="text-[length:var(--text-12)] text-muted-foreground">
            {isCompleted
              ? "Все эксперты завершены"
              : `${project.experts_completed} из ${project.experts_total} экспертов`}
          </span>
          {project.score !== null && (
            <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.04em] text-foreground">
              Score {project.score}
            </span>
          )}
        </div>
        <div className="h-1 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Footer: updated date */}
      <div className="flex items-center justify-between text-[length:var(--text-12)] text-muted-foreground">
        <span>Обновлён {formatDate(project.updated_at)}</span>
        {project.current_expert_codename && !isCompleted && (
          <span className="font-[family-name:var(--font-mono-family)] uppercase tracking-[0.04em]">
            сейчас: {project.current_expert_codename}
          </span>
        )}
      </div>
    </Link>
  );
}
