import type { ReactNode } from "react";

export function Badge({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-3.5 py-1.5 text-xs  text-accent ${className}`}
    >
      {children}
    </span>
  );
}
