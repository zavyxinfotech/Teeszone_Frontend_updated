"use client";

import { useState, type FormEvent } from "react";
import { postNewsletter } from "@/lib/api";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await postNewsletter(email);
      setStatus("done");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={submit} className="mt-4">
      <div className="flex">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          aria-label="Email address"
          className="w-full border border-line px-3 py-2.5 text-sm text-ink placeholder:text-body/60 focus:border-ink focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="shrink-0 bg-ink px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-accent disabled:opacity-60"
        >
          {status === "sending" ? "…" : "Join"}
        </button>
      </div>
      {status === "done" && (
        <p className="mt-2 text-xs font-semibold text-accent">
          You&apos;re in — welcome to the loop!
        </p>
      )}
      {status === "error" && (
        <p className="mt-2 text-xs text-body">
          Couldn&apos;t subscribe right now — please try again in a moment.
        </p>
      )}
    </form>
  );
}
