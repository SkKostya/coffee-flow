// Хук для работы с продуктами кофеен

import { useCallback } from 'react';
import type { ProductsParams } from '../../coffee-shops/types';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
  selectProducts,
  selectProductsError,
  selectProductsFilters,
  selectProductsInfo,
  selectProductsLoading,
} from '../selectors/coffeeShopsSelectors';
import {
  clearError,
  clearFilters,
  clearProducts,
  fetchProducts,
  resetState,
  setFilters,
} from '../slices/productsSlice';

/**
 * Хук для работы с продуктами кофеен
 */
export const useProducts = () => {
  const dispatch = useAppDispatch();

  // Селекторы
  const products = useAppSelector(selectProducts);
  const isLoading = useAppSelector(selectProductsLoading);
  const error = useAppSelector(selectProductsError);
  const filters = useAppSelector(selectProductsFilters);
  const info = useAppSelector(selectProductsInfo);

  // Действия
  const loadProducts = useCallback(
    async (params: ProductsParams) => {
      try {
        await dispatch(fetchProducts(params)).unwrap();
      } catch (err) {
        console.error('Failed to load products:', err);
        throw err;
      }
    },
    [dispatch]
  );

  const clearErrorState = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const updateFilters = useCallback(
    (newFilters: Partial<ProductsParams>) => {
      dispatch(setFilters(newFilters));
    },
    [dispatch]
  );

  const clearFiltersState = useCallback(() => {
    dispatch(clearFilters());
  }, [dispatch]);

  const clearProductsList = useCallback(() => {
    dispatch(clearProducts());
  }, [dispatch]);

  const reset = useCallback(() => {
    dispatch(resetState());
  }, [dispatch]);

  return {
    // Данные
    products,
    isLoading,
    error,
    filters,
    info,

    // Действия
    loadProducts,
    clearError: clearErrorState,
    setFilters: updateFilters,
    clearFilters: clearFiltersState,
    clearProducts: clearProductsList,
    reset,
  };
};
