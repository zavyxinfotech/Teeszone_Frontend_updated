"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ArrowRight, Heart, Star } from "lucide-react";
import type { Product } from "@/lib/types";
import { offPct } from "@/lib/pricing";
import { useWishlist } from "@/lib/wishlist";
import { useAuth } from "@/lib/auth";

import { getProductRating } from "@/data/ratings";

export function isPoloProduct(product: Product): boolean {
  const s = (product.slug || "").toLowerCase();
  const n = (product.name || "").toLowerCase();
  const cols = (product.collections || []).map((c) => c.toLowerCase());
  return s.includes("polo") || n.includes("polo") || cols.some((c) => c.includes("polo"));
}

export function ProductCard({ product }: { product: Product }) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { has, toggle } = useWishlist();
  const saved = has(product.slug);
  const isPolo = isPoloProduct(product);

  const ratingInfo = getProductRating(product.id || product.slug);
  const originalPrice = product.mrp.toLocaleString("en-IN");
  const sellingPrice = product.price.toLocaleString("en-IN");
  const discount = offPct(product);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isPolo) return;
    if (!user) {
      router.push(`/login?next=${encodeURIComponent(pathname || "/")}`);
      return;
    }
    toggle(product.slug, product.name);
  };

  return (
    <div
      className={`group relative flex flex-col justify-between p-2 rounded-2xl transition-all ${
        isPolo
          ? "bg-white"
          : "bg-slate-50/90 border border-slate-200/80 shadow-xs"
      }`}
    >
      {/* Top badges */}
      {isPolo ? (
        <>
          <span className="hidden sm:inline-block absolute right-3.5 top-3.5 z-10 rounded-md bg-ink px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-xs">
            {discount}% OFF
          </span>

          <button
            onClick={handleLike}
            aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={saved}
            className={`absolute left-2 top-2 sm:left-3.5 sm:top-3.5 z-10 flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-transparent transition-all hover:scale-110 cursor-pointer ${
              saved ? "text-accent" : "text-ink/60 hover:text-accent"
            }`}
          >
            <Heart className="h-4 w-4 sm:h-5 sm:w-5" fill={saved ? "currentColor" : "none"} strokeWidth={2.2} />
          </button>
        </>
      ) : null}

      <div>
        {/* Product Image - Constant 3:4 Aspect Ratio */}
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-surface">
          {isPolo ? (
            <Link href={`/products/${product.slug}`} className="relative block h-full w-full">
              <Image
                src={product.colors[0]?.image || "/products/crew-white.svg"}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className={`transition-transform duration-300 group-hover:scale-105 ${
                  (product.colors[0]?.image || "").toLowerCase().endsWith(".svg")
                    ? "object-contain p-3"
                    : "object-cover object-top"
                }`}
              />
            </Link>
          ) : (
            /* Non-Polo Product: Hidden Navigation with Shaded Background & Coming Soon Badge */
            <div className="relative block h-full w-full select-none cursor-default">
              <Image
                src={product.colors[0]?.image || "/products/crew-white.svg"}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className={`grayscale-[25%] opacity-70 ${
                  (product.colors[0]?.image || "").toLowerCase().endsWith(".svg")
                    ? "object-contain p-3"
                    : "object-cover object-top"
                }`}
              />
              {/* Shaded Overlay & Badge */}
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[1.5px] p-3 text-center">
                <span className="rounded-full bg-[#80011F] text-white px-3.5 py-1 text-xs font-black uppercase tracking-wider shadow-lg">
                  Coming Soon
                </span>
                <p className="mt-1 text-[10px] font-semibold text-rose-100">
                  Customization arriving soon
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="pt-2 sm:pt-3.5">
          {isPolo ? (
            <Link href={`/products/${product.slug}`} className="block min-w-0">
              <h3 className="line-clamp-2 text-xs sm:text-sm font-medium sm:font-bold text-ink transition-colors hover:text-accent leading-snug">
                {product.name}
              </h3>
            </Link>
          ) : (
            /* Hidden navigation for title */
            <div className="block min-w-0 select-none cursor-default">
              <h3 className="line-clamp-2 text-xs sm:text-sm font-medium sm:font-bold text-gray-600 leading-snug">
                {product.name}
              </h3>
            </div>
          )}

          {/* Reviews Line - Desktop only */}
          <div className="mt-2 hidden sm:flex items-center gap-1.5 text-xs">
            <div className="flex items-center text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="font-bold text-ink">{ratingInfo.rating}</span>
            <span className="text-body">({ratingInfo.reviews} Reviews)</span>
          </div>

          {/* Price - Original Price & Selling Price */}
          <div className="mt-1.5 sm:mt-2.5 flex items-baseline gap-1.5">
            <span className="text-[11px] sm:text-xs text-body line-through">
              ₹ {originalPrice}
            </span>
            <span className="font-heading text-sm sm:text-lg font-bold sm:font-extrabold text-accent whitespace-nowrap">
              ₹ {sellingPrice}
            </span>
            <span className="hidden sm:inline text-xs font-medium text-body">/ pc</span>
          </div>
        </div>
      </div>

      {/* Action Button: Order Now (Polo) vs Coming Soon Disabled (Non-Polo) */}
      {isPolo ? (
        <Link
          href={`/products/${product.slug}`}
          className="mt-2.5 sm:mt-3.5 flex w-full items-center justify-center gap-1 sm:gap-1.5 rounded-lg sm:rounded-xl bg-ink py-1.5 sm:py-2.5 text-[11px] sm:text-xs font-semibold sm:font-bold uppercase tracking-wider text-white transition-colors hover:bg-accent"
        >
          <span>Order Now</span>
          <ArrowRight size={12} />
        </Link>
      ) : (
        <div className="mt-2.5 sm:mt-3.5 flex w-full items-center justify-center gap-1.5 rounded-lg sm:rounded-xl bg-gray-200 py-1.5 sm:py-2.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-500 cursor-not-allowed select-none border border-gray-300">
          <span>Coming Soon</span>
        </div>
      )}
    </div>
  );
}
