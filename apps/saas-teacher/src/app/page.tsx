"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { TeacherShell } from "@/components/teacher-shell";

export default function RootPage() {
  const { student, isLoading } = useAuth();
  const router = useRouter();
  const [redirected, setRedirected] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    if (!student && !redirected) {
      setRedirected(true);
      router.replace("/login");
    }
  }, [student, isLoading, router, redirected]);

  if (isLoading || !student) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-rm-gray-3 border-t-foreground" />
      </div>
    );
  }

  return <TeacherShell student={student} />;
}
