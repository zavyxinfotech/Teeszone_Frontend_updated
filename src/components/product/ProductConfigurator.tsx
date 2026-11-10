"use client"; // TeesZone Product Configurator

import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  BadgeCheck,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CloudUpload,
  Download,
  ExternalLink,
  Heart,
  Loader2,
  Minus,
  Pencil,
  Plus,
  Ruler,
  ShoppingBag,
  Sparkles,
  Star,
  Trash2,
  X,
} from "lucide-react";
import type { Product } from "@/lib/types";
import { useCart } from "@/lib/cart";
import { useWishlist } from "@/lib/wishlist";
import { useAuth } from "@/lib/auth";
import { reviews as defaultReviews } from "@/data/reviews";
import { TEESZONE_GOOGLE_REVIEWS_URL } from "@/data/ratings";
import type { Review } from "@/lib/types";
import { BrandDesignerModal } from "./BrandDesignerModal";
import {
  DesignStudioModal,
  CustomDesignResult,
} from "./design-studio/DesignStudioModal";
import { generateAndDownloadBrandedMockup } from "@/lib/mockupDownload";

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


export interface QuantityPriceTier {
  minQty: number;
  maxQty: number | null;
  label: string;
  offPct: number;
  tag: string;
}

export const PRICE_TIERS: QuantityPriceTier[] = [
  { minQty: 2, maxQty: 2, label: "2 pcs", offPct: 0, tag: "Base" },
  { minQty: 3, maxQty: 5, label: "3–5 pcs", offPct: 12, tag: "12% less" },
  { minQty: 6, maxQty: 10, label: "6–10 pcs", offPct: 24, tag: "24% less" },
  { minQty: 11, maxQty: 14, label: "11–14 pcs", offPct: 27, tag: "27% less" },
  { minQty: 15, maxQty: 19, label: "15–19 pcs", offPct: 28, tag: "28% less" },
  { minQty: 20, maxQty: 29, label: "20–29 pcs", offPct: 32, tag: "32% less" },
  { minQty: 30, maxQty: 49, label: "30–49 pcs", offPct: 35, tag: "35% less" },
  { minQty: 50, maxQty: 75, label: "50–75 pcs", offPct: 39, tag: "39% less" },
  { minQty: 76, maxQty: 100, label: "76–100 pcs", offPct: 43, tag: "43% less" },
];

