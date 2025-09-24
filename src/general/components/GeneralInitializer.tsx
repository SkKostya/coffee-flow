import React, { useEffect } from 'react';

import useCitySelection from '../../shared/hooks/useCitySelection';
import { useLocation } from '../../shared/hooks/useLocation';
import { useGeneral } from '../../store/hooks/useGeneral';

interface GeneralInitializerProps {
  children: React.ReactNode;
}

/**
 * Компонент для инициализации общих данных приложения
 */
const GeneralInitializer: React.FC<GeneralInitializerProps> = ({
  children,
}) => {
  const {
    loadCategories,
    loadCities,
    setLocation,
    cities,
    selectedCity,
    selectCity,
  } = useGeneral();

  const { requestLocation, location } = useLocation({
    onLocationUpdate: (location) => {
      setLocation(location);
    },
    onError: (error) => {
      console.warn('Location error:', error);
    },
  });

  // Автоматический выбор города на основе геопозиции
  useCitySelection({
    userLocation: location,
    cities,
    selectedCity,
    onCitySelect: selectCity,
    fallbackCityName: 'Almaty',
  });

  // Загружаем категории при монтировании
  useEffect(() => {
    loadCategories();
  }, []);

  // Загружаем города при монтировании
  useEffect(() => {
    loadCities();
  }, []);

  // Получаем геопозицию пользователя при монтировании
  useEffect(() => {
    requestLocation();
  }, []);

  return <>{children}</>;
};

export default GeneralInitializer;
