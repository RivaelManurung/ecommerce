import type { Metadata } from "next";
import { LoginForm } from "@/features/auth/login-form";

export const metadata: Metadata = {
  title: "Admin Sign In | E-Katalog",
};

// Admin authentication, connected to the backend POST /auth/login.
// Lives outside the (console) route group so it is NOT wrapped by AdminShell
// (which would auth-gate it and loop). The proxy sends unauthenticated
// /admin/* visitors here.
export default function AdminLoginPage() {
  return <LoginForm />;
}
