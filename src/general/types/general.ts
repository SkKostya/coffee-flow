// Типы для работы с общими данными в модуле general

export interface Category {
  id: string;
  name: string;
  nameRu: string;
  description: string;
  iconUrl: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Тип для API ответа категории
export interface CategoryApiResponse {
  id: string;
  name: string;
  nameRu: string;
  description: string;
  iconUrl: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

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

// Типы для пользовательских данных
export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  timestamp: number;
}

export interface UserData {
  location: UserLocation | null;
  selectedCity: City | null;
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

// Redux состояние для общих данных
export interface GeneralState {
  categories: Category[];
  cities: City[];
  user: UserData;
  isLoading: boolean;
  error: string | null;
}

// Действия для общих данных
export interface GeneralActions {
  setCategories: (categories: Category[]) => void;
  setCities: (cities: City[]) => void;
  setSelectedCity: (city: City | null) => void;
  setUserLocation: (location: UserLocation | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
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
