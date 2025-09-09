// Типы для работы с городами в Coffee Flow

export interface City {
  id: string;
  name: string;
  nameEn: string;
  region: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  isActive: boolean;
}

export interface CitySelectionState {
  selectedCity: City | null;
  availableCities: City[];
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
}

export interface CitySelectionActions {
  selectCity: (city: City) => void;
  searchCities: (query: string) => void;
  clearSearch: () => void;
  loadCities: () => Promise<void>;
}

export type CitySelectionHook = CitySelectionState & CitySelectionActions;

// Предустановленные города Казахстана
export const KAZAKHSTAN_CITIES: City[] = [
  {
    id: 'almaty',
    name: 'Алматы',
    nameEn: 'Almaty',
    region: 'Алматинская область',
    coordinates: {
      latitude: 43.222,
      longitude: 76.8512,
    },
    isActive: true,
  },
  {
    id: 'astana',
    name: 'Астана',
    nameEn: 'Astana',
    region: 'Акмолинская область',
    coordinates: {
      latitude: 51.1694,
      longitude: 71.4491,
    },
    isActive: true,
  },
  {
    id: 'atyrau',
    name: 'Атырау',
    nameEn: 'Atyrau',
    region: 'Атырауская область',
    coordinates: {
      latitude: 47.1075,
      longitude: 51.91,
    },
    isActive: true,
  },
  {
    id: 'taraz',
    name: 'Тараз',
    nameEn: 'Taraz',
    region: 'Жамбылская область',
    coordinates: {
      latitude: 42.9,
      longitude: 71.3667,
    },
    isActive: true,
  },
  {
    id: 'kostanay',
    name: 'Костанай',
    nameEn: 'Kostanay',
    region: 'Костанайская область',
    coordinates: {
      latitude: 53.2144,
      longitude: 63.6246,
    },
    isActive: true,
  },
  {
    id: 'taldykorgan',
    name: 'Талдыкорган',
    nameEn: 'Taldykorgan',
    region: 'Алматинская область',
    coordinates: {
      latitude: 45.0167,
      longitude: 78.3667,
    },
    isActive: true,
  },
  {
    id: 'shymkent',
    name: 'Шымкент',
    nameEn: 'Shymkent',
    region: 'Туркестанская область',
    coordinates: {
      latitude: 42.3,
      longitude: 69.6,
    },
    isActive: true,
  },
  {
    id: 'pavlodar',
    name: 'Павлодар',
    nameEn: 'Pavlodar',
    region: 'Павлодарская область',
    coordinates: {
      latitude: 52.3,
      longitude: 76.95,
    },
    isActive: true,
  },
  {
    id: 'semey',
    name: 'Семей',
    nameEn: 'Semey',
    region: 'Восточно-Казахстанская область',
    coordinates: {
      latitude: 50.4111,
      longitude: 80.2275,
    },
    isActive: true,
  },
  {
    id: 'aktobe',
    name: 'Актобе',
    nameEn: 'Aktobe',
    region: 'Актюбинская область',
    coordinates: {
      latitude: 50.2833,
      longitude: 57.2,
    },
    isActive: true,
  },
  {
    id: 'aktau',
    name: 'Актау',
    nameEn: 'Aktau',
    region: 'Мангистауская область',
    coordinates: {
      latitude: 43.65,
      longitude: 51.15,
    },
    isActive: true,
  },
  {
    id: 'petropavlovsk',
    name: 'Петропавловск',
    nameEn: 'Petropavlovsk',
    region: 'Северо-Казахстанская область',
    coordinates: {
      latitude: 54.8667,
      longitude: 69.15,
    },
    isActive: true,
  },
  {
    id: 'oral',
    name: 'Уральск',
    nameEn: 'Oral',
    region: 'Западно-Казахстанская область',
    coordinates: {
      latitude: 51.2333,
      longitude: 51.3667,
    },
    isActive: true,
  },
  {
    id: 'kyzylorda',
    name: 'Кызылорда',
    nameEn: 'Kyzylorda',
    region: 'Кызылординская область',
    coordinates: {
      latitude: 44.85,
      longitude: 65.5167,
    },
    isActive: true,
  },
  {
    id: 'ust-kamenogorsk',
    name: 'Усть-Каменогорск',
    nameEn: 'Ust-Kamenogorsk',
    region: 'Восточно-Казахстанская область',
    coordinates: {
      latitude: 49.95,
      longitude: 82.6167,
    },
    isActive: true,
  },
];
