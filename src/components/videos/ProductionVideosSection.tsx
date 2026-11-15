"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Play, X, ChevronLeft, ChevronRight, Video } from "lucide-react";
import initialVideos from "@/data/productionVideos.json";

export interface ProductionVideo {
  id: string;
  videoTitle: string;
  videoDescription?: string;
  category?: string;
  videoUrl?: string;
  thumbnailUrl: string;
  displayOrder: number;
  isActive: boolean;
}

export function ProductionVideosSection() {
  const [videos, setVideos] = useState<ProductionVideo[]>(
    initialVideos as ProductionVideo[]
  );
  const [activeVideo, setActiveVideo] = useState<ProductionVideo | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isHoveredRef = useRef(false);

  // Fetch updated videos from API
  useEffect(() => {
    let isMounted = true;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4010/api";
    fetch(`${apiUrl}/videos`)
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (!isMounted || !json?.data?.items) return;
        setVideos(json.data.items);
      })
      .catch(() => {});
    return () => {
      isMounted = false;
    };
  }, []);

  // Continuous auto-scroll ticker from left to right direction on desktop and mobile view
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || videos.length === 0) return;

    let animId: number;
    let lastTime = performance.now();
    const speedPxPerSec = 40; // smooth horizontal movement

    const initScroll = () => {
      if (el.scrollWidth > 0 && el.scrollLeft === 0) {
        el.scrollLeft = el.scrollWidth / 3;
      }
    };
    initScroll();
    const timer = setTimeout(initScroll, 100);

    const onMouseEnter = () => {
      isHoveredRef.current = true;
    };
    const onMouseLeave = () => {
      isHoveredRef.current = false;
    };

    el.addEventListener("mouseenter", onMouseEnter);
    el.addEventListener("mouseleave", onMouseLeave);

    const step = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Auto-scroll left-to-right (cards move rightward by decrementing scrollLeft)
      if (!isHoveredRef.current && el) {
        el.scrollLeft -= speedPxPerSec * dt;
        const oneThird = el.scrollWidth / 3;
        if (oneThird > 0 && el.scrollLeft <= 10) {
          el.scrollLeft += oneThird;
        }
      }

      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(animId);
      el.removeEventListener("mouseenter", onMouseEnter);
      el.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [videos]);

  const handlePrev = useCallback(() => {
    scrollRef.current?.scrollBy({ left: -360, behavior: "smooth" });
  }, []);

  const handleNext = useCallback(() => {
    scrollRef.current?.scrollBy({ left: 360, behavior: "smooth" });
  }, []);

  // Triplicate list for seamless left-to-right loop if videos exist
  const displayVideos = [...videos, ...videos, ...videos];

  return (
    <section
      id="production-videos"
      aria-label="TeesZone In-House Production Footage"
      className="w-full py-10 sm:py-14 border-t border-line/60 bg-slate-50/50"
    >
      <div className="mx-auto max-w-[1320px] px-3 sm:px-6">
        {/* Header — General Heading Only, No printing types badge, No description text */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 sm:pb-8">
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-ink">
              TeesZone In-House Production Footage
            </h2>
          </div>

          {videos.length > 0 && (
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
          )}
        </div>
      </div>

      {videos.length === 0 ? (
        <div className="mx-auto max-w-[1320px] px-3 sm:px-6">
          <div className="flex flex-col items-center justify-center p-8 sm:p-12 rounded-2xl bg-white border border-slate-200/60 shadow-xs text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-[#80011F] mb-3">
              <Video size={24} />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-ink">
              Production Footage Arriving Soon
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-body max-w-md">
              Genuine factory videos and in-house apparel manufacturing footage will be featured here shortly.
            </p>
          </div>
        </div>
      ) : (
        /* Horizontal Video Cards — Auto-scroll Left to Right, No Video Description */
        <div
          ref={scrollRef}
          className="w-full overflow-x-auto no-scrollbar scroll-smooth cursor-grab active:cursor-grabbing px-3 sm:px-6"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div className="flex items-stretch gap-4 sm:gap-6 py-2 w-max">
            {displayVideos.map((vid, idx) => (
              <div
                key={`${vid.id}-${idx}`}
                onClick={() => setActiveVideo(vid)}
                className="group relative w-[280px] sm:w-[360px] shrink-0 aspect-[16/10] overflow-hidden select-none cursor-pointer bg-black"
              >
                {/* Thumbnail */}
                <Image
                  src={vid.thumbnailUrl}
                  alt={vid.videoTitle}
                  fill
                  unoptimized
                  sizes="(max-width: 640px) 280px, 360px"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-105 opacity-80 group-hover:opacity-95"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                {/* Play Button Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-[#80011F]/90 text-white shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:bg-[#80011F]">
                    <Play size={20} className="ml-1 fill-white" />
                  </div>
                </div>

                {/* Title Only — No video description text */}
                <div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-4 text-white z-10">
                  <h3 className="text-sm sm:text-base font-bold text-white leading-tight line-clamp-2">
                    {vid.videoTitle}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Video Modal Player */}
      {activeVideo && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setActiveVideo(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-3 sm:p-6 backdrop-blur-xs"
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
            {activeVideo.videoUrl ? (
              <video
                src={activeVideo.videoUrl}
                controls
                autoPlay
                className="w-full h-auto aspect-video object-contain"
              />
            ) : (
              <div className="relative aspect-video w-full flex flex-col items-center justify-center p-6 text-center text-white bg-slate-900">
                <Image
                  src={activeVideo.thumbnailUrl}
                  alt={activeVideo.videoTitle}
                  fill
                  unoptimized
                  className="object-cover opacity-25"
                />
                <div className="relative z-10 max-w-md">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#80011F] text-white">
                    <Play size={22} className="ml-0.5 fill-white" />
                  </div>
                  <h4 className="text-base sm:text-lg font-bold">{activeVideo.videoTitle}</h4>
                  <p className="mt-3 text-[11px] font-semibold text-rose-300 uppercase tracking-widest">
                    Footage Verified by TeesZone Production Quality Control
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
