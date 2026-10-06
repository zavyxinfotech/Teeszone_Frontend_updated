import type { Metadata } from "next";
import Link from "next/link";
import { getNavigation, getProducts } from "@/lib/api";
import { ProductCard } from "@/components/product/ProductCard";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "All Products",
  description:
    "Browse the full TeesZone range — tees, polos, hoodies, bottoms and kidswear, factory-direct from Tiruppur with bulk pricing.",
};

export default async function ProductsPage() {
  const [products, { segments }] = await Promise.all([getProducts(), getNavigation()]);

  return (
    <div className="mx-auto max-w-[1320px] px-4 py-10 sm:px-6 md:py-14">
      <p className="text-xs uppercase tracking-wider text-body">
        <Link href="/" className="hover:text-accent">
          Home
        </Link>{" "}
        / All Products
      </p>
      <h1 className="mt-3 text-3xl font-bold uppercase tracking-tight sm:text-4xl">
        All Products
      </h1>
      <p className="mt-2 max-w-xl text-sm">
        The full TeesZone range. Every piece ships with your branding —
        printed or embroidered in-house.
      </p>

      <div className="mt-7 flex flex-wrap gap-2">
        {segments.map((seg) => (
          <Link
            key={seg.slug}
            href={`/collections/${seg.groups[0].collections[0]}`}
            className="border border-line px-4 py-2 text-xs font-bold uppercase tracking-wider text-ink transition-colors hover:border-ink"
          >
            {seg.name}
          </Link>
        ))}
        <Link
          href="/collections/mega-sale"
          className="border border-accent px-4 py-2 text-xs font-bold uppercase tracking-wider text-accent transition-colors hover:bg-accent hover:text-white"
        >
          Mega Sale
        </Link>
      </div>

      <div className="mt-9 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
