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
      {/* V */}
      <path
        d="M9.5 13 L14.5 27 L19.5 13"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* K: stem + arms meeting at mid-height */}
      <path
        d="M22.5 13 L22.5 27 M22.5 20 L30 13 M22.5 20 L30 27"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
