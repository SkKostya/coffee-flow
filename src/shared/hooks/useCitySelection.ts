import { useCallback, useEffect } from 'react';
import type { City, UserLocation } from '../../general/types';
import { selectDefaultCity } from '../helpers/locationUtils';

interface UseCitySelectionParams {
  userLocation: UserLocation | null;
  cities: City[];
  selectedCity: City | null;
  onCitySelect: (city: City) => void;
  fallbackCityName?: string;
}

/**
 * Хук для автоматического выбора города на основе геопозиции
 */
export const useCitySelection = ({
  userLocation,
  cities,
  selectedCity,
  onCitySelect,
  fallbackCityName = 'Almaty',
}: UseCitySelectionParams) => {
  // Автоматический выбор города при изменении геопозиции или списка городов
  useEffect(() => {
    // Если город уже выбран, не меняем его автоматически
    if (selectedCity) return;

    // Если нет городов, ничего не делаем
    if (cities.length === 0) return;

    // Выбираем город по умолчанию
    const defaultCity = selectDefaultCity(
      userLocation,
      cities,
      fallbackCityName
    );

    if (defaultCity) {
      onCitySelect(defaultCity);
    }
  }, [userLocation, cities, selectedCity, fallbackCityName]);

  // Ручной выбор города
  const selectCity = useCallback((city: City) => {
    onCitySelect(city);
  }, []);

  // Очистка выбора города
  const clearCitySelection = useCallback(() => {
    onCitySelect(null as any); // Принудительно передаем null
  }, []);

  return {
    selectCity,
    clearCitySelection,
  };
};

export default useCitySelection;
