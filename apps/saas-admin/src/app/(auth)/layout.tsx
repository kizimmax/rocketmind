"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthed, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthed) {
      router.replace("/pages");
    }
  }, [isAuthed, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-rm-gray-3 border-t-foreground" />
      </div>
    );
  }

  if (isAuthed) return null;

  return (
    <div className="flex min-h-dvh flex-col bg-background">{children}</div>
  );
}
