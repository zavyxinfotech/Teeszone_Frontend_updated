import type { Metadata } from "next";
import { Suspense } from "react";
import { RegisterView } from "@/components/auth/RegisterView";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create your TeesZone account with email and password or Google.",
};

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterView />
    </Suspense>
  );
}
