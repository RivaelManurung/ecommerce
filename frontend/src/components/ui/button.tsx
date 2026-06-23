import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

type ButtonVariant =
  | "primary"   // storefront: rose
  | "secondary" // storefront: outlined rose
  | "ghost"     // icon/transparent
  | "default"   // admin: dark/black
  | "outline"   // admin: outlined gray
  | "destructive"; // danger red

type ButtonSize = "default" | "sm" | "icon";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const sizeClasses: Record<ButtonSize, string> = {
  default: "h-9 px-4 text-sm",
  sm: "h-7 px-3 text-xs",
  icon: "h-8 w-8 p-0",
};

export function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50",
        sizeClasses[size],
        // storefront variants
        variant === "primary" && "bg-[#C95F72] text-white hover:bg-[#A9445A]",
        variant === "secondary" && "border border-[#C95F72] bg-white text-[#A9445A] hover:bg-[#FFF1F3]",
        // admin variants (Shadcn style)
        variant === "default" && "bg-gray-900 text-white hover:bg-gray-800",
        variant === "outline" && "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900",
        variant === "ghost" && "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
        variant === "destructive" && "bg-red-600 text-white hover:bg-red-700",
        className,
      )}
      {...props}
    />
  );
}
