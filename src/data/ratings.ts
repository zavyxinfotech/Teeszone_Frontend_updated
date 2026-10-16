export interface ProductRatingInfo {
  rating: number;
  reviews: number;
  deliveredCompanies: number;
}

export const PRODUCT_RATINGS: Record<string, ProductRatingInfo> = {
  "p-aerosoft-polo-200": { rating: 4.6, reviews: 540, deliveredCompanies: 850 },
  "aerosoft-polo-200": { rating: 4.6, reviews: 540, deliveredCompanies: 850 },

  "p-mens-polo-half-sleeve-240": { rating: 4.8, reviews: 1080, deliveredCompanies: 1420 },
  "mens-polo-half-sleeve-240": { rating: 4.8, reviews: 1080, deliveredCompanies: 1420 },

  "p-ecoblend-polo-neck-240": { rating: 4.5, reviews: 420, deliveredCompanies: 680 },
  "ecoblend-polo-neck-240": { rating: 4.5, reviews: 420, deliveredCompanies: 680 },

  "p-mens-rn-half-180": { rating: 4.7, reviews: 1450, deliveredCompanies: 1950 },
  "mens-rn-half-180": { rating: 4.7, reviews: 1450, deliveredCompanies: 1950 },

  "p-mens-rn-half-200-lycra": { rating: 4.6, reviews: 620, deliveredCompanies: 910 },
  "mens-rn-half-200-lycra": { rating: 4.6, reviews: 620, deliveredCompanies: 910 },

  "p-mens-oversize-french-terry-240": { rating: 4.8, reviews: 980, deliveredCompanies: 1340 },
  "mens-oversize-french-terry-240": { rating: 4.8, reviews: 980, deliveredCompanies: 1340 },

  "p-hoodie-with-zip-320": { rating: 4.7, reviews: 760, deliveredCompanies: 1100 },
  "hoodie-with-zip-320": { rating: 4.7, reviews: 760, deliveredCompanies: 1100 },

  "p-hoodie-without-zip-320": { rating: 4.6, reviews: 830, deliveredCompanies: 1250 },
  "hoodie-without-zip-320": { rating: 4.6, reviews: 830, deliveredCompanies: 1250 },

  "p-unisex-hoodie-325": { rating: 4.7, reviews: 690, deliveredCompanies: 940 },
  "unisex-hoodie-325": { rating: 4.7, reviews: 690, deliveredCompanies: 940 },

  "p-unisex-hoodie-360": { rating: 4.9, reviews: 890, deliveredCompanies: 1180 },
  "unisex-hoodie-360": { rating: 4.9, reviews: 890, deliveredCompanies: 1180 },

  "p-womens-rn-half-180": { rating: 4.7, reviews: 890, deliveredCompanies: 1050 },
  "womens-rn-half-180": { rating: 4.7, reviews: 890, deliveredCompanies: 1050 },

  "p-kids-rn-half-180": { rating: 4.8, reviews: 1120, deliveredCompanies: 1300 },
  "kids-rn-half-180": { rating: 4.8, reviews: 1120, deliveredCompanies: 1300 },

  "p-ecoblend-rn-180": { rating: 4.4, reviews: 340, deliveredCompanies: 520 },
  "ecoblend-rn-180": { rating: 4.4, reviews: 340, deliveredCompanies: 520 },

  "p-biowash-rn-180": { rating: 4.6, reviews: 780, deliveredCompanies: 960 },
  "biowash-rn-180": { rating: 4.6, reviews: 780, deliveredCompanies: 960 },

  "p-primoknit-polo-200": { rating: 4.5, reviews: 290, deliveredCompanies: 410 },
  "primoknit-polo-200": { rating: 4.5, reviews: 290, deliveredCompanies: 410 },

  "p-ecoblend-polo-240": { rating: 4.3, reviews: 310, deliveredCompanies: 450 },
  "ecoblend-polo-240": { rating: 4.3, reviews: 310, deliveredCompanies: 450 },

  "p-aeropiq-polo-210": { rating: 4.5, reviews: 260, deliveredCompanies: 380 },
  "aeropiq-polo-210": { rating: 4.5, reviews: 260, deliveredCompanies: 380 },

  "p-organic-polo-270": { rating: 4.9, reviews: 540, deliveredCompanies: 760 },
  "organic-polo-270": { rating: 4.9, reviews: 540, deliveredCompanies: 760 },

  "p-organic-polo-plain-270": { rating: 4.7, reviews: 430, deliveredCompanies: 610 },
  "organic-polo-plain-270": { rating: 4.7, reviews: 430, deliveredCompanies: 610 },
};

export function getProductRating(idOrSlug: string): ProductRatingInfo {
  return PRODUCT_RATINGS[idOrSlug] ?? { rating: 4.6, reviews: 450, deliveredCompanies: 650 };
}
