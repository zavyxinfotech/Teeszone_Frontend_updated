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
  getProducts,
} from "@/lib/api";
import { isPoloProduct } from "@/data/ratings";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [allProducts, homeContent] = await Promise.all([
    getProducts(),
    getHomeContent(),
  ]);

  // Add all products in the polo t-shirts category to Best Sellers
  const activeBestSellers = (allProducts || []).filter(isPoloProduct);

  return (
    <>
      <HeroSplit content={homeContent?.hero} />
      <UseCases />
      <ShopByRange content={homeContent?.shopByRange} />
      <ProductRail
        title="Best Sellers"
        products={activeBestSellers}
        viewAllHref="/products?category=polo-t-shirts"
      />
      <ProcessSteps content={homeContent?.processSteps} />
      <StatsBand />
      <CustomerReviewsSection />
      <CtaBand />
    </>
  );
}
