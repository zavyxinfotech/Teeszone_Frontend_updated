"use client";

import React from "react";
import { ExternalLink, X, HeartHandshake } from "lucide-react";

interface SocialFollowModalProps {
  isOpen: boolean;
  orderNumber?: string;
  onClose: () => void;
}

export function SocialFollowModal({
  isOpen,
  orderNumber,
  onClose,
}: SocialFollowModalProps) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl border border-rose-100 animate-in zoom-in-95 duration-200"
        style={{ maxHeight: "90vh" }}
      >
        {/* Burgundy Top Header */}
        <div className="bg-[#80011F] px-5 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HeartHandshake size={20} className="text-rose-200" />
            <h3 className="font-heading font-black text-sm sm:text-base tracking-wide">
              🤝 Stay Connected with TeesZone!
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

        <div className="p-5 sm:p-6 space-y-4 text-xs sm:text-sm text-gray-800">
          <p className="text-gray-700 leading-relaxed font-sans text-xs sm:text-[13px]">
            Follow our social media pages for updates on corporate uniforms, customised T-shirts, bulk apparel orders, branding solutions and our latest project updates.
          </p>

          {/* Social Media Action Buttons */}
          <div className="space-y-2.5 pt-2">
            {/* Facebook Button */}
            <a
              href="https://www.facebook.com/teeszoneindia"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between w-full rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white p-3.5 font-bold text-xs sm:text-sm shadow-sm transition-all hover:shadow-md cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                <span>Follow on Facebook</span>
              </div>
              <ExternalLink size={15} className="text-white/80 group-hover:text-white" />
            </a>

            {/* Instagram Button */}
            <a
              href="https://www.instagram.com/teeszoneindia"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between w-full rounded-xl bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-95 text-white p-3.5 font-bold text-xs sm:text-sm shadow-sm transition-all hover:shadow-md cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                <span>Follow on Instagram</span>
              </div>
              <ExternalLink size={15} className="text-white/80 group-hover:text-white" />
            </a>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 py-2.5 font-bold text-xs transition-colors cursor-pointer"
            >
              Done / Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

