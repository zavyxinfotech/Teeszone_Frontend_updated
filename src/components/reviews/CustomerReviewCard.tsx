"use client";

import { useState } from "react";
import { Star, ShieldCheck, ExternalLink, ImageIcon } from "lucide-react";
import type { GoogleReviewItem } from "@/lib/googleReviews";

interface CustomerReviewCardProps {
  review: GoogleReviewItem;
  className?: string;
  compact?: boolean;
}

export function CustomerReviewCard({
  review,
  className = "",
  compact = false,
}: CustomerReviewCardProps) {
  const [imgError, setImgError] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  // Collect all customer-uploaded apparel / product photographs
  const reviewImages: string[] = [];
  if (Array.isArray(review.apparelImages) && review.apparelImages.length > 0) {
    reviewImages.push(...review.apparelImages);
  } else if (review.apparelImageUrl && review.apparelImageUrl.trim().length > 0) {
    reviewImages.push(review.apparelImageUrl.trim());
  }

  const hasReviewImages = reviewImages.length > 0 && !imgError;

  // Compute initials for graceful avatar fallback
  const initials = (review.authorName || "TZ")
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <article
      className={`group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs transition-all duration-300 hover:border-[#80011F]/40 hover:shadow-md ${className}`}
    >
      <div className="flex flex-col flex-1">
        {/* ======================================================== */}
        {/* 1. Customer-Uploaded Review Photographs (At Top)        */}
        {/*    Only rendered when customer uploaded photographs      */}
        {/* ======================================================== */}
        {hasReviewImages && (
          <div className="mb-3.5 w-full overflow-hidden rounded-xl bg-slate-50 border border-slate-100">
            {reviewImages.length === 1 ? (
              <div className="relative h-40 sm:h-44 w-full overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={reviewImages[0]}
                  alt={`${review.authorName}'s product photograph`}
                  loading="lazy"
                  decoding="async"
                  onError={() => setImgError(true)}
                  className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded-md bg-black/60 backdrop-blur-xs px-2 py-0.5 text-[10px] font-semibold text-white">
                  <ImageIcon size={10} />
                  <span>Customer Photo</span>
                </span>
              </div>
            ) : (
              /* Support for multiple customer review images gallery */
              <div className="grid grid-cols-2 gap-1.5 h-40 sm:h-44 p-1">
                {reviewImages.slice(0, 2).map((img, i) => (
                  <div key={i} className="relative h-full w-full overflow-hidden rounded-lg">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img}
                      alt={`${review.authorName} photo ${i + 1}`}
                      loading="lazy"
                      decoding="async"
                      onError={() => setImgError(true)}
                      className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* 2. Star Rating (Prominent, automatically moves to top     */}
        {/*    when no customer photograph exists)                   */}
        {/* ======================================================== */}
        <div className="flex items-center gap-1 text-amber-500">
          {[...Array(review.rating || 5)].map((_, i) => (
            <Star
              key={i}
              size={compact ? 13 : 15}
              className="fill-amber-400 text-amber-400 drop-shadow-xs"
            />
          ))}
          <span className="ml-1 text-xs font-bold text-gray-800">
            {(review.rating || 5).toFixed(1)}
          </span>
          {review.relativeTime && (
            <span className="ml-auto text-[11px] text-gray-400">
              {review.relativeTime}
            </span>
          )}
        </div>

        {/* ======================================================== */}
        {/* 3. Review Text Quote                                     */}
        {/* ======================================================== */}
        <p
          className={`mt-2.5 text-gray-700 leading-relaxed font-normal ${
            compact
              ? "text-xs line-clamp-3"
              : hasReviewImages
              ? "text-xs sm:text-[13px] line-clamp-3"
              : "text-xs sm:text-[13px] line-clamp-5"
          }`}
        >
          &ldquo;{review.text}&rdquo;
        </p>
      </div>

      {/* ======================================================== */}
      {/* 4. Subtle Divider & 5. Customer Information Row          */}
      {/*    [Small Circular Avatar] Customer Name       [Verified] */}
      {/* ======================================================== */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Small Circular Profile Image with graceful fallback */}
          {review.authorPhotoUrl && !avatarError ? (
            <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border border-slate-200/80 bg-slate-100 shadow-2xs">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={review.authorPhotoUrl}
                alt={review.authorName}
                loading="lazy"
                decoding="async"
                onError={() => setAvatarError(true)}
                className="h-full w-full object-cover object-center"
              />
            </div>
          ) : (
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#80011F]/10 text-[#80011F] text-xs font-bold border border-[#80011F]/20">
              {initials}
            </div>
          )}

          {/* Customer Name */}
          <div className="min-w-0 truncate">
            <h4 className="text-xs sm:text-[13px] font-semibold text-ink truncate">
              {review.authorName}
            </h4>
            {review.badge && (
              <span className="block text-[10px] text-gray-400 font-medium truncate">
                {review.badge}
              </span>
            )}
          </div>
        </div>

        {/* Verified Badge on the Right */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] sm:text-[11px] font-semibold text-emerald-700 border border-emerald-200/70">
            <ShieldCheck size={12} className="text-emerald-600 stroke-[2.2]" />
            <span>Verified</span>
          </span>

          {review.googleReviewUrl && (
            <a
              href={review.googleReviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${review.authorName}'s review on Google`}
              className="text-gray-400 hover:text-[#80011F] transition-colors p-0.5"
              title="View review on Google"
            >
              <ExternalLink size={12} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
