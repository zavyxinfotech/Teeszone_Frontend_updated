import type { Product } from "@/lib/types";

// TODO: images are placeholders, prices/discounts are dummy values

const ADULT = ["S", "M", "L", "XL", "XXL"];
const KIDS = ["2-3Y", "4-5Y", "6-7Y", "8-9Y", "10-11Y", "12-13Y"];
const INFANT = ["0-6M", "6-12M", "12-18M"];

// default quantity ladder
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
  softPink: { name: "Soft Pink", hex: "#F4A7C3" },
  lilac: { name: "Lilac", hex: "#C8A2C8" },
  mint: { name: "Mint", hex: "#98D7C2" },
  sky: { name: "Sky Blue", hex: "#BFD8F0" },
  red: { name: "Red", hex: "#C6283C" },
  green: { name: "Green", hex: "#1E7A4F" },
  tangerine: { name: "Tangerine", hex: "#E87A2E" },
};

export const products: Product[] = [
  // ---------- UNISEX TOPS ----------
  {
    id: "p-unisex-rn-180",
    name: "Classic 180 Cotton Unisex Round Neck Tee",
    slug: "classic-180-unisex-round-neck",
    collections: ["unisex-round-neck", "best-sellers"],
    description:
      "Our everyday workhorse tee in 180 GSM bio-washed cotton. A smooth, dense knit that takes screen print, DTF and embroidery cleanly — the default choice for corporate merch and events.",
    fit: "Classic unisex fit with a naturally soft hand-feel and easy drape.",
    fabric: "100% Bio-Washed Cotton",
    gsm: 180,
    mrp: 499,
    price: 289,
    colors: [
      { ...c.black, image: "/products/crew-black.svg" },
      { ...c.white, image: "/products/crew-white.svg" },
      { ...c.maroon, image: "/products/crew-maroon.svg" },
      { ...c.royal, image: "/products/crew-royal.svg" },
      { ...c.grey, image: "/products/tee-grey.svg" },
    ],
    sizes: ADULT,
    qtyDiscounts: QTY,
    features: [
      "Pre-shrunk, bio-washed fabric — no shrinkage",
      "Smooth surface for crisp prints",
      "15+ stock colors available on request",
    ],
    bestSeller: true,
  },
  {
    id: "p-unisex-rn-premium",
    name: "Premium 220 Combed Cotton Round Neck Tee",
    slug: "premium-220-combed-round-neck",
    collections: ["unisex-round-neck", "new-arrival"],
    description:
      "A heavier, softer round neck in combed compact cotton for brands that want their merch to feel premium out of the box.",
    fit: "Slightly relaxed fit with a structured shoulder line.",
    fabric: "100% Combed Compact Cotton",
    gsm: 220,
    mrp: 699,
    price: 405,
    colors: [
      { ...c.black, image: "/products/crew-black.svg" },
      { ...c.white, image: "/products/crew-white.svg" },
    ],
    sizes: ADULT,
    qtyDiscounts: QTY,
    features: [
      "Combed compact yarn — 2X softer than regular cotton",
      "Resists pilling, fading and wear",
      "Rich color retention wash after wash",
    ],
    isNew: true,
  },
  {
    id: "p-unisex-polo",
    name: "Executive Cotton Unisex Polo",
    slug: "executive-cotton-unisex-polo",
    collections: ["unisex-polo", "best-sellers"],
    description:
      "A pique-knit polo that keeps its collar sharp through industrial washing. The uniform staple for offices, retail floors and hospitality teams.",
    fit: "Structured, polished and comfortably relaxed.",
    fabric: "Combed Cotton Pique",
    gsm: 220,
    mrp: 799,
    price: 463,
    colors: [
      { ...c.navy, image: "/products/polo-navy.svg" },
      { ...c.white, image: "/products/polo-white.svg" },
      { ...c.black, image: "/products/polo-black.svg" },
    ],
    sizes: ADULT,
    qtyDiscounts: QTY,
    features: [
      "Ribbed collar and cuffs that hold their shape",
      "Distinctive pique texture for an elevated look",
      "Logo embroidery included in bulk pricing",
    ],
    bestSeller: true,
  },
  {
    id: "p-unisex-polo-titan",
    name: "Titan Heavy-Duty Unisex Polo",
    slug: "titan-heavy-duty-polo",
    collections: ["unisex-polo"],
    description:
      "Our heaviest polo, built for daily industrial wear — dense knit, reinforced seams and a collar that refuses to curl.",
    fit: "Roomy workwear fit with reinforced stress points.",
    fabric: "Heavy Cotton Pique",
    gsm: 260,
    mrp: 999,
    price: 579,
    colors: [
      { ...c.black, image: "/products/polo-black.svg" },
      { ...c.navy, image: "/products/polo-navy.svg" },
    ],
    sizes: ADULT,
    qtyDiscounts: QTY,
    features: [
      "260 GSM heavy pique — built to last",
      "Double-stitched shoulder and side seams",
      "Ideal for factory and field uniforms",
    ],
  },

  // ---------- UNISEX ACTIVE WEAR ----------
  {
    id: "p-active-rn",
    name: "Breezo Quick-Dry Active Round Neck",
    slug: "breezo-active-round-neck",
    collections: ["active-round-neck", "mega-sale"],
    description:
      "A featherlight dot-knit polyester tee that wicks sweat and dries in minutes. Made for marathons, sports days and field teams.",
    fit: "Athletic silhouette for unrestricted movement.",
    fabric: "Dot-Knit Micro Polyester",
    gsm: 140,
    mrp: 449,
    price: 231,
    colors: [
      { ...c.royal, image: "/products/crew-royal.svg" },
      { ...c.red, image: "/products/jersey-red.svg" },
      { ...c.black, image: "/products/crew-black.svg" },
    ],
    sizes: ADULT,
    qtyDiscounts: QTY,
    features: [
      "Moisture-wicking and fast-drying",
      "Lightweight with subtle texture",
      "Sublimation-friendly for full-color designs",
    ],
    megaSale: true,
  },
  {
    id: "p-active-polo",
    name: "Evercool Active Polo",
    slug: "evercool-active-polo",
    collections: ["active-polo"],
    description:
      "A breathable performance polo that pairs the smartness of a collar with sportswear comfort — great for golf days and outdoor staff.",
    fit: "Trim athletic fit with stretch.",
    fabric: "Poly-Spandex Sports Knit",
    gsm: 160,
    mrp: 699,
    price: 405,
    colors: [
      { ...c.navy, image: "/products/polo-navy.svg" },
      { ...c.white, image: "/products/polo-white.svg" },
    ],
    sizes: ADULT,
    qtyDiscounts: QTY,
    features: [
      "Four-way stretch knit",
      "UV-resistant and quick-dry",
      "Stays crisp without ironing",
    ],
  },

  // ---------- UNISEX WINTER ----------
  {
    id: "p-pullover-hoodie",
    name: "Snowsoft Unisex Pullover Hoodie",
    slug: "snowsoft-pullover-hoodie",
    collections: ["pullover-hoodie", "best-sellers"],
    description:
      "A 350 GSM brushed-fleece pullover with kangaroo pocket and double-layer hood — plush inside, smooth print surface outside.",
    fit: "Relaxed, cozy and effortlessly structured.",
    fabric: "Cotton-Poly Brushed Fleece",
    gsm: 350,
    mrp: 1299,
    price: 753,
    colors: [
      { ...c.charcoal, image: "/products/hoodie-charcoal.svg" },
      { ...c.navy, image: "/products/hoodie-navy.svg" },
      { ...c.pink, image: "/products/hoodie-pink.svg" },
    ],
    sizes: ADULT,
    qtyDiscounts: QTY,
    features: [
      "Plush brushed interior for cozy warmth",
      "No bobbling — tested through 30+ washes",
      "Flat drawcords and metal eyelets",
    ],
    bestSeller: true,
  },
  {
    id: "p-crew-sweatshirt",
    name: "Classic Crew Neck Sweatshirt",
    slug: "classic-crew-sweatshirt",
    collections: ["crew-sweatshirt", "new-arrival"],
    description:
      "The hoodless favourite — a clean crew sweatshirt with ribbed hem and cuffs, perfect for large front prints and embroidery.",
    fit: "Relaxed fit with ribbed trims.",
    fabric: "Cotton-Poly Loopknit Fleece",
    gsm: 320,
    mrp: 1099,
    price: 637,
    colors: [
      { ...c.grey, image: "/products/sweatshirt-grey.svg" },
      { ...c.maroon, image: "/products/sweatshirt-maroon.svg" },
      { ...c.green, image: "/products/sweatshirt-green.svg" },
    ],
    sizes: ADULT,
    qtyDiscounts: QTY,
    features: [
      "Smooth outer face for bold prints",
      "Ribbed hem and cuffs keep their snap",
      "Soft loopknit interior",
    ],
    isNew: true,
  },
  {
    id: "p-zipper-hoodie",
    name: "Summit Full-Zip Hoodie",
    slug: "summit-full-zip-hoodie",
    collections: ["zipper-hoodie"],
    description:
      "The layering-friendly full-zip version of our pullover, with a premium metal zipper and split kangaroo pockets.",
    fit: "Relaxed layering fit.",
    fabric: "Cotton-Poly Brushed Fleece",
    gsm: 330,
    mrp: 1399,
    price: 811,
    colors: [
      { ...c.charcoal, image: "/products/hoodie-charcoal.svg" },
      { ...c.navy, image: "/products/hoodie-navy.svg" },
    ],
    sizes: ADULT,
    qtyDiscounts: QTY,
    features: [
      "Metal zipper tested for 5,000+ cycles",
      "Split kangaroo pockets",
      "Left-chest embroidery included in bulk pricing",
    ],
  },

  // ---------- MEN ----------
  {
    id: "p-mens-oversized",
    name: "Heavy-Duty Oversized Drop-Shoulder Tee",
    slug: "heavy-duty-oversized-tee",
    collections: ["mens-oversized-tee", "best-sellers"],
    description:
      "A 240 GSM boxy-fit tee with dropped shoulders — the silhouette startups and streetwear brands ask for by name.",
    fit: "Oversized boxy fit with dropped shoulders.",
    fabric: "100% Cotton, Heavyweight",
    gsm: 240,
    mrp: 799,
    price: 463,
    colors: [
      { ...c.black, image: "/products/crew-black.svg" },
      { ...c.grey, image: "/products/tee-grey.svg" },
    ],
    sizes: ADULT,
    qtyDiscounts: QTY,
    features: [
      "Structured drape that holds its shape",
      "Perfect canvas for large front/back prints",
      "Pre-shrunk heavyweight knit",
    ],
    bestSeller: true,
  },
  {
    id: "p-mens-vneck",
    name: "Basics 160 Men's V-Neck Tee",
    slug: "basics-160-mens-v-neck",
    collections: ["mens-v-neck", "mega-sale"],
    description:
      "A light, breathable V-neck in ring-spun cotton — a clean base layer for uniforms and casual merch.",
    fit: "Slim modern fit with a flattering V collar.",
    fabric: "Ring-Spun Cotton",
    gsm: 160,
    mrp: 449,
    price: 231,
    colors: [
      { ...c.black, image: "/products/vneck-black.svg" },
      { ...c.white, image: "/products/vneck-white.svg" },
    ],
    sizes: ADULT,
    qtyDiscounts: QTY,
    features: [
      "Soft ring-spun handfeel",
      "Stays flat at the collar",
      "Everyday lightweight comfort",
    ],
    megaSale: true,
  },
  {
    id: "p-mens-raglan",
    name: "Men's Contrast Raglan Tee",
    slug: "mens-contrast-raglan-tee",
    collections: ["mens-raglan"],
    description:
      "Baseball-style raglan with contrast sleeves — an easy way to make team merch look designed, not just printed.",
    fit: "Athletic raglan cut for shoulder mobility.",
    fabric: "Cotton-Poly Blend",
    gsm: 180,
    mrp: 599,
    price: 347,
    colors: [
      { ...c.maroon, image: "/products/crew-maroon.svg" },
      { ...c.navy, image: "/products/longsleeve-navy.svg" },
    ],
    sizes: ADULT,
    qtyDiscounts: QTY,
    features: [
      "Contrast raglan sleeves",
      "Flexible blend with gentle stretch",
      "Great for sports and college fests",
    ],
  },
  {
    id: "p-mens-tank",
    name: "Men's Training Tank Top",
    slug: "mens-training-tank-top",
    collections: ["mens-tank-top"],
    description:
      "A breathable gym tank in soft combed cotton with a deep armhole cut for full range of motion.",
    fit: "Athletic fit with deep armholes.",
    fabric: "Combed Cotton",
    gsm: 160,
    mrp: 399,
    price: 231,
    colors: [
      { ...c.black, image: "/products/tank-black.svg" },
      { ...c.grey, image: "/products/tank-grey.svg" },
      { ...c.white, image: "/products/tank-white.svg" },
    ],
    sizes: ADULT,
    qtyDiscounts: QTY,
    features: [
      "Bound neckline that won't stretch out",
      "Sweat-friendly breathable knit",
      "Gym and academy branding available",
    ],
  },
  {
    id: "p-mens-longsleeve",
    name: "Full Sleeve Round Neck Tee",
    slug: "full-sleeve-round-neck-tee",
    collections: ["mens-long-sleeves", "new-arrival"],
    description:
      "A full-sleeve tee in smooth combed cotton — the cooler-weather staple that still prints beautifully.",
    fit: "Classic fit with fitted sleeves.",
    fabric: "100% Combed Cotton",
    gsm: 200,
    mrp: 699,
    price: 405,
    colors: [
      { ...c.white, image: "/products/longsleeve-white.svg" },
      { ...c.navy, image: "/products/longsleeve-navy.svg" },
      { ...c.maroon, image: "/products/longsleeve-maroon.svg" },
    ],
    sizes: ADULT,
    qtyDiscounts: QTY,
    features: [
      "Ribbed cuffs that keep their shape",
      "Smooth surface for prints and embroidery",
      "Layer-friendly weight",
    ],
    isNew: true,
  },
  {
    id: "p-mens-joggers",
    name: "Everyday Cotton Joggers",
    slug: "everyday-cotton-joggers",
    collections: ["mens-joggers"],
    description:
      "Tapered joggers in soft loopknit with ribbed cuffs, drawstring waist and deep side pockets — uniform bottoms your team will actually want to wear.",
    fit: "Tapered fit with ribbed ankle cuffs.",
    fabric: "Cotton Loopknit",
    gsm: 300,
    mrp: 999,
    price: 579,
    colors: [
      { ...c.black, image: "/products/joggers-black.svg" },
      { ...c.grey, image: "/products/joggers-grey.svg" },
      { ...c.navy, image: "/products/joggers-navy.svg" },
    ],
    sizes: ADULT,
    qtyDiscounts: QTY,
    features: [
      "Deep side pockets with clean bar-tacks",
      "Elastic waist with flat drawstring",
      "Holds color through industrial washing",
    ],
  },
  {
    id: "p-mens-shorts",
    name: "Everyday Cotton Shorts",
    slug: "everyday-cotton-shorts",
    collections: ["mens-shorts", "mega-sale"],
    description:
      "Above-the-knee cotton shorts with a comfortable drawstring waist — for sports days, gyms and summer uniforms.",
    fit: "Relaxed fit, above-the-knee length.",
    fabric: "Cotton Loopknit",
    gsm: 260,
    mrp: 699,
    price: 347,
    colors: [
      { ...c.black, image: "/products/shorts-black.svg" },
      { ...c.grey, image: "/products/shorts-grey.svg" },
      { ...c.navy, image: "/products/shorts-navy.svg" },
    ],
    sizes: ADULT,
    qtyDiscounts: QTY,
    features: [
      "Side pockets with reinforced seams",
      "Soft elastic waist with drawstring",
      "Quick-dry option available in polyester",
    ],
    megaSale: true,
  },
  {
    id: "p-mens-vest",
    name: "Daily Comfort Cotton Vest",
    slug: "daily-comfort-cotton-vest",
    collections: ["mens-vest"],
    description:
      "A soft, breathable innerwear vest in fine combed cotton — an everyday essential done properly.",
    fit: "Snug daily-wear fit.",
    fabric: "Fine Combed Cotton",
    gsm: 150,
    mrp: 249,
    price: 144,
    colors: [{ ...c.white, image: "/products/tank-white.svg" }],
    sizes: ADULT,
    qtyDiscounts: QTY,
    features: [
      "Fine-gauge soft knit",
      "Stays white through repeated washing",
      "Multipack pricing for retail",
    ],
  },

  // ---------- WOMEN ----------
  {
    id: "p-womens-rn",
    name: "Women's 160 Cotton Round Neck Tee",
    slug: "womens-160-round-neck",
    collections: ["womens-round-neck", "best-sellers"],
    description:
      "A round neck tee cut on a women's block — slimmer sleeves, gentle waist shaping and a soft ring-spun handfeel.",
    fit: "Feminine fit with shaped side seams.",
    fabric: "Ring-Spun Cotton",
    gsm: 160,
    mrp: 499,
    price: 289,
    colors: [
      { ...c.softPink, image: "/products/crop-pink.svg" },
      { ...c.white, image: "/products/crew-white.svg" },
      { ...c.black, image: "/products/crew-black.svg" },
      { ...c.lilac, image: "/products/crop-lilac.svg" },
    ],
    sizes: ADULT,
    qtyDiscounts: QTY,
    features: [
      "Cut on a dedicated women's block",
      "Soft, breathable ring-spun cotton",
      "Pastel palette available in bulk",
    ],
    bestSeller: true,
  },
  {
    id: "p-womens-crop",
    name: "Women's Boxy Crop Top",
    slug: "womens-boxy-crop-top",
    collections: ["womens-crop-top", "new-arrival"],
    description:
      "A boxy cropped tee with a raw-look hem — the modern merch silhouette for events, brands and college fests.",
    fit: "Boxy cropped fit, hits at the waist.",
    fabric: "100% Cotton",
    gsm: 180,
    mrp: 549,
    price: 318,
    colors: [
      { ...c.softPink, image: "/products/crop-pink.svg" },
      { ...c.black, image: "/products/crop-black.svg" },
      { ...c.lilac, image: "/products/crop-lilac.svg" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    qtyDiscounts: QTY,
    features: [
      "Clean boxy silhouette",
      "Pre-shrunk so the crop stays where it should",
      "Prints and embroidery both work beautifully",
    ],
    isNew: true,
  },
  {
    id: "p-womens-crop-hoodie",
    name: "Women's Crop Hoodie",
    slug: "womens-crop-hoodie",
    collections: ["womens-crop-hoodie"],
    description:
      "A cropped fleece hoodie that pairs warmth with a contemporary cut — campus and athleisure merch favourite.",
    fit: "Cropped relaxed fit with full-length sleeves.",
    fabric: "Cotton-Poly Brushed Fleece",
    gsm: 300,
    mrp: 1199,
    price: 695,
    colors: [
      { ...c.pink, image: "/products/hoodie-pink.svg" },
      { ...c.charcoal, image: "/products/hoodie-charcoal.svg" },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    qtyDiscounts: QTY,
    features: [
      "Brushed fleece warmth in a cropped cut",
      "Ribbed hem sits neatly at the waist",
      "Matching joggers available for sets",
    ],
  },

  // ---------- KIDS ----------
  {
    id: "p-kids-romper",
    name: "Infant Cotton Romper",
    slug: "infant-cotton-romper",
    collections: ["kids-romper"],
    description:
      "A featherlight romper in super-combed cotton with easy snap buttons — gentle on infant skin, easy on parents.",
    fit: "Roomy infant fit with snap closures.",
    fabric: "Super-Combed Cotton",
    gsm: 160,
    mrp: 349,
    price: 202,
    colors: [
      { ...c.mint, image: "/products/romper-mint.svg" },
      { ...c.mustard, image: "/products/romper-yellow.svg" },
      { ...c.sky, image: "/products/romper-skyblue.svg" },
    ],
    sizes: INFANT,
    qtyDiscounts: QTY,
    features: [
      "Nickel-free snap buttons",
      "Azo-free, skin-safe dyes",
      "Envelope neckline for easy changes",
    ],
  },
  {
    id: "p-kids-rn",
    name: "Kids Classic Round Neck Tee",
    slug: "kids-classic-round-neck",
    collections: ["kids-round-neck", "best-sellers"],
    description:
      "The classic kids tee in pure combed cotton — playful colors, honest quality, priced for bulk.",
    fit: "Classic kids fit with room to grow.",
    fabric: "100% Combed Cotton",
    gsm: 160,
    mrp: 299,
    price: 173,
    colors: [
      { ...c.mustard, image: "/products/tee-yellow.svg" },
      { ...c.royal, image: "/products/crew-royal.svg" },
      { ...c.red, image: "/products/jersey-red.svg" },
      { ...c.mint, image: "/products/romper-mint.svg" },
    ],
    sizes: KIDS,
    qtyDiscounts: QTY,
    features: [
      "Reinforced shoulder seams for playground wear",
      "Colorfast through school-year washing",
      "House-color palettes for schools",
    ],
    bestSeller: true,
  },
  {
    id: "p-kids-polo",
    name: "Kids School Polo",
    slug: "kids-school-polo",
    collections: ["kids-polo"],
    description:
      "A smart, hard-wearing kids polo for schools and events — collar stays neat, colors stay bright.",
    fit: "Neat school fit with growing room.",
    fabric: "Cotton Pique",
    gsm: 200,
    mrp: 449,
    price: 260,
    colors: [
      { ...c.white, image: "/products/polo-white.svg" },
      { ...c.navy, image: "/products/polo-navy.svg" },
    ],
    sizes: KIDS,
    qtyDiscounts: QTY,
    features: [
      "School crest embroidery available",
      "No button issues — QC on every piece",
      "Custom colors matched to your institution",
    ],
  },
  {
    id: "p-kids-cordset",
    name: "Kids Cotton Cord Set",
    slug: "kids-cotton-cord-set",
    collections: ["kids-cordset", "new-arrival"],
    description:
      "A matching tee-and-jogger set in soft combed cotton — the gift-ready combo parents and schools love.",
    fit: "Comfy coordinated set with elastic-waist joggers.",
    fabric: "Combed Cotton",
    gsm: 180,
    mrp: 799,
    price: 463,
    colors: [
      { ...c.red, image: "/products/cordset-red.svg" },
      { ...c.green, image: "/products/cordset-green.svg" },
      { ...c.tangerine, image: "/products/cordset-tangerine.svg" },
    ],
    sizes: KIDS,
    qtyDiscounts: QTY,
    features: [
      "Matching top and bottom in one SKU",
      "Soft elastic waistband",
      "Gift packaging available for bulk",
    ],
    isNew: true,
  },
  {
    id: "p-kids-joggers",
    name: "Kids Everyday Joggers",
    slug: "kids-everyday-joggers",
    collections: ["kids-joggers"],
    description:
      "Soft, sturdy joggers for school and play, with a safe flat drawstring and ribbed cuffs.",
    fit: "Relaxed kids fit with ribbed cuffs.",
    fabric: "Cotton Loopknit",
    gsm: 260,
    mrp: 599,
    price: 347,
    colors: [
      { ...c.grey, image: "/products/joggers-grey.svg" },
      { ...c.navy, image: "/products/joggers-navy.svg" },
    ],
    sizes: KIDS,
    qtyDiscounts: QTY,
    features: [
      "Playground-proof knees and seams",
      "Safe, sewn-in flat drawstring",
      "Matches our kids tees for sets",
    ],
  },
  {
    id: "p-kids-hoodie",
    name: "Kids Cotton Pullover Hoodie",
    slug: "kids-cotton-pullover-hoodie",
    collections: ["kids-pullover-hoodie", "mega-sale"],
    description:
      "A warm fleece hoodie sized for kids, without drawcords for safety — winter uniform ready.",
    fit: "Cozy kids fit, drawcord-free hood.",
    fabric: "Cotton-Poly Brushed Fleece",
    gsm: 320,
    mrp: 899,
    price: 521,
    colors: [
      { ...c.grey, image: "/products/hoodie-charcoal.svg" },
      { ...c.navy, image: "/products/hoodie-navy.svg" },
      { ...c.red, image: "/products/jersey-red.svg" },
    ],
    sizes: KIDS,
    qtyDiscounts: QTY,
    features: [
      "Drawcord-free hood for child safety",
      "Plush brushed interior",
      "School logo embroidery available",
    ],
    megaSale: true,
  },
  {
    id: "p-kids-fullsleeve",
    name: "Kids Fullsleeve Round Neck Tee",
    slug: "kids-fullsleeve-round-neck",
    collections: ["kids-fullsleeve"],
    description:
      "A full-sleeve cotton tee for the chilly months — light enough for classrooms, warm enough for morning assembly.",
    fit: "Classic kids fit with fitted sleeves.",
    fabric: "100% Combed Cotton",
    gsm: 180,
    mrp: 399,
    price: 231,
    colors: [
      { ...c.white, image: "/products/longsleeve-white.svg" },
      { ...c.navy, image: "/products/longsleeve-navy.svg" },
    ],
    sizes: KIDS,
    qtyDiscounts: QTY,
    features: [
      "Soft ribbed cuffs",
      "Layer under pinafores and shirts",
      "House colors available in bulk",
    ],
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCollection(slug: string): Product[] {
  return products.filter((p) => p.collections.includes(slug));
}

export function offPct(p: Product): number {
  return Math.round((1 - p.price / p.mrp) * 100);
}
