import { ProductCard } from "@/components/product/product-card";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";
import { products } from "@/lib/data/products";

export function NewArrivals() {
  const arrivals = products.filter((product) => product.isNew).slice(0, 7);

  return (
    <section className="container-page py-10">
      <SectionHeading eyebrow="Fresh drops" title="New Arrivals" copy="Formula dan warna terbaru untuk rutinitas yang terasa segar." href="/shop?sort=new" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-7">
        {arrivals.map((product) => (
          <Reveal key={product.id}>
            <ProductCard product={product} compact />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
