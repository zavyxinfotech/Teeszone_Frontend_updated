"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Play, X, ChevronLeft, ChevronRight } from "lucide-react";
import initialVideos from "@/data/productionVideos.json";
import { assetUrl } from "@/lib/site";

export interface ProductionVideo {
  id: string;
  videoTitle: string;
  videoDescription?: string;
  category?: string;
  videoUrl?: string;
  localVideoUrl?: string;
  thumbnailUrl?: string;
  displayOrder: number;
  isActive: boolean;
}

// Bulletproof video source resolver guaranteeing playback across all environments
function resolveVideoSrc(vid: ProductionVideo): string {
  if (vid.localVideoUrl && vid.localVideoUrl.startsWith("/")) return assetUrl(vid.localVideoUrl);
  if (vid.videoUrl && vid.videoUrl.startsWith("/")) return assetUrl(vid.videoUrl);
  if (vid.videoUrl) {
    const filename = vid.videoUrl.split("/").pop();
    if (filename && filename.endsWith(".mp4")) {
      return assetUrl(`/videos/${filename}`);
    }
  }
  return vid.videoUrl || "";
}

function resolveThumbnail(vid: ProductionVideo): string {
  if (vid.thumbnailUrl && vid.thumbnailUrl.startsWith("/")) return assetUrl(vid.thumbnailUrl);
  if (vid.thumbnailUrl) {
    const match = vid.thumbnailUrl.match(/([0-9]{2}-[^/]+\.(webp|png))/i);
    if (match) return assetUrl(`/portfolio/${match[1]}`);
  }
  return assetUrl("/portfolio/01-zoho-crm.webp");
}

export function ProductionVideosSection() {
  const [videos, setVideos] = useState<ProductionVideo[]>(
    initialVideos as ProductionVideo[]
  );
  const [activeVideo, setActiveVideo] = useState<ProductionVideo | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isHoveredRef = useRef(false);
  const isTouchingRef = useRef(false);

  // Fetch updated videos from API
  useEffect(() => {
    let isMounted = true;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4010/api";
    fetch(`${apiUrl}/videos`)
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (!isMounted || !json?.data?.items?.length) return;
        setVideos(json.data.items);
      })
      .catch(() => {});
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
  }, [videos]);

  const handlePrev = useCallback(() => {
    scrollRef.current?.scrollBy({ left: -360, behavior: "smooth" });
  }, []);

  const handleNext = useCallback(() => {
    scrollRef.current?.scrollBy({ left: 360, behavior: "smooth" });
  }, []);

  // Duplicate items for continuous seamless loop
  const displayItems = [...videos, ...videos, ...videos];

  return (
    <section
      id="production-videos"
      aria-label="TeesZone Production Activities"
      className="w-full py-10 sm:py-14 border-t border-line/60 bg-slate-50/50"
    >
      <div className="mx-auto max-w-[1320px] px-3 sm:px-6">
        {/* Header — General heading only, NO description text, non-bold font */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-6 sm:pb-8">
          <div>
            <span className="text-[11px] sm:text-xs font-normal tracking-[0.2em] uppercase text-[#80011F]">
              Factory Floor
            </span>
            <h2 className="mt-1.5 text-xl sm:text-2xl lg:text-3xl font-normal tracking-tight text-ink">
              TeesZone In-House Production Footage
            </h2>
          </div>

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

      {/* Horizontal Video Cards — Auto-scrolling from Left to Right */}
      <div
        ref={scrollRef}
        className="w-full overflow-x-auto no-scrollbar scroll-smooth cursor-grab active:cursor-grabbing px-3 sm:px-6"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <div className="flex items-stretch gap-4 sm:gap-6 py-2 w-max">
          {displayItems.map((vid, idx) => {
            const videoSrc = resolveVideoSrc(vid);
            const posterSrc = resolveThumbnail(vid);
            // Default to seeking 5th second of video for thumbnail preview
            const videoWithTime = videoSrc ? `${videoSrc}#t=5` : "";

            return (
              <div
                key={`${vid.id}-${idx}`}
                onClick={() => setActiveVideo(vid)}
                className="group relative w-[280px] sm:w-[360px] shrink-0 aspect-[16/10] overflow-hidden select-none cursor-pointer bg-slate-950"
              >
                {/* Real video preview / HTML5 video element seeking 5th second */}
                <video
                  src={videoWithTime}
                  poster={posterSrc}
                  preload="auto"
                  muted
                  playsInline
                  className="w-full h-full object-cover opacity-90 transition-transform duration-500 ease-out group-hover:scale-105 group-hover:opacity-100"
                />

                {/* Solid Dark Gradient Overlay for Readability */}
                <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black via-black/70 to-transparent pointer-events-none" />

                {/* Circular Play Button Icon */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-[#80011F]/90 text-white shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:bg-[#80011F]">
                    <Play size={20} className="ml-1 fill-white" />
                  </div>
                </div>

                {/* Video Title and Process Text Overlay — Clearly Visible with High Contrast Amber and Badges */}
                <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 text-white z-10 pointer-events-none">
                  {/* Manufacturing Process Category Tag */}
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-semibold bg-[#80011F] text-white uppercase tracking-wider mb-1.5 shadow-xs">
                    {vid.category || "In-House Manufacturing"}
                  </span>

                  {/* Video Title in High-Contrast Amber */}
                  <h3 className="text-sm sm:text-base font-bold text-amber-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] leading-snug line-clamp-1 tracking-tight">
                    {vid.videoTitle}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Video Modal Player */}
      {activeVideo && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setActiveVideo(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-3 sm:p-6 backdrop-blur-xs"
        >
          <button
            type="button"
            onClick={() => setActiveVideo(null)}
            className="fixed top-3 right-3 sm:top-5 sm:right-5 z-60 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black border border-white/20 cursor-pointer"
          >
            <X size={22} />
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl overflow-hidden rounded-xl bg-black shadow-2xl"
          >
            <video
              src={resolveVideoSrc(activeVideo)}
              poster={resolveThumbnail(activeVideo)}
              controls
              autoPlay
              playsInline
              className="w-full h-auto aspect-video object-contain"
            />
            <div className="p-4 bg-slate-950 text-white flex items-center justify-between">
              <h4 className="text-sm sm:text-base font-bold">{activeVideo.videoTitle}</h4>
              <span className="text-xs text-rose-300 font-semibold uppercase tracking-wider">
                TeesZone Factory Production
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
