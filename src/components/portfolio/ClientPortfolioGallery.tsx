"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import initialClientsData from "@/data/portfolioClients.json";
import { ImageLightboxModal } from "./ImageLightboxModal";

export interface PortfolioClient {
  id: string;
  clientName: string;
  companyName: string;
  businessSector: string;
  category?: string;
  description: string;
  productDetails?: string;
  imageFileName?: string;
  localImageUrl?: string;
  webpUrl?: string;
  imageUrl?: string;
  s3Url?: string;
  displayOrder: number;
  isActive: boolean;
}

interface ClientPortfolioGalleryProps {
  title?: string;
  subtitle?: string;
}

export function ClientPortfolioGallery({
  title = "Delivered With Pride: Real Client Portfolio",
  subtitle = "Actual client photographs of customized T-shirts, corporate uniforms and institutional apparel manufactured and supplied factory-direct by TeesZone.",
}: ClientPortfolioGalleryProps) {
  const [clients, setClients] = useState<PortfolioClient[]>(
    initialClientsData as PortfolioClient[]
  );
  const [selectedImage, setSelectedImage] = useState<{
    url: string;
    alt: string;
  } | null>(null);
  const [activeTapId, setActiveTapId] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const isHoveredRef = useRef(false);
  const isTouchingRef = useRef(false);

  // Fetch updated clients from backend API if available
  useEffect(() => {
    let isMounted = true;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4010/api";
    fetch(`${apiUrl}/portfolio`)
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (!isMounted || !json?.data?.items?.length) return;
        setClients(json.data.items);
      })
      .catch(() => {
        // Fallback to bundled initialClientsData
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Smooth continuous auto-scroll ticker from LEFT TO RIGHT
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let animId: number;
    let lastTime = performance.now();
    const speedPxPerSec = 35; // smooth horizontal movement

    // Initialize position to half so it has room to scroll left-to-right immediately
    const initTimer = setTimeout(() => {
      if (el && el.scrollWidth > el.clientWidth) {
        el.scrollLeft = el.scrollWidth / 2;
      }
    }, 100);

    const onMouseEnter = () => {
      isHoveredRef.current = true;
    };
    const onMouseLeave = () => {
      isHoveredRef.current = false;
    };
    const onTouchStart = () => {
      isTouchingRef.current = true;
    };
    const onTouchEnd = () => {
      isTouchingRef.current = false;
    };

    el.addEventListener("mouseenter", onMouseEnter);
    el.addEventListener("mouseleave", onMouseLeave);
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });

    const step = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Move from left to right (decreasing scrollLeft causes visual cards to move rightwards)
      if (!isHoveredRef.current && !isTouchingRef.current && el) {
        el.scrollLeft -= speedPxPerSec * dt;
        const half = el.scrollWidth / 2;
        if (half > 0 && el.scrollLeft <= 5) {
          el.scrollLeft += half;
        }
      }

      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);

    return () => {
      clearTimeout(initTimer);
      cancelAnimationFrame(animId);
      el.removeEventListener("mouseenter", onMouseEnter);
      el.removeEventListener("mouseleave", onMouseLeave);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [clients]);

  const handlePrev = useCallback(() => {
    scrollRef.current?.scrollBy({ left: -360, behavior: "smooth" });
  }, []);

  const handleNext = useCallback(() => {
    scrollRef.current?.scrollBy({ left: 360, behavior: "smooth" });
  }, []);

  // Duplicate list once to create a seamless infinite scrolling ribbon
  const displayItems = [...clients, ...clients];

  return (
    <section
      id="client-portfolio-gallery"
      aria-label="Real Client Portfolio"
      className="w-full py-10 sm:py-14 border-t border-line/60 bg-white"
    >
      <div className="mx-auto max-w-[1320px] px-3 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-6 sm:pb-8">
          <div className="max-w-2xl">
            <span className="text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase text-[#80011F]">
              Real Client Real Work
            </span>
            <h2 className="mt-1.5 text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-ink">
              {title}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-body leading-relaxed">
              {subtitle}
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Scroll left"
              className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-ink transition-colors hover:border-[#80011F] hover:text-[#80011F] cursor-pointer"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Scroll right"
              className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-ink transition-colors hover:border-[#80011F] hover:text-[#80011F] cursor-pointer"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Scrolling Gallery — Minimalist Card Appearance (Reference Image 2 Only) */}
      <div
        ref={scrollRef}
        className="w-full overflow-x-auto no-scrollbar scroll-smooth cursor-grab active:cursor-grabbing px-3 sm:px-6"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <div className="flex items-stretch gap-4 sm:gap-6 py-2 w-max">
          {displayItems.map((item, idx) => {
            const isTapped = activeTapId === `${item.id}-${idx}`;
            // Robust image resolution: uses imageUrl (S3), webpUrl, localImageUrl, or filename fallback
            const imageSrc =
              item.imageUrl ||
              item.s3Url ||
              item.webpUrl ||
              item.localImageUrl ||
              (item.imageFileName ? `/portfolio/${item.imageFileName.replace(/\.png$/i, '.webp')}` : "");

            return (
              <div
                key={`${item.id}-${idx}`}
                className="group relative w-[240px] xs:w-[270px] sm:w-[310px] md:w-[330px] shrink-0 aspect-[3/4] overflow-hidden select-none cursor-pointer bg-slate-900"
                onClick={() => setSelectedImage({ url: imageSrc, alt: item.clientName })}
                onTouchStart={() => {
                  setActiveTapId((prev) =>
                    prev === `${item.id}-${idx}` ? null : `${item.id}-${idx}`
                  );
                }}
              >
                {/* Genuine Client Photograph — 100% visible, robust img tag that never fails */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageSrc}
                  alt={`${item.clientName} customized t-shirt portfolio`}
                  loading="lazy"
                  onError={(e) => {
                    // Fallback to local PNG if S3/WebP has network restriction
                    const target = e.currentTarget;
                    if (item.imageFileName && !target.src.endsWith(item.imageFileName)) {
                      target.src = `/portfolio/${item.imageFileName}`;
                    }
                  }}
                  className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
                />

                {/* Subtle Image Gradient Overlay for Readability */}
                <div
                  className={`absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent transition-opacity duration-300 pointer-events-none ${
                    isTapped ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  }`}
                />

                {/* Zoom Hint Icon in Corner */}
                <div className="absolute top-3 right-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Eye size={14} />
                </div>

                {/* Client Information: Sliding upward from bottom edge on hover */}
                <div
                  className={`absolute inset-x-0 bottom-0 z-10 p-4 sm:p-5 text-white transition-all duration-300 ease-out ${
                    isTapped
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-6 group-hover:opacity-100 group-hover:translate-y-0"
                  }`}
                >
                  {/* Business Sector Tag */}
                  <span className="inline-block text-[10px] sm:text-[11px] font-bold tracking-widest uppercase text-rose-300 mb-1">
                    {item.businessSector}
                  </span>

                  {/* Client / Company Name */}
                  <h3 className="text-base sm:text-lg font-extrabold leading-snug tracking-tight text-white line-clamp-2">
                    {item.clientName}
                  </h3>

                  {/* Client-specific Description */}
                  <p className="mt-1.5 text-xs sm:text-sm text-slate-200 leading-relaxed line-clamp-3">
                    {item.description}
                  </p>

                  {/* Tap to Enlarge Hint */}
                  <span className="mt-2.5 inline-flex items-center gap-1 text-[10px] font-semibold text-rose-200 uppercase tracking-wider">
                    Click to enlarge view &rarr;
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Enlarged Original Photograph Lightbox (Desktop & Mobile) */}
      <ImageLightboxModal
        isOpen={Boolean(selectedImage)}
        imageUrl={selectedImage?.url || null}
        imageAlt={selectedImage?.alt || "Client photograph"}
        onClose={() => setSelectedImage(null)}
      />
    </section>
  );
}
