"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { X } from "lucide-react";

interface ImageLightboxProps {
  isOpen: boolean;
  imageUrl: string | null;
  imageAlt: string;
  onClose: () => void;
}

export function ImageLightboxModal({
  isOpen,
  imageUrl,
  imageAlt,
  onClose,
}: ImageLightboxProps) {
  // Lock body scroll while open
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !imageUrl) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Enlarged client photograph"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-2 sm:p-4 backdrop-blur-xs transition-opacity duration-200"
    >
      {/* Simple Close (X) Option */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        aria-label="Close enlarged view"
        className="fixed top-3 right-3 sm:top-5 sm:right-5 z-60 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black transition-colors cursor-pointer border border-white/20"
      >
        <X size={22} className="stroke-[2.2]" />
      </button>

      {/* Enlarged Original Photograph ONLY — No extra cards, info panels, borders, or decorations */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[92vh] max-w-[95vw] sm:max-w-[90vw] overflow-hidden flex items-center justify-center select-none"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={imageAlt}
          onError={(e) => {
            const target = e.currentTarget;
            if (target.src.includes(".webp")) {
              target.src = target.src.replace(/\.webp$/i, ".png");
            }
          }}
          className="max-h-[90vh] max-w-[95vw] sm:max-w-[90vw] w-auto h-auto object-contain pointer-events-auto"
        />
      </div>
    </div>
  );
}
