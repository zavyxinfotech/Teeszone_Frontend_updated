import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCollection, getProduct, getProducts, getProductsByCollection } from "@/lib/api";
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
  const product = await getProduct(slug);
  if (!product) notFound();

  const primarySlug = product.collections[0];
  const [primaryCollection, inPrimary, allProducts] = await Promise.all([
    primarySlug ? getCollection(primarySlug) : Promise.resolve(null),
    primarySlug ? getProductsByCollection(primarySlug) : Promise.resolve([]),
    getProducts(),
  ]);
  const related = inPrimary
    .filter((p) => p.id !== product.id)
    .concat(allProducts.filter((p) => !p.collections.includes(primarySlug)))
    .slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: `${site.url}${product.colors[0].image}`,
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
      <p className="mb-6 text-xs uppercase tracking-wider text-body">
        <Link href="/" className="hover:text-accent">
          Home
        </Link>{" "}
        /{" "}
        {primaryCollection && (
          <>
            <Link
              href={`/collections/${primaryCollection.slug}`}
              className="hover:text-accent"
            >
              {primaryCollection.name}
            </Link>{" "}
            /{" "}
          </>
        )}
        {product.name}
      </p>

      <ProductConfigurator product={product} />

      <section className="mt-14 max-w-2xl">
        <h2 className="text-lg font-bold uppercase tracking-[0.08em]">
          Product Details
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

      <FaqAccordion />

      <section className="mt-16">
        <h2 className="text-lg font-bold uppercase tracking-[0.08em]">
          You Might Also Like
        </h2>
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
