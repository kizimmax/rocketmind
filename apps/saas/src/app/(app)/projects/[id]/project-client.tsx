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
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
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
import { pickExpertForProject } from "@/lib/utils";

export default function ProjectClient({ id }: { id: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const project = useProject(id);
  const { getExpert } = useExperts();
  const { artifacts } = useArtifacts(id);
  const { sessions } = useExpertSessions(id);
  const [artifactsOpen, setArtifactsOpen] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);

  // При первом открытии проекта — снимаем pulse-флаг в sidebar
  useEffect(() => {
    markProjectAsSeen(id);
  }, [id]);

  // Активный эксперт: из URL ?expert=…, иначе pickExpertForProject (current/R5/R1)
  const expertParam = searchParams?.get("expert") as ExpertCodename | null;
  const activeExpertCodename: ExpertCodename =
    expertParam ?? (project ? pickExpertForProject(project) : "R1");

  // Синхронизируем URL, чтобы sidebar корректно подсвечивал эксперта
  useEffect(() => {
    if (!expertParam && project) {
      router.replace(`/projects/${id}?expert=${encodeURIComponent(activeExpertCodename)}`, {
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
  const [inputZoneHeight, setInputZoneHeight] = useState(0);

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

  const handleHoverArtifact = useCallback((id: string | null) => {
    setActiveArtifactId(id);
  }, []);

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
        {/* Header: название проекта слева, роль эксперта + аватарка + toggle справа
            На мобильных данные отображаются в MobileHeader — тут скрываем. */}
        <div className="hidden h-12 shrink-0 items-center gap-4 border-b border-border px-4 lg:flex">
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
            onArtifactHover={handleHoverArtifact}
            onArtifactPreview={setPreviewArtifact}
            onArtifactDownload={handleDownload}
            onInputZoneHeight={setInputZoneHeight}
          />
        ) : (
          <div className="flex flex-1 items-center justify-center text-muted-foreground">
            Выберите эксперта в левом меню
          </div>
        )}

        {/* Mobile FAB → bottom-sheet с артефактами. Поднимается над input-зоной. */}
        {artifacts.length > 0 && (
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            aria-label={`Артефакты: ${artifacts.length}`}
            style={{ bottom: `${inputZoneHeight + 12}px` }}
            className="absolute right-3 z-20 flex items-center gap-1.5 rounded-sm border border-border bg-background/90 px-3 py-2 text-muted-foreground backdrop-blur-sm transition-[bottom] duration-200 hover:bg-rm-gray-1 hover:text-foreground lg:hidden"
          >
            <FileText className="h-4 w-4" />
            <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em]">
              Артефакты · {artifacts.length}
            </span>
          </button>
        )}
      </div>

      {/* ── RIGHT: artifacts panel (collapsible) ───────────────────────────── */}
      {artifactsOpen && (
        <aside className="hidden w-80 shrink-0 flex-col border-l border-border bg-background lg:flex">
          {/* Шапка: snizu — жёлтый прогресс-бар 4px, ширина = score% */}
          <div className="relative flex h-12 shrink-0 items-center justify-between border-b border-border px-4">
            <p className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-foreground">
              Артефакты · {artifacts.length}
            </p>
            <p className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-[var(--rm-yellow-100)]">
              {project.score ?? 0}%
            </p>
            <div
              aria-hidden
              className="absolute bottom-0 left-0 h-1 bg-[var(--rm-yellow-100)] transition-[width] duration-500 ease-out"
              style={{ width: `${project.score ?? 0}%` }}
            />
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
                    onHover={handleHoverArtifact}
                    onPreview={() => setPreviewArtifact(a)}
                    onDownload={() => handleDownload(a)}
                  />
                ))}
              </div>
            )}
          </div>
        </aside>
      )}

      {/* Mobile bottom-sheet — выезжает снизу, закрывается свайпом за handle */}
      <MobileArtifactsSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        artifacts={artifacts}
        activeArtifactId={activeArtifactId}
        onHover={handleHoverArtifact}
        onPreview={setPreviewArtifact}
        onDownload={handleDownload}
      />

      <ArtifactPreviewDialog
        artifact={previewArtifact}
        onOpenChange={(open) => !open && setPreviewArtifact(null)}
        onDownload={handleDownload}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Mobile artifacts sheet — выезжает снизу, закрывается свайпом за drag-handle
// ─────────────────────────────────────────────────────────────────────────────

