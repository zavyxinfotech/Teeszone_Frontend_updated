import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCollections, getCollection, getNavigation, getProductsByCollection } from "@/lib/api";
import { ProductCard } from "@/components/product/ProductCard";

export const revalidate = 300;

export async function generateStaticParams() {
  const collections = await getCollections();
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const col = await getCollection(slug);
  if (!col) return {};
  return { title: col.name, description: col.description };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [col, items, { segments, collections }] = await Promise.all([
    getCollection(slug),
    getProductsByCollection(slug),
    getNavigation(),
  ]);
  if (!col) notFound();

  const collectionBySlug = new Map(collections.map((c) => [c.slug, c]));
  // sibling collections within the same segment for the chip row
  const segment = segments.find((s) =>
    s.groups.some((g) => g.collections.includes(slug)),
  );
  const siblings = segment
    ? segment.groups.flatMap((g) => g.collections)
    : collections.filter((c) => c.segment === "shop-more").map((c) => c.slug);

  return (
    <div className="mx-auto max-w-[1320px] px-4 py-10 sm:px-6 md:py-14">
      <p className="text-xs uppercase tracking-wider text-body">
        <Link href="/" className="hover:text-accent">
          Home
        </Link>{" "}
        / {segment ? `${segment.name} / ` : ""}
        {col.name}
      </p>
      <h1 className="mt-3 text-3xl font-bold uppercase tracking-tight sm:text-4xl">
        {col.name}
      </h1>
      <p className="mt-2 max-w-xl text-sm">{col.description}</p>

      {siblings.length > 1 && (
        <div className="mt-7 flex flex-wrap gap-2">
          {siblings.map((s) => {
            const sc = collectionBySlug.get(s);
            if (!sc) return null;
            return (
              <Link
                key={s}
                href={`/collections/${s}`}
                className={`border px-4 py-2 text-xs  uppercase tracking-wider transition-colors ${
                  s === slug
                    ? "border-ink bg-ink text-white"
                    : "border-line text-ink hover:border-ink"
                }`}
              >
                {sc.name}
              </Link>
            );
          })}
        </div>
      )}

      {items.length > 0 ? (
        <div className="mt-9 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="mt-14 border border-dashed border-line p-10 text-center">
          <p className="text-sm">
            This range is being added — enquire on WhatsApp for availability.
          </p>
        </div>
      )}
    </div>
  );
}
