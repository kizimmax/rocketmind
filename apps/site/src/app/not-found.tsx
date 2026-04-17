"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { WaveAnimation } from "@rocketmind/ui";

const linkClass =
  "font-mono text-[12px] uppercase leading-[1.32] tracking-[0.08em] text-white/80 underline underline-offset-[6px] transition-colors hover:text-white md:text-[14px]";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="is-404-page relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-black">
      <div className="absolute inset-0">
        <WaveAnimation
          waveSpeed={2}
          waveIntensity={10}
          particleColor="#ffffff"
          pointSize={3}
          gridDistance={4}
          className="h-full w-full"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8 text-center">
        <h1 className="h1 text-white" style={{ fontSize: "clamp(96px, 18vw, 240px)" }}>
          404
        </h1>
        <div className="flex items-center gap-8">
          <button type="button" onClick={() => router.back()} className={linkClass}>
            ← Назад
          </button>
          <Link href="/" className={linkClass}>
            На главную
          </Link>
        </div>
      </div>
    </div>
  );
}
