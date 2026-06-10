import type { Product } from "./product";

export type CartItem = {
  product: Product;
  shade: string;
  quantity: number;
};
