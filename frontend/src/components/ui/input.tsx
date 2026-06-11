import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

// Standalone input — render as a sibling of <Label>, never nested inside it
// (the global `label > input` CSS rule would otherwise fight these classes).
export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 shadow-sm transition placeholder:text-zinc-400",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900/15 focus-visible:border-zinc-400",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
