"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Download,
  Eye,
  FileText,
  PanelRightClose,
  PanelRightOpen,
} from "lucide-react";
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Note,
} from "@rocketmind/ui";
import { toast } from "sonner";
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
  const expertParam = searchParams?.get("expert") as ExpertCodename | null;
  const activeExpertCodename =
    expertParam ?? project?.current_expert_codename ?? "R1";

  // Синхронизируем URL, чтобы sidebar корректно подсвечивал эксперта
  useEffect(() => {
    if (!expertParam && project) {
      router.replace(`/projects/${id}?expert=${activeExpertCodename}`, {
        scroll: false,
      });
    }
  }, [expertParam, project, id, activeExpertCodename, router]);

  const activeExpert = useMemo(
    () => getExpert(activeExpertCodename),
    [activeExpertCodename, getExpert]
  );

  const activeSession = useMemo(
    () => sessions.find((s) => s.expert_codename === activeExpertCodename),
    [sessions, activeExpertCodename]
  );
  const activeMessages = useExpertMessages(activeSession?.id);

  const [activeArtifactId, setActiveArtifactId] = useState<string | null>(null);
  const [previewArtifact, setPreviewArtifact] = useState<Artifact | null>(null);

  const handleDownload = useCallback((artifact: Artifact) => {
    const body = `${artifact.title}\n\nЭксперт: ${artifact.expert_codename}\nТип: ${artifact.type}\n\n${artifact.preview}\n`;
    const blob = new Blob([body], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${artifact.title}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Скачан «${artifact.title}»`);
  }, []);

  const handleSelectArtifact = useCallback(
    (id: string) => {
      setActiveArtifactId(id);
      if (!artifactsOpen) setArtifactsOpen(true);
    },
    [artifactsOpen]
  );

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
        {/* Header: название проекта слева, роль эксперта + аватарка + toggle справа */}
        <div className="flex h-12 shrink-0 items-center gap-4 border-b border-border px-4">
          <p className="min-w-0 flex-1 truncate font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">
            {project.name}
          </p>

          {activeExpert && (
            <div className="flex min-w-0 items-center gap-2">
              <p className="truncate font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-muted-foreground">
                {activeExpert.role}
              </p>
              <div className="h-6 w-6 shrink-0 overflow-hidden rounded-full">
                {activeExpert.avatar_url && (
                  <Image
                    src={activeExpert.avatar_url}
                    alt={activeExpert.role}
                    width={24}
                    height={24}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
            </div>
          )}

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
            artifacts={artifacts}
            activeArtifactId={activeArtifactId}
            onArtifactSelect={handleSelectArtifact}
            onArtifactPreview={setPreviewArtifact}
            onArtifactDownload={handleDownload}
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
          <div className="flex h-12 shrink-0 items-center justify-between border-b border-border px-4">
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
                  <ArtifactCard
                    key={a.id}
                    artifact={a}
                    isActive={activeArtifactId === a.id}
                    onSelect={() => setActiveArtifactId(a.id)}
                    onPreview={() => setPreviewArtifact(a)}
                    onDownload={() => handleDownload(a)}
                  />
                ))}
              </div>
            )}
          </div>
        </aside>
      )}

      <ArtifactPreviewDialog
        artifact={previewArtifact}
        onOpenChange={(open) => !open && setPreviewArtifact(null)}
        onDownload={handleDownload}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Artifact card + empty
// ─────────────────────────────────────────────────────────────────────────────

function ArtifactCard({
  artifact,
  isActive,
  onSelect,
  onPreview,
  onDownload,
}: {
  artifact: Artifact;
  isActive: boolean;
  onSelect: () => void;
  onPreview: () => void;
  onDownload: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (isActive && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [isActive]);

  return (
    <div
      ref={ref}
      data-artifact-id={artifact.id}
      onClick={onSelect}
      className={`flex cursor-pointer flex-col gap-2 rounded-sm border bg-background p-3 transition-colors ${
        isActive
          ? "border-[var(--rm-yellow-500)]"
          : "border-border hover:border-foreground"
      }`}
    >
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
        <div className="flex shrink-0 gap-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPreview();
            }}
            title="Пред просмотр"
            className="flex h-7 w-7 items-center justify-center rounded-sm text-muted-foreground hover:bg-rm-gray-1 hover:text-foreground transition-colors"
          >
            <Eye className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDownload();
            }}
            title="Скачать"
            className="flex h-7 w-7 items-center justify-center rounded-sm text-muted-foreground hover:bg-rm-gray-1 hover:text-foreground transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
      <p className="line-clamp-3 text-[length:var(--text-12)] text-muted-foreground">
        {artifact.preview}
      </p>
    </div>
  );
}

function ArtifactPreviewDialog({
  artifact,
  onOpenChange,
  onDownload,
}: {
  artifact: Artifact | null;
  onOpenChange: (open: boolean) => void;
  onDownload: (a: Artifact) => void;
}) {
  return (
    <Dialog open={!!artifact} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        {artifact && (
          <>
            <DialogHeader>
              <DialogTitle className="font-[family-name:var(--font-heading-family)] uppercase">
                {artifact.title}
              </DialogTitle>
              <DialogDescription className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em]">
                {artifact.expert_codename} · {artifact.type}
              </DialogDescription>
            </DialogHeader>
            <p className="whitespace-pre-wrap text-[length:var(--text-14)] text-foreground">
              {artifact.preview}
            </p>
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={() => onDownload(artifact)}>
                <Download className="mr-1.5 h-3.5 w-3.5" />
                Скачать
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
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
