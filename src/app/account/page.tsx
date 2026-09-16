import type { Metadata } from "next";
import { AccountDashboard } from "@/components/account/AccountDashboard";

export const metadata: Metadata = {
  title: "Your Account",
  description: "Manage your TeesZone profile, addresses and saved products.",
  robots: { index: false },
};

export default function AccountPage() {
  return <AccountDashboard />;
}
