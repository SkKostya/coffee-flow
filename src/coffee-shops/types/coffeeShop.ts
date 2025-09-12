// Типы для работы с кофейнями

export interface City {
  id: string;
  name: string;
  nameRu: string;
}

export interface CoffeeShop {
  id: string;
  name: string;
  description: string;
  address: string;
  latitude: string;
  longitude: string;
  phoneNumber: string;
  email: string;
  logoUrl: string;
  bannerUrl: string;
  rating: number;
  reviewCount: number;
  isOpen: boolean;
  openingHours: string;
  isActive: boolean;
  cityId: string;
  createdAt: string;
  updatedAt: string;
  city: City;
}

// Типы для API запросов
export interface NearbyCoffeeShopsParams {
  latitude: number;
  longitude: number;
  radius?: number;
  cityId?: string;
}

export interface CoffeeShopDetailsParams {
  id: string;
}

// Типы для API ответов
export type NearbyCoffeeShopsResponse = CoffeeShop[];
export type CoffeeShopDetailsResponse = CoffeeShop & {
  products: Product[];
};

// Типы для продуктов
export interface ProductCategory {
  id: string;
  name: string;
  nameRu: string;
}

export interface Product {
  id: string;
  name: string;
  nameRu: string;
  description?: string;
  price: number;
  imageUrl?: string;
  isAvailable: boolean;
  sortOrder: number;
  isActive: boolean;
  partnerId: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  category: ProductCategory;
}

export interface ProductsParams {
  id: string;
  categoryId?: string;
  search?: string;
}

export type ProductsResponse = Product[];

// Типы для фильтрации и поиска
export interface CoffeeShopFilters {
  radius: number; // в км
  isOpen?: boolean;
  minRating?: number;
  cityId?: string;
}

export interface CoffeeShopSearchParams {
  query?: string;
  filters?: CoffeeShopFilters;
  location?: {
    latitude: number;
    longitude: number;
  };
}

// Типы для состояния
export interface CoffeeShopState {
  nearby: CoffeeShop[];
  selected: CoffeeShop | null;
  isLoading: boolean;
  error: string | null;
  filters: CoffeeShopFilters;
  searchQuery: string;
}

export interface ProductsState {
  items: Product[];
  isLoading: boolean;
  error: string | null;
  filters: {
    categoryId?: string;
    search?: string;
  };
}
