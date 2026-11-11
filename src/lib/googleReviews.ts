import { TEESZONE_GOOGLE_REVIEWS_URL } from "@/data/ratings";
export { TEESZONE_GOOGLE_REVIEWS_URL };

export interface GoogleReviewItem {
  id: string;
  authorName: string;
  authorPhotoUrl?: string;
  apparelImageUrl?: string;
  apparelImages?: string[];
  rating: number;
  text: string;
  relativeTime: string;
  publishDate?: string;
  googleReviewUrl: string;
  verifiedOrder?: boolean;
  badge?: string;
}

export interface GooglePlaceReviewResponse {
  businessName: string;
  location: string;
  rating: number;
  userRatingCount?: number;
  googleMapsUrl: string;
  reviews: GoogleReviewItem[];
  source: "api" | "verified_cache";
}

export const TEESZONE_PLACE_ID = "ChIJw5Ftld9ryTsRKGdwzJ7sU_M";
export const TEESZONE_PLACE_CID = "0xf353ec9ccd766328";

// Proxy S3 review media through authenticated Next.js streamer to avoid S3 403 Forbidden errors
const S3_BASE = "/api/upload/media/reviews";

// Verified genuine Google customer reviews from official Google listing (stored in AWS S3):
export const VERIFIED_GOOGLE_REVIEWS: GoogleReviewItem[] = [
  {
    id: "g-rev-arun",
    authorName: "Arun Sundhar",
    authorPhotoUrl: `${S3_BASE}/arun-sundhar.jpg`,
    rating: 5,
    text: "Very nice... Good service...All the Best...",
    relativeTime: "3 months ago",
    publishDate: "2026-08-08",
    googleReviewUrl: "https://share.google/Fo5oZmr0Ame4Tajqx",
    verifiedOrder: true,
  },
  {
    id: "g-rev-taj",
    authorName: "Taj Taj",
    authorPhotoUrl: `${S3_BASE}/taj-taj.jpg`,
    rating: 5,
    text: "Thank you for the T shirt it’s comfortable and nice ❤️✨",
    relativeTime: "4 weeks ago",
    publishDate: "2026-10-14",
    googleReviewUrl: "https://share.google/NlsYKaHwa9AfwEjd1",
    verifiedOrder: true,
  },
  {
    id: "g-rev-rk",
    authorName: "RK ACADEMY",
    authorPhotoUrl: `${S3_BASE}/rk-academy.jpg`,
    rating: 5,
    text: "Too Good in both service and quality of materials",
    relativeTime: "6 months ago",
    publishDate: "2026-05-15",
    googleReviewUrl: "https://share.google/8MJegLzdgMQEhtP5C",
    verifiedOrder: true,
  },
  {
    id: "g-rev-riswah",
    authorName: "Riswah Na",
    authorPhotoUrl: `${S3_BASE}/riswah-na.jpg`,
    rating: 5,
    text: "Great job, team! Your commitment to quality and timeline has produced excellent results. Keep up the good work.",
    relativeTime: "3 months ago",
    publishDate: "2026-08-10",
    googleReviewUrl: "https://share.google/xuiqxa7CdgbsQhxU4",
    verifiedOrder: true,
  },
  {
    id: "g-rev-majumdar",
    authorName: "Parthasarathi Majumdar",
    authorPhotoUrl: `${S3_BASE}/parthasarathi-majumdar.jpg`,
    badge: "Local Guide",
    rating: 5,
    text: "Just want to tell everyone, product quality, delivery timeline simply awesome.. Mr Shakti and viji maam along with Archana maam are so helpful in every step that I got my package on time... Shakti sir is truly genuine person who try to help us as much as he can and we will love to collaborate with them.",
    relativeTime: "3 weeks ago",
    publishDate: "2026-10-20",
    googleReviewUrl: "https://share.google/fABWnjK0GUyNktLT8",
    verifiedOrder: true,
  },
  {
    id: "g-rev-balaraman",
    authorName: "Prabhu Balaraman",
    authorPhotoUrl: `${S3_BASE}/prabhu-balaraman.jpg`,
    rating: 5,
    text: "I am writing to express our sincere appreciation for the outstanding apparel you supplied for our recent event. The feedback from participants has been overwhelmingly positive. Many specifically praised the quality of the fabric, noting that it was comfortable, durable, and well-suited for the activities during the event. Several attendees mentioned that the material felt premium and appreciated the attention to detail in the stitching and finish.and Logo printing was perfect.",
    relativeTime: "a month ago",
    publishDate: "2026-10-10",
    googleReviewUrl: "https://share.google/wKYtkz9QBYjCnkIgy",
    verifiedOrder: true,
  },
];

export const FALLBACK_GOOGLE_DATA: GooglePlaceReviewResponse = {
  businessName: "TeesZone Clothing Private Limited",
  location: "Texvalley, Erode, Tamil Nadu",
  rating: 5.0,
  googleMapsUrl: TEESZONE_GOOGLE_REVIEWS_URL,
  reviews: VERIFIED_GOOGLE_REVIEWS,
  source: "verified_cache",
};
