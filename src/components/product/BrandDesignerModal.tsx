"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Crop,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  RotateCw,
  RefreshCw,
  Upload,
  ArrowRight,
  Check,
  X,
  Sparkles,
  Scan,
  Menu,
  Search,
  ShoppingBag,
} from "lucide-react";

interface BrandDesignerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyLogo: (logoUrl: string, logoName: string) => void;
  currentLogoUrl?: string | null;
  currentLogoName?: string | null;
}

/**
 * High-precision canvas crop function supporting transparency, custom angles, and zoom.
 */
function cropImageCanvas(
  sourceUrl: string,
  cropArea: { x: number; y: number; width: number; height: number },
  rotationDeg: number,
  zoomScale: number
): Promise<string> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const origW = img.naturalWidth || img.width || 400;
      const origH = img.naturalHeight || img.height || 200;

      // 1. Calculate dimensions for rotated image
      const rad = (rotationDeg * Math.PI) / 180;
      const cos = Math.abs(Math.cos(rad));
      const sin = Math.abs(Math.sin(rad));
      const rotW = Math.round(origW * cos + origH * sin);
      const rotH = Math.round(origW * sin + origH * cos);

      const rotCanvas = document.createElement("canvas");
      rotCanvas.width = rotW;
      rotCanvas.height = rotH;
      const rotCtx = rotCanvas.getContext("2d");

      if (!rotCtx) {
        resolve(sourceUrl);
        return;
      }

      // Ensure transparent background is preserved
      rotCtx.clearRect(0, 0, rotW, rotH);

      // Draw rotated and scaled image onto rotated canvas
      rotCtx.translate(rotW / 2, rotH / 2);
      rotCtx.rotate(rad);
      rotCtx.scale(zoomScale, zoomScale);
      rotCtx.drawImage(img, -origW / 2, -origH / 2);

      // 2. Crop area coordinates mapped to the rotated canvas
      const cropX = Math.max(0, Math.round((cropArea.x / 100) * rotW));
      const cropY = Math.max(0, Math.round((cropArea.y / 100) * rotH));
      const cropW = Math.max(16, Math.min(rotW - cropX, Math.round((cropArea.width / 100) * rotW)));
      const cropH = Math.max(16, Math.min(rotH - cropY, Math.round((cropArea.height / 100) * rotH)));

      const finalCanvas = document.createElement("canvas");
      finalCanvas.width = cropW;
      finalCanvas.height = cropH;
      const finalCtx = finalCanvas.getContext("2d");

      if (!finalCtx) {
        resolve(sourceUrl);
        return;
      }

      // Preserve alpha channel / transparency
      finalCtx.clearRect(0, 0, cropW, cropH);
      finalCtx.drawImage(rotCanvas, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);

      resolve(finalCanvas.toDataURL("image/png"));
    };

    img.onerror = () => {
      resolve(sourceUrl);
    };

    img.src = sourceUrl;
  });
}

