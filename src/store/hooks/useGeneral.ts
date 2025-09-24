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
  selectGeneralUser,
  selectSelectedCity,
  selectSelectedCityInfo,
  selectUserInfo,
  selectUserLocation,
  selectUserLocationInfo,
} from '../selectors/generalSelectors';
import {
  clearError,
  fetchCategories,
  fetchCities,
  setSelectedCity,
  setUserLocation,
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
  const user = useAppSelector(selectGeneralUser);
  const selectedCity = useAppSelector(selectSelectedCity);
  const selectedCityInfo = useAppSelector(selectSelectedCityInfo);
  const userLocation = useAppSelector(selectUserLocation);
  const userLocationInfo = useAppSelector(selectUserLocationInfo);
  const userInfo = useAppSelector(selectUserInfo);
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

  const selectCity = useCallback(
    (city: any) => {
      dispatch(setSelectedCity(city));
    },
    [dispatch]
  );

  const clearSelectedCity = useCallback(() => {
    dispatch(setSelectedCity(null));
  }, [dispatch]);

  const setLocation = useCallback(
    (location: any) => {
      dispatch(setUserLocation(location));
    },
    [dispatch]
  );

  const clearLocation = useCallback(() => {
    dispatch(setUserLocation(null));
  }, [dispatch]);

  return {
    // Данные
    categories,
    cities,
    user,
    selectedCity,
    selectedCityInfo,
    userLocation,
    userLocationInfo,
    userInfo,
    activeCategories,
    activeCities,
    isLoading,
    error,
    info,

    // Действия
    loadCategories,
    loadCities,
    selectCity,
    clearSelectedCity,
    setLocation,
    clearLocation,
    clearError: clearErrorState,
  };
};
