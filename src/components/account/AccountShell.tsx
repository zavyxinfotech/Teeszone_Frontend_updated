"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { useRequireAuth } from "@/lib/auth";
import type { AuthUser } from "@/lib/types";

export function AccountShell({
  title,
  children,
}: {
  title?: string; // subpage name; omitted on the dashboard itself
  children: (ctx: { user: AuthUser; token: string }) => ReactNode;
}) {
  const { user, token, ready } = useRequireAuth();

  if (!ready || !user || !token) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-24 text-center text-sm text-body">
        Loading your account…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <nav className="flex items-center gap-1 text-xs text-body" aria-label="Breadcrumb">
        <Link href="/account" className="transition-colors hover:text-accent">
          Your Account
        </Link>
        {title && (
          <>
            <ChevronRight size={13} />
            <span className="font-semibold text-ink">{title}</span>
          </>
        )}
      </nav>
      <h1 className="mt-2 font-heading text-2xl font-bold uppercase tracking-wide text-ink">
        {title ?? "Your Account"}
      </h1>
      <div className="mt-8">{children({ user, token })}</div>
    </div>
  );
}