export function BrandDesignerModal({
  isOpen,
  onClose,
  onApplyLogo,
  currentLogoUrl,
  currentLogoName,
}: BrandDesignerModalProps) {
  // Mode: "crop" or "zoom"
  const [activeMode, setActiveMode] = useState<"crop" | "zoom">("crop");

  // Initial state: EMPTY when user opens the popup fresh!
  // MUST NOT display TeesZone logo or any default sample image inside the crop area.
  const [uploadedImage, setUploadedImage] = useState<string | null>(() => currentLogoUrl || null);
  const [originalUpload, setOriginalUpload] = useState<string | null>(() => currentLogoUrl || null);
  const [logoName, setLogoName] = useState<string>(() => currentLogoName || "");
  const [isDraggingFileOver, setIsDraggingFileOver] = useState<boolean>(false);
  const [cropSuccessToast, setCropSuccessToast] = useState<boolean>(false);

  // Transformations
  const [rotation, setRotation] = useState<number>(0);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Crop Box Coordinates (Percentages: 0-100% relative to the image frame)
  const [cropBox, setCropBox] = useState<{ x: number; y: number; width: number; height: number }>({
    x: 5,
    y: 5,
    width: 90,
    height: 90,
  });
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imageFrameRef = useRef<HTMLDivElement | null>(null);
  const dragActionRef = useRef<"move" | "top-left" | "top-right" | "bottom-left" | "bottom-right" | null>(null);
  const dragStartPosRef = useRef<{ clientX: number; clientY: number }>({ clientX: 0, clientY: 0 });
  const dragStartBoxRef = useRef(cropBox);

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

  // File Upload Logic
  const processUploadedFile = (file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const dataUrl = event.target.result as string;
        setUploadedImage(dataUrl);
        setOriginalUpload(dataUrl);
        setLogoName(file.name);
        setRotation(0);
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

  // Rotation: 90-degree steps
  const handleRotateLeft = () => setRotation((prev) => (prev - 90 + 360) % 360);
  const handleRotateRight = () => setRotation((prev) => (prev + 90) % 360);

  // Reset to original uploaded image
  const handleReset = () => {
    if (!originalUpload) return;
    setUploadedImage(originalUpload);
    setRotation(0);
    setZoomLevel(1);
    setCropBox({ x: 5, y: 5, width: 90, height: 90 });
    setActiveMode("crop");
    setCropSuccessToast(false);
  };

  // Dragging crop box and corner handles
  const handleStartDrag = (
    action: "move" | "top-left" | "top-right" | "bottom-left" | "bottom-right",
    e: React.MouseEvent | React.TouchEvent
  ) => {
    e.preventDefault();
    e.stopPropagation();
    dragActionRef.current = action;
    setIsDragging(true);
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
    dragStartPosRef.current = { clientX, clientY };
    dragStartBoxRef.current = { ...cropBox };

    const handlePointerMove = (moveEvt: MouseEvent | TouchEvent) => {
      if (!dragActionRef.current || !imageFrameRef.current) return;
      const curX = "touches" in moveEvt ? moveEvt.touches[0].clientX : moveEvt.clientX;
      const curY = "touches" in moveEvt ? moveEvt.touches[0].clientY : moveEvt.clientY;

      const deltaXPixels = curX - dragStartPosRef.current.clientX;
      const deltaYPixels = curY - dragStartPosRef.current.clientY;

      const rect = imageFrameRef.current.getBoundingClientRect();
      const deltaXPct = (deltaXPixels / rect.width) * 100;
      const deltaYPct = (deltaYPixels / rect.height) * 100;

      const init = dragStartBoxRef.current;
      const actionType = dragActionRef.current;

      setCropBox(() => {
        let newX = init.x;
        let newY = init.y;
        let newW = init.width;
        let newH = init.height;

        if (actionType === "move") {
          // Dragging inside selection: move entire box within 0-100% bounds
          newX = Math.max(0, Math.min(100 - init.width, init.x + deltaXPct));
          newY = Math.max(0, Math.min(100 - init.height, init.y + deltaYPct));
        } else {
          // Dragging individual corner handles
          if (actionType.includes("top")) {
            newY = Math.max(0, Math.min(init.y + deltaYPct, init.y + init.height - 10));
            newH = init.height - (newY - init.y);
          }
          if (actionType.includes("bottom")) {
            newH = Math.max(10, Math.min(100 - init.y, init.height + deltaYPct));
          }
          if (actionType.includes("left")) {
            newX = Math.max(0, Math.min(init.x + deltaXPct, init.x + init.width - 10));
            newW = init.width - (newX - init.x);
          }
          if (actionType.includes("right")) {
            newW = Math.max(10, Math.min(100 - init.x, init.width + deltaXPct));
          }
        }

        return { x: newX, y: newY, width: newW, height: newH };
      });
    };

    const handlePointerUp = () => {
      dragActionRef.current = null;
      setIsDragging(false);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseup", handlePointerUp);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("touchend", handlePointerUp);
    };

    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("mouseup", handlePointerUp);
    window.addEventListener("touchmove", handlePointerMove);
    window.addEventListener("touchend", handlePointerUp);
  };

  // Perform Actual Image Cropping
  const handlePerformCrop = async () => {
    if (!uploadedImage) return;
    try {
      const croppedDataUrl = await cropImageCanvas(
        uploadedImage,
        cropBox,
        rotation,
        zoomLevel
      );
      setUploadedImage(croppedDataUrl);
      setRotation(0);
      setZoomLevel(1);
      setCropBox({ x: 2, y: 2, width: 96, height: 96 });
      setCropSuccessToast(true);
      setTimeout(() => setCropSuccessToast(false), 2000);
    } catch {
      // Fallback
    }
  };

  // Crop & Continue Action: generates actual cropped image and sends to parent
  const handleCropAndContinue = useCallback(async () => {
    if (!uploadedImage) return;
    let finalLogoUrl = uploadedImage;
    try {
      finalLogoUrl = await cropImageCanvas(
        uploadedImage,
        cropBox,
        rotation,
        zoomLevel
      );
    } catch {
      finalLogoUrl = uploadedImage;
    }
    onApplyLogo(finalLogoUrl, logoName || "custom-logo.png");
    onClose();
  }, [uploadedImage, cropBox, rotation, zoomLevel, logoName, onApplyLogo, onClose]);

  if (!isOpen) return null;

  const isRotatedQuarterTurn = rotation === 90 || rotation === 270;

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

      {/* Main Modal Card: Responsive with exact max-height to fit both desktop & mobile screens */}
      <div className="relative w-full max-w-4xl max-h-[94vh] sm:max-h-[90vh] flex flex-col overflow-hidden rounded-[22px] sm:rounded-[28px] bg-gradient-to-b from-[#FDF5F6] via-[#FAF0F2] to-[#F7E7EA] p-2.5 sm:p-4 md:p-5 shadow-2xl border border-rose-200/70">
        
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
          aria-label="Close brand designer"
          className="absolute top-4 right-4 sm:top-5 sm:right-5 z-30 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-white/95 text-[#80011F] shadow-md hover:bg-white hover:scale-105 transition-all cursor-pointer border border-rose-100"
        >
          <X size={18} />
        </button>

        {/* Inner Card: Flex layout containing header, scrollable body, and footer */}
        <div className="relative z-10 flex flex-col flex-1 max-h-[91vh] sm:max-h-[86vh] overflow-hidden rounded-[18px] sm:rounded-[22px] bg-white shadow-sm border border-rose-100">
          
          {/* ======================================================== */}
          {/* TOP HEADER: EXACT TEESZONE LOGO & 4-STEP STEPPER */}
          {/* ======================================================== */}

          {/* DESKTOP HEADER */}
          <div className="hidden sm:flex items-center justify-between gap-4 px-5 sm:px-7 py-3 sm:py-3.5 border-b border-rose-100 bg-white shrink-0">
            {/* Authentic TeesZone Logo from /logo.webp */}
            <div className="flex items-center gap-2">
              <Image
                src="/logo.webp"
                alt="TeesZone — elevate your style with custom tees"
                width={150}
                height={30}
                className="h-7 md:h-8 w-auto object-contain"
                priority
              />
            </div>

            {/* Stepper with Checkmark & Active Pill */}
            <nav aria-label="Progress" className="flex items-center gap-2 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1A1A1A] text-white font-bold text-[10px]">
                  <Check size={11} className="stroke-[3]" />
                </div>
                <span className="font-semibold text-ink whitespace-nowrap">Select Product</span>
              </div>

              <div className="h-0.5 w-6 bg-gray-200" />

              <div className="flex items-center gap-1.5">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#80011F] text-white font-bold text-[10px]">
                  2
                </div>
                <span className="font-bold text-[#80011F] whitespace-nowrap">Upload &amp; Crop Logo</span>
              </div>

              <div className="h-0.5 w-6 bg-gray-200" />

              <div className="flex items-center gap-1.5 opacity-60">
                <div className="flex h-5 w-5 items-center justify-center rounded-full border border-gray-300 text-gray-400 text-[10px]">
                  3
                </div>
                <span className="font-medium text-gray-500 whitespace-nowrap">Customize</span>
              </div>

              <div className="h-0.5 w-6 bg-gray-200" />

              <div className="flex items-center gap-1.5 opacity-60">
                <div className="flex h-5 w-5 items-center justify-center rounded-full border border-gray-300 text-gray-400 text-[10px]">
                  4
                </div>
                <span className="font-medium text-gray-500 whitespace-nowrap">Review &amp; Order</span>
              </div>
            </nav>
          </div>

          {/* MOBILE HEADER */}
          <div className="flex sm:hidden flex-col gap-2 px-3.5 py-2.5 border-b border-rose-100 bg-white shrink-0">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="p-1 text-ink"
                aria-label="Navigation menu"
              >
                <Menu size={18} />
              </button>
              
              <Image
                src="/logo.webp"
                alt="TeesZone"
                width={120}
                height={24}
                className="h-5.5 w-auto object-contain"
                priority
              />

              <div className="flex items-center gap-2 text-ink">
                <Search size={16} />
                <ShoppingBag size={16} />
              </div>
            </div>

            {/* Mobile Stepper Row */}
            <div className="flex items-center justify-center gap-2 pt-0.5">
              <div className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#1A1A1A] text-white text-[9px] font-bold">
                <Check size={9} className="stroke-[3]" />
              </div>
              <div className="h-0.5 w-6 bg-gray-200" />
              <div className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[#80011F] text-white text-[9px] font-bold">
                2
              </div>
              <div className="h-0.5 w-6 bg-gray-200" />
              <div className="flex h-4.5 w-4.5 items-center justify-center rounded-full border border-gray-300 text-gray-400 text-[9px]">
                3
              </div>
              <div className="h-0.5 w-6 bg-gray-200" />
              <div className="flex h-4.5 w-4.5 items-center justify-center rounded-full border border-gray-300 text-gray-400 text-[9px]">
                4
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* BODY: EMPTY STATE (INITIAL) vs CROP STATE (AFTER UPLOAD) */}
          {/* ======================================================== */}
          <div className="flex-1 overflow-y-auto px-4 py-3 sm:px-7 sm:py-5">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-7 items-start">
              
              {/* LEFT COLUMN: Title & 3 Guidance Cards */}
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

                {/* 3 Guidance Rows (Desktop) */}
                <div className="hidden lg:flex flex-col gap-3 mt-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FCECEF] text-[#80011F] border border-rose-200/50 shadow-xs shrink-0">
                      <Crop size={18} className="stroke-[2.2]" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-ink">Crop &amp; Adjust</h4>
                      <p className="text-[11px] text-[#736A6E]">Trim unwanted areas</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FCECEF] text-[#80011F] border border-rose-200/50 shadow-xs shrink-0">
                      <Scan size={18} className="stroke-[2.2]" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-ink">Keep It Clear</h4>
                      <p className="text-[11px] text-[#736A6E]">Use a high-resolution logo (PNG/JPG)</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FCECEF] text-[#80011F] border border-rose-200/50 shadow-xs shrink-0">
                      <Sparkles size={18} className="stroke-[2.2]" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-ink">Best Results</h4>
                      <p className="text-[11px] text-[#736A6E]">A transparent background (PNG) is recommended</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: EMPTY DROPZONE vs INTERACTIVE CROP CANVAS */}
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

                    {/* Subtitle */}
                    <p className="mt-1 text-xs text-[#736A6E] max-w-sm">
                      Upload your company logo to get started.
                    </p>

                    {/* Drag and Drop text */}
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
                  /* 2. AFTER UPLOADING: INTERACTIVE MANUAL CROPPER           */
                  /* ======================================================== */
                  <>
                    {/* Mode Buttons: [ Crop ] & [ Zoom ] */}
                    <div className="hidden sm:flex items-center justify-end gap-2 mb-2.5">
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
                        onClick={() => setActiveMode("zoom")}
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
                      className="relative h-[210px] sm:h-[250px] md:h-[270px] w-full rounded-2xl border border-gray-200/90 overflow-hidden flex items-center justify-center p-3 sm:p-4 bg-[#FAFAFA] select-none"
                    >
                      {/* Toast when cropped */}
                      {cropSuccessToast && (
                        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 bg-[#80011F] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md animate-in fade-in duration-200">
                          ✓ Logo Cropped Successfully!
                        </div>
                      )}

                      {/* Image Frame: Holds the uploaded image and crop box */}
                      <div
                        ref={imageFrameRef}
                        style={{
                          transform: `rotate(${rotation}deg) scale(${zoomLevel})`,
                          transition: isDragging ? "none" : "transform 150ms cubic-bezier(0.4, 0, 0.2, 1)",
                          maxWidth: isRotatedQuarterTurn ? "180px" : "85%",
                          maxHeight: isRotatedQuarterTurn ? "180px" : "85%",
                        }}
                        className="relative flex items-center justify-center select-none"
                      >
                        {/* Actual Uploaded Logo ONLY (No TeesZone Logo or Sample Artwork) */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={uploadedImage}
                          alt={logoName || "Uploaded Logo"}
                          className="max-h-[170px] sm:max-h-[210px] max-w-full object-contain drop-shadow-sm pointer-events-none select-none block"
                        />

                        {/* Dimming Mask: Darkens area outside the crop selection */}
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            boxShadow: `0 0 0 9999px rgba(0, 0, 0, 0.35)`,
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

                        {/* Fully Interactive Crop Box Overlay with Dark Red Border & 4 Draggable Handles */}
                        <div
                          style={{
                            left: `${cropBox.x}%`,
                            top: `${cropBox.y}%`,
                            width: `${cropBox.width}%`,
                            height: `${cropBox.height}%`,
                          }}
                          onMouseDown={(e) => handleStartDrag("move", e)}
                          onTouchStart={(e) => handleStartDrag("move", e)}
                          className="absolute border-2 border-[#80011F] rounded-xs cursor-move bg-transparent"
                        >
                          {/* Inner Rule-of-Thirds Grid Lines */}
                          <div className="absolute inset-0 pointer-events-none opacity-30 flex flex-col justify-between p-0.5">
                            <div className="w-full border-b border-dashed border-white" />
                            <div className="w-full border-b border-dashed border-white" />
                          </div>
                          <div className="absolute inset-0 pointer-events-none opacity-30 flex justify-between p-0.5">
                            <div className="h-full border-r border-dashed border-white" />
                            <div className="h-full border-r border-dashed border-white" />
                          </div>

                          {/* 4 Draggable Corner Handles */}
                          {/* Top-Left Corner Handle */}
                          <div
                            onMouseDown={(e) => handleStartDrag("top-left", e)}
                            onTouchStart={(e) => handleStartDrag("top-left", e)}
                            className="absolute -top-2.5 -left-2.5 h-5 w-5 rounded-full border-2 border-[#80011F] bg-white shadow-md cursor-nwse-resize hover:scale-125 active:scale-125 transition-transform"
                          />

                          {/* Top-Right Corner Handle */}
                          <div
                            onMouseDown={(e) => handleStartDrag("top-right", e)}
                            onTouchStart={(e) => handleStartDrag("top-right", e)}
                            className="absolute -top-2.5 -right-2.5 h-5 w-5 rounded-full border-2 border-[#80011F] bg-white shadow-md cursor-nesw-resize hover:scale-125 active:scale-125 transition-transform"
                          />

                          {/* Bottom-Left Corner Handle */}
                          <div
                            onMouseDown={(e) => handleStartDrag("bottom-left", e)}
                            onTouchStart={(e) => handleStartDrag("bottom-left", e)}
                            className="absolute -bottom-2.5 -left-2.5 h-5 w-5 rounded-full border-2 border-[#80011F] bg-white shadow-md cursor-nesw-resize hover:scale-125 active:scale-125 transition-transform"
                          />

                          {/* Bottom-Right Corner Handle */}
                          <div
                            onMouseDown={(e) => handleStartDrag("bottom-right", e)}
                            onTouchStart={(e) => handleStartDrag("bottom-right", e)}
                            className="absolute -bottom-2.5 -right-2.5 h-5 w-5 rounded-full border-2 border-[#80011F] bg-white shadow-md cursor-nwse-resize hover:scale-125 active:scale-125 transition-transform"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Mobile Toggles */}
                    <div className="flex sm:hidden items-center gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveMode("crop");
                          handlePerformCrop();
                        }}
                        className={`flex-1 flex items-center justify-center gap-1 rounded-xl py-1.5 text-xs font-bold transition-all cursor-pointer ${
                          activeMode === "crop"
                            ? "bg-[#80011F] text-white shadow-xs"
                            : "bg-white border border-gray-300 text-ink"
                        }`}
                      >
                        <Crop size={13} />
                        <span>Crop</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveMode("zoom")}
                        className={`flex-1 flex items-center justify-center gap-1 rounded-xl py-1.5 text-xs font-bold transition-all cursor-pointer ${
                          activeMode === "zoom"
                            ? "bg-[#80011F] text-white shadow-xs"
                            : "bg-white border border-gray-300 text-ink"
                        }`}
                      >
                        <ZoomIn size={13} />
                        <span>Zoom</span>
                      </button>
                    </div>

                    {/* Zoom Slider Control (when Zoom mode active) */}
                    {activeMode === "zoom" && (
                      <div className="flex items-center gap-2.5 mt-2 px-3 py-1.5 rounded-xl bg-surface border border-line animate-in fade-in duration-150">
                        <ZoomOut size={14} className="text-body" />
                        <input
                          type="range"
                          min="0.6"
                          max="2.5"
                          step="0.05"
                          value={zoomLevel}
                          onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
                          className="w-full accent-[#80011F] cursor-pointer"
                        />
                        <ZoomIn size={14} className="text-body" />
                        <span className="text-xs font-bold text-[#80011F] w-10 text-right">
                          {Math.round(zoomLevel * 100)}%
                        </span>
                      </div>
                    )}

                    {/* Action Buttons: Rotate Left, Rotate Right & Reset */}
                    <div className="grid grid-cols-3 gap-2 sm:flex sm:items-center sm:justify-center sm:gap-3 mt-2.5 sm:mt-3">
                      <button
                        type="button"
                        onClick={handleRotateLeft}
                        className="flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 px-3 py-1.5 text-xs font-semibold text-ink shadow-xs transition-all cursor-pointer"
                      >
                        <RotateCcw size={14} className="text-[#80011F]" />
                        <span className="whitespace-nowrap">Rotate Left</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleRotateRight}
                        className="flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 px-3 py-1.5 text-xs font-semibold text-ink shadow-xs transition-all cursor-pointer"
                      >
                        <RotateCw size={14} className="text-[#80011F]" />
                        <span className="whitespace-nowrap">Rotate Right</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleReset}
                        className="flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 px-3 py-1.5 text-xs font-semibold text-ink shadow-xs transition-all cursor-pointer"
                      >
                        <RefreshCw size={14} className="text-[#80011F]" />
                        <span className="whitespace-nowrap">Reset</span>
                      </button>
                    </div>

                    {/* Mobile "For best results" Info Banner */}
                    <div className="flex sm:hidden items-start gap-2 mt-2.5 p-2.5 rounded-xl bg-[#FCEBED] border border-rose-200/60 text-left">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[#80011F] shrink-0 mt-0.5 shadow-xs">
                        <Sparkles size={11} className="stroke-[2.2]" />
                      </div>
                      <div>
                        <h5 className="text-[11px] font-bold text-[#80011F]">For best results</h5>
                        <p className="text-[10px] text-[#736A6E] leading-relaxed">
                          Use a high-resolution logo (PNG/JPG) with a transparent background (PNG) if possible.
                        </p>
                      </div>
                    </div>
                  </>
                )}

              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* BOTTOM FOOTER: [ Replace Logo ] & [ Crop & Continue ] */}
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
