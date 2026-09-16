import type { Metadata } from "next";
import { AddressesView } from "@/components/account/AddressesView";

export const metadata: Metadata = {
  title: "Your Addresses",
  description: "Manage your TeesZone delivery addresses.",
  robots: { index: false },
};

export default function AddressesPage() {
  return <AddressesView />;
}
