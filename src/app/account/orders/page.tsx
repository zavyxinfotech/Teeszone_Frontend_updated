import type { Metadata } from "next";
import { OrdersView } from "@/components/account/OrdersView";

export const metadata: Metadata = {
  title: "Your Orders | TeesZone",
  description: "View and track your bulk orders and wholesale production status.",
  robots: { index: false },
};

export default function AccountOrdersPage() {
  return <OrdersView />;
}
