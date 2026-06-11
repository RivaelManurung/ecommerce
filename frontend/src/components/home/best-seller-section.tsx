import { getPublicProducts } from "@/features/public/api";
import { CatalogCard } from "@/components/catalog/catalog-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";

export async function BestSellerSection() {
  let products = [] as Awaited<ReturnType<typeof getPublicProducts>>["data"];
  try {
    products = (await getPublicProducts({ limit: 8, sort: "createdAt", order: "desc" })).data;
  } catch {
    return null;
  }
  if (!products.length) return null;

  return (
    <section className="container-page py-10">
      <SectionHeading
        eyebrow="Pilihan minggu ini"
        title="Produk Terbaru"
        copy="Koleksi terbaru yang baru saja masuk ke katalog kami."
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
