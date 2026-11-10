/**
 * Design Studio Canvas Utilities
 * High-performance, pixel-accurate HTML5 Canvas utilities for:
 * 1. Intelligent Edge Flood-Fill Background Removal (preserves interior white elements)
 * 2. Precision Image Cropping with PNG Transparency
 * 3. Composite Garment Image Generation (Garment + Front/Back Design Layers)
 */

export interface CropArea {
  x: number; // percentage 0 - 100
  y: number; // percentage 0 - 100
  width: number; // percentage 0 - 100
  height: number; // percentage 0 - 100
}

/**
 * Automatically removes plain white or light solid backgrounds from uploaded logos.
 * Uses edge-based flood-fill starting from all 4 corners and borders inward,
 * ensuring that interior white text, white logos, and interior elements are NOT removed!
 */
export function removeBackgroundCanvas(
  sourceUrl: string,
  tolerance: number = 32
): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const w = img.naturalWidth || img.width;
      const h = img.naturalHeight || img.height;

      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        resolve(sourceUrl);
        return;
      }

      ctx.drawImage(img, 0, 0, w, h);
      const imgData = ctx.getImageData(0, 0, w, h);
      const data = imgData.data;

      // Sample 4 corners to find background reference color
      const sampleCorner = (x: number, y: number) => {
        const idx = (y * w + x) * 4;
        return { r: data[idx], g: data[idx + 1], b: data[idx + 2], a: data[idx + 3] };
      };

      const c1 = sampleCorner(0, 0);
      const c2 = sampleCorner(w - 1, 0);
      const c3 = sampleCorner(0, h - 1);
      const c4 = sampleCorner(w - 1, h - 1);

      // Average corner RGB
      const refR = Math.round((c1.r + c2.r + c3.r + c4.r) / 4);
      const refG = Math.round((c1.g + c2.g + c3.g + c4.g) / 4);
      const refB = Math.round((c1.b + c2.b + c3.b + c4.b) / 4);

      // If the image already has transparent corners, it already is a transparent PNG
      if (c1.a < 100 || c2.a < 100 || c3.a < 100 || c4.a < 100) {
        resolve(sourceUrl);
        return;
      }

      // Check if reference color is light or solid
      const isMatch = (r: number, g: number, b: number) => {
        const diffR = Math.abs(r - refR);
        const diffG = Math.abs(g - refG);
        const diffB = Math.abs(b - refB);
        return diffR <= tolerance && diffG <= tolerance && diffB <= tolerance;
      };

      // Breadth-First-Search (BFS) Flood-fill from borders only
      const visited = new Uint8Array(w * h);
      const queue: number[] = [];

      // Seed all border pixels that match the reference background
      for (let x = 0; x < w; x++) {
        // top edge
        const topIdx = x;
        if (!visited[topIdx]) {
          const p = topIdx * 4;
          if (isMatch(data[p], data[p + 1], data[p + 2])) {
            visited[topIdx] = 1;
            queue.push(topIdx);
          }
        }
        // bottom edge
        const btmIdx = (h - 1) * w + x;
        if (!visited[btmIdx]) {
          const p = btmIdx * 4;
          if (isMatch(data[p], data[p + 1], data[p + 2])) {
            visited[btmIdx] = 1;
            queue.push(btmIdx);
          }
        }
      }

      for (let y = 0; y < h; y++) {
        // left edge
        const leftIdx = y * w;
        if (!visited[leftIdx]) {
          const p = leftIdx * 4;
          if (isMatch(data[p], data[p + 1], data[p + 2])) {
            visited[leftIdx] = 1;
            queue.push(leftIdx);
          }
        }
        // right edge
        const rightIdx = y * w + (w - 1);
        if (!visited[rightIdx]) {
          const p = rightIdx * 4;
          if (isMatch(data[p], data[p + 1], data[p + 2])) {
            visited[rightIdx] = 1;
            queue.push(rightIdx);
          }
        }
      }

      // Process flood fill
      let head = 0;
      while (head < queue.length) {
        const curr = queue[head++];
        const cx = curr % w;
        const cy = Math.floor(curr / w);

        // Turn this background pixel completely transparent
        const p = curr * 4;
        data[p + 3] = 0;

        // 4-neighborhood
        const neighbors = [
          cx > 0 ? curr - 1 : -1,
          cx < w - 1 ? curr + 1 : -1,
          cy > 0 ? curr - w : -1,
          cy < h - 1 ? curr + w : -1,
        ];

        for (const n of neighbors) {
          if (n !== -1 && !visited[n]) {
            const np = n * 4;
            if (isMatch(data[np], data[np + 1], data[np + 2])) {
              visited[n] = 1;
              queue.push(n);
            }
          }
        }
      }

      ctx.putImageData(imgData, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };

    img.onerror = () => resolve(sourceUrl);
    img.src = sourceUrl;
  });
}

/**
 * Pixel-accurate HTML5 Canvas cropper that outputs transparent PNG
 */
