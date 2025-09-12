import { useCallback, useMemo, useState } from 'react';
import type { City } from '../../cities/types';
import { useGeneral } from '../../store/hooks/useGeneral';

interface UseCitySelectionParams {
  initialCityId?: string;
  onCityChange?: (city: City | null) => void;
}

interface CitySelectionHook {
  selectedCity: City | null;
  availableCities: City[];
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
  selectCity: (city: City) => void;
  searchCities: (query: string) => void;
  clearSearch: () => void;
  loadCities: () => Promise<void>;
}

const useCitySelection = ({
  initialCityId,
  onCityChange,
}: UseCitySelectionParams = {}): CitySelectionHook => {
  const { cities, isLoading, error } = useGeneral();
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Фильтрация городов по поисковому запросу
  const filteredCities = useMemo(() => {
    if (!searchQuery.trim()) {
      return cities;
    }

    const query = searchQuery.toLowerCase();
    return cities.filter(
      (city) =>
        city.name.toLowerCase().includes(query) ||
        city.nameRu.toLowerCase().includes(query)
    );
  }, [cities, searchQuery]);

  // Выбор города
  const selectCity = useCallback(
    (city: City) => {
      setSelectedCity(city);
      setError(null);

      if (onCityChange) {
        onCityChange(city);
      }
    },
    [onCityChange]
  );

  // Поиск городов
  const searchCities = useCallback((query: string) => {
    setSearchQuery(query);
    setError(null);
  }, []);

  // Очистка поиска
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setError(null);
  }, []);

  // Инициализация выбранного города по ID или выбор первого доступного
  useMemo(() => {
    if (cities.length > 0) {
      if (initialCityId) {
        // Ищем город по переданному ID
        const city = cities.find((city) => city.id === initialCityId);
        if (city && city !== selectedCity) {
          setSelectedCity(city);
        }
      } else if (!selectedCity) {
        // Если нет initialCityId и нет выбранного города, выбираем первый активный
        const firstActiveCity = cities.find((city) => city.isActive);
        if (firstActiveCity) {
          setSelectedCity(firstActiveCity);
        }
      }
    }
  }, [initialCityId, cities, selectedCity]);

  return {
    selectedCity,
    availableCities: filteredCities,
    searchQuery,
    isLoading,
    error,
    selectCity,
    searchCities,
    clearSearch,
    loadCities: () => Promise.resolve(), // Города уже загружаются в useGeneral
  };
};

export default useCitySelection;
