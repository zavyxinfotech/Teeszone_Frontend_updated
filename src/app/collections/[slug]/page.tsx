import { redirect } from "next/navigation";

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (slug === "new-arrival" || slug === "new-arrivals" || slug === "best-sellers" || slug === "mega-sale") {
    redirect("/products");
  }
  if (slug.includes("polo")) {
    redirect("/products?category=polo-t-shirts");
  }
  if (slug.includes("oversize")) {
    redirect("/products?category=oversize-t-shirts");
  }
  if (slug.includes("rn-") || slug.includes("round-neck")) {
    redirect("/products?category=round-neck-t-shirts");
  }
  if (slug.includes("hoodie") || slug.includes("zip")) {
    redirect("/products?category=with-zip");
  }
  redirect(`/products/${slug}`);
}
