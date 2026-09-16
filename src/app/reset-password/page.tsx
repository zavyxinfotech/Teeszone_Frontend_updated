import type { Metadata } from "next";
import { Suspense } from "react";
import { ResetPasswordView } from "@/components/auth/ResetPasswordView";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Set a new password for your TeesZone account.",
};

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordView />
    </Suspense>
  );
}
