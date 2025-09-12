import React, { useEffect } from 'react';

import { useGeneral } from '../hooks';

interface GeneralInitializerProps {
  children: React.ReactNode;
}

/**
 * Компонент для инициализации общих данных приложения
 */
const GeneralInitializer: React.FC<GeneralInitializerProps> = ({
  children,
}) => {
  const { loadCategories } = useGeneral();

  // Загружаем категории при монтировании
  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  return <>{children}</>;
};

export default GeneralInitializer;
