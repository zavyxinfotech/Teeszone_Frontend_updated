import { getProducts } from "@/lib/api";
import { CartView } from "@/components/cart/CartView";

export const revalidate = 300;

export default async function CartPage() {
  const products = await getProducts();
  return <CartView products={products} />;
}
