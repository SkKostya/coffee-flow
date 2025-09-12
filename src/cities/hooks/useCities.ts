import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  selectCities,
  selectCitiesError,
  selectCitiesForDisplay,
  selectCitiesInfo,
  selectCitiesLoading,
  selectCitiesSearching,
  selectSearchInfo,
  selectSearchQuery,
  selectSearchResults,
  selectSelectedCity,
  selectSelectedCityInfo,
} from '../../store/selectors/citiesSelectors';
import {
  clearError,
  clearSearch,
  fetchCities,
  searchCities,
  setSelectedCity,
} from '../../store/slices/citiesSlice';
import type { City } from '../types';

/**
 * Хук для работы с городами
 */
export const useCities = () => {
  const dispatch = useAppDispatch();

  // Селекторы
  const cities = useAppSelector(selectCities);
  const selectedCity = useAppSelector(selectSelectedCity);
  const searchResults = useAppSelector(selectSearchResults);
  const searchQuery = useAppSelector(selectSearchQuery);
  const isLoading = useAppSelector(selectCitiesLoading);
  const isSearching = useAppSelector(selectCitiesSearching);
  const error = useAppSelector(selectCitiesError);
  const citiesForDisplay = useAppSelector(selectCitiesForDisplay);
  const citiesInfo = useAppSelector(selectCitiesInfo);
  const searchInfo = useAppSelector(selectSearchInfo);
  const selectedCityInfo = useAppSelector(selectSelectedCityInfo);

  // Действия
  const loadCities = useCallback(async () => {
    try {
      await dispatch(fetchCities()).unwrap();
    } catch (err) {
      console.error('Failed to load cities:', err);
    }
  }, [dispatch]);

  const searchCitiesByQuery = useCallback(
    async (query: string) => {
      try {
        await dispatch(searchCities(query)).unwrap();
      } catch (err) {
        console.error('Failed to search cities:', err);
      }
    },
    [dispatch]
  );

  const selectCity = useCallback(
    (city: City | null) => {
      dispatch(setSelectedCity(city));
    },
    [dispatch]
  );

  const clearSearchQuery = useCallback(() => {
    dispatch(clearSearch());
  }, [dispatch]);

  const clearErrorState = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    // Данные
    cities,
    selectedCity,
    searchResults,
    searchQuery,
    citiesForDisplay,

    // Состояния
    isLoading,
    isSearching,
    error,

    // Информация
    citiesInfo,
    searchInfo,
    selectedCityInfo,

    // Действия
    loadCities,
    searchCities: searchCitiesByQuery,
    selectCity,
    clearSearch: clearSearchQuery,
    clearError: clearErrorState,
  };
};
