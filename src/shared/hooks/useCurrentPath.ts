import { usePathname } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';

/**
 * Хук для отслеживания текущего пути в приложении
 */
export const useCurrentPath = () => {
  const pathname = usePathname();
  const [currentPath, setCurrentPath] = useState<string>(
    pathname || '/coffee-shops'
  );

  useEffect(() => {
    if (pathname) {
      setCurrentPath(pathname);
    }
  }, [pathname]);

  const updateCurrentPath = useCallback((path: string) => {
    setCurrentPath(path);
  }, []);

  return {
    currentPath,
    updateCurrentPath,
  };
};
