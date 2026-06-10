import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductListing } from "@/components/product/product-listing";
import { categories } from "@/lib/data/categories";
import { products } from "@/lib/data/products";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = categories.find((item) => item.slug === slug);
  return {
    title: category ? `${category.name} | Veloura Beauty` : "Category | Veloura Beauty",
    description: category?.description,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = categories.find((item) => item.slug === slug);
  if (!category) notFound();
  return <ProductListing products={products} title={`${category.name} Collection`} subtitle={category.description} category={slug} />;
}
