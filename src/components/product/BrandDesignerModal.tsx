"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Crop,
  ZoomIn,
  ZoomOut,
  Upload,
  ArrowRight,
  X,
  Sparkles,
  Scan,
} from "lucide-react";

interface BrandDesignerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyLogo: (logoUrl: string, logoName: string) => void;
  currentLogoUrl?: string | null;
  currentLogoName?: string | null;
}

/**
 * Pixel-accurate HTML5 Canvas cropper that preserves PNG transparency
 * and outputs the exact natural-resolution cropped image.
 */
function cropImageCanvas(
  sourceUrl: string,
  cropArea: { x: number; y: number; width: number; height: number } // percentages 0-100
): Promise<string> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const naturalW = img.naturalWidth || img.width;
      const naturalH = img.naturalHeight || img.height;

      // Calculate pixel coordinates relative to the natural image dimensions
      const pixelX = Math.round((Math.max(0, cropArea.x) / 100) * naturalW);
      const pixelY = Math.round((Math.max(0, cropArea.y) / 100) * naturalH);
      const pixelW = Math.max(1, Math.min(naturalW - pixelX, Math.round((cropArea.width / 100) * naturalW)));
      const pixelH = Math.max(1, Math.min(naturalH - pixelY, Math.round((cropArea.height / 100) * naturalH)));

      const canvas = document.createElement("canvas");
      canvas.width = pixelW;
      canvas.height = pixelH;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        resolve(sourceUrl);
        return;
      }

      // Preserve alpha channel / transparent PNG backgrounds
      ctx.clearRect(0, 0, pixelW, pixelH);

      // Draw the cropped region at full natural quality
      ctx.drawImage(
        img,
        pixelX,
        pixelY,
        pixelW,
        pixelH,
        0,
        0,
        pixelW,
        pixelH
      );

      // Export as transparent PNG
      resolve(canvas.toDataURL("image/png"));
    };

    img.onerror = () => {
      resolve(sourceUrl);
    };

    img.src = sourceUrl;
  });
}

type DragHandleType =
  | "move"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "top"
  | "bottom"
  | "left"
  | "right";

