import React, { useEffect } from 'react';
import { authErrorHandler } from '../api/authErrorHandler';
import { useCurrentPath } from '../hooks/useCurrentPath';

/**
 * Компонент для отслеживания текущего пути и обновления authErrorHandler
 */
const PathTracker: React.FC = () => {
  const { currentPath } = useCurrentPath();

  useEffect(() => {
    // Обновляем текущий путь в authErrorHandler
    authErrorHandler.setCurrentPath(currentPath);
  }, [currentPath]);

  // Этот компонент не рендерит ничего
  return null;
};

export default PathTracker;
