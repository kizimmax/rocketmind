"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FileText,
  PanelRightClose,
  PanelRightOpen,
} from "lucide-react";
import { Badge, Button, Note } from "@rocketmind/ui";
import {
  markProjectAsSeen,
  useArtifacts,
  useExperts,
  useExpertMessages,
  useExpertSessions,
  useProject,
} from "@/lib/hooks";
import { ExpertChat } from "@/components/expert-chat";
import type { Artifact, ExpertCodename } from "@/lib/types";

const STAGE_LABEL: Record<string, string> = {
  idea: "Идея",
  mvp: "MVP",
  seed: "Seed",
  early: "Early Stage",
  growth: "Growth",
};

export default function ProjectClient({ id }: { id: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const project = useProject(id);
  const { getExpert } = useExperts();
  const { artifacts } = useArtifacts(id);
  const { sessions } = useExpertSessions(id);
  const [artifactsOpen, setArtifactsOpen] = useState(true);

  // При первом открытии проекта — снимаем pulse-флаг в sidebar
  useEffect(() => {
    markProjectAsSeen(id);
  }, [id]);

  // Активный эксперт: из URL ?expert=R1, иначе текущий pipeline-эксперт, иначе R1
  const activeExpertCodename =
    (searchParams?.get("expert") as ExpertCodename | null) ??
    project?.current_expert_codename ??
    "R1";

  const activeExpert = useMemo(
    () => getExpert(activeExpertCodename),
    [activeExpertCodename, getExpert]
  );

  const activeSession = useMemo(
    () => sessions.find((s) => s.expert_codename === activeExpertCodename),
    [sessions, activeExpertCodename]
  );
  const activeMessages = useExpertMessages(activeSession?.id);

  if (!project) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <div className="space-y-3 text-center">
          <Note variant="error">Проект не найден</Note>
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            На дашборд
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-1 overflow-hidden">
      {/* ── CENTER: expert chat ────────────────────────────────────────────── */}
      <div className="relative flex min-w-0 flex-1 flex-col">
        {/* Header: project meta слева, эксперт справа, toggle артефактов */}
        <div className="flex items-center gap-4 border-b border-border px-5 py-3">
          {/* Project meta */}
          <div className="hidden min-w-0 shrink-0 flex-col border-r border-border pr-4 sm:flex">
            <p className="truncate font-[family-name:var(--font-heading-family)] text-[length:var(--text-14)] font-bold uppercase leading-tight">
              {project.name}
            </p>
            <p className="truncate font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">
              {project.industry} · {STAGE_LABEL[project.stage] ?? project.stage} · {project.experts_completed}/{project.experts_total}
            </p>
          </div>

          {/* Active expert */}
          {activeExpert && (
            <>
              <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full">
                {activeExpert.avatar_url && (
                  <Image
                    src={activeExpert.avatar_url}
                    alt={activeExpert.name}
                    width={36}
                    height={36}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-[family-name:var(--font-heading-family)] text-[length:var(--text-16)] font-bold uppercase leading-tight">
                  {activeExpert.name}
                </p>
                <p className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">
                  {activeExpert.codename} · {activeExpert.role}
                </p>
              </div>
            </>
          )}

          {/* Toggle artifacts panel */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setArtifactsOpen((v) => !v)}
            aria-label={
              artifactsOpen ? "Свернуть панель артефактов" : "Раскрыть панель артефактов"
            }
            className="hidden lg:flex"
          >
            {artifactsOpen ? (
              <PanelRightClose className="h-4 w-4" />
            ) : (
              <PanelRightOpen className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Chat */}
        {activeExpert ? (
          <ExpertChat
            expert={activeExpert}
            initialMessages={activeMessages}
            sessionStatus={activeSession?.status}
          />
        ) : (
          <div className="flex flex-1 items-center justify-center text-muted-foreground">
            Выберите эксперта в левом меню
          </div>
        )}
      </div>

      {/* ── RIGHT: artifacts panel (collapsible) ───────────────────────────── */}
      {artifactsOpen && (
        <aside className="hidden w-80 shrink-0 flex-col border-l border-border bg-background lg:flex">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <p className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">
              Артефакты · {artifacts.length}
            </p>
            {project.score !== null && (
              <Badge
                variant={
                  project.score >= 70
                    ? "yellow-solid"
                    : project.score >= 40
                      ? "yellow-subtle"
                      : "neutral"
                }
              >
                Score {project.score}
              </Badge>
            )}
          </div>
          <div className="flex-1 overflow-y-auto p-3">
            {artifacts.length === 0 ? (
              <EmptyArtifacts />
            ) : (
              <div className="space-y-2">
                {artifacts.map((a) => (
                  <ArtifactCard key={a.id} artifact={a} />
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
// Artifact card + empty
// ─────────────────────────────────────────────────────────────────────────────

function ArtifactCard({ artifact }: { artifact: Artifact }) {
  return (
    <div className="flex flex-col gap-2 rounded-sm border border-border bg-background p-3 transition-colors hover:border-foreground">
      <div className="flex items-start gap-2">
        <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-[family-name:var(--font-heading-family)] text-[length:var(--text-14)] font-bold uppercase leading-tight">
            {artifact.title}
          </p>
          <p className="mt-0.5 font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.04em] text-muted-foreground">
            {artifact.expert_codename}
          </p>
        </div>
      </div>
      <p className="line-clamp-3 text-[length:var(--text-12)] text-muted-foreground">
        {artifact.preview}
      </p>
    </div>
  );
}

function EmptyArtifacts() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10 px-4 text-center">
      <FileText className="h-6 w-6 text-muted-foreground" />
      <p className="text-[length:var(--text-12)] text-muted-foreground">
        Артефакты появятся, когда эксперты завершат этапы и вы валидируете их.
      </p>
    </div>
  );
}
