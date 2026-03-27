"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

/**
 * Floating back button — mobile only (hidden on lg+).
 * Fixed overlay: bottom-left, large tap target.
 */
export function MobileBackButton({ href }: { href?: string } = {}) {
  const router = useRouter();

  const handleClick = () => {
    if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Назад"
      className="fixed bottom-6 left-5 z-50 flex lg:hidden h-14 w-14 items-center justify-center rounded-full bg-rm-gray-2 border border-border text-foreground shadow-lg transition-colors active:bg-rm-gray-3"
    >
      <ArrowLeft className="h-6 w-6" />
    </button>
  );
}
