import { products } from "@/lib/data/products";
import { ProductCarousel } from "@/components/product/product-carousel";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";

export function BestSellerSection() {
  const bestSellers = products.filter((product) => product.isBestSeller).slice(0, 7);

  return (
    <section className="container-page py-10">
      <SectionHeading eyebrow="Loved this week" title="Best Selling Items" copy="Produk yang paling sering masuk keranjang minggu ini." href="/shop" />
      <Reveal>
        <ProductCarousel products={bestSellers} />
      </Reveal>
    </section>
  );
}
