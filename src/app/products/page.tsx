import type { Metadata } from "next";
import Link from "next/link";
import { getNavigation, getProducts } from "@/lib/api";
import { ProductCard } from "@/components/product/ProductCard";
import { Reveal } from "@/components/ui/Reveal";

export const revalidate = 0;

const CATEGORY_MAP: Record<
  string,
  { title: string; desc: string; slugs: string[] }
> = {
  "polo-t-shirts": {
    title: "Polo T-Shirts",
    desc: "Customized polo t-shirts with your company logo. Premium combed cotton pique, aerosoft and ecoblend workwear polos.",
    slugs: ["aerosoft-polo-200", "mens-polo-half-sleeve-240", "ecoblend-polo-neck-240"],
  },
  "round-neck-t-shirts": {
    title: "Round Neck T-Shirts",
    desc: "Everyday 100% bio-washed cotton and 4-way stretch lycra round neck t-shirts ready for your custom logo.",
    slugs: ["mens-rn-half-180", "mens-rn-half-200-lycra"],
  },
  "oversize-t-shirts": {
    title: "Oversize T-Shirts",
    desc: "Modern boxy drop-shoulder oversized tees. Heavyweight 240-250 GSM French Terry streetwear styles.",
    slugs: ["mens-oversize-french-terry-240"],
  },
  "with-zip": {
    title: "Hoodies With Zip",
    desc: "Heavyweight 320 GSM cotton-rich brushed fleece full-zip winter hoodies with sturdy metal zippers.",
    slugs: ["hoodie-with-zip-320"],
  },
  "without-zip": {
    title: "Hoodies Without Zip",
    desc: "Classic 320 GSM cotton-rich fleece pullover hoodies with front kangaroo pouch pocket.",
    slugs: ["hoodie-without-zip-320"],
  },
  "unisex-hoodies": {
    title: "Unisex Hoodies",
    desc: "Plush 100% cotton 325 GSM and ultra-heavyweight 360-370 GSM thermal winter fleece unisex hoodies.",
    slugs: ["unisex-hoodie-325", "unisex-hoodie-360"],
  },
  "men": {
    title: "Men's Collection",
    desc: "Explore men's premium polo t-shirts, bio-washed round neck tees, and heavyweight oversize streetwear.",
    slugs: [
      "aerosoft-polo-200",
      "mens-polo-half-sleeve-240",
      "ecoblend-polo-neck-240",
      "mens-rn-half-180",
      "mens-rn-half-200-lycra",
      "mens-oversize-french-terry-240",
    ],
  },
  "hoodies": {
    title: "Hoodies Collection",
    desc: "Plush brushed fleece and heavyweight thermal winter hoodies with custom embroidery and printing.",
    slugs: [
      "hoodie-with-zip-320",
      "hoodie-without-zip-320",
      "unisex-hoodie-325",
      "unisex-hoodie-360",
    ],
  },
  "women": {
    title: "Women's Collection",
    desc: "Flattering tailored feminine fits and premium bio-washed cotton apparel for women.",
    slugs: ["womens-rn-half-180"],
  },
  "kids": {
    title: "Kids Collection",
    desc: "Skin-safe, super-combed durable tees for schools, sports, and kids events.",
    slugs: ["kids-rn-half-180"],
  },
  "eco-biowash": {
    title: "Eco & Biowash Collection",
    desc: "Eco-friendly polycotton ecoblend and bio-enzyme washed lint-free fabrics.",
    slugs: ["ecoblend-rn-180", "biowash-rn-180", "ecoblend-polo-240"],
  },
  "performance-fabrics": {
    title: "Performance Fabrics",
    desc: "Breathable dotknit and nano-poly athletic performance wear.",
    slugs: ["primoknit-polo-200", "aeropiq-polo-210"],
  },
  "organic-collection": {
    title: "Organic Collection",
    desc: "GOTS certified 100% organic cotton luxury polo t-shirts.",
    slugs: ["organic-polo-270", "organic-polo-plain-270"],
  },
  "specialty": {
    title: "Specialty & Fabrics",
    desc: "Eco & biowash fabrics, high-performance athletic dotknit & nano-poly, and certified organic cotton polos.",
    slugs: [
      "ecoblend-rn-180",
      "biowash-rn-180",
      "ecoblend-polo-240",
      "primoknit-polo-200",
      "aeropiq-polo-210",
      "organic-polo-270",
      "organic-polo-plain-270",
    ],
  },
};

