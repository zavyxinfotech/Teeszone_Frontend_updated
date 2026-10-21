import type { Collection, Segment } from "../lib/types";

export const collections: Collection[] = [
  // MEN'S CATEGORIES
  {
    slug: "aerosoft-polo-200",
    name: "Aerosoft Polo T-Shirt - 200 GSM",
    segment: "men",
    group: "Polo T-Shirts",
    description: "Aerosoft Polo T-Shirt - 200 GSM",
  },
  {
    slug: "mens-polo-half-sleeve-240",
    name: "Mens Polo Half Sleeve - 240 GSM",
    segment: "men",
    group: "Polo T-Shirts",
    description: "Mens Polo Half Sleeve - 240 GSM",
  },
  {
    slug: "ecoblend-polo-neck-240",
    name: "Ecoblend Polo Neck - 240 GSM",
    segment: "men",
    group: "Polo T-Shirts",
    description: "Ecoblend Polo Neck - 240 GSM",
  },
  {
    slug: "mens-rn-half-180",
    name: "Mens Round Neck Half Sleeve - 180 GSM",
    segment: "men",
    group: "Round Neck T-Shirts",
    description: "Mens Round Neck Half Sleeve - 180 GSM",
  },
  {
    slug: "mens-rn-half-200-lycra",
    name: "Mens Round Neck Half Sleeve - 200 GSM (Lycra)",
    segment: "men",
    group: "Round Neck T-Shirts",
    description: "Mens Round Neck Half Sleeve - 200 GSM (Lycra)",
  },
  {
    slug: "mens-oversize-french-terry-240",
    name: "Mens Oversize Half Sleeve - 240 - 250 GSM (French Terry)",
    segment: "men",
    group: "Oversize T-Shirts",
    description: "Mens Oversize Half Sleeve - 240 - 250 GSM (French Terry)",
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
    slug: "hoodie-with-zip-320",
    name: "Hoodies with Zip - 320 GSM",
    segment: "hoodies",
    group: "With Zip",
    description: "Hoodies with Zip - 320 GSM",
  },
  {
    slug: "hoodie-without-zip-320",
    name: "Hoodies without Zip - 320 GSM",
    segment: "hoodies",
    group: "Without Zip",
    description: "Hoodies without Zip - 320 GSM",
  },
  {
    slug: "unisex-hoodie-325",
    name: "Unisex Hoodies - 325 GSM",
    segment: "hoodies",
    group: "Unisex Hoodies",
    description: "Unisex Hoodies - 325 GSM",
  },
  {
    slug: "unisex-hoodie-360",
    name: "Unisex Hoodies - (360 - 370 GSM)",
    segment: "hoodies",
    group: "Unisex Hoodies",
    description: "Unisex Hoodies - (360 - 370 GSM)",
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
        title: "Polo T-Shirts",
        collections: [
          "aerosoft-polo-200",
          "mens-polo-half-sleeve-240",
          "ecoblend-polo-neck-240",
        ],
      },
      {
        title: "Round Neck T-Shirts",
        collections: [
          "mens-rn-half-180",
          "mens-rn-half-200-lycra",
        ],
      },
      {
        title: "Oversize T-Shirts",
        collections: [
          "mens-oversize-french-terry-240",
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
          "hoodie-with-zip-320",
        ],
      },
      {
        title: "Without Zip",
        collections: [
          "hoodie-without-zip-320",
        ],
      },
      {
        title: "Unisex Hoodies",
        collections: [
          "unisex-hoodie-325",
          "unisex-hoodie-360",
        ],
      },
    ],
  },
];

export function getCollection(slug: string): Collection | undefined {
  return collections.find((c) => c.slug === slug);
}
