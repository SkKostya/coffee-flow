// Типы для работы с городами в модуле cities

export interface City {
  id: string;
  name: string;
  nameRu: string;
  latitude: string;
  longitude: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Тип для API ответа города
export interface CityApiResponse {
  id: string;
  name: string;
  nameRu: string;
  latitude: number;
  longitude: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Тип для поиска городов
export interface CitySearchParams {
  q: string;
}

// Redux состояние для городов
export interface CitiesState {
  cities: City[];
  selectedCity: City | null;
  searchResults: City[];
  isLoading: boolean;
  isSearching: boolean;
  error: string | null;
  searchQuery: string;
}

// Действия для городов
export interface CitiesActions {
  setCities: (cities: City[]) => void;
  setSelectedCity: (city: City | null) => void;
  setSearchResults: (results: City[]) => void;
  setSearchQuery: (query: string) => void;
  setLoading: (loading: boolean) => void;
  setSearching: (searching: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  clearSearch: () => void;
}

// Утилиты для работы с городами
export const mapCityApiResponse = (apiCity: CityApiResponse): City => ({
  id: apiCity.id,
  name: apiCity.name,
  nameRu: apiCity.nameRu,
  latitude: apiCity.latitude.toString(),
  longitude: apiCity.longitude.toString(),
  isActive: apiCity.isActive,
  createdAt: apiCity.createdAt,
  updatedAt: apiCity.updatedAt,
});

// Моковые города удалены - используем только данные из API
