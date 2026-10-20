"use client"; // TeesZone Product Configurator

import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CloudUpload,
  Heart,
  Minus,
  PenTool,
  Plus,
  Ruler,
  ShoppingBag,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import type { Product } from "@/lib/types";
import { offPct } from "@/lib/pricing";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { useAuth } from "@/lib/auth";
import { reviews as defaultReviews } from "@/data/reviews";
import { getProductRating } from "@/data/ratings";
import type { Review } from "@/lib/types";

const LIGHT_HEXES = new Set(["#F1F2F4", "#BFD8F0", "#E3B341", "#98D7C2", "#F4A7C3", "#C8A2C8"]);

// adult size guide, chest in inches (kids sizes skip it)
const SIZE_GUIDE: Record<string, string> = {
  XS: '34"',
  S: '36"',
  M: '38"',
  L: '40"',
  XL: '42"',
  XXL: '44"',
};

export function ProductConfigurator({
  product,
  initialReviews,
}: {
  product: Product;
  initialReviews?: Review[];
}) {
  const reviewsList = initialReviews && initialReviews.length > 0 ? initialReviews : defaultReviews;
  const ratingInfo = getProductRating(product.id || product.slug);
  const deliveredOrdersCount = product.ordersDelivered != null ? product.ordersDelivered : ratingInfo.deliveredCompanies;
  const [colorIdx, setColorIdx] = useState(0);
  const [sizeChartOpen, setSizeChartOpen] = useState(false);
  // size split per color: color -> size -> qty
  const [qty, setQty] = useState<Record<string, Record<string, number>>>({});
  const [printText, setPrintText] = useState("");
  const [logoName, setLogoName] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [justAdded, setJustAdded] = useState(false);
  const [pasteText, setPasteText] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);
  const { addItems } = useCart();
  const { has: hasWishlist, toggle: toggleWishlist } = useWishlist();
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const saved = hasWishlist(product.slug);

  const [apparelType, setApparelType] = useState<"blank" | "custom">("custom");
  const [customViewIdx, setCustomViewIdx] = useState(0);
  const [blankStartIdx, setBlankStartIdx] = useState(0);
  const color = product.colors[colorIdx];
  const colorQty = qty[color.name] ?? {};

  // Auto-scroll blank apparel carousel when a color is selected
  useEffect(() => {
    if (colorIdx < blankStartIdx) {
      setBlankStartIdx(colorIdx);
    } else if (colorIdx >= blankStartIdx + 6) {
      setBlankStartIdx(Math.max(0, Math.min(product.colors.length - 6, colorIdx - 5)));
    }
  }, [colorIdx, product.colors.length, blankStartIdx]);

  const colorTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    for (const [colorName, sizes] of Object.entries(qty)) {
      const sum = Object.values(sizes).reduce((a, b) => a + b, 0);
      if (sum > 0) totals[colorName] = sum;
    }
    return totals;
  }, [qty]);

  // tiers apply on the total across all colors
  const totalQty = useMemo(
    () => Object.values(colorTotals).reduce((a, b) => a + b, 0),
    [colorTotals],
  );

  // highest tier the current total qualifies for
  const tier = useMemo(() => {
    const sorted = [...product.qtyDiscounts].sort((a, b) => b.minQty - a.minQty);
    return sorted.find((t) => totalQty >= t.minQty) ?? null;
  }, [product.qtyDiscounts, totalQty]);

  const unitPrice = tier
    ? Math.round(product.price * (1 - tier.offPct / 100))
    : product.price;

  // next tier not reached yet (for the progress bar)
  const nextTier = useMemo(() => {
    const sorted = [...product.qtyDiscounts]
      .filter((t) => t.offPct > 0)
      .sort((a, b) => a.minQty - b.minQty);
    return sorted.find((t) => totalQty < t.minQty) ?? null;
  }, [product.qtyDiscounts, totalQty]);

  const setSizeQty = (size: string, value: number) =>
    setQty((q) => ({
      ...q,
      [color.name]: {
        ...(q[color.name] ?? {}),
        [size]: Math.max(0, Math.min(9999, value)),
      },
    }));

  const removeColorSplit = (colorName: string) =>
    setQty((q) => {
      const next = { ...q };
      delete next[colorName];
      return next;
    });

  const splitFor = (colorName: string) =>
    product.sizes
      .filter((s) => (qty[colorName]?.[s] ?? 0) > 0)
      .map((s) => `${s}×${qty[colorName]![s]}`)
      .join(", ");

  // parse "S-4 M-3 XL-10" (also S:4 / S 4 / S×4) into the active color's split
  const applyPaste = () => {
    const parsed: Record<string, number> = {};
    for (const m of pasteText.matchAll(/([A-Za-z0-9]+(?:-[A-Za-z0-9]+)?)\s*[-:x×]?\s*(\d+)/g)) {
      const size = product.sizes.find(
        (s) => s.toLowerCase() === m[1].toLowerCase(),
      );
      if (size) parsed[size] = Math.min(9999, Number(m[2]));
    }
    if (Object.keys(parsed).length === 0) return;
    setQty((q) => ({ ...q, [color.name]: { ...(q[color.name] ?? {}), ...parsed } }));
    setPasteText("");
  };

  const onLogoChange = (file: File | undefined) => {
    if (!file) return;
    setLogoName(file.name);
    setLogoPreview((old) => {
      if (old) URL.revokeObjectURL(old);
      return URL.createObjectURL(file);
    });
  };

  const clearLogo = () => {
    if (logoPreview) URL.revokeObjectURL(logoPreview);
    setLogoName(null);
    setLogoPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const colorsWithQty = Object.keys(colorTotals);

  // branding note (logo filename or print text) goes in as the cart note
  const handleAddToCart = () => {
    if (!user) {
      router.push(`/login?next=${encodeURIComponent(pathname || `/products/${product.slug}`)}`);
      return;
    }
    const lines: Parameters<typeof addItems>[0] = [];
    for (const cn of colorsWithQty) {
      const swatch = product.colors.find((c) => c.name === cn);
      if (!swatch) continue;
      for (const s of product.sizes) {
        const n = qty[cn]?.[s] ?? 0;
        if (n > 0)
          lines.push({
            slug: product.slug,
            name: product.name,
            image: swatch.image,
            colorName: cn,
            colorHex: swatch.hex,
            size: s,
            qty: n,
          });
      }
    }
    if (lines.length === 0) return;
    const note = logoName
      ? `Logo file ready: ${logoName} (will share on WhatsApp)`
      : printText
        ? `Print text: "${printText}"`
        : "";
    addItems(lines, note || undefined);
    setQty({});
    setJustAdded(true);
  };

  const handleToggleWishlist = () => {
    if (!user) {
      router.push(`/login?next=${encodeURIComponent(pathname || `/products/${product.slug}`)}`);
      return;
    }
    toggleWishlist(product.slug, product.name);
  };

  const showSizeGuide = product.sizes.some((s) => SIZE_GUIDE[s]);

  // Size Chart Image resolver (High-speed local WebP / S3 media proxy)
  const sizeChartImg = useMemo(() => {
    let url = product.sizeChartImage;
    if (url) {
      if (url.includes("hoodie-size-chart.webp")) return "/size-charts/hoodie-size-chart.webp";
      if (url.includes("womens-polo-size-chart.webp")) return "/size-charts/womens-polo-size-chart.webp";
      if (url.includes("mens-polo-size-chart.webp")) return "/size-charts/mens-polo-size-chart.webp";
      if (url.includes("teeszone-catalogue-images-2026.s3")) {
        const keyMatch = url.match(/teeszone\/.*$/);
        if (keyMatch) return `http://localhost:4010/api/upload/media/${keyMatch[0]}`;
      }
      return url;
    }
    const s = (product.slug || "").toLowerCase();
    const n = (product.name || "").toLowerCase();
    if (s.includes("hoodie") || n.includes("hoodie")) {
      return "/size-charts/hoodie-size-chart.webp";
    }
    if (s.includes("women") || n.includes("women")) {
      return "/size-charts/womens-polo-size-chart.webp";
    }
    return "/size-charts/mens-polo-size-chart.webp";
  }, [product.sizeChartImage, product.slug, product.name]);

  // Close size chart modal on Escape and lock scroll
  useEffect(() => {
    if (!sizeChartOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSizeChartOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [sizeChartOpen]);

  return (
    <div className="grid gap-8 lg:gap-10 lg:grid-cols-2 min-w-0 w-full max-w-full overflow-hidden">
      {/* Gallery */}
      <div className="min-w-0 w-full">
        {/* Option Selector at top right corner above the image */}
        <div className="mb-2 sm:mb-3 flex items-center justify-between">
          <span className="text-[11px] sm:text-xs font-medium sm:font-bold uppercase tracking-wider text-body">
            Apparel Type
          </span>
          <div className="inline-flex rounded-lg border border-line bg-surface p-0.5 sm:p-1 shadow-xs">
            <button
              type="button"
              onClick={() => setApparelType("blank")}
              className={`rounded-md px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-medium sm:font-bold uppercase tracking-wide sm:tracking-wider transition-all ${
                apparelType === "blank"
                  ? "bg-ink text-white shadow-xs"
                  : "text-body hover:text-ink"
              }`}
            >
              Blank Apparel
            </button>
            <button
              type="button"
              onClick={() => setApparelType("custom")}
              className={`rounded-md px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-medium sm:font-bold uppercase tracking-wide sm:tracking-wider transition-all ${
                apparelType === "custom"
                  ? "bg-accent text-white shadow-xs"
                  : "text-body hover:text-ink"
              }`}
            >
              Custom Tees
            </button>
          </div>
        </div>

        {(() => {
          const viewImages = [
            color.image,
            color.backImage || color.image,
            color.chestImage || color.image,
            color.detailImage || color.image,
            color.image4 || color.image,
            color.image5 || color.image,
          ];

          const currentMainImage = apparelType === "custom" ? (viewImages[customViewIdx] || color.image) : color.image;
          const isSvg = typeof currentMainImage === "string" && currentMainImage.toLowerCase().endsWith(".svg");

          return (
            <>
              {/* Main Product Image Container - Responsive 3:4 aspect ratio with mobile height bounds */}
              <div className="relative aspect-[3/4] max-h-[440px] sm:max-h-[580px] w-full overflow-hidden rounded-xl border border-line bg-surface flex items-center justify-center p-2 sm:p-4">
                <Image
                  src={currentMainImage}
                  alt={`${product.name} — ${color.name}`}
                  fill
                  priority
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className={`transition-all duration-300 ${
                    isSvg ? "object-contain p-4 sm:p-6" : "object-contain"
                  }`}
                />
              </div>

              {/* Thumbnail gallery below main image */}
              {apparelType === "custom" ? (
                /* For Custom Tees: 1 Main Image + 5 Reference Images (6 total thumbnails) for the active color */
                <div className="mt-2.5 sm:mt-3 grid grid-cols-6 gap-1.5 sm:gap-2">
                  {viewImages.map((imgSrc, idx) => {
                    const thumbIsSvg = typeof imgSrc === "string" && imgSrc.toLowerCase().endsWith(".svg");
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCustomViewIdx(idx)}
                        aria-label={`View angle ${idx + 1}`}
                        className={`group relative aspect-square overflow-hidden rounded-lg border-2 bg-surface transition-all ${
                          idx === customViewIdx
                            ? "border-accent ring-2 ring-accent/20 shadow-xs"
                            : "border-line hover:border-ink/40"
                        }`}
                      >
                        <Image
                          src={imgSrc}
                          alt={`Reference View ${idx + 1}`}
                          fill
                          sizes="(max-width: 640px) 16vw, 100px"
                          className={`h-full w-full ${
                            thumbIsSvg ? "object-contain p-1" : "object-cover object-top"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
              ) : (
                /* For Blank Apparel: Color image thumbnails with 6 visible by default & navigation arrows for 7+ colors */
                (() => {
                  const hasMoreColors = product.colors.length > 6;
                  const maxIdx = Math.max(0, product.colors.length - 6);
                  const visibleColors = hasMoreColors
                    ? product.colors.slice(blankStartIdx, blankStartIdx + 6)
                    : product.colors;

                  return (
                    <div className="mt-2.5 sm:mt-3">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        {hasMoreColors && (
                          <button
                            type="button"
                            onClick={() => setBlankStartIdx((prev) => Math.max(0, prev - 1))}
                            disabled={blankStartIdx === 0}
                            aria-label="Previous colors"
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line bg-surface text-ink shadow-sm transition hover:bg-neutral-100 disabled:opacity-25 disabled:cursor-not-allowed"
                          >
                            <ChevronLeft className="h-5 w-5" />
                          </button>
                        )}

                        <div className="flex-1 overflow-hidden">
                          <div className="grid grid-cols-6 gap-1.5 sm:gap-2">
                            {visibleColors.map((c, sliceIdx) => {
                              const actualIdx = hasMoreColors ? blankStartIdx + sliceIdx : sliceIdx;
                              const isSelected = actualIdx === colorIdx;
                              const swatchIsSvg = typeof c.image === "string" && c.image.toLowerCase().endsWith(".svg");
                              return (
                                <button
                                  key={c.name}
                                  type="button"
                                  onClick={() => {
                                    setColorIdx(actualIdx);
                                    setCustomViewIdx(0);
                                  }}
                                  aria-label={`View ${c.name}`}
                                  title={c.name}
                                  className={`group relative aspect-square overflow-hidden rounded-lg border-2 bg-surface transition-all ${
                                    isSelected
                                      ? "border-accent ring-2 ring-accent/20 shadow-xs"
                                      : "border-line hover:border-ink/40"
                                  }`}
                                >
                                  <Image
                                    src={c.image}
                                    alt={c.name}
                                    fill
                                    sizes="(max-width: 640px) 16vw, 100px"
                                    className={`h-full w-full ${
                                      swatchIsSvg ? "object-contain p-1" : "object-cover object-top"
                                    }`}
                                  />
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {hasMoreColors && (
                          <button
                            type="button"
                            onClick={() => setBlankStartIdx((prev) => Math.min(maxIdx, prev + 1))}
                            disabled={blankStartIdx >= maxIdx}
                            aria-label="Next colors"
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line bg-surface text-ink shadow-sm transition hover:bg-neutral-100 disabled:opacity-25 disabled:cursor-not-allowed"
                          >
                            <ChevronRight className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })()
              )}
            </>
          );
        })()}
      </div>

      {/* Buy box */}
      <div className="min-w-0 w-full max-w-full">
        <p className="text-[11px] uppercase tracking-wider text-body">TeesZone</p>
        <div className="mt-1 flex items-start justify-between gap-3 sm:gap-4">
          <h1 className="line-clamp-4 text-base sm:text-2xl lg:text-3xl font-medium sm:font-bold leading-snug text-ink">
            {product.name}
          </h1>
          <button
            onClick={handleToggleWishlist}
            aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={saved}
            className={`mt-0.5 flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full border bg-transparent transition-all hover:scale-110 ${saved
                ? "border-accent text-accent"
                : "border-line text-body hover:border-accent hover:text-accent"
              }`}
          >
            <Heart size={18} fill={saved ? "currentColor" : "none"} />
          </button>
        </div>

        {/* Rating & Reviews + Orders Delivered (aligned below, larger, no border/bg) */}
        <div className="mt-2.5">
          <div className="flex items-center gap-2">
            <div className="flex items-center text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} className="fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-base sm:text-lg font-bold text-ink">{ratingInfo.rating}</span>
            <span className="text-sm sm:text-base font-semibold text-body">
              ({ratingInfo.reviews.toLocaleString("en-IN")} Reviews)
            </span>
          </div>

          <p className="mt-1 flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-emerald-700">
            <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
            <span>{deliveredOrdersCount.toLocaleString("en-IN")}+ orders delivered</span>
          </p>
        </div>

        {/* Price row */}
        <div className="mt-4 flex flex-wrap items-baseline gap-x-3">
          <span className="text-sm text-body line-through">
            ₹ {product.mrp.toFixed(2)}
          </span>
          <span className="text-sm font-bold text-accent">
            ({offPct(product)}% OFF)
          </span>
          <span className="text-2xl font-bold text-ink">₹ {product.price}</span>
          <span className="text-xs text-body">per piece</span>
        </div>

        {/* Quantity discount ladder */}
        <div className="mt-4">
          <p className="text-xs font-bold uppercase tracking-wider text-ink">
            Quantity <span className="text-accent">*</span>
          </p>
          <div className="mt-2.5 flex flex-wrap gap-2.5">
            {product.qtyDiscounts.map((t) => {
              const active = tier?.minQty === t.minQty;
              const tierUnit = Math.round(product.price * (1 - t.offPct / 100));
              return (
                <div
                  key={t.minQty}
                  className={`rounded-lg border px-5 py-3 transition-all ${active
                      ? "border-ink bg-ink text-white shadow-md"
                      : "border-line bg-white"
                    }`}
                >
                  <p
                    className={`text-sm  ${active ? "text-white" : "text-ink"}`}
                  >
                    {t.minQty > 1 ? `${t.minQty}+ Pcs` : "Sample / Few Pcs"}
                  </p>
                  <p
                    className={`mt-0.5 text-xs  ${active ? "text-white/70" : "text-body"
                      }`}
                  >
                    ₹ {tierUnit}/pc
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Design approval note (only for Custom Tees) */}
        {apparelType === "custom" && (
          <div className="mt-5 space-y-3.5 rounded-xl border-l-4 border-accent bg-accent-soft p-4 pl-4 sm:pl-5 min-w-0 max-w-full">
            <p className="flex items-start gap-3 text-sm text-ink min-w-0">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-accent shadow-sm">
                <BadgeCheck size={16} />
              </span>
              <span className="pt-1 min-w-0 flex-1 break-words">
                We send a <strong>digital mockup for your approval</strong> after
                the order is confirmed — nothing goes to production before you
                sign off.
              </span>
            </p>
            <p className="flex items-start gap-3 text-sm text-ink min-w-0">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-accent shadow-sm">
                <PenTool size={16} />
              </span>
              <span className="pt-1 min-w-0 flex-1 break-words">
                Don&apos;t have a logo? No problem — order with text only and our
                team will <strong>create a custom design for you, free</strong>.
              </span>
            </p>
          </div>
        )}

        {/* Step 1: Colors */}
        <div className="mt-6">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink">
            <span className="flex h-5 w-5 items-center justify-center bg-accent text-[11px] font-bold text-white">
              1
            </span>
            Color: <span className=" normal-case text-body">{color.name}</span>
          </p>
          <div className="mt-2.5 flex flex-wrap gap-2.5">
            {product.colors.map((c, i) => {
              const count = colorTotals[c.name] ?? 0;
              return (
                <button
                  key={c.name}
                  onClick={() => {
                    setColorIdx(i);
                    setCustomViewIdx(0);
                  }}
                  title={c.name}
                  aria-label={`Select ${c.name}${count > 0 ? ` (${count} pcs added)` : ""}`}
                  className={`relative flex h-9 w-9 items-center justify-center rounded-full border transition-transform hover:scale-110 ${i === colorIdx ? "border-ink ring-2 ring-ink/20" : "border-ink/20"
                    }`}
                  style={{ backgroundColor: c.hex }}
                >
                  {i === colorIdx && (
                    <Check size={15} className={LIGHT_HEXES.has(c.hex) ? "text-ink" : "text-white"} />
                  )}
                  {count > 0 && (
                    <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white shadow-sm">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-xs text-body">
            Quantities are saved per color — pick a color, enter its sizes,
            then switch swatches to add another color.
          </p>
        </div>

        {/* Size-quantity matrix */}
        <div className="mt-6 min-w-0 max-w-full">
          <div className="flex items-center justify-between gap-2 min-w-0">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink shrink-0">
              <span className="flex h-5 w-5 items-center justify-center bg-accent text-[11px] font-bold text-white">
                2
              </span>
              Sizes & Quantities
            </p>
            {sizeChartImg ? (
              <button
                id="size-chart-btn"
                type="button"
                onClick={() => setSizeChartOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent hover:text-accent-dark hover:underline transition-colors cursor-pointer shrink-0"
                aria-label="Open Size Chart"
              >
                <Ruler size={14} className="shrink-0" />
                <span>Size Chart</span>
              </button>
            ) : showSizeGuide ? (
              <details className="relative">
                <summary className="cursor-pointer list-none text-xs font-bold text-accent underline underline-offset-4 [&::-webkit-details-marker]:hidden">
                  Size Guide
                </summary>
                <div className="absolute right-0 z-20 mt-2 w-56 border border-line bg-white p-4 shadow-xl">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-body">
                    Chest (garment)
                  </p>
                  <table className="mt-2 w-full text-xs">
                    <tbody className="divide-y divide-line">
                      {product.sizes
                        .filter((s) => SIZE_GUIDE[s])
                        .map((s) => (
                          <tr key={s}>
                            <td className="py-1.5 font-bold text-ink">{s}</td>
                            <td className="py-1.5 text-right">{SIZE_GUIDE[s]}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </details>
            ) : null}
          </div>
          <p className="mt-1 text-xs text-body">
            Entering sizes for{" "}
            <span className="inline-flex items-center gap-1.5 font-bold text-ink">
              <span
                className="inline-block h-3 w-3 rounded-full border border-ink/20"
                style={{ backgroundColor: color.hex }}
              />
              {color.name}
            </span>{" "}
            — e.g. L×3, XL×10, XXL×15.
          </p>
          <div className="mt-3 space-y-2.5">
            {product.sizes.map((s) => {
              const value = colorQty[s] ?? 0;
              const chest = SIZE_GUIDE[s]?.replace('"', "");
              return (
                <div key={s} className="flex items-center justify-between">
                  <span
                    className={`min-w-24 rounded-lg border px-4 py-2.5 text-center text-sm  transition-all ${value > 0
                        ? "border-ink bg-ink text-white"
                        : "border-line bg-white text-ink"
                      }`}
                  >
                    {s}
                    {chest ? ` (${chest})` : ""}
                  </span>
                  <div className="flex items-center gap-2.5">
                    <button
                      aria-label={`Decrease ${s} quantity`}
                      onClick={() => setSizeQty(s, value - 1)}
                      disabled={value === 0}
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-line text-ink transition-colors hover:border-ink disabled:opacity-30 disabled:hover:border-line"
                    >
                      <Minus size={14} />
                    </button>
                    <input
                      type="number"
                      min={0}
                      inputMode="numeric"
                      value={value === 0 ? "" : value}
                      placeholder="0"
                      onChange={(e) => setSizeQty(s, Number(e.target.value) || 0)}
                      aria-label={`${s} quantity`}
                      className="w-10 border-0 text-center text-base font-bold text-ink outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />
                    <button
                      aria-label={`Increase ${s} quantity`}
                      onClick={() => setSizeQty(s, value + 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-md border border-line text-ink transition-colors hover:border-ink"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* paste-to-fill for the active color */}
          <div className="mt-3 flex gap-2">
            <input
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyPaste()}
              placeholder='In a hurry? Paste a list — e.g. "S-4 M-3 XL-10"'
              className="w-full border border-line px-3 py-2.5 text-xs text-ink placeholder:text-body/50 focus:border-ink focus:outline-none"
            />
            <button
              onClick={applyPaste}
              className="shrink-0 border border-ink px-4 text-[11px] font-bold uppercase tracking-wider text-ink transition-colors hover:bg-ink hover:text-white"
            >
              Fill
            </button>
          </div>
        </div>

        {/* Live order summary */}
        {totalQty > 0 && (
          <div className="mt-4 overflow-hidden rounded-xl bg-ink text-white">
            <div className="flex flex-wrap items-start justify-between gap-3 px-5 py-4">
              <div className="min-w-0">
                <p className="text-sm ">{totalQty} pcs total</p>
                {/* per-color breakdown */}
                <ul className="mt-2 space-y-1.5">
                  {colorsWithQty.map((cn) => {
                    const swatch = product.colors.find((c) => c.name === cn);
                    return (
                      <li key={cn} className="flex items-center gap-2 text-xs">
                        <span
                          className="h-3 w-3 shrink-0 rounded-full border border-white/30"
                          style={{ backgroundColor: swatch?.hex }}
                        />
                        <span className="">{cn}</span>
                        <span className="text-white/60">
                          {splitFor(cn)} · {colorTotals[cn]} pcs
                        </span>
                        <button
                          onClick={() => removeColorSplit(cn)}
                          aria-label={`Remove ${cn} from order`}
                          className="ml-1 rounded-full p-0.5 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
                        >
                          <X size={12} />
                        </button>
                      </li>
                    );
                  })}
                </ul>
                <p className="mt-2 text-xs text-white/60">
                  {tier && tier.offPct > 0 ? (
                    <span className="inline-flex items-center gap-1.5">
                      <BadgeCheck size={13} className="text-whatsapp" />
                      {tier.minQty}+ tier applied on total — extra {tier.offPct}
                      % off
                    </span>
                  ) : (
                    "Add more pieces to unlock bulk tiers"
                  )}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xl ">
                  ₹ {(unitPrice * totalQty).toLocaleString("en-IN")}
                </p>
                <p className="text-xs text-white/60">est. @ ₹{unitPrice}/pc</p>
              </div>
            </div>
            {nextTier && (
              <div className="border-t border-white/10 px-5 py-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/70">
                    Add{" "}
                    <strong className="text-white">
                      {nextTier.minQty - totalQty} more pcs
                    </strong>{" "}
                    for extra {nextTier.offPct}% off
                  </span>
                  <span className=" text-gold">
                    {totalQty}/{nextTier.minQty}
                  </span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/15">
                  <div
                    className="h-full rounded-full bg-gold transition-all duration-300"
                    style={{
                      width: `${Math.min(100, (totalQty / nextTier.minQty) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Logo / branding (only for Custom Tees) */}
        {apparelType === "custom" && (
          <div className="mt-6">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink">
              <span className="flex h-5 w-5 items-center justify-center bg-accent text-[11px] font-bold text-white">
                3
              </span>
              Your Logo or Design
            </p>
            <div className="mt-2.5">
              {logoPreview ? (
                <div className="flex items-center gap-3 rounded-xl border border-accent bg-accent-soft/50 p-3 pr-4">
                  {/* next/image can't handle blob: URLs */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logoPreview}
                    alt="Your logo preview"
                    className="h-14 w-14 rounded-lg border border-line bg-white object-contain p-1"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-ink">
                      {logoName}
                    </p>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-body">
                      <BadgeCheck size={13} className="text-accent" />
                      Ready — attach this file in the WhatsApp chat
                    </p>
                  </div>
                  <button
                    onClick={clearLogo}
                    aria-label="Remove logo"
                    className="rounded-full p-1.5 text-body transition-colors hover:bg-white hover:text-accent"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    onLogoChange(e.dataTransfer.files?.[0]);
                  }}
                  className="group flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed border-ink/20 bg-surface/60 px-5 py-6 transition-colors hover:border-accent hover:bg-accent-soft/40"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-accent shadow-sm transition-transform group-hover:-translate-y-0.5">
                    <CloudUpload size={20} />
                  </span>
                  <span className="text-sm font-bold text-ink">
                    Drop your logo here or{" "}
                    <span className="text-accent underline underline-offset-2">
                      browse files
                    </span>
                  </span>
                  <span className="text-xs text-body">
                    PNG, JPG, SVG, PDF, AI, EPS — up to any size
                  </span>
                </button>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*,.pdf,.ai,.eps,.cdr"
                className="hidden"
                onChange={(e) => onLogoChange(e.target.files?.[0])}
              />
            </div>
            <p className="mt-2 text-xs text-body">
              {logoName
                ? "We'll ask for this file in the WhatsApp chat — just attach it there."
                : "Or tell us the text to print instead:"}
            </p>
            {!logoName && (
              <input
                value={printText}
                onChange={(e) => setPrintText(e.target.value)}
                placeholder='e.g. "Team Phoenix — Est. 2026"'
                className="mt-2 w-full border border-line px-3 py-2.5 text-sm text-ink placeholder:text-body/50 focus:border-ink focus:outline-none"
              />
            )}
          </div>
        )}

        {/* Step Review & Add */}
        <div className="mt-7 flex flex-col gap-3">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink">
            <span className="flex h-5 w-5 items-center justify-center bg-accent text-[11px] font-bold text-white">
              {apparelType === "custom" ? "4" : "3"}
            </span>
            Review & Add
          </p>
          <button
            onClick={handleAddToCart}
            disabled={totalQty === 0}
            className="group flex items-center justify-center gap-2.5 rounded-xl bg-ink px-8 py-4 text-sm font-bold uppercase tracking-wider text-white shadow-md transition-all enabled:hover:-translate-y-0.5 enabled:hover:bg-accent enabled:hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ShoppingBag size={17} />
            {totalQty > 0 ? `Add ${totalQty} pcs to Cart` : "Select sizes to add"}
            <ArrowRight
              size={16}
              className="transition-transform group-enabled:group-hover:translate-x-1"
            />
          </button>
          {justAdded && (
            <Link
              href="/cart"
              className="flex items-center justify-center gap-2 rounded-xl border border-whatsapp bg-whatsapp/10 px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-whatsapp-dark transition-colors hover:bg-whatsapp hover:text-white"
            >
              <BadgeCheck size={17} />
              Added — View Cart & Checkout
            </Link>
          )}
          <p className="flex items-center justify-center gap-1.5 text-center text-xs text-body">
            <Sparkles size={13} className="text-accent" />
            Free design support · Mockup before production · Pan-India delivery
          </p>
        </div>

        {/* Customer Reviews Section */}
        <div className="mt-8">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-3xl sm:text-4xl font-extrabold text-ink">{ratingInfo.rating}</span>
                <div>
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="mt-0.5 text-sm font-semibold text-body">
                    {ratingInfo.reviews.toLocaleString("en-IN")} verified reviews
                  </p>
                </div>
              </div>
              <p className="mt-1 flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-emerald-700">
                <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                <span>{deliveredOrdersCount.toLocaleString("en-IN")}+ orders delivered</span>
              </p>
            </div>
            <button
              type="button"
              className="rounded-full border border-line px-3.5 py-1 text-xs font-semibold text-ink transition-colors hover:border-ink hover:text-accent"
            >
              See all &gt;
            </button>
          </div>

          {/* Review Cards Carousel (No border, no shadow) */}
          <div className="relative mt-4">
            <button
              type="button"
              onClick={() => {
                reviewsRef.current?.scrollBy({ left: -260, behavior: "smooth" });
              }}
              aria-label="Previous reviews"
              className="absolute -left-3 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md text-ink transition-all hover:scale-110"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={() => {
                reviewsRef.current?.scrollBy({ left: 260, behavior: "smooth" });
              }}
              aria-label="Next reviews"
              className="absolute -right-3 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md text-ink transition-all hover:scale-110"
            >
              <ChevronRight size={16} />
            </button>

            <div
              ref={reviewsRef}
              className="flex gap-3.5 overflow-x-auto scroll-smooth py-1 scrollbar-none"
            >
              {reviewsList.map((rev, idx) => (
                <div
                  key={idx}
                  className="flex w-[230px] shrink-0 flex-col justify-between rounded-2xl bg-surface/80 p-3"
                >
                  <div>
                    {rev.image && (
                      <div className="relative mb-2.5 h-32 w-full overflow-hidden rounded-xl bg-ink/5">
                        <Image
                          src={rev.image}
                          alt={`${rev.author}'s review photo`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center gap-0.5 text-orange-500">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            className={
                              i < rev.stars
                                ? "fill-orange-500 text-orange-500"
                                : "fill-line text-line"
                            }
                          />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-ink">
                        {rev.stars}.0
                      </span>
                    </div>
                    <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-ink/85">
                      {rev.quote}
                    </p>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="font-bold text-ink">{rev.author}</span>
                    {rev.verified && (
                      <span className="inline-flex items-center gap-0.5 rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-600">
                        ✓ Verified
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Production & shipping */}
        <div className="mt-7 divide-y divide-line border border-line">
          <details className="group px-4">
            <summary className="flex cursor-pointer list-none items-center justify-between py-3.5 text-xs font-bold uppercase tracking-wider text-ink [&::-webkit-details-marker]:hidden">
              Production & Approval
              <Plus size={15} className="transition-transform group-open:rotate-45" />
            </summary>
            <div className="pb-4 text-sm leading-relaxed">
              After you confirm the order we share a digital mockup within 1–2
              business days. Production starts only after your approval and
              typically takes 3–7 business days depending on quantity and
              customization.
            </div>
          </details>
          <details className="group px-4">
            <summary className="flex cursor-pointer list-none items-center justify-between py-3.5 text-xs font-bold uppercase tracking-wider text-ink [&::-webkit-details-marker]:hidden">
              Shipping & Tracking
              <Plus size={15} className="transition-transform group-open:rotate-45" />
            </summary>
            <div className="pb-4 text-sm leading-relaxed">
              We ship across India with tracked couriers — transit usually
              takes 5–7 business days depending on your location. You receive
              a tracking link on WhatsApp or email as soon as your order is
              dispatched.
            </div>
          </details>
        </div>
      </div>

      {/* Sticky mini summary */}
      <div
        aria-hidden={totalQty === 0}
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 backdrop-blur transition-transform duration-300 motion-reduce:transition-none ${totalQty > 0 ? "translate-y-0" : "translate-y-full"
          }`}
      >
        <div className="mx-auto flex max-w-[1320px] items-center justify-between gap-4 px-4 py-3 pr-24 sm:px-6">
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-ink">
              {totalQty} pcs · {product.name}
            </p>
            <p className="text-xs text-body">
              est. ₹ {(unitPrice * totalQty).toLocaleString("en-IN")} @ ₹
              {unitPrice}/pc
            </p>
          </div>
          <button
            onClick={handleAddToCart}
            className="flex shrink-0 items-center gap-2 bg-accent px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-accent-dark"
          >
            <ShoppingBag size={15} />
            Add to Cart
          </button>
        </div>
      </div>
      {/* Preload Size Chart WebP image in background so modal opens instantly */}
      {sizeChartImg && <link rel="preload" as="image" href={sizeChartImg} />}

      {/* Size Chart Popup Modal (Desktop & Mobile with Blurred Background) */}
      {sizeChartOpen && sizeChartImg && (
        <div
          id="size-chart-modal"
          role="dialog"
          aria-modal="true"
          aria-label={`${product.name} Size Chart`}
          onClick={() => setSizeChartOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative flex flex-col max-h-[90vh] w-full max-w-sm sm:max-w-xl md:max-w-2xl lg:max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl border border-line animate-in zoom-in-95 duration-200"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-line px-4 sm:px-5 py-3 sm:py-3.5 bg-[#FAF8F5]">
              <div className="flex items-center gap-2 sm:gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <Ruler size={16} />
                </div>
                <div>
                  <h3 className="font-heading text-xs sm:text-sm font-bold uppercase tracking-wider text-ink">
                    Size Chart &amp; Fit Guide
                  </h3>
                  <p className="text-[11px] text-body truncate max-w-[190px] sm:max-w-md">
                    {product.name}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSizeChartOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-body hover:bg-black/5 hover:text-ink transition-colors"
                aria-label="Close size chart modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content - Centered Size Chart Picture */}
            <div className="flex-1 overflow-y-auto overscroll-contain p-2 sm:p-6 flex items-center justify-center bg-[#FAF8F5]">
              <img
                src={sizeChartImg}
                alt={`${product.name} Size Chart`}
                loading="eager"
                decoding="async"
                onError={(e) => {
                  const s = (product.slug || "").toLowerCase();
                  if (s.includes("hoodie")) {
                    e.currentTarget.src = "/size-charts/hoodie-size-chart.webp";
                  } else if (s.includes("women")) {
                    e.currentTarget.src = "/size-charts/womens-polo-size-chart.webp";
                  } else {
                    e.currentTarget.src = "/size-charts/mens-polo-size-chart.webp";
                  }
                }}
                className="max-h-[66vh] sm:max-h-[72vh] w-auto max-w-full object-contain rounded-lg shadow-sm mx-auto"
              />
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t border-line px-4 sm:px-5 py-2.5 bg-white text-[11px] text-body">
              <span className="truncate pr-2">Measurements in inches. Standard fit.</span>
              <button
                type="button"
                onClick={() => setSizeChartOpen(false)}
                className="font-bold text-accent hover:underline uppercase tracking-wider shrink-0"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
