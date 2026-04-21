import * as React from "react";

export function TelegramIcon({ className, ...props }: React.SVGProps<SVGSVGElement>) {
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
        d="M29.5 12.5 L10.5 20 L16.5 22.5 L19 28.5 L22.5 24.5 L27.5 28 L29.5 12.5 Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.5 22.5 L26 15.5 M19 28.5 L22.5 24.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
