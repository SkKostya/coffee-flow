export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
  category: ProductCategory;
  isFavorite?: boolean;
  coffeeShopId: string;
  coffeeShopName: string;
}

export type ProductCategory =
  | 'coffee'
  | 'tea'
  | 'dessert'
  | 'breakfast'
  | 'lunch'
  | 'snack';

export interface ProductFilters {
  category?: ProductCategory;
  priceRange?: {
    min: number;
    max: number;
  };
  coffeeShopId?: string;
  isFavorite?: boolean;
}

export interface FavoriteProduct extends Product {
  addedAt: Date;
}
