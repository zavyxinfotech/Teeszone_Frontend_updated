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
  redirect(`/products/${slug}`);
}
