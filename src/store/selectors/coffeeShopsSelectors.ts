// Селекторы для кофеен

import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../store';

// Базовые селекторы
export const selectCoffeeShopsState = (state: RootState) => state.coffeeShops;
export const selectProductsState = (state: RootState) => state.products;

// Селекторы для кофеен
export const selectNearbyCoffeeShops = (state: RootState) =>
  state.coffeeShops.nearby;

export const selectSelectedCoffeeShop = (state: RootState) =>
  state.coffeeShops.selected;

export const selectCoffeeShopsLoading = (state: RootState) =>
  state.coffeeShops.isLoading;

export const selectCoffeeShopsError = (state: RootState) =>
  state.coffeeShops.error;

export const selectCoffeeShopsFilters = (state: RootState) =>
  state.coffeeShops.filters;

export const selectCoffeeShopsSearchQuery = (state: RootState) =>
  state.coffeeShops.searchQuery;

// Селекторы для продуктов
export const selectProducts = (state: RootState) => state.products.items;

export const selectProductsLoading = (state: RootState) =>
  state.products.isLoading;

export const selectProductsError = (state: RootState) => state.products.error;

export const selectProductsFilters = (state: RootState) =>
  state.products.filters;

// Мемоизированные селекторы
export const selectFilteredCoffeeShops = createSelector(
  [
    selectNearbyCoffeeShops,
    selectCoffeeShopsSearchQuery,
    selectCoffeeShopsFilters,
  ],
  (coffeeShops, searchQuery, filters) => {
    let filtered = [...coffeeShops];

    // Фильтрация по поисковому запросу
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (shop) =>
          shop.name.toLowerCase().includes(query) ||
          shop.address.toLowerCase().includes(query) ||
          shop.description.toLowerCase().includes(query)
      );
    }

    // Фильтрация по статусу открытости
    if (filters.isOpen !== undefined) {
      filtered = filtered.filter((shop) => shop.isOpen === filters.isOpen);
    }

    // Фильтрация по минимальному рейтингу
    if (filters.minRating !== undefined) {
      filtered = filtered.filter((shop) => shop.rating >= filters.minRating!);
    }

    return filtered;
  }
);

export const selectCoffeeShopsByCity = createSelector(
  [selectNearbyCoffeeShops, selectCoffeeShopsFilters],
  (coffeeShops, filters) => {
    if (!filters.cityId) {
      return coffeeShops;
    }
    return coffeeShops.filter((shop) => shop.cityId === filters.cityId);
  }
);

export const selectCoffeeShopsInfo = createSelector(
  [selectNearbyCoffeeShops, selectCoffeeShopsLoading, selectCoffeeShopsError],
  (coffeeShops, isLoading, error) => ({
    count: coffeeShops.length,
    hasData: coffeeShops.length > 0,
    isLoading,
    error,
  })
);

export const selectProductsInfo = createSelector(
  [selectProducts, selectProductsLoading, selectProductsError],
  (products, isLoading, error) => ({
    count: products.length,
    hasData: products.length > 0,
    isLoading,
    error,
  })
);

// Селектор для получения кофейни по ID
export const selectCoffeeShopById = (id: string) =>
  createSelector(
    [selectNearbyCoffeeShops, selectSelectedCoffeeShop],
    (nearby, selected) => {
      if (selected && selected.id === id) {
        return selected;
      }
      return nearby.find((shop) => shop.id === id) || null;
    }
  );
