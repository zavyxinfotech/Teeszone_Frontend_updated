"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { MailCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AuthShell } from "@/components/auth/AuthShell";
import { ErrorBox, Field, inputCls } from "@/components/auth/fields";
import { authApi } from "@/lib/api";

export function ForgotPasswordView() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await authApi.forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err as Error);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell
      title="Password Assistance"
      subtitle="Enter your account email and we'll send a link to set a new password. Works for Google accounts too."
    >
      {sent ? (
        <div className="space-y-5 text-center">
          <MailCheck size={36} className="mx-auto text-accent" />
          <p className="text-sm text-body">
            If an account exists for <span className="font-semibold text-ink">{email}</span>,
            a reset link is on its way. It stays valid for 30 minutes — check spam too.
          </p>
          <Button href="/login" variant="secondary" className="w-full">
            Back to sign in
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <Field id="email" label="Email">
            <input
              id="email"
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputCls}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </Field>

          <ErrorBox error={error} />

          <Button type="submit" size="lg" className="w-full" disabled={busy}>
            {busy ? "Sending…" : "Send Reset Link"}
          </Button>

          <p className="text-center text-sm text-body">
            Remembered it?{" "}
            <Link href="/login" className="font-semibold text-accent hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      )}
    </AuthShell>
  );
}
