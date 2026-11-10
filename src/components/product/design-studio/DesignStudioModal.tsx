"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CloudUpload,
  Eye,
  EyeOff,
  Layers,
  Lock,
  Minus,
  Palette,
  Plus,
  RotateCcw,
  RotateCw,
  Scan,
  ShieldCheck,
  Sparkles,
  Trash2,
  Type,
  Unlock,
  Upload,
  X,
} from "lucide-react";
import type { Product, ProductColor } from "@/lib/types";
import {
  CropArea,
  cropImageCanvas,
  removeBackgroundCanvas,
  enhanceLogoCanvas,
  generateCompositeGarment,
} from "./canvasUtils";

export interface StudioElement {
  id: string;
  type: "logo" | "text" | "shape";
  name: string;
  // Position as percentage of printable area (0 - 100)
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number; // degrees
  opacity: number; // 0 - 1
  locked: boolean;
  visible: boolean;
  // Logo specific
  imageUrl?: string;
  rawUploadedUrl?: string;
  hasRemovedBg?: boolean;
  isEnhanced?: boolean;
  // Text specific
  text?: string;
  fontFamily?: string;
  fontSize?: number;
  color?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  align?: "left" | "center" | "right";
  // Shape specific
  shapeType?: "rect" | "circle" | "triangle" | "line";
  fillColor?: string;
}

export interface CustomDesignResult {
  productId: string;
  productSlug: string;
  productName: string;
  colorName: string;
  colorHex: string;
  garmentImageFront: string;
  garmentImageBack: string;
  frontPreviewUrl: string;
  backPreviewUrl: string;
  frontLogoUrl?: string | null;
  backLogoUrl?: string | null;
  companyName?: string;
  frontPositionPreset: "Left Chest" | "Right Chest" | "Center Chest";
  backPositionPreset: "Upper Back" | "Center Back" | "Full Back" | "None";
  printType: "Full Colour" | "White" | "Black" | "Auto";
  frontElements: StudioElement[];
  backElements: StudioElement[];
  totalQty?: number;
  calculatedPricePerPiece?: number;
}

interface DesignStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  initialColorIdx?: number;
  onSaveCustomization: (result: CustomDesignResult) => void;
  initialCustomization?: CustomDesignResult | null;
}

type StudioStep = "upload" | "crop" | "loading" | "studio";

const AVAILABLE_FONTS = [
  { name: "Poppins", label: "Poppins (Modern Sans)" },
  { name: "Montserrat", label: "Montserrat (Clean Bold)" },
  { name: "Arial", label: "Arial (Standard)" },
  { name: "Roboto", label: "Roboto (Geometric)" },
  { name: "Oswald", label: "Oswald (Condensed)" },
  { name: "Playfair Display", label: "Playfair (Classic Serif)" },
];

const TEXT_COLOR_PALETTE = [
  "#FFFFFF",
  "#000000",
  "#80011F",
  "#1E3A8A",
  "#047857",
  "#D97706",
  "#DC2626",
  "#4B5563",
  "#F59E0B",
  "#6366F1",
];

// Printable Area on front & back polo/t-shirt (Percentage of garment canvas)
const FRONT_PRINTABLE_BOUNDS = { leftPct: 28, topPct: 22, widthPct: 44, heightPct: 54 };
const BACK_PRINTABLE_BOUNDS = { leftPct: 26, topPct: 18, widthPct: 48, heightPct: 58 };