function MobileArtifactsSheet({
  open,
  onOpenChange,
  artifacts,
  activeArtifactId,
  onHover,
  onPreview,
  onDownload,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  artifacts: Artifact[];
  activeArtifactId: string | null;
  onHover: (id: string | null) => void;
  onPreview: (a: Artifact) => void;
  onDownload: (a: Artifact) => void;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ startY: 0, dy: 0, active: false, pointerId: 0 });

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    drag.current = {
      startY: e.clientY,
      dy: 0,
      active: true,
      pointerId: e.pointerId,
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    if (contentRef.current) contentRef.current.style.transition = "none";
    if (overlayRef.current) overlayRef.current.style.transition = "none";
  }

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!drag.current.active) return;
    const dy = Math.max(0, e.clientY - drag.current.startY);
    drag.current.dy = dy;
    const el = contentRef.current;
    if (el) {
      el.style.transform = `translateY(${dy}px)`;
      // Затухание подложки пропорционально прогрессу свайпа
      const progress = Math.min(1, dy / Math.max(1, el.offsetHeight));
      if (overlayRef.current) {
        overlayRef.current.style.opacity = String(1 - progress);
      }
    }
  }

  function onPointerEnd(e: React.PointerEvent<HTMLDivElement>) {
    if (!drag.current.active) return;
    drag.current.active = false;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(drag.current.pointerId);
    } catch {}
    const { dy } = drag.current;
    const el = contentRef.current;
    if (!el) return;

    if (dy > 120) {
      // Отключаем встроенные data-state=closed keyframes — слайд и fade
      // ведём через transform/opacity, иначе Radix проиграет вторую анимацию.
      el.classList.add("rm-sheet-manual-close");
      el.style.transition = "transform 220ms cubic-bezier(0.32, 0.72, 0, 1)";
      el.style.transform = "translateY(100%)";
      if (overlayRef.current) {
        overlayRef.current.classList.add("rm-sheet-manual-close");
        overlayRef.current.style.transition =
          "opacity 220ms cubic-bezier(0.32, 0.72, 0, 1)";
        overlayRef.current.style.opacity = "0";
      }
      const done = () => {
        el.removeEventListener("transitionend", done);
        onOpenChange(false);
      };
      el.addEventListener("transitionend", done);
    } else {
      el.style.transition = "transform 200ms ease-out";
      el.style.transform = "";
      if (overlayRef.current) {
        overlayRef.current.style.transition = "opacity 200ms ease-out";
        overlayRef.current.style.opacity = "";
      }
    }
  }

  // Перед каждым открытием сбрасываем inline-стили и класс manual-close,
  // чтобы следующая открытие-анимация сыграла чисто.
  useEffect(() => {
    if (!open) return;
    const el = contentRef.current;
    if (el) {
      el.classList.remove("rm-sheet-manual-close");
      el.style.transition = "";
      el.style.transform = "";
    }
    const ov = overlayRef.current;
    if (ov) {
      ov.classList.remove("rm-sheet-manual-close");
      ov.style.transition = "";
      ov.style.opacity = "";
    }
  }, [open]);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          ref={overlayRef}
          className="rm-sheet-overlay fixed inset-0 z-50 bg-[var(--rm-gray-alpha-600)] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 lg:hidden"
        />
        <DialogPrimitive.Content
          ref={contentRef}
          className="rm-sheet fixed inset-x-0 bottom-0 z-50 flex h-[85vh] flex-col rounded-t-lg border-t border-border bg-card lg:hidden"
        >
          {/* Drag handle — потянуть вниз чтобы закрыть */}
          <div
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerEnd}
            onPointerCancel={onPointerEnd}
            className="flex h-7 shrink-0 cursor-grab items-center justify-center touch-none"
          >
            <span className="h-1 w-10 rounded-full bg-foreground/50" />
          </div>
          <div className="flex h-11 shrink-0 items-center border-b border-border px-4">
            <DialogPrimitive.Title className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] font-normal uppercase tracking-[0.08em] text-muted-foreground">
              Артефакты · {artifacts.length}
            </DialogPrimitive.Title>
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
                    onHover={onHover}
                    onPreview={() => onPreview(a)}
                    onDownload={() => onDownload(a)}
                  />
                ))}
              </div>
            )}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Artifact card + empty
// ─────────────────────────────────────────────────────────────────────────────

function ArtifactCard({
  artifact,
  isActive,
  onHover,
  onPreview,
  onDownload,
}: {
  artifact: Artifact;
  isActive: boolean;
  onHover: (id: string | null) => void;
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
      onClick={onPreview}
      onMouseEnter={() => onHover(artifact.id)}
      onMouseLeave={() => onHover(null)}
      className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-sm border bg-background transition-colors ${
        isActive
          ? "border-[var(--rm-yellow-100)]"
          : "border-border hover:border-[var(--rm-yellow-100)]"
      }`}
    >
      {/* Hover-подсказка «Посмотреть» в правом верхнем углу */}
      <span
        aria-hidden
        className="pointer-events-none absolute right-2 top-2 inline-flex items-center gap-1 rounded-sm bg-[var(--rm-yellow-100)] px-2 py-1 font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.08em] text-[var(--rm-yellow-fg)] opacity-0 transition-opacity group-hover:opacity-100"
      >
        <Eye className="h-3.5 w-3.5" />
        Посмотреть
      </span>
      {/* Header: иконка + название + кодовое имя эксперта */}
      <div className="flex items-center gap-2 px-3 pt-3">
        <FileText className="h-5 w-5 shrink-0 text-foreground" />
        <p className="min-w-0 flex-1 truncate font-[family-name:var(--font-mono-family)] text-[length:var(--text-14)] font-medium uppercase leading-[1.16] tracking-[0.02em] text-foreground">
          {artifact.title}
        </p>
        <span className="shrink-0 font-[family-name:var(--font-mono-family)] text-[length:var(--text-14)] font-medium uppercase leading-[1.16] tracking-[0.02em] text-muted-foreground">
          {artifact.expert_codename}
        </span>
      </div>
      {/* Body: превью (copy 12) + кнопка скачивания справа */}
      <div className="flex items-stretch pt-3">
        <p
          className="min-w-0 flex-1 overflow-hidden px-3 pb-4 text-[length:var(--text-12)] leading-[1.36] tracking-[0.02em] text-muted-foreground"
          style={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 3,
          }}
        >
          {artifact.preview}
        </p>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDownload();
          }}
          title="Скачать"
          aria-label="Скачать артефакт"
          className="flex w-10 shrink-0 items-center justify-center self-stretch rounded-tl-[4px] rounded-br-[4px] bg-rm-gray-1 text-muted-foreground transition-colors hover:text-foreground"
        >
          <Download className="h-5 w-5" />
        </button>
      </div>
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
