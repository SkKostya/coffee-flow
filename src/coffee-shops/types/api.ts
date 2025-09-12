// API типы для модуля coffee-shops

import type {
  CoffeeShop,
  CoffeeShopDetailsParams,
  CoffeeShopDetailsResponse,
  NearbyCoffeeShopsParams,
  NearbyCoffeeShopsResponse,
  ProductsParams,
  ProductsResponse,
} from './coffeeShop';

// Базовые типы для API запросов
export interface CoffeeShopsApiEndpoints {
  getNearby: (
    params: NearbyCoffeeShopsParams
  ) => Promise<NearbyCoffeeShopsResponse>;
  getById: (
    params: CoffeeShopDetailsParams
  ) => Promise<CoffeeShopDetailsResponse>;
  getProducts: (params: ProductsParams) => Promise<ProductsResponse>;
}

// Типы для ошибок API
export interface CoffeeShopsApiError {
  message: string;
  code?: string;
  status?: number;
}

// Типы для конфигурации API
export interface CoffeeShopsApiConfig {
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
}

// Типы для кэширования (если понадобится в будущем)
export interface CoffeeShopsCache {
  nearby: {
    data: CoffeeShop[];
    timestamp: number;
    ttl: number; // time to live в миллисекундах
  };
  selected: {
    data: CoffeeShop | null;
    timestamp: number;
    ttl: number;
  };
  products: {
    data: Record<string, any>; // key - coffeeShopId, value - products
    timestamp: number;
    ttl: number;
  };
}

// Типы для хуков
export interface UseCoffeeShopsReturn {
  nearby: CoffeeShop[];
  selected: CoffeeShop | null;
  isLoading: boolean;
  error: string | null;
  loadNearby: (params: NearbyCoffeeShopsParams) => Promise<void>;
  loadById: (id: string) => Promise<void>;
  clearError: () => void;
  setFilters: (filters: Partial<NearbyCoffeeShopsParams>) => void;
}

export interface UseProductsReturn {
  products: any[];
  isLoading: boolean;
  error: string | null;
  loadProducts: (params: ProductsParams) => Promise<void>;
  clearError: () => void;
  setFilters: (filters: Partial<ProductsParams>) => void;
}
