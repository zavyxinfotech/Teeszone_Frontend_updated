import type { Metadata } from "next";
import { SecurityView } from "@/components/account/SecurityView";

export const metadata: Metadata = {
  title: "Login & Security",
  description: "Manage your TeesZone sign-in details.",
  robots: { index: false },
};

export default function SecurityPage() {
  return <SecurityView />;
}
