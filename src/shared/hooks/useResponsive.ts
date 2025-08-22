import { useEffect, useState } from 'react';
import { Dimensions } from 'react-native';

export const Breakpoints = {
  // Мобильные устройства (портретная ориентация)
  mobile: {
    min: 320,
    max: 767,
  },
  // Планшеты (портретная и ландшафтная ориентация)
  tablet: {
    min: 768,
    max: 1023,
  },
  // Большие планшеты и маленькие десктопы
  largeTablet: {
    min: 1024,
    max: 1439,
  },
  // Десктопы
  desktop: {
    min: 1440,
    max: Infinity,
  },
} as const;

export type Breakpoint = keyof typeof Breakpoints;

interface UseResponsiveReturn {
  isMobile: boolean;
  isTablet: boolean;
  isLargeTablet: boolean;
  isDesktop: boolean;
  currentBreakpoint: Breakpoint;
  screenWidth: number;
  screenHeight: number;
}

const useResponsive = (): UseResponsiveReturn => {
  const [screenDimensions, setScreenDimensions] = useState({
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenDimensions({
        width: window.width,
        height: window.height,
      });
    });

    return () => subscription?.remove();
  }, []);

  const { width, height } = screenDimensions;

  const isMobile =
    width >= Breakpoints.mobile.min && width <= Breakpoints.mobile.max;
  const isTablet =
    width >= Breakpoints.tablet.min && width <= Breakpoints.tablet.max;
  const isLargeTablet =
    width >= Breakpoints.largeTablet.min &&
    width <= Breakpoints.largeTablet.max;
  const isDesktop = width >= Breakpoints.desktop.min;

  const getCurrentBreakpoint = (): Breakpoint => {
    if (isMobile) return 'mobile';
    if (isTablet) return 'tablet';
    if (isLargeTablet) return 'largeTablet';
    return 'desktop';
  };

  return {
    isMobile,
    isTablet,
    isLargeTablet,
    isDesktop,
    currentBreakpoint: getCurrentBreakpoint(),
    screenWidth: width,
    screenHeight: height,
  };
};

export default useResponsive;
