"use client";

import { Minus, Plus } from "lucide-react";

export function QuantityStepper({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="inline-grid grid-cols-3 overflow-hidden rounded-md border border-[#EEE7E2] bg-white">
      <button className="focus-ring grid h-11 w-11 place-items-center" aria-label="Kurangi jumlah" onClick={() => onChange(Math.max(1, value - 1))}>
        <Minus size={16} />
      </button>
      <span className="grid h-11 min-w-12 place-items-center text-sm font-semibold">{value}</span>
      <button className="focus-ring grid h-11 w-11 place-items-center" aria-label="Tambah jumlah" onClick={() => onChange(value + 1)}>
        <Plus size={16} />
      </button>
    </div>
  );
}
