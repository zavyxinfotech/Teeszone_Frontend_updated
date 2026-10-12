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
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [line1, setLine1] = useState("");
  const [city, setCity] = useState("");
  const [stateVal, setStateVal] = useState("");
  const [pincode, setPincode] = useState("");
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
      await register({
        name,
        email,
        password,
        phone,
        company: company.trim() || undefined,
        line1,
        city,
        state: stateVal,
        pincode,
      });
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
      subtitle="Register to access wholesale catalog, build custom quotes and order."
      className="max-w-xl md:max-w-2xl lg:max-w-3xl"
    >
      <div className="space-y-5">
        {googleEnabled && (
          <>
            <GoogleButton onCredential={handleGoogle} />
            <Divider label="or register with email" />
          </>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="name" label="Your name *">
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

            <Field id="phone" label="Contact number *">
              <input
                id="phone"
                required
                type="tel"
                minLength={8}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputCls}
                placeholder="10-digit mobile number"
                autoComplete="tel"
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="email" label="Email *">
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

            <Field id="company" label="Company name (optional)">
              <input
                id="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className={inputCls}
                placeholder="Your company or brand (optional)"
                autoComplete="organization"
              />
            </Field>
          </div>

          <Field id="line1" label="Full address *">
            <input
              id="line1"
              required
              minLength={3}
              value={line1}
              onChange={(e) => setLine1(e.target.value)}
              className={inputCls}
              placeholder="Flat / house no., building, street, area"
              autoComplete="street-address"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field id="city" label="City *">
              <input
                id="city"
                required
                minLength={2}
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={inputCls}
                placeholder="City"
                autoComplete="address-level2"
              />
            </Field>

            <Field id="state" label="State *">
              <input
                id="state"
                required
                minLength={2}
                value={stateVal}
                onChange={(e) => setStateVal(e.target.value)}
                className={inputCls}
                placeholder="State"
                autoComplete="address-level1"
              />
            </Field>

            <Field id="pincode" label="Pincode *">
              <input
                id="pincode"
                required
                pattern="\d{4,10}"
                title="Pincode"
                inputMode="numeric"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className={inputCls}
                placeholder="Pincode"
                autoComplete="postal-code"
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="password" label="Password *">
              <PasswordInput
                id="password"
                value={password}
                onChange={setPassword}
                placeholder="At least 8 characters"
                autoComplete="new-password"
                minLength={8}
              />
            </Field>
            <Field id="confirm" label="Re-enter password *">
              <PasswordInput
                id="confirm"
                value={confirm}
                onChange={setConfirm}
                placeholder="Same password again"
                autoComplete="new-password"
                minLength={8}
              />
            </Field>
          </div>

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
