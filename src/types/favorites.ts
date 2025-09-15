// Типы для модуля избранного

export type FavoriteType = 'product' | 'order';

export interface Favorite {
  id: string;
  type: FavoriteType;
  clientId: string;
  productId?: string;
  orderId?: string;
  createdAt: string;
  product?: FavoriteProduct;
  order?: FavoriteOrder;
}

export interface FavoriteProduct {
  id: string;
  name: string;
  nameRu: string;
  price: number;
  imageUrl: string;
  partner: {
    id: string;
    name: string;
  };
}

export interface FavoriteOrder {
  id: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
  partner: {
    id: string;
    name: string;
  };
}

// API запросы
export interface GetFavoritesParams {
  type?: FavoriteType;
}

export interface AddProductToFavoritesResponse {
  id: string;
  type: 'product';
  clientId: string;
  productId: string;
  createdAt: string;
}

export interface AddOrderToFavoritesResponse {
  id: string;
  type: 'order';
  clientId: string;
  orderId: string;
  createdAt: string;
}

// Redux состояние
export interface FavoritesState {
  favorites: Favorite[];
  isLoading: boolean;
  error: string | null;
  lastFetchTime: number | null;
}

// Утилиты для работы с избранным
export interface FavoriteProductWithShop extends FavoriteProduct {
  coffeeShopId: string;
  coffeeShopName: string;
  isFavorite: boolean;
}

export interface FavoriteOrderWithShop extends FavoriteOrder {
  coffeeShopId: string;
  coffeeShopName: string;
  coffeeShopAddress: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  createdAt: Date;
  updatedAt: Date;
}