export function DesignStudioModal({
  isOpen,
  onClose,
  product,
  initialColorIdx = 0,
  onSaveCustomization,
  initialCustomization,
}: DesignStudioModalProps) {
  // Step state
  const [currentStep, setCurrentStep] = useState<StudioStep>(() =>
    initialCustomization?.frontPreviewUrl ? "studio" : "upload"
  );

  // Selected Garment Color
  const [selectedColorIdx, setSelectedColorIdx] = useState<number>(initialColorIdx);
  const activeColor: ProductColor = product.colors[selectedColorIdx] || product.colors[0];

  // Upload Step State
  const [rawUploadedLogo, setRawUploadedLogo] = useState<string | null>(
    () => initialCustomization?.frontLogoUrl || null
  );
  const [uploadedLogoName, setUploadedLogoName] = useState<string>(
    () => initialCustomization?.companyName || ""
  );
  const [companyNameInput, setCompanyNameInput] = useState<string>(
    () => initialCustomization?.companyName || ""
  );
  const [additionalTextInput, setAdditionalTextInput] = useState<string>("");
  const [isDragOverDropzone, setIsDragOverDropzone] = useState(false);

  // Crop Step State
  const [autoRemoveBgInCrop, setAutoRemoveBgInCrop] = useState(true);
  const [cropBox, setCropBox] = useState<CropArea>({ x: 5, y: 5, width: 90, height: 90 });
  const [isProcessingBg, setIsProcessingBg] = useState(false);

  // Studio Step State
  const [activeSide, setActiveSide] = useState<"front" | "back">("front");
  const [canvasZoom, setCanvasZoom] = useState<number>(100);
  const [activeNavTab, setActiveNavTab] = useState<"product" | "text" | "logo" | "layers">("product");

  // Mobile Bottom Sheet State
  const [mobileActiveTab, setMobileActiveTab] = useState<"product" | "logo" | "text" | "layers">("product");

  // Elements State for Front and Back
  const [frontElements, setFrontElements] = useState<StudioElement[]>(() => {
    if (initialCustomization?.frontElements && initialCustomization.frontElements.length > 0) {
      return initialCustomization.frontElements;
    }
    return [];
  });

  const [backElements, setBackElements] = useState<StudioElement[]>(() => {
    if (initialCustomization?.backElements && initialCustomization.backElements.length > 0) {
      return initialCustomization.backElements;
    }
    return [];
  });

  // Selected element ID
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  // Presets
  const [frontPreset, setFrontPreset] = useState<"Left Chest" | "Right Chest" | "Center Chest">(
    () => initialCustomization?.frontPositionPreset || "Left Chest"
  );
  const [backPreset, setBackPreset] = useState<"Upper Back" | "Center Back" | "Full Back" | "None">(
    () => initialCustomization?.backPositionPreset || "Upper Back"
  );
  const [printType, setPrintType] = useState<"Full Colour" | "White" | "Black" | "Auto">(
    () => initialCustomization?.printType || "Full Colour"
  );

  // Undo / Redo History
  const [history, setHistory] = useState<Array<{ front: StudioElement[]; back: StudioElement[] }>>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // Refs
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cropImageRef = useRef<HTMLDivElement | null>(null);
  const printableAreaRef = useRef<HTMLDivElement | null>(null);
  const isDraggingHandleRef = useRef<string | null>(null);

  // Active elements based on active side
  const currentElements = activeSide === "front" ? frontElements : backElements;
  const setCurrentElements = useCallback(
    (updater: (prev: StudioElement[]) => StudioElement[]) => {
      if (activeSide === "front") {
        setFrontElements(updater);
      } else {
        setBackElements(updater);
      }
    },
    [activeSide]
  );

  // Active selected element
  const selectedElement = useMemo(
    () => currentElements.find((el) => el.id === selectedElementId) || null,
    [currentElements, selectedElementId]
  );

  // Determine Garment Images
  const frontGarmentImage = activeColor.image || "/products/polo-black.svg";
  const backGarmentImage =
    activeColor.backImage ||
    activeColor.image4 ||
    product.colors.find((c) => c.backImage)?.backImage ||
    frontGarmentImage;
  const currentGarmentImage = activeSide === "front" ? frontGarmentImage : backGarmentImage;
  const currentPrintableBounds = activeSide === "front" ? FRONT_PRINTABLE_BOUNDS : BACK_PRINTABLE_BOUNDS;

  // Push History
  const recordHistory = useCallback(
    (newFront: StudioElement[], newBack: StudioElement[]) => {
      setHistory((prev) => {
        const slice = prev.slice(0, historyIndex + 1);
        return [...slice, { front: newFront, back: newBack }].slice(-20);
      });
      setHistoryIndex((prev) => prev + 1);
    },
    [historyIndex]
  );

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setFrontElements(prev.front);
      setBackElements(prev.back);
      setHistoryIndex((i) => i - 1);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setFrontElements(next.front);
      setBackElements(next.back);
      setHistoryIndex((i) => i + 1);
    }
  };

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

  // Keyboard shortcut listener for Delete & Arrows
  useEffect(() => {
    if (!isOpen || currentStep !== "studio" || !selectedElementId) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === "Delete" || e.key === "Backspace") {
        setCurrentElements((prev) => prev.filter((el) => el.id !== selectedElementId));
        setSelectedElementId(null);
      } else if (e.key === "ArrowLeft") {
        setCurrentElements((prev) =>
          prev.map((el) => (el.id === selectedElementId ? { ...el, x: Math.max(0, el.x - 1) } : el))
        );
      } else if (e.key === "ArrowRight") {
        setCurrentElements((prev) =>
          prev.map((el) => (el.id === selectedElementId ? { ...el, x: Math.min(100 - el.width, el.x + 1) } : el))
        );
      } else if (e.key === "ArrowUp") {
        setCurrentElements((prev) =>
          prev.map((el) => (el.id === selectedElementId ? { ...el, y: Math.max(0, el.y - 1) } : el))
        );
      } else if (e.key === "ArrowDown") {
        setCurrentElements((prev) =>
          prev.map((el) => (el.id === selectedElementId ? { ...el, y: Math.min(100 - el.height, el.y + 1) } : el))
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentStep, selectedElementId, setCurrentElements]);

  // ========================================================
  // STEP 1: Upload Handling
  // ========================================================
  const handleFileUpload = (file: File) => {
    if (!file) return;
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp", "image/svg+xml"];
    if (!allowedTypes.includes(file.type) && !file.name.endsWith(".svg")) {
      alert("Please upload a valid image file (PNG, JPG, JPEG, WEBP, or SVG).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setRawUploadedLogo(e.target.result as string);
        setUploadedLogoName(file.name);
        setCropBox({ x: 5, y: 5, width: 90, height: 90 });
        setCurrentStep("crop");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDropFile = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOverDropzone(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileUpload(file);
  };

  // ========================================================
  // STEP 2: Crop & Background Removal Handling
  // ========================================================
  const handleStartCropDrag = (
    handle: "tl" | "tr" | "bl" | "br" | "t" | "b" | "l" | "r" | "move",
    e: React.PointerEvent
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const target = e.currentTarget;
    if (target && "setPointerCapture" in target) {
      try {
        target.setPointerCapture(e.pointerId);
      } catch {}
    }

    const startX = e.clientX;
    const startY = e.clientY;
    const initialBox = { ...cropBox };

    const onPointerMove = (moveEvt: PointerEvent) => {
      if (!cropImageRef.current) return;
      const rect = cropImageRef.current.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;

      const pointerX = Math.max(0, Math.min(100, ((moveEvt.clientX - rect.left) / rect.width) * 100));
      const pointerY = Math.max(0, Math.min(100, ((moveEvt.clientY - rect.top) / rect.height) * 100));
      const deltaX = ((moveEvt.clientX - startX) / rect.width) * 100;
      const deltaY = ((moveEvt.clientY - startY) / rect.height) * 100;

      const minSize = 10;

      setCropBox(() => {
        let { x, y, width: w, height: h } = initialBox;

        if (handle === "move") {
          x = Math.max(0, Math.min(100 - w, initialBox.x + deltaX));
          y = Math.max(0, Math.min(100 - h, initialBox.y + deltaY));
          return { x, y, width: w, height: h };
        }

        if (handle === "tl" || handle === "t" || handle === "tr") {
          const maxY = initialBox.y + initialBox.height - minSize;
          y = Math.max(0, Math.min(maxY, pointerY));
          h = initialBox.y + initialBox.height - y;
        }
        if (handle === "bl" || handle === "b" || handle === "br") {
          const minY = initialBox.y + minSize;
          const targetY = Math.max(minY, Math.min(100, pointerY));
          h = targetY - initialBox.y;
        }
        if (handle === "tl" || handle === "l" || handle === "bl") {
          const maxX = initialBox.x + initialBox.width - minSize;
          x = Math.max(0, Math.min(maxX, pointerX));
          w = initialBox.x + initialBox.width - x;
        }
        if (handle === "tr" || handle === "r" || handle === "br") {
          const minX = initialBox.x + minSize;
          const targetX = Math.max(minX, Math.min(100, pointerX));
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

    const onPointerUp = (upEvt: PointerEvent) => {
      if (target && "releasePointerCapture" in target) {
        try {
          target.releasePointerCapture(upEvt.pointerId);
        } catch {}
      }
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  };

  // Confirm Crop & Proceed to Step 3 (Loading)
  const handleConfirmCropAndUse = async () => {
    if (!rawUploadedLogo) return;

    setCurrentStep("loading");

    try {
      // 1. Crop image
      const croppedUrl = await cropImageCanvas(rawUploadedLogo, cropBox);

      // 2. Auto Background removal if enabled
      let finalLogoUrl = croppedUrl;
      if (autoRemoveBgInCrop) {
        finalLogoUrl = await removeBackgroundCanvas(croppedUrl, 35);
      }

      // Initialize logo element on the front side
      const logoEl: StudioElement = {
        id: `logo_${Date.now()}`,
        type: "logo",
        name: uploadedLogoName || "Uploaded Logo",
        x: 60, // Left Chest default (wearer's left = viewer's right)
        y: 26,
        width: 32,
        height: 28,
        rotation: 0,
        opacity: 1,
        locked: false,
        visible: true,
        imageUrl: finalLogoUrl,
        rawUploadedUrl: rawUploadedLogo,
        hasRemovedBg: autoRemoveBgInCrop,
        isEnhanced: false,
      };

      const newFront = [logoEl];

      // Add company name text if provided in Step 1
      if (companyNameInput.trim()) {
        const textEl: StudioElement = {
          id: `text_${Date.now()}`,
          type: "text",
          name: "Company Name",
          x: 20,
          y: 65,
          width: 60,
          height: 18,
          rotation: 0,
          opacity: 1,
          locked: false,
          visible: true,
          text: companyNameInput.trim(),
          fontFamily: "Poppins",
          fontSize: 22,
          color: "#FFFFFF",
          bold: true,
          align: "center",
        };
        newFront.push(textEl);
      }

      setFrontElements(newFront);
      setSelectedElementId(logoEl.id);
      recordHistory(newFront, backElements);

      // Smooth realistic transition after processing
      setTimeout(() => {
        setCurrentStep("studio");
      }, 900);
    } catch {
      setCurrentStep("studio");
    }
  };

  // ========================================================
  // STEP 4 & 5: Quick Design Presets
  // ========================================================
  const applyFrontPreset = (preset: "Left Chest" | "Right Chest" | "Center Chest") => {
    setFrontPreset(preset);
    const logoIndex = frontElements.findIndex((el) => el.type === "logo");
    if (logoIndex === -1) return;

    let targetX = 60;
    let targetY = 26;
    let targetW = 30;
    let targetH = 26;

    if (preset === "Right Chest") {
      targetX = 14;
      targetY = 26;
      targetW = 30;
      targetH = 26;
    } else if (preset === "Center Chest") {
      targetX = 25;
      targetY = 32;
      targetW = 50;
      targetH = 36;
    }

    setFrontElements((prev) =>
      prev.map((el, i) => (i === logoIndex ? { ...el, x: targetX, y: targetY, width: targetW, height: targetH } : el))
    );
  };

  const applyBackPreset = (preset: "Upper Back" | "Center Back" | "Full Back" | "None") => {
    setBackPreset(preset);
    if (preset === "None") {
      setBackElements([]);
      return;
    }

    let targetX = 25;
    let targetY = 16;
    let targetW = 50;
    let targetH = 28;

    if (preset === "Center Back") {
      targetX = 20;
      targetY = 32;
      targetW = 60;
      targetH = 36;
    } else if (preset === "Full Back") {
      targetX = 12;
      targetY = 18;
      targetW = 76;
      targetH = 64;
    }

    // If back has logo, adjust it; if empty, reuse front logo
    setBackElements((prev) => {
      const existingLogo = prev.find((el) => el.type === "logo");
      if (existingLogo) {
        return prev.map((el) =>
          el.id === existingLogo.id ? { ...el, x: targetX, y: targetY, width: targetW, height: targetH } : el
        );
      }

      const frontLogo = frontElements.find((el) => el.type === "logo");
      if (frontLogo) {
        const cloned: StudioElement = {
          ...frontLogo,
          id: `back_logo_${Date.now()}`,
          x: targetX,
          y: targetY,
          width: targetW,
          height: targetH,
        };
        return [...prev, cloned];
      }
      return prev;
    });
  };

  // Add a new Text element
  const handleAddNewText = (initialString: string = "Your Text") => {
    const newText: StudioElement = {
      id: `text_${Date.now()}`,
      type: "text",
      name: `Text: ${initialString}`,
      x: 25,
      y: 50,
      width: 50,
      height: 18,
      rotation: 0,
      opacity: 1,
      locked: false,
      visible: true,
      text: initialString,
      fontFamily: "Poppins",
      fontSize: 24,
      color: "#FFFFFF",
      bold: true,
      italic: false,
      underline: false,
      align: "center",
    };

    setCurrentElements((prev) => [...prev, newText]);
    setSelectedElementId(newText.id);
  };

  // Add a shape
  const handleAddShape = (shapeType: "rect" | "circle" | "line") => {
    const newShape: StudioElement = {
      id: `shape_${Date.now()}`,
      type: "shape",
      name: `${shapeType === "circle" ? "Circle" : "Rectangle"} Shape`,
      x: 35,
      y: 40,
      width: 30,
      height: shapeType === "line" ? 4 : 25,
      rotation: 0,
      opacity: 1,
      locked: false,
      visible: true,
      shapeType,
      fillColor: "#80011F",
    };

    setCurrentElements((prev) => [...prev, newShape]);
    setSelectedElementId(newShape.id);
  };

  // Interactive Drag on Garment Canvas
  const handleElementPointerDown = (elementId: string, e: React.PointerEvent) => {
    if (isDraggingHandleRef.current) return;
    e.preventDefault();
    e.stopPropagation();

    setSelectedElementId(elementId);
    const el = currentElements.find((item) => item.id === elementId);
    if (!el || el.locked) return;

    const startX = e.clientX;
    const startY = e.clientY;
    const initialX = el.x;
    const initialY = el.y;

    const onPointerMove = (moveEvt: PointerEvent) => {
      if (!printableAreaRef.current) return;
      const rect = printableAreaRef.current.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;

      const deltaX = ((moveEvt.clientX - startX) / rect.width) * 100;
      const deltaY = ((moveEvt.clientY - startY) / rect.height) * 100;

      const newX = Math.max(0, Math.min(100 - el.width, initialX + deltaX));
      const newY = Math.max(0, Math.min(100 - el.height, initialY + deltaY));

      setCurrentElements((prev) =>
        prev.map((item) => (item.id === elementId ? { ...item, x: newX, y: newY } : item))
      );
    };

    const onPointerUp = () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  };

  // Interactive Corner Resize Handle on Garment Canvas
  const handleResizeHandleDown = (
    elementId: string,
    corner: "tl" | "tr" | "bl" | "br",
    e: React.PointerEvent
  ) => {
    e.preventDefault();
    e.stopPropagation();
    isDraggingHandleRef.current = corner;

    const el = currentElements.find((item) => item.id === elementId);
    if (!el || el.locked) return;

    const startX = e.clientX;
    const startY = e.clientY;
    const initialBox = { x: el.x, y: el.y, width: el.width, height: el.height };

    const onPointerMove = (moveEvt: PointerEvent) => {
      if (!printableAreaRef.current) return;
      const rect = printableAreaRef.current.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;

      const deltaX = ((moveEvt.clientX - startX) / rect.width) * 100;
      const deltaY = ((moveEvt.clientY - startY) / rect.height) * 100;

      setCurrentElements((prev) =>
        prev.map((item) => {
          if (item.id !== elementId) return item;

          let { x, y, width: w, height: h } = initialBox;
          const minW = 12;
          const minH = 10;

          if (corner === "br") {
            w = Math.max(minW, Math.min(100 - x, initialBox.width + deltaX));
            h = Math.max(minH, Math.min(100 - y, initialBox.height + deltaY));
          } else if (corner === "bl") {
            const newX = Math.max(0, Math.min(initialBox.x + initialBox.width - minW, initialBox.x + deltaX));
            w = initialBox.x + initialBox.width - newX;
            h = Math.max(minH, Math.min(100 - y, initialBox.height + deltaY));
            x = newX;
          } else if (corner === "tr") {
            const newY = Math.max(0, Math.min(initialBox.y + initialBox.height - minH, initialBox.y + deltaY));
            w = Math.max(minW, Math.min(100 - x, initialBox.width + deltaX));
            h = initialBox.y + initialBox.height - newY;
            y = newY;
          } else if (corner === "tl") {
            const newX = Math.max(0, Math.min(initialBox.x + initialBox.width - minW, initialBox.x + deltaX));
            const newY = Math.max(0, Math.min(initialBox.y + initialBox.height - minH, initialBox.y + deltaY));
            w = initialBox.x + initialBox.width - newX;
            h = initialBox.y + initialBox.height - newY;
            x = newX;
            y = newY;
          }

          return { ...item, x, y, width: w, height: h };
        })
      );
    };

    const onPointerUp = () => {
      isDraggingHandleRef.current = null;
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  };

  // D-Pad Position Controls
  const nudgeSelectedElement = (direction: "up" | "down" | "left" | "right" | "center") => {
    if (!selectedElementId) return;
    setCurrentElements((prev) =>
      prev.map((el) => {
        if (el.id !== selectedElementId) return el;
        const step = 3;
        if (direction === "up") return { ...el, y: Math.max(0, el.y - step) };
        if (direction === "down") return { ...el, y: Math.min(100 - el.height, el.y + step) };
        if (direction === "left") return { ...el, x: Math.max(0, el.x - step) };
        if (direction === "right") return { ...el, x: Math.min(100 - el.width, el.x + step) };
        if (direction === "center") return { ...el, x: Math.round((100 - el.width) / 2) };
        return el;
      })
    );
  };

  // Toggle Background Removal for Selected Logo
  const handleToggleBgRemoval = async (elementId: string) => {
    const el = currentElements.find((item) => item.id === elementId);
    if (!el || el.type !== "logo" || !el.imageUrl) return;

    setIsProcessingBg(true);
    try {
      if (el.hasRemovedBg) {
        // Restore raw
        setCurrentElements((prev) =>
          prev.map((item) =>
            item.id === elementId
              ? { ...item, imageUrl: item.rawUploadedUrl || item.imageUrl, hasRemovedBg: false }
              : item
          )
        );
      } else {
        const transparentUrl = await removeBackgroundCanvas(el.rawUploadedUrl || el.imageUrl, 35);
        setCurrentElements((prev) =>
          prev.map((item) =>
            item.id === elementId ? { ...item, imageUrl: transparentUrl, hasRemovedBg: true } : item
          )
        );
      }
    } finally {
      setIsProcessingBg(false);
    }
  };

  // Toggle Enhance Quality for Selected Logo
  const handleToggleEnhance = async (elementId: string) => {
    const el = currentElements.find((item) => item.id === elementId);
    if (!el || el.type !== "logo" || !el.imageUrl) return;

    if (el.isEnhanced) {
      setCurrentElements((prev) =>
        prev.map((item) => (item.id === elementId ? { ...item, isEnhanced: false } : item))
      );
    } else {
      const enhancedUrl = await enhanceLogoCanvas(el.imageUrl);
      setCurrentElements((prev) =>
        prev.map((item) =>
          item.id === elementId ? { ...item, imageUrl: enhancedUrl, isEnhanced: true } : item
        )
      );
    }
  };

  // ========================================================
  // STEP 7: Save & Done Action
  // ========================================================
  const [isSavingDone, setIsSavingDone] = useState(false);

  const handleDoneAndSave = async () => {
    setIsSavingDone(true);
    try {
      // Generate High-Res Front Composite
      const frontComposite = await generateCompositeGarment(
        frontGarmentImage,
        FRONT_PRINTABLE_BOUNDS,
        frontElements.filter((el) => el.visible)
      );

      // Generate High-Res Back Composite
      const backComposite = await generateCompositeGarment(
        backGarmentImage,
        BACK_PRINTABLE_BOUNDS,
        backElements.filter((el) => el.visible)
      );

      const frontLogoItem = frontElements.find((el) => el.type === "logo");
      const backLogoItem = backElements.find((el) => el.type === "logo");

      const result: CustomDesignResult = {
        productId: product.id,
        productSlug: product.slug,
        productName: product.name,
        colorName: activeColor.name,
        colorHex: activeColor.hex,
        garmentImageFront: frontGarmentImage,
        garmentImageBack: backGarmentImage,
        frontPreviewUrl: frontComposite,
        backPreviewUrl: backComposite,
        frontLogoUrl: frontLogoItem?.imageUrl || null,
        backLogoUrl: backLogoItem?.imageUrl || null,
        companyName: companyNameInput || frontElements.find((el) => el.type === "text")?.text || "",
        frontPositionPreset: frontPreset,
        backPositionPreset: backPreset,
        printType: printType,
        frontElements,
        backElements,
      };

      onSaveCustomization(result);
      onClose();
    } catch {
      onClose();
    } finally {
      setIsSavingDone(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-0 sm:p-4 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileUpload(file);
          e.target.value = "";
        }}
      />

      {/* ======================================================== */}
      {/* STEP 1: START CUSTOMIZATION MODAL                        */}
      {/* ======================================================== */}
      {currentStep === "upload" && (
        <div className="relative flex flex-col w-full max-w-4xl max-h-[96vh] rounded-3xl bg-white shadow-2xl overflow-hidden border border-rose-100 animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-rose-100 px-6 py-4 bg-[#FFF9FA]">
            <div className="flex items-center gap-3">
              <Image src="/logo.webp" alt="TeesZone" width={115} height={30} className="h-6 w-auto object-contain" />
              <span className="hidden sm:inline-block h-4 w-px bg-rose-200" />
              <span className="hidden sm:inline-block text-xs font-bold text-[#80011F] tracking-wide uppercase">
                Custom Apparel Studio
              </span>
            </div>
            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-500 hover:text-black hover:bg-rose-50 border border-rose-100 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 sm:p-8 overflow-y-auto">
            {/* Left Column: Form & Dropzone */}
            <div className="flex flex-col justify-between space-y-5">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#231F20] tracking-tight">
                  Design Your {product.name.replace(/240|T-Shirt|Polo/g, "").trim() || "Polo"} T-Shirt
                </h2>
                <p className="mt-1.5 text-xs sm:text-sm text-gray-600">
                  Upload your logo, add text and customize it your way.
                </p>
              </div>

              {/* Upload Dropzone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOverDropzone(true);
                }}
                onDragLeave={() => setIsDragOverDropzone(false)}
                onDrop={handleDropFile}
                onClick={() => fileInputRef.current?.click()}
                className={`flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-6 sm:p-8 text-center cursor-pointer transition-all ${
                  isDragOverDropzone
                    ? "border-[#80011F] bg-rose-50/80 scale-[1.01]"
                    : "border-rose-200/90 bg-[#FFFDFC] hover:border-[#80011F] hover:bg-rose-50/50"
                }`}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 text-[#80011F] shadow-xs">
                  <CloudUpload size={28} className="stroke-[2.2]" />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-gray-900">Upload Your Logo</h4>
                  <p className="mt-1 text-xs text-gray-500 font-medium">PNG, JPG, JPEG, SVG (Max 10 MB)</p>
                </div>
                <button
                  type="button"
                  className="mt-1 rounded-xl bg-white border border-rose-200 px-4 py-2 text-xs font-bold text-[#80011F] shadow-xs hover:bg-rose-50"
                >
                  Browse Files
                </button>
              </div>

              {/* Company / Brand Name Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">Company / Brand Name (Optional)</label>
                <input
                  type="text"
                  value={companyNameInput}
                  onChange={(e) => setCompanyNameInput(e.target.value)}
                  placeholder="e.g. Acme Corporation"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#80011F] focus:outline-hidden"
                />
              </div>

              {/* Add Slogan / Text Option */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">Add Text / Slogan (Optional)</label>
                <input
                  type="text"
                  value={additionalTextInput}
                  onChange={(e) => setAdditionalTextInput(e.target.value)}
                  placeholder="e.g. Team Leadership 2026"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#80011F] focus:outline-hidden"
                />
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => {
                  if (rawUploadedLogo) {
                    setCurrentStep("crop");
                  } else if (companyNameInput.trim() || additionalTextInput.trim()) {
                    // Directly initialize studio with text
                    handleAddNewText(companyNameInput.trim() || additionalTextInput.trim());
                    setCurrentStep("studio");
                  } else {
                    fileInputRef.current?.click();
                  }
                }}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#80011F] hover:bg-[#680119] py-3.5 text-base font-bold text-white shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <span>Create My Design</span>
                <ArrowRight size={18} />
              </button>
            </div>

            {/* Right Column: Garment 3D Preview */}
            <div className="flex flex-col items-center justify-center rounded-2xl bg-gradient-to-b from-[#FDF9FA] to-[#F7F0F2] p-6 border border-rose-100/70">
              <div className="relative w-full aspect-square max-w-[340px] flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={frontGarmentImage}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain filter drop-shadow-md"
                />
                <div className="absolute top-2 right-2 rounded-full bg-white/90 border border-rose-100 px-3 py-1 text-[11px] font-bold text-[#80011F] shadow-xs">
                  {activeColor.name}
                </div>
              </div>
              <p className="mt-4 text-xs font-semibold text-gray-500 text-center">
                Ready for Custom Embroidery &amp; Screen Print
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* STEP 2: CROP LOGO & AUTOMATIC BACKGROUND REMOVAL MODAL   */}
      {/* ======================================================== */}
      {currentStep === "crop" && (
        <div className="relative flex flex-col w-full max-w-4xl max-h-[96vh] rounded-3xl bg-white shadow-2xl overflow-hidden border border-rose-100 animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-rose-100 px-6 py-4 bg-[#FFF9FA]">
            <div className="flex items-center gap-3">
              <Image src="/logo.webp" alt="TeesZone" width={115} height={30} className="h-6 w-auto object-contain" />
              <span className="hidden sm:inline-block h-4 w-px bg-rose-200" />
              <span className="text-xs font-bold text-[#80011F] tracking-wide uppercase">Crop Your Logo</span>
            </div>
            <button
              onClick={() => setCurrentStep("upload")}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-500 hover:text-black border border-rose-100 cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Subheader */}
          <div className="px-6 sm:px-8 pt-5 pb-3">
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">Crop Your Logo</h2>
            <p className="text-xs text-gray-500">Drag the corners or edges to crop your logo as needed.</p>
          </div>

          {/* Body */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6 sm:px-8 py-2 overflow-y-auto">
            {/* Left 3 Info Badges (Desktop) */}
            <div className="hidden md:flex flex-col gap-3 justify-center">
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-rose-50/60 border border-rose-100">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-[#80011F] shadow-xs shrink-0">
                  <Scan size={16} />
                </span>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Crop &amp; Adjust</h4>
                  <p className="text-[11px] text-gray-500">Drag corners or edges freely</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-rose-50/60 border border-rose-100">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-[#80011F] shadow-xs shrink-0">
                  <ShieldCheck size={16} />
                </span>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Keep It Clear</h4>
                  <p className="text-[11px] text-gray-500">High-resolution logo (PNG/JPG)</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-rose-50/60 border border-rose-100">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-[#80011F] shadow-xs shrink-0">
                  <Sparkles size={16} />
                </span>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Best Results</h4>
                  <p className="text-[11px] text-gray-500">Auto background removal enabled</p>
                </div>
              </div>

              {/* Auto Background Removal Toggle */}
              <div className="mt-2 flex items-center justify-between p-3.5 rounded-2xl bg-white border border-rose-200/80 shadow-xs">
                <div>
                  <p className="text-xs font-bold text-gray-900">Remove Background</p>
                  <p className="text-[10px] text-gray-500">Converts white into transparency</p>
                </div>
                <button
                  type="button"
                  onClick={() => setAutoRemoveBgInCrop((prev) => !prev)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                    autoRemoveBgInCrop ? "bg-[#80011F]" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      autoRemoveBgInCrop ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Center: Interactive Crop Workspace with Checkerboard Background */}
            <div className="col-span-1 md:col-span-2 flex flex-col items-center justify-center">
              <div
                className="relative w-full h-[280px] sm:h-[350px] rounded-2xl overflow-hidden border border-gray-300 shadow-inner flex items-center justify-center select-none"
                style={{
                  backgroundImage:
                    "linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)",
                  backgroundSize: "16px 16px",
                  backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px",
                }}
              >
                {rawUploadedLogo && (
                  <div
                    ref={cropImageRef}
                    className="relative max-h-[85%] max-w-[85%] inline-flex items-center justify-center"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={rawUploadedLogo}
                      alt="Crop Source"
                      className="max-h-[240px] sm:max-h-[300px] w-auto object-contain pointer-events-none"
                    />

                    {/* Draggable Crop Selection Box */}
                    <div
                      onPointerDown={(e) => handleStartCropDrag("move", e)}
                      style={{
                        left: `${cropBox.x}%`,
                        top: `${cropBox.y}%`,
                        width: `${cropBox.width}%`,
                        height: `${cropBox.height}%`,
                      }}
                      className="absolute border-2 border-[#80011F] bg-[#80011F]/10 cursor-move"
                    >
                      {/* Corner Handles */}
                      <span
                        onPointerDown={(e) => handleStartCropDrag("tl", e)}
                        className="absolute -top-2.5 -left-2.5 h-5 w-5 rounded-full bg-white border-2 border-[#80011F] cursor-nwse-resize shadow-md"
                      />
                      <span
                        onPointerDown={(e) => handleStartCropDrag("tr", e)}
                        className="absolute -top-2.5 -right-2.5 h-5 w-5 rounded-full bg-white border-2 border-[#80011F] cursor-nesw-resize shadow-md"
                      />
                      <span
                        onPointerDown={(e) => handleStartCropDrag("bl", e)}
                        className="absolute -bottom-2.5 -left-2.5 h-5 w-5 rounded-full bg-white border-2 border-[#80011F] cursor-nesw-resize shadow-md"
                      />
                      <span
                        onPointerDown={(e) => handleStartCropDrag("br", e)}
                        className="absolute -bottom-2.5 -right-2.5 h-5 w-5 rounded-full bg-white border-2 border-[#80011F] cursor-nwse-resize shadow-md"
                      />

                      {/* Edge Handles */}
                      <span
                        onPointerDown={(e) => handleStartCropDrag("t", e)}
                        className="absolute -top-1.5 left-1/2 -translate-x-1/2 h-3 w-8 rounded-full bg-white border border-[#80011F] cursor-ns-resize"
                      />
                      <span
                        onPointerDown={(e) => handleStartCropDrag("b", e)}
                        className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-3 w-8 rounded-full bg-white border border-[#80011F] cursor-ns-resize"
                      />
                      <span
                        onPointerDown={(e) => handleStartCropDrag("l", e)}
                        className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-8 rounded-full bg-white border border-[#80011F] cursor-ew-resize"
                      />
                      <span
                        onPointerDown={(e) => handleStartCropDrag("r", e)}
                        className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-8 rounded-full bg-white border border-[#80011F] cursor-ew-resize"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Controls: [ Replace Logo ] & [ Crop & Use -> ] */}
          <div className="flex items-center justify-between border-t border-rose-100 px-6 sm:px-8 py-4 bg-[#FFF9FA]">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 px-5 py-2.5 text-xs sm:text-sm font-bold text-gray-700 shadow-xs cursor-pointer"
            >
              <Upload size={15} />
              <span>Replace Logo</span>
            </button>

            <button
              type="button"
              onClick={handleConfirmCropAndUse}
              className="flex items-center gap-2 rounded-xl bg-[#80011F] hover:bg-[#680119] px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <span>Crop &amp; Use</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* STEP 3: TEESZONE BRANDED LOADING ANIMATION               */}
      {/* ======================================================== */}
      {currentStep === "loading" && (
        <div className="relative flex flex-col items-center justify-center w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl text-center border border-rose-100 animate-in zoom-in-95 duration-200">
          {/* Authentic Logo */}
          <div className="mb-6">
            <Image src="/logo.webp" alt="TeesZone" width={140} height={36} className="h-7 w-auto object-contain mx-auto" />
          </div>

          {/* Subtle Burgundy Circular Spinner */}
          <div className="relative flex items-center justify-center my-4">
            <div className="h-20 w-20 rounded-full border-4 border-rose-100 border-t-[#80011F] animate-spin" />
            <div className="absolute flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-[#80011F]">
              <Sparkles size={22} className="stroke-[2.2] animate-pulse" />
            </div>
          </div>

          <h3 className="mt-4 text-lg font-extrabold text-gray-900">
            Designing your {product.name.replace(/240|T-Shirt|Polo/g, "").trim() || "polo"} t-shirt...
          </h3>
          <p className="mt-1 text-xs text-gray-500 font-medium">
            Placing your logo on the product and preparing preview.
          </p>
        </div>
      )}

      {/* ======================================================== */}
      {/* STEP 4 & 5: MAIN DESIGN STUDIO (FRONT & BACK VIEWS)      */}
      {/* ======================================================== */}
      {currentStep === "studio" && (
        <div className="relative flex flex-col w-full h-full sm:h-[94vh] sm:max-w-7xl sm:rounded-3xl bg-white shadow-2xl overflow-hidden border border-rose-100 animate-in zoom-in-95 duration-200">
          {/* ======================================================== */}
          {/* TOP TOOLBAR                                              */}
          {/* ======================================================== */}
          <div className="flex items-center justify-between border-b border-rose-100 px-4 sm:px-6 py-2.5 bg-[#FFF9FA] shrink-0">
            {/* Left: Back & Product Info */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setCurrentStep("crop")}
                className="flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-[#80011F] cursor-pointer"
              >
                <ArrowLeft size={16} />
                <span className="hidden sm:inline">Back</span>
              </button>
              <span className="hidden sm:inline-block h-4 w-px bg-rose-200" />
              <Image src="/logo.webp" alt="TeesZone" width={95} height={24} className="h-5 w-auto object-contain" />
              <span className="hidden md:inline-block text-xs font-bold text-gray-800 truncate max-w-[180px]">
                {product.name}
              </span>
            </div>

            {/* Center Controls: Undo, Redo, Front/Back, Zoom */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden sm:flex items-center gap-1 bg-white border border-rose-200/80 rounded-xl p-1 shadow-xs">
                <button
                  type="button"
                  onClick={handleUndo}
                  title="Undo"
                  className="p-1 rounded text-gray-600 hover:bg-rose-50 hover:text-[#80011F] cursor-pointer"
                >
                  <RotateCcw size={14} />
                </button>
                <button
                  type="button"
                  onClick={handleRedo}
                  title="Redo"
                  className="p-1 rounded text-gray-600 hover:bg-rose-50 hover:text-[#80011F] cursor-pointer"
                >
                  <RotateCw size={14} />
                </button>
              </div>

              {/* Front / Back Switcher Pill */}
              <div className="flex items-center rounded-xl bg-white border border-rose-200/80 p-0.5 shadow-xs">
                <button
                  type="button"
                  onClick={() => {
                    setActiveSide("front");
                    setSelectedElementId(null);
                  }}
                  className={`rounded-lg px-3 py-1 text-xs font-bold transition-all cursor-pointer ${
                    activeSide === "front" ? "bg-[#80011F] text-white shadow-xs" : "text-gray-600 hover:text-black"
                  }`}
                >
                  Front
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveSide("back");
                    setSelectedElementId(null);
                    // auto trigger back preset if empty
                    if (backElements.length === 0) {
                      applyBackPreset("Upper Back");
                    }
                  }}
                  className={`rounded-lg px-3 py-1 text-xs font-bold transition-all cursor-pointer ${
                    activeSide === "back" ? "bg-[#80011F] text-white shadow-xs" : "text-gray-600 hover:text-black"
                  }`}
                >
                  Back
                </button>
              </div>

              {/* Canvas Zoom Slider */}
              <div className="hidden lg:flex items-center gap-1.5 bg-white border border-rose-200/80 rounded-xl px-2.5 py-1 text-xs font-bold text-gray-700 shadow-xs">
                <button
                  type="button"
                  onClick={() => setCanvasZoom((z) => Math.max(70, z - 10))}
                  className="text-gray-500 hover:text-black"
                >
                  <Minus size={13} />
                </button>
                <span className="w-9 text-center">{canvasZoom}%</span>
                <button
                  type="button"
                  onClick={() => setCanvasZoom((z) => Math.min(130, z + 10))}
                  className="text-gray-500 hover:text-black"
                >
                  <Plus size={13} />
                </button>
              </div>
            </div>

            {/* Right: Live Price & Done Button */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-[11px] font-semibold text-gray-500">2 pcs • ₹724.50 ea</span>
                <span className="text-sm font-extrabold text-[#80011F]">₹1,449</span>
              </div>

              <button
                type="button"
                onClick={handleDoneAndSave}
                disabled={isSavingDone}
                className="flex items-center gap-1.5 rounded-xl bg-[#80011F] hover:bg-[#680119] px-4 sm:px-5 py-2 text-xs sm:text-sm font-bold text-white shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-60"
              >
                {isSavingDone ? (
                  <span>Saving...</span>
                ) : (
                  <>
                    <Check size={16} />
                    <span>Done</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ======================================================== */}
          {/* DESKTOP 3-PANEL BODY                                     */}
          {/* ======================================================== */}
          <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
            {/* ---------------------------------------------------- */}
            {/* LEFT PANEL: Navigation & Quick Design                */}
            {/* ---------------------------------------------------- */}
            <div className="hidden md:flex flex-col w-[280px] lg:w-[310px] border-r border-rose-100 bg-[#FFFDFE] p-4 overflow-y-auto space-y-4">
              {/* Tab Selector: Product vs Text & Add */}
              <div className="flex items-center rounded-xl bg-rose-50/70 p-1 border border-rose-200/60">
                <button
                  type="button"
                  onClick={() => setActiveNavTab("product")}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    activeNavTab === "product" ? "bg-white text-[#80011F] shadow-xs" : "text-gray-600 hover:text-black"
                  }`}
                >
                  <Palette size={14} />
                  <span>Product</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveNavTab("text")}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    activeNavTab === "text" ? "bg-white text-[#80011F] shadow-xs" : "text-gray-600 hover:text-black"
                  }`}
                >
                  <Type size={14} />
                  <span>Text &amp; Add</span>
                </button>
              </div>

              {activeNavTab === "product" && (
                <>
                  {/* T-Shirt Colour Swatches */}
                  <div>
                    <label className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                      T-shirt Colour
                    </label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {product.colors.map((c, i) => (
                        <button
                          key={c.name}
                          type="button"
                          onClick={() => setSelectedColorIdx(i)}
                          title={c.name}
                          className={`relative flex h-8 w-8 items-center justify-center rounded-full border transition-all hover:scale-110 cursor-pointer ${
                            selectedColorIdx === i
                              ? "border-[#80011F] ring-2 ring-[#80011F] ring-offset-2 shadow-xs"
                              : "border-black/15 opacity-80 hover:opacity-100"
                          }`}
                          style={{ backgroundColor: c.hex }}
                        >
                          {selectedColorIdx === i && (
                            <Check
                              size={13}
                              className={["#FFFFFF", "#F1F2F4"].includes(c.hex) ? "text-black" : "text-white"}
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quick Design Section */}
                  <div className="space-y-3 pt-2 border-t border-rose-100">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-gray-800 uppercase tracking-wider">
                        Quick Design
                      </span>
                      <span className="text-[10px] font-bold text-[#80011F] bg-rose-100 px-2 py-0.5 rounded-full">
                        {activeSide.toUpperCase()}
                      </span>
                    </div>

                    {/* Front Position Presets */}
                    {activeSide === "front" ? (
                      <div>
                        <label className="text-[11px] font-bold text-gray-600">Front Position</label>
                        <div className="grid grid-cols-3 gap-1.5 mt-1.5">
                          {(["Left Chest", "Right Chest", "Center Chest"] as const).map((pos) => (
                            <button
                              key={pos}
                              type="button"
                              onClick={() => applyFrontPreset(pos)}
                              className={`rounded-xl border py-2 text-[11px] font-bold transition-all cursor-pointer ${
                                frontPreset === pos
                                  ? "bg-[#80011F] text-white border-[#80011F] shadow-xs"
                                  : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                              }`}
                            >
                              {pos}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      /* Back Position Presets */
                      <div>
                        <label className="text-[11px] font-bold text-gray-600">Back Position</label>
                        <div className="grid grid-cols-2 gap-1.5 mt-1.5">
                          {(["Upper Back", "Center Back", "Full Back", "None"] as const).map((pos) => (
                            <button
                              key={pos}
                              type="button"
                              onClick={() => applyBackPreset(pos)}
                              className={`rounded-xl border py-2 text-[11px] font-bold transition-all cursor-pointer ${
                                backPreset === pos
                                  ? "bg-[#80011F] text-white border-[#80011F] shadow-xs"
                                  : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                              }`}
                            >
                              {pos}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Print Type */}
                    <div>
                      <label className="text-[11px] font-bold text-gray-600">Print Type</label>
                      <div className="grid grid-cols-3 gap-1.5 mt-1.5">
                        {(["Full Colour", "White", "Black"] as const).map((pt) => (
                          <button
                            key={pt}
                            type="button"
                            onClick={() => setPrintType(pt)}
                            className={`rounded-xl border py-1.5 text-[11px] font-bold transition-all cursor-pointer ${
                              printType === pt
                                ? "bg-[#80011F] text-white border-[#80011F] shadow-xs"
                                : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            {pt}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Quick Add Elements */}
                    <div>
                      <label className="text-[11px] font-bold text-gray-600">Add Quick Element</label>
                      <div className="grid grid-cols-3 gap-1.5 mt-1.5">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex flex-col items-center gap-1 rounded-xl border border-gray-200 bg-white hover:bg-rose-50/50 p-2 text-[11px] font-bold text-gray-700 cursor-pointer"
                        >
                          <Upload size={14} className="text-[#80011F]" />
                          <span>Logo</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAddShape("rect")}
                          className="flex flex-col items-center gap-1 rounded-xl border border-gray-200 bg-white hover:bg-rose-50/50 p-2 text-[11px] font-bold text-gray-700 cursor-pointer"
                        >
                          <Scan size={14} className="text-[#80011F]" />
                          <span>Shape</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAddNewText("Your Text")}
                          className="flex flex-col items-center gap-1 rounded-xl border border-gray-200 bg-white hover:bg-rose-50/50 p-2 text-[11px] font-bold text-gray-700 cursor-pointer"
                        >
                          <Type size={14} className="text-[#80011F]" />
                          <span>Text</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Text & Add Tab Controls */}
              {activeNavTab === "text" && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-800">Add Text</label>
                    <div className="mt-1.5 flex gap-1.5">
                      <input
                        type="text"
                        placeholder="Enter text..."
                        id="new-text-field"
                        className="flex-1 rounded-xl border border-gray-300 px-3 py-2 text-xs focus:border-[#80011F] focus:outline-hidden"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const el = document.getElementById("new-text-field") as HTMLInputElement;
                          if (el && el.value.trim()) {
                            handleAddNewText(el.value.trim());
                            el.value = "";
                          }
                        }}
                        className="rounded-xl bg-[#80011F] px-3 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#680119] cursor-pointer"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {/* If text selected, live edit */}
                  {selectedElement?.type === "text" && (
                    <div className="space-y-3 pt-3 border-t border-rose-100">
                      <div>
                        <label className="text-[11px] font-bold text-gray-600">Font Family</label>
                        <select
                          value={selectedElement.fontFamily || "Poppins"}
                          onChange={(e) =>
                            setCurrentElements((prev) =>
                              prev.map((item) =>
                                item.id === selectedElement.id ? { ...item, fontFamily: e.target.value } : item
                              )
                            )
                          }
                          className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-xs font-semibold focus:border-[#80011F] focus:outline-hidden"
                        >
                          {AVAILABLE_FONTS.map((f) => (
                            <option key={f.name} value={f.name}>
                              {f.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Style: B, I, U */}
                      <div>
                        <label className="text-[11px] font-bold text-gray-600">Style</label>
                        <div className="flex gap-1.5 mt-1">
                          <button
                            type="button"
                            onClick={() =>
                              setCurrentElements((prev) =>
                                prev.map((item) =>
                                  item.id === selectedElement.id ? { ...item, bold: !item.bold } : item
                                )
                              )
                            }
                            className={`flex-1 rounded-xl border py-1.5 text-xs font-bold cursor-pointer ${
                              selectedElement.bold ? "bg-[#80011F] text-white" : "bg-white text-gray-700"
                            }`}
                          >
                            B
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setCurrentElements((prev) =>
                                prev.map((item) =>
                                  item.id === selectedElement.id ? { ...item, italic: !item.italic } : item
                                )
                              )
                            }
                            className={`flex-1 rounded-xl border py-1.5 text-xs font-serif italic cursor-pointer ${
                              selectedElement.italic ? "bg-[#80011F] text-white" : "bg-white text-gray-700"
                            }`}
                          >
                            I
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setCurrentElements((prev) =>
                                prev.map((item) =>
                                  item.id === selectedElement.id ? { ...item, underline: !item.underline } : item
                                )
                              )
                            }
                            className={`flex-1 rounded-xl border py-1.5 text-xs underline cursor-pointer ${
                              selectedElement.underline ? "bg-[#80011F] text-white" : "bg-white text-gray-700"
                            }`}
                          >
                            U
                          </button>
                        </div>
                      </div>

                      {/* Text Colour Palette */}
                      <div>
                        <label className="text-[11px] font-bold text-gray-600">Text Colour</label>
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {TEXT_COLOR_PALETTE.map((hex) => (
                            <button
                              key={hex}
                              type="button"
                              onClick={() =>
                                setCurrentElements((prev) =>
                                  prev.map((item) =>
                                    item.id === selectedElement.id ? { ...item, color: hex } : item
                                  )
                                )
                              }
                              className={`h-6 w-6 rounded-full border transition-transform hover:scale-110 cursor-pointer ${
                                selectedElement.color === hex ? "ring-2 ring-[#80011F] scale-110" : ""
                              }`}
                              style={{ backgroundColor: hex }}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Text Size Slider */}
                      <div>
                        <div className="flex justify-between text-[11px] font-bold text-gray-600">
                          <span>Size</span>
                          <span>{selectedElement.fontSize || 24}px</span>
                        </div>
                        <input
                          type="range"
                          min="14"
                          max="64"
                          value={selectedElement.fontSize || 24}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            setCurrentElements((prev) =>
                              prev.map((item) =>
                                item.id === selectedElement.id ? { ...item, fontSize: val } : item
                              )
                            )
                          }}
                          className="w-full accent-[#80011F] mt-1"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ---------------------------------------------------- */}
            {/* CENTER PANEL: Large Interactive 3D Garment Canvas   */}
            {/* ---------------------------------------------------- */}
            <div className="flex-1 flex flex-col items-center justify-center p-4 bg-gradient-to-b from-[#FAF5F6] to-[#F5ECEE] relative overflow-hidden select-none">
              {/* Garment Preview Container scaled with zoom */}
              <div
                style={{
                  transform: `scale(${canvasZoom / 100})`,
                  transformOrigin: "center center",
                  transition: "transform 150ms ease-out",
                }}
                className="relative w-full max-w-[420px] aspect-[4/5] flex items-center justify-center"
              >
                {/* Garment Base Image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={currentGarmentImage}
                  alt={`${product.name} ${activeSide}`}
                  className="max-h-full max-w-full object-contain filter drop-shadow-xl pointer-events-none"
                />

                {/* Printable Boundary Area (dashed editing guide) */}
                <div
                  ref={printableAreaRef}
                  style={{
                    left: `${currentPrintableBounds.leftPct}%`,
                    top: `${currentPrintableBounds.topPct}%`,
                    width: `${currentPrintableBounds.widthPct}%`,
                    height: `${currentPrintableBounds.heightPct}%`,
                  }}
                  className="absolute border border-dashed border-[#80011F]/50 rounded-lg pointer-events-auto"
                >
                  {/* Render Layers on Garment */}
                  {currentElements.map((el) => {
                    if (!el.visible) return null;
                    const isSelected = el.id === selectedElementId;

                    return (
                      <div
                        key={el.id}
                        onPointerDown={(e) => handleElementPointerDown(el.id, e)}
                        style={{
                          left: `${el.x}%`,
                          top: `${el.y}%`,
                          width: `${el.width}%`,
                          height: `${el.height}%`,
                          opacity: el.opacity,
                          transform: el.rotation ? `rotate(${el.rotation}deg)` : undefined,
                        }}
                        className={`absolute flex items-center justify-center cursor-move transition-shadow ${
                          isSelected
                            ? "ring-2 ring-[#80011F] ring-offset-1 bg-[#80011F]/5 shadow-lg rounded"
                            : "hover:ring-1 hover:ring-[#80011F]/50"
                        }`}
                      >
                        {/* Logo Layer */}
                        {el.type === "logo" && el.imageUrl && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={el.imageUrl}
                            alt={el.name}
                            className="max-h-full max-w-full object-contain pointer-events-none select-none"
                          />
                        )}

                        {/* Text Layer */}
                        {el.type === "text" && (
                          <span
                            style={{
                              fontFamily: el.fontFamily || "Poppins",
                              fontWeight: el.bold ? "bold" : "normal",
                              fontStyle: el.italic ? "italic" : "normal",
                              textDecoration: el.underline ? "underline" : "none",
                              color: el.color || "#FFFFFF",
                              fontSize: `${Math.max(12, Math.round((el.fontSize || 22) * 0.8))}px`,
                              textAlign: el.align || "center",
                            }}
                            className="select-none leading-tight truncate px-1 text-center drop-shadow-sm"
                          >
                            {el.text}
                          </span>
                        )}

                        {/* Shape Layer */}
                        {el.type === "shape" && (
                          <div
                            style={{
                              backgroundColor: el.fillColor || "#80011F",
                              borderRadius: el.shapeType === "circle" ? "9999px" : "4px",
                            }}
                            className="w-full h-full"
                          />
                        )}

                        {/* Selection Corner Handles (visible when selected) */}
                        {isSelected && !el.locked && (
                          <>
                            <span
                              onPointerDown={(e) => handleResizeHandleDown(el.id, "tl", e)}
                              className="absolute -top-1.5 -left-1.5 h-3.5 w-3.5 rounded-full bg-white border-2 border-[#80011F] cursor-nwse-resize shadow"
                            />
                            <span
                              onPointerDown={(e) => handleResizeHandleDown(el.id, "tr", e)}
                              className="absolute -top-1.5 -right-1.5 h-3.5 w-3.5 rounded-full bg-white border-2 border-[#80011F] cursor-nesw-resize shadow"
                            />
                            <span
                              onPointerDown={(e) => handleResizeHandleDown(el.id, "bl", e)}
                              className="absolute -bottom-1.5 -left-1.5 h-3.5 w-3.5 rounded-full bg-white border-2 border-[#80011F] cursor-nesw-resize shadow"
                            />
                            <span
                              onPointerDown={(e) => handleResizeHandleDown(el.id, "br", e)}
                              className="absolute -bottom-1.5 -right-1.5 h-3.5 w-3.5 rounded-full bg-white border-2 border-[#80011F] cursor-nwse-resize shadow"
                            />
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Angle Thumbnails */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/90 border border-rose-100 rounded-2xl p-1.5 shadow-md">
                <button
                  type="button"
                  onClick={() => setActiveSide("front")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeSide === "front" ? "bg-[#80011F] text-white shadow-xs" : "text-gray-700 hover:bg-rose-50"
                  }`}
                >
                  <span>Front</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSide("back")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeSide === "back" ? "bg-[#80011F] text-white shadow-xs" : "text-gray-700 hover:bg-rose-50"
                  }`}
                >
                  <span>Back</span>
                </button>
              </div>
            </div>

            {/* ---------------------------------------------------- */}
            {/* RIGHT PANEL: Properties & Layers                     */}
            {/* ---------------------------------------------------- */}
            <div className="hidden md:flex flex-col w-[280px] lg:w-[310px] border-l border-rose-100 bg-[#FFFDFE] p-4 overflow-y-auto space-y-4">
              {/* If Element Selected: Show Properties */}
              {selectedElement ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-gray-900 uppercase tracking-wider">
                      {selectedElement.type === "logo" ? "Logo Properties" : "Text Properties"}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentElements((prev) => prev.filter((el) => el.id !== selectedElement.id));
                        setSelectedElementId(null);
                      }}
                      className="text-red-500 hover:text-red-700 p-1"
                      title="Delete Element"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  {/* Size Slider */}
                  <div>
                    <div className="flex justify-between text-[11px] font-bold text-gray-600">
                      <span>Size</span>
                      <span>{selectedElement.width}% (approx 3.5&quot; wide)</span>
                    </div>
                    <input
                      type="range"
                      min="15"
                      max="90"
                      value={selectedElement.width}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        setCurrentElements((prev) =>
                          prev.map((el) => (el.id === selectedElement.id ? { ...el, width: val } : el))
                        );
                      }}
                      className="w-full accent-[#80011F] mt-1"
                    />
                  </div>

                  {/* Position D-Pad */}
                  <div>
                    <label className="text-[11px] font-bold text-gray-600">Position</label>
                    <div className="mt-2 flex flex-col items-center gap-1">
                      <button
                        type="button"
                        onClick={() => nudgeSelectedElement("up")}
                        className="h-7 w-8 rounded-lg bg-gray-100 hover:bg-rose-100 text-gray-700 flex items-center justify-center font-bold cursor-pointer"
                      >
                        ▲
                      </button>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => nudgeSelectedElement("left")}
                          className="h-7 w-8 rounded-lg bg-gray-100 hover:bg-rose-100 text-gray-700 flex items-center justify-center font-bold cursor-pointer"
                        >
                          ◀
                        </button>
                        <button
                          type="button"
                          onClick={() => nudgeSelectedElement("center")}
                          className="h-7 w-12 rounded-lg bg-rose-50 border border-rose-200 text-[#80011F] text-[10px] font-bold flex items-center justify-center cursor-pointer"
                        >
                          Center
                        </button>
                        <button
                          type="button"
                          onClick={() => nudgeSelectedElement("right")}
                          className="h-7 w-8 rounded-lg bg-gray-100 hover:bg-rose-100 text-gray-700 flex items-center justify-center font-bold cursor-pointer"
                        >
                          ▶
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => nudgeSelectedElement("down")}
                        className="h-7 w-8 rounded-lg bg-gray-100 hover:bg-rose-100 text-gray-700 flex items-center justify-center font-bold cursor-pointer"
                      >
                        ▼
                      </button>
                    </div>
                  </div>

                  {/* Logo Specific Options: Remove BG & Enhance */}
                  {selectedElement.type === "logo" && (
                    <div className="space-y-2.5 pt-2 border-t border-rose-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-gray-900">Remove Background</p>
                          <p className="text-[10px] text-gray-500">Auto transparent PNG</p>
                        </div>
                        <button
                          type="button"
                          disabled={isProcessingBg}
                          onClick={() => handleToggleBgRemoval(selectedElement.id)}
                          className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors cursor-pointer ${
                            selectedElement.hasRemovedBg ? "bg-[#80011F]" : "bg-gray-300"
                          }`}
                        >
                          <span
                            className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                              selectedElement.hasRemovedBg ? "translate-x-5" : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-gray-900">Enhance Quality</p>
                          <p className="text-[10px] text-gray-500">Sharpen contrast</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleToggleEnhance(selectedElement.id)}
                          className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors cursor-pointer ${
                            selectedElement.isEnhanced ? "bg-[#80011F]" : "bg-gray-300"
                          }`}
                        >
                          <span
                            className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                              selectedElement.isEnhanced ? "translate-x-5" : "translate-x-1"
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Opacity Slider */}
                  <div className="pt-2 border-t border-rose-100">
                    <div className="flex justify-between text-[11px] font-bold text-gray-600">
                      <span>Opacity</span>
                      <span>{Math.round(selectedElement.opacity * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.2"
                      max="1"
                      step="0.05"
                      value={selectedElement.opacity}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setCurrentElements((prev) =>
                          prev.map((el) => (el.id === selectedElement.id ? { ...el, opacity: val } : el))
                        );
                      }}
                      className="w-full accent-[#80011F] mt-1"
                    />
                  </div>
                </div>
              ) : (
                <div className="p-3 text-center text-xs text-gray-500 rounded-xl bg-rose-50/50 border border-rose-100">
                  Select an element on the T-shirt to edit its size, position, and properties.
                </div>
              )}

              {/* Layers Stack List */}
              <div className="pt-3 border-t border-rose-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-extrabold text-gray-800 uppercase tracking-wider">
                    Layers ({currentElements.length})
                  </span>
                </div>

                <div className="space-y-1.5">
                  {currentElements.map((el) => {
                    const isSelected = el.id === selectedElementId;
                    return (
                      <div
                        key={el.id}
                        onClick={() => setSelectedElementId(el.id)}
                        className={`flex items-center justify-between gap-2 p-2 rounded-xl border text-xs cursor-pointer transition-all ${
                          isSelected
                            ? "bg-rose-50 border-[#80011F] font-bold text-[#80011F]"
                            : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          {el.type === "logo" ? <Scan size={14} /> : <Type size={14} />}
                          <span className="truncate">{el.name}</span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentElements((prev) =>
                                prev.map((item) =>
                                  item.id === el.id ? { ...item, visible: !item.visible } : item
                                )
                              );
                            }}
                            className="p-1 text-gray-400 hover:text-black"
                          >
                            {el.visible ? <Eye size={13} /> : <EyeOff size={13} />}
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentElements((prev) =>
                                prev.map((item) =>
                                  item.id === el.id ? { ...item, locked: !item.locked } : item
                                )
                              );
                            }}
                            className="p-1 text-gray-400 hover:text-black"
                          >
                            {el.locked ? <Lock size={13} /> : <Unlock size={13} />}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* MOBILE RESPONSIVE BOTTOM TOOLBAR & TABS (< md)           */}
          {/* ======================================================== */}
          <div className="md:hidden flex flex-col border-t border-rose-100 bg-white shrink-0">
            {/* Quick Actions Drawer / Sheet based on mobile tab */}
            <div className="p-3 bg-rose-50/40 border-b border-rose-100 max-h-[160px] overflow-y-auto">
              {mobileActiveTab === "product" && (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-gray-700">Colour:</span>
                    <div className="flex gap-1.5">
                      {product.colors.map((c, i) => (
                        <button
                          key={c.name}
                          type="button"
                          onClick={() => setSelectedColorIdx(i)}
                          className={`h-6 w-6 rounded-full border ${
                            selectedColorIdx === i ? "ring-2 ring-[#80011F]" : ""
                          }`}
                          style={{ backgroundColor: c.hex }}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-gray-700">Preset:</span>
                    {(["Left Chest", "Right Chest", "Center Chest"] as const).map((pos) => (
                      <button
                        key={pos}
                        type="button"
                        onClick={() => applyFrontPreset(pos)}
                        className={`rounded-lg px-2 py-1 text-[10px] font-bold border ${
                          frontPreset === pos ? "bg-[#80011F] text-white" : "bg-white text-gray-700"
                        }`}
                      >
                        {pos}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {mobileActiveTab === "logo" && (
                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-bold text-gray-700"
                  >
                    <Upload size={13} />
                    <span>Upload Logo</span>
                  </button>
                  {selectedElement?.type === "logo" && (
                    <button
                      type="button"
                      onClick={() => handleToggleBgRemoval(selectedElement.id)}
                      className="px-3 py-1.5 rounded-lg bg-[#80011F] text-white text-xs font-bold"
                    >
                      {selectedElement.hasRemovedBg ? "Restore BG" : "Remove BG"}
                    </button>
                  )}
                </div>
              )}

              {mobileActiveTab === "text" && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleAddNewText("Your Text")}
                    className="flex items-center gap-1 rounded-lg bg-[#80011F] px-3 py-1.5 text-xs font-bold text-white shadow-xs"
                  >
                    <Plus size={13} />
                    <span>Add Text</span>
                  </button>
                </div>
              )}

              {mobileActiveTab === "layers" && (
                <div className="flex gap-2 overflow-x-auto py-1">
                  {currentElements.map((el) => (
                    <button
                      key={el.id}
                      type="button"
                      onClick={() => setSelectedElementId(el.id)}
                      className={`px-2.5 py-1 rounded-lg border text-xs font-bold whitespace-nowrap ${
                        selectedElementId === el.id ? "bg-[#80011F] text-white" : "bg-white text-gray-700"
                      }`}
                    >
                      {el.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 4 Bottom Navigation Buttons */}
            <div className="grid grid-cols-4 p-2 gap-1 bg-[#FFF9FA]">
              <button
                type="button"
                onClick={() => setMobileActiveTab("product")}
                className={`flex flex-col items-center gap-1 py-1 rounded-xl text-[10px] font-bold ${
                  mobileActiveTab === "product" ? "text-[#80011F]" : "text-gray-500"
                }`}
              >
                <Palette size={16} />
                <span>Product</span>
              </button>
              <button
                type="button"
                onClick={() => setMobileActiveTab("logo")}
                className={`flex flex-col items-center gap-1 py-1 rounded-xl text-[10px] font-bold ${
                  mobileActiveTab === "logo" ? "text-[#80011F]" : "text-gray-500"
                }`}
              >
                <Scan size={16} />
                <span>Logo</span>
              </button>
              <button
                type="button"
                onClick={() => setMobileActiveTab("text")}
                className={`flex flex-col items-center gap-1 py-1 rounded-xl text-[10px] font-bold ${
                  mobileActiveTab === "text" ? "text-[#80011F]" : "text-gray-500"
                }`}
              >
                <Type size={16} />
                <span>Text</span>
              </button>
              <button
                type="button"
                onClick={() => setMobileActiveTab("layers")}
                className={`flex flex-col items-center gap-1 py-1 rounded-xl text-[10px] font-bold ${
                  mobileActiveTab === "layers" ? "text-[#80011F]" : "text-gray-500"
                }`}
              >
                <Layers size={16} />
                <span>Layers</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
