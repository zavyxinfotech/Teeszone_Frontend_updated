import { NextResponse } from "next/server";
import {
  FALLBACK_GOOGLE_DATA,
  TEESZONE_PLACE_ID,
  TEESZONE_GOOGLE_REVIEWS_URL,
  type GooglePlaceReviewResponse,
  type GoogleReviewItem,
} from "@/lib/googleReviews";

export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  const apiKey =
    process.env.GOOGLE_PLACES_API_KEY ||
    process.env.GOOGLE_MAPS_API_KEY ||
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    // Return verified Google listing reviews cache if API key not provided
    return NextResponse.json(FALLBACK_GOOGLE_DATA, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  }

  try {
    // Call Google Maps Platform Places API (New) Place Details
    const url = `https://places.googleapis.com/v1/places/${TEESZONE_PLACE_ID}?fields=rating,userRatingCount,reviews,displayName&key=${apiKey}`;

    const res = await fetch(url, {
      next: { revalidate: 3600 },
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      console.warn(
        `Google Places API returned status ${res.status}. Falling back to verified listing reviews.`
      );
      return NextResponse.json(FALLBACK_GOOGLE_DATA);
    }

    const data = await res.json();

    const rawReviews = Array.isArray(data.reviews) ? data.reviews : [];

    const mappedReviews: GoogleReviewItem[] = rawReviews.map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (r: any, idx: number) => ({
        id: `g-api-${idx}-${r.publishTime || idx}`,
        authorName: r.authorAttribution?.displayName || "Verified Customer",
        authorPhotoUrl: r.authorAttribution?.photoUri,
        rating: typeof r.rating === "number" ? r.rating : 5,
        text: r.text?.text || r.originalText?.text || "",
        relativeTime: r.relativePublishTimeDescription || "Recently",
        publishDate: r.publishTime ? r.publishTime.split("T")[0] : undefined,
        googleReviewUrl:
          r.authorAttribution?.uri || TEESZONE_GOOGLE_REVIEWS_URL,
        verifiedOrder: true,
      })
    );

    const response: GooglePlaceReviewResponse = {
      businessName:
        data.displayName?.text || "TeesZone Clothing Private Limited",
      location: "Texvalley, Erode, Tamil Nadu",
      rating: typeof data.rating === "number" ? data.rating : 5.0,
      userRatingCount:
        typeof data.userRatingCount === "number" ? data.userRatingCount : 21,
      googleMapsUrl: TEESZONE_GOOGLE_REVIEWS_URL,
      reviews: mappedReviews.length > 0 ? mappedReviews : FALLBACK_GOOGLE_DATA.reviews,
      source: "api",
    };

    return NextResponse.json(response, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (err) {
    console.error("Error fetching Google Reviews:", err);
    return NextResponse.json(FALLBACK_GOOGLE_DATA);
  }
}
