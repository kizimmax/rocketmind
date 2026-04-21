"use client";

import { Suspense } from "react";
import { MediaView } from "@/components/media/media-view";

export default function MediaPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-rm-gray-3 border-t-foreground" />
        </div>
      }
    >
      <MediaView />
    </Suspense>
  );
}
