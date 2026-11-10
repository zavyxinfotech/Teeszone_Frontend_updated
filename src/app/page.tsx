import { HeroSplit } from "@/components/home/HeroSplit";
import { UseCases } from "@/components/home/UseCases";
import { ShopByRange } from "@/components/home/ShopByRange";
import { ProductRail } from "@/components/home/ProductRail";
import { ProcessSteps } from "@/components/home/ProcessSteps";
import { StatsBand } from "@/components/home/StatsBand";
import { ReviewsGrid } from "@/components/home/ReviewsGrid";
import { CtaBand } from "@/components/home/CtaBand";
import {
  getHomeContent,
  getProductsByCollection,
  getReviews,
} from "@/lib/api";
import { isPoloProduct } from "@/components/product/ProductCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [bestSellers, reviews, homeContent] = await Promise.all([
    getProductsByCollection("best-sellers"),
    getReviews(),
    getHomeContent(),
  ]);

  // Exclude Coming Soon products from Best Sellers rail
  const activeBestSellers = (bestSellers || []).filter(isPoloProduct);

  return (
    <>
      <HeroSplit content={homeContent?.hero} />
      <UseCases />
      <ShopByRange content={homeContent?.shopByRange} />
      <ProductRail
        title="Best Sellers"
        products={activeBestSellers}
        viewAllHref="/collections/best-sellers"
      />
      <ProcessSteps content={homeContent?.processSteps} />
      <StatsBand />
      <ReviewsGrid reviews={reviews} />
      <CtaBand />
    </>
  );
}
