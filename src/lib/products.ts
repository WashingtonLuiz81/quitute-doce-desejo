import productsData from "@/data/products.json";
import promotionsData from "@/data/promotions.json";
import type { Product, Bundle } from "./types";

export function listProducts(): Product[] {
  return (productsData as Product[]).filter((p) => p.price > 0);
}

export function listBundles(): Bundle[] {
  return (promotionsData as any).bundles || [];
}
