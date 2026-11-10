import type { Product } from "../lib/types";

const ADULT = ["S", "M", "L", "XL", "XXL"];
const KIDS = ["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-11Y", "12-13Y"];

export const QTY = [
  { minQty: 2, offPct: 0 },
  { minQty: 3, offPct: 12 },
  { minQty: 6, offPct: 24 },
  { minQty: 11, offPct: 27 },
  { minQty: 15, offPct: 28 },
  { minQty: 20, offPct: 32 },
  { minQty: 30, offPct: 35 },
  { minQty: 50, offPct: 39 },
  { minQty: 76, offPct: 43 },
];

const c = {
  black: { name: "Black", hex: "#26282D" },
  white: { name: "White", hex: "#F1F2F4" },
  navy: { name: "Navy Blue", hex: "#1E3A5F" },
  maroon: { name: "Maroon", hex: "#7B2438" },
  royal: { name: "Royal Blue", hex: "#2749C9" },
  grey: { name: "Grey Melange", hex: "#9AA0A8" },
  mustard: { name: "Mustard", hex: "#E3B341" },
  charcoal: { name: "Charcoal", hex: "#3A3F46" },
  pink: { name: "Pink", hex: "#E8175D" },
};

export const products: Product[] = [
  // ==========================================
  // MEN'S POLO T-SHIRTS (3 PRODUCTS)
  // ==========================================

  // 1. Aerosoft Polo T-Shirt - 200 GSM
  {
    id: "p-aerosoft-polo-200",
    name: "Men's AeroSoft Polo T-Shirt (200 GSM) | 100% Microfiber Quick-Dry Performance Corporate Polo",
    slug: "aerosoft-polo-200",
    collections: ["aerosoft-polo-200", "men"],
    description: "Engineered 200 GSM Aerosoft knit polo t-shirt. Ultra-soft breathable texture with moisture-wicking technology and anti-wrinkle performance, ideal for corporate uniforms, staff apparel, and daily workwear.",
    fit: "Modern regular polo fit with tailored comfort.",
    fabric: "100% Microfiber Poly-Rich Performance Knit",
    gsm: 200,
    mrp: 649,
    price: 369,
    colors: [
      { ...c.royal, image: "/products/polo-navy.svg" },
      {
        ...c.black,
        image: "/products/polo-black-front-3d.png",
        backImage: "/products/polo-black-back-3d.png",
      },
      { ...c.white, image: "/products/polo-white.svg" },
    ],
    sizes: ADULT,
    qtyDiscounts: QTY,
    features: [
      "Aerosoft lightweight 200 GSM knit for all-day breathability",
      "Anti-pilling and color-fast technology for long-lasting wear",
      "Reinforced ribbed collar and 3-button placket ready for company logo",
    ],
    isNew: true,
  },

  // 2. Mens Polo Half Sleeve - 240-250 GSM
  {
    id: "p-mens-polo-half-sleeve-240",
    name: "Men's Polo Half Sleeve T-Shirt (240-250 GSM) | 100% Compact Cotton Pique Knit Premium Corporate Polo",
    slug: "mens-polo-half-sleeve-240",
    collections: ["mens-polo-half-sleeve-240", "men"],
    description: "Executive 240-250 GSM heavyweight compact cotton pique polo t-shirt. Features superior stitch density, anti-curl ribbed collar, and smooth hand-feel tailored for corporate teams and luxury brand merchandise.",
    fit: "Classic executive regular polo fit.",
    fabric: "100% Compact Cotton Heavy Pique (240-250 GSM)",
    gsm: 245,
    mrp: 799,
    price: 469,
    colors: [
      {
        ...c.navy,
        image: "http://localhost:4010/api/upload/media/teeszone/mens-polo-half-sleeve-240/navy-blue/view-5.webp",
        backImage: "http://localhost:4010/api/upload/media/teeszone/mens-polo-half-sleeve-240/navy-blue/view-2.webp",
        chestImage: "http://localhost:4010/api/upload/media/teeszone/mens-polo-half-sleeve-240/navy-blue/view-3.webp",
        detailImage: "http://localhost:4010/api/upload/media/teeszone/mens-polo-half-sleeve-240/navy-blue/view-4.webp",
        image4: "http://localhost:4010/api/upload/media/teeszone/mens-polo-half-sleeve-240/navy-blue/view-1.webp",
        image5: "http://localhost:4010/api/upload/media/teeszone/mens-polo-half-sleeve-240/navy-blue/view-6.webp",
      },
      {
        ...c.white,
        image: "http://localhost:4010/api/upload/media/teeszone/mens-polo-half-sleeve-240/white/view-4.webp",
        backImage: "http://localhost:4010/api/upload/media/teeszone/mens-polo-half-sleeve-240/white/view-2.webp",
        chestImage: "http://localhost:4010/api/upload/media/teeszone/mens-polo-half-sleeve-240/white/view-3.webp",
        detailImage: "http://localhost:4010/api/upload/media/teeszone/mens-polo-half-sleeve-240/white/view-1.webp",
        image4: "http://localhost:4010/api/upload/media/teeszone/mens-polo-half-sleeve-240/white/view-5.webp",
        image5: "http://localhost:4010/api/upload/media/teeszone/mens-polo-half-sleeve-240/white/view-6.webp",
      },
      {
        ...c.black,
        image: "/products/polo-black-front-3d.png",
        backImage: "/products/polo-black-back-3d.png",
        chestImage: "/products/polo-black-front-3d.png",
        detailImage: "/products/polo-black-back-3d.png",
        image4: "/products/polo-black-front-3d.png",
        image5: "/products/polo-black-back-3d.png",
      },
    ],
    sizes: ADULT,
    qtyDiscounts: QTY,
    features: [
      "240 GSM heavy combed cotton pique knit",
      "Anti-curl collar band with reinforced seam stitching",
      "High-density embroidery and screen printing ready",
    ],
    bestSeller: true,
  },

  // 3. Ecoblend Polo Neck - 240 GSM
  {
    id: "p-ecoblend-polo-neck-240",
    name: "Men's Ecoblend Polo T-Shirt (240 GSM) | Polycotton EcoBlend Fabric, Jacquard Collar with Contrast Tipping",
    slug: "ecoblend-polo-neck-240",
    collections: ["ecoblend-polo-neck-240", "men"],
    description: "Eco-conscious 240 GSM polycotton Ecoblend polo shirt featuring a stylish jacquard collar with contrast tipping. Built for durability, premium comfort, and industrial uniform longevity.",
    fit: "Structured corporate uniform fit.",
    fabric: "Polycotton EcoBlend Fabric with Jacquard Collar & Contrast Tipping",
    gsm: 240,
    mrp: 699,
    price: 399,
    colors: [
      { ...c.navy, image: "/products/polo-navy.svg" },
      {
        ...c.black,
        image: "/products/polo-black-front-3d.png",
        backImage: "/products/polo-black-back-3d.png",
      },
      { ...c.grey, image: "/products/polo-navy.svg" },
    ],
    sizes: ADULT,
    qtyDiscounts: QTY,
    features: [
      "240 GSM heavy-duty polycotton blend for industrial wash durability",
      "Anti-fade and wrinkle-resistant fabric technology",
      "Durable collar structure with neat top-stitching",
    ],
  },

  // ==========================================
  // MEN'S ROUND NECK T-SHIRTS (2 PRODUCTS)
  // ==========================================

  // 4. Mens Round Neck Half Sleeve - 180 GSM
  {
    id: "p-mens-rn-half-180",
    name: "Men's Round Neck Half Sleeve T-Shirt (180 GSM) | 100% Bio-Washed Combed Cotton Custom Printed T-Shirt",
    slug: "mens-rn-half-180",
    collections: ["mens-rn-half-180", "men"],
    description: "Essential 180 GSM 100% bio-washed combed cotton half-sleeve crew neck t-shirt. Pre-shrunk, ultra-soft, breathable drape perfect for events, startups, and everyday branded apparel.",
    fit: "Regular modern fit with smooth silhouette.",
    fabric: "100% Bio-Washed Ring-Spun Cotton",
    gsm: 180,
    mrp: 499,
    price: 289,
    colors: [
      { ...c.black, image: "/products/crew-black.svg" },
      { ...c.white, image: "/products/crew-white.svg" },
      { ...c.royal, image: "/products/crew-royal.svg" },
      { ...c.maroon, image: "/products/crew-maroon.svg" },
    ],
    sizes: ADULT,
    qtyDiscounts: QTY,
    features: [
      "100% Bio-washed ring-spun cotton for supreme softness",
      "Pre-shrunk fabric to prevent shrinking after multiple washes",
      "Double-needle hem and sleeve stitching for daily endurance",
    ],
    bestSeller: true,
  },

  // 5. Mens Round Neck Half Sleeve - 200 GSM (Lycra)
  {
    id: "p-mens-rn-half-200-lycra",
    name: "Men's Round Neck Half Sleeve T-Shirt 200 GSM | 95% Compact Cotton 5% Spandex Lycra Jersey",
    slug: "mens-rn-half-200-lycra",
    collections: ["mens-rn-half-200-lycra", "men"],
    description: "High-performance 200 GSM cotton-Lycra elastane round neck t-shirt. Delivers 4-way elastic stretch, remarkable shape recovery, and body contouring for athletic teams, fitness trainers, and modern corporate workwear.",
    fit: "Tailored stretch athletic fit.",
    fabric: "95% Combed Cotton & 5% Lycra Spandex",
    gsm: 200,
    mrp: 699,
    price: 399,
    colors: [
      { ...c.black, image: "/products/crew-black.svg" },
      { ...c.royal, image: "/products/crew-royal.svg" },
      { ...c.white, image: "/products/crew-white.svg" },
    ],
    sizes: ADULT,
    qtyDiscounts: QTY,
    features: [
      "4-Way stretch Lycra elastane blend with instant recovery",
      "Sweat-absorbing breathable cotton weave",
      "Non-sagging ribbed collar that retains shape",
    ],
    isNew: true,
  },

  // ==========================================
  // MEN'S OVERSIZE T-SHIRTS (1 PRODUCT)
  // ==========================================

  // 6. Mens Oversize Half Sleeve - 240-250 GSM (French Terry)
  {
    id: "p-mens-oversize-french-terry-240",
    name: "Men's Oversize Half Sleeve T-Shirt (240-250 GSM) | 100% Compact Cotton French Terry Drop-Shoulder Streetwear T-Shirt",
    slug: "mens-oversize-french-terry-240",
    collections: ["mens-oversize-french-terry-240", "men"],
    description: "Urban luxury 240-250 GSM French Terry compact cotton oversized half sleeve t-shirt. Styled with dropped shoulders, structured boxy silhouette, and loopback cotton interior for authentic modern streetwear merch.",
    fit: "Boxy oversized streetwear fit with drop shoulders.",
    fabric: "100% Compact Cotton French Terry (240-250 GSM)",
    gsm: 245,
    mrp: 849,
    price: 499,
    colors: [
      {
        ...c.black,
        image: "http://localhost:4010/api/upload/media/teeszone/mens-oversize-french-terry-240/black/view-1.webp",
        backImage: "http://localhost:4010/api/upload/media/teeszone/mens-oversize-french-terry-240/black/view-2.webp",
        chestImage: "http://localhost:4010/api/upload/media/teeszone/mens-oversize-french-terry-240/black/view-3.webp",
        detailImage: "http://localhost:4010/api/upload/media/teeszone/mens-oversize-french-terry-240/black/view-4.webp",
        image4: "http://localhost:4010/api/upload/media/teeszone/mens-oversize-french-terry-240/black/view-5.webp",
      },
      { ...c.charcoal, image: "/products/crew-black.svg" },
      { ...c.white, image: "/products/crew-white.svg" },
    ],
    sizes: ADULT,
    qtyDiscounts: QTY,
    features: [
      "Heavyweight 240-250 GSM French Terry loopback fabric",
      "Dropped shoulder seams for authentic boxy street silhouette",
      "Thick rib collar with zero distortion after wash",
    ],
    bestSeller: true,
  },

  // ==========================================
  // HOODIES CATEGORIES (4 PRODUCTS)
  // ==========================================

  // 7. Hoodies with Zip - 320 GSM
  {
    id: "p-hoodie-with-zip-320",
    name: "Hoodies with Zip (320 GSM) | Cotton Rich Fabric, Biowashed Softness, Modern Fit & Premium Finish",
    slug: "hoodie-with-zip-320",
    collections: ["hoodie-with-zip-320", "hoodies"],
    description: "Comfortable 320 GSM cotton-rich brushed fleece full-zip hoodie. Features biowashed softness, modern tailored fit, antique-finish metal zipper, split kangaroo pockets, and double-layered warm hood.",
    fit: "Modern full-zip layering fit.",
    fabric: "320 GSM Cotton Rich Brushed Fleece, Biowashed Softness",
    gsm: 320,
    mrp: 1299,
    price: 749,
    colors: [
      {
        ...c.navy,
        image: "/products/hoodies/with-zip/navy/main.webp",
        backImage: "/products/hoodies/with-zip/navy/back.webp",
        chestImage: "/products/hoodies/with-zip/navy/chest.webp",
        detailImage: "/products/hoodies/with-zip/navy/detail.webp",
        image4: "/products/hoodies/with-zip/navy/angle.webp",
        image5: "/products/hoodies/with-zip/navy/fit.webp",
      },
      {
        ...c.grey,
        image: "/products/hoodies/with-zip/grey/main.webp",
        backImage: "/products/hoodies/with-zip/grey/back.webp",
        chestImage: "/products/hoodies/with-zip/grey/chest.webp",
        detailImage: "/products/hoodies/with-zip/grey/detail.webp",
        image4: "/products/hoodies/with-zip/grey/angle.webp",
        image5: "/products/hoodies/with-zip/grey/fit.webp",
      },
      {
        ...c.black,
        image: "/products/hoodies/with-zip/black/main.webp",
        backImage: "/products/hoodies/with-zip/black/back.webp",
        chestImage: "/products/hoodies/with-zip/black/chest.webp",
        detailImage: "/products/hoodies/with-zip/black/detail.webp",
        image4: "/products/hoodies/with-zip/black/angle.webp",
        image5: "/products/hoodies/with-zip/black/fit.webp",
      },
    ],
    sizes: ADULT,
    qtyDiscounts: QTY,
    features: [
      "320 GSM plush brushed fleece interior for winter warmth",
      "Heavy-duty metallic full front zipper with easy-glide puller",
      "Split kangaroo pockets with reinforced stress seams",
    ],
    bestSeller: true,
  },

  // 8. Hoodies without Zip - 320 GSM
  {
    id: "p-hoodie-without-zip-320",
    name: "Hoodies without Zip (320 GSM) | Cotton Rich Fabric, Biowashed Softness, Modern Fit & Premium Finish",
    slug: "hoodie-without-zip-320",
    collections: ["hoodie-without-zip-320", "hoodies"],
    description: "Classic 320 GSM pullover hoodie constructed in heavy cotton-rich fleece. Features biowashed softness, modern relaxed fit, spacious front kangaroo pocket, double-layer drawstring hood, and stretch-ribbed trims.",
    fit: "Modern relaxed pullover hoodie fit.",
    fabric: "320 GSM Cotton Rich Brushed Fleece, Biowashed Softness",
    gsm: 320,
    mrp: 1199,
    price: 699,
    colors: [
      {
        ...c.navy,
        image: "/products/hoodies/without-zip/navy/main.webp",
        backImage: "/products/hoodies/without-zip/navy/back.webp",
        chestImage: "/products/hoodies/without-zip/navy/chest.webp",
        detailImage: "/products/hoodies/without-zip/navy/detail.webp",
        image4: "/products/hoodies/without-zip/navy/angle.webp",
        image5: "/products/hoodies/without-zip/navy/fit.webp",
      },
      {
        ...c.grey,
        image: "/products/hoodies/without-zip/grey/main.webp",
        backImage: "/products/hoodies/without-zip/grey/back.webp",
        chestImage: "/products/hoodies/without-zip/grey/chest.webp",
        detailImage: "/products/hoodies/without-zip/grey/detail.webp",
        image4: "/products/hoodies/without-zip/grey/angle.webp",
        image5: "/products/hoodies/without-zip/grey/fit.webp",
      },
      {
        ...c.black,
        image: "/products/hoodies/without-zip/black/main.webp",
        backImage: "/products/hoodies/without-zip/black/back.webp",
        chestImage: "/products/hoodies/without-zip/black/chest.webp",
        detailImage: "/products/hoodies/without-zip/black/detail.webp",
        image4: "/products/hoodies/without-zip/black/angle.webp",
        image5: "/products/hoodies/without-zip/black/fit.webp",
      },
    ],
    sizes: ADULT,
    qtyDiscounts: QTY,
    features: [
      "320 GSM dense fleece lining for thermal insulation",
      "Spacious kangaroo pouch pocket for hands and essentials",
      "Matching flat braided drawcords with capped aglets",
    ],
  },

  // 9. Unisex Hoodies - 325 GSM
  {
    id: "p-unisex-hoodie-325",
    name: "Unisex Hoodies (325 GSM) | 100% Combed Cotton Brushed Fleece Heavyweight Winter Hoodie",
    slug: "unisex-hoodie-325",
    collections: ["unisex-hoodie-325", "hoodies"],
    description: "Plush 325 GSM 100% combed cotton brushed fleece unisex hoodie. Versatile contemporary styling suited for both men and women, featuring clean flatlock stitching and vibrant printing/embroidery surfaces.",
    fit: "Universal unisex comfort fit.",
    fabric: "100% Combed Cotton Brushed Fleece (325 GSM)",
    gsm: 325,
    mrp: 1399,
    price: 799,
    colors: [
      {
        ...c.navy,
        image: "/products/hoodies/with-zip/navy/main.webp",
        backImage: "/products/hoodies/with-zip/navy/back.webp",
        chestImage: "/products/hoodies/with-zip/navy/chest.webp",
        detailImage: "/products/hoodies/with-zip/navy/detail.webp",
        image4: "/products/hoodies/with-zip/navy/angle.webp",
        image5: "/products/hoodies/with-zip/navy/fit.webp",
      },
      {
        ...c.grey,
        image: "/products/hoodies/with-zip/grey/main.webp",
        backImage: "/products/hoodies/with-zip/grey/back.webp",
        chestImage: "/products/hoodies/with-zip/grey/chest.webp",
        detailImage: "/products/hoodies/with-zip/grey/detail.webp",
        image4: "/products/hoodies/with-zip/grey/angle.webp",
        image5: "/products/hoodies/with-zip/grey/fit.webp",
      },
      {
        ...c.black,
        image: "/products/hoodies/with-zip/black/main.webp",
        backImage: "/products/hoodies/with-zip/black/back.webp",
        chestImage: "/products/hoodies/with-zip/black/chest.webp",
        detailImage: "/products/hoodies/with-zip/black/detail.webp",
        image4: "/products/hoodies/with-zip/black/angle.webp",
        image5: "/products/hoodies/with-zip/black/fit.webp",
      },
    ],
    sizes: ADULT,
    qtyDiscounts: QTY,
    features: [
      "100% Combed Cotton 325 GSM ultra-soft brushed fleece",
      "Neutral unisex proportions for universal flattering fit",
      "Superior surface for high-definition DTF and embroidery",
    ],
    isNew: true,
  },

  // 10. Unisex Hoodies - (360 - 370 GSM)
  {
    id: "p-unisex-hoodie-360",
    name: "Unisex Hoodies (360-370 GSM) | 80% Cotton 20% Polyester Premium Brushed Fleece Heavy Winter Hoodie",
    slug: "unisex-hoodie-360",
    collections: ["unisex-hoodie-360", "hoodies"],
    description: "Ultra-heavy 360-370 GSM 80% cotton 20% polyester premium brushed fleece unisex hoodie. Built for extreme winter cold, high durability, and luxury heavyweight hand-feel with shape retention that never sags.",
    fit: "Heavy structured unisex thermal fit.",
    fabric: "80% Cotton & 20% Polyester Premium Brushed Fleece (360-370 GSM)",
    gsm: 365,
    mrp: 1599,
    price: 899,
    colors: [
      {
        ...c.navy,
        image: "/products/hoodies/without-zip/navy/main.webp",
        backImage: "/products/hoodies/without-zip/navy/back.webp",
        chestImage: "/products/hoodies/without-zip/navy/chest.webp",
        detailImage: "/products/hoodies/without-zip/navy/detail.webp",
        image4: "/products/hoodies/without-zip/navy/angle.webp",
        image5: "/products/hoodies/without-zip/navy/fit.webp",
      },
      {
        ...c.grey,
        image: "/products/hoodies/without-zip/grey/main.webp",
        backImage: "/products/hoodies/without-zip/grey/back.webp",
        chestImage: "/products/hoodies/without-zip/grey/chest.webp",
        detailImage: "/products/hoodies/without-zip/grey/detail.webp",
        image4: "/products/hoodies/without-zip/grey/angle.webp",
        image5: "/products/hoodies/without-zip/grey/fit.webp",
      },
      {
        ...c.black,
        image: "/products/hoodies/without-zip/black/main.webp",
        backImage: "/products/hoodies/without-zip/black/back.webp",
        chestImage: "/products/hoodies/without-zip/black/chest.webp",
        detailImage: "/products/hoodies/without-zip/black/detail.webp",
        image4: "/products/hoodies/without-zip/black/angle.webp",
        image5: "/products/hoodies/without-zip/black/fit.webp",
      },
    ],
    sizes: ADULT,
    qtyDiscounts: QTY,
    features: [
      "360-370 GSM maximum density thermal winter warmth",
      "80/20 Cotton-poly composition prevents shrinkage",
      "Double-layered extra deep hood with metal tipping",
    ],
    bestSeller: true,
  },

  // ==========================================
  // WOMEN'S CATEGORIES
  // ==========================================

  // 11. Women's Round Neck Half Sleeve - 180 GSM (100% Cotton)
  {
    id: "p-womens-rn-half-180",
    name: "Women's Round Neck Half Sleeve T-Shirt (180 GSM) | 100% Compact Cotton Single Jersey",
    slug: "womens-rn-half-180",
    collections: ["womens-rn-half-180", "women"],
    description: "Tailored women's round neck tee in 180 GSM 100% compact cotton single jersey. Slim sleeves and gentle waist contouring.",
    fit: "Flattering feminine cut.",
    fabric: "100% Compact Cotton Single Jersey",
    gsm: 180,
    mrp: 499,
    price: 289,
    colors: [
      {
        name: "Black",
        hex: "#1A1A1A",
        image: "/products/womens-rn-black-front.webp",
        backImage: "/products/womens-rn-black-back.webp",
        chestImage: "/products/womens-rn-black-pose.webp",
        detailImage: "/products/womens-rn-black-folded.webp",
        image4: "/products/womens-rn-black-action.webp",
      },
      { ...c.white, image: "/products/crew-white.svg" },
      { ...c.maroon, image: "/products/crew-maroon.svg" },
    ],
    sizes: ADULT,
    qtyDiscounts: QTY,
    features: [
      "Cut specifically on a women's pattern block",
      "Ultra-soft ring-spun cotton hand-feel",
      "Durable print surface",
    ],
    bestSeller: true,
  },

  // ==========================================
  // KIDS' CATEGORIES
  // ==========================================

  // 12. Kids Round Neck Half Sleeve - 180 GSM (100% Cotton)
  {
    id: "p-kids-rn-half-180",
    name: "Kids Round Neck Half Sleeve T-Shirt (180 GSM) | 100% Compact Cotton Single Jersey",
    slug: "kids-rn-half-180",
    collections: ["kids-rn-half-180", "kids"],
    description: "Soft, skin-safe 180 GSM 100% compact cotton single jersey kids tee. Tested for playground durability and vibrant color retention.",
    fit: "Comfortable kids regular fit.",
    fabric: "100% Compact Cotton Single Jersey",
    gsm: 180,
    mrp: 349,
    price: 199,
    colors: [
      {
        name: "White",
        hex: "#F1F2F4",
        image: "/products/kids-rn-white-front.webp",
        backImage: "/products/kids-rn-white-back.webp",
        chestImage: "/products/kids-rn-white-pose.webp",
        detailImage: "/products/kids-rn-white-detail.webp",
        image4: "/products/kids-rn-white-action.webp",
      },
      { ...c.mustard, image: "/products/tee-yellow.svg" },
      { ...c.grey, image: "/products/tee-grey.svg" },
    ],
    sizes: KIDS,
    qtyDiscounts: QTY,
    features: [
      "Azo-free skin-safe dyes",
      "Reinforced double-stitched seams",
      "Machine-wash proof vibrant colors",
    ],
  },

];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug || p.id === slug);
}

export function getProductsByCollection(slug: string): Product[] {
  const matches = products.filter((p) => p.collections.includes(slug) || p.slug === slug);
  if (matches.length > 0) return matches;

  const s = slug.toLowerCase();
  if (s.includes("best-sellers") || s.includes("bestseller")) {
    return products.filter((p) => p.bestSeller);
  }
  if (s.includes("new-arrival") || s.includes("new")) {
    return products.filter((p) => p.isNew);
  }
  if (s.includes("unisex")) {
    return products.filter((p) => p.slug.includes("unisex"));
  }
  if (s.includes("hoodie") || s.includes("zip")) {
    return products.filter((p) => p.slug.includes("hoodie"));
  }
  if (s.includes("polo")) {
    return products.filter((p) => p.slug.includes("polo"));
  }
  if (s.includes("oversize")) {
    return products.filter((p) => p.slug.includes("oversize"));
  }
  if (s.includes("women")) {
    return products.filter((p) => p.slug.includes("womens"));
  }
  if (s.includes("kids")) {
    return products.filter((p) => p.slug.includes("kids"));
  }

  return products.filter((p) => p.slug.includes("rn-half"));
}

export function offPct(p: Product): number {
  return Math.round((1 - p.price / p.mrp) * 100);
}
