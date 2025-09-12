import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../index';

// Базовые селекторы
export const selectCitiesState = (state: RootState) => state.cities;

export const selectCities = (state: RootState) => state.cities.cities;
export const selectSelectedCity = (state: RootState) =>
  state.cities.selectedCity;
export const selectSearchResults = (state: RootState) =>
  state.cities.searchResults;
export const selectSearchQuery = (state: RootState) => state.cities.searchQuery;
export const selectCitiesLoading = (state: RootState) => state.cities.isLoading;
export const selectCitiesSearching = (state: RootState) =>
  state.cities.isSearching;
export const selectCitiesError = (state: RootState) => state.cities.error;

// Мемоизированные селекторы
export const selectActiveCities = createSelector([selectCities], (cities) =>
  cities.filter((city) => city.isActive)
);

export const selectCitiesForDisplay = createSelector(
  [selectCities, selectSearchResults, selectSearchQuery],
  (cities, searchResults, searchQuery) => {
    if (searchQuery.trim()) {
      return searchResults;
    }
    return cities;
  }
);

export const selectCitiesInfo = createSelector(
  [selectCities, selectSelectedCity, selectCitiesLoading, selectCitiesError],
  (cities, selectedCity, isLoading, error) => ({
    hasCities: cities.length > 0,
    hasSelectedCity: !!selectedCity,
    isLoading,
    error,
    citiesCount: cities.length,
  })
);

export const selectSearchInfo = createSelector(
  [
    selectSearchResults,
    selectSearchQuery,
    selectCitiesSearching,
    selectCitiesError,
  ],
  (searchResults, searchQuery, isSearching, error) => ({
    hasSearchQuery: searchQuery.trim().length > 0,
    hasSearchResults: searchResults.length > 0,
    isSearching,
    error,
    resultsCount: searchResults.length,
  })
);

export const selectCityById = createSelector(
  [selectCities, (_: RootState, cityId: string) => cityId],
  (cities, cityId) => cities.find((city) => city.id === cityId)
);

export const selectSelectedCityInfo = createSelector(
  [selectSelectedCity],
  (selectedCity) => ({
    hasSelectedCity: !!selectedCity,
    selectedCityName: selectedCity?.nameRu || selectedCity?.name || 'Не выбран',
    selectedCityId: selectedCity?.id || null,
  })
);
