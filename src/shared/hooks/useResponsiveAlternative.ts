import { useEffect, useState } from 'react';
import { Dimensions, ScaledSize } from 'react-native';
import { Breakpoints, type Breakpoint } from './useResponsive';

interface UseResponsiveReturn {
  isMobile: boolean;
  isTablet: boolean;
  currentBreakpoint: Breakpoint;
  screenWidth: number;
  screenHeight: number;
}

/**
 * Альтернативная версия useResponsive с дополнительными проверками
 * Используйте этот хук, если основной не работает корректно
 */
const useResponsiveAlternative = (): UseResponsiveReturn => {
  const [screenDimensions, setScreenDimensions] = useState(() => {
    const { width, height } = Dimensions.get('window');
    console.log('🔄 useResponsiveAlternative: Initial dimensions:', {
      width,
      height,
    });
    return { width, height };
  });

  const [isListenerActive, setIsListenerActive] = useState(false);

  useEffect(() => {
    console.log('🔄 useResponsiveAlternative: Setting up listeners');

    let timeoutId: NodeJS.Timeout;

    const updateDimensions = (data: {
      window: ScaledSize;
      screen: ScaledSize;
    }) => {
      const { window } = data;
      console.log('🔄 useResponsiveAlternative: Dimensions changed:', {
        width: window.width,
        height: window.height,
        timestamp: new Date().toISOString(),
      });

      // Debounce updates to avoid too frequent re-renders
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setScreenDimensions({
          width: window.width,
          height: window.height,
        });
      }, 100);
    };

    // Попытка 1: Стандартный addEventListener
    let subscription: any;
    try {
      subscription = Dimensions.addEventListener('change', updateDimensions);
      setIsListenerActive(true);
      console.log(
        '🔄 useResponsiveAlternative: Standard listener set up successfully'
      );
    } catch (error) {
      console.warn(
        '🔄 useResponsiveAlternative: Failed to set up standard listener:',
        error
      );
    }

    // Попытка 2: Для веб-версии добавляем window resize listener
    const handleWindowResize = () => {
      const { width, height } = Dimensions.get('window');
      console.log('🔄 useResponsiveAlternative: Window resize detected:', {
        width,
        height,
      });
      updateDimensions({
        window: { width, height, scale: 1, fontScale: 1 },
        screen: { width, height, scale: 1, fontScale: 1 },
      });
    };

    // Проверяем, работаем ли мы в веб-среде
    if (typeof window !== 'undefined' && window.addEventListener) {
      window.addEventListener('resize', handleWindowResize);
      console.log('🔄 useResponsiveAlternative: Window resize listener added');
    }

    // Периодическая проверка размеров (fallback)
    const intervalId = setInterval(() => {
      const { width, height } = Dimensions.get('window');
      if (
        width !== screenDimensions.width ||
        height !== screenDimensions.height
      ) {
        console.log(
          '🔄 useResponsiveAlternative: Dimensions changed (polling):',
          { width, height }
        );
        setScreenDimensions({ width, height });
      }
    }, 1000);

    return () => {
      console.log('🔄 useResponsiveAlternative: Cleaning up listeners');
      clearTimeout(timeoutId);
      clearInterval(intervalId);

      if (subscription?.remove) {
        subscription.remove();
      }

      if (typeof window !== 'undefined' && window.removeEventListener) {
        window.removeEventListener('resize', handleWindowResize);
      }

      setIsListenerActive(false);
    };
  }, [screenDimensions.width, screenDimensions.height]);

  const { width, height } = screenDimensions;

  const isMobile =
    width >= Breakpoints.mobile.min && width <= Breakpoints.mobile.max;
  const isTablet = width >= Breakpoints.tablet.min;

  const getCurrentBreakpoint = (): Breakpoint => {
    if (isMobile) return 'mobile';
    return 'tablet';
  };

  const currentBreakpoint = getCurrentBreakpoint();

  // Отладочная информация
  console.log('🔄 useResponsiveAlternative: Current state:', {
    width,
    height,
    isMobile,
    isTablet,
    currentBreakpoint,
    isListenerActive,
  });

  return {
    isMobile,
    isTablet,
    currentBreakpoint,
    screenWidth: width,
    screenHeight: height,
  };
};

export default useResponsiveAlternative;
