import type { Collection, Segment } from "@/lib/types";

export const collections: Collection[] = [
  // MEN'S CATEGORIES
  {
    slug: "mens-rn-half-180",
    name: "Half Sleeve - 180 GSM (100% Cotton)",
    segment: "men",
    group: "Round Neck T-Shirts",
    description: "Men's Round Neck Half Sleeve - 180 GSM (100% Cotton)",
  },
  {
    slug: "mens-rn-half-200-cotton",
    name: "Half Sleeve - 200 GSM (100% Cotton)",
    segment: "men",
    group: "Round Neck T-Shirts",
    description: "Men's Round Neck Half Sleeve - 200 GSM (100% Cotton)",
  },
  {
    slug: "mens-rn-half-200-spandex",
    name: "Half Sleeve - 200 GSM (95% Cotton & 5% Spandex)",
    segment: "men",
    group: "Round Neck T-Shirts",
    description: "Men's Round Neck Half Sleeve - 200 GSM (95% Cotton & 5% Spandex)",
  },
  {
    slug: "mens-rn-full-180",
    name: "Full Sleeve - 180 GSM (100% Cotton)",
    segment: "men",
    group: "Round Neck T-Shirts",
    description: "Men's Round Neck Full Sleeve - 180 GSM (100% Cotton)",
  },
  {
    slug: "mens-oversize-200",
    name: "Half Sleeve - 200 GSM (100% Cotton)",
    segment: "men",
    group: "Oversize T-Shirts",
    description: "Men's Oversize Half Sleeve - 200 GSM (100% Cotton)",
  },
  {
    slug: "mens-oversize-240",
    name: "Half Sleeve - 240-250 GSM (100% Cotton)",
    segment: "men",
    group: "Oversize T-Shirts",
    description: "Men's Oversize Half Sleeve - 240-250 GSM (100% Cotton)",
  },
  {
    slug: "mens-polo-240-cotton",
    name: "Half Sleeve - 240-250 GSM (100% Cotton)",
    segment: "men",
    group: "Polo T-Shirts",
    description: "Men's Polo Half Sleeve - 240-250 GSM (100% Cotton)",
  },
  {
    slug: "mens-polo-240-spandex",
    name: "Half Sleeve - 240-250 GSM (95% Cotton & 5% Spandex)",
    segment: "men",
    group: "Polo T-Shirts",
    description: "Men's Polo Half Sleeve - 240-250 GSM (95% Cotton & 5% Spandex)",
  },
  {
    slug: "mens-polo-mars-200",
    name: "Mars Half Sleeve - 200 GSM (100% Micro Poly)",
    segment: "men",
    group: "Polo T-Shirts",
    description: "Men's Polo Half Sleeve Mars - 200 GSM (100% Micro Polyester)",
  },

  // WOMEN'S CATEGORIES
  {
    slug: "womens-rn-half-180",
    name: "Half Sleeve - 180 GSM (100% Cotton)",
    segment: "women",
    group: "Round Neck T-Shirts",
    description: "Women's Round Neck Half Sleeve - 180 GSM (100% Cotton)",
  },

  // KIDS' CATEGORIES
  {
    slug: "kids-rn-half-180",
    name: "Half Sleeve - 180 GSM (100% Cotton)",
    segment: "kids",
    group: "Round Neck T-Shirts",
    description: "Kids Round Neck Half Sleeve - 180 GSM (100% Cotton)",
  },

  // HOODIES CATEGORIES
  {
    slug: "unisex-hoodie-zip-325",
    name: "325 GSM (100% Cotton)",
    segment: "hoodies",
    group: "With Zip",
    description: "Unisex Hoodies with Zip - 325 GSM (100% Cotton)",
  },
  {
    slug: "unisex-hoodie-zip-360",
    name: "360-370 GSM (80% Cotton & 20% Poly)",
    segment: "hoodies",
    group: "With Zip",
    description: "Unisex Hoodies with Zip - 360-370 GSM (80% Cotton & 20% Polyester)",
  },
  {
    slug: "hoodie-with-zip-320",
    name: "320 GSM (Cotton Rich Fabric)",
    segment: "hoodies",
    group: "With Zip",
    description: "Hoodies with Zip - 320 GSM (Cotton Rich Fabric)",
  },
  {
    slug: "hoodie-without-zip-320",
    name: "320 GSM (Cotton Rich Fabric)",
    segment: "hoodies",
    group: "Without Zip",
    description: "Hoodies without Zip - 320 GSM (Cotton Rich Fabric)",
  },

  // SPECIALTY & FABRICS CATEGORIES
  {
    slug: "ecoblend-rn-180",
    name: "Ecoblend Round Neck - 180 GSM (Polycotton)",
    segment: "specialty",
    group: "Eco & Biowash",
    description: "Ecoblend Round Neck T-Shirts - 180 GSM (Polycotton Fabric)",
  },
  {
    slug: "biowash-rn-180",
    name: "Biowash Round Neck - 180 GSM (100% Cotton)",
    segment: "specialty",
    group: "Eco & Biowash",
    description: "Biowash Round Neck T-Shirts - 180 GSM (100% Cotton)",
  },
  {
    slug: "ecoblend-polo-240",
    name: "Ecoblend Polo Neck - 240 GSM (Polycotton)",
    segment: "specialty",
    group: "Eco & Biowash",
    description: "Ecoblend Polo Neck T-Shirts - 240 GSM (Polycotton Ecoblend Fabric)",
  },
  {
    slug: "primoknit-polo-200",
    name: "Primoknit Polo - 200 GSM (Dotknit)",
    segment: "specialty",
    group: "Performance Fabrics",
    description: "Primoknit Polo T-Shirt - 200 GSM (Dotknit Fabrics)",
  },
  {
    slug: "aeropiq-polo-210",
    name: "Aeropiq Polo - 210 GSM (Nano Poly)",
    segment: "specialty",
    group: "Performance Fabrics",
    description: "Aeropiq Polo T-Shirts - 210 GSM (Nano Poly Fabric)",
  },
  {
    slug: "organic-polo-270",
    name: "Organic Polo - 270 GSM (100% Premium Cotton)",
    segment: "specialty",
    group: "Organic Collection",
    description: "Organic Polo T-Shirts - 270 GSM (100% Premium Cotton)",
  },
  {
    slug: "organic-polo-plain-270",
    name: "Organic Polo Plain - 270 GSM (100% Premium Cotton)",
    segment: "specialty",
    group: "Organic Collection",
    description: "Organic Polo Plain T-Shirts - 270 GSM (100% Premium Cotton)",
  },
];

