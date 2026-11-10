export interface ProductRatingInfo {
  rating: number;
  reviews: number;
  deliveredCompanies: number;
}

export const TEESZONE_GOOGLE_REVIEWS_URL =
  "https://www.google.com/search?q=teeszone+clothing+private+limited&sca_esv=65004a4481887a1a&biw=1536&bih=730&sxsrf=AKL5yDibRrhEX9ijxGUDPxEFmtziJjaXlg%3A1794299729839&ei=UdfyapzoMuCaseMP-NHYqAI&oq=+teeszone&gs_lp=Egxnd3Mtd2l6LXNlcnAiCSB0ZWVzem9uZSoECAAYJzIEECMYJzIEECMYJzILEAAYgAQYigUYkQIyChAAGIAEGIoFGEMyCBAAGIAEGKIEMgUQABjvBTIFEAAY7wVIiBNQvAJYvAJwAXgAkAEAmAGcAaABnAGqAQMwLjG4AQHIAQD4AQGYAgKgAroBwgIIEAAY7wUYsAPCAgsQABiABBiiBBiwA5gDAIgGAZAGBJIHAzEuMaAH1wWyBwMwLjG4B6YBwgcFMi0xLjHIBxOACAE&sclient=gws-wiz-serp#sv=CAESzQEKuQEStgEKd0FERGJXZWF6ZzI2aWRhX2dHNmlpT3JUeW51ZlJaZUIteHpuVnNELTZpWF91bHo3bmQ4Q1ExQ0N0TlpScmZwa1FSWDgxT2VocExCUWVLU2E1UHl0MmVIZFR3cUgwZFV5Sy1aM3djQmVjbVNoUWJCbXBuejZfWjVvEhdldGZ5YW9LMEpJQ1pzZU1QX2M2VTRRZxoiQUhOMEU3RklaYTI1NDg2ZzRnamRsZ2ZNdG5rWjROTm9nURIEODA1MRoBMyoAMAA4AUAAGAAgur7U6QZKAhAB";

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
