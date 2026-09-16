import { getProducts } from "@/lib/api";
import { WishlistView } from "@/components/wishlist/WishlistView";

export const revalidate = 300;

export default async function WishlistPage() {
  const products = await getProducts();
  return <WishlistView products={products} />;
}
