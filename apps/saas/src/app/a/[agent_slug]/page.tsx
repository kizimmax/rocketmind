export default async function AgentPage({
  params,
}: {
  params: Promise<{ agent_slug: string }>;
}) {
  const { agent_slug } = await params;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-2">
        <h1 className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-32)] font-bold uppercase">
          Агент: {agent_slug}
        </h1>
        <p className="text-[length:var(--text-14)] text-muted-foreground">
          Чат-интерфейс будет здесь
        </p>
      </div>
    </div>
  );
}
