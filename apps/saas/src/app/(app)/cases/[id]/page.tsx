import { mockCases } from "@/lib/mock-data";
import CaseClient from "./case-client";

export function generateStaticParams() {
  return mockCases.map((c) => ({ id: c.id }));
}

export default async function CasePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CaseClient id={id} />;
}
