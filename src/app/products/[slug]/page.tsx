import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getProduct, getProducts, getNavigation } from "@/lib/api";
import { offPct } from "@/lib/pricing";
import { ProductConfigurator } from "@/components/product/ProductConfigurator";
import { FaqAccordion } from "@/components/product/FaqAccordion";
import { ProductCard } from "@/components/product/ProductCard";
import { Check } from "lucide-react";
import { site } from "@/lib/site";

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

  // Filter 4 similar products (excluding current product)
  const related = allProducts
    .filter((p) => p.id !== product.id)
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
    <div className="mx-auto max-w-[1320px] px-4 py-10 sm:px-6 md:py-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Breadcrumb */}
      <p className="mb-6 text-xs uppercase tracking-wider text-body">
        <Link href="/" className="hover:text-accent">
          Home
        </Link>{" "}
        /{" "}
        <Link href="/products" className="hover:text-accent">
          Products
        </Link>{" "}
        / {product.name}
      </p>

      {/* Main Product Configurator & Details */}
      <ProductConfigurator product={product} />

      {/* Product Details Specs */}
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

      {/* FAQs */}
      <FaqAccordion />


      {/* View Similar Products */}
      <section className="mt-16">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold uppercase tracking-[0.08em]">
            View Similar Products
          </h2>
          <Link
            href="/products"
            className="text-xs font-bold uppercase tracking-wider text-accent hover:underline"
          >
            View All Products &rarr;
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
