import type { Metadata } from "next";
import { AuthPage } from "@/components/auth/auth-page";

export const metadata: Metadata = {
  title: "Masuk | Veloura Beauty",
};

// Storefront (customer) login — uses the Veloura editorial design so it matches
// the rest of the e-katalog. Admin authentication lives separately at
// /admin/login.
export default function LoginPage() {
  return <AuthPage mode="login" />;
}
