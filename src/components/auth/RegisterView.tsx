"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { AuthShell } from "@/components/auth/AuthShell";
import { GoogleButton, googleEnabled } from "@/components/auth/GoogleButton";
import { Divider, ErrorBox, Field, inputCls, PasswordInput } from "@/components/auth/fields";
import { safeNext } from "@/components/auth/LoginView";
import { useAuth } from "@/lib/auth";

export function RegisterView() {
  const { register, loginWithGoogle, user, ready } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = safeNext(searchParams.get("next"));

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<Error | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (ready && user) router.replace(next);
  }, [ready, user, router, next]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError(new Error("Passwords don't match."));
      return;
    }
    setBusy(true);
    try {
      await register(name, email, password);
      router.replace(next);
    } catch (err) {
      setError(err as Error);
      setBusy(false);
    }
  };

  const handleGoogle = useCallback(
    async (credential: string) => {
      setError(null);
      try {
        await loginWithGoogle(credential);
        router.replace(next);
      } catch (err) {
        setError(err as Error);
      }
    },
    [loginWithGoogle, router, next],
  );

  return (
    <AuthShell
      title="Create Account"
      subtitle="Your email is your username — sign in later with it or with Google."
    >
      <div className="space-y-5">
        {googleEnabled && (
          <>
            <GoogleButton onCredential={handleGoogle} />
            <Divider label="or register with email" />
          </>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Field id="name" label="Your name">
            <input
              id="name"
              required
              minLength={2}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputCls}
              placeholder="Full name"
              autoComplete="name"
            />
          </Field>
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
          <Field id="password" label="Password">
            <PasswordInput
              id="password"
              value={password}
              onChange={setPassword}
              placeholder="At least 8 characters"
              autoComplete="new-password"
              minLength={8}
            />
          </Field>
          <Field id="confirm" label="Re-enter password">
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
            {busy ? "Creating account…" : "Create Account"}
          </Button>
        </form>

        <p className="text-center text-sm text-body">
          Already have an account?{" "}
          <Link href="/login" className=" text-accent hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
