"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";

/**
 * Shadcn-style custom Select component.
 * Drop-in replacement for native <select> with `value` + `onChange` pattern.
 *
 * Usage:
 *   <AdminSelect
 *     value={status}
 *     onChange={(val) => setStatus(val)}
 *     options={[
 *       { value: "", label: "All statuses" },
 *       { value: "draft", label: "Draft" },
 *     ]}
 *   />
 */

export interface SelectOption {
  value: string;
  label: string;
}

interface AdminSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function AdminSelect({
  value,
  onChange,
  options,
  placeholder = "Select…",
  className,
  disabled,
}: AdminSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const selected = options.find((o) => o.value === value);
  const displayLabel = selected ? selected.label : (placeholder);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          "flex h-9 w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-none transition-colors",
          "hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/20 focus-visible:border-gray-400",
          "disabled:cursor-not-allowed disabled:opacity-50",
          open && "ring-2 ring-gray-900/20 border-gray-400",
        )}
      >
        <span className={cn(!selected && value === "" ? "text-gray-500" : "text-gray-900")}>
          {displayLabel}
        </span>
        <ChevronDown
          size={14}
          className={cn("ml-2 shrink-0 text-gray-400 transition-transform duration-150", open && "rotate-180")}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-1.5 w-full min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white shadow-md animate-in fade-in-0 zoom-in-95">
          <div className="max-h-60 overflow-y-auto py-1">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={cn(
                  "relative flex w-full cursor-default select-none items-center rounded-sm px-3 py-1.5 text-sm outline-none transition-colors",
                  option.value === value
                    ? "bg-gray-100 text-gray-900 font-medium"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
                )}
              >
                <span className="flex-1 text-left">{option.label}</span>
                {option.value === value && (
                  <Check size={13} className="ml-2 text-gray-700 shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Legacy-compatible Select — keeps native <select> API for backward compat.
 * Used in forms where controlled <option> children are needed.
 * Still styled to match Shadcn design.
 */
export function Select({
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select
        className={cn(
          "flex h-9 w-full appearance-none rounded-md border border-gray-200 bg-white px-3 pr-9 text-sm text-gray-900 shadow-none transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/20 focus-visible:border-gray-400",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        size={14}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
      />
    </div>
  );
}
