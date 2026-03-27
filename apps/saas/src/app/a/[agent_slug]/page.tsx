import { mockAgents } from "@/lib/mock-data";
import BootstrapClient from "./bootstrap-client";

export function generateStaticParams() {
  return mockAgents.map((a) => ({ agent_slug: a.slug }));
}

export default async function BootstrapPage({
  params,
}: {
  params: Promise<{ agent_slug: string }>;
}) {
  const { agent_slug } = await params;
  return <BootstrapClient agentSlug={agent_slug} />;
}