export const segments: Segment[] = [
  {
    slug: "men",
    name: "Men",
    groups: [
      {
        title: "Round Neck T-Shirts",
        collections: [
          "mens-rn-half-180",
          "mens-rn-half-200-cotton",
          "mens-rn-half-200-spandex",
          "mens-rn-full-180",
        ],
      },
      {
        title: "Oversize T-Shirts",
        collections: [
          "mens-oversize-200",
          "mens-oversize-240",
        ],
      },
      {
        title: "Polo T-Shirts",
        collections: [
          "mens-polo-240-cotton",
          "mens-polo-240-spandex",
          "mens-polo-mars-200",
        ],
      },
    ],
  },
  {
    slug: "women",
    name: "Women",
    groups: [
      {
        title: "Round Neck T-Shirts",
        collections: [
          "womens-rn-half-180",
        ],
      },
    ],
  },
  {
    slug: "kids",
    name: "Kids",
    groups: [
      {
        title: "Round Neck T-Shirts",
        collections: [
          "kids-rn-half-180",
        ],
      },
    ],
  },
  {
    slug: "hoodies",
    name: "Hoodies",
    groups: [
      {
        title: "With Zip",
        collections: [
          "unisex-hoodie-zip-325",
          "unisex-hoodie-zip-360",
          "hoodie-with-zip-320",
        ],
      },
      {
        title: "Without Zip",
        collections: [
          "hoodie-without-zip-320",
        ],
      },
    ],
  },
  {
    slug: "specialty",
    name: "Specialty & Fabrics",
    groups: [
      {
        title: "Eco & Biowash",
        collections: [
          "ecoblend-rn-180",
          "biowash-rn-180",
          "ecoblend-polo-240",
        ],
      },
      {
        title: "Performance Fabrics",
        collections: [
          "primoknit-polo-200",
          "aeropiq-polo-210",
        ],
      },
      {
        title: "Organic Collection",
        collections: [
          "organic-polo-270",
          "organic-polo-plain-270",
        ],
      },
    ],
  },
];

export function getCollection(slug: string): Collection | undefined {
  return collections.find((c) => c.slug === slug);
}
