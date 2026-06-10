import type { Product } from "@/types/product";

export type ProductFilters = {
  query?: string;
  category?: string;
  concern?: string;
  finish?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  sort?: string;
};

export function filterProducts(products: Product[], filters: ProductFilters) {
  const query = filters.query?.trim().toLowerCase();

  const filtered = products.filter((product) => {
    const matchesQuery =
      !query ||
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      product.subcategory.toLowerCase().includes(query) ||
      product.skinConcerns.some((concern) => concern.toLowerCase().includes(query));
    const matchesCategory = !filters.category || product.category === filters.category;
    const matchesConcern = !filters.concern || product.skinConcerns.includes(filters.concern);
    const matchesFinish = !filters.finish || product.finish === filters.finish;
    const matchesMin = !filters.minPrice || product.price >= filters.minPrice;
    const matchesMax = !filters.maxPrice || product.price <= filters.maxPrice;
    const matchesRating = !filters.rating || product.rating >= filters.rating;

    return (
      matchesQuery &&
      matchesCategory &&
      matchesConcern &&
      matchesFinish &&
      matchesMin &&
      matchesMax &&
      matchesRating
    );
  });

  return filtered.sort((a, b) => {
    switch (filters.sort) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "new":
        return Number(b.isNew) - Number(a.isNew);
      case "rating":
        return b.rating - a.rating;
      default:
        return b.soldCount - a.soldCount;
    }
  });
}
