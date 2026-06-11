import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

// Storefront variants (primary/secondary/ghost) keep the rose theme.
// Neutral variants (default/outline/destructive) are the shadcn-style admin set.
type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "default"
  | "outline"
  | "destructive";

type ButtonSize = "default" | "sm" | "icon";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const sizeClasses: Record<ButtonSize, string> = {
  default: "min-h-10 px-4 text-sm",
  sm: "min-h-8 px-3 text-xs",
  icon: "h-9 w-9",
};

export function Button({
  className,
  variant = "primary",
  size = "default",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "focus-ring inline-flex items-center justify-center gap-2 rounded-md font-semibold transition disabled:pointer-events-none disabled:opacity-50",
        sizeClasses[size],
        size === "default" && "min-h-11",
        // storefront
        variant === "primary" && "min-h-11 px-5 bg-[#C95F72] text-white hover:bg-[#A9445A]",
        variant === "secondary" &&
          "min-h-11 px-5 border border-[#C95F72] bg-white text-[#A9445A] hover:bg-[#FFF1F3]",
        variant === "ghost" && "text-zinc-700 hover:bg-zinc-100",
        // admin / neutral
        variant === "default" && "bg-zinc-900 text-zinc-50 hover:bg-zinc-800",
        variant === "outline" &&
          "border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50",
        variant === "destructive" && "bg-red-600 text-white hover:bg-red-700",
        className,
      )}
      {...props}
    />
  );
}
