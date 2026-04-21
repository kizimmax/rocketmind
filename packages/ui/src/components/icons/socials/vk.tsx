import * as React from "react";

export function VkIcon({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <rect x="0.75" y="0.75" width="38.5" height="38.5" rx="4" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M10 14 L14.5 26 L17 26 L21.5 14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M24 14 L24 26 M24 20.5 L30 14 M24 20.5 L30 26"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
