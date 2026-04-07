import Link from "next/link";

const routes = [
  { href: "/r-plan", label: "R-Plan — План работ", description: "Мульти-трек, Firebase Realtime DB, drag & drop" },
];

export default function InternalIndexPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-6 p-8">
        <h1 className="font-[family-name:var(--font-heading-family)] text-[length:var(--text-32)] font-bold uppercase tracking-tight text-foreground">
          Internal
        </h1>
        <div className="space-y-3">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className="block rounded-sm border border-border bg-card p-4 transition-colors hover:bg-rm-gray-1"
            >
              <p className="text-[length:var(--text-16)] font-medium text-foreground">
                {route.label}
              </p>
              <p className="mt-1 text-[length:var(--text-14)] text-muted-foreground">
                {route.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
