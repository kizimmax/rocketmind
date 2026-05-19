"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { student, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && student) {
      router.replace("/");
    }
  }, [student, isLoading, router]);

  if (isLoading) {
    return (
      <div className="dark flex min-h-dvh items-center justify-center bg-background">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-rm-gray-3 border-t-foreground" />
      </div>
    );
  }

  if (student) return null;

  return (
    <div className="dark flex min-h-dvh flex-col bg-background">
      {children}
    </div>
  );
}
