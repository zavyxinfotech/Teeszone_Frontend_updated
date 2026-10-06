"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowRight, Heart } from "lucide-react";
import { useWishlist } from "@/lib/wishlist";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/product/ProductCard";

export function WishlistView({ products }: { products: Product[] }) {
  const { slugs, count } = useWishlist();
  const productBySlug = useMemo(
    () => new Map(products.map((p) => [p.slug, p])),
    [products],
  );
  const saved = slugs
    .map((slug) => productBySlug.get(slug))
    .filter((p): p is Product => Boolean(p));

  if (saved.length === 0) {
    return (
      <div className="mx-auto flex max-w-[1320px] flex-col items-center px-4 py-24 text-center sm:px-6">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-surface text-body">
          <Heart size={26} />
        </span>
        <h1 className="mt-5 text-2xl font-bold uppercase tracking-[0.08em]">
          Your wishlist is empty
        </h1>
        <p className="mt-2 max-w-sm text-sm">
          Tap the heart on any product to save it here while you compare
          fabrics and plan your order.
        </p>
        <Link
          href="/products"
          className="mt-7 inline-flex items-center gap-2 bg-accent px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-accent-dark"
        >
          Browse Products
          <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1320px] px-4 py-10 sm:px-6 md:py-14">
      <h1 className="text-3xl font-bold uppercase tracking-tight sm:text-4xl">
        Your Wishlist
      </h1>
      <p className="mt-2 text-sm">
        {count} saved {count === 1 ? "style" : "styles"} — tap a heart to
        remove, or open a product to build your size split.
      </p>
      <div className="mt-9 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {saved.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
