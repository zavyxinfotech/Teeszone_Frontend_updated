export interface ProductRatingInfo {
  rating: number;
  reviews: number;
  deliveredCompanies: number;
}

export const TEESZONE_GOOGLE_REVIEWS_URL =
  "https://www.google.com/search?q=teeszone+clothing+private+limited+google+reviews&sca_esv=26e1428ea9835dcb&sxsrf=AKL5yDh5rc1YIl9LZexYxDuOt4SpNXCmMg%3A1794305354107&ei=Su3yaoSJBtO3hvcPl_39oAI&biw=1536&bih=730&oq=teeszone+&gs_lp=Egxnd3Mtd2l6LXNlcnAiCXRlZXN6b25lICoECAEYJzIEECMYJzIEECMYJzIFEAAYgAQyBRAAGO8FMggQABiABBiiBDIFEAAY7wUyBRAAGO8FSMIiUABY3Q1wAXgAkAEAmAGZAaABlwmqAQMwLjm4AQHIAQD4AQGYAgqgAosKqAIUwgIHECMY6gIYJ8ICEBAjGJ0GGOgGGN0FGOoCGCfCAg0QLhjHARjRAxjqAhgnwgIXEAAYgAQYigUYkQIY5wYY6gIYtALYAQHCAhAQABgDGI8BGOoCGLQC2AEBwgIKEAAYgAQYigUYQ8ICCxAAGIAEGIoFGJECwgIREC4YgAQYigUYkQIYxwEY0QPCAgsQABiABBixAxiDAcICEBAAGIAEGBQYhwIYsQMYgwHCAgoQABiABBgUGIcCwgIOEAAYgAQYigUYkQIYsQPCAhQQLhiABBiKBRiRAhixAxjHARjRA8ICDRAuGIAEGIoFGEMYsQPCAgwQABiABBgKGAsYsQPCAgwQLhiABBgKGAsYsQPCAgwQABiABBgKGAsYtAfCAgkQABiABBgKGAuYAxLiAwUSATEgQPEFvNTDtHMCteC6BgYIARABGAGSBwMxLjmgB7BKsgcDMC45uAf5CcIHBTItNi40yAdPgAgB&sclient=gws-wiz-serp#lrd=0x3ba96bfd956d91c3:0xf353ec9ccd766328,1,,,,";

export const PRODUCT_RATINGS: Record<string, ProductRatingInfo> = {
  "p-aerosoft-polo-200": { rating: 5.0, reviews: 21, deliveredCompanies: 500 },
  "aerosoft-polo-200": { rating: 5.0, reviews: 21, deliveredCompanies: 500 },

  "p-mens-polo-half-sleeve-240": { rating: 5.0, reviews: 21, deliveredCompanies: 500 },
  "mens-polo-half-sleeve-240": { rating: 5.0, reviews: 21, deliveredCompanies: 500 },

  "p-ecoblend-polo-neck-240": { rating: 5.0, reviews: 21, deliveredCompanies: 500 },
  "ecoblend-polo-neck-240": { rating: 5.0, reviews: 21, deliveredCompanies: 500 },

  "p-mens-rn-half-180": { rating: 5.0, reviews: 21, deliveredCompanies: 500 },
  "mens-rn-half-180": { rating: 5.0, reviews: 21, deliveredCompanies: 500 },

  "p-mens-rn-half-200-lycra": { rating: 5.0, reviews: 21, deliveredCompanies: 500 },
  "mens-rn-half-200-lycra": { rating: 5.0, reviews: 21, deliveredCompanies: 500 },

  "p-mens-oversize-french-terry-240": { rating: 5.0, reviews: 21, deliveredCompanies: 500 },
  "mens-oversize-french-terry-240": { rating: 5.0, reviews: 21, deliveredCompanies: 500 },

  "p-hoodie-with-zip-320": { rating: 5.0, reviews: 21, deliveredCompanies: 500 },
  "hoodie-with-zip-320": { rating: 5.0, reviews: 21, deliveredCompanies: 500 },

  "p-hoodie-without-zip-320": { rating: 5.0, reviews: 21, deliveredCompanies: 500 },
  "hoodie-without-zip-320": { rating: 5.0, reviews: 21, deliveredCompanies: 500 },

  "p-unisex-hoodie-325": { rating: 5.0, reviews: 21, deliveredCompanies: 500 },
  "unisex-hoodie-325": { rating: 5.0, reviews: 21, deliveredCompanies: 500 },

  "p-unisex-hoodie-360": { rating: 5.0, reviews: 21, deliveredCompanies: 500 },
  "unisex-hoodie-360": { rating: 5.0, reviews: 21, deliveredCompanies: 500 },

  "p-womens-rn-half-180": { rating: 5.0, reviews: 21, deliveredCompanies: 500 },
  "womens-rn-half-180": { rating: 5.0, reviews: 21, deliveredCompanies: 500 },

  "p-kids-rn-half-180": { rating: 5.0, reviews: 21, deliveredCompanies: 500 },
  "kids-rn-half-180": { rating: 5.0, reviews: 21, deliveredCompanies: 500 },
};

export function getProductRating(idOrSlug: string): ProductRatingInfo {
  return PRODUCT_RATINGS[idOrSlug] ?? { rating: 5.0, reviews: 21, deliveredCompanies: 500 };
}

/**
 * Pure function safe to call from both Server Components and Client Components
 */
export function isPoloProduct(product: { slug?: string; name?: string; collections?: string[] }): boolean {
  const s = (product.slug || "").toLowerCase();
  const n = (product.name || "").toLowerCase();
  const cols = (product.collections || []).map((c) => c.toLowerCase());
  return s.includes("polo") || n.includes("polo") || cols.some((c) => c.includes("polo"));
}
