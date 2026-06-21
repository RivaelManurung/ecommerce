import type { Metadata } from "next";
import { ResetPasswordView } from "@/components/auth/reset-password-view";

export const metadata: Metadata = {
  title: "Reset Password | Veloura Beauty",
};

export default function ResetPasswordPage() {
  return <ResetPasswordView />;
}
