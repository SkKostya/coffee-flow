import React, { useEffect } from 'react';

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
  const { loadCategories, loadCities } = useGeneral();

  // Загружаем категории при монтировании
  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // Загружаем города при монтировании
  useEffect(() => {
    loadCities();
  }, [loadCities]);

  return <>{children}</>;
};

export default GeneralInitializer;
