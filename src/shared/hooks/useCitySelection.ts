import { useCallback, useMemo, useState } from 'react';
import type { City } from '../../cities/types';
import { KAZAKHSTAN_CITIES } from '../../cities/types';

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
  // Находим начальный город
  const initialCity = useMemo(() => {
    if (!initialCityId) return null;
    return KAZAKHSTAN_CITIES.find((city) => city.id === initialCityId) || null;
  }, [initialCityId]);

  const [selectedCity, setSelectedCity] = useState<City | null>(initialCity);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Фильтрация городов по поисковому запросу
  const availableCities = useMemo(() => {
    if (!searchQuery.trim()) {
      return KAZAKHSTAN_CITIES;
    }

    const query = searchQuery.toLowerCase();
    return KAZAKHSTAN_CITIES.filter(
      (city) =>
        city.name.toLowerCase().includes(query) ||
        city.nameRu.toLowerCase().includes(query)
    );
  }, [searchQuery]);

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

  // Загрузка городов (для будущего API)
  const loadCities = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Здесь будет загрузка городов с API
      // Пока используем статический список
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки городов');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    selectedCity,
    availableCities,
    searchQuery,
    isLoading,
    error,
    selectCity,
    searchCities,
    clearSearch,
    loadCities,
  };
};

export default useCitySelection;
