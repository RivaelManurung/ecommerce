import { formatCurrency } from "@/lib/utils/format-currency";

export function Price({ price, originalPrice }: { price: number; originalPrice?: number }) {
  return (
    <div>
      <p className="text-base font-bold text-[#262626]">{formatCurrency(price)}</p>
      {originalPrice ? <p className="text-xs text-[#9B918A] line-through">{formatCurrency(originalPrice)}</p> : null}
    </div>
  );
}
