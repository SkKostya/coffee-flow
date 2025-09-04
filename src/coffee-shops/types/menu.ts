import type { Product } from '../../shared/types';

export interface MenuProduct extends Product {
  isAvailable: boolean;
  categoryId: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  products: MenuProduct[];
  order: number; // для сортировки категорий
}

export interface MenuSection {
  category: ProductCategory;
  isVisible: boolean;
}

export interface SearchState {
  query: string;
  isActive: boolean;
  filteredProducts: MenuProduct[];
}