// Aliases for user-friendly navigation
CATEGORY_MAP["polo"] = CATEGORY_MAP["polo-t-shirts"];
CATEGORY_MAP["round-neck"] = CATEGORY_MAP["round-neck-t-shirts"];
CATEGORY_MAP["oversize"] = CATEGORY_MAP["oversize-t-shirts"];
CATEGORY_MAP["hoodie"] = CATEGORY_MAP["hoodies"];
CATEGORY_MAP["unisex"] = CATEGORY_MAP["unisex-hoodies"];
CATEGORY_MAP["zip"] = CATEGORY_MAP["with-zip"];
CATEGORY_MAP["withoutzip"] = CATEGORY_MAP["without-zip"];
CATEGORY_MAP["eco"] = CATEGORY_MAP["eco-biowash"];
CATEGORY_MAP["performance"] = CATEGORY_MAP["performance-fabrics"];
CATEGORY_MAP["organic"] = CATEGORY_MAP["organic-collection"];

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: Promise<{ category?: string }>;
}): Promise<Metadata> {
  const sp = searchParams ? await searchParams : {};
  const cat = sp?.category?.toLowerCase();
  if (!cat) return { title: "All Products | TeesZone" };
  const matched = CATEGORY_MAP[cat];
  if (matched) {
    return { title: `${matched.title} | TeesZone` };
  }
  return { title: "Products | TeesZone" };
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams?: Promise<{ category?: string }>;
}) {
  const sp = searchParams ? await searchParams : {};
  const category = sp?.category?.toLowerCase();
  const [allProducts] = await Promise.all([getProducts()]);

  let pageTitle = "All Products";
  let pageDesc = "The full TeesZone range. Every piece ships with your branding — printed or embroidered in-house.";
  let filtered = allProducts;

  if (category) {
    const matched = CATEGORY_MAP[category];
    if (matched) {
      pageTitle = matched.title;
      pageDesc = matched.desc;
      filtered = matched.slugs
        .map((s) => allProducts.find((p) => p.slug === s || p.id === s))
        .filter((p): p is (typeof allProducts)[number] => Boolean(p));
    } else {
      filtered = allProducts.filter((p) =>
        p.collections.includes(category) || p.slug.includes(category)
      );
    }
  }

  const displayProducts = filtered;

  return (
    <div className="mx-auto max-w-[1320px] px-4 py-10 sm:px-6 md:py-14">
      <Reveal>
        <p className="text-xs uppercase tracking-wider text-body">
          <Link href="/" className="hover:text-accent">
            Home
          </Link>{" "}
          /{" "}
          <Link href="/products" className="hover:text-accent">
            Products
          </Link>
          {category && ` / ${pageTitle}`}
        </p>
        <div className="mt-3 flex flex-wrap items-baseline justify-between gap-4">
          <h1 className="text-3xl font-bold uppercase tracking-tight sm:text-4xl">
            {pageTitle}
          </h1>
          <span className="text-xs font-bold uppercase tracking-wider text-accent">
            {displayProducts.length} {displayProducts.length === 1 ? "Product" : "Products"}
          </span>
        </div>
        <p className="mt-2 max-w-xl text-sm text-body">
          {pageDesc}
        </p>

        <div className="mt-7 flex flex-wrap gap-2">
          <Link
            href="/products"
            className={`border px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
              !category
                ? "border-ink bg-ink text-white"
                : "border-line text-ink hover:border-ink"
            }`}
          >
            All Products
          </Link>
          <Link
            href="/products?category=polo-t-shirts"
            className={`border px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
              category === "polo-t-shirts"
                ? "border-ink bg-ink text-white"
                : "border-line text-ink hover:border-ink"
            }`}
          >
            Polo T-Shirts
          </Link>
          <Link
            href="/products?category=round-neck-t-shirts"
            className={`border px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
              category === "round-neck-t-shirts"
                ? "border-ink bg-ink text-white"
                : "border-line text-ink hover:border-ink"
            }`}
          >
            Round Neck
          </Link>
          <Link
            href="/products?category=oversize-t-shirts"
            className={`border px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
              category === "oversize-t-shirts"
                ? "border-ink bg-ink text-white"
                : "border-line text-ink hover:border-ink"
            }`}
          >
            Oversize
          </Link>
          <Link
            href="/products?category=with-zip"
            className={`border px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
              category === "with-zip"
                ? "border-ink bg-ink text-white"
                : "border-line text-ink hover:border-ink"
            }`}
          >
            Hoodies With Zip
          </Link>
          <Link
            href="/products?category=without-zip"
            className={`border px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
              category === "without-zip"
                ? "border-ink bg-ink text-white"
                : "border-line text-ink hover:border-ink"
            }`}
          >
            Hoodies Without Zip
          </Link>
          <Link
            href="/products?category=unisex-hoodies"
            className={`border px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
              category === "unisex-hoodies"
                ? "border-ink bg-ink text-white"
                : "border-line text-ink hover:border-ink"
            }`}
          >
            Unisex Hoodies
          </Link>
        </div>
      </Reveal>

      <Reveal delay={80}>
        <div className="mt-9 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {displayProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </Reveal>
    </div>
  );
}
