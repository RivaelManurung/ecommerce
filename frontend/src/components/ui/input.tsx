import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

// Standalone input — render as a sibling of <Label>, never nested inside it
// (the global `label > input` CSS rule would otherwise fight these classes).
export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "flex h-9 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-none transition-colors placeholder:text-gray-400",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/20 focus-visible:border-gray-400",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
