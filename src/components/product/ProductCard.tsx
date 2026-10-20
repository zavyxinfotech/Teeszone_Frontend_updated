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

export function ProductCard({ product }: { product: Product }) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { has, toggle } = useWishlist();
  const saved = has(product.slug);

  const ratingInfo = getProductRating(product.id || product.slug);
  const originalPrice = product.mrp.toLocaleString("en-IN");
  const sellingPrice = product.price.toLocaleString("en-IN");
  const discount = offPct(product);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      router.push(`/login?next=${encodeURIComponent(pathname || "/")}`);
      return;
    }
    toggle(product.slug, product.name);
  };

  return (
    <div className="group relative flex flex-col justify-between bg-white p-2">
      {/* Top badges - Offer badge removed on mobile, visible on desktop with increased size */}
      <span className="hidden sm:inline-block absolute right-3.5 top-3.5 z-10 rounded-md bg-ink px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-xs">
        {discount}% OFF
      </span>

      <button
        onClick={handleLike}
        aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
        aria-pressed={saved}
        className={`absolute left-2 top-2 sm:left-3.5 sm:top-3.5 z-10 flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-transparent transition-all hover:scale-110 ${
          saved ? "text-accent" : "text-ink/60 hover:text-accent"
        }`}
      >
        <Heart className="h-4 w-4 sm:h-5 sm:w-5" fill={saved ? "currentColor" : "none"} strokeWidth={2.2} />
      </button>

      <div>
        {/* Product Image - Constant 3:4 Aspect Ratio */}
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-surface">
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
        </div>

        {/* Content */}
        <div className="pt-2 sm:pt-3.5">
          <Link href={`/products/${product.slug}`} className="block min-w-0">
            <h3 className="line-clamp-2 text-xs sm:text-sm font-medium sm:font-bold text-ink transition-colors hover:text-accent leading-snug">
              {product.name}
            </h3>
          </Link>

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

      {/* Order Now Button */}
      <Link
        href={`/products/${product.slug}`}
        className="mt-2.5 sm:mt-3.5 flex w-full items-center justify-center gap-1 sm:gap-1.5 rounded-lg sm:rounded-xl bg-ink py-1.5 sm:py-2.5 text-[11px] sm:text-xs font-semibold sm:font-bold uppercase tracking-wider text-white transition-colors hover:bg-accent"
      >
        Order Now
        <ArrowRight size={12} />
      </Link>
    </div>
  );
}
