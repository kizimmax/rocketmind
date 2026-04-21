export function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "short",
  });
}

import type { ExpertCodename, Project } from "./types";

/**
 * Выбирает эксперта для открытия при клике на проект:
 * — если есть current_expert_codename (активный pipeline), используем его;
 * — для завершённого проекта открываем последнего (R5);
 * — иначе стартуем с R1.
 */
export function pickExpertForProject(project: Project): ExpertCodename {
  if (project.current_expert_codename) return project.current_expert_codename;
  if (project.status === "completed") return "R5";
  return "R1";
}
