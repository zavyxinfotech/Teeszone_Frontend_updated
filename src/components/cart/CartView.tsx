"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Minus,
  MessageCircle,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";
import { useCart, type CartItem } from "@/lib/cart";
import type { Product } from "@/lib/types";
import { waLink } from "@/lib/site";

interface PricedLine extends CartItem {
  unitPrice: number;
  mrp: number;
  offPct: number;
}

export function CartView({ products }: { products: Product[] }) {
  const { items, note, setNote, updateQty, removeItem, clear, totalItems } =
    useCart();

  const productBySlug = useMemo(
    () => new Map(products.map((p) => [p.slug, p])),
    [products],
  );

  // bulk tiers are per product, total qty across colors/sizes
  const priced = useMemo<PricedLine[]>(() => {
    const totalsBySlug: Record<string, number> = {};
    for (const i of items)
      totalsBySlug[i.slug] = (totalsBySlug[i.slug] ?? 0) + i.qty;

    return items.map((i) => {
      const product = productBySlug.get(i.slug);
      if (!product) return { ...i, unitPrice: 0, mrp: 0, offPct: 0 };
      const tier = [...product.qtyDiscounts]
        .sort((a, b) => b.minQty - a.minQty)
        .find((t) => (totalsBySlug[i.slug] ?? 0) >= t.minQty);
      const off = tier?.offPct ?? 0;
      return {
        ...i,
        unitPrice: Math.round(product.price * (1 - off / 100)),
        mrp: product.mrp,
        offPct: off,
      };
    });
  }, [items, productBySlug]);

  const subtotal = priced.reduce((a, l) => a + l.unitPrice * l.qty, 0);
  const mrpTotal = priced.reduce((a, l) => a + l.mrp * l.qty, 0);
  const savings = mrpTotal - subtotal;

  // checkout goes to WhatsApp for now
  const orderMessage = [
    "Hi TeesZone! I'd like to place this order:",
    ...priced.map(
      (l) =>
        `• ${l.name} — ${l.colorName}, ${l.size} × ${l.qty} @ ₹${l.unitPrice}/pc`,
    ),
    `Total: ${totalItems} pcs — est. ₹${subtotal.toLocaleString("en-IN")}`,
    note ? `Branding: ${note}` : "Branding: will discuss in chat",
  ].join("\n");

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-[1320px] flex-col items-center px-4 py-24 text-center sm:px-6">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-surface text-body">
          <ShoppingBag size={26} />
        </span>
        <h1 className="mt-5 text-2xl font-bold uppercase tracking-[0.08em]">
          Your cart is empty
        </h1>
        <p className="mt-2 max-w-sm text-sm">
          Browse the range, pick your colors and size split, and your bulk
          order will show up here.
        </p>
        <Link
          href="/products"
          className="mt-7 inline-flex items-center gap-2 bg-ink px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-accent"
        >
          Shop All Products
          <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1320px] px-4 py-10 sm:px-6 md:py-14">
      <div className="flex items-end justify-between gap-4">
        <h1 className="text-3xl font-bold uppercase tracking-tight sm:text-4xl">
          Your Cart
        </h1>
        <button
          onClick={clear}
          className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-body transition-colors hover:text-accent"
        >
          <Trash2 size={14} />
          Clear cart
        </button>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
        {/* Lines */}
        <div className="divide-y divide-line border-t border-line">
          {priced.map((l) => (
            <div key={l.key} className="flex gap-4 py-5">
              <Link
                href={`/products/${l.slug}`}
                className="shrink-0 overflow-hidden border border-line bg-surface"
              >
                <Image
                  src={l.image}
                  alt={`${l.name} — ${l.colorName}`}
                  width={96}
                  height={96}
                  className="h-24 w-24 object-cover"
                />
              </Link>
              <div className="flex min-w-0 flex-1 flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <Link
                    href={`/products/${l.slug}`}
                    className="line-clamp-2 text-sm font-bold text-ink hover:text-accent"
                  >
                    {l.name}
                  </Link>
                  <p className="mt-1 flex items-center gap-2 text-xs text-body">
                    <span
                      className="h-3 w-3 rounded-full border border-ink/20"
                      style={{ backgroundColor: l.colorHex }}
                    />
                    {l.colorName} · Size {l.size}
                  </p>
                  <p className="mt-1.5 text-sm font-bold text-ink">
                    ₹ {l.unitPrice}
                    <span className="font-normal text-body">/pc</span>
                    {l.offPct > 0 && (
                      <span className="ml-2 text-xs font-bold text-accent">
                        bulk tier −{l.offPct}%
                      </span>
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      aria-label="Decrease quantity"
                      onClick={() => updateQty(l.key, l.qty - 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-line text-ink transition-colors hover:border-ink"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-sm font-bold text-ink">
                      {l.qty}
                    </span>
                    <button
                      aria-label="Increase quantity"
                      onClick={() => updateQty(l.key, l.qty + 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-line text-ink transition-colors hover:border-ink"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <p className="w-20 text-right text-sm font-bold text-ink">
                    ₹ {(l.unitPrice * l.qty).toLocaleString("en-IN")}
                  </p>
                  <button
                    aria-label="Remove line"
                    onClick={() => removeItem(l.key)}
                    className="rounded-full p-1.5 text-body transition-colors hover:bg-surface hover:text-accent"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Branding note */}
          <div className="py-5">
            <label
              htmlFor="branding-note"
              className="text-xs font-bold uppercase tracking-wider text-ink"
            >
              Branding / order note
            </label>
            <textarea
              id="branding-note"
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder='e.g. "Logo on left chest, text on back" — or the print text itself'
              className="mt-2 w-full border border-line px-3 py-2.5 text-sm text-ink placeholder:text-body/50 focus:border-ink focus:outline-none"
            />
          </div>
        </div>

        {/* Summary */}
        <aside className="h-fit border border-line p-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-ink">
            Order Summary
          </h2>
          <dl className="mt-4 space-y-2.5 text-sm">
            <div className="flex justify-between">
              <dt className="text-body">Items</dt>
              <dd className=" text-ink">{totalItems} pcs</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-body">MRP value</dt>
              <dd className="text-body line-through">
                ₹ {mrpTotal.toLocaleString("en-IN")}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-body">You save</dt>
              <dd className=" text-accent">
                − ₹ {savings.toLocaleString("en-IN")}
              </dd>
            </div>
            <div className="flex justify-between border-t border-line pt-3 text-base">
              <dt className=" text-ink">Estimated total</dt>
              <dd className=" text-ink">
                ₹ {subtotal.toLocaleString("en-IN")}
              </dd>
            </div>
          </dl>
          <p className="mt-2 text-xs text-body">
            Final amount is confirmed with your quote — branding positions and
            delivery included.
          </p>

          <a
            href={waLink(orderMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-whatsapp px-6 py-4 text-sm font-bold uppercase tracking-wider text-white shadow-md shadow-whatsapp/25 transition-all hover:-translate-y-0.5 hover:bg-whatsapp-dark"
          >
            <MessageCircle size={17} />
            Checkout on WhatsApp
          </a>
          <p className="mt-3 flex items-start gap-1.5 text-xs text-body">
            <BadgeCheck size={14} className="mt-0.5 shrink-0 text-accent" />
            Online payment is coming soon — for now checkout sends your order
            to our team on WhatsApp and we confirm with a mockup + invoice.
          </p>

          <Link
            href="/products"
            className="mt-4 block text-center text-xs font-bold uppercase tracking-wider text-ink underline underline-offset-4 hover:text-accent"
          >
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}
