"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Plus } from "lucide-react";
import { AccountShell } from "@/components/account/AccountShell";
import { ErrorBox, Field, inputCls } from "@/components/auth/fields";
import { Button } from "@/components/ui/Button";
import { addressApi } from "@/lib/api";
import type { Address, AddressInput, AddressType } from "@/lib/types";

const emptyForm: AddressInput = {
  fullName: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  pincode: "",
  type: "HOME",
};

const typeOptions: { value: AddressType; label: string }[] = [
  { value: "HOME", label: "Home" },
  { value: "WORK", label: "Work" },
  { value: "OTHER", label: "Other" },
];

function AddressForm({
  token,
  initial,
  editId,
  onDone,
  onCancel,
}: {
  token: string;
  initial: AddressInput;
  editId: string | null;
  onDone: () => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<AddressInput>(initial);
  const [error, setError] = useState<Error | null>(null);
  const [busy, setBusy] = useState(false);

  const set = <K extends keyof AddressInput>(key: K) => (value: AddressInput[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (editId) await addressApi.update(token, editId, form);
      else await addressApi.create(token, form);
      onDone();
    } catch (err) {
      setError(err as Error);
      setBusy(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 space-y-5 border border-line bg-white p-6"
    >
      <h2 className="font-heading text-sm font-bold uppercase tracking-wide text-ink">
        {editId ? "Edit address" : "Add a new address"}
      </h2>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="addr-name" label="Full name *">
          <input
            id="addr-name"
            required
            minLength={2}
            value={form.fullName}
            onChange={(e) => set("fullName")(e.target.value)}
            className={inputCls}
            placeholder="Who receives the delivery"
            autoComplete="name"
          />
        </Field>
        <Field id="addr-phone" label="Phone *">
          <input
            id="addr-phone"
            required
            type="tel"
            minLength={8}
            value={form.phone}
            onChange={(e) => set("phone")(e.target.value)}
            className={inputCls}
            placeholder="For delivery updates"
            autoComplete="tel"
          />
        </Field>
      </div>

      <Field id="addr-line1" label="Flat / house no., building, street *">
        <input
          id="addr-line1"
          required
          minLength={3}
          value={form.line1}
          onChange={(e) => set("line1")(e.target.value)}
          className={inputCls}
          autoComplete="address-line1"
        />
      </Field>
      <Field id="addr-line2" label="Area, landmark (optional)">
        <input
          id="addr-line2"
          value={form.line2 ?? ""}
          onChange={(e) => set("line2")(e.target.value)}
          className={inputCls}
          autoComplete="address-line2"
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-3">
        <Field id="addr-city" label="City *">
          <input
            id="addr-city"
            required
            minLength={2}
            value={form.city}
            onChange={(e) => set("city")(e.target.value)}
            className={inputCls}
            autoComplete="address-level2"
          />
        </Field>
        <Field id="addr-state" label="State *">
          <input
            id="addr-state"
            required
            minLength={2}
            value={form.state}
            onChange={(e) => set("state")(e.target.value)}
            className={inputCls}
            autoComplete="address-level1"
          />
        </Field>
        <Field id="addr-pincode" label="Pincode *">
          <input
            id="addr-pincode"
            required
            pattern="\d{6}"
            title="6-digit pincode"
            inputMode="numeric"
            value={form.pincode}
            onChange={(e) => set("pincode")(e.target.value)}
            className={inputCls}
            placeholder="641601"
            autoComplete="postal-code"
          />
        </Field>
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <div className="flex gap-2" role="radiogroup" aria-label="Address type">
          {typeOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={form.type === opt.value}
              onClick={() => set("type")(opt.value)}
              className={`border px-4 py-1.5 text-xs font-bold uppercase tracking-wide transition-colors ${
                form.type === opt.value
                  ? "border-accent bg-accent text-white"
                  : "border-line bg-white text-body hover:border-ink/40"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={form.isDefault ?? false}
            onChange={(e) => set("isDefault")(e.target.checked)}
            className="h-4 w-4 accent-accent"
          />
          Make this my default address
        </label>
      </div>

      <ErrorBox error={error} />

      <div className="flex gap-3">
        <Button type="submit" disabled={busy}>
          {busy ? "Saving…" : editId ? "Save Changes" : "Add Address"}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

export function AddressesView() {
  return <AccountShell title="Your Addresses">{(ctx) => <AddressBook token={ctx.token} />}</AccountShell>;
}

function AddressBook({ token }: { token: string }) {
  const [addresses, setAddresses] = useState<Address[] | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [form, setForm] = useState<{ editId: string | null; initial: AddressInput } | null>(null);

  const refresh = useCallback(async () => {
    try {
      setAddresses(await addressApi.list(token));
      setError(null);
    } catch (err) {
      setError(err as Error);
    }
  }, [token]);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    refresh();
  }, [refresh]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const setDefault = async (address: Address) => {
    try {
      await addressApi.update(token, address.id, {
        fullName: address.fullName,
        phone: address.phone,
        line1: address.line1,
        line2: address.line2 ?? undefined,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        type: address.type,
        isDefault: true,
      });
      await refresh();
    } catch (err) {
      setError(err as Error);
    }
  };

  const remove = async (address: Address) => {
    if (!window.confirm("Remove this address?")) return;
    try {
      await addressApi.remove(token, address.id);
      await refresh();
    } catch (err) {
      setError(err as Error);
    }
  };

  return (
    <>
      {form && (
        <AddressForm
          token={token}
          initial={form.initial}
          editId={form.editId}
          onDone={() => {
            setForm(null);
            refresh();
          }}
          onCancel={() => setForm(null)}
        />
      )}
      <ErrorBox error={error} />

      {addresses === null ? (
        <p className="py-10 text-sm text-body">Loading addresses…</p>
      ) : (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {!form && (
            <button
              onClick={() => setForm({ editId: null, initial: emptyForm })}
              className="flex min-h-48 flex-col items-center justify-center gap-2 border-2 border-dashed border-line text-body transition-colors hover:border-accent hover:text-accent"
            >
              <Plus size={28} />
              <span className="font-heading text-sm font-bold uppercase tracking-wide">
                Add Address
              </span>
            </button>
          )}

          {addresses.map((address) => (
            <div key={address.id} className="flex min-h-48 flex-col border border-line bg-white p-5">
              <div className="flex items-center gap-2">
                <span className="bg-surface px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-body">
                  {address.type}
                </span>
                {address.isDefault && (
                  <span className="bg-accent-soft px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-accent">
                    Default
                  </span>
                )}
              </div>
              <p className="mt-3 text-sm font-semibold text-ink">{address.fullName}</p>
              <p className="mt-1 text-sm leading-relaxed text-body">
                {address.line1}
                {address.line2 ? `, ${address.line2}` : ""}
                <br />
                {address.city}, {address.state} — {address.pincode}
              </p>
              <p className="mt-1 text-sm text-body">Phone: {address.phone}</p>
              <div className="mt-auto flex gap-4 pt-4 text-sm font-semibold text-accent">
                <button
                  className="hover:underline"
                  onClick={() =>
                    setForm({
                      editId: address.id,
                      initial: {
                        fullName: address.fullName,
                        phone: address.phone,
                        line1: address.line1,
                        line2: address.line2 ?? "",
                        city: address.city,
                        state: address.state,
                        pincode: address.pincode,
                        type: address.type,
                        isDefault: address.isDefault,
                      },
                    })
                  }
                >
                  Edit
                </button>
                <button className="hover:underline" onClick={() => remove(address)}>
                  Remove
                </button>
                {!address.isDefault && (
                  <button className="hover:underline" onClick={() => setDefault(address)}>
                    Set as default
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