export function cropImageCanvas(
  sourceUrl: string,
  cropArea: CropArea
): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const naturalW = img.naturalWidth || img.width;
      const naturalH = img.naturalHeight || img.height;

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

      ctx.clearRect(0, 0, pixelW, pixelH);
      ctx.drawImage(img, pixelX, pixelY, pixelW, pixelH, 0, 0, pixelW, pixelH);

      resolve(canvas.toDataURL("image/png"));
    };

    img.onerror = () => resolve(sourceUrl);
    img.src = sourceUrl;
  });
}

/**
 * Generates an enhanced high-contrast / sharpened version of a logo.
 */
export function enhanceLogoCanvas(sourceUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const w = img.naturalWidth || img.width;
      const h = img.naturalHeight || img.height;

      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve(sourceUrl);
        return;
      }

      ctx.filter = "contrast(1.15) brightness(1.02) saturate(1.05)";
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => resolve(sourceUrl);
    img.src = sourceUrl;
  });
}

export interface RenderLayerItem {
  type: "logo" | "text" | "shape";
  x: number; // percentage of printable area (0 - 100)
  y: number;
  width: number; // percentage of printable area
  height: number;
  rotation?: number;
  opacity?: number;
  imageUrl?: string;
  text?: string;
  fontFamily?: string;
  fontSize?: number;
  color?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  align?: "left" | "center" | "right";
  shapeType?: "rect" | "circle" | "triangle" | "line";
  fillColor?: string;
}

/**
 * Composite function that renders garment + printable layers into a final PNG preview.
 */
export async function generateCompositeGarment(
  garmentImageUrl: string,
  printableArea: { leftPct: number; topPct: number; widthPct: number; heightPct: number },
  layers: RenderLayerItem[]
): Promise<string> {
  return new Promise((resolve) => {
    const garmentImg = new Image();
    garmentImg.crossOrigin = "anonymous";

    garmentImg.onload = async () => {
      const w = garmentImg.naturalWidth || 800;
      const h = garmentImg.naturalHeight || 900;

      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        resolve(garmentImageUrl);
        return;
      }

      // 1. Draw base garment
      ctx.drawImage(garmentImg, 0, 0, w, h);

      // Printable area coordinates on the full garment canvas
      const printX = (printableArea.leftPct / 100) * w;
      const printY = (printableArea.topPct / 100) * h;
      const printW = (printableArea.widthPct / 100) * w;
      const printH = (printableArea.heightPct / 100) * h;

      // 2. Render each layer in order
      for (const item of layers) {
        ctx.save();
        const itemX = printX + (item.x / 100) * printW;
        const itemY = printY + (item.y / 100) * printH;
        const itemW = (item.width / 100) * printW;
        const itemH = (item.height / 100) * printH;

        ctx.globalAlpha = item.opacity ?? 1;

        // Handle rotation around element center
        if (item.rotation) {
          ctx.translate(itemX + itemW / 2, itemY + itemH / 2);
          ctx.rotate((item.rotation * Math.PI) / 180);
          ctx.translate(-(itemX + itemW / 2), -(itemY + itemH / 2));
        }

        if (item.type === "logo" && item.imageUrl) {
          try {
            const logoImg = await loadImage(item.imageUrl);
            ctx.drawImage(logoImg, itemX, itemY, itemW, itemH);
          } catch {}
        } else if (item.type === "text" && item.text) {
          const fontWeight = item.bold ? "bold" : "normal";
          const fontStyle = item.italic ? "italic" : "normal";
          const fontSize = Math.max(14, Math.round((item.fontSize || 24) * (w / 800)));
          const fontFamily = item.fontFamily || "Poppins, sans-serif";

          ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
          ctx.fillStyle = item.color || "#FFFFFF";
          ctx.textAlign = item.align || "center";
          ctx.textBaseline = "middle";

          const textX = item.align === "left" ? itemX : item.align === "right" ? itemX + itemW : itemX + itemW / 2;
          const textY = itemY + itemH / 2;

          ctx.fillText(item.text, textX, textY);
          if (item.underline) {
            const metrics = ctx.measureText(item.text);
            const lineX = textX - (item.align === "center" ? metrics.width / 2 : 0);
            ctx.fillRect(lineX, textY + fontSize / 2, metrics.width, 2);
          }
        } else if (item.type === "shape") {
          ctx.fillStyle = item.fillColor || "#80011F";
          if (item.shapeType === "circle") {
            ctx.beginPath();
            ctx.ellipse(itemX + itemW / 2, itemY + itemH / 2, itemW / 2, itemH / 2, 0, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.fillRect(itemX, itemY, itemW, itemH);
          }
        }

        ctx.restore();
      }

      resolve(canvas.toDataURL("image/png"));
    };

    garmentImg.onerror = () => resolve(garmentImageUrl);
    garmentImg.src = garmentImageUrl;
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

