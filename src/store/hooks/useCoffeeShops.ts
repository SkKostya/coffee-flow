// Хук для работы с кофейнями

import { useCallback } from 'react';
import type {
  CoffeeShop,
  CoffeeShopDetailsParams,
  CoffeeShopFilters,
  NearbyCoffeeShopsParams,
} from '../../coffee-shops/types';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
  selectCoffeeShopsError,
  selectCoffeeShopsFilters,
  selectCoffeeShopsInfo,
  selectCoffeeShopsLoading,
  selectCoffeeShopsSearchQuery,
  selectFilteredCoffeeShops,
  selectNearbyCoffeeShops,
  selectSelectedCoffeeShop,
} from '../selectors/coffeeShopsSelectors';
import {
  clearError,
  clearNearbyCoffeeShops,
  clearSearchQuery,
  clearSelectedCoffeeShop,
  fetchCoffeeShopById,
  fetchNearbyCoffeeShops,
  resetState,
  setFilters,
  setSearchQuery,
  setSelectedCoffeeShop,
} from '../slices/coffeeShopsSlice';

/**
 * Хук для работы с кофейнями
 */
export const useCoffeeShops = () => {
  const dispatch = useAppDispatch();

  // Селекторы
  const nearby = useAppSelector(selectNearbyCoffeeShops);
  const selected = useAppSelector(selectSelectedCoffeeShop);
  const isLoading = useAppSelector(selectCoffeeShopsLoading);
  const error = useAppSelector(selectCoffeeShopsError);
  const filters = useAppSelector(selectCoffeeShopsFilters);
  const searchQuery = useAppSelector(selectCoffeeShopsSearchQuery);
  const filtered = useAppSelector(selectFilteredCoffeeShops);
  const info = useAppSelector(selectCoffeeShopsInfo);

  // Действия
  const loadNearby = useCallback(
    async (params: NearbyCoffeeShopsParams) => {
      try {
        await dispatch(fetchNearbyCoffeeShops(params)).unwrap();
      } catch (err) {
        console.error('Failed to load nearby coffee shops:', err);
        throw err;
      }
    },
    [dispatch]
  );

  const loadById = useCallback(
    async (params: CoffeeShopDetailsParams) => {
      try {
        await dispatch(fetchCoffeeShopById(params)).unwrap();
      } catch (err) {
        console.error('Failed to load coffee shop by id:', err);
        throw err;
      }
    },
    [dispatch]
  );

  const clearErrorState = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const updateFilters = useCallback(
    (newFilters: Partial<CoffeeShopFilters>) => {
      dispatch(setFilters(newFilters));
    },
    [dispatch]
  );

  const updateSearchQuery = useCallback(
    (query: string) => {
      dispatch(setSearchQuery(query));
    },
    [dispatch]
  );

  const clearSearch = useCallback(() => {
    dispatch(clearSearchQuery());
  }, [dispatch]);

  const selectCoffeeShop = useCallback(
    (coffeeShop: CoffeeShop | null) => {
      dispatch(setSelectedCoffeeShop(coffeeShop));
    },
    [dispatch]
  );

  const clearSelected = useCallback(() => {
    dispatch(clearSelectedCoffeeShop());
  }, [dispatch]);

  const clearNearby = useCallback(() => {
    dispatch(clearNearbyCoffeeShops());
  }, [dispatch]);

  const reset = useCallback(() => {
    dispatch(resetState());
  }, [dispatch]);

  return {
    // Данные
    nearby,
    selected,
    filtered,
    isLoading,
    error,
    filters,
    searchQuery,
    info,

    // Действия
    loadNearby,
    loadById,
    clearError: clearErrorState,
    setFilters: updateFilters,
    setSearchQuery: updateSearchQuery,
    clearSearch,
    selectCoffeeShop,
    clearSelected,
    clearNearby,
    reset,
  };
};
