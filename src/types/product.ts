export type ProductBadge = "Best Seller" | "New" | "Sale";

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  subcategory: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  rating: number;
  reviewCount: number;
  soldCount: number;
  images: string[];
  badge?: ProductBadge;
  shades: { name: string; hex: string }[];
  selectedShade: string;
  skinConcerns: string[];
  finish: string;
  coverage: string;
  ingredients: string[];
  benefits: string[];
  description: string;
  howToUse: string;
  stock: number;
  isNew: boolean;
  isBestSeller: boolean;
  isSale: boolean;
};

export type Category = {
  slug: string;
  name: string;
  description: string;
  image: string;
};
