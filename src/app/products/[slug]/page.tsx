import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getProduct, getProducts } from "@/lib/api";
import { offPct } from "@/lib/pricing";
import { ProductConfigurator } from "@/components/product/ProductConfigurator";
import { FaqAccordion } from "@/components/product/FaqAccordion";
import { ProductCard } from "@/components/product/ProductCard";
import { CustomerReviewsSection } from "@/components/home/CustomerReviewsSection";
import { Check } from "lucide-react";
import { site } from "@/lib/site";
import { Reveal } from "@/components/ui/Reveal";

export const revalidate = 300;

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: `${product.name} — ${product.fabric}, ${product.gsm} GSM. Bulk pricing from ₹${product.price}/pc (${offPct(product)}% off MRP) with custom printing or embroidery. Factory-direct from Tiruppur.`,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [product, allProducts] = await Promise.all([
    getProduct(slug),
    getProducts(),
  ]);
  if (!product) redirect("/products");

  const isPolo =
    (product.slug || "").toLowerCase().includes("polo") ||
    (product.name || "").toLowerCase().includes("polo") ||
    (product.collections || []).some((c) => c.toLowerCase().includes("polo"));

  if (!isPolo) {
    redirect("/products?category=polo-t-shirts");
  }

  // Filter 4 similar polo products (excluding current product)
  const related = allProducts
    .filter(
      (p) =>
        p.id !== product.id &&
        ((p.slug || "").toLowerCase().includes("polo") ||
          (p.name || "").toLowerCase().includes("polo"))
    )
    .slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: `${site.url}${product.colors[0]?.image || ""}`,
    brand: { "@type": "Brand", name: site.name },
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: product.price,
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <div className="mx-auto max-w-[1320px] px-3 sm:px-6 pt-3 sm:pt-5 pb-8 sm:pb-12 md:pb-14 min-w-0 w-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Main Product Configurator & Details */}
      <ProductConfigurator product={product} />

      {/* Product Details Specs */}
      <Reveal>
        <section className="mt-14 max-w-2xl">
          <h2 className="text-lg font-bold uppercase tracking-[0.08em]">
            Product Details & Specifications
          </h2>
          <ul className="mt-5 space-y-3">
            {product.features.map((f) => (
              <li key={f} className="flex items-start gap-3 text-sm">
                <Check size={17} className="mt-0.5 shrink-0 text-accent" />
                {f}
              </li>
            ))}
          </ul>
        </section>
      </Reveal>

      {/* Customer Reviews Section (Continuous Loop Auto-Scroll) */}
      <div className="-mx-3 sm:-mx-6">
        <CustomerReviewsSection />
      </div>

      {/* FAQs */}
      <Reveal delay={80}>
        <FaqAccordion />
      </Reveal>

      {/* View Similar Products */}
      <Reveal delay={120}>
        <section className="mt-12 sm:mt-16">
          <div className="flex items-center justify-between">
            <h2 className="text-sm sm:text-lg font-semibold sm:font-bold uppercase tracking-[0.06em] sm:tracking-[0.08em]">
              View Similar Products
            </h2>
            <Link
              href="/products"
              className="text-[10px] sm:text-xs font-semibold sm:font-bold uppercase tracking-wider text-accent hover:underline"
            >
              View All Products &rarr;
            </Link>
          </div>
          <div className="mt-4 sm:mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      </Reveal>
    </div>
  );
}
