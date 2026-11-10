import { HeroSplit } from "@/components/home/HeroSplit";
import { UseCases } from "@/components/home/UseCases";
import { ShopByRange } from "@/components/home/ShopByRange";
import { ProductRail } from "@/components/home/ProductRail";
import { ProcessSteps } from "@/components/home/ProcessSteps";
import { StatsBand } from "@/components/home/StatsBand";
import { CustomerReviewsSection } from "@/components/home/CustomerReviewsSection";
import { CtaBand } from "@/components/home/CtaBand";
import {
  getHomeContent,
  getProductsByCollection,
} from "@/lib/api";
import { isPoloProduct } from "@/data/ratings";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [bestSellers, homeContent] = await Promise.all([
    getProductsByCollection("best-sellers"),
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
      <CustomerReviewsSection />
      <CtaBand />
    </>
  );
}