export function BrandDesignerModal({
  isOpen,
  onClose,
  onApplyLogo,
  currentLogoUrl,
  currentLogoName,
}: BrandDesignerModalProps) {
  // Mode: "crop" or "zoom"
  const [activeMode, setActiveMode] = useState<"crop" | "zoom">("crop");

  // Initial state: starts EMPTY when opened fresh!
  // No default TeesZone logo or placeholder inside the crop area.
  const [uploadedImage, setUploadedImage] = useState<string | null>(() => currentLogoUrl || null);
  const [logoName, setLogoName] = useState<string>(() => currentLogoName || "");
  const [isDraggingFileOver, setIsDraggingFileOver] = useState<boolean>(false);
  const [cropSuccessToast, setCropSuccessToast] = useState<boolean>(false);
  const [livePreviewUrl, setLivePreviewUrl] = useState<string | null>(null);

  // Synchronize when currentLogoUrl changes from parent without calling setState synchronously in effect
  const [prevCurrentLogoUrl, setPrevCurrentLogoUrl] = useState(currentLogoUrl);
  if (currentLogoUrl !== prevCurrentLogoUrl) {
    setPrevCurrentLogoUrl(currentLogoUrl);
    setUploadedImage(currentLogoUrl || null);
    if (currentLogoName) setLogoName(currentLogoName);
  }

  // Zoom level (1x to 2.5x)
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Crop Box Coordinates (Percentages: 0% to 100% relative to the image frame)
  const [cropBox, setCropBox] = useState<{ x: number; y: number; width: number; height: number }>({
    x: 5,
    y: 5,
    width: 90,
    height: 90,
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imageFrameRef = useRef<HTMLDivElement | null>(null);
  const imageElementRef = useRef<HTMLImageElement | null>(null);

  const activeDragRef = useRef<{
    handle: DragHandleType;
    startX: number;
    startY: number;
    initialBox: { x: number; y: number; width: number; height: number };
  } | null>(null);

  // Handle Escape key to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Generate live preview when crop box or uploaded image changes
  useEffect(() => {
    let isCancelled = false;
    const timer = setTimeout(() => {
      if (!uploadedImage) {
        setLivePreviewUrl(null);
        return;
      }
      cropImageCanvas(uploadedImage, cropBox)
        .then((url) => {
          if (!isCancelled) setLivePreviewUrl(url);
        })
        .catch(() => {});
    }, 80);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [uploadedImage, cropBox]);

  // File Upload Logic
  const processUploadedFile = (file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const dataUrl = event.target.result as string;
        setUploadedImage(dataUrl);
        setLogoName(file.name);
        setZoomLevel(1);
        setCropBox({ x: 5, y: 5, width: 90, height: 90 });
        setActiveMode("crop");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processUploadedFile(file);
    }
    e.target.value = "";
  };

  // Drag and Drop files onto empty upload area
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFileOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFileOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFileOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processUploadedFile(file);
    }
  };

  // Manual Crop Drag Handler (Corners, Edges, and Move)
  const handleStartDrag = (handle: DragHandleType, e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Capture pointer on the element so movement is tracked even outside the element
    const target = e.currentTarget;
    if (target && "setPointerCapture" in target) {
      try {
        target.setPointerCapture(e.pointerId);
      } catch {}
    }

    activeDragRef.current = {
      handle,
      startX: e.clientX,
      startY: e.clientY,
      initialBox: { ...cropBox },
    };

    const handlePointerMove = (moveEvt: PointerEvent) => {
      if (!activeDragRef.current || !imageFrameRef.current) return;
      const { handle: dragHandle, initialBox } = activeDragRef.current;
      const rect = imageFrameRef.current.getBoundingClientRect();

      if (rect.width <= 0 || rect.height <= 0) return;

      const currentClientX = moveEvt.clientX;
      const currentClientY = moveEvt.clientY;

      // Pointer positions as percentages of the image container (0% to 100%)
      const pointerXPct = Math.max(0, Math.min(100, ((currentClientX - rect.left) / rect.width) * 100));
      const pointerYPct = Math.max(0, Math.min(100, ((currentClientY - rect.top) / rect.height) * 100));

      const deltaXPct = ((currentClientX - activeDragRef.current.startX) / rect.width) * 100;
      const deltaYPct = ((currentClientY - activeDragRef.current.startY) / rect.height) * 100;

      const minSize = 8; // minimum width and height in percentage

      setCropBox(() => {
        let x = initialBox.x;
        let y = initialBox.y;
        let w = initialBox.width;
        let h = initialBox.height;

        if (dragHandle === "move") {
          // Move entire selection inside image boundaries
          x = Math.max(0, Math.min(100 - initialBox.width, initialBox.x + deltaXPct));
          y = Math.max(0, Math.min(100 - initialBox.height, initialBox.y + deltaYPct));
          return { x, y, width: w, height: h };
        }

        // --- Drag Corners & Edges with Direct Pointer Tracking ---

        // TOP resizing (handles: top-left, top, top-right)
        if (dragHandle === "top-left" || dragHandle === "top" || dragHandle === "top-right") {
          const maxY = initialBox.y + initialBox.height - minSize;
          y = Math.max(0, Math.min(maxY, pointerYPct));
          h = initialBox.y + initialBox.height - y;
        }

        // BOTTOM resizing (handles: bottom-left, bottom, bottom-right)
        if (dragHandle === "bottom-left" || dragHandle === "bottom" || dragHandle === "bottom-right") {
          const minY = initialBox.y + minSize;
          const targetY = Math.max(minY, Math.min(100, pointerYPct));
          h = targetY - initialBox.y;
        }

        // LEFT resizing (handles: top-left, left, bottom-left)
        if (dragHandle === "top-left" || dragHandle === "left" || dragHandle === "bottom-left") {
          const maxX = initialBox.x + initialBox.width - minSize;
          x = Math.max(0, Math.min(maxX, pointerXPct));
          w = initialBox.x + initialBox.width - x;
        }

        // RIGHT resizing (handles: top-right, right, bottom-right)
        if (dragHandle === "top-right" || dragHandle === "right" || dragHandle === "bottom-right") {
          const minX = initialBox.x + minSize;
          const targetX = Math.max(minX, Math.min(100, pointerXPct));
          w = targetX - initialBox.x;
        }

        return {
          x: Math.max(0, Math.min(100 - minSize, x)),
          y: Math.max(0, Math.min(100 - minSize, y)),
          width: Math.max(minSize, Math.min(100 - x, w)),
          height: Math.max(minSize, Math.min(100 - y, h)),
        };
      });
    };

    const handlePointerUp = (upEvt: PointerEvent) => {
      activeDragRef.current = null;
      if (target && "releasePointerCapture" in target) {
        try {
          target.releasePointerCapture(upEvt.pointerId);
        } catch {}
      }
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerUp);
  };

  // Perform Immediate Crop Action
  const handlePerformCrop = async () => {
    if (!uploadedImage) return;
    try {
      const croppedDataUrl = await cropImageCanvas(uploadedImage, cropBox);
      setUploadedImage(croppedDataUrl);
      setZoomLevel(1);
      setCropBox({ x: 2, y: 2, width: 96, height: 96 });
      setCropSuccessToast(true);
      setTimeout(() => setCropSuccessToast(false), 2000);
    } catch {}
  };

  // Crop & Continue Action
  const handleCropAndContinue = useCallback(async () => {
    if (!uploadedImage) return;
    let finalLogoUrl = uploadedImage;
    try {
      finalLogoUrl = await cropImageCanvas(uploadedImage, cropBox);
    } catch {
      finalLogoUrl = uploadedImage;
    }
    onApplyLogo(finalLogoUrl, logoName || "custom-logo.png");
    onClose();
  }, [uploadedImage, cropBox, logoName, onApplyLogo, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="brand-designer-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150 overflow-hidden"
    >
      {/* Click outside backdrop */}
      <div
        className="fixed inset-0 -z-10"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Main Modal Card: Fits viewport on desktop and mobile */}
      <div className="relative w-full max-w-4xl max-h-[92vh] sm:max-h-[88vh] flex flex-col overflow-hidden rounded-[22px] sm:rounded-[28px] bg-gradient-to-b from-[#FDF5F6] via-[#FAF0F2] to-[#F7E7EA] p-2.5 sm:p-4 md:p-5 shadow-2xl border border-rose-200/70">
        
        {/* Decorative Maroon Curved Bottom Waves */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 -z-0 h-24 w-36 sm:h-32 sm:w-48 -translate-x-6 translate-y-6 rounded-full bg-gradient-to-tr from-[#650B23] via-[#80011F] to-[#99193B] opacity-95 blur-[1px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 right-0 -z-0 h-28 w-44 sm:h-36 sm:w-56 translate-x-8 translate-y-8 rounded-full bg-gradient-to-tl from-[#650B23] via-[#80011F] to-[#99193B] opacity-95 blur-[1px]"
        />

        {/* Modal Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 sm:top-5 sm:right-5 z-30 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-white/95 text-[#80011F] shadow-md hover:bg-white hover:scale-105 transition-all cursor-pointer border border-rose-100"
        >
          <X size={18} />
        </button>

        {/* Inner Card Container */}
        <div className="relative z-10 flex flex-col flex-1 max-h-[89vh] sm:max-h-[84vh] overflow-hidden rounded-[18px] sm:rounded-[22px] bg-white shadow-sm border border-rose-100">
          
          {/* ======================================================== */}
          {/* CLEAN POPUP HEADER (NO PROCESS STEPS / STEP INDICATOR)   */}
          {/* ======================================================== */}
          <div className="flex items-center justify-between px-5 sm:px-7 py-3 sm:py-3.5 border-b border-rose-100 bg-white shrink-0 pr-14">
            <div className="flex items-center gap-2">
              <Image
                src="/logo.webp"
                alt="TeesZone — elevate your style with custom tees"
                width={150}
                height={30}
                className="h-7 sm:h-8 w-auto object-contain"
                priority
              />
            </div>
          </div>

          {/* ======================================================== */}
          {/* BODY: EMPTY STATE vs INTERACTIVE MANUAL CROPPER          */}
          {/* ======================================================== */}
          <div className="flex-1 overflow-y-auto px-4 py-3 sm:px-7 sm:py-5">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-7 items-start">
              
              {/* LEFT COLUMN: Title & 3 Feature Guidance Cards */}
              <div className="lg:col-span-4 flex flex-col">
                <h2
                  id="brand-designer-title"
                  className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#80011F]"
                >
                  Upload &amp; Crop Logo
                </h2>
                <p className="mt-1 text-xs text-[#736A6E]">
                  Position and crop your logo the way you want.
                </p>

                {/* 3 Guidance Rows */}
                <div className="flex flex-col gap-2.5 sm:gap-3 mt-4 sm:mt-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-[#FCECEF] text-[#80011F] border border-rose-200/50 shadow-xs shrink-0">
                      <Crop size={17} className="stroke-[2.2]" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-ink">Crop &amp; Adjust</h4>
                      <p className="text-[11px] text-[#736A6E]">Drag any corner or edge to trim</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-[#FCECEF] text-[#80011F] border border-rose-200/50 shadow-xs shrink-0">
                      <Scan size={17} className="stroke-[2.2]" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-ink">Keep It Clear</h4>
                      <p className="text-[11px] text-[#736A6E]">Use a high-resolution logo (PNG/JPG)</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-[#FCECEF] text-[#80011F] border border-rose-200/50 shadow-xs shrink-0">
                      <Sparkles size={17} className="stroke-[2.2]" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-ink">Best Results</h4>
                      <p className="text-[11px] text-[#736A6E]">Transparent background (PNG) recommended</p>
                    </div>
                  </div>
                </div>

                {/* Real-time Crop Preview Thumbnail (when logo is loaded) */}
                {uploadedImage && livePreviewUrl && (
                  <div className="mt-4 p-3 rounded-xl border border-rose-200/70 bg-[#FAF0F2]/50 flex items-center gap-3">
                    <div
                      style={{
                        backgroundImage: `
                          linear-gradient(45deg, #e5e5e5 25%, transparent 25%),
                          linear-gradient(-45deg, #e5e5e5 25%, transparent 25%),
                          linear-gradient(45deg, transparent 75%, #e5e5e5 75%),
                          linear-gradient(-45deg, transparent 75%, #e5e5e5 75%)
                        `,
                        backgroundSize: "8px 8px",
                      }}
                      className="h-12 w-12 rounded-lg border border-line overflow-hidden flex items-center justify-center p-1 bg-white shrink-0"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={livePreviewUrl}
                        alt="Crop preview"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-[#80011F] leading-tight">Live Crop Preview</p>
                      <p className="text-[10px] text-[#736A6E] truncate">This exact selection will be printed</p>
                    </div>
                  </div>
                )}
              </div>

              {/* RIGHT COLUMN: EMPTY UPLOAD DROPZONE vs REAL INTERACTIVE CROPPER */}
              <div className="lg:col-span-8 flex flex-col">
                
                {!uploadedImage ? (
                  /* ======================================================== */
                  /* 1. INITIAL EMPTY LOGO UPLOAD STATE (NO SAMPLE LOGO)      */
                  /* ======================================================== */
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`group flex min-h-[220px] sm:min-h-[270px] w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed px-5 py-8 text-center transition-all cursor-pointer ${
                      isDraggingFileOver
                        ? "border-[#80011F] bg-[#FAF0F2] scale-[0.99]"
                        : "border-[#80011F]/35 bg-[#FAF0F2]/45 hover:border-[#80011F] hover:bg-[#FAF0F2]/80"
                    }`}
                  >
                    {/* Upload Icon Badge */}
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FCECEF] text-[#80011F] shadow-sm transition-transform group-hover:scale-110 mb-3.5">
                      <Upload size={24} className="stroke-[2.2]" />
                    </div>

                    {/* Heading */}
                    <h3 className="text-base sm:text-lg font-extrabold text-[#80011F]">
                      Upload Your Logo
                    </h3>

                    {/* Description */}
                    <p className="mt-1 text-xs text-[#736A6E] max-w-sm">
                      Upload your company logo to get started.
                    </p>

                    {/* Action Text */}
                    <div className="mt-3.5 flex items-center gap-1.5 text-xs text-ink font-semibold">
                      <span>Drag &amp; drop your logo here</span>
                      <span className="text-[#80011F] underline underline-offset-2 hover:opacity-85">
                        or browse files
                      </span>
                    </div>

                    {/* Format and Size Guidance */}
                    <p className="mt-2 text-[11px] text-[#736A6E]/80">
                      Supported formats: <strong>PNG, JPG, JPEG</strong> (transparent PNG recommended)
                    </p>
                    <p className="mt-0.5 text-[10px] text-[#736A6E]/60">
                      Max file size: 25MB • High resolution
                    </p>
                  </div>
                ) : (
                  /* ======================================================== */
                  /* 2. AFTER UPLOADING: FULLY FUNCTIONAL MANUAL CROPPER      */
                  /* ======================================================== */
                  <>
                    {/* Mode Buttons: [ Crop ] & [ Zoom ] */}
                    <div className="flex items-center justify-end gap-2 mb-2">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveMode("crop");
                          handlePerformCrop();
                        }}
                        title="Crop selection"
                        className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                          activeMode === "crop"
                            ? "bg-[#80011F] text-white shadow-sm"
                            : "bg-white border border-gray-300 text-ink hover:border-[#80011F]"
                        }`}
                      >
                        <Crop size={14} />
                        <span>Crop</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveMode(activeMode === "zoom" ? "crop" : "zoom")}
                        title="Zoom adjustment"
                        className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                          activeMode === "zoom"
                            ? "bg-[#80011F] text-white shadow-sm"
                            : "bg-white border border-gray-300 text-ink hover:border-[#80011F]"
                        }`}
                      >
                        <ZoomIn size={14} />
                        <span>Zoom</span>
                      </button>
                    </div>

                    {/* Zoom Slider Control (shown when Zoom mode is active) */}
                    {activeMode === "zoom" && (
                      <div className="flex items-center gap-2.5 mb-2 px-3 py-1.5 rounded-xl bg-surface border border-line animate-in fade-in duration-150">
                        <ZoomOut size={14} className="text-body shrink-0" />
                        <input
                          type="range"
                          min="1"
                          max="2.5"
                          step="0.05"
                          value={zoomLevel}
                          onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
                          className="w-full accent-[#80011F] cursor-pointer"
                        />
                        <ZoomIn size={14} className="text-body shrink-0" />
                        <span className="text-xs font-bold text-[#80011F] w-10 text-right shrink-0">
                          {Math.round(zoomLevel * 100)}%
                        </span>
                      </div>
                    )}

                    {/* Checkerboard Canvas Container */}
                    <div
                      style={{
                        backgroundImage: `
                          linear-gradient(45deg, #f0f0f0 25%, transparent 25%),
                          linear-gradient(-45deg, #f0f0f0 25%, transparent 25%),
                          linear-gradient(45deg, transparent 75%, #f0f0f0 75%),
                          linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)
                        `,
                        backgroundSize: "14px 14px",
                        backgroundPosition: "0 0, 0 7px, 7px -7px, -7px 0px",
                      }}
                      className="relative h-[220px] sm:h-[260px] md:h-[280px] w-full rounded-2xl border border-gray-200/90 overflow-hidden flex items-center justify-center p-3 sm:p-4 bg-[#FAFAFA] select-none touch-none"
                    >
                      {/* Toast when cropped */}
                      {cropSuccessToast && (
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 bg-[#80011F] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md animate-in fade-in duration-200">
                          ✓ Logo Cropped Successfully!
                        </div>
                      )}

                      {/* Image Frame Container: sized strictly to the rendered image bounds */}
                      <div
                        ref={imageFrameRef}
                        style={{
                          transform: `scale(${zoomLevel})`,
                          transformOrigin: "center center",
                          transition: "transform 150ms ease-out",
                        }}
                        className="relative max-h-full max-w-full inline-flex items-center justify-center select-none"
                      >
                        {/* The Actual Uploaded Image */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          ref={imageElementRef}
                          src={uploadedImage}
                          alt={logoName || "Uploaded Logo"}
                          draggable={false}
                          className="max-h-[190px] sm:max-h-[230px] md:max-h-[250px] max-w-full w-auto h-auto object-contain drop-shadow-sm pointer-events-none select-none block"
                        />

                        {/* Dimming Mask: Darkens the area outside the crop box */}
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            boxShadow: `0 0 0 9999px rgba(0, 0, 0, 0.4)`,
                            clipPath: `polygon(
                              0% 0%, 0% 100%, 
                              ${cropBox.x}% 100%, 
                              ${cropBox.x}% ${cropBox.y}%, 
                              ${cropBox.x + cropBox.width}% ${cropBox.y}%, 
                              ${cropBox.x + cropBox.width}% ${cropBox.y + cropBox.height}%, 
                              ${cropBox.x}% ${cropBox.y + cropBox.height}%, 
                              ${cropBox.x}% 100%, 
                              100% 100%, 100% 0%
                            )`,
                          }}
                        />

                        {/* Interactive Crop Box Overlay with Dark Red Border */}
                        <div
                          style={{
                            left: `${cropBox.x}%`,
                            top: `${cropBox.y}%`,
                            width: `${cropBox.width}%`,
                            height: `${cropBox.height}%`,
                          }}
                          onPointerDown={(e) => handleStartDrag("move", e)}
                          className="absolute border-2 border-[#80011F] rounded-xs cursor-move bg-transparent touch-none"
                        >
                          {/* Rule-of-Thirds Grid Lines */}
                          <div className="absolute inset-0 pointer-events-none opacity-30 flex flex-col justify-between p-0.5">
                            <div className="w-full border-b border-dashed border-white" />
                            <div className="w-full border-b border-dashed border-white" />
                          </div>
                          <div className="absolute inset-0 pointer-events-none opacity-30 flex justify-between p-0.5">
                            <div className="h-full border-r border-dashed border-white" />
                            <div className="h-full border-r border-dashed border-white" />
                          </div>

                          {/* ======================================================== */}
                          {/* 4 DRAGGABLE INDEPENDENT EDGE HANDLES                     */}
                          {/* ======================================================== */}
                          {/* Top Edge */}
                          <div
                            onPointerDown={(e) => handleStartDrag("top", e)}
                            className="absolute -top-1.5 inset-x-2 h-3 cursor-ns-resize hover:bg-[#80011F]/30 active:bg-[#80011F]/50 transition-colors"
                            title="Drag top edge"
                          />
                          {/* Bottom Edge */}
                          <div
                            onPointerDown={(e) => handleStartDrag("bottom", e)}
                            className="absolute -bottom-1.5 inset-x-2 h-3 cursor-ns-resize hover:bg-[#80011F]/30 active:bg-[#80011F]/50 transition-colors"
                            title="Drag bottom edge"
                          />
                          {/* Left Edge */}
                          <div
                            onPointerDown={(e) => handleStartDrag("left", e)}
                            className="absolute -left-1.5 inset-y-2 w-3 cursor-ew-resize hover:bg-[#80011F]/30 active:bg-[#80011F]/50 transition-colors"
                            title="Drag left edge"
                          />
                          {/* Right Edge */}
                          <div
                            onPointerDown={(e) => handleStartDrag("right", e)}
                            className="absolute -right-1.5 inset-y-2 w-3 cursor-ew-resize hover:bg-[#80011F]/30 active:bg-[#80011F]/50 transition-colors"
                            title="Drag right edge"
                          />

                          {/* ======================================================== */}
                          {/* 4 DRAGGABLE INDEPENDENT CORNER HANDLES                   */}
                          {/* ======================================================== */}
                          {/* Top-Left Corner Handle */}
                          <div
                            onPointerDown={(e) => handleStartDrag("top-left", e)}
                            className="absolute -top-2.5 -left-2.5 h-5 w-5 sm:h-5.5 sm:w-5.5 rounded-full border-2 border-[#80011F] bg-white shadow-md cursor-nwse-resize hover:scale-125 active:scale-125 transition-transform"
                            title="Drag top-left corner"
                          />

                          {/* Top-Right Corner Handle */}
                          <div
                            onPointerDown={(e) => handleStartDrag("top-right", e)}
                            className="absolute -top-2.5 -right-2.5 h-5 w-5 sm:h-5.5 sm:w-5.5 rounded-full border-2 border-[#80011F] bg-white shadow-md cursor-nesw-resize hover:scale-125 active:scale-125 transition-transform"
                            title="Drag top-right corner"
                          />

                          {/* Bottom-Left Corner Handle */}
                          <div
                            onPointerDown={(e) => handleStartDrag("bottom-left", e)}
                            className="absolute -bottom-2.5 -left-2.5 h-5 w-5 sm:h-5.5 sm:w-5.5 rounded-full border-2 border-[#80011F] bg-white shadow-md cursor-nesw-resize hover:scale-125 active:scale-125 transition-transform"
                            title="Drag bottom-left corner"
                          />

                          {/* Bottom-Right Corner Handle */}
                          <div
                            onPointerDown={(e) => handleStartDrag("bottom-right", e)}
                            className="absolute -bottom-2.5 -right-2.5 h-5 w-5 sm:h-5.5 sm:w-5.5 rounded-full border-2 border-[#80011F] bg-white shadow-md cursor-nwse-resize hover:scale-125 active:scale-125 transition-transform"
                            title="Drag bottom-right corner"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* BOTTOM FOOTER: [ Replace Logo ] & [ Crop & Continue ]    */}
          {/* ======================================================== */}

          {/* DESKTOP FOOTER */}
          <div className="hidden sm:flex items-center justify-between gap-4 px-5 sm:px-7 py-3 border-t border-rose-100 bg-white shrink-0">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 rounded-xl border-2 border-[#80011F] bg-white px-5 sm:px-6 py-2 text-xs sm:text-sm font-bold text-[#80011F] hover:bg-rose-50/60 shadow-xs transition-all cursor-pointer"
            >
              <Upload size={15} />
              <span>{uploadedImage ? "Replace Logo" : "Upload Logo"}</span>
            </button>

            <button
              type="button"
              disabled={!uploadedImage}
              onClick={handleCropAndContinue}
              className={`flex items-center gap-2 rounded-xl px-6 sm:px-8 py-2 text-xs sm:text-sm font-bold transition-all ${
                uploadedImage
                  ? "bg-[#80011F] hover:bg-[#680119] text-white shadow-md hover:shadow-lg cursor-pointer"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed opacity-60"
              }`}
            >
              <span>Crop &amp; Continue</span>
              <ArrowRight size={15} />
            </button>
          </div>

          {/* MOBILE FOOTER (Stacked) */}
          <div className="flex sm:hidden flex-col gap-1.5 px-3 py-2 border-t border-rose-100 bg-white shrink-0">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-1.5 rounded-lg border-2 border-[#80011F] bg-white py-2 text-xs font-bold text-[#80011F] hover:bg-rose-50/60 shadow-xs transition-all cursor-pointer"
            >
              <Upload size={14} />
              <span>{uploadedImage ? "Replace Logo" : "Upload Logo"}</span>
            </button>

            <button
              type="button"
              disabled={!uploadedImage}
              onClick={handleCropAndContinue}
              className={`w-full flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition-all ${
                uploadedImage
                  ? "bg-[#80011F] hover:bg-[#680119] text-white shadow-md cursor-pointer"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed opacity-60"
              }`}
            >
              <span>Crop &amp; Continue</span>
              <ArrowRight size={14} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
