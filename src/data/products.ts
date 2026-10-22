import type { Product } from "../lib/types";

const ADULT = ["S", "M", "L", "XL", "XXL"];
const KIDS = ["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-11Y", "12-13Y"];

const QTY = [
  { minQty: 1, offPct: 0 },
  { minQty: 25, offPct: 10 },
  { minQty: 50, offPct: 18 },
  { minQty: 100, offPct: 25 },
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
    name: "Aerosoft Polo T-Shirt (200 GSM) | Custom Logo Printed Quick-Dry Performance Corporate Polo",
    slug: "aerosoft-polo-200",
    collections: ["aerosoft-polo-200", "men"],
    description: "Engineered 200 GSM Aerosoft knit polo t-shirt. Ultra-soft breathable texture with moisture-wicking technology and anti-wrinkle performance, ideal for corporate uniforms, staff apparel, and daily workwear.",
    fit: "Modern regular polo fit with tailored comfort.",
    fabric: "200 GSM Aerosoft Poly-Rich Performance Knit",
    gsm: 200,
    mrp: 649,
    price: 369,
    colors: [
      { ...c.royal, image: "/products/polo-navy.svg" },
      { ...c.black, image: "/products/polo-black.svg" },
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

  // 2. Mens Polo Half Sleeve - 240 GSM
  {
    id: "p-mens-polo-half-sleeve-240",
    name: "Men's Polo Half Sleeve T-Shirt (240 GSM) | 100% Combed Cotton Heavy Pique Embroidered Corporate Uniform Polo",
    slug: "mens-polo-half-sleeve-240",
    collections: ["mens-polo-half-sleeve-240", "men"],
    description: "Executive 240 GSM heavyweight combed cotton pique polo t-shirt. Features superior stitch density, anti-curl ribbed collar, and smooth hand-feel tailored for corporate teams and luxury brand merchandise.",
    fit: "Classic executive regular polo fit.",
    fabric: "100% Combed Cotton Heavy Pique",
    gsm: 240,
    mrp: 799,
    price: 469,
    colors: [
      { ...c.navy, image: "/products/polo-navy.svg" },
      { ...c.white, image: "/products/polo-white.svg" },
      { ...c.black, image: "/products/polo-black.svg" },
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
    name: "Ecoblend Polo Neck T-Shirt (240 GSM) | Heavy-Duty Anti-Fade Polycotton Industrial Workwear Polo",
    slug: "ecoblend-polo-neck-240",
    collections: ["ecoblend-polo-neck-240", "men"],
    description: "Rugged 240 GSM polycotton Ecoblend polo shirt. Combines the natural softness of cotton with the heavy-duty durability and color retention of polyester, built to withstand 100+ commercial wash cycles.",
    fit: "Structured corporate uniform fit.",
    fabric: "240 GSM Polycotton Ecoblend Fabric",
    gsm: 240,
    mrp: 699,
    price: 399,
    colors: [
      { ...c.navy, image: "/products/polo-navy.svg" },
      { ...c.black, image: "/products/polo-black.svg" },
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
    name: "Men's Round Neck Half Sleeve T-Shirt 200 GSM (Lycra) | 4-Way Stretch Elastic Cotton Athletic Sports T-Shirt",
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

  // 6. Mens Oversize Half Sleeve - 240 - 250 GSM (French Terry)
  {
    id: "p-mens-oversize-french-terry-240",
    name: "Men's Oversize Half Sleeve T-Shirt (240-250 GSM French Terry) | Heavyweight Drop-Shoulder Boxy Streetwear T-Shirt",
    slug: "mens-oversize-french-terry-240",
    collections: ["mens-oversize-french-terry-240", "men"],
    description: "Urban luxury 240-250 GSM French Terry cotton oversized half sleeve t-shirt. Styled with dropped shoulders, structured boxy silhouette, and loopback cotton interior for authentic modern streetwear merch.",
    fit: "Boxy oversized streetwear fit with drop shoulders.",
    fabric: "100% Combed Cotton French Terry (240-250 GSM)",
    gsm: 245,
    mrp: 849,
    price: 499,
    colors: [
      { ...c.black, image: "/products/crew-black.svg" },
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
    name: "Hoodies with Zip (320 GSM) | Custom Full-Zip Cotton Rich Brushed Fleece Heavyweight Winter Hoodie",
    slug: "hoodie-with-zip-320",
    collections: ["hoodie-with-zip-320", "hoodies"],
    description: "Comfortable 320 GSM cotton-rich brushed fleece full-zip hoodie. Equipped with an antique-finish metal zipper, split kangaroo front pockets, and double-layered warm hood for winter corporate gifting and team gear.",
    fit: "Classic full-zip layering fit.",
    fabric: "320 GSM Cotton Rich Brushed Fleece",
    gsm: 320,
    mrp: 1299,
    price: 749,
    colors: [
      {
        ...c.navy,
        image: "/products/hoodies/with-zip/navy/main.jpg",
        backImage: "/products/hoodies/with-zip/navy/back.jpg",
        chestImage: "/products/hoodies/with-zip/navy/chest.jpg",
        detailImage: "/products/hoodies/with-zip/navy/detail.jpg",
        image4: "/products/hoodies/with-zip/navy/angle.jpg",
        image5: "/products/hoodies/with-zip/navy/fit.jpg",
      },
      {
        ...c.grey,
        image: "/products/hoodies/with-zip/grey/main.jpg",
        backImage: "/products/hoodies/with-zip/grey/back.jpg",
        chestImage: "/products/hoodies/with-zip/grey/chest.jpg",
        detailImage: "/products/hoodies/with-zip/grey/detail.jpg",
        image4: "/products/hoodies/with-zip/grey/angle.jpg",
        image5: "/products/hoodies/with-zip/grey/fit.jpg",
      },
      {
        ...c.black,
        image: "/products/hoodies/with-zip/black/main.jpg",
        backImage: "/products/hoodies/with-zip/black/back.jpg",
        chestImage: "/products/hoodies/with-zip/black/chest.jpg",
        detailImage: "/products/hoodies/with-zip/black/detail.jpg",
        image4: "/products/hoodies/with-zip/black/angle.jpg",
        image5: "/products/hoodies/with-zip/black/fit.jpg",
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
    name: "Hoodies without Zip (320 GSM) | Custom Pullover Kangaroo Pocket Cotton Rich Fleece Winter Hoodie",
    slug: "hoodie-without-zip-320",
    collections: ["hoodie-without-zip-320", "hoodies"],
    description: "Classic 320 GSM pullover hoodie constructed in heavy cotton-rich fleece. Designed with spacious front kangaroo pocket, double-layer drawstring hood, and stretch-ribbed cuffs and waistband.",
    fit: "Comfortable relaxed pullover hoodie fit.",
    fabric: "320 GSM Cotton Rich Brushed Fleece",
    gsm: 320,
    mrp: 1199,
    price: 699,
    colors: [
      {
        ...c.navy,
        image: "/products/hoodies/without-zip/navy/main.jpg",
        backImage: "/products/hoodies/without-zip/navy/back.jpg",
        chestImage: "/products/hoodies/without-zip/navy/chest.jpg",
        detailImage: "/products/hoodies/without-zip/navy/detail.jpg",
        image4: "/products/hoodies/without-zip/navy/angle.jpg",
        image5: "/products/hoodies/without-zip/navy/fit.jpg",
      },
      {
        ...c.grey,
        image: "/products/hoodies/without-zip/grey/main.jpg",
        backImage: "/products/hoodies/without-zip/grey/back.jpg",
        chestImage: "/products/hoodies/without-zip/grey/chest.jpg",
        detailImage: "/products/hoodies/without-zip/grey/detail.jpg",
        image4: "/products/hoodies/without-zip/grey/angle.jpg",
        image5: "/products/hoodies/without-zip/grey/fit.jpg",
      },
      {
        ...c.black,
        image: "/products/hoodies/without-zip/black/main.jpg",
        backImage: "/products/hoodies/without-zip/black/back.jpg",
        chestImage: "/products/hoodies/without-zip/black/chest.jpg",
        detailImage: "/products/hoodies/without-zip/black/detail.jpg",
        image4: "/products/hoodies/without-zip/black/angle.jpg",
        image5: "/products/hoodies/without-zip/black/fit.jpg",
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
    name: "Unisex Hoodies (325 GSM) | 100% Pure Cotton Brushed Fleece Premium All-Season Sweatshirt Hoodie",
    slug: "unisex-hoodie-325",
    collections: ["unisex-hoodie-325", "hoodies"],
    description: "Plush 325 GSM 100% cotton brushed fleece unisex hoodie. Versatile contemporary styling suited for both men and women, featuring clean flatlock stitching and vibrant printing/embroidery surfaces.",
    fit: "Universal unisex comfort fit.",
    fabric: "100% Cotton Brushed Fleece (325 GSM)",
    gsm: 325,
    mrp: 1399,
    price: 799,
    colors: [
      {
        ...c.navy,
        image: "/products/hoodies/with-zip/navy/main.jpg",
        backImage: "/products/hoodies/with-zip/navy/back.jpg",
        chestImage: "/products/hoodies/with-zip/navy/chest.jpg",
        detailImage: "/products/hoodies/with-zip/navy/detail.jpg",
        image4: "/products/hoodies/with-zip/navy/angle.jpg",
        image5: "/products/hoodies/with-zip/navy/fit.jpg",
      },
      {
        ...c.grey,
        image: "/products/hoodies/with-zip/grey/main.jpg",
        backImage: "/products/hoodies/with-zip/grey/back.jpg",
        chestImage: "/products/hoodies/with-zip/grey/chest.jpg",
        detailImage: "/products/hoodies/with-zip/grey/detail.jpg",
        image4: "/products/hoodies/with-zip/grey/angle.jpg",
        image5: "/products/hoodies/with-zip/grey/fit.jpg",
      },
      {
        ...c.black,
        image: "/products/hoodies/with-zip/black/main.jpg",
        backImage: "/products/hoodies/with-zip/black/back.jpg",
        chestImage: "/products/hoodies/with-zip/black/chest.jpg",
        detailImage: "/products/hoodies/with-zip/black/detail.jpg",
        image4: "/products/hoodies/with-zip/black/angle.jpg",
        image5: "/products/hoodies/with-zip/black/fit.jpg",
      },
    ],
    sizes: ADULT,
    qtyDiscounts: QTY,
    features: [
      "100% Cotton 325 GSM ultra-soft brushed fleece",
      "Neutral unisex proportions for universal flattering fit",
      "Superior surface for high-definition DTF and embroidery",
    ],
    isNew: true,
  },

  // 10. Unisex Hoodies - (360 - 370 GSM)
  {
    id: "p-unisex-hoodie-360",
    name: "Unisex Hoodies (360-370 GSM) | Ultra-Heavyweight Thermal Cold-Proof Cotton-Poly Winter Fleece Hoodie",
    slug: "unisex-hoodie-360",
    collections: ["unisex-hoodie-360", "hoodies"],
    description: "Ultra-heavy 360-370 GSM cotton-poly thermal fleece unisex hoodie. Built for extreme winter cold, high durability, and luxury heavyweight hand-feel with shape retention that never sags.",
    fit: "Heavy structured unisex thermal fit.",
    fabric: "80% Cotton & 20% Polyester Heavy Thermal Fleece",
    gsm: 365,
    mrp: 1599,
    price: 899,
    colors: [
      {
        ...c.navy,
        image: "/products/hoodies/without-zip/navy/main.jpg",
        backImage: "/products/hoodies/without-zip/navy/back.jpg",
        chestImage: "/products/hoodies/without-zip/navy/chest.jpg",
        detailImage: "/products/hoodies/without-zip/navy/detail.jpg",
        image4: "/products/hoodies/without-zip/navy/angle.jpg",
        image5: "/products/hoodies/without-zip/navy/fit.jpg",
      },
      {
        ...c.grey,
        image: "/products/hoodies/without-zip/grey/main.jpg",
        backImage: "/products/hoodies/without-zip/grey/back.jpg",
        chestImage: "/products/hoodies/without-zip/grey/chest.jpg",
        detailImage: "/products/hoodies/without-zip/grey/detail.jpg",
        image4: "/products/hoodies/without-zip/grey/angle.jpg",
        image5: "/products/hoodies/without-zip/grey/fit.jpg",
      },
      {
        ...c.black,
        image: "/products/hoodies/without-zip/black/main.jpg",
        backImage: "/products/hoodies/without-zip/black/back.jpg",
        chestImage: "/products/hoodies/without-zip/black/chest.jpg",
        detailImage: "/products/hoodies/without-zip/black/detail.jpg",
        image4: "/products/hoodies/without-zip/black/angle.jpg",
        image5: "/products/hoodies/without-zip/black/fit.jpg",
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
    name: "Women's Round Neck Half Sleeve T-Shirt (180 GSM) | 100% Bio-Washed Ring-Spun Cotton Tailored Fit T-Shirt",
    slug: "womens-rn-half-180",
    collections: ["womens-rn-half-180", "women"],
    description: "Tailored women's round neck tee in 180 GSM pure bio-washed cotton. Slim sleeves and gentle waist contouring.",
    fit: "Flattering feminine cut.",
    fabric: "100% Bio-Washed Ring-Spun Cotton",
    gsm: 180,
    mrp: 499,
    price: 289,
    colors: [
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
    name: "Kids Round Neck Half Sleeve T-Shirt (180 GSM) | Skin-Safe Super-Combed Cotton School & Sports Event T-Shirt",
    slug: "kids-rn-half-180",
    collections: ["kids-rn-half-180", "kids"],
    description: "Soft, skin-safe 180 GSM cotton kids tee. Tested for playground durability and vibrant color retention.",
    fit: "Comfortable kids regular fit.",
    fabric: "100% Super-Combed Cotton",
    gsm: 180,
    mrp: 349,
    price: 199,
    colors: [
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

  // ==========================================
  // SPECIALTY & FABRICS CATEGORIES
  // ==========================================

  // 13. Ecoblend Round Neck T-Shirts - 180 GSM (Polycotton Fabric)
  {
    id: "p-ecoblend-rn-180",
    name: "Ecoblend Round Neck T-Shirt (180 GSM) | Durable Eco Polycotton Industrial Workwear Uniform T-Shirt",
    slug: "ecoblend-rn-180",
    collections: ["ecoblend-rn-180", "specialty"],
    description: "Durable 180 GSM polycotton blend round neck tee. Fast drying, stain-resistant, perfect for high-usage uniforms.",
    fit: "Regular uniform fit.",
    fabric: "Eco-Friendly Polycotton Fabric",
    gsm: 180,
    mrp: 399,
    price: 229,
    colors: [
      { ...c.grey, image: "/products/crew-white.svg" },
      { ...c.black, image: "/products/crew-black.svg" },
    ],
    sizes: ADULT,
    qtyDiscounts: QTY,
    features: [
      "Polycotton blend for extreme wash durability",
      "Wrinkle-free quick drying feature",
      "High color-fastness",
    ],
  },

  // 14. Biowash Round Neck T-Shirts - 180 GSM (100% Cotton)
  {
    id: "p-biowash-rn-180",
    name: "Biowash Round Neck T-Shirt (180 GSM) | 100% Bio-Enzyme Washed Lint-Free DTF & Screen Printing T-Shirt",
    slug: "biowash-rn-180",
    collections: ["biowash-rn-180", "specialty"],
    description: "Bio-enzyme washed 180 GSM pure cotton tee for silky smooth touch and lint-free print surface.",
    fit: "Classic smooth fit.",
    fabric: "100% Bio-Washed Cotton",
    gsm: 180,
    mrp: 499,
    price: 289,
    colors: [
      { ...c.white, image: "/products/crew-white.svg" },
      { ...c.royal, image: "/products/crew-royal.svg" },
    ],
    sizes: ADULT,
    qtyDiscounts: QTY,
    features: [
      "Special enzyme biowash finish — zero pilling",
      "Ultra-soft touch against skin",
      "Optimal canvas for screen & DTF printing",
    ],
  },

  // 15. Primoknit Polo T-Shirt - 200 GSM (Dotknit Fabrics)
  {
    id: "p-primoknit-polo-200",
    name: "Primoknit Dotknit Polo T-Shirt (200 GSM) | Breathable Moisture-Wicking Sports Athletic Team Polo",
    slug: "primoknit-polo-200",
    collections: ["primoknit-polo-200", "specialty"],
    description: "Engineered 200 GSM Primoknit Dotknit polo. Breathable micro-dots for sports performance and team wear.",
    fit: "Athletic team fit.",
    fabric: "Dotknit Performance Fabric",
    gsm: 200,
    mrp: 649,
    price: 369,
    colors: [
      { ...c.royal, image: "/products/polo-navy.svg" },
      { ...c.white, image: "/products/polo-white.svg" },
    ],
    sizes: ADULT,
    qtyDiscounts: QTY,
    features: [
      "Dotknit breathability matrix for active airflow",
      "Quick evaporation sweat control",
      "Lightweight strength",
    ],
  },

  // 16. Ecoblend Polo Neck T-Shirts - 240 GSM (Polycotton Ecoblend Fabric)
  {
    id: "p-ecoblend-polo-240",
    name: "Ecoblend Heavy Polo Neck T-Shirt (240 GSM) | Anti-Shrink Polycotton Industrial Staff Uniform Polo",
    slug: "ecoblend-polo-240",
    collections: ["ecoblend-polo-240", "specialty"],
    description: "Heavy-duty 240 GSM polycotton Ecoblend polo shirt. Maintains crisp collar and vibrant color through hundreds of industrial washes.",
    fit: "Heavy regular polo fit.",
    fabric: "Polycotton Ecoblend Fabric",
    gsm: 240,
    mrp: 699,
    price: 399,
    colors: [
      { ...c.navy, image: "/products/polo-navy.svg" },
      { ...c.black, image: "/products/polo-black.svg" },
    ],
    sizes: ADULT,
    qtyDiscounts: QTY,
    features: [
      "Industrial wash resistant fabric blend",
      "Anti-shrink anti-fade technology",
      "Reinforced collar structure",
    ],
  },

  // 17. Aeropiq Polo T-Shirts - 210 GSM (Nano Poly Fabric)
  {
    id: "p-aeropiq-polo-210",
    name: "Aeropiq Nano-Poly Polo T-Shirt (210 GSM) | Stain & Odor Resistant High-Tech Corporate Workwear Polo",
    slug: "aeropiq-polo-210",
    collections: ["aeropiq-polo-210", "specialty"],
    description: "Advanced 210 GSM Nano Poly Aeropiq polo. Ultra lightweight tech knit with active odor resistance.",
    fit: "Modern tech fit.",
    fabric: "Nano Poly Tech Fabric",
    gsm: 210,
    mrp: 699,
    price: 399,
    colors: [
      { ...c.black, image: "/products/polo-black.svg" },
      { ...c.white, image: "/products/polo-white.svg" },
    ],
    sizes: ADULT,
    qtyDiscounts: QTY,
    features: [
      "Nano Poly woven tech — water & stain repellant",
      "Odor control treatment",
      "Silk-smooth inner texture",
    ],
  },

  // 18. Organic Polo T-Shirts - 270 GSM (100% Premium Cotton)
  {
    id: "p-organic-polo-270",
    name: "Organic Cotton Polo T-Shirt (270 GSM) | GOTS Certified 100% Organic Luxury Heavyweight Eco-Friendly Polo",
    slug: "organic-polo-270",
    collections: ["organic-polo-270", "specialty"],
    description: "Luxurious 270 GSM certified organic 100% premium cotton polo. Ultra heavy weight with eco-luxury touch.",
    fit: "Tailored luxury polo fit.",
    fabric: "100% Certified Organic Premium Cotton",
    gsm: 270,
    mrp: 999,
    price: 599,
    colors: [
      { ...c.white, image: "/products/polo-white.svg" },
      { ...c.navy, image: "/products/polo-navy.svg" },
    ],
    sizes: ADULT,
    qtyDiscounts: QTY,
    features: [
      "GOTS Certified 100% Organic Cotton",
      "270 GSM ultra heavyweight luxury pique",
      "Hypoallergenic & eco-friendly dyes",
    ],
    bestSeller: true,
  },

  // 19. Organic Polo Plain T-Shirts - 270 GSM (100% Premium Cotton)
  {
    id: "p-organic-polo-plain-270",
    name: "Organic Cotton Plain Polo T-Shirt (270 GSM) | Minimalist Executive Premium Organic Apparel",
    slug: "organic-polo-plain-270",
    collections: ["organic-polo-plain-270", "specialty"],
    description: "Clean minimalist 270 GSM organic plain cotton polo. Premium feel for luxury retail and corporate gifting.",
    fit: "Minimalist luxury fit.",
    fabric: "100% Certified Organic Premium Cotton",
    gsm: 270,
    mrp: 999,
    price: 599,
    colors: [
      { ...c.white, image: "/products/polo-white.svg" },
      { ...c.black, image: "/products/polo-black.svg" },
    ],
    sizes: ADULT,
    qtyDiscounts: QTY,
    features: [
      "Pure organic minimalist design",
      "Dense 270 GSM cotton weight",
      "Premium wooden touch buttons",
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
