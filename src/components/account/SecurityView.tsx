"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { BadgeCheck, CheckCircle2 } from "lucide-react";
import { AccountShell } from "@/components/account/AccountShell";
import { ErrorBox, Field, inputCls, PasswordInput } from "@/components/auth/fields";
import { Button } from "@/components/ui/Button";
import { authApi } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import type { AuthUser } from "@/lib/types";

function Row({
  label,
  value,
  editing,
  onToggle,
  children,
  badge,
  editLabel = "Edit",
}: {
  label: string;
  value: ReactNode;
  editing: boolean;
  onToggle?: () => void;
  children?: ReactNode; // the expanded form
  badge?: ReactNode;
  editLabel?: string;
}) {
  return (
    <div className="border-b border-line py-5 last:border-b-0">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-body">{label}</p>
          <div className="mt-1 flex items-center gap-2 text-sm text-ink">{value}{badge}</div>
        </div>
        {onToggle && (
          <button
            onClick={onToggle}
            className="shrink-0 text-sm font-semibold text-accent hover:underline"
          >
            {editing ? "Cancel" : editLabel}
          </button>
        )}
      </div>
      {editing && <div className="mt-4 max-w-sm">{children}</div>}
    </div>
  );
}

function ProfileForm({
  user,
  token,
  field,
  onSaved,
}: {
  user: AuthUser;
  token: string;
  field: "name" | "phone";
  onSaved: (user: AuthUser) => void;
}) {
  const [value, setValue] = useState(user[field]);
  const [error, setError] = useState<Error | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      onSaved(await authApi.updateMe(token, { [field]: value }));
    } catch (err) {
      setError(err as Error);
      setBusy(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        aria-label={field === "name" ? "Your name" : "Phone number"}
        required={field === "name"}
        minLength={field === "name" ? 2 : undefined}
        type={field === "phone" ? "tel" : "text"}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={inputCls}
        placeholder={field === "phone" ? "+91 phone number" : "Full name"}
      />
      <ErrorBox error={error} />
      <Button type="submit" disabled={busy}>
        {busy ? "Saving…" : "Save"}
      </Button>
    </form>
  );
}

function PasswordForm({
  user,
  token,
  onSaved,
}: {
  user: AuthUser;
  token: string;
  onSaved: (user: AuthUser) => void;
}) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<Error | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (next !== confirm) {
      setError(new Error("Passwords don't match."));
      return;
    }
    setBusy(true);
    try {
      onSaved(
        await authApi.changePassword(token, {
          currentPassword: user.hasPassword ? current : undefined,
          newPassword: next,
        }),
      );
    } catch (err) {
      setError(err as Error);
      setBusy(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {user.hasPassword && (
        <Field id="current-password" label="Current password">
          <PasswordInput
            id="current-password"
            value={current}
            onChange={setCurrent}
            autoComplete="current-password"
          />
        </Field>
      )}
      <Field id="new-password" label="New password">
        <PasswordInput
          id="new-password"
          value={next}
          onChange={setNext}
          placeholder="At least 8 characters"
          autoComplete="new-password"
          minLength={8}
        />
      </Field>
      <Field id="confirm-password" label="Re-enter new password">
        <PasswordInput
          id="confirm-password"
          value={confirm}
          onChange={setConfirm}
          autoComplete="new-password"
          minLength={8}
        />
      </Field>
      <ErrorBox error={error} />
      <Button type="submit" disabled={busy}>
        {busy ? "Saving…" : user.hasPassword ? "Change Password" : "Create Password"}
      </Button>
    </form>
  );
}

export function SecurityView() {
  const { setUser } = useAuth();
  const [editing, setEditing] = useState<"name" | "phone" | "password" | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  const onSaved = (message: string) => (user: AuthUser) => {
    setUser(user);
    setEditing(null);
    setSaved(message);
  };

  return (
    <AccountShell title="Login & Security">
      {({ user, token }) => (
        <div className="max-w-2xl border border-line bg-white px-6">
          {saved && (
            <p className="flex items-center gap-1.5 pt-4 text-xs font-semibold text-accent">
              <CheckCircle2 size={14} />
              {saved}
            </p>
          )}

          <Row
            label="Name"
            value={user.name || <span className="text-body">Not set</span>}
            editing={editing === "name"}
            onToggle={() => setEditing(editing === "name" ? null : "name")}
          >
            <ProfileForm user={user} token={token} field="name" onSaved={onSaved("Name updated")} />
          </Row>

          <Row
            label="Email (your username)"
            value={user.email}
            editing={false}
            badge={
              user.googleLinked ? (
                <span className="inline-flex items-center gap-1 bg-accent-soft px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-accent">
                  <BadgeCheck size={12} />
                  Google linked
                </span>
              ) : undefined
            }
          />

          <Row
            label="Phone"
            value={user.phone || <span className="text-body">Not set</span>}
            editing={editing === "phone"}
            onToggle={() => setEditing(editing === "phone" ? null : "phone")}
          >
            <ProfileForm
              user={user}
              token={token}
              field="phone"
              onSaved={onSaved("Phone updated")}
            />
          </Row>

          <Row
            label="Password"
            value={
              user.hasPassword ? (
                "••••••••"
              ) : (
                <span className="text-body">
                  Not set — you sign in with Google. Create one to also sign in with email.
                </span>
              )
            }
            editing={editing === "password"}
            onToggle={() => setEditing(editing === "password" ? null : "password")}
            editLabel={user.hasPassword ? "Change" : "Create"}
          >
            <PasswordForm
              user={user}
              token={token}
              onSaved={onSaved(user.hasPassword ? "Password changed" : "Password created")}
            />
          </Row>
        </div>
      )}
    </AccountShell>
  );
}
