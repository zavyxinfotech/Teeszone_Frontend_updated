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
  Tag,
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

/**
 * Dynamically determines the customized apparel option label based on the product category.
 * e.g., "Customized Hoodies" for hoodies, "Customized Polo" for polos, "Customized Oversize", etc.
 */
export function getCustomizedApparelName(product: Product): string {
  const s = (product.slug || "").toLowerCase();
  const n = (product.name || "").toLowerCase();
  const cols = (product.collections || []).map((c) => c.toLowerCase());

  if (s.includes("hoodie") || n.includes("hoodie") || cols.some((c) => c.includes("hoodie"))) {
    return "Customized Hoodies";
  }
  if (s.includes("polo") || n.includes("polo") || cols.some((c) => c.includes("polo"))) {
    return "Customized Polo";
  }
  if (s.includes("oversize") || n.includes("oversize") || cols.some((c) => c.includes("oversize"))) {
    return "Customized Oversize";
  }
  if (s.includes("sweatshirt") || n.includes("sweatshirt") || cols.some((c) => c.includes("sweatshirt"))) {
    return "Customized Sweatshirt";
  }
  if (s.includes("kid") || n.includes("kid") || cols.some((c) => c.includes("kid"))) {
    return "Customized Kids Tees";
  }
  if (s.includes("women") || n.includes("women") || cols.some((c) => c.includes("women"))) {
    return "Customized Women Tees";
  }
  if (
    s.includes("rn-") ||
    s.includes("round-neck") ||
    n.includes("round neck") ||
    n.includes("rn ") ||
    cols.some((c) => c.includes("round-neck"))
  ) {
    return "Customized Round Neck";
  }
  if (s.includes("jacket") || n.includes("jacket") || cols.some((c) => c.includes("jacket"))) {
    return "Customized Jackets";
  }
  return "Customized Tees";
}

const LIGHT_HEXES = new Set(["#F1F2F4", "#BFD8F0", "#E3B341", "#98D7C2", "#F4A7C3", "#C8A2C8"]);

/**
 * Resolves the exact sizes and chest measurements based on the official size chart images:
 * - Hoodies (hoodie-size-chart.webp): S (40"), M (42"), L (44"), XL (46"), 2XL (48")
 * - Men's Polo & Tees (mens-polo-size-chart.webp): S (38"), M (40"), L (42"), XL (44"), 2XL (46"), 3XL (48")
 * - Women's Polo & Tees (womens-polo-size-chart.webp): S (36"), M (38"), L (40"), XL (42"), 2XL (44"), 3XL (46")
 * - Kids: 2-3Y, 4-5Y, 6-7Y, 8-9Y, 10-11Y, 12-13Y
 */
