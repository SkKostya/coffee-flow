// Типы для работы с городами в модуле cities

export interface City {
  id: string;
  name: string;
  nameRu: string;
  latitude: number;
  longitude: number;
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
  latitude: apiCity.latitude,
  longitude: apiCity.longitude,
  isActive: apiCity.isActive,
  createdAt: apiCity.createdAt,
  updatedAt: apiCity.updatedAt,
});

// Предустановленные города Казахстана (fallback данные)
export const KAZAKHSTAN_CITIES: City[] = [
  {
    id: 'almaty',
    name: 'Almaty',
    nameRu: 'Алматы',
    latitude: 43.222,
    longitude: 76.8512,
    isActive: true,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'astana',
    name: 'Astana',
    nameRu: 'Астана',
    latitude: 51.1694,
    longitude: 71.4491,
    isActive: true,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'atyrau',
    name: 'Atyrau',
    nameRu: 'Атырау',
    latitude: 47.1075,
    longitude: 51.91,
    isActive: true,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'taraz',
    name: 'Taraz',
    nameRu: 'Тараз',
    latitude: 42.9,
    longitude: 71.3667,
    isActive: true,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'kostanay',
    name: 'Kostanay',
    nameRu: 'Костанай',
    latitude: 53.2144,
    longitude: 63.6246,
    isActive: true,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'shymkent',
    name: 'Shymkent',
    nameRu: 'Шымкент',
    latitude: 42.3,
    longitude: 69.6,
    isActive: true,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
];
