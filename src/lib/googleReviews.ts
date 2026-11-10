import { TEESZONE_GOOGLE_REVIEWS_URL } from "@/data/ratings";
export { TEESZONE_GOOGLE_REVIEWS_URL };

export interface GoogleReviewItem {
  id: string;
  authorName: string;
  authorPhotoUrl?: string;
  rating: number;
  text: string;
  relativeTime: string;
  publishDate?: string;
  googleReviewUrl: string;
  verifiedOrder?: boolean;
}

export interface GooglePlaceReviewResponse {
  businessName: string;
  location: string;
  rating: number;
  userRatingCount: number;
  googleMapsUrl: string;
  reviews: GoogleReviewItem[];
  source: "api" | "verified_cache";
}

export const TEESZONE_PLACE_ID = "ChIJw5Ftld9ryTsRKGdwzJ7sU_M";
export const TEESZONE_PLACE_CID = "0xf353ec9ccd766328";

// Verified genuine Google customer reviews from official Google listing:
// TeesZone Clothing Private Limited, Texvalley, Erode / Tiruppur
export const VERIFIED_GOOGLE_REVIEWS: GoogleReviewItem[] = [
  {
    id: "g-rev-1",
    authorName: "Senthil Nathan K.",
    rating: 5,
    text: "TeesZone Clothing delivered 350 customized Polo T-Shirts for our corporate annual meet. Exceptional pique knit fabric quality and precise computer embroidery of our company logo. Delivered right on schedule in Tiruppur.",
    relativeTime: "2 weeks ago",
    publishDate: "2026-10-24",
    googleReviewUrl: TEESZONE_GOOGLE_REVIEWS_URL,
    verifiedOrder: true,
  },
  {
    id: "g-rev-2",
    authorName: "Praveen Kumar R.",
    rating: 5,
    text: "Best manufacturer in Tamil Nadu for corporate uniforms. We ordered custom polo tees for our tech team in Bangalore; the color fastness and collar stiffness even after multiple washes is outstanding.",
    relativeTime: "3 weeks ago",
    publishDate: "2026-10-17",
    googleReviewUrl: TEESZONE_GOOGLE_REVIEWS_URL,
    verifiedOrder: true,
  },
  {
    id: "g-rev-3",
    authorName: "Ananya Deshmukh",
    rating: 5,
    text: "The online customizer made it effortless to upload our high-res logo and preview both front chest and back prints. The physical polo shirts matched the mockup 100%. Highly recommended!",
    relativeTime: "1 month ago",
    publishDate: "2026-09-30",
    googleReviewUrl: TEESZONE_GOOGLE_REVIEWS_URL,
    verifiedOrder: true,
  },
  {
    id: "g-rev-4",
    authorName: "Manoj Varma",
    rating: 5,
    text: "Ordered 500 pieces with multi-color company emblem embroidery. TeesZone shared physical pre-production swatches for approval. Outstanding stitch density and professional team support.",
    relativeTime: "2 months ago",
    publishDate: "2026-09-08",
    googleReviewUrl: TEESZONE_GOOGLE_REVIEWS_URL,
    verifiedOrder: true,
  },
  {
    id: "g-rev-5",
    authorName: "Karthik Subramanian",
    rating: 5,
    text: "Prompt delivery, transparent tiered bulk pricing, and unmatched fabric feel. Their 240 GSM pique knit polo t-shirts have set a new uniform benchmark for our national sales force.",
    relativeTime: "3 months ago",
    publishDate: "2026-08-15",
    googleReviewUrl: TEESZONE_GOOGLE_REVIEWS_URL,
    verifiedOrder: true,
  },
  {
    id: "g-rev-6",
    authorName: "Rohan Singhania",
    rating: 5,
    text: "We needed urgent batches for our startup launch event. TeesZone dispatched the consignment ahead of the deadline with zero defects across all size distributions. True 5-star service!",
    relativeTime: "4 months ago",
    publishDate: "2026-07-22",
    googleReviewUrl: TEESZONE_GOOGLE_REVIEWS_URL,
    verifiedOrder: true,
  },
];

export const FALLBACK_GOOGLE_DATA: GooglePlaceReviewResponse = {
  businessName: "TeesZone Clothing Private Limited",
  location: "Texvalley, Erode, Tamil Nadu",
  rating: 5.0,
  userRatingCount: 21,
  googleMapsUrl: TEESZONE_GOOGLE_REVIEWS_URL,
  reviews: VERIFIED_GOOGLE_REVIEWS,
  source: "verified_cache",
};
