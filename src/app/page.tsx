import { HeroSplit } from "@/components/home/HeroSplit";
import { UseCases } from "@/components/home/UseCases";
import { ShopByRange } from "@/components/home/ShopByRange";
import { ProductRail } from "@/components/home/ProductRail";
import { FabricLibrary } from "@/components/home/FabricLibrary";
import { ProcessSteps } from "@/components/home/ProcessSteps";
import { StatsBand } from "@/components/home/StatsBand";
import { ReviewsGrid } from "@/components/home/ReviewsGrid";
import { CtaBand } from "@/components/home/CtaBand";
import {
  getFabrics,
  getHomeContent,
  getProductsByCollection,
  getReviews,
} from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [bestSellers, fabrics, reviews, homeContent] = await Promise.all([
    getProductsByCollection("best-sellers"),
    getFabrics(),
    getReviews(),
    getHomeContent(),
  ]);

  return (
    <>
      <HeroSplit content={homeContent?.hero} />
      <UseCases />
      <ShopByRange content={homeContent?.shopByRange} />
      <ProductRail
        title="Best Sellers"
        products={bestSellers}
        viewAllHref="/collections/best-sellers"
      />
      <FabricLibrary fabrics={fabrics} content={homeContent?.fabricLibrary} />
      <ProcessSteps content={homeContent?.processSteps} />
      <StatsBand />
      <ReviewsGrid reviews={reviews} />
      <CtaBand />
    </>
  );
}
