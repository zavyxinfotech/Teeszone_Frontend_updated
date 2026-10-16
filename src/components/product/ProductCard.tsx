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
  const priceFor2 = (product.price * 2).toLocaleString("en-IN");
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
      {/* Top badges */}
      <span className="absolute right-4 top-4 z-10 rounded-md bg-ink px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
        {discount}% OFF
      </span>

      <button
        onClick={handleLike}
        aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
        aria-pressed={saved}
        className={`absolute left-4 top-4 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 shadow-xs transition-all hover:scale-110 ${
          saved ? "text-accent" : "text-body hover:text-accent"
        }`}
      >
        <Heart size={14} fill={saved ? "currentColor" : "none"} />
      </button>

      <div>
        {/* Product Image - Constant 3:4 Aspect Ratio */}
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-surface">
          <Link href={`/products/${product.slug}`} className="block h-full w-full">
            <Image
              src={product.colors[0]?.image || "/products/crew-white.svg"}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
            />
          </Link>
        </div>

        {/* Content */}
        <div className="pt-3.5">
          <Link href={`/products/${product.slug}`} className="block min-w-0">
            <h3 className="line-clamp-2 text-sm font-bold text-ink transition-colors hover:text-accent leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Reviews Line */}
          <div className="mt-2 flex items-center gap-1.5 text-xs">
            <div className="flex items-center text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="font-bold text-ink">{ratingInfo.rating}</span>
            <span className="text-body">({ratingInfo.reviews} Reviews)</span>
          </div>

          {/* Price for 2 pcs */}
          <div className="mt-2.5 flex items-baseline gap-1.5">
            <span className="font-heading text-lg font-extrabold text-accent">
              ₹ {priceFor2}
            </span>
            <span className="text-xs font-medium text-body">for 2 pcs</span>
          </div>
        </div>
      </div>

      {/* Order Now Button */}
      <Link
        href={`/products/${product.slug}`}
        className="mt-3.5 flex w-full items-center justify-center gap-1.5 rounded-xl bg-ink py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-accent"
      >
        Order Now
        <ArrowRight size={13} />
      </Link>
    </div>
  );
}
