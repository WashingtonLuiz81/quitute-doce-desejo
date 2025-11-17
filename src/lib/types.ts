export type Product = {
  id: string;
  name: string;
  price: number;
  unit: string;
  category: string;
  imageUrl: string;
  description?: string;
  badge?: string;
};

export type BundleItem = {
  productId: string;
  qty: number;
};

export type Bundle = {
  id: string;
  name: string;
  price: number;
  image: string;
  items: BundleItem[];
  tags?: string[];
  available: boolean;
};
