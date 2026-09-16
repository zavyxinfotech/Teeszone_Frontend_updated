"use client";

import type { ReactNode } from "react";

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="bg-surface py-10 sm:py-16">
      <div className="mx-auto w-full max-w-md px-4">
        <div className="border border-line bg-white px-6 py-8 sm:px-8">
          <h1 className="font-heading text-xl font-bold uppercase tracking-wide text-ink">
            {title}
          </h1>
          {subtitle && <p className="mt-1.5 text-sm text-body">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
