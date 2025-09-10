import React from 'react';
import { useAppInitialization } from './hooks/useAppInitialization';

interface AppInitializerProps {
  children: React.ReactNode;
}

// Компонент для инициализации приложения
export const AppInitializer: React.FC<AppInitializerProps> = ({ children }) => {
  // Инициализируем приложение
  useAppInitialization();

  return <>{children}</>;
};

export default AppInitializer;
