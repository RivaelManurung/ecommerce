"use client";

import { cn } from "@/lib/utils/cn";

export function ShadeSelector({
  shades,
  selected,
  onSelect,
}: {
  shades: { name: string; hex: string }[];
  selected: string;
  onSelect: (shade: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-4">
      {shades.map((shade) => (
        <button
          key={shade.name}
          className="focus-ring flex w-20 flex-col items-center gap-2 text-xs text-[#737373]"
          onClick={() => onSelect(shade.name)}
          type="button"
        >
          <span
            className={cn(
              "h-12 w-12 rounded-full border border-[#EEE7E2]",
              selected === shade.name && "ring-2 ring-[#C95F72] ring-offset-4 ring-offset-[#FFFDF9]",
            )}
            style={{ backgroundColor: shade.hex }}
          />
          {shade.name}
        </button>
      ))}
    </div>
  );
}
