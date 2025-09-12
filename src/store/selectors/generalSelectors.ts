import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../index';

// Базовые селекторы
export const selectGeneralState = (state: RootState) => state.general;
export const selectCategories = (state: RootState) => state.general.categories;
export const selectGeneralLoading = (state: RootState) =>
  state.general.isLoading;
export const selectGeneralError = (state: RootState) => state.general.error;

// Мемоизированные селекторы
export const selectActiveCategories = createSelector(
  [selectCategories],
  (categories) => categories.filter((category) => category.isActive)
);

export const selectCategoriesSorted = createSelector(
  [selectActiveCategories],
  (categories) => [...categories].sort((a, b) => a.sortOrder - b.sortOrder)
);

export const selectCategoryById = (id: string) =>
  createSelector([selectCategories], (categories) =>
    categories.find((category) => category.id === id)
  );

export const selectGeneralInfo = createSelector(
  [selectCategories, selectGeneralLoading, selectGeneralError],
  (categories, isLoading, error) => ({
    hasCategories: categories.length > 0,
    categoriesCount: categories.length,
    activeCategoriesCount: categories.filter((cat) => cat.isActive).length,
    isLoading,
    error,
  })
);