export function ProductConfigurator({
  product,
  initialReviews,
}: {
  product: Product;
  initialReviews?: Review[];
}) {
  const reviewsList = initialReviews && initialReviews.length > 0 ? initialReviews : defaultReviews;
  const deliveredOrdersCount = 500;
  const { sizes: productSizes, sizeGuide: sizeGuideMap } = useMemo(
    () => getProductSizeConfig(product),
    [product]
  );
  const [colorIdx, setColorIdx] = useState(0);
  const [sizeChartOpen, setSizeChartOpen] = useState(false);
  const [customizerOpen, setCustomizerOpen] = useState(false);
  const [brandDesignerOpen, setBrandDesignerOpen] = useState(false);
  const [studioOpen, setStudioOpen] = useState(false);
  const [savedCustomDesign, setSavedCustomDesign] = useState<CustomDesignResult | null>(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem(`teeszone_custom_design_${product.slug}`);
        if (raw) return JSON.parse(raw);
      } catch { }
    }
    return null;
  });

  const [flyingParticles, setFlyingParticles] = useState<
    Array<{ id: number; startX: number; startY: number; dx: number; dy: number }>
  >([]);
  const [pulsingColor, setPulsingColor] = useState<string | null>(null);
  // size split per color: color -> size -> qty
  const [qty, setQty] = useState<Record<string, Record<string, number>>>({});
  const [printText, setPrintText] = useState("");
  const [logoName, setLogoName] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const clearCustomDesign = useCallback(() => {
    setSavedCustomDesign(null);
    setLogoPreview(null);
    setLogoName(null);
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(`teeszone_custom_design_${product.slug}`);
      } catch { }
    }
  }, [product.slug, setSavedCustomDesign, setLogoPreview, setLogoName]);
  const [justAdded, setJustAdded] = useState(false);
  const [isDownloadingMockup, setIsDownloadingMockup] = useState(false);
  const [downloadSuccessToast, setDownloadSuccessToast] = useState(false);

  const handleDownloadMockup = async () => {
    setIsDownloadingMockup(true);
    try {
      const frontSrc =
        savedCustomDesign?.frontPreviewUrl ||
        color.image ||
        "/products/polo-black-front-3d.png";

      const backSrc =
        savedCustomDesign?.backPreviewUrl ||
        color.backImage ||
        color.image4 ||
        "/products/polo-black-back-3d.png";

      await generateAndDownloadBrandedMockup({
        productName: product.name,
        frontImageUrl: frontSrc,
        backImageUrl: backSrc,
        colorName: savedCustomDesign?.colorName || color.name,
        companyName: savedCustomDesign?.companyName,
      });

      setDownloadSuccessToast(true);
      setTimeout(() => setDownloadSuccessToast(false), 3000);
    } catch {
      alert("Could not generate mockup. Please try again.");
    } finally {
      setIsDownloadingMockup(false);
    }
  };
  const fileRef = useRef<HTMLInputElement>(null);
  const reviewsRef = useRef<HTMLDivElement>(null);
  const { addItems } = useCart();
  const { has: hasWishlist, toggle: toggleWishlist } = useWishlist();
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const saved = hasWishlist(product.slug);

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isGalleryHovered, setIsGalleryHovered] = useState(false);
  const color = product.colors[colorIdx];
  const thumbnailItemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Compute all available images for auto-scrolling
  const displayImages = useMemo(() => {
    // If customized, showcase customized front and back previews first
    if (savedCustomDesign?.frontPreviewUrl) {
      const customImgs = [savedCustomDesign.frontPreviewUrl];
      if (savedCustomDesign.backPreviewUrl) {
        customImgs.push(savedCustomDesign.backPreviewUrl);
      }
      return customImgs;
    }

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
  }, [color, product.colors, savedCustomDesign]);

  // 3-second auto-scroll interval (pauses when user hovers gallery)
  useEffect(() => {
    if (displayImages.length <= 1 || isGalleryHovered) return;

    const timer = setInterval(() => {
      setActiveImageIdx((prev) => (prev + 1) % displayImages.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [displayImages.length, isGalleryHovered]);

  // Keep active thumbnail scrolled into view within its thumbnail container only (never scroll the window)
  useEffect(() => {
    const el = thumbnailItemRefs.current[activeImageIdx];
    const container = el?.parentElement;
    if (el && container) {
      const top = el.offsetTop - container.offsetHeight / 2 + el.offsetHeight / 2;
      container.scrollTo({ top, behavior: "smooth" });
    }
  }, [activeImageIdx]);

  const colorTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    for (const [colorName, sizes] of Object.entries(qty)) {
      const sum = Object.values(sizes).reduce((a, b) => a + b, 0);
      if (sum > 0) totals[colorName] = sum;
    }
    return totals;
  }, [qty]);

  // Total allocated quantity across all colors and sizes
  const totalQty = useMemo(
    () => Object.values(colorTotals).reduce((a, b) => a + b, 0),
    [colorTotals],
  );

  const [sizeError, setSizeError] = useState<string | null>(null);

  // 4-Tier Pricing Structure matching product details design (MOQ: 5 pcs)
  const pricingTiers = useMemo(() => {
    const p4 = product.price;
    const p1 = Math.max(p4, Math.round(product.mrp * 0.93));
    const p2 = Math.max(p4, Math.round(product.mrp * 0.82));
    const p3 = Math.max(p4, Math.round(product.mrp * 0.70));

    return [
      { range: "5–9 pcs", minQty: 5, maxQty: 9, pricePerPc: p1, totalText: `₹${(p1 * 5).toLocaleString("en-IN")}+` },
      { range: "10–49 pcs", minQty: 10, maxQty: 49, pricePerPc: p2, totalText: `₹${(p2 * 10).toLocaleString("en-IN")}+` },
      { range: "50–99 pcs", minQty: 50, maxQty: 99, pricePerPc: p3, totalText: `₹${(p3 * 50).toLocaleString("en-IN")}+` },
      { range: "100+ pcs", minQty: 100, maxQty: null, pricePerPc: p4, totalText: `₹${(p4 * 100).toLocaleString("en-IN")}+` },
    ];
  }, [product.price, product.mrp]);

  const activeUnitPrice = useMemo(() => {
    const qtyCount = totalQty || 5;
    if (qtyCount >= 100) return pricingTiers[3].pricePerPc;
    if (qtyCount >= 50) return pricingTiers[2].pricePerPc;
    if (qtyCount >= 10) return pricingTiers[1].pricePerPc;
    return pricingTiers[0].pricePerPc;
  }, [pricingTiers, totalQty]);

  const setSizeQty = (size: string, value: number) => {
    if (sizeError) setSizeError(null);
    setQty((q) => ({
      ...q,
      [color.name]: {
        ...(q[color.name] ?? {}),
        [size]: Math.max(0, Math.min(9999, value)),
      },
    }));
  };

  const triggerSwatchPulse = (colorName: string) => {
    setPulsingColor(colorName);
    setTimeout(() => {
      setPulsingColor((curr) => (curr === colorName ? null : curr));
    }, 450);
  };

  const handleIncreaseQty = (
    s: string,
    currentValue: number,
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    setSizeQty(s, currentValue + 1);

    const safeColorId = `color-swatch-${color.name.replace(/\s+/g, "-")}`;
    const targetEl = document.getElementById(safeColorId);
    if (targetEl) {
      const targetRect = targetEl.getBoundingClientRect();
      const btnRect = e.currentTarget.getBoundingClientRect();
      const startX = btnRect.left + btnRect.width / 2;
      const startY = btnRect.top + btnRect.height / 2;
      const dx = targetRect.left + targetRect.width / 2 - startX;
      const dy = targetRect.top + targetRect.height / 2 - startY;

      const particleId = Date.now() + Math.random();
      setFlyingParticles((prev) => [
        ...prev,
        { id: particleId, startX, startY, dx, dy },
      ]);

      setTimeout(() => {
        triggerSwatchPulse(color.name);
        setFlyingParticles((prev) => prev.filter((p) => p.id !== particleId));
      }, 500);
    } else {
      triggerSwatchPulse(color.name);
    }
  };

  const handleSwatchClick = (idx: number) => {
    setColorIdx(idx);
    setActiveImageIdx(0);
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

  const handleQuickPreset = (count: number) => {
    const currentSizes = productSizes.length > 0 ? productSizes : ["S", "M", "L", "XL", "2XL"];
    const newSizesQty: Record<string, number> = {};
    const base = Math.floor(count / currentSizes.length);
    let rem = count % currentSizes.length;
    currentSizes.forEach((s) => {
      let allocated = base;
      if (rem > 0) {
        allocated += 1;
        rem -= 1;
      }
      newSizesQty[s] = allocated;
    });
    setQty((q) => ({
      ...q,
      [color.name]: newSizesQty,
    }));
  };

  const handleClearColorQty = () => {
    setQty((q) => {
      const next = { ...q };
      delete next[color.name];
      return next;
    });
  };

  const colorsWithQty = Object.keys(colorTotals);

  // branding note (logo filename or print text) goes in as the cart note
  const handleAddToCart = () => {
    if (!user) {
      router.push(`/login?next=${encodeURIComponent(pathname || `/products/${product.slug}`)}`);
      return;
    }
    if (totalQty < 5) {
      setSizeError("Minimum order quantity is 5 pcs. Please select at least 5 pcs across sizes.");
      setCustomizerOpen(true);
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
            name: savedCustomDesign ? `Customized ${product.name}` : product.name,
            image: savedCustomDesign?.frontPreviewUrl || swatch.image,
            colorName: cn,
            colorHex: swatch.hex,
            size: s,
            qty: n,
          });
      }
    }
    if (lines.length === 0) {
      setCustomizerOpen(true);
      return;
    }
    const isCustomized = Boolean(savedCustomDesign || logoName || printText);
    const note = savedCustomDesign
      ? `Customized: ${savedCustomDesign.companyName || product.name} | Front: ${savedCustomDesign.frontPositionPreset} | Back: ${savedCustomDesign.backPositionPreset} | Color: ${savedCustomDesign.colorName}`
      : isCustomized
        ? logoName
          ? `Customized — Logo: ${logoName} (will share on WhatsApp)`
          : printText
            ? `Customized — Print text: "${printText}"`
            : "Customized Apparel"
        : undefined;
    addItems(lines, note || undefined);
    setJustAdded(true);
    setCustomizerOpen(false);
  };

  const handleBuyNow = () => {
    if (!user) {
      router.push(`/login?next=${encodeURIComponent(pathname || `/products/${product.slug}`)}`);
      return;
    }
    if (totalQty < 5) {
      handleQuickPreset(5);
    }
    handleAddToCart();
    router.push("/cart");
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
    const url = product.sizeChartImage;
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
    <div className="relative grid gap-8 lg:gap-10 lg:grid-cols-2 min-w-0 w-full max-w-full">
      {/* Gallery - Sticky on desktop view */}
      <div
        className="min-w-0 w-full lg:sticky lg:top-20 self-start"
        onMouseEnter={() => setIsGalleryHovered(true)}
        onMouseLeave={() => setIsGalleryHovered(false)}
      >
        {(() => {
          const currentMainImage = displayImages[activeImageIdx] || color.image;
          const isSvg = typeof currentMainImage === "string" && currentMainImage.toLowerCase().endsWith(".svg");

          return (
            <div className="flex items-start gap-2 sm:gap-3 lg:gap-3.5 w-full">
              {/* Main Product Image Container - Reduced width & height (4:5 ratio) */}
              <div className="group relative flex-1 aspect-[4/5] min-w-0 overflow-hidden rounded-xl border border-line bg-surface">
                <Image
                  src={currentMainImage}
                  alt={`${product.name} — ${color.name} (Angle ${activeImageIdx + 1})`}
                  fill
                  priority
                  sizes="(max-width: 640px) 75vw, 42vw"
                  className={`transition-all duration-500 ease-in-out ${isSvg ? "object-contain p-4 sm:p-6" : "object-cover object-top"
                    }`}
                />

                {/* Download Mockup Floating Icon Button with Tooltip */}
                <button
                  type="button"
                  onClick={handleDownloadMockup}
                  disabled={isDownloadingMockup}
                  title="Download Mockup"
                  aria-label="Download Mockup"
                  className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-30 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-white/95 text-[#80011F] hover:bg-[#80011F] hover:text-white shadow-md border border-rose-100 transition-all hover:scale-110 cursor-pointer disabled:opacity-50 group/download"
                >
                  {isDownloadingMockup ? (
                    <Loader2 size={16} className="animate-spin text-[#80011F]" />
                  ) : (
                    <Download size={16} className="transition-transform group-hover/download:-translate-y-0.5" />
                  )}
                  {/* Tooltip */}
                  <span className="pointer-events-none absolute -bottom-7 right-0 whitespace-nowrap rounded-md bg-gray-900 px-2 py-0.5 text-[10px] font-bold text-white opacity-0 transition-opacity group-hover/download:opacity-100 shadow-sm z-40">
                    Download Mockup
                  </span>
                </button>

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
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-white/90 text-ink shadow-md backdrop-blur-xs transition hover:bg-white hover:scale-105 opacity-0 group-hover:opacity-100 sm:opacity-75 focus:opacity-100"
                    >
                      <ChevronLeft size={18} className="sm:w-5 sm:h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImageIdx((prev) => (prev + 1) % displayImages.length);
                      }}
                      aria-label="Next photo"
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-white/90 text-ink shadow-md backdrop-blur-xs transition hover:bg-white hover:scale-105 opacity-0 group-hover:opacity-100 sm:opacity-75 focus:opacity-100"
                    >
                      <ChevronRight size={18} className="sm:w-5 sm:h-5" />
                    </button>

                    {/* Image index counter badge */}
                    <div className="absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 rounded-full bg-black/60 px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-[11px] font-semibold text-white backdrop-blur-xs">
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

              {/* Reference / Thumbnail images aligned to the right side of main image in a single column */}
              {displayImages.length > 1 && (
                <div className="flex flex-col gap-1.5 sm:gap-2 shrink-0 w-[54px] sm:w-[68px] md:w-[74px] lg:w-[80px] max-h-[360px] sm:max-h-[460px] lg:max-h-[530px] overflow-y-auto rail scrollbar-none py-0.5">
                  {displayImages.map((imgSrc, idx) => {
                    const isActive = idx === activeImageIdx;
                    const thumbIsSvg = typeof imgSrc === "string" && imgSrc.toLowerCase().endsWith(".svg");
                    return (
                      <button
                        key={idx}
                        ref={(el) => {
                          thumbnailItemRefs.current[idx] = el;
                        }}
                        type="button"
                        onClick={() => setActiveImageIdx(idx)}
                        aria-label={`View photo ${idx + 1}`}
                        className={`group relative aspect-square w-full shrink-0 overflow-hidden rounded-lg border-2 bg-surface transition-all ${isActive
                          ? "border-accent ring-2 ring-accent/30 shadow-xs scale-[1.02]"
                          : "border-line opacity-75 hover:opacity-100 hover:border-ink/40"
                          }`}
                      >
                        <Image
                          src={imgSrc}
                          alt={`${product.name} view ${idx + 1}`}
                          fill
                          sizes="80px"
                          className={`h-full w-full transition-transform group-hover:scale-105 ${thumbIsSvg ? "object-contain p-1" : "object-cover object-top"
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
            </div>
          );
        })()}
      </div>

      {/* Buy box */}
      <div className="min-w-0 w-full max-w-full">
        <p className="text-[11px] uppercase tracking-wider text-body">TeesZone</p>
        <div className="mt-1 flex items-start justify-between gap-3 sm:gap-4">
          <h1 className="line-clamp-3 text-base sm:text-lg lg:text-xl font-medium sm:font-semibold leading-snug text-ink">
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
          <a
            href={TEESZONE_GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 group/rev hover:opacity-90 transition-opacity cursor-pointer"
            title="Read TeesZone 5.0 Star Google Ratings"
          >
            <div className="flex items-center text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} className="fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-base sm:text-lg font-bold text-ink">5.0</span>
            <span className="text-sm sm:text-base font-semibold text-body group-hover/rev:text-[#80011F] group-hover/rev:underline">
              Google Ratings
            </span>
          </a>

          <div className="mt-1 flex items-center justify-between gap-2 flex-wrap">
            <p className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-emerald-700">
              <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
              <span>{deliveredOrdersCount}+ orders delivered</span>
            </p>
          </div>
        </div>

        {/* Price Range & MOQ Header (Matches Product Details Design) */}
        <div className="mt-4 flex flex-wrap items-center gap-2 sm:gap-3">
          <span className="text-2xl sm:text-3xl font-extrabold text-accent tracking-tight">
            ₹{pricingTiers[3].pricePerPc} – ₹{pricingTiers[0].pricePerPc}
          </span>
          <span className="text-xs sm:text-sm text-body font-medium">per piece</span>
          <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-0.5 text-xs font-bold text-slate-700 border border-slate-200">
            MOQ: 5 pcs
          </span>
        </div>

        {/* Choose Colors */}
        <div id="section-choose-colors" className="mt-5">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink">
            Choose Colors
            <span className="normal-case font-medium text-body">
              — {color.name}
            </span>
          </p>
          <div className="mt-2.5 flex flex-wrap gap-2.5">
            {product.colors.map((c, i) => {
              const isCurrentlyActive = i === colorIdx;
              const isPulsing = pulsingColor === c.name;
              return (
                <button
                  key={c.name}
                  id={`color-swatch-${c.name.replace(/\s+/g, "-")}`}
                  onClick={() => handleSwatchClick(i)}
                  title={c.name}
                  aria-label={`Select ${c.name}`}
                  className={`relative flex h-9 sm:h-10 w-9 sm:w-10 items-center justify-center rounded-full border transition-all duration-300 hover:scale-110 cursor-pointer ${isCurrentlyActive
                    ? "border-ink ring-2 ring-ink ring-offset-2 shadow-sm"
                    : "border-ink/20 opacity-80 hover:opacity-100"
                    } ${isPulsing ? "scale-115 ring-4 ring-accent/50" : ""}`}
                  style={{ backgroundColor: c.hex }}
                >
                  {isCurrentlyActive && (
                    <Check
                      size={15}
                      className={`stroke-[2.5] ${LIGHT_HEXES.has(c.hex) ? "text-ink" : "text-white"}`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quantity & Tiered Pricing Section (Card layout matching reference specification) */}
        <div className="mt-5">
          {/* Desktop Layout: 4 Horizontal Cards Side-by-Side */}
          <div className="hidden sm:grid sm:grid-cols-4 sm:gap-2.5 lg:gap-3">
            {pricingTiers.map((t) => (
              <div
                key={t.range}
                className="group/tier rounded-2xl bg-slate-50/80 p-3.5 lg:p-4 text-center transition-colors duration-200 hover:bg-slate-100/70"
              >
                <div className="text-xs lg:text-sm font-bold text-gray-900 tracking-tight">
                  {t.range}
                </div>
                <div className="my-2.5">
                  <span className="text-2xl lg:text-3xl font-black text-[#80011F] tracking-tight transition-transform duration-200 group-hover/tier:scale-105 inline-block">
                    ₹{t.pricePerPc}
                  </span>
                  <span className="block text-[11px] font-medium text-gray-500">
                    / piece
                  </span>
                </div>
                <div className="pt-1 text-[11px] lg:text-xs font-medium text-gray-600">
                  <span className="text-gray-400">Total </span>
                  <span className="font-semibold text-gray-700">{t.totalText}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Layout: 4 Compact Stacked Vertical Cards */}
          <div className="flex flex-col gap-2 sm:hidden">
            {pricingTiers.map((t) => (
              <div
                key={t.range}
                className="flex items-center justify-between rounded-xl bg-slate-50/80 px-4 py-3 transition-colors active:bg-slate-100/80"
              >
                <div>
                  <div className="text-xs font-bold text-gray-900">
                    {t.range}
                  </div>
                  <div className="mt-0.5 flex items-baseline gap-1">
                    <span className="text-lg font-black text-[#80011F]">
                      ₹{t.pricePerPc}
                    </span>
                    <span className="text-[11px] font-medium text-gray-500">
                      / piece
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="block text-[10px] font-medium uppercase tracking-wider text-gray-400">
                    Total
                  </span>
                  <span className="text-xs font-bold text-gray-800">
                    {t.totalText}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Terms Banner (Matches Product Details Design) */}
        <div className="mt-3.5 rounded-xl border border-emerald-200/80 bg-emerald-50/80 px-4 py-3 text-center text-xs sm:text-sm text-emerald-900">
          You can pay only <strong className="font-bold text-emerald-950">30%</strong> now, rest{" "}
          <strong className="font-bold text-emerald-950">70% COD</strong>
        </div>

        {/* ======================================================== */}
        {/* YOUR CUSTOMISED DESIGN CARD (Section 11 & Screen 6/7)    */}
        {/* ======================================================== */}
        {savedCustomDesign ? (
          <div className="mt-5 rounded-2xl border-2 border-[#80011F] bg-gradient-to-b from-[#FFFDFE] to-[#FFF8F9] p-4 sm:p-5 shadow-md animate-in fade-in duration-300">
            <div className="flex items-center justify-between border-b border-rose-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#80011F] text-white shadow-xs">
                  <Sparkles size={14} className="stroke-[2.5]" />
                </span>
                <span className="text-xs font-black uppercase tracking-wider text-[#80011F]">
                  Your Customised Design
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadMockup}
                  disabled={isDownloadingMockup}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-rose-50 hover:bg-[#80011F] text-[#80011F] hover:text-white border border-rose-200/90 px-2.5 py-1 text-xs font-bold transition-all cursor-pointer shadow-2xs group/btn"
                  title="Download Mockup"
                >
                  {isDownloadingMockup ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <Download size={13} className="transition-transform group-hover/btn:-translate-y-0.5" />
                  )}
                  <span>Download Mockup</span>
                </button>
                <button
                  type="button"
                  onClick={clearCustomDesign}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 hover:text-red-600 transition-colors cursor-pointer ml-1 py-1 px-2 rounded-lg hover:bg-rose-50"
                  title="Remove Customization and return to design options"
                >
                  <Trash2 size={13} />
                  <span>Remove Customization</span>
                </button>
              </div>
            </div>

            {/* Dual Front & Back Previews */}
            <div className="mt-3.5 grid grid-cols-2 gap-3">
              <div className="relative aspect-square rounded-xl bg-white border border-rose-100 p-2 flex flex-col items-center justify-center shadow-xs overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={savedCustomDesign.frontPreviewUrl}
                  alt="Customized Front"
                  className="max-h-full max-w-full object-contain filter drop-shadow-sm"
                />
                <span className="absolute bottom-1.5 left-2 rounded-md bg-white/95 border border-rose-100 px-2 py-0.5 text-[10px] font-bold text-gray-700 shadow-xs">
                  Front View
                </span>
              </div>

              <div className="relative aspect-square rounded-xl bg-white border border-rose-100 p-2 flex flex-col items-center justify-center shadow-xs overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={savedCustomDesign.backPreviewUrl || savedCustomDesign.frontPreviewUrl}
                  alt="Customized Back"
                  className="max-h-full max-w-full object-contain filter drop-shadow-sm"
                />
                <span className="absolute bottom-1.5 left-2 rounded-md bg-white/95 border border-rose-100 px-2 py-0.5 text-[10px] font-bold text-gray-700 shadow-xs">
                  Back View
                </span>
              </div>
            </div>

            {/* Customization Details Table */}
            <div className="mt-3.5 rounded-xl bg-white border border-rose-100 p-3 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 font-medium">Colour:</span>
                <span className="flex items-center gap-1.5 font-bold text-gray-900">
                  <span
                    className="inline-block h-3 w-3 rounded-full border border-black/10"
                    style={{ backgroundColor: savedCustomDesign.colorHex }}
                  />
                  {savedCustomDesign.colorName}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 font-medium">Print Position:</span>
                <span className="font-bold text-[#80011F]">
                  {savedCustomDesign.frontPositionPreset}
                  {savedCustomDesign.backPositionPreset !== "None" ? ` + ${savedCustomDesign.backPositionPreset}` : ""}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 font-medium">Total Quantity:</span>
                <span className="font-bold text-gray-900">{totalQty > 0 ? `${totalQty} pcs` : "5 pcs minimum"}</span>
              </div>
            </div>

            {/* Action Buttons: [ Customize Again ] & [ Add to Cart ] & [ Buy Now ] */}
            <div className="mt-4 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setStudioOpen(true)}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#80011F] hover:bg-[#680119] py-3 text-sm font-bold text-white shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <Pencil size={15} />
                <span>Customize Again</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 py-2.5 text-xs sm:text-sm font-bold text-gray-800 shadow-xs cursor-pointer"
                >
                  <ShoppingBag size={15} />
                  <span>Add to Cart</span>
                </button>
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#231F20] hover:bg-black py-2.5 text-xs sm:text-sm font-bold text-white shadow-xs cursor-pointer"
                >
                  <span>Buy Now</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Primary CTA Button when not yet customized */
          <>
            <button
              type="button"
              onClick={() => setStudioOpen(true)}
              className="mt-4 w-full flex items-center justify-center gap-2.5 rounded-2xl bg-[#80011F] hover:bg-[#680119] px-6 py-4 text-base sm:text-lg font-bold text-white shadow-md hover:shadow-xl transition-all cursor-pointer group"
            >
              <Sparkles size={20} className="stroke-[2.2] text-rose-200 transition-transform group-hover:rotate-12" />
              <span>Design Your T-Shirt</span>
            </button>

            {/* Customize Logo & Color Action Secondary Button */}
            <button
              type="button"
              onClick={() => setCustomizerOpen(true)}
              className="mt-2.5 w-full flex items-center justify-center gap-2 rounded-xl border border-line bg-surface/60 hover:bg-surface px-4 py-2.5 text-xs sm:text-sm font-semibold text-ink transition-all cursor-pointer"
            >
              <Pencil size={15} />
              <span>Add Custom Text / Embroidery Notes</span>
            </button>
          </>
        )}

        {/* Direct Add to Cart when sizes are configured */}
        {totalQty >= 5 && (
          <button
            type="button"
            onClick={handleAddToCart}
            className="mt-3 w-full flex items-center justify-center gap-2.5 rounded-2xl bg-ink px-6 py-3.5 text-sm sm:text-base font-bold text-white shadow-md hover:bg-accent hover:shadow-lg transition-all cursor-pointer"
          >
            <ShoppingBag size={18} />
            <span>
              Add {totalQty} pcs to Cart (₹{(activeUnitPrice * totalQty).toLocaleString("en-IN")})
            </span>
          </button>
        )}

        {justAdded && (
          <Link
            href="/cart"
            className="mt-2.5 flex items-center justify-center gap-2 rounded-xl border border-whatsapp bg-whatsapp/10 px-6 py-3 text-sm font-bold uppercase tracking-wider text-whatsapp-dark transition-colors hover:bg-whatsapp hover:text-white"
          >
            <BadgeCheck size={18} />
            <span>Added to Cart — View Cart &amp; Checkout</span>
          </Link>
        )}

        <p className="mt-3.5 flex items-center justify-center gap-1.5 text-center text-xs text-body">
          <Sparkles size={13} className="text-accent" />
          Free design support · Mockup before production · Pan-India delivery
        </p>

        {/* Customer Reviews Section */}
        <div className="mt-8">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <a
                href={TEESZONE_GOOGLE_REVIEWS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 group/rev hover:opacity-90 transition-opacity"
                title="View Google Reviews for TeesZone"
              >
                <span className="text-3xl sm:text-4xl font-extrabold text-ink">5.0</span>
                <div>
                  <div className="flex items-center gap-0.5 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="mt-0.5 text-sm font-semibold text-body group-hover/rev:text-[#80011F] group-hover/rev:underline">
                    Google Ratings
                  </p>
                </div>
              </a>
              <p className="mt-1 flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-emerald-700">
                <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                <span>{deliveredOrdersCount}+ orders delivered</span>
              </p>
            </div>
            <a
              href={TEESZONE_GOOGLE_REVIEWS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-full border border-line px-3.5 py-1 text-xs font-semibold text-ink transition-colors hover:border-[#80011F] hover:text-[#80011F]"
              title="View all Google Ratings"
            >
              <span>See Google Ratings</span>
              <ExternalLink size={12} />
            </a>
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
              est. ₹ {(activeUnitPrice * totalQty).toLocaleString("en-IN")} @ ₹
              {activeUnitPrice}/pc
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
          className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
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
              {/* eslint-disable-next-line @next/next/no-img-element */}
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

      {/* Hidden file input for logo / artwork upload */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*,.pdf,.ai,.eps"
        className="hidden"
        onChange={(e) => onLogoChange(e.target.files?.[0])}
      />

      {/* Customize Logo & Color Popup Modal */}
      {customizerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Customize Logo & Color"
          onClick={() => setCustomizerOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-5 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative flex flex-col w-full h-full sm:h-auto sm:max-h-[94vh] sm:max-w-4xl md:max-w-5xl sm:rounded-2xl rounded-none bg-white shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-line px-5 py-4 bg-surface/50">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-soft text-accent">
                  <Pencil size={18} className="stroke-[2.5]" />
                </span>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-ink">
                    Customize Logo, Color &amp; Sizes
                  </h3>
                  <p className="text-xs text-body line-clamp-1">{product.name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCustomizerOpen(false)}
                className="rounded-full p-2 text-body hover:bg-white hover:text-ink transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
              {/* Step 1: Color Selection */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-ink">
                    1. Select Color
                  </span>
                  <span className="text-xs font-semibold text-accent bg-accent-soft/50 px-2.5 py-0.5 rounded-full">
                    Active: {color.name}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                  {product.colors.map((c, idx) => {
                    const isSelected = colorIdx === idx;
                    return (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => {
                          setColorIdx(idx);
                          setActiveImageIdx(0);
                        }}
                        className={`group relative flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold transition-all cursor-pointer ${isSelected
                          ? "border-accent bg-accent-soft/30 text-ink ring-2 ring-accent/30 shadow-xs"
                          : "border-line bg-white text-ink/75 hover:border-ink/40"
                          }`}
                      >
                        <span
                          className="h-4 w-4 rounded-full border border-black/10 shrink-0"
                          style={{ backgroundColor: c.hex }}
                        />
                        <span>{c.name}</span>
                        {isSelected && <Check size={14} className="text-accent ml-0.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Sizes & Quantities */}
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-ink">
                      2. Sizes &amp; Quantities
                    </span>
                    <span className="ml-2 text-xs font-bold text-accent bg-accent-soft/40 px-2 py-0.5 rounded">
                      MOQ: 5 pcs
                    </span>
                  </div>
                  {showSizeGuide && (
                    <button
                      type="button"
                      onClick={() => setSizeChartOpen(true)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:underline cursor-pointer"
                    >
                      <Ruler size={14} />
                      <span>Size Guide</span>
                    </button>
                  )}
                </div>

                {/* Quick Presets */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="text-[11px] font-semibold text-body">Quick presets:</span>
                  {[5, 10, 25, 50].map((presetCount) => (
                    <button
                      key={presetCount}
                      type="button"
                      onClick={() => handleQuickPreset(presetCount)}
                      className="rounded-lg border border-line bg-surface/70 px-2.5 py-1 text-xs font-bold text-ink hover:border-accent hover:bg-accent-soft/40 hover:text-accent transition-colors cursor-pointer"
                    >
                      +{presetCount} pcs
                    </button>
                  ))}
                  {Object.values(qty[color.name] ?? {}).some((v) => v > 0) && (
                    <button
                      type="button"
                      onClick={handleClearColorQty}
                      className="rounded-lg border border-line bg-white px-2.5 py-1 text-xs font-semibold text-body hover:text-accent hover:bg-red-50 hover:border-red-200 transition-colors cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Size Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {productSizes.map((s) => {
                    const currentVal = qty[color.name]?.[s] ?? 0;
                    const guide = sizeGuideMap[s];
                    return (
                      <div
                        key={s}
                        className={`flex flex-col justify-between rounded-xl border p-3 transition-colors ${currentVal > 0
                          ? "border-accent bg-accent-soft/20 shadow-xs"
                          : "border-line bg-surface/30"
                          }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-extrabold text-ink">{s}</span>
                          {guide && (
                            <span className="text-[10px] font-medium text-body">
                              Chest {guide}
                            </span>
                          )}
                        </div>
                        <div className="mt-2.5 flex items-center justify-between gap-1.5 bg-white rounded-lg border border-line p-1">
                          <button
                            type="button"
                            onClick={() => setSizeQty(s, currentVal - 1)}
                            disabled={currentVal <= 0}
                            className="flex h-7 w-7 items-center justify-center rounded text-body hover:bg-surface hover:text-ink disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                            aria-label={`Decrease ${s}`}
                          >
                            <Minus size={14} />
                          </button>
                          <input
                            type="number"
                            min="0"
                            max="9999"
                            value={currentVal === 0 ? "" : currentVal}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10);
                              setSizeQty(s, isNaN(val) ? 0 : val);
                            }}
                            placeholder="0"
                            className="w-12 text-center text-sm font-bold text-ink focus:outline-hidden [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                          <button
                            type="button"
                            onClick={(e) => handleIncreaseQty(s, currentVal, e)}
                            className="flex h-7 w-7 items-center justify-center rounded text-body hover:bg-surface hover:text-ink cursor-pointer"
                            aria-label={`Increase ${s}`}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Validation / Status Bar */}
                <div className="mt-3">
                  {totalQty < 5 ? (
                    <div className="flex items-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-3.5 py-2.5 text-xs font-semibold text-amber-900">
                      <AlertCircle size={16} className="text-amber-700 shrink-0" />
                      <span>
                        Minimum 5 pieces required. Please allocate at least {5 - totalQty} more pc
                        {5 - totalQty > 1 ? "s" : ""} to add to cart.
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between rounded-xl border border-emerald-300 bg-emerald-50 px-3.5 py-2.5 text-xs font-semibold text-emerald-900">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 size={16} className="text-emerald-600" />
                        <span>{totalQty} pieces allocated across sizes</span>
                      </span>
                      <span className="font-bold text-emerald-950">
                        ₹{activeUnitPrice}/pc tier
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Step 3: Custom Logo / Artwork (Optional) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-ink">
                    3. Logo / Branding (Optional)
                  </span>
                  <span className="text-[11px] text-body">Leave blank for plain apparel</span>
                </div>
                <p className="text-xs text-body leading-relaxed mb-3">
                  If you upload a logo, this item will be treated as <strong>Customized Apparel</strong>.
                  If no logo is added, it will be processed as <strong>Blank Apparel</strong>.
                </p>

                {logoPreview ? (
                  <div className="flex items-center gap-3 rounded-xl border border-accent bg-accent-soft/40 p-3.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={logoPreview}
                      alt="Your logo preview"
                      className="h-16 w-16 rounded-lg border border-line bg-white object-contain p-1 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-ink">{logoName}</p>
                      <p className="mt-0.5 text-xs text-emerald-700 font-semibold">
                        Logo attached — Digital mockup will be shared before production
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        className="rounded-lg border border-line bg-white px-2.5 py-1.5 text-xs font-bold text-ink hover:bg-surface cursor-pointer"
                      >
                        Change
                      </button>
                      <button
                        type="button"
                        onClick={clearLogo}
                        aria-label="Remove logo"
                        className="rounded-lg p-1.5 text-body hover:bg-white hover:text-accent transition-colors cursor-pointer"
                      >
                        <X size={16} />
                      </button>
                    </div>
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
                    className="group flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed border-ink/20 bg-surface/50 px-5 py-6 transition-colors hover:border-accent hover:bg-accent-soft/30 cursor-pointer"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-accent shadow-xs transition-transform group-hover:-translate-y-0.5">
                      <CloudUpload size={22} />
                    </span>
                    <span className="text-sm font-bold text-ink">
                      Drop logo here or{" "}
                      <span className="text-accent underline underline-offset-2">browse files</span>
                    </span>
                    <span className="text-[11px] text-body">
                      PNG, JPG, SVG, PDF, AI, EPS — high resolution
                    </span>
                  </button>
                )}

                {/* Print instructions or custom text */}
                <div className="mt-3">
                  <label htmlFor="modal-print-text" className="block text-xs font-semibold text-ink mb-1">
                    Placement / Branding Notes (Optional)
                  </label>
                  <input
                    id="modal-print-text"
                    type="text"
                    value={printText}
                    onChange={(e) => setPrintText(e.target.value)}
                    placeholder="e.g. Left chest embroidery, 3-inch wide, back team name..."
                    className="w-full rounded-xl border border-line bg-surface/40 px-3.5 py-2.5 text-xs sm:text-sm text-ink placeholder:text-body/60 focus:border-accent focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            {/* Modal Sticky Footer */}
            <div className="border-t border-line bg-surface/50 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-base sm:text-lg font-extrabold text-ink">
                    ₹{(activeUnitPrice * (totalQty || 5)).toLocaleString("en-IN")}
                  </span>
                  <span className="text-xs font-semibold text-body">
                    ({totalQty || 5} pcs @ ₹{activeUnitPrice}/pc)
                  </span>
                </div>
                <p className="text-[11px] font-medium text-emerald-800">
                  Pay 30% (₹{Math.round(activeUnitPrice * (totalQty || 5) * 0.3).toLocaleString("en-IN")}) now · 70% COD
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setCustomizerOpen(false)}
                  className="rounded-xl border border-line bg-white px-4 py-2.5 text-xs sm:text-sm font-bold text-ink hover:bg-surface cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={totalQty < 5}
                  onClick={handleAddToCart}
                  className="flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-accent-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  <ShoppingBag size={16} />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Brand Designer Pop-up Page (Crop Modal) */}
      <BrandDesignerModal
        isOpen={brandDesignerOpen}
        onClose={() => setBrandDesignerOpen(false)}
        currentLogoUrl={logoPreview}
        currentLogoName={logoName}
        onApplyLogo={(newLogoUrl, newLogoName) => {
          setLogoPreview(newLogoUrl);
          setLogoName(newLogoName);
        }}
      />

      {/* Advanced T-Shirt Customisation Design Studio (7-Step Complete Studio) */}
      <DesignStudioModal
        isOpen={studioOpen}
        onClose={() => setStudioOpen(false)}
        product={product}
        initialColorIdx={colorIdx}
        initialCustomization={savedCustomDesign}
        onSaveCustomization={(result) => {
          setSavedCustomDesign(result);
          if (result.frontLogoUrl) {
            setLogoPreview(result.frontLogoUrl);
            setLogoName(result.companyName || "Custom Logo");
          }
          // Sync color with customizer
          const colorIndex = product.colors.findIndex((c) => c.name === result.colorName);
          if (colorIndex !== -1) {
            setColorIdx(colorIndex);
          }
          if (typeof window !== "undefined") {
            try {
              localStorage.setItem(`teeszone_custom_design_${product.slug}`, JSON.stringify(result));
            } catch { }
          }
        }}
      />

      {/* Minimal flying +1 particle overlay */}
      {flyingParticles.map((p) => (
        <div
          key={p.id}
          style={
            {
              position: "fixed",
              left: `${p.startX}px`,
              top: `${p.startY}px`,
              "--fly-x": `${p.dx}px`,
              "--fly-y": `${p.dy}px`,
              pointerEvents: "none",
              zIndex: 9999,
            } as React.CSSProperties
          }
          className="fly-to-swatch pointer-events-none flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-accent text-[11px] font-extrabold text-white shadow-lg"
        >
          +1
        </div>
      ))}

      {/* Mockup Download Success Toast */}
      {downloadSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl bg-[#231F20] text-white px-5 py-3 shadow-2xl border border-white/10 animate-in slide-in-from-bottom-5 duration-200">
          <CheckCircle2 size={18} className="text-emerald-400" />
          <span className="text-xs sm:text-sm font-bold">
            High-resolution mockup downloaded successfully!
          </span>
        </div>
      )}
    </div>
  );
}
