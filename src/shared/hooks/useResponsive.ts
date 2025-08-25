import { useEffect, useState } from 'react';
import { Dimensions, ScaledSize } from 'react-native';

export const Breakpoints = {
  // Мобильные устройства (портретная ориентация)
  mobile: {
    min: 320,
    max: 767,
  },
  // Планшеты (портретная и ландшафтная ориентация)
  tablet: {
    min: 768,
    max: Infinity,
  },
} as const;

export type Breakpoint = keyof typeof Breakpoints;

interface UseResponsiveReturn {
  isMobile: boolean;
  isTablet: boolean;
  currentBreakpoint: Breakpoint;
  screenWidth: number;
  screenHeight: number;
}

const useResponsive = (): UseResponsiveReturn => {
  const [screenDimensions, setScreenDimensions] = useState(() => {
    const { width, height } = Dimensions.get('window');
    console.log('🔍 useResponsive: Initial dimensions:', { width, height });
    return { width, height };
  });

  useEffect(() => {
    console.log('🔍 useResponsive: Setting up dimension listener');

    const updateDimensions = ({
      window,
      screen,
    }: {
      window: ScaledSize;
      screen: ScaledSize;
    }) => {
      console.log('🔍 useResponsive: Dimensions changed:', {
        window: { width: window.width, height: window.height },
        screen: { width: screen.width, height: screen.height },
      });
      setScreenDimensions({
        width: window.width,
        height: window.height,
      });
    };

    // Проверяем текущие размеры при монтировании
    const currentWindow = Dimensions.get('window');
    const currentScreen = Dimensions.get('screen');
    console.log('🔍 useResponsive: Current dimensions on mount:', {
      window: currentWindow,
      screen: currentScreen,
    });

    const subscription = Dimensions.addEventListener(
      'change',
      updateDimensions
    );

    return () => {
      console.log('🔍 useResponsive: Cleaning up dimension listener');
      subscription?.remove();
    };
  }, []);

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
  console.log('🔍 useResponsive: Current state:', {
    width,
    height,
    isMobile,
    isTablet,
    currentBreakpoint,
  });

  return {
    isMobile,
    isTablet,
    currentBreakpoint,
    screenWidth: width,
    screenHeight: height,
  };
};

export default useResponsive;
