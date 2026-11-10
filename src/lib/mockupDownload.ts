/**
 * TeesZone Branded Mockup Generator & Downloader
 * Generates high-resolution (2400 x 1400) PNG presentation containing:
 * - FRONT VIEW on the left
 * - BACK VIEW on the right
 * - TeesZone logo in top-right corner
 * - Product & customisation info in top-left
 * - Deep burgundy (#80011F) footer contact bar (75500 67723 | teeszone.in)
 */

export interface BrandedMockupOptions {
  productName: string;
  frontImageUrl: string;
  backImageUrl?: string;
  colorName?: string;
  companyName?: string;
}

function loadImageSafe(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => {
      // If CORS or local image error, retry with bare image without crossOrigin
      const fallbackImg = new Image();
      fallbackImg.onload = () => resolve(fallbackImg);
      fallbackImg.onerror = reject;
      fallbackImg.src = src;
    };
    img.src = src;
  });
}

export async function generateAndDownloadBrandedMockup(
  options: BrandedMockupOptions
): Promise<void> {
  const width = 2400;
  const height = 1400;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Canvas context not available");
  }

  // 1. Premium Light Cream Background
  ctx.fillStyle = "#FAF8F5";
  ctx.fillRect(0, 0, width, height);

  // Subtle Top Burgundy Accent Stripe
  ctx.fillStyle = "#80011F";
  ctx.fillRect(0, 0, width, 6);

  // 2. Top-Left Header: Product & Customization Title
  ctx.fillStyle = "#231F20";
  ctx.font = "bold 44px Montserrat, Poppins, sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  const displayTitle = options.companyName
    ? `${options.companyName} — ${options.productName}`
    : options.productName;
  ctx.fillText(displayTitle.slice(0, 55), 90, 50);

  // Subtitle
  ctx.fillStyle = "#736A6E";
  ctx.font = "600 24px Poppins, sans-serif";
  const colorText = options.colorName ? `Colour: ${options.colorName} • ` : "";
  ctx.fillText(`${colorText}Customised T-Shirt Mockup Presentation`, 90, 108);

  // 3. Top-Right Header: TeesZone Logo Branding
  try {
    const logoImg = await loadImageSafe("/logo.webp");
    const logoRatio = logoImg.width / logoImg.height;
    const logoH = 68;
    const logoW = Math.round(logoH * logoRatio);
    ctx.drawImage(logoImg, width - 90 - logoW, 46, logoW, logoH);
  } catch {
    // Fallback text branding if logo.webp cannot be loaded
    ctx.fillStyle = "#80011F";
    ctx.font = "900 38px Montserrat, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText("TEESZONE", width - 90, 50);
  }

  // 4. Center Area: Both T-Shirts (Left = Front View, Right = Back View)
  const contentTop = 160;
  const viewWidth = 1040;
  const viewHeight = 980;

  // Front View (Left)
  const frontBoxX = 100;
  const frontBoxY = contentTop;

  // Back View (Right)
  const backBoxX = 1260;
  const backBoxY = contentTop;

  // Helper to draw garment contained inside box without cropping
  const drawContainedGarment = async (imgUrl: string, boxX: number, boxY: number) => {
    try {
      const img = await loadImageSafe(imgUrl);
      const imgW = img.naturalWidth || img.width;
      const imgH = img.naturalHeight || img.height;

      const scale = Math.min(viewWidth / imgW, viewHeight / imgH) * 0.96;
      const renderW = Math.round(imgW * scale);
      const renderH = Math.round(imgH * scale);

      const renderX = boxX + Math.round((viewWidth - renderW) / 2);
      const renderY = boxY + Math.round((viewHeight - renderH) / 2);

      // Subtle garment shadow
      ctx.save();
      ctx.shadowColor = "rgba(0, 0, 0, 0.08)";
      ctx.shadowBlur = 28;
      ctx.shadowOffsetY = 14;
      ctx.drawImage(img, renderX, renderY, renderW, renderH);
      ctx.restore();
    } catch {
      // Draw placeholder if image load failed
      ctx.fillStyle = "#EAE5DE";
      ctx.fillRect(boxX + 100, boxY + 100, viewWidth - 200, viewHeight - 200);
    }
  };

  // Draw Front Image
  const frontSrc = options.frontImageUrl || "/products/polo-black-front-3d.png";
  await drawContainedGarment(frontSrc, frontBoxX, frontBoxY);

  // Draw Front View Pill Badge
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const frontCenterX = frontBoxX + viewWidth / 2;
  const badgeY = frontBoxY + viewHeight + 20;

  ctx.fillStyle = "rgba(128, 1, 31, 0.08)";
  drawRoundedRect(ctx, frontCenterX - 95, badgeY - 18, 190, 36, 18);
  ctx.fill();

  ctx.fillStyle = "#80011F";
  ctx.font = "bold 18px Poppins, sans-serif";
  ctx.fillText("FRONT VIEW", frontCenterX, badgeY);
  ctx.restore();

  // Draw Back Image
  const backSrc =
    options.backImageUrl ||
    (options.frontImageUrl.includes("back") ? options.frontImageUrl : "/products/polo-black-back-3d.png");
  await drawContainedGarment(backSrc, backBoxX, backBoxY);

  // Draw Back View Pill Badge
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const backCenterX = backBoxX + viewWidth / 2;

  ctx.fillStyle = "rgba(128, 1, 31, 0.08)";
  drawRoundedRect(ctx, backCenterX - 95, badgeY - 18, 190, 36, 18);
  ctx.fill();

  ctx.fillStyle = "#80011F";
  ctx.font = "bold 18px Poppins, sans-serif";
  ctx.fillText("BACK VIEW", backCenterX, badgeY);
  ctx.restore();

  // 5. Bottom Deep Burgundy Contact Bar
  const footerHeight = 90;
  const footerY = height - footerHeight;

  ctx.fillStyle = "#80011F";
  ctx.fillRect(0, footerY, width, footerHeight);

  // Contact Information centered in footer
  ctx.fillStyle = "#FFF8F2";
  ctx.font = "600 24px Poppins, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const contactText = "📞  75500 67723          🌐  teeszone.in          ✨  Custom Corporate Apparel & Uniforms";
  ctx.fillText(contactText, width / 2, footerY + footerHeight / 2);

  // 6. Trigger Automatic Download
  const dataUrl = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  const safeFilename = `${options.productName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-custom-mockup.png`;
  link.download = safeFilename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
