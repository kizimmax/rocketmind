export default async function CaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-2">
        <h1 className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-32)] font-bold uppercase">
          Кейс #{id}
        </h1>
        <p className="text-[length:var(--text-14)] text-muted-foreground">
          Детали кейса
        </p>
      </div>
    </div>
  );
}
