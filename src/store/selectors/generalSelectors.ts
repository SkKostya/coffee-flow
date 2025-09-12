import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../index';

// Базовые селекторы
export const selectGeneralState = (state: RootState) => state.general;
export const selectCategories = (state: RootState) => state.general.categories;
export const selectCities = (state: RootState) => state.general.cities;
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

export const selectActiveCities = createSelector([selectCities], (cities) =>
  cities.filter((city) => city.isActive)
);

export const selectCityById = (id: string) =>
  createSelector([selectCities], (cities) =>
    cities.find((city) => city.id === id)
  );

export const selectGeneralInfo = createSelector(
  [selectCategories, selectCities, selectGeneralLoading, selectGeneralError],
  (categories, cities, isLoading, error) => ({
    hasCategories: categories.length > 0,
    categoriesCount: categories.length,
    activeCategoriesCount: categories.filter((cat) => cat.isActive).length,
    hasCities: cities.length > 0,
    citiesCount: cities.length,
    activeCitiesCount: cities.filter((city) => city.isActive).length,
    isLoading,
    error,
  })
);
