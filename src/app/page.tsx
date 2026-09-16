import { HeroSplit } from "@/components/home/HeroSplit";
import { UseCases } from "@/components/home/UseCases";
import { ShopByRange } from "@/components/home/ShopByRange";
import { ProductRail } from "@/components/home/ProductRail";
import { FabricLibrary } from "@/components/home/FabricLibrary";
import { ProcessSteps } from "@/components/home/ProcessSteps";
import { StatsBand } from "@/components/home/StatsBand";
import { ReviewsGrid } from "@/components/home/ReviewsGrid";
import { CtaBand } from "@/components/home/CtaBand";
import { getFabrics, getProductsByCollection, getReviews } from "@/lib/api";

export const revalidate = 300;

export default async function HomePage() {
  const [bestSellers, fabrics, reviews] = await Promise.all([
    getProductsByCollection("best-sellers"),
    getFabrics(),
    getReviews(),
  ]);

  return (
    <>
      <HeroSplit />
      <UseCases />
      <ShopByRange />
      <ProductRail
        title="Best Sellers"
        products={bestSellers}
        viewAllHref="/collections/best-sellers"
      />
      <FabricLibrary fabrics={fabrics} />
      <ProcessSteps />
      <StatsBand />
      <ReviewsGrid reviews={reviews} />
      <CtaBand />
    </>
  );
}
