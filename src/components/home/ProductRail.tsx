import Link from "next/link";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/product/ProductCard";
import { Reveal } from "@/components/ui/Reveal";

export function ProductRail({
  title,
  products,
  viewAllHref,
}: {
  title: string;
  products: Product[];
  viewAllHref: string;
}) {
  return (
    <section className="mx-auto max-w-[1320px] px-4 py-14 sm:px-6">
      <Reveal>
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-xl font-bold uppercase tracking-[0.08em] text-ink sm:text-2xl">
            {title}
          </h2>
          <Link
            href={viewAllHref}
            className="shrink-0 text-xs font-bold uppercase tracking-wider text-ink underline underline-offset-4 hover:text-accent"
          >
            View All
          </Link>
        </div>
      </Reveal>
      <div className="rail mt-7 flex snap-x gap-4 overflow-x-auto pb-2">
        {products.map((p) => (
          <div key={p.id} className="w-64 shrink-0 snap-start sm:w-72">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
