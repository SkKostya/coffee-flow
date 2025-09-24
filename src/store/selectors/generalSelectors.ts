import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../index';

// Базовые селекторы
export const selectGeneralState = (state: RootState) => state.general;
export const selectCategories = (state: RootState) => state.general.categories;
export const selectCities = (state: RootState) => state.general.cities;
export const selectGeneralUser = (state: RootState) => state.general.user;
export const selectSelectedCity = (state: RootState) =>
  state.general.user.selectedCity;
export const selectUserLocation = (state: RootState) =>
  state.general.user.location;
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

export const selectSelectedCityInfo = createSelector(
  [selectSelectedCity],
  (selectedCity) => ({
    hasSelectedCity: !!selectedCity,
    selectedCityName:
      selectedCity?.nameRu || selectedCity?.name || 'Город не выбран',
    selectedCityId: selectedCity?.id || null,
  })
);

export const selectUserLocationInfo = createSelector(
  [selectUserLocation],
  (location) => ({
    hasLocation: !!location,
    latitude: location?.latitude || null,
    longitude: location?.longitude || null,
    accuracy: location?.accuracy || null,
    timestamp: location?.timestamp || null,
  })
);

export const selectUserInfo = createSelector(
  [selectGeneralUser, selectSelectedCityInfo, selectUserLocationInfo],
  (user, selectedCityInfo, locationInfo) => ({
    ...user,
    selectedCityInfo,
    locationInfo,
  })
);

export const selectGeneralInfo = createSelector(
  [
    selectCategories,
    selectCities,
    selectGeneralUser,
    selectGeneralLoading,
    selectGeneralError,
  ],
  (categories, cities, user, isLoading, error) => ({
    hasCategories: categories.length > 0,
    categoriesCount: categories.length,
    activeCategoriesCount: categories.filter((cat) => cat.isActive).length,
    hasCities: cities.length > 0,
    citiesCount: cities.length,
    activeCitiesCount: cities.filter((city) => city.isActive).length,
    hasSelectedCity: !!user.selectedCity,
    selectedCityName:
      user.selectedCity?.nameRu || user.selectedCity?.name || 'Город не выбран',
    hasLocation: !!user.location,
    isLoading,
    error,
  })
);
