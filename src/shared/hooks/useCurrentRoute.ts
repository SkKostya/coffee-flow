// src/shared/hooks/useCurrentRoute.ts
import { useFocusEffect, usePathname, useSegments } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';

// Экраны, на которых StickyCart должен быть скрыт
const HIDDEN_SCREENS = [
  '/(tabs)/cart',
  '/(tabs)/profile',
  '/orders',
  '/checkout',
  '/payment-methods',
  '/auth/login',
  '/auth/register',
  '/auth/reset-password',
  '/onboarding',
  '/city-selection',
  '/account',
  '/edit-account',
  '/change-password',
  '/repeat-order',
];

// Экраны, на которых StickyCart должен быть компактным
const COMPACT_SCREENS = ['/(tabs)/coffee-shops'];

export const useCurrentRoute = () => {
  const pathname = usePathname();
  const segments = useSegments();
  const [currentPath, setCurrentPath] = useState(pathname);

  // Обновляем текущий путь при изменении фокуса экрана
  useFocusEffect(
    useCallback(() => {
      setCurrentPath(pathname);
    }, [pathname])
  );

  // Также обновляем при изменении pathname или сегментов
  useMemo(() => {
    setCurrentPath(pathname);
  }, [pathname]);

  return useMemo(() => {
    // Функция для проверки соответствия маршрута
    const matchesRoute = (path: string, screen: string): boolean => {
      if (path === screen) return true;
      if (screen.endsWith('/') && path.startsWith(screen)) return true;
      if (screen.includes('[') && screen.includes(']')) {
        // Для динамических маршрутов типа /coffee-shops/[id]
        const pattern = screen.replace(/\[.*?\]/g, '');
        return path.startsWith(pattern);
      }
      return false;
    };

    // Дополнительная проверка на основе сегментов для более точного определения
    const getRouteFromSegments = (segments: string[]): string => {
      if (segments.length === 0) return '/';
      return '/' + segments.join('/');
    };

    const routeFromSegments = getRouteFromSegments(segments);
    const effectivePath = currentPath || routeFromSegments;

    const isHidden = HIDDEN_SCREENS.some(
      (screen) =>
        matchesRoute(effectivePath, screen) ||
        matchesRoute(routeFromSegments, screen)
    );
    const isCompact = COMPACT_SCREENS.some(
      (screen) =>
        matchesRoute(effectivePath, screen) ||
        matchesRoute(routeFromSegments, screen)
    );

    return {
      pathname: effectivePath,
      isHidden,
      isCompact,
      shouldShowStickyCart: !isHidden,
    };
  }, [currentPath, segments]);
};