export function getProductSizeConfig(product: Product): {
  sizes: string[];
  sizeGuide: Record<string, string>;
} {
  const s = (product.slug || "").toLowerCase();
  const n = (product.name || "").toLowerCase();

  // Kids products
  if (s.includes("kid") || n.includes("kid")) {
    const kidsSizes =
      product.sizes && product.sizes.length > 0 && product.sizes[0].includes("Y")
        ? product.sizes
        : ["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-11Y", "12-13Y"];
    return {
      sizes: kidsSizes,
      sizeGuide: {},
    };
  }

  // Hoodies (based on hoodie-size-chart.webp: S 40", M 42", L 44", XL 46", 2XL 48")
  if (s.includes("hoodie") || n.includes("hoodie")) {
    return {
      sizes: ["S", "M", "L", "XL", "2XL"],
      sizeGuide: {
        S: '40"',
        M: '42"',
        L: '44"',
        XL: '46"',
        "2XL": '48"',
        XXL: '48"',
      },
    };
  }

  // Women's apparel (based on womens-polo-size-chart.webp: S 36", M 38", L 40", XL 42", 2XL 44", 3XL 46")
  if (s.includes("women") || n.includes("women")) {
    return {
      sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
      sizeGuide: {
        S: '36"',
        M: '38"',
        L: '40"',
        XL: '42"',
        "2XL": '44"',
        XXL: '44"',
        "3XL": '46"',
      },
    };
  }

  // Men's / Adult Polo, Round Neck, Oversize (based on mens-polo-size-chart.webp: S 38", M 40", L 42", XL 44", 2XL 46", 3XL 48")
  return {
    sizes: ["S", "M", "L", "XL", "2XL", "3XL"],
    sizeGuide: {
      S: '38"',
      M: '40"',
      L: '42"',
      XL: '44"',
      "2XL": '46"',
      XXL: '46"',
      "3XL": '48"',
    },
  };
}

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
  const { sizes: productSizes, sizeGuide: sizeGuideMap } = useMemo(
    () => getProductSizeConfig(product),
    [product]
  );
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

  const customizedApparelName = useMemo(() => getCustomizedApparelName(product), [product]);
  const [apparelType, setApparelType] = useState<"blank" | "custom">("blank");
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isGalleryHovered, setIsGalleryHovered] = useState(false);
  const [blankStartIdx, setBlankStartIdx] = useState(0);
  const color = product.colors[colorIdx];
  const colorQty = qty[color.name] ?? {};

  // Compute all available images for auto-scrolling
  const displayImages = useMemo(() => {
    const angles = [
      color.image,
      color.backImage,
      color.chestImage,
      color.detailImage,
      color.image4,
      color.image5,
    ].filter((img): img is string => typeof img === "string" && img.trim().length > 0);

    const uniqueAngles = Array.from(new Set(angles));
    if (uniqueAngles.length > 1) {
      return uniqueAngles;
    }
    // Fallback if current color has single angle: cycle other color images
    if (product.colors.length > 1) {
      const colorImgs = product.colors.map((c) => c.image).filter(Boolean);
      const uniqueColorImgs = Array.from(new Set(colorImgs));
      if (uniqueColorImgs.length > 1) {
        return uniqueColorImgs;
      }
    }
    return uniqueAngles.length > 0 ? uniqueAngles : [color.image];
  }, [color, product.colors]);

  // Reset image view index when color is switched
  useEffect(() => {
    setActiveImageIdx(0);
  }, [colorIdx]);

  // 3-second auto-scroll interval (pauses when user hovers gallery)
  useEffect(() => {
    if (displayImages.length <= 1 || isGalleryHovered) return;

    const timer = setInterval(() => {
      setActiveImageIdx((prev) => (prev + 1) % displayImages.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [displayImages.length, isGalleryHovered]);

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

  // Color Mode Option: "single" color or "multiple" colors (Mix & Match)
  const [colorMode, setColorMode] = useState<"single" | "multiple">("single");
  const [selectedColorNames, setSelectedColorNames] = useState<string[]>(() => [
    product.colors[0]?.name || "",
  ]);

  // Sync selectedColorNames if product changes
  useEffect(() => {
    if (product.colors[0]?.name) {
      setSelectedColorNames([product.colors[0].name]);
      setColorMode("single");
    }
  }, [product.id, product.slug]);

  // If user enters pieces for multiple colors, auto-reflect in selectedColorNames & colorMode
  useEffect(() => {
    const activeColorsWithQty = Object.keys(colorTotals);
    if (activeColorsWithQty.length > 1) {
      setColorMode("multiple");
      setSelectedColorNames((prev) => Array.from(new Set([...prev, ...activeColorsWithQty])));
    }
  }, [colorTotals]);

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

  const handleColorModeChange = (mode: "single" | "multiple") => {
    setColorMode(mode);
    if (mode === "single") {
      // In single mode, ensure the active color is the selected single color
      setSelectedColorNames([color.name]);
    } else {
      // In multiple mode, ensure active color is in the list
      if (!selectedColorNames.includes(color.name)) {
        setSelectedColorNames((prev) => [...prev, color.name]);
      }
    }
  };

  const handleSwatchClick = (idx: number) => {
    const target = product.colors[idx];
    if (!target) return;
    setColorIdx(idx);
    setActiveImageIdx(0);
    if (colorMode === "single") {
      setSelectedColorNames([target.name]);
    } else {
      if (!selectedColorNames.includes(target.name)) {
        setSelectedColorNames((prev) => [...prev, target.name]);
      }
    }
  };

  const handleRemoveSelectedColor = (colorName: string) => {
    if (selectedColorNames.length <= 1) return;
    // Clear quantity for this color
    setQty((q) => {
      const next = { ...q };
      delete next[colorName];
      return next;
    });
    const updated = selectedColorNames.filter((cn) => cn !== colorName);
    setSelectedColorNames(updated);
    if (color.name === colorName) {
      const nextIdx = product.colors.findIndex((c) => c.name === updated[0]);
      if (nextIdx !== -1) {
        setColorIdx(nextIdx);
        setActiveImageIdx(0);
      }
    }
  };

  const removeColorSplit = (colorName: string) => {
    setQty((q) => {
      const next = { ...q };
      delete next[colorName];
      return next;
    });
    if (colorMode === "multiple" && selectedColorNames.length > 1) {
      const remaining = selectedColorNames.filter((cn) => cn !== colorName);
      setSelectedColorNames(remaining);
      if (color.name === colorName) {
        const nextIdx = product.colors.findIndex((c) => c.name === remaining[0]);
        if (nextIdx !== -1) {
          setColorIdx(nextIdx);
          setActiveImageIdx(0);
        }
      }
    }
  };

  const splitFor = (colorName: string) =>
    productSizes
      .filter((s) => (qty[colorName]?.[s] ?? 0) > 0)
      .map((s) => `${s}×${qty[colorName]![s]}`)
      .join(", ");

  // parse "S-4 M-3 XL-10" (also S:4 / S 4 / S×4 / 2XL-5) into the active color's split
  const applyPaste = () => {
    const parsed: Record<string, number> = {};
    for (const m of pasteText.matchAll(/([A-Za-z0-9]+(?:-[A-Za-z0-9]+)?)\s*[-:x×]?\s*(\d+)/g)) {
      const token = m[1].toLowerCase();
      const size = productSizes.find(
        (s) =>
          s.toLowerCase() === token ||
          (token === "xxl" && s.toLowerCase() === "2xl") ||
          (token === "2xl" && s.toLowerCase() === "xxl")
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
      for (const s of productSizes) {
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
    const note =
      apparelType === "custom"
        ? logoName
          ? `${customizedApparelName} — Logo: ${logoName} (will share on WhatsApp)`
          : printText
            ? `${customizedApparelName} — Print text: "${printText}"`
            : `${customizedApparelName}`
        : "Blank Apparel (No customization)";
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

  const showSizeGuide = productSizes.some((s) => sizeGuideMap[s]);

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
    <div className="grid gap-8 lg:gap-10 lg:grid-cols-2 min-w-0 w-full max-w-full">
      {/* Gallery - Sticky on desktop view */}
      <div
        className="min-w-0 w-full lg:sticky lg:top-20 self-start"
        onMouseEnter={() => setIsGalleryHovered(true)}
        onMouseLeave={() => setIsGalleryHovered(false)}
      >
        {/* Option Selector at top right corner above the image */}
        <div className="mb-2 sm:mb-3 flex items-center justify-between">
          <span className="text-[11px] sm:text-xs font-medium sm:font-bold uppercase tracking-wider text-body">
            Apparel Type
          </span>
          <div className="inline-flex rounded-lg border border-line bg-surface p-0.5 sm:p-1 shadow-xs">
            <button
              type="button"
              onClick={() => setApparelType("blank")}
              className={`rounded-md px-2.5 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wide sm:tracking-wider transition-all ${
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
              className={`rounded-md px-2.5 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-wide sm:tracking-wider transition-all ${
                apparelType === "custom"
                  ? "bg-accent text-white shadow-xs"
                  : "text-body hover:text-ink"
              }`}
            >
              {customizedApparelName}
            </button>
          </div>
        </div>

        {(() => {
          const currentMainImage = displayImages[activeImageIdx] || color.image;
          const isSvg = typeof currentMainImage === "string" && currentMainImage.toLowerCase().endsWith(".svg");

          return (
            <>
              {/* Main Product Image Container - Natural 3:4 aspect ratio with centered position & 3s auto-scroll */}
              <div className="group relative aspect-[3/4] w-full overflow-hidden rounded-xl border border-line bg-surface">
                <Image
                  src={currentMainImage}
                  alt={`${product.name} — ${color.name} (Angle ${activeImageIdx + 1})`}
                  fill
                  priority
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className={`transition-all duration-500 ease-in-out ${
                    isSvg ? "object-contain p-4 sm:p-6" : "object-cover object-top"
                  }`}
                />

                {/* Left / Right chevron navigation on image */}
                {displayImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImageIdx((prev) => (prev - 1 + displayImages.length) % displayImages.length);
                      }}
                      aria-label="Previous photo"
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink shadow-md backdrop-blur-xs transition hover:bg-white hover:scale-105 opacity-0 group-hover:opacity-100 sm:opacity-75 focus:opacity-100"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImageIdx((prev) => (prev + 1) % displayImages.length);
                      }}
                      aria-label="Next photo"
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink shadow-md backdrop-blur-xs transition hover:bg-white hover:scale-105 opacity-0 group-hover:opacity-100 sm:opacity-75 focus:opacity-100"
                    >
                      <ChevronRight size={20} />
                    </button>

                    {/* Image index counter badge */}
                    <div className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-xs">
                      {activeImageIdx + 1} / {displayImages.length}
                    </div>

                    {/* Subtle auto-scroll indicator bar */}
                    {!isGalleryHovered && (
                      <div className="absolute top-0 left-0 right-0 h-1 bg-black/10 overflow-hidden">
                        <div
                          key={activeImageIdx}
                          className="h-full bg-accent animate-pulse"
                          style={{ width: "100%", transition: "width 3000ms linear" }}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Thumbnail gallery below main image synchronized with 3s auto-scroll */}
              {displayImages.length > 1 && (
                <div className="mt-2.5 sm:mt-3 grid grid-cols-6 gap-1.5 sm:gap-2">
                  {displayImages.map((imgSrc, idx) => {
                    const isActive = idx === activeImageIdx;
                    const thumbIsSvg = typeof imgSrc === "string" && imgSrc.toLowerCase().endsWith(".svg");
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveImageIdx(idx)}
                        aria-label={`View photo ${idx + 1}`}
                        className={`group relative aspect-square overflow-hidden rounded-lg border-2 bg-surface transition-all ${
                          isActive
                            ? "border-accent ring-2 ring-accent/30 shadow-xs scale-[1.03]"
                            : "border-line opacity-75 hover:opacity-100 hover:border-ink/40"
                        }`}
                      >
                        <Image
                          src={imgSrc}
                          alt={`${product.name} view ${idx + 1}`}
                          fill
                          sizes="(max-width: 640px) 16vw, 100px"
                          className={`h-full w-full transition-transform group-hover:scale-105 ${
                            thumbIsSvg ? "object-contain p-1" : "object-cover object-top"
                          }`}
                        />
                        {isActive && (
                          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
                        )}
                      </button>
                    );
                  })}
                </div>
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

        {/* Step 1: Choose Colors */}
        <div className="mt-6">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink">
              <span className="flex h-5 w-5 items-center justify-center bg-accent text-[11px] font-bold text-white">
                1
              </span>
              Choose Colors
              <span className="normal-case font-medium text-body">
                — {colorMode === "single" ? color.name : `${selectedColorNames.length} color${selectedColorNames.length > 1 ? "s" : ""} selected`}
              </span>
            </p>

            {/* Choose Colors Mode Option: Single Color vs Multiple Colors */}
            {product.colors.length > 1 && (
              <div className="inline-flex rounded-lg border border-line bg-surface p-0.5 sm:p-1 shadow-xs">
                <button
                  type="button"
                  onClick={() => handleColorModeChange("single")}
                  className={`rounded-md px-2.5 sm:px-3 py-1 text-[10px] sm:text-xs font-bold uppercase tracking-wide sm:tracking-wider transition-all ${
                    colorMode === "single"
                      ? "bg-ink text-white shadow-xs"
                      : "text-body hover:text-ink"
                  }`}
                >
                  Single Color
                </button>
                <button
                  type="button"
                  onClick={() => handleColorModeChange("multiple")}
                  className={`rounded-md px-2.5 sm:px-3 py-1 text-[10px] sm:text-xs font-bold uppercase tracking-wide sm:tracking-wider transition-all ${
                    colorMode === "multiple"
                      ? "bg-accent text-white shadow-xs"
                      : "text-body hover:text-ink"
                  }`}
                >
                  Multiple Colors
                </button>
              </div>
            )}
          </div>

          {/* Contextual guidance */}
          <div className="mt-2 text-xs text-body">
            {colorMode === "single" ? (
              <p>
                Ordering in one color (<strong>{color.name}</strong>). Need more than one color for your order?{" "}
                <button
                  type="button"
                  onClick={() => handleColorModeChange("multiple")}
                  className="font-bold text-accent hover:underline inline-flex items-center gap-0.5"
                >
                  Switch to Multiple Colors →
                </button>
              </p>
            ) : (
              <p>
                <strong>Mix &amp; Match Colors:</strong> Select all the colors you want to buy. Click swatches below to pick colors, then allocate sizes for each color in Step 2.
              </p>
            )}
          </div>

          {/* Color Swatches Grid */}
          <div className="mt-3 flex flex-wrap gap-2.5">
            {product.colors.map((c, i) => {
              const isSelected =
                colorMode === "multiple" ? selectedColorNames.includes(c.name) : i === colorIdx;
              const isCurrentlyActive = i === colorIdx;
              const count = colorTotals[c.name] ?? 0;
              return (
                <button
                  key={c.name}
                  onClick={() => handleSwatchClick(i)}
                  title={`${c.name}${count > 0 ? ` (${count} pcs)` : ""}`}
                  aria-label={`Select ${c.name}${count > 0 ? ` (${count} pcs added)` : ""}`}
                  className={`relative flex h-9 sm:h-10 w-9 sm:w-10 items-center justify-center rounded-full border transition-all hover:scale-110 ${
                    isCurrentlyActive
                      ? "border-ink ring-2 ring-ink ring-offset-2 shadow-sm"
                      : isSelected
                      ? "border-accent ring-2 ring-accent/40"
                      : "border-ink/20 opacity-80 hover:opacity-100"
                  }`}
                  style={{ backgroundColor: c.hex }}
                >
                  {isSelected && (
                    <Check
                      size={15}
                      className={`stroke-[2.5] ${LIGHT_HEXES.has(c.hex) ? "text-ink" : "text-white"}`}
                    />
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

          {/* Multiple Colors: Selected Colors Ribbon */}
          {colorMode === "multiple" && (
            <div className="mt-4 pt-3 border-t border-line/60">
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-body mb-2">
                <span>Selected Colors ({selectedColorNames.length}):</span>
                <span className="text-[10px] font-normal normal-case text-body">
                  Tap to preview color &amp; edit sizes
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {selectedColorNames.map((cn) => {
                  const cObj = product.colors.find((c) => c.name === cn);
                  const count = colorTotals[cn] ?? 0;
                  const isActive = cObj?.name === color.name;
                  return (
                    <div
                      key={cn}
                      className={`inline-flex items-center gap-2 rounded-lg border px-2.5 sm:px-3 py-1.5 text-xs font-semibold transition-all ${
                        isActive
                          ? "border-ink bg-ink text-white shadow-xs"
                          : "border-line bg-white text-ink hover:border-ink/40"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          const idx = product.colors.findIndex((c) => c.name === cn);
                          if (idx !== -1) {
                            setColorIdx(idx);
                            setActiveImageIdx(0);
                          }
                        }}
                        className="inline-flex items-center gap-1.5 focus:outline-none text-left"
                      >
                        <span
                          className="h-3 w-3 rounded-full border border-black/20 shrink-0"
                          style={{ backgroundColor: cObj?.hex }}
                        />
                        <span>{cn}</span>
                        {count > 0 ? (
                          <span
                            className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                              isActive
                                ? "bg-white/20 text-white"
                                : "bg-accent/10 text-accent"
                            }`}
                          >
                            {count} pcs
                          </span>
                        ) : (
                          <span
                            className={`text-[10px] ${
                              isActive ? "text-white/60" : "text-body/60"
                            }`}
                          >
                            (add sizes)
                          </span>
                        )}
                      </button>
                      {selectedColorNames.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveSelectedColor(cn)}
                          aria-label={`Remove ${cn} color`}
                          className={`rounded-full p-0.5 transition-colors ${
                            isActive
                              ? "text-white/60 hover:bg-white/20 hover:text-white"
                              : "text-body hover:bg-black/5 hover:text-ink"
                          }`}
                        >
                          <X size={13} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
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
                      {productSizes
                        .filter((s) => sizeGuideMap[s])
                        .map((s) => (
                          <tr key={s}>
                            <td className="py-1.5 font-bold text-ink">{s}</td>
                            <td className="py-1.5 text-right">{sizeGuideMap[s]}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </details>
            ) : null}
          </div>

          {/* Multi-Color Quick Switcher Tabs in Step 2 */}
          {colorMode === "multiple" && selectedColorNames.length > 1 && (
            <div className="mt-2.5 rounded-xl border border-line bg-surface/40 p-2 sm:p-2.5">
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-body mb-1.5 px-1">
                <span>Select Color to Enter Sizes:</span>
                <span className="text-accent font-bold">
                  {colorTotals[color.name] ? `${colorTotals[color.name]} pcs for ${color.name}` : "0 pcs"}
                </span>
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {selectedColorNames.map((cn) => {
                  const cObj = product.colors.find((c) => c.name === cn);
                  const count = colorTotals[cn] ?? 0;
                  const isActive = cObj?.name === color.name;
                  return (
                    <button
                      key={cn}
                      type="button"
                      onClick={() => {
                        const idx = product.colors.findIndex((c) => c.name === cn);
                        if (idx !== -1) {
                          setColorIdx(idx);
                          setActiveImageIdx(0);
                        }
                      }}
                      className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all shrink-0 ${
                        isActive
                          ? "border-ink bg-ink text-white shadow-xs"
                          : "border-line bg-white text-ink hover:border-ink/50"
                      }`}
                    >
                      <span
                        className="h-2.5 w-2.5 rounded-full border border-black/20 shrink-0"
                        style={{ backgroundColor: cObj?.hex }}
                      />
                      <span>{cn}</span>
                      <span
                        className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                          isActive
                            ? "bg-white/20 text-white"
                            : count > 0
                            ? "bg-accent/10 text-accent font-bold"
                            : "bg-surface text-body/60"
                        }`}
                      >
                        {count > 0 ? `${count} pcs` : "0"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <p className="mt-2 text-xs text-body">
            Entering sizes for{" "}
            <span className="inline-flex items-center gap-1.5 font-bold text-ink">
              <span
                className="inline-block h-3 w-3 rounded-full border border-ink/20"
                style={{ backgroundColor: color.hex }}
              />
              {color.name}
            </span>{" "}
            — e.g. L×3, XL×10, 2XL×15.
          </p>
          <div className="mt-3 space-y-2.5">
            {productSizes.map((s) => {
              const value = colorQty[s] ?? 0;
              const chest = sizeGuideMap[s];
              return (
                <div key={s} className="flex items-center justify-between">
                  <span
                    className={`min-w-28 rounded-lg border px-3 sm:px-4 py-2.5 text-center text-sm font-semibold transition-all ${
                      value > 0
                        ? "border-ink bg-ink text-white shadow-xs"
                        : "border-line bg-white text-ink hover:border-ink/40"
                    }`}
                  >
                    <span>{s}</span>
                    {chest && (
                      <span className={`ml-1.5 text-xs font-normal ${value > 0 ? "text-white/80" : "text-body"}`}>
                        ({chest})
                      </span>
                    )}
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

        {/* Customization section (only displayed when Customized is chosen) */}
        {apparelType === "custom" && (
          <div
            id="customization-section"
            className="mt-6 rounded-2xl border border-accent/40 bg-accent-soft/30 p-4 sm:p-5 space-y-4 animate-in fade-in duration-200"
          >
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink">
                <span className="flex h-5 w-5 items-center justify-center bg-accent text-[11px] font-bold text-white">
                  3
                </span>
                Customization ({customizedApparelName})
              </p>
              <button
                type="button"
                onClick={() => setApparelType("blank")}
                className="text-xs font-semibold text-accent hover:underline inline-flex items-center gap-1"
              >
                <span>Switch to Plain Apparel</span>
                <X size={14} />
              </button>
            </div>

            {/* Approval assurance notice */}
            <div className="flex items-start gap-2.5 rounded-lg bg-white p-3 text-xs text-ink border border-line">
              <BadgeCheck size={16} className="text-accent shrink-0 mt-0.5" />
              <span className="leading-relaxed">
                <strong>Digital Mockup Approval:</strong> We send a digital mockup on WhatsApp for your sign-off before printing.
              </span>
            </div>

            {/* Upload Logo or Design */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1.5">
                Upload Logo or Artwork (Optional)
              </label>
              {logoPreview ? (
                <div className="flex items-center gap-3 rounded-xl border border-accent bg-accent-soft/50 p-3 pr-4">
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
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    onLogoChange(e.dataTransfer.files?.[0]);
                  }}
                  className="group flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed border-ink/20 bg-white px-5 py-5 transition-colors hover:border-accent hover:bg-accent-soft/30"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-accent shadow-xs transition-transform group-hover:-translate-y-0.5">
                    <CloudUpload size={18} />
                  </span>
                  <span className="text-sm font-bold text-ink">
                    Drop your logo here or{" "}
                    <span className="text-accent underline underline-offset-2">
                      browse files
                    </span>
                  </span>
                  <span className="text-[11px] text-body">
                    PNG, JPG, SVG, PDF, AI, EPS — high resolution
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

            {/* Print text */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink mb-1">
                {logoName ? "Printing Instructions / Placement Notes" : "Or Custom Text to Print Instead"}
              </label>
              <input
                value={printText}
                onChange={(e) => setPrintText(e.target.value)}
                placeholder={
                  logoName
                    ? 'e.g. "Print logo on left chest, 3.5 inches wide"'
                    : 'e.g. "Team Phoenix — Est. 2026"'
                }
                className="w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-ink placeholder:text-body/50 focus:border-ink focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Step Review & Add */}
        <div className="mt-7 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink">
              <span className="flex h-5 w-5 items-center justify-center bg-accent text-[11px] font-bold text-white">
                {apparelType === "custom" ? "4" : "3"}
              </span>
              Review & Add
            </p>
            {/* Add Customization navigation option above right top of Select sizes to add button */}
            <button
              type="button"
              id="add-customization-nav-btn"
              onClick={() => {
                const nextType = apparelType === "custom" ? "blank" : "custom";
                setApparelType(nextType);
                if (nextType === "custom") {
                  setTimeout(() => {
                    document
                      .getElementById("customization-section")
                      ?.scrollIntoView({ behavior: "smooth", block: "center" });
                  }, 50);
                }
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-accent hover:text-accent-dark hover:underline transition-colors cursor-pointer"
            >
              <Sparkles size={14} className="text-accent shrink-0" />
              <span>
                {apparelType === "custom"
                  ? "Customization Added (Switch to Plain)"
                  : "+ Add Customization"}
              </span>
              <ArrowRight size={13} className="shrink-0" />
            </button>
          </div>
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

      {/* Size Chart Popup Modal: Size Chart Image with Close Option Only */}
      {sizeChartOpen && sizeChartImg && (
        <div
          id="size-chart-modal"
          role="dialog"
          aria-modal="true"
          aria-label={`${product.name} Size Chart`}
          onClick={() => setSizeChartOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative flex items-center justify-center max-h-[94vh] max-w-[95vw] sm:max-w-2xl md:max-w-3xl lg:max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl animate-in zoom-in-95 duration-200"
          >
            {/* Close Option Only */}
            <button
              type="button"
              onClick={() => setSizeChartOpen(false)}
              className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 z-20 flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-black/75 text-white backdrop-blur-sm shadow-lg transition hover:scale-110 hover:bg-black focus:outline-none"
              aria-label="Close size chart"
            >
              <X size={20} />
            </button>

            {/* Size Chart Image */}
            <div className="overflow-auto max-h-[94vh] p-2 sm:p-3 flex items-center justify-center">
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
                className="max-h-[90vh] w-auto max-w-full object-contain rounded-xl mx-auto"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
