"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { AuthShell } from "@/components/auth/AuthShell";
import { GoogleButton, googleEnabled } from "@/components/auth/GoogleButton";
import { Divider, ErrorBox, Field, inputCls, PasswordInput } from "@/components/auth/fields";
import { useAuth } from "@/lib/auth";

// only allow same-site ?next= paths
export function safeNext(raw: string | null, fallback = "/account"): string {
  return raw && raw.startsWith("/") && !raw.startsWith("//") ? raw : fallback;
}

export function LoginView() {
  const { login, loginWithGoogle, user, ready } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = safeNext(searchParams.get("next"));

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<Error | null>(null);
  const [busy, setBusy] = useState(false);

  // already signed in, skip the form
  useEffect(() => {
    if (ready && user) router.replace(next);
  }, [ready, user, router, next]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await login(email, password);
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
    <AuthShell title="Sign In" subtitle="Use your email and password, or continue with Google.">
      <div className="space-y-5">
        {googleEnabled && (
          <>
            <GoogleButton onCredential={handleGoogle} />
            <Divider label="or sign in with email" />
          </>
        )}

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
          <Field
            id="password"
            label="Password"
            action={
              <Link
                href="/forgot-password"
                className="text-xs font-bold text-accent hover:underline"
              >
                Forgot password?
              </Link>
            }
          >
            <PasswordInput
              id="password"
              value={password}
              onChange={setPassword}
              placeholder="Your password"
              autoComplete="current-password"
            />
          </Field>

          <ErrorBox error={error} />

          <Button type="submit" size="lg" className="w-full" disabled={busy}>
            {busy ? "Signing in…" : "Sign In"}
          </Button>
        </form>

        <Divider label="New to TeesZone?" />
        <Button
          href={`/register${next !== "/account" ? `?next=${encodeURIComponent(next)}` : ""}`}
          variant="secondary"
          className="w-full"
        >
          Create your account
        </Button>
      </div>
    </AuthShell>
  );
}
