// Хук для работы с общими данными

import { useCallback } from 'react';
import {
  selectActiveCategories,
  selectActiveCities,
  selectCategories,
  selectCities,
  selectGeneralError,
  selectGeneralInfo,
  selectGeneralLoading,
} from '../selectors/generalSelectors';
import {
  clearError,
  fetchCategories,
  fetchCities,
} from '../slices/generalSlice';
import { useAppDispatch, useAppSelector } from './';

/**
 * Хук для работы с общими данными (категории, города)
 */
export const useGeneral = () => {
  const dispatch = useAppDispatch();

  // Селекторы
  const categories = useAppSelector(selectCategories);
  const cities = useAppSelector(selectCities);
  const isLoading = useAppSelector(selectGeneralLoading);
  const error = useAppSelector(selectGeneralError);
  const activeCategories = useAppSelector(selectActiveCategories);
  const activeCities = useAppSelector(selectActiveCities);
  const info = useAppSelector(selectGeneralInfo);

  // Действия
  const loadCategories = useCallback(async () => {
    try {
      await dispatch(fetchCategories()).unwrap();
    } catch (err) {
      console.error('Failed to load categories:', err);
      throw err;
    }
  }, [dispatch]);

  const loadCities = useCallback(async () => {
    try {
      await dispatch(fetchCities()).unwrap();
    } catch (err) {
      console.error('Failed to load cities:', err);
      throw err;
    }
  }, [dispatch]);

  const clearErrorState = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    // Данные
    categories,
    cities,
    activeCategories,
    activeCities,
    isLoading,
    error,
    info,

    // Действия
    loadCategories,
    loadCities,
    clearError: clearErrorState,
  };
};
