import { getPublicProducts } from "@/features/public/api";
import { CatalogCard } from "@/components/catalog/catalog-card";
import { Reveal } from "@/components/shared/reveal";
import { SectionHeading } from "@/components/shared/section-heading";

export async function NewArrivals() {
  let products = [] as Awaited<ReturnType<typeof getPublicProducts>>["data"];
  try {
    // Second page so this row shows different products than "Produk Terbaru".
    products = (await getPublicProducts({ limit: 8, page: 2, sort: "createdAt", order: "desc" })).data;
  } catch {
    return null;
  }
  if (!products.length) return null;

  return (
    <section className="container-page py-10">
      <SectionHeading
        eyebrow="Jangan lewatkan"
        title="Jelajahi Lainnya"
        copy="Lebih banyak pilihan produk untuk melengkapi kebutuhanmu."
        href="/catalog"
      />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {products.slice(0, 8).map((product) => (
          <Reveal key={product.id}>
            <CatalogCard product={product} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
