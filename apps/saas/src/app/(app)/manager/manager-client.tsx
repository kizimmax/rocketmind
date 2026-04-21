"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  PanelRightClose,
  PanelRightOpen,
  Sparkles,
} from "lucide-react";
import { Badge } from "@rocketmind/ui";
import Image from "next/image";
import { ManagerChat, type PrefillData } from "@/components/manager-chat";
import { useManager, useNewProjects, useProjects } from "@/lib/hooks";
import type { Project, ProjectStage } from "@/lib/types";
import { formatDate, pickExpertForProject } from "@/lib/utils";

const STAGE_LABEL: Record<ProjectStage, string> = {
  idea: "Идея",
  mvp: "MVP",
  seed: "Seed",
  early: "Early Stage",
  growth: "Growth",
};

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

export default function ManagerClient() {
  const searchParams = useSearchParams();
  const { activeProjects } = useProjects();
  const manager = useManager();
  const [listOpen, setListOpen] = useState(true);

  const prefill = useMemo<PrefillData | undefined>(() => {
    const raw = searchParams?.get("prefill");
    if (!raw) return undefined;
    try {
      return JSON.parse(decodeURIComponent(raw)) as PrefillData;
    } catch {
      return undefined;
    }
  }, [searchParams]);

  return (
    <div className="flex h-full flex-1 overflow-hidden">
      {/* Центр: чат с R-менеджером */}
      <div className="relative flex min-w-0 flex-1 flex-col">
        {/* Header: одинаковой высоты с шапкой проектов. На мобильных — в MobileHeader. */}
        <div className="hidden h-12 shrink-0 items-center justify-end gap-4 border-b border-border px-4 lg:flex">
          <div className="flex min-w-0 items-center gap-2">
            <p className="truncate font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">
              {manager.role}
            </p>
            <div className="h-6 w-6 shrink-0 overflow-hidden rounded-full">
              <Image
                src={manager.avatar_url}
                alt={manager.role}
                width={24}
                height={24}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={() => setListOpen((v) => !v)}
            aria-label={listOpen ? "Скрыть проекты" : "Показать проекты"}
            className="hidden h-9 w-9 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-rm-gray-1 hover:text-foreground lg:flex"
          >
            {listOpen ? (
              <PanelRightClose className="h-4 w-4" />
            ) : (
              <PanelRightOpen className="h-4 w-4" />
            )}
          </button>
        </div>

        <ManagerChat
          prefill={prefill}
          hasExistingProjects={activeProjects.length > 0}
        />
      </div>

      {/* Правая панель: список проектов (симметрично с project shell) */}
      {listOpen && (
        <aside className="hidden w-80 shrink-0 flex-col border-l border-border bg-background lg:flex">
          <div className="flex h-12 shrink-0 items-center justify-between border-b border-border px-4">
            <p className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">
              Проекты · {activeProjects.length}
            </p>
          </div>
          <div className="flex-1 overflow-y-auto p-3">
            {activeProjects.length === 0 ? (
              <EmptyProjects />
            ) : (
              <div className="space-y-2">
                {activeProjects.map((p) => (
                  <ProjectMiniCard key={p.id} project={p} />
                ))}
              </div>
            )}
          </div>
        </aside>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ProjectMiniCard — компактная карточка для правой панели /manager
// ─────────────────────────────────────────────────────────────────────────────

function ProjectMiniCard({ project }: { project: Project }) {
  const newProjects = useNewProjects();
  const isNew = newProjects.has(project.id);
  const progressPct =
    project.experts_total > 0
      ? (project.experts_completed / project.experts_total) * 100
      : 0;

  return (
    <Link
      href={`/projects/${project.id}?expert=${encodeURIComponent(pickExpertForProject(project))}`}
      data-new={isNew || undefined}
      className="group flex flex-col gap-2 rounded-sm border border-border bg-background p-3 transition-colors hover:border-foreground data-[new=true]:bg-[var(--rm-yellow-10)] data-[new=true]:rm-new-pulse"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="flex-1 font-[family-name:var(--font-heading-family)] text-[length:var(--text-14)] font-bold uppercase leading-tight">
          {project.name}
        </p>
        <Badge variant={STAGE_VARIANT[project.stage]} className="shrink-0">
          {STAGE_LABEL[project.stage]}
        </Badge>
      </div>
      <p className="text-[length:var(--text-12)] text-muted-foreground">
        {project.industry}
      </p>
      <div className="flex flex-col gap-1">
        <div className="flex items-baseline justify-between">
          <span className="text-[length:var(--text-12)] text-muted-foreground">
            {project.experts_completed}/{project.experts_total}
          </span>
          {project.score !== null && (
            <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.04em]">
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
      <p className="text-[length:var(--text-12)] text-muted-foreground">
        Обновлён {formatDate(project.updated_at)}
      </p>
    </Link>
  );
}

function EmptyProjects() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10 px-4 text-center">
      <Sparkles className="h-6 w-6 text-[var(--rm-yellow-100)]" />
      <p className="text-[length:var(--text-12)] text-muted-foreground">
        Проектов пока нет. Начните диалог с R-менеджером слева — он поможет собрать первый.
      </p>
    </div>
  );
}
