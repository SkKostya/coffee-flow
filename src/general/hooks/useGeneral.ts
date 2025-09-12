import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  selectCategories,
  selectCategoriesSorted,
  selectGeneralError,
  selectGeneralInfo,
  selectGeneralLoading,
} from '../../store/selectors/generalSelectors';
import {
  clearError,
  fetchCategories,
  fetchCategoryById,
  setError,
} from '../../store/slices/generalSlice';

/**
 * Хук для работы с общими данными
 */
export const useGeneral = () => {
  const dispatch = useAppDispatch();

  // Селекторы
  const categories = useAppSelector(selectCategories);
  const categoriesSorted = useAppSelector(selectCategoriesSorted);
  const isLoading = useAppSelector(selectGeneralLoading);
  const error = useAppSelector(selectGeneralError);
  const generalInfo = useAppSelector(selectGeneralInfo);

  // Действия
  const loadCategories = useCallback(async () => {
    try {
      await dispatch(fetchCategories()).unwrap();
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  }, [dispatch]);

  const loadCategoryById = useCallback(
    async (id: string) => {
      try {
        await dispatch(fetchCategoryById(id)).unwrap();
      } catch (err) {
        console.error('Failed to load category:', err);
      }
    },
    [dispatch]
  );

  const clearErrorState = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const setErrorState = useCallback(
    (errorMessage: string) => {
      dispatch(setError(errorMessage));
    },
    [dispatch]
  );

  return {
    // Данные
    categories,
    categoriesSorted,

    // Состояния
    isLoading,
    error,

    // Информация
    generalInfo,

    // Действия
    loadCategories,
    loadCategoryById,
    clearError: clearErrorState,
    setError: setErrorState,
  };
};
