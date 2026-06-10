import type { Product } from "@/types/product";
import { ProductCard } from "./product-card";

export function ProductCarousel({ products }: { products: Product[] }) {
  return (
    <div className="hide-scrollbar grid auto-cols-[220px] grid-flow-col gap-4 overflow-x-auto pb-2 md:auto-cols-[240px]">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} compact />
      ))}
    </div>
  );
}
