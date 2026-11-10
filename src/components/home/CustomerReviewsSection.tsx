"use client";

import { useState, useRef, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight, ExternalLink, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import {
  type GooglePlaceReviewResponse,
  FALLBACK_GOOGLE_DATA,
} from "@/lib/googleReviews";

export function GoogleGIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

export function CustomerReviewsSection({
  initialData,
}: {
  initialData?: GooglePlaceReviewResponse;
}) {
  const [data, setData] = useState<GooglePlaceReviewResponse>(
    initialData || FALLBACK_GOOGLE_DATA
  );
  const carouselRef = useRef<HTMLDivElement>(null);

  // Fetch updated reviews on client if needed
  useEffect(() => {
    let isMounted = true;
    fetch("/api/reviews/google")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json && isMounted) {
          setData(json);
        }
      })
      .catch(() => {
        // Fallback remains active
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const reviews = data.reviews || FALLBACK_GOOGLE_DATA.reviews;
  // Duplicate reviews for seamless continuous infinite looping
  const loopedReviews = [...reviews, ...reviews, ...reviews];

  // Continuous auto-scroll loop with pause on hover/touch
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;

    let animId: number;
    let isPaused = false;

    const onEnter = () => { isPaused = true; };
    const onLeave = () => { isPaused = false; };

    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    el.addEventListener("touchstart", onEnter, { passive: true });
    el.addEventListener("touchend", onLeave, { passive: true });

    const scrollSpeed = 0.8;
    const step = () => {
      if (!isPaused && el) {
        // Seamlessly reset when reaching halfway
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft = 0;
        } else {
          el.scrollLeft += scrollSpeed;
        }
      }
      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animId);
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
      el.removeEventListener("touchstart", onEnter);
      el.removeEventListener("touchend", onLeave);
    };
  }, [reviews]);

  const handlePrev = () => {
    carouselRef.current?.scrollBy({ left: -360, behavior: "smooth" });
  };

  const handleNext = () => {
    carouselRef.current?.scrollBy({ left: 360, behavior: "smooth" });
  };

  return (
    <section
      id="customer-reviews"
      aria-label="Customer Reviews"
      className="mx-auto max-w-[1320px] px-4 py-14 sm:px-6 md:py-20"
    >
      <Reveal>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 pb-8 border-b border-line">
          {/* Section Titles */}
          <div className="max-w-2xl">
            <span className="text-[11px] sm:text-xs font-bold tracking-[0.2em] uppercase text-[#80011F]">
              Customer Reviews
            </span>
            <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-ink">
              What Our Customers Say About TeesZone
            </h2>
            <p className="mt-3 text-sm sm:text-base leading-relaxed text-body">
              Discover genuine customer feedback about TeesZone&apos;s custom T-shirts,
              corporate uniforms, premium apparel quality and customer service.
            </p>
          </div>

          {/* Official Google Rating Summary Badge (No 21 count mentioned) */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-slate-50/90 rounded-2xl p-4 sm:p-5 border border-slate-200/60 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white shadow-xs border border-slate-100">
                <GoogleGIcon className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-2xl font-black text-ink tracking-tight">
                    {data.rating.toFixed(1)}
                  </span>
                  <div className="flex items-center text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={17}
                        className="fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs font-semibold text-gray-600">
                  Google Overall Rating · Verified Reviews
                </p>
              </div>
            </div>

            <a
              href={data.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#80011F] text-white hover:bg-rose-900 px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all shadow-xs hover:shadow-md cursor-pointer shrink-0"
              title="View TeesZone on Google Maps"
            >
              <span>View on Google</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </div>
      </Reveal>

      {/* Carousel Navigation Toolbar */}
      <div className="mt-8 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-body">
          Authentic customer feedback · Auto-scrolling in continuous loop
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            aria-label="Previous reviews"
            className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-line bg-white text-ink transition-all hover:bg-slate-50 cursor-pointer shadow-xs hover:scale-105"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={handleNext}
            aria-label="Next reviews"
            className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-line bg-white text-ink transition-all hover:bg-slate-50 cursor-pointer shadow-xs hover:scale-105"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Continuous Loop Auto-Scrolling Carousel (Desktop & Mobile) */}
      <div className="relative mt-6 overflow-hidden">
        <div
          ref={carouselRef}
          className="flex gap-5 overflow-x-auto scroll-smooth py-2 scrollbar-none"
        >
          {loopedReviews.map((rev, idx) => (
            <article
              key={`${rev.id}-${idx}`}
              className="w-[280px] sm:w-[340px] lg:w-[380px] shrink-0 flex flex-col justify-between rounded-2xl border border-line/80 bg-white p-5 sm:p-6 shadow-xs transition-all duration-200 hover:shadow-md hover:border-[#80011F]/30"
            >
              <div>
                {/* Header: Author + Star Rating + Google Source */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {rev.authorPhotoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={rev.authorPhotoUrl}
                        alt={rev.authorName}
                        className="h-10 w-10 shrink-0 rounded-full object-cover border border-slate-200 shadow-2xs"
                      />
                    ) : (
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#80011F]/10 text-[#80011F] font-bold text-sm">
                        {rev.authorName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="text-sm font-bold text-ink leading-tight">
                          {rev.authorName}
                        </h3>
                        {rev.badge && (
                          <span className="text-[10px] font-semibold text-amber-900 bg-amber-50 border border-amber-200/80 px-1.5 py-0.5 rounded">
                            {rev.badge}
                          </span>
                        )}
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-[11px] text-gray-500">
                        <span>{rev.relativeTime}</span>
                        {rev.verifiedOrder && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                            <ShieldCheck size={11} className="text-emerald-600" />
                            Verified
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <GoogleGIcon className="w-4 h-4 shrink-0 opacity-80" />
                </div>

                {/* Star Rating */}
                <div className="mt-3.5 flex items-center gap-1 text-amber-500">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className="fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>

                {/* Review Text */}
                <p className="mt-3 text-sm leading-relaxed text-gray-700 line-clamp-5">
                  &ldquo;{rev.text}&rdquo;
                </p>
              </div>

              {/* Card Footer: View original review link */}
              <div className="mt-5 pt-3.5 border-t border-line/60 flex items-center justify-between">
                <span className="text-[11px] font-medium text-gray-500">
                  Posted on Google
                </span>
                <a
                  href={rev.googleReviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#80011F] hover:underline"
                >
                  <span>Read on Google</span>
                  <ExternalLink size={11} />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Google Attribution & Compliance Footer (No 21 count) */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left text-xs text-gray-500">
        <p>
          Ratings and reviews verified through{" "}
          <strong className="font-semibold text-gray-700">
            TeesZone Clothing Private Limited
          </strong>{" "}
          on Google Maps.
        </p>
        <a
          href={data.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-semibold text-[#80011F] hover:underline"
        >
          <span>See Reviews on Google</span>
          <ExternalLink size={12} />
        </a>
      </div>
    </section>
  );
}
