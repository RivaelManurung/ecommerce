import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export type BadgeVariant = "default" | "success" | "warning" | "danger" | "outline" | "secondary";
export type BadgeTone = "neutral" | "green" | "amber" | "red" | "blue";

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-gray-900 text-white border-transparent",
  secondary: "bg-gray-100 text-gray-700 border-gray-200",
  success: "bg-green-50 text-green-700 border-green-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
  danger: "bg-red-50 text-red-700 border-red-200",
  outline: "bg-transparent text-gray-700 border-gray-300",
};

// Legacy tone support
const tones: Record<BadgeTone, string> = {
  neutral: "bg-gray-100 text-gray-600 border-gray-200",
  green: "bg-green-50 text-green-700 border-green-200",
  amber: "bg-amber-50 text-amber-700 border-amber-200",
  red: "bg-red-50 text-red-700 border-red-200",
  blue: "bg-blue-50 text-blue-700 border-blue-200",
};

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
  tone?: BadgeTone;
};

export function Badge({ variant, tone = "neutral", className, ...props }: BadgeProps) {
  const cls = variant ? variantClasses[variant] : tones[tone];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium",
        cls,
        className,
      )}
      {...props}
    />
  );
}
