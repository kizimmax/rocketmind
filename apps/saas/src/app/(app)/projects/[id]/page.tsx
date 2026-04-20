import { mockProjects } from "@/lib/mock-data";
import ProjectClient from "./project-client";

export function generateStaticParams() {
  return mockProjects.map((p) => ({ id: p.id }));
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProjectClient id={id} />;
}
