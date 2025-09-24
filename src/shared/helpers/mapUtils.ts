import type { City, UserLocation } from '../../general/types';

/**
 * Интерфейс для региона карты
 */
export interface MapRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

/**
 * Стандартные дельты для разных уровней зума
 */
export const MAP_ZOOM_LEVELS = {
  CITY: { latitudeDelta: 0.1, longitudeDelta: 0.1 },
  DISTRICT: { latitudeDelta: 0.05, longitudeDelta: 0.05 },
  NEIGHBORHOOD: { latitudeDelta: 0.02, longitudeDelta: 0.02 },
  STREET: { latitudeDelta: 0.01, longitudeDelta: 0.01 },
  BUILDING: { latitudeDelta: 0.005, longitudeDelta: 0.005 },
} as const;

/**
 * Создает регион карты на основе геопозиции пользователя
 * @param userLocation Геопозиция пользователя
 * @param zoomLevel Уровень зума (по умолчанию NEIGHBORHOOD)
 * @returns Регион карты
 */
export const createRegionFromUserLocation = (
  userLocation: UserLocation,
  zoomLevel: keyof typeof MAP_ZOOM_LEVELS = 'NEIGHBORHOOD'
): MapRegion => {
  const zoom = MAP_ZOOM_LEVELS[zoomLevel];

  return {
    latitude: userLocation.latitude,
    longitude: userLocation.longitude,
    latitudeDelta: zoom.latitudeDelta,
    longitudeDelta: zoom.longitudeDelta,
  };
};

/**
 * Создает регион карты на основе выбранного города
 * @param city Выбранный город
 * @param zoomLevel Уровень зума (по умолчанию CITY)
 * @returns Регион карты
 */
export const createRegionFromCity = (
  city: City,
  zoomLevel: keyof typeof MAP_ZOOM_LEVELS = 'CITY'
): MapRegion => {
  const cityLat = parseFloat(city.latitude);
  const cityLon = parseFloat(city.longitude);

  if (isNaN(cityLat) || isNaN(cityLon)) {
    throw new Error(`Некорректные координаты для города ${city.name}`);
  }

  const zoom = MAP_ZOOM_LEVELS[zoomLevel];

  return {
    latitude: cityLat,
    longitude: cityLon,
    latitudeDelta: zoom.latitudeDelta,
    longitudeDelta: zoom.longitudeDelta,
  };
};

/**
 * Создает регион карты с приоритетом геопозиции над городом
 * @param userLocation Геопозиция пользователя (может быть null)
 * @param selectedCity Выбранный город (может быть null)
 * @param userZoomLevel Уровень зума для геопозиции
 * @param cityZoomLevel Уровень зума для города
 * @returns Регион карты или null, если нет данных
 */
export const createOptimalMapRegion = (
  userLocation: UserLocation | null,
  selectedCity: City | null,
  userZoomLevel: keyof typeof MAP_ZOOM_LEVELS = 'NEIGHBORHOOD',
  cityZoomLevel: keyof typeof MAP_ZOOM_LEVELS = 'CITY'
): MapRegion | null => {
  // Приоритет: геопозиция пользователя
  if (userLocation) {
    return createRegionFromUserLocation(userLocation, userZoomLevel);
  }

  // Fallback: выбранный город
  if (selectedCity) {
    return createRegionFromCity(selectedCity, cityZoomLevel);
  }

  return null;
};

/**
 * Создает регион карты с учетом радиуса поиска
 * @param centerLat Широта центра
 * @param centerLon Долгота центра
 * @param radiusKm Радиус в километрах
 * @returns Регион карты
 */
export const createRegionWithRadius = (
  centerLat: number,
  centerLon: number,
  radiusKm: number
): MapRegion => {
  // Приблизительное преобразование километров в градусы
  // 1 градус широты ≈ 111 км
  const latitudeDelta = (radiusKm * 2) / 111;
  const longitudeDelta =
    (radiusKm * 2) / (111 * Math.cos((centerLat * Math.PI) / 180));

  return {
    latitude: centerLat,
    longitude: centerLon,
    latitudeDelta: Math.max(latitudeDelta, 0.001), // Минимальный зум
    longitudeDelta: Math.max(longitudeDelta, 0.001),
  };
};

/**
 * Проверяет, находится ли точка в пределах региона карты
 * @param pointLat Широта точки
 * @param pointLon Долгота точки
 * @param region Регион карты
 * @returns true, если точка в регионе
 */
export const isPointInRegion = (
  pointLat: number,
  pointLon: number,
  region: MapRegion
): boolean => {
  const latMin = region.latitude - region.latitudeDelta / 2;
  const latMax = region.latitude + region.latitudeDelta / 2;
  const lonMin = region.longitude - region.longitudeDelta / 2;
  const lonMax = region.longitude + region.longitudeDelta / 2;

  return (
    pointLat >= latMin &&
    pointLat <= latMax &&
    pointLon >= lonMin &&
    pointLon <= lonMax
  );
};

/**
 * Вычисляет расстояние от центра региона до точки
 * @param region Регион карты
 * @param pointLat Широта точки
 * @param pointLon Долгота точки
 * @returns Расстояние в километрах
 */
export const getDistanceFromRegionCenter = (
  region: MapRegion,
  pointLat: number,
  pointLon: number
): number => {
  const R = 6371; // Радиус Земли в километрах
  const dLat = toRadians(pointLat - region.latitude);
  const dLon = toRadians(pointLon - region.longitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(region.latitude)) *
      Math.cos(toRadians(pointLat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Конвертирует градусы в радианы
 */
const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

/**
 * Создает регион карты для отображения нескольких точек
 * @param points Массив точек с координатами
 * @param padding Отступы в километрах (по умолчанию 1км)
 * @returns Регион карты, охватывающий все точки
 */
export const createRegionForPoints = (
  points: Array<{ latitude: number; longitude: number }>,
  padding: number = 1
): MapRegion | null => {
  if (points.length === 0) return null;

  if (points.length === 1) {
    return createRegionWithRadius(
      points[0].latitude,
      points[0].longitude,
      padding
    );
  }

  // Находим границы
  const latitudes = points.map((p) => p.latitude);
  const longitudes = points.map((p) => p.longitude);

  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const minLon = Math.min(...longitudes);
  const maxLon = Math.max(...longitudes);

  // Центр региона
  const centerLat = (minLat + maxLat) / 2;
  const centerLon = (minLon + maxLon) / 2;

  // Размеры региона с отступами
  const latDelta = maxLat - minLat + (padding * 2) / 111;
  const lonDelta =
    maxLon -
    minLon +
    (padding * 2) / (111 * Math.cos((centerLat * Math.PI) / 180));

  return {
    latitude: centerLat,
    longitude: centerLon,
    latitudeDelta: Math.max(latDelta, 0.001),
    longitudeDelta: Math.max(lonDelta, 0.001),
  };
};
