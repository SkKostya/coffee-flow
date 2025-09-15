import { createSelector } from '@reduxjs/toolkit';
import type {
  FavoriteOrderWithShop,
  FavoriteProductWithShop,
  FavoriteType,
} from '../../types';
import type { RootState } from '../store';

// Базовые селекторы
export const selectFavoritesState = (state: RootState) => state.favorites;

export const selectFavorites = (state: RootState) => state.favorites.favorites;

export const selectFavoritesLoading = (state: RootState) =>
  state.favorites.isLoading;

export const selectFavoritesError = (state: RootState) => state.favorites.error;

export const selectFavoritesLastFetchTime = (state: RootState) =>
  state.favorites.lastFetchTime;

// Селекторы для фильтрации по типу
export const selectFavoritesByType = (type: FavoriteType) =>
  createSelector([selectFavorites], (favorites) =>
    favorites.filter((favorite) => favorite.type === type)
  );

export const selectFavoriteProducts = createSelector(
  [selectFavorites],
  (favorites) => favorites.filter((favorite) => favorite.type === 'product')
);

export const selectFavoriteOrders = createSelector(
  [selectFavorites],
  (favorites) => favorites.filter((favorite) => favorite.type === 'order')
);

// Селекторы для продуктов с дополнительной информацией
export const selectFavoriteProductsWithShop = createSelector(
  [selectFavoriteProducts],
  (favoriteProducts): FavoriteProductWithShop[] =>
    favoriteProducts
      .filter((fav) => fav.product)
      .map((fav) => ({
        ...fav.product!,
        coffeeShopId: fav.product!.partner.id,
        coffeeShopName: fav.product!.partner.name,
        isFavorite: true,
      }))
);

// Селекторы для заказов с дополнительной информацией
export const selectFavoriteOrdersWithShop = createSelector(
  [selectFavoriteOrders],
  (favoriteOrders): FavoriteOrderWithShop[] =>
    favoriteOrders
      .filter((fav) => fav.order)
      .map((fav) => ({
        ...fav.order!,
        coffeeShopId: fav.order!.partner.id,
        coffeeShopName: fav.order!.partner.name,
        coffeeShopAddress: '', // Нужно будет получать из API кофеен
        items: [], // Нужно будет получать из API заказов
        createdAt: new Date(fav.createdAt),
        updatedAt: new Date(fav.createdAt),
      }))
);

// Селекторы для группировки по кофейням
export const selectFavoriteProductsByShop = createSelector(
  [selectFavoriteProductsWithShop],
  (products) => {
    const groupedByShop = products.reduce((acc, product) => {
      const shopId = product.coffeeShopId;
      if (!acc[shopId]) {
        acc[shopId] = {
          shopId,
          shopName: product.coffeeShopName,
          products: [],
        };
      }
      acc[shopId].products.push(product);
      return acc;
    }, {} as Record<string, { shopId: string; shopName: string; products: FavoriteProductWithShop[] }>);

    return Object.values(groupedByShop);
  }
);

// Селекторы для проверки статуса избранного
export const selectIsProductFavorite = (productId: string) =>
  createSelector([selectFavoriteProducts], (favoriteProducts) =>
    favoriteProducts.some((fav) => fav.productId === productId)
  );

export const selectIsOrderFavorite = (orderId: string) =>
  createSelector([selectFavoriteOrders], (favoriteOrders) =>
    favoriteOrders.some((fav) => fav.orderId === orderId)
  );

// Селекторы для статистики
export const selectFavoritesStats = createSelector(
  [selectFavorites],
  (favorites) => ({
    total: favorites.length,
    products: favorites.filter((fav) => fav.type === 'product').length,
    orders: favorites.filter((fav) => fav.type === 'order').length,
  })
);

// Селекторы для проверки состояния загрузки
export const selectIsFavoritesEmpty = createSelector(
  [selectFavorites],
  (favorites) => favorites.length === 0
);

export const selectHasFavoritesData = createSelector(
  [selectFavorites, selectFavoritesLoading],
  (favorites, isLoading) => favorites.length > 0 && !isLoading
);

// Мемоизированные селекторы для оптимизации
export const selectFavoritesInfo = createSelector(
  [
    selectFavorites,
    selectFavoritesLoading,
    selectFavoritesError,
    selectFavoritesLastFetchTime,
  ],
  (favorites, isLoading, error, lastFetchTime) => ({
    favorites,
    isLoading,
    error,
    lastFetchTime,
    isEmpty: favorites.length === 0,
    hasData: favorites.length > 0,
  })
);
