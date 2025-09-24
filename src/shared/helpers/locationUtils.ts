import type { City, UserLocation } from '../../general/types';

/**
 * Вычисляет расстояние между двумя точками на Земле по формуле гаверсинуса
 * @param lat1 Широта первой точки
 * @param lon1 Долгота первой точки
 * @param lat2 Широта второй точки
 * @param lon2 Долгота второй точки
 * @returns Расстояние в километрах
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Радиус Земли в километрах
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
};

/**
 * Конвертирует градусы в радианы
 */
const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

/**
 * Находит ближайший город к заданным координатам
 * @param userLocation Геопозиция пользователя
 * @param cities Список доступных городов
 * @returns Ближайший город или null
 */
export const findNearestCity = (
  userLocation: UserLocation,
  cities: City[]
): City | null => {
  if (cities.length === 0) return null;

  let nearestCity: City | null = null;
  let minDistance = Infinity;

  cities.forEach((city) => {
    if (!city.isActive) return;

    const cityLat = parseFloat(city.latitude);
    const cityLon = parseFloat(city.longitude);

    if (isNaN(cityLat) || isNaN(cityLon)) return;

    const distance = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      cityLat,
      cityLon
    );

    if (distance < minDistance) {
      minDistance = distance;
      nearestCity = city;
    }
  });

  return nearestCity;
};

/**
 * Находит город по имени (fallback)
 * @param cities Список доступных городов
 * @param cityName Имя города для поиска
 * @returns Найденный город или null
 */
export const findCityByName = (
  cities: City[],
  cityName: string
): City | null => {
  return cities.find(
    (city) => city.isActive && city.name === cityName
  ) || null;
};

/**
 * Выбирает город по умолчанию на основе геопозиции или fallback
 * @param userLocation Геопозиция пользователя (может быть null)
 * @param cities Список доступных городов
 * @param fallbackCityName Имя города для fallback (по умолчанию 'Almaty')
 * @returns Выбранный город
 */
export const selectDefaultCity = (
  userLocation: UserLocation | null,
  cities: City[],
  fallbackCityName: string = 'Almaty'
): City | null => {
  // Если есть геопозиция, ищем ближайший город
  if (userLocation) {
    const nearestCity = findNearestCity(userLocation, cities);
    if (nearestCity) {
      return nearestCity;
    }
  }

  // Fallback на город по имени
  return findCityByName(cities, fallbackCityName);
};

/**
 * Проверяет, находится ли пользователь в радиусе города
 * @param userLocation Геопозиция пользователя
 * @param city Город для проверки
 * @param radiusKm Радиус в километрах (по умолчанию 50)
 * @returns true, если пользователь в радиусе города
 */
export const isUserInCityRadius = (
  userLocation: UserLocation,
  city: City,
  radiusKm: number = 50
): boolean => {
  const cityLat = parseFloat(city.latitude);
  const cityLon = parseFloat(city.longitude);

  if (isNaN(cityLat) || isNaN(cityLon)) return false;

  const distance = calculateDistance(
    userLocation.latitude,
    userLocation.longitude,
    cityLat,
    cityLon
  );

  return distance <= radiusKm;
};
