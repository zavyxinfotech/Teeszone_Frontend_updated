import type { Product } from "@/lib/types";

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
  // 1. Men's Round Neck Half Sleeve - 180 GSM (100% Cotton)
  {
    id: "p-mens-rn-half-180",
    name: "Men's Round Neck Half Sleeve - 180 GSM (100% Cotton)",
    slug: "mens-rn-half-180",
    collections: ["mens-rn-half-180", "men"],
    description: "Everyday 180 GSM bio-washed 100% cotton round neck tee. Soft, breathable, pre-shrunk, ideal for daily wear and custom printing.",
    fit: "Classic regular fit with smooth drape.",
    fabric: "100% Bio-Washed Cotton",
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
      "100% Bio-washed cotton for supreme softness",
      "Pre-shrunk fabric to prevent shrinkage after wash",
      "Reinforced double-needle stitching on hem and sleeves",
    ],
    bestSeller: true,
  },

  // 2. Men's Round Neck Half Sleeve - 200 GSM (100% Cotton)
  {
    id: "p-mens-rn-half-200-cotton",
    name: "Men's Round Neck Half Sleeve - 200 GSM (100% Cotton)",
    slug: "mens-rn-half-200-cotton",
    collections: ["mens-rn-half-200-cotton", "men"],
    description: "Heavyweight 200 GSM 100% combed cotton tee. Extra durable, structured silhouette with premium comfort.",
    fit: "Relaxed heavy-fit with structured shoulder line.",
    fabric: "100% Combed Heavyweight Cotton",
    gsm: 200,
    mrp: 649,
    price: 379,
    colors: [
      { ...c.black, image: "/products/crew-black.svg" },
      { ...c.white, image: "/products/crew-white.svg" },
    ],
    sizes: ADULT,
    qtyDiscounts: QTY,
    features: [
      "Heavyweight 200 GSM knit for structured drape",
      "100% Combed cotton — pill-resistant finish",
      "Ideal for premium streetwear and custom embroidery",
    ],
    isNew: true,
  },

  // 3. Men's Round Neck Half Sleeve - 200 GSM (95% Cotton & 5% Spandex)
  {
    id: "p-mens-rn-half-200-spandex",
    name: "Men's Round Neck Half Sleeve - 200 GSM (95% Cotton & 5% Spandex)",
    slug: "mens-rn-half-200-spandex",
    collections: ["mens-rn-half-200-spandex", "men"],
    description: "Stretchable 200 GSM cotton-spandex blend for athletic flexibility, retention, and maximum body contouring.",
    fit: "Flexible stretch fit.",
    fabric: "95% Cotton & 5% Spandex Elastic Blend",
    gsm: 200,
    mrp: 699,
    price: 399,
    colors: [
      { ...c.black, image: "/products/crew-black.svg" },
      { ...c.royal, image: "/products/crew-royal.svg" },
    ],
    sizes: ADULT,
    qtyDiscounts: QTY,
    features: [
      "4-Way stretch technology for shape retention",
      "Sweat-wicking breathability with cotton softness",
      "Reinforced stretch collar line",
    ],
  },

  // 4. Men's Round Neck Full Sleeve - 180 GSM (100% Cotton)
  {
    id: "p-mens-rn-full-180",
    name: "Men's Round Neck Full Sleeve - 180 GSM (100% Cotton)",
    slug: "mens-rn-full-180",
    collections: ["mens-rn-full-180", "men"],
    description: "Full sleeve round neck tee crafted in 180 GSM bio-washed cotton. Ribbed cuffs for a snug fit during cooler seasons.",
    fit: "Regular fit with fitted ribbed cuffs.",
    fabric: "100% Bio-Washed Cotton",
    gsm: 180,
    mrp: 599,
    price: 349,
    colors: [
      { ...c.white, image: "/products/longsleeve-white.svg" },
      { ...c.maroon, image: "/products/longsleeve-maroon.svg" },
    ],
    sizes: ADULT,
    qtyDiscounts: QTY,
    features: [
      "Full sleeve coverage with soft stretch cuffs",
      "Pre-shrunk 100% cotton fabric",
      "Layer-friendly weight for all-year comfort",
    ],
  },

  // 5. Women's Round Neck Half Sleeve - 180 GSM (100% Cotton)
  {
    id: "p-womens-rn-half-180",
    name: "Women's Round Neck Half Sleeve - 180 GSM (100% Cotton)",
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

  // 6. Kids Round Neck Half Sleeve - 180 GSM (100% Cotton)
  {
    id: "p-kids-rn-half-180",
    name: "Kids Round Neck Half Sleeve - 180 GSM (100% Cotton)",
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

  // 7. Men's Oversize Half Sleeve - 200 GSM (100% Cotton)
  {
    id: "p-mens-oversize-200",
    name: "Men's Oversize Half Sleeve - 200 GSM (100% Cotton)",
    slug: "mens-oversize-200",
    collections: ["mens-oversize-200", "men"],
    description: "Trendy 200 GSM boxy oversized tee with dropped shoulders for modern streetwear style.",
    fit: "Oversized boxy fit with drop shoulders.",
    fabric: "100% Heavyweight Cotton",
    gsm: 200,
    mrp: 699,
    price: 419,
    colors: [
      { ...c.black, image: "/products/crew-black.svg" },
      { ...c.white, image: "/products/crew-white.svg" },
    ],
    sizes: ADULT,
    qtyDiscounts: QTY,
    features: [
      "Dropped shoulder seams for boxy streetwear fit",
      "Heavyweight 200 GSM knit",
      "Generous canvas for front and back graphics",
    ],
  },

  // 8. Men's Oversize Half Sleeve - 240 - 250 GSM (100% Cotton)
  {
    id: "p-mens-oversize-240",
    name: "Men's Oversize Half Sleeve - 240-250 GSM (100% Cotton)",
    slug: "mens-oversize-240",
    collections: ["mens-oversize-240", "men"],
    description: "Ultra heavyweight 240-250 GSM 100% cotton boxy tee. Thick, structured, and luxurious drape.",
    fit: "Heavy oversized boxy cut.",
    fabric: "100% Heavyweight Compact Cotton",
    gsm: 245,
    mrp: 849,
    price: 499,
    colors: [
      { ...c.black, image: "/products/crew-black.svg" },
      { ...c.charcoal, image: "/products/crew-black.svg" },
    ],
    sizes: ADULT,
    qtyDiscounts: QTY,
    features: [
      "240-250 GSM dense luxury knit",
      "Zero deformation collar design",
      "Top-tier streetwear silhouette",
    ],
    bestSeller: true,
  },

  // 9. Men's Polo Half Sleeve - 240 - 250 GSM (100% Cotton)
  {
    id: "p-mens-polo-240-cotton",
    name: "Men's Polo Half Sleeve - 240-250 GSM (100% Cotton)",
    slug: "mens-polo-240-cotton",
    collections: ["mens-polo-240-cotton", "men"],
    description: "Classic 240-250 GSM 100% combed cotton pique polo. Sharp collar retention, ideal for corporate uniforms.",
    fit: "Structured executive polo fit.",
    fabric: "100% Combed Cotton Pique",
    gsm: 245,
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
      "Anti-curl ribbed collar and cuffs",
      "Breathable 100% combed cotton pique",
      "Custom embroidery-ready chest surface",
    ],
    bestSeller: true,
  },

  // 10. Men's Polo Half Sleeve - 240 - 250 GSM (95% Cotton & 5% Spandex)
  {
    id: "p-mens-polo-240-spandex",
    name: "Men's Polo Half Sleeve - 240-250 GSM (95% Cotton & 5% Spandex)",
    slug: "mens-polo-240-spandex",
    collections: ["mens-polo-240-spandex", "men"],
    description: "Premium 240-250 GSM cotton-spandex stretch polo for flexible active workwear and executive style.",
    fit: "Tailored stretch polo fit.",
    fabric: "95% Cotton & 5% Spandex Stretch Pique",
    gsm: 245,
    mrp: 899,
    price: 529,
    colors: [
      { ...c.navy, image: "/products/polo-navy.svg" },
      { ...c.black, image: "/products/polo-black.svg" },
    ],
    sizes: ADULT,
    qtyDiscounts: QTY,
    features: [
      "Flexible stretch comfort with executive look",
      "Durable shape retention after 50+ washes",
      "Reinforced placket and buttons",
    ],
  },

  // 11. Men's Polo Half Sleeve Mars - 200 GSM (100% Micro Polyester)
  {
    id: "p-mens-polo-mars-200",
    name: "Men's Polo Half Sleeve Mars - 200 GSM (100% Micro Polyester)",
    slug: "mens-polo-mars-200",
    collections: ["mens-polo-mars-200", "men"],
    description: "Activewear Mars performance polo in 200 GSM micro polyester. Quick-drying, anti-microbial, wrinkle-free.",
    fit: "Athletic activewear fit.",
    fabric: "100% Micro Polyester Quick-Dry",
    gsm: 200,
    mrp: 599,
    price: 349,
    colors: [
      { ...c.royal, image: "/products/polo-navy.svg" },
      { ...c.black, image: "/products/polo-black.svg" },
    ],
    sizes: ADULT,
    qtyDiscounts: QTY,
    features: [
      "Quick-dry moisture management tech",
      "Wrinkle-resistant and iron-free",
      "Sublimation printing friendly",
    ],
  },

  // 12. Unisex Hoodies with Zip - 325 GSM (100% Cotton)
  {
    id: "p-unisex-hoodie-zip-325",
    name: "Unisex Hoodies with Zip - 325 GSM (100% Cotton)",
    slug: "unisex-hoodie-zip-325",
    collections: ["unisex-hoodie-zip-325", "hoodies"],
    description: "Plush 325 GSM 100% cotton brushed fleece zipped hoodie with sturdy metal YKK zip and double hood.",
    fit: "Cozy unisex layering fit.",
    fabric: "100% Cotton Brushed Fleece",
    gsm: 325,
    mrp: 1399,
    price: 799,
    colors: [
      { ...c.charcoal, image: "/products/hoodie-charcoal.svg" },
      { ...c.navy, image: "/products/hoodie-navy.svg" },
    ],
    sizes: ADULT,
    qtyDiscounts: QTY,
    features: [
      "325 GSM plush brushed fleece interior",
      "Heavy-duty metal front zipper",
      "Split kangaroo pouch pockets",
    ],
  },

  // 13. Unisex Hoodies with Zip - 360 - 370 GSM (80% Cotton & 20% Polyester)
  {
    id: "p-unisex-hoodie-zip-360",
    name: "Unisex Hoodies with Zip - 360-370 GSM (80% Cotton & 20% Polyester)",
    slug: "unisex-hoodie-zip-360",
    collections: ["unisex-hoodie-zip-360", "hoodies"],
    description: "Ultra-heavy 360-370 GSM cotton-poly blend zipped hoodie for extreme winter warmth and shape retention.",
    fit: "Heavy structured winter fit.",
    fabric: "80% Cotton & 20% Polyester Heavy Fleece",
    gsm: 365,
    mrp: 1599,
    price: 899,
    colors: [
      { ...c.charcoal, image: "/products/hoodie-charcoal.svg" },
      { ...c.pink, image: "/products/hoodie-pink.svg" },
    ],
    sizes: ADULT,
    qtyDiscounts: QTY,
    features: [
      "360-370 GSM ultra heavyweight thermal warmth",
      "Shrink-resistant cotton-poly blend",
      "Double-layered hood with metal drawcord tips",
    ],
    isNew: true,
  },

  // 14. Ecoblend Round Neck T-Shirts - 180 GSM (Polycotton Fabric)
  {
    id: "p-ecoblend-rn-180",
    name: "Ecoblend Round Neck T-Shirts - 180 GSM (Polycotton Fabric)",
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

  // 15. Biowash Round Neck T-Shirts - 180 GSM (100% Cotton)
  {
    id: "p-biowash-rn-180",
    name: "Biowash Round Neck T-Shirts - 180 GSM (100% Cotton)",
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

  // 16. Primoknit Polo T-Shirt - 200 GSM (Dotknit Fabrics)
  {
    id: "p-primoknit-polo-200",
    name: "Primoknit Polo T-Shirt - 200 GSM (Dotknit Fabrics)",
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

  // 17. Ecoblend Polo Neck T-Shirts - 240 GSM (Polycotton Ecoblend Fabric)
  {
    id: "p-ecoblend-polo-240",
    name: "Ecoblend Polo Neck T-Shirts - 240 GSM (Polycotton Ecoblend Fabric)",
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

  // 18. Aeropiq Polo T-Shirts - 210 GSM (Nano Poly Fabric)
  {
    id: "p-aeropiq-polo-210",
    name: "Aeropiq Polo T-Shirts - 210 GSM (Nano Poly Fabric)",
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

  // 19. Organic Polo T-Shirts - 270 GSM (100% Premium Cotton)
  {
    id: "p-organic-polo-270",
    name: "Organic Polo T-Shirts - 270 GSM (100% Premium Cotton)",
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

  // 20. Organic Polo Plain T-Shirts - 270 GSM (100% Premium Cotton)
  {
    id: "p-organic-polo-plain-270",
    name: "Organic Polo Plain T-Shirts - 270 GSM (100% Premium Cotton)",
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

  // 21. Hoodies without Zip - 320 GSM (Cotton Rich Fabric)
  {
    id: "p-hoodie-without-zip-320",
    name: "Hoodies without Zip - 320 GSM (Cotton Rich Fabric)",
    slug: "hoodie-without-zip-320",
    collections: ["hoodie-without-zip-320", "hoodies"],
    description: "Classic pullover hoodie in 320 GSM cotton rich fleece. Kangaroo pouch pocket and double lined hood.",
    fit: "Relaxed pullover hoodie fit.",
    fabric: "320 GSM Cotton Rich Fleece",
    gsm: 320,
    mrp: 1199,
    price: 699,
    colors: [
      { ...c.charcoal, image: "/products/hoodie-charcoal.svg" },
      { ...c.navy, image: "/products/hoodie-navy.svg" },
    ],
    sizes: ADULT,
    qtyDiscounts: QTY,
    features: [
      "320 GSM fleece interior warmth",
      "Large front kangaroo pouch pocket",
      "Flat braided matching drawcords",
    ],
  },

  // 22. Hoodies with Zip - 320 GSM (Cotton Rich Fabric)
  {
    id: "p-hoodie-with-zip-320",
    name: "Hoodies with Zip - 320 GSM (Cotton Rich Fabric)",
    slug: "hoodie-with-zip-320",
    collections: ["hoodie-with-zip-320", "hoodies"],
    description: "Full-zip hoodie in 320 GSM cotton rich fleece with smooth metal zipper and split front pockets.",
    fit: "Comfortable full-zip hoodie fit.",
    fabric: "320 GSM Cotton Rich Fleece",
    gsm: 320,
    mrp: 1299,
    price: 749,
    colors: [
      { ...c.charcoal, image: "/products/hoodie-charcoal.svg" },
      { ...c.navy, image: "/products/hoodie-navy.svg" },
    ],
    sizes: ADULT,
    qtyDiscounts: QTY,
    features: [
      "Full zipper front for versatile layering",
      "320 GSM soft fleece weight",
      "Double stitched pocket stress points",
    ],
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCollection(slug: string): Product[] {
  const matches = products.filter((p) => p.collections.includes(slug) || p.slug === slug);
  if (matches.length > 0) return matches;

  const s = slug.toLowerCase();
  if (s.includes("hoodie") || s.includes("zip")) {
    return products.filter((p) => p.slug.includes("hoodie"));
  }
  if (s.includes("polo")) {
    return products.filter((p) => p.slug.includes("polo"));
  }
  if (s.includes("oversize")) {
    return products.filter((p) => p.slug.includes("oversize"));
  }
  if (s.includes("full")) {
    return products.filter((p) => p.slug.includes("full"));
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
