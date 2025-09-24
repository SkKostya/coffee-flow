import * as Location from 'expo-location';
import { useCallback, useState } from 'react';
import type { UserLocation } from '../../general/types';

interface UseLocationParams {
  onLocationUpdate?: (location: UserLocation) => void;
  onError?: (error: string) => void;
}

interface UseLocationReturn {
  location: UserLocation | null;
  isLoading: boolean;
  error: string | null;
  requestLocation: () => Promise<void>;
  getCurrentLocation: () => Promise<UserLocation | null>;
  clearLocation: () => void;
}

/**
 * Хук для работы с геолокацией пользователя
 */
export const useLocation = ({
  onLocationUpdate,
  onError,
}: UseLocationParams = {}): UseLocationReturn => {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Запрос разрешений на геолокацию
  const requestLocation = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Проверяем, есть ли разрешение на геолокацию
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        const errorMessage = 'Разрешение на доступ к геолокации отклонено';
        setError(errorMessage);
        onError?.(errorMessage);
        return;
      }

      // Получаем текущую позицию
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const userLocation: UserLocation = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        accuracy: currentLocation.coords.accuracy,
        timestamp: currentLocation.timestamp,
      };

      setLocation(userLocation);
      onLocationUpdate?.(userLocation);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Ошибка получения геолокации';
      setError(errorMessage);
      onError?.(errorMessage);
      console.error('Location error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Получение текущей позиции без запроса разрешений
  const getCurrentLocation =
    useCallback(async (): Promise<UserLocation | null> => {
      try {
        setIsLoading(true);
        setError(null);

        // Проверяем разрешения
        const { status } = await Location.getForegroundPermissionsAsync();

        if (status !== 'granted') {
          throw new Error('Нет разрешения на доступ к геолокации');
        }

        // Получаем текущую позицию
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        const userLocation: UserLocation = {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          accuracy: currentLocation.coords.accuracy,
          timestamp: currentLocation.timestamp,
        };

        setLocation(userLocation);
        onLocationUpdate?.(userLocation);

        return userLocation;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Ошибка получения геолокации';
        setError(errorMessage);
        onError?.(errorMessage);
        console.error('Location error:', err);
        return null;
      } finally {
        setIsLoading(false);
      }
    }, []);

  // Очистка геолокации
  const clearLocation = useCallback(() => {
    setLocation(null);
    setError(null);
  }, []);

  return {
    location,
    isLoading,
    error,
    requestLocation,
    getCurrentLocation,
    clearLocation,
  };
};

export default useLocation;
