"use client";

import React, { useState } from "react";
import { ExternalLink, Star, X, Clock, CheckCircle2, HeartHandshake } from "lucide-react";

interface GoogleReviewModalProps {
  isOpen: boolean;
  orderId: string;
  orderNumber: string;
  onClose: () => void;
  onReviewLater: () => void;
  onSubmitRating: (rating: number) => Promise<void>;
}

export function GoogleReviewModal({
  isOpen,
  orderId,
  orderNumber,
  onClose,
  onReviewLater,
  onSubmitRating,
}: GoogleReviewModalProps) {
  const [selectedStars, setSelectedStars] = useState<number>(5);
  const [hoverStars, setHoverStars] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [hasClickedGoogle, setHasClickedGoogle] = useState(false);

  if (!isOpen) return null;

  const handleOpenGoogle = () => {
    setHasClickedGoogle(true);
    window.open("https://g.page/r/CShjds2c7FPzEBI/review", "_blank", "noopener,noreferrer");
  };

  const handleRatingSubmit = async () => {
    setSubmitting(true);
    try {
      await onSubmitRating(selectedStars);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl border border-rose-100 animate-in zoom-in-95 duration-200"
        style={{ maxHeight: "90vh" }}
      >
        {/* Burgundy Top Header Banner */}
        <div className="bg-[#80011F] px-5 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HeartHandshake size={20} className="text-rose-200" />
            <h3 className="font-heading font-black text-sm sm:text-base tracking-wide">
              Rate Your TeesZone Experience
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-white/80 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto p-5 sm:p-6 space-y-4 text-xs sm:text-sm text-gray-800" style={{ maxHeight: "calc(90vh - 65px)" }}>
          {/* Order reference pill */}
          <div className="flex items-center justify-between bg-rose-50/60 border border-rose-100 rounded-lg px-3 py-1.5 text-xs">
            <span className="font-bold text-[#80011F]">Order: #{orderNumber}</span>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Dispatched
            </span>
          </div>

          {/* Exact required content block */}
          <div className="bg-slate-50/70 border border-slate-100 rounded-xl p-4 space-y-2.5 text-gray-700 leading-relaxed font-sans text-xs sm:text-[13px]">
            <p className="font-medium text-gray-900">Hi 😊</p>

            <p>
              Thank you so much for choosing <strong className="text-[#80011F]">TeesZone</strong>! 🙏
            </p>

            <p>
              If you&apos;re happy with our products and service, we&apos;d truly appreciate a 2-minute favour — kindly share your feedback and a ⭐⭐⭐⭐⭐ review here:
            </p>

            <div className="pt-1 pb-1">
              <a
                href="https://g.page/r/CShjds2c7FPzEBI/review"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleOpenGoogle}
                className="font-bold text-[#80011F] hover:underline inline-flex items-center gap-1 bg-white border border-rose-200 px-3 py-1.5 rounded-lg shadow-2xs break-all"
              >
                <span>👉 https://g.page/r/CShjds2c7FPzEBI/review</span>
                <ExternalLink size={12} className="shrink-0" />
              </a>
            </div>

            <p>
              Your review means a lot and helps us grow. Thank you for your support! 🤝
            </p>

            <div className="pt-2 border-t border-slate-200/80 text-xs text-gray-600 space-y-0.5">
              <p className="font-bold text-gray-800">— Team TeesZone</p>
              <p>📞 +91 75500 67704</p>
              <p>🌐 teeszone.in</p>
            </div>
          </div>

          {/* Interactive Star Rating for internal feedback */}
          <div className="bg-rose-50/40 border border-rose-100/80 rounded-xl p-4 text-center space-y-2">
            <label className="text-xs font-bold text-gray-900 block">
              How would you rate your product quality &amp; experience?
            </label>
            <div className="flex items-center justify-center gap-2 py-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setSelectedStars(star)}
                  onMouseEnter={() => setHoverStars(star)}
                  onMouseLeave={() => setHoverStars(null)}
                  className="p-1 transition-transform hover:scale-125 cursor-pointer focus:outline-hidden"
                  aria-label={`${star} star`}
                >
                  <Star
                    size={28}
                    className={`${
                      star <= (hoverStars ?? selectedStars)
                        ? "fill-amber-400 text-amber-500 drop-shadow-xs"
                        : "text-gray-300"
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>
            <p className="text-[11px] font-medium text-gray-600">
              {selectedStars === 5
                ? "⭐⭐⭐⭐⭐ Outstanding Quality & Fit!"
                : selectedStars === 4
                ? "⭐⭐⭐⭐ Very Good Quality"
                : selectedStars === 3
                ? "⭐⭐⭐ Good"
                : "⭐⭐ Needs Improvement"}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <button
              type="button"
              onClick={handleOpenGoogle}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#80011F] hover:bg-[#680119] text-white py-3 px-4 font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <Star size={16} className="fill-amber-300 text-amber-300" />
              <span>Write a Google Review</span>
              <ExternalLink size={14} />
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleRatingSubmit}
                disabled={submitting}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-[#80011F] text-[#80011F] hover:bg-rose-50 py-2.5 px-3 font-bold text-xs transition-colors cursor-pointer"
              >
                <CheckCircle2 size={14} />
                <span>{submitting ? "Saving..." : "Submit Rating"}</span>
              </button>

              <button
                type="button"
                onClick={onReviewLater}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 py-2.5 px-3 font-semibold text-xs transition-colors cursor-pointer"
              >
                <Clock size={14} />
                <span>Review Later</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
