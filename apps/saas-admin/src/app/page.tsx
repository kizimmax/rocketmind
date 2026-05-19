"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RootPage() {
  const { isAuthed, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      router.replace(isAuthed ? "/pages" : "/login");
    }
  }, [isAuthed, isLoading, router]);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-rm-gray-3 border-t-foreground" />
    </div>
  );
}
