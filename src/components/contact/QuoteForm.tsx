"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, MessageCircle } from "lucide-react";
import type { Product } from "@/lib/types";
import { postEnquiry } from "@/lib/api";
import { waLink } from "@/lib/site";
import { Button } from "@/components/ui/Button";

const inputCls =
  "w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-sm text-ink placeholder:text-body/60 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20";

export function QuoteForm({
  products,
  initialProduct,
}: {
  products: Product[];
  initialProduct?: string;
}) {
  const [form, setForm] = useState({
    name: "",
    company: "",
    phone: "",
    product: initialProduct ?? "",
    quantity: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const set = (key: keyof typeof form) => (value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await postEnquiry(form);
      setStatus("sent");
    } catch {
      // still goes out via WhatsApp below, so don't block on this
      setStatus("error");
    }

    const productName =
      products.find((p) => p.slug === form.product)?.name ?? form.product;
    const lines = [
      "Hi TeesZone! I'd like a quote.",
      `Name: ${form.name}`,
      form.company && `Company/Institution: ${form.company}`,
      `Phone: ${form.phone}`,
      productName && `Product: ${productName}`,
      form.quantity && `Quantity: ${form.quantity}`,
      form.message && `Details: ${form.message}`,
    ].filter(Boolean);
    window.open(waLink(lines.join("\n")), "_blank", "noopener,noreferrer");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-bold text-ink">
            Your name *
          </label>
          <input
            id="name"
            required
            value={form.name}
            onChange={(e) => set("name")(e.target.value)}
            className={inputCls}
            placeholder="Full name"
          />
        </div>
        <div>
          <label htmlFor="company" className="mb-1.5 block text-sm font-bold text-ink">
            Company / institution
          </label>
          <input
            id="company"
            value={form.company}
            onChange={(e) => set("company")(e.target.value)}
            className={inputCls}
            placeholder="Optional"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-bold text-ink">
            Phone / WhatsApp *
          </label>
          <input
            id="phone"
            required
            type="tel"
            value={form.phone}
            onChange={(e) => set("phone")(e.target.value)}
            className={inputCls}
            placeholder="+91"
          />
        </div>
        <div>
          <label htmlFor="quantity" className="mb-1.5 block text-sm font-bold text-ink">
            Approx. quantity
          </label>
          <input
            id="quantity"
            value={form.quantity}
            onChange={(e) => set("quantity")(e.target.value)}
            className={inputCls}
            placeholder="e.g. 100 pcs"
          />
        </div>
      </div>

      <div>
        <label htmlFor="product" className="mb-1.5 block text-sm font-bold text-ink">
          Product
        </label>
        <select
          id="product"
          value={form.product}
          onChange={(e) => set("product")(e.target.value)}
          className={inputCls}
        >
          <option value="">Not sure yet — need guidance</option>
          {products.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-bold text-ink">
          Tell us about your requirement
        </label>
        <textarea
          id="message"
          rows={4}
          value={form.message}
          onChange={(e) => set("message")(e.target.value)}
          className={inputCls}
          placeholder="Sizes, colors, logo/design status, delivery timeline…"
        />
      </div>

      <Button
        type="submit"
        variant="whatsapp"
        size="lg"
        className="w-full sm:w-auto"
        disabled={status === "sending"}
      >
        <MessageCircle size={18} />
        {status === "sending" ? "Sending…" : "Send Enquiry"}
      </Button>
      {status === "sent" ? (
        <p className="flex items-center gap-1.5 text-xs font-bold text-accent">
          <CheckCircle2 size={14} />
          Enquiry received! We also opened WhatsApp so you can chat with us directly.
        </p>
      ) : (
        <p className="text-xs text-body">
          Submitting saves your enquiry with our team and opens WhatsApp with
          it pre-filled — chat there for the fastest response.
        </p>
      )}
    </form>
  );
}
