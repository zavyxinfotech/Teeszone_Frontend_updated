"use client";

import { Eye, EyeOff, TriangleAlert } from "lucide-react";
import { useState, type ReactNode } from "react";
import type { ApiError } from "@/lib/api";

export const inputCls =
  "w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-sm text-ink placeholder:text-body/60 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20";

export function Field({
  id,
  label,
  children,
  action,
}: {
  id: string;
  label: string;
  children: ReactNode;
  action?: ReactNode; // e.g. the "Forgot password?" link
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <label htmlFor={id} className="block text-sm font-bold text-ink">
          {label}
        </label>
        {action}
      </div>
      {children}
    </div>
  );
}

export function PasswordInput({
  id,
  value,
  onChange,
  placeholder,
  autoComplete,
  minLength,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
  minLength?: number;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <input
        id={id}
        required
        type={visible ? "text" : "password"}
        value={value}
        minLength={minLength}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputCls} pr-11`}
        placeholder={placeholder}
        autoComplete={autoComplete}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-body transition-colors hover:text-ink"
      >
        {visible ? <EyeOff size={17} /> : <Eye size={17} />}
      </button>
    </div>
  );
}

export function ErrorBox({ error }: { error: ApiError | Error | null }) {
  if (!error) return null;
  const description = "description" in error ? error.description : undefined;
  return (
    <div className="flex gap-2.5 rounded-xl border border-accent/30 bg-accent-soft px-4 py-3 text-sm">
      <TriangleAlert size={17} className="mt-0.5 shrink-0 text-accent" />
      <div>
        <p className=" text-ink">{error.message}</p>
        {description && <p className="mt-0.5 text-xs text-body">{description}</p>}
      </div>
    </div>
  );
}

export function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4">
      <span className="h-px flex-1 bg-line" />
      <span className="text-[11px] font-bold uppercase tracking-wider text-body">{label}</span>
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}
