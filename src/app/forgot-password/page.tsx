import type { Metadata } from "next";
import { ForgotPasswordView } from "@/components/auth/ForgotPasswordView";

export const metadata: Metadata = {
  title: "Password Assistance",
  description: "Reset your TeesZone account password.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordView />;
}
