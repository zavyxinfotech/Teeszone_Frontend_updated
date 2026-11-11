"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ArrowRight, Heart, Star } from "lucide-react";
import type { Product } from "@/lib/types";
import { offPct } from "@/lib/pricing";
import { useWishlist } from "@/lib/wishlist";
import { useAuth } from "@/lib/auth";

import { getProductRating, TEESZONE_GOOGLE_REVIEWS_URL, isPoloProduct } from "@/data/ratings";
export { isPoloProduct };

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

  // Collect reference preview images for this product (Excluding plain customization mockups)
  const cardImages = useMemo(() => {
    // If the product is Aerosoft Polo, cycle strictly through its own reference angle images!
    if (product.slug === "aerosoft-polo-200") {
      const primaryColor = product.colors?.[0];
      if (primaryColor) {
        const angles = [
          primaryColor.image,
          primaryColor.backImage,
          primaryColor.chestImage,
          primaryColor.detailImage,
          primaryColor.image4,
          primaryColor.image5,
        ].filter(Boolean) as string[];

        const validAngles = angles.filter((img) => {
          const lower = img.toLowerCase();
          return (
            !lower.endsWith(".svg") &&
            !lower.includes("-3d.png") &&
            !lower.includes("mockup") &&
            !lower.includes("view-1.webp") // strictly never the golfer image
          );
        });

        const uniqueAngles = Array.from(new Set(validAngles));
        if (uniqueAngles.length > 1) {
          return uniqueAngles.map((src, idx) => ({
            src,
            name: `${primaryColor.name} Angle ${idx + 1}`,
            hex: primaryColor.hex,
          }));
        }
      }
    }

    // For EcoBlend and other products: show ONLY their own color variation images, NEVER other products' angles or golfer!
    const list: { src: string; name: string; hex: string }[] = [];
    (product.colors || []).forEach((c) => {
      if (!c.image) return;
      const lower = c.image.toLowerCase();
      // Strict filter: Exclude plain mockup SVGs, 3D mockup assets, and any golfer image
      const isMockup =
        lower.endsWith(".svg") ||
        lower.includes("-3d.png") ||
        lower.includes("mockup") ||
        lower.includes("view-1.webp");
      if (!isMockup && !list.some((item) => item.src === c.image)) {
        list.push({ src: c.image, name: c.name, hex: c.hex });
      }
    });

    return list.length > 0
      ? list
      : [
          {
            src: "/api/upload/media/teeszone/mens-polo-half-sleeve-240/black/view-2.webp",
            name: "Black",
            hex: "#26282D",
          },
        ];
  }, [product]);

  const [activeIdx, setActiveIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Automatically cycle through images as like in product details page
  useEffect(() => {
    if (!isPolo || cardImages.length <= 1 || isHovered) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % cardImages.length);
    }, 2600);
    return () => clearInterval(interval);
  }, [isPolo, cardImages.length, isHovered]);

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
      className={`group relative flex flex-col justify-between p-2 rounded-2xl transition-all ${isPolo
          ? "bg-white"
          : "bg-slate-50/90 border border-slate-200/80 shadow-xs"
        }`}
    >
      {/* Top badges */}
      {isPolo ? (
        <>
          <span className="hidden sm:inline-block absolute right-3.5 top-3.5 z-20 rounded-md bg-ink px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-xs">
            {discount}% OFF
          </span>

          <button
            onClick={handleLike}
            aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={saved}
            className={`absolute left-2 top-2 sm:left-3.5 sm:top-3.5 z-20 flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-transparent transition-all hover:scale-110 cursor-pointer ${saved ? "text-accent" : "text-ink/60 hover:text-accent"
              }`}
          >
            <Heart className="h-4 w-4 sm:h-5 sm:w-5" fill={saved ? "currentColor" : "none"} strokeWidth={2.2} />
          </button>
        </>
      ) : null}

      <div>
        {/* Product Image - Constant 3:4 Aspect Ratio with Automatic Cycling */}
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-surface"
        >
          {isPolo ? (
            <Link href={`/products/${product.slug}`} className="relative block h-full w-full">
              {cardImages.map((img, i) => (
                <Image
                  key={`${img.src}-${i}`}
                  src={img.src}
                  alt={`${product.name} - ${img.name}`}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className={`transition-all duration-700 ease-in-out ${i === activeIdx
                      ? "opacity-100 scale-100 z-10"
                      : "opacity-0 scale-98 z-0 pointer-events-none"
                    } ${(img.src || "").toLowerCase().endsWith(".svg")
                      ? "object-contain p-3"
                      : "object-cover object-top"
                    }`}
                />
              ))}

              {/* Color variations aligned at bottom-right corner */}
              {cardImages.length > 1 && (
                <div
                  className="absolute bottom-2 right-2 z-20 flex items-center gap-1 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-full border border-slate-200/80 shadow-xs pointer-events-auto"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  {cardImages.slice(0, 2).map((img, i) => (
                    <button
                      key={`${img.name}-${i}`}
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setActiveIdx(i);
                      }}
                      onMouseEnter={() => setActiveIdx(i)}
                      aria-label={`View ${img.name}`}
                      className={`h-2.5 w-2.5 rounded-full border border-black/20 transition-all cursor-pointer ${i === activeIdx
                          ? "scale-110 ring-1.5 ring-[#80011F]"
                          : "opacity-80 hover:opacity-100"
                        }`}
                      style={{ backgroundColor: img.hex }}
                    />
                  ))}
                  {cardImages.length > 2 && (
                    <span className="text-[10px] font-semibold text-gray-700 ml-0.5 whitespace-nowrap">
                      +{cardImages.length - 2} more
                    </span>
                  )}
                </div>
              )}
            </Link>
          ) : (
            /* Non-Polo Product: Hidden Navigation with Shaded Background & Coming Soon Badge */
            <div className="relative block h-full w-full select-none cursor-default">
              <Image
                src={product.colors[0]?.image || "/products/crew-white.svg"}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className={`grayscale-[25%] opacity-70 ${(product.colors[0]?.image || "").toLowerCase().endsWith(".svg")
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
          <a
            href={TEESZONE_GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="mt-2 hidden sm:flex items-center gap-1.5 text-xs group/rev hover:opacity-90"
            title="View TeesZone 5.0 Google Ratings"
          >
            <div className="flex items-center text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="font-bold text-ink">{ratingInfo.rating}</span>
            <span className="text-body group-hover/rev:underline">Google Ratings</span>
          </a>

          {/* Price - Original Price & Selling Price (shown for active polo products only) */}
          {isPolo && (
            <div className="mt-1.5 sm:mt-2.5 flex items-baseline gap-1.5">
              <span className="text-[11px] sm:text-xs text-body line-through">
                ₹ {originalPrice}
              </span>
              <span className="font-heading text-sm sm:text-lg font-bold sm:font-extrabold text-accent whitespace-nowrap">
                ₹ {sellingPrice}
              </span>
              <span className="hidden sm:inline text-xs font-medium text-body">/ pc</span>
            </div>
          )}
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
