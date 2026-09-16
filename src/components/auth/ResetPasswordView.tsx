"use client";

import { useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AuthShell } from "@/components/auth/AuthShell";
import { ErrorBox, Field, PasswordInput } from "@/components/auth/fields";
import { authApi } from "@/lib/api";

export function ResetPasswordView() {
  const token = useSearchParams().get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError(new Error("Passwords don't match."));
      return;
    }
    setBusy(true);
    try {
      await authApi.resetPassword(token, password);
      setDone(true);
    } catch (err) {
      setError(err as Error);
    } finally {
      setBusy(false);
    }
  };

  if (!token) {
    return (
      <AuthShell title="Reset Password">
        <div className="space-y-5">
          <p className="text-sm text-body">
            This page needs the link from your password-reset email. The link may be
            incomplete — request a fresh one below.
          </p>
          <Button href="/forgot-password" className="w-full">
            Request a new link
          </Button>
        </div>
      </AuthShell>
    );
  }

  if (done) {
    return (
      <AuthShell title="Password Updated">
        <div className="space-y-5 text-center">
          <CheckCircle2 size={36} className="mx-auto text-accent" />
          <p className="text-sm text-body">
            Your new password is set. Sign in with it now.
          </p>
          <Button href="/login" size="lg" className="w-full">
            Sign In
          </Button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Reset Password" subtitle="Choose a new password for your account.">
      <form onSubmit={handleSubmit} className="space-y-5">
        <Field id="password" label="New password">
          <PasswordInput
            id="password"
            value={password}
            onChange={setPassword}
            placeholder="At least 8 characters"
            autoComplete="new-password"
            minLength={8}
          />
        </Field>
        <Field id="confirm" label="Re-enter new password">
          <PasswordInput
            id="confirm"
            value={confirm}
            onChange={setConfirm}
            placeholder="Same password again"
            autoComplete="new-password"
            minLength={8}
          />
        </Field>

        <ErrorBox error={error} />

        <Button type="submit" size="lg" className="w-full" disabled={busy}>
          {busy ? "Saving…" : "Save New Password"}
        </Button>
      </form>
    </AuthShell>
  );
}
