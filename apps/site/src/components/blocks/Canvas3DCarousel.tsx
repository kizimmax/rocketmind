"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

const IMAGES = [
  "/images/platform-block/canvas-7.png",
  "/images/platform-block/canvas-6.png",
  "/images/platform-block/canvas-5.png",
  "/images/platform-block/canvas-4.png",
  "/images/platform-block/canvas-3.png",
  "/images/platform-block/canvas-2.png",
  "/images/platform-block/canvas-1.png",
];

const POSITIONS = [
  {
    left: "0px",
    top: "144px",
    zIndex: 70,
    opacity: "opacity-100",
    overlay: null,
  },
  {
    left: "104px",
    top: "130px",
    zIndex: 60,
    opacity: "opacity-100",
    overlay: <div className="absolute bg-[rgba(10,10,10,0.12)] inset-0 rounded-[8px] transition-all duration-1000" />,
  },
  {
    left: "192px",
    top: "106px",
    zIndex: 50,
    opacity: "opacity-100",
    overlay: <div className="absolute bg-[rgba(10,10,10,0.2)] inset-0 rounded-[8px] transition-all duration-1000" />,
  },
  {
    left: "272px",
    top: "84px",
    zIndex: 40,
    opacity: "opacity-100",
    overlay: <div className="absolute bg-[rgba(10,10,10,0.4)] inset-0 rounded-[8px] transition-all duration-1000" />,
  },
  {
    left: "341px",
    top: "56px",
    zIndex: 30,
    opacity: "opacity-100",
    overlay: (
      <div
        className="absolute inset-0 rounded-[8px] transition-all duration-1000"
        style={{
          backgroundImage:
            "linear-gradient(-7.21093deg, rgba(10, 10, 10, 0.2) 20.765%, rgba(10, 10, 10, 0) 53.011%), linear-gradient(90deg, rgba(10, 10, 10, 0.56) 0%, rgba(10, 10, 10, 0.56) 100%)",
        }}
      />
    ),
  },
  {
    left: "397px",
    top: "28px",
    zIndex: 20,
    opacity: "opacity-100",
    overlay: (
      <div
        className="absolute inset-0 rounded-[8px] transition-all duration-1000"
        style={{
          backgroundImage:
            "linear-gradient(-7.21093deg, rgba(10, 10, 10, 0.32) 23.735%, rgba(10, 10, 10, 0.06) 60.232%), linear-gradient(90deg, rgba(10, 10, 10, 0.64) 0%, rgba(10, 10, 10, 0.64) 100%)",
        }}
      />
    ),
  },
  {
    left: "452px",
    top: "0px",
    zIndex: 10,
    opacity: "opacity-56",
    overlay: (
      <div
        className="absolute inset-0 rounded-[8px] transition-all duration-1000"
        style={{
          backgroundImage:
            "linear-gradient(-12.3509deg, rgba(10, 10, 10, 0.68) 13.371%, rgba(10, 10, 10, 0) 42.529%), linear-gradient(90deg, rgba(10, 10, 10, 0.6) 0%, rgba(10, 10, 10, 0.6) 100%)",
        }}
      />
    ),
  },
];

export function Canvas3DCarousel() {
  const [offset, setOffset] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const interval = setInterval(() => {
      setOffset((prev) => prev + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="relative h-[623px] w-[768px] overflow-hidden max-w-full">
        {IMAGES.map((src, index) => {
          // Calculate the current position for this image
          const posIndex = (index - offset) % IMAGES.length;
          // Wrap negative mod correctly to positive
          const normalizedPosIndex = posIndex < 0 ? posIndex + IMAGES.length : posIndex;
          const pos = POSITIONS[normalizedPosIndex];

          const isWrapping = isMounted && offset > 0 && normalizedPosIndex === 6;

          return (
            <div
              key={src}
              className={`absolute flex h-[469.149px] w-[315.747px] items-center justify-center ${
                isWrapping ? "animate-carousel-wrap" : "transition-all duration-1000 ease-in-out"
              }`}
              style={{
                left: isWrapping ? undefined : pos.left,
                top: isWrapping ? undefined : pos.top,
                zIndex: isWrapping ? undefined : pos.zIndex,
              }}
            >
              <div className="flex-none rotate-[11.31deg] scale-y-98 skew-x-[11.31deg] transition-all duration-1000">
                <div
                  className={`relative h-[406px] w-[322px] rounded-[8px] transition-opacity duration-1000 ${
                    isWrapping ? "" : pos.opacity
                  }`}
                >
                  <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[8px]">
                    <Image
                      alt=""
                      src={src}
                      fill
                      className="absolute max-w-none object-cover rounded-[8px]"
                    />
                    {pos.overlay}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes carouselWrap {
          0% {
            left: 0px; top: 144px;
            transform: translateX(0);
            opacity: 1;
            z-index: 70;
          }
          40% {
            left: 0px; top: 144px;
            transform: translateX(-150px);
            opacity: 0;
            z-index: 70;
          }
          41% {
            left: 500px; top: -30px;
            transform: translateX(0);
            opacity: 0;
            z-index: 10;
          }
          100% {
            left: 452px; top: 0px;
            transform: translateX(0);
            opacity: 1;
            z-index: 10;
          }
        }
        .animate-carousel-wrap {
          animation: carouselWrap 1.2s ease-in-out forwards;
        }
      `}} />
    </>
  );
}
