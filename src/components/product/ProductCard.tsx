"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";
import type { Product } from "@/lib/types";
import { offPct } from "@/lib/pricing";
import { useWishlist } from "@/lib/wishlist";

export function ProductCard({ product }: { product: Product }) {
  const { has, toggle } = useWishlist();
  const saved = has(product.slug);
  const maxOff = Math.max(...product.qtyDiscounts.map((t) => t.offPct));
  const bulkQty = [...product.qtyDiscounts].sort((a, b) => b.minQty - a.minQty)[0];
  const bulkPrice = Math.round(product.price * (1 - maxOff / 100));

  return (
    <div className="group relative bg-white">
      {product.isNew && (
        <span className="absolute left-3 top-3 z-10 bg-ink px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
          New
        </span>
      )}
      {product.megaSale && (
        <span className="absolute left-3 top-3 z-10 bg-accent px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
          {offPct(product)}% Off
        </span>
      )}

      <button
        onClick={() => toggle(product.slug)}
        aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
        aria-pressed={saved}
        className={`absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm transition-all hover:scale-110 ${
          saved ? "text-accent" : "text-body hover:text-accent"
        }`}
      >
        <Heart size={16} fill={saved ? "currentColor" : "none"} />
      </button>

      {/* Image + quick add */}
      <div className="relative overflow-hidden bg-surface">
        <Link href={`/products/${product.slug}`} className="block">
          <Image
            src={product.colors[0].image}
            alt={product.name}
            width={440}
            height={440}
            className="h-auto w-full transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        <Link
          href={`/products/${product.slug}`}
          className="absolute inset-x-0 bottom-0 z-10 flex translate-y-full items-center justify-center gap-1.5 bg-ink/90 py-3 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur transition-transform duration-250 hover:bg-accent group-hover:translate-y-0 motion-reduce:hidden"
        >
          Quick Add
          <ArrowRight size={13} />
        </Link>
      </div>

      <div className="py-4">
        <div className="flex items-start justify-between gap-3">
          <Link href={`/products/${product.slug}`} className="min-w-0">
            <h3 className="line-clamp-2 text-sm font-bold text-ink transition-colors hover:text-accent">
              {product.name}
            </h3>
          </Link>
          <div className="flex shrink-0 gap-1.5 pt-1">
            {product.colors.slice(0, 4).map((c) => (
              <span
                key={c.name}
                title={c.name}
                className="h-3.5 w-3.5 rounded-full border border-ink/20"
                style={{ backgroundColor: c.hex }}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-[10px] font-bold text-body">
                +{product.colors.length - 4}
              </span>
            )}
          </div>
        </div>

        <span className="mt-2 inline-block bg-surface px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-body">
          {product.fabric} · {product.gsm} GSM
        </span>

        <p className="mt-2.5 text-sm">
          <span className="font-heading text-base font-bold text-ink">
            ₹ {bulkPrice}
          </span>
          <span className="text-body">/pc</span>
          <span className="ml-1.5 text-xs font-bold text-accent">
            at {bulkQty.minQty}+ pcs
          </span>
        </p>
        <p className="mt-0.5 text-xs text-body">
          ₹ {product.price}/pc for small orders
        </p>
      </div>
    </div>
  );
}
