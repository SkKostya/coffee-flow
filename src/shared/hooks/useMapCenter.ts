import { useCallback, useEffect, useMemo, useState } from 'react';
import type { City, UserLocation } from '../../general/types';
import {
  createOptimalMapRegion,
  createRegionWithRadius,
  type MapRegion,
} from '../helpers/mapUtils';

interface UseMapCenterParams {
  userLocation: UserLocation | null;
  selectedCity: City | null;
  searchRadius?: number; // Радиус поиска в километрах
  userZoomLevel?: 'CITY' | 'DISTRICT' | 'NEIGHBORHOOD' | 'STREET' | 'BUILDING';
  cityZoomLevel?: 'CITY' | 'DISTRICT' | 'NEIGHBORHOOD' | 'STREET' | 'BUILDING';
  onRegionChange?: (region: MapRegion) => void;
}

interface UseMapCenterReturn {
  mapRegion: MapRegion | null;
  isRegionReady: boolean;
  updateRegion: (region: MapRegion) => void;
  centerOnUserLocation: () => void;
  centerOnCity: () => void;
  centerOnRadius: (radius: number) => void;
  hasUserLocation: boolean;
  hasSelectedCity: boolean;
}

/**
 * Хук для управления центром карты на основе геопозиции или выбранного города
 */
export const useMapCenter = ({
  userLocation,
  selectedCity,
  searchRadius = 1,
  userZoomLevel = 'NEIGHBORHOOD',
  cityZoomLevel = 'CITY',
  onRegionChange,
}: UseMapCenterParams): UseMapCenterReturn => {
  const [mapRegion, setMapRegion] = useState<MapRegion | null>(null);
  const [isRegionReady, setIsRegionReady] = useState(false);

  // Проверяем доступность данных
  const hasUserLocation = !!userLocation;
  const hasSelectedCity = !!selectedCity;

  // Создаем оптимальный регион карты
  const optimalRegion = useMemo(() => {
    return createOptimalMapRegion(
      userLocation,
      selectedCity,
      userZoomLevel,
      cityZoomLevel
    );
  }, [userLocation, selectedCity, userZoomLevel, cityZoomLevel]);

  // Обновляем регион карты при изменении данных
  useEffect(() => {
    if (optimalRegion) {
      setMapRegion(optimalRegion);
      setIsRegionReady(true);
      onRegionChange?.(optimalRegion);
    }
  }, [optimalRegion, onRegionChange]);

  // Центрирование на геопозиции пользователя
  const centerOnUserLocation = useCallback(() => {
    if (!userLocation) return;

    const region = createOptimalMapRegion(
      userLocation,
      null,
      userZoomLevel,
      cityZoomLevel
    );

    if (region) {
      setMapRegion(region);
      onRegionChange?.(region);
    }
  }, [userLocation, userZoomLevel, cityZoomLevel, onRegionChange]);

  // Центрирование на выбранном городе
  const centerOnCity = useCallback(() => {
    if (!selectedCity) return;

    const region = createOptimalMapRegion(
      null,
      selectedCity,
      userZoomLevel,
      cityZoomLevel
    );

    if (region) {
      setMapRegion(region);
      onRegionChange?.(region);
    }
  }, [selectedCity, userZoomLevel, cityZoomLevel, onRegionChange]);

  // Центрирование с учетом радиуса поиска
  const centerOnRadius = useCallback(
    (radius: number) => {
      if (!userLocation && !selectedCity) return;

      let centerLat: number;
      let centerLon: number;

      if (userLocation) {
        centerLat = userLocation.latitude;
        centerLon = userLocation.longitude;
      } else if (selectedCity) {
        centerLat = parseFloat(selectedCity.latitude);
        centerLon = parseFloat(selectedCity.longitude);
      } else {
        return;
      }

      const region = createRegionWithRadius(centerLat, centerLon, radius);
      setMapRegion(region);
      onRegionChange?.(region);
    },
    [userLocation, selectedCity, onRegionChange]
  );

  // Ручное обновление региона
  const updateRegion = useCallback(
    (region: MapRegion) => {
      setMapRegion(region);
      onRegionChange?.(region);
    },
    [onRegionChange]
  );

  return {
    mapRegion,
    isRegionReady,
    updateRegion,
    centerOnUserLocation,
    centerOnCity,
    centerOnRadius,
    hasUserLocation,
    hasSelectedCity,
  };
};

export default useMapCenter;
