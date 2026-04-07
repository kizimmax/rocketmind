"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

const IMAGES = [
  `${BASE_PATH}/images/platform-block/canvas-7.png`,
  `${BASE_PATH}/images/platform-block/canvas-6.png`,
  `${BASE_PATH}/images/platform-block/canvas-5.png`,
  `${BASE_PATH}/images/platform-block/canvas-4.png`,
  `${BASE_PATH}/images/platform-block/canvas-3.png`,
  `${BASE_PATH}/images/platform-block/canvas-2.png`,
  `${BASE_PATH}/images/platform-block/canvas-1.png`,
];

/* Figma overlay opacities (node 202:2017):
   pos 0 (front, x:0   y:144) — no overlay
   pos 1 (x:104  y:130) — rgba(10,10,10, 0.12)
   pos 2 (x:192  y:106) — rgba(10,10,10, 0.20)
   pos 3 (x:272  y:84)  — rgba(10,10,10, 0.40)
   pos 4 (x:341  y:56)  — rgba(10,10,10, 0.56)
   pos 5 (x:397  y:28)  — rgba(10,10,10, 0.70)
   pos 6 (x:452  y:0)   — rgba(10,10,10, 0.90) */

const POSITIONS = [
  { left: 0, top: 144, zIndex: 70, darkness: 0 },
  { left: 104, top: 130, zIndex: 60, darkness: 0.12 },
  { left: 192, top: 106, zIndex: 50, darkness: 0.20 },
  { left: 272, top: 84, zIndex: 40, darkness: 0.40 },
  { left: 341, top: 56, zIndex: 30, darkness: 0.56 },
  { left: 397, top: 28, zIndex: 20, darkness: 0.70 },
  { left: 452, top: 0, zIndex: 10, darkness: 0.90 },
];

const TRANSITION = "all 1.4s cubic-bezier(0.4, 0, 0.2, 1)";

export function Canvas3DCarousel() {
  const [offset, setOffset] = useState(0);
  const [exitingIndex, setExitingIndex] = useState<number | null>(null);
  const [reenteringIndex, setReenteringIndex] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setOffset((prev) => {
        const next = prev + 1;
        for (let i = 0; i < IMAGES.length; i++) {
          const raw = (i - next) % IMAGES.length;
          const norm = raw < 0 ? raw + IMAGES.length : raw;
          if (norm === IMAGES.length - 1) {
            setExitingIndex(i);
            break;
          }
        }
        return next;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  /* After exit animation: jump to back instantly (no transition) */
  useEffect(() => {
    if (exitingIndex === null) return;
    const t = setTimeout(() => {
      setReenteringIndex(exitingIndex);
      setExitingIndex(null);
    }, 800);
    return () => clearTimeout(t);
  }, [exitingIndex]);

  /* After 2 frames in reentering state, enable transitions again */
  useEffect(() => {
    if (reenteringIndex === null) return;
    let id = requestAnimationFrame(() => {
      id = requestAnimationFrame(() => {
        setReenteringIndex(null);
      });
    });
    return () => cancelAnimationFrame(id);
  }, [reenteringIndex]);

  return (
    <div className="relative h-[623px] w-[768px] max-w-full overflow-hidden">
      {IMAGES.map((src, index) => {
        const raw = (index - offset) % IMAGES.length;
        const posIndex = raw < 0 ? raw + IMAGES.length : raw;
        const pos = POSITIONS[posIndex];

        const isExiting = index === exitingIndex;
        const isReentering = index === reenteringIndex;

        /* ── Three states ──
           1. Exiting: fade down from front position
           2. Reentering: instant jump to back (no transition, invisible)
           3. Normal: smoothly transition between positions */
        const style: React.CSSProperties = isExiting
          ? {
              left: 0,
              top: 144,
              zIndex: 80,
              transform: "translateY(120px)",
              opacity: 0,
              transition: "all 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
            }
          : isReentering
            ? {
                left: pos.left,
                top: pos.top,
                zIndex: pos.zIndex,
                transform: "translateY(0)",
                opacity: 0,
                transition: "none",
              }
            : {
                left: pos.left,
                top: pos.top,
                zIndex: pos.zIndex,
                transform: "translateY(0)",
                opacity: 1,
                transition: TRANSITION,
              };

        return (
          <div
            key={src}
            className="absolute flex h-[469.149px] w-[315.747px] items-center justify-center"
            style={style}
          >
            <div
              className="flex-none rotate-[11.31deg] scale-y-98 skew-x-[11.31deg]"
              style={{ transition: TRANSITION }}
            >
              <div className="relative h-[406px] w-[322px] rounded-[8px]">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-[8px]"
                >
                  <Image
                    alt=""
                    src={src}
                    fill
                    className="absolute max-w-none rounded-[8px] object-cover"
                  />
                  {/* Darkening overlay — smoothly transitions between positions */}
                  <div
                    className="absolute inset-0 rounded-[8px]"
                    style={{
                      backgroundColor: `rgba(10, 10, 10, ${isExiting ? 0 : pos.darkness})`,
                      transition: isReentering ? "none" : `background-color 1.4s cubic-bezier(0.4, 0, 0.2, 1)`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
