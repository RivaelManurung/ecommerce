import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-5 text-sm font-semibold transition",
        variant === "primary" && "bg-[#C95F72] text-white hover:bg-[#A9445A]",
        variant === "secondary" && "border border-[#C95F72] bg-white text-[#A9445A] hover:bg-[#FFF1F3]",
        variant === "ghost" && "text-[#262626] hover:bg-[#F8DDE2]/45",
        className,
      )}
      {...props}
    />
  );
}
