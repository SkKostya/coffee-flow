import { type Breakpoint } from '../hooks/useResponsive';

// Responsive spacing для разных breakpoints
export const getResponsiveSpacing = (breakpoint: Breakpoint) => {
  const spacing = {
    mobile: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 20,
      xl: 24,
      xxl: 32,
    },
    tablet: {
      xs: 6,
      sm: 12,
      md: 24,
      lg: 32,
      xl: 40,
      xxl: 48,
    },
    largeTablet: {
      xs: 8,
      sm: 16,
      md: 32,
      lg: 40,
      xl: 48,
      xxl: 56,
    },
    desktop: {
      xs: 10,
      sm: 20,
      md: 40,
      lg: 48,
      xl: 56,
      xxl: 64,
    },
  };

  return spacing[breakpoint];
};

// Responsive typography для разных breakpoints
export const getResponsiveTypography = (breakpoint: Breakpoint) => {
  const typography = {
    mobile: {
      h1: 24,
      h2: 20,
      h3: 18,
      body: 16,
      caption: 14,
      small: 12,
    },
    tablet: {
      h1: 32,
      h2: 28,
      h3: 24,
      body: 18,
      caption: 16,
      small: 14,
    },
    largeTablet: {
      h1: 36,
      h2: 32,
      h3: 28,
      body: 20,
      caption: 18,
      small: 16,
    },
    desktop: {
      h1: 40,
      h2: 36,
      h3: 32,
      body: 22,
      caption: 20,
      small: 18,
    },
  };

  return typography[breakpoint];
};

// Responsive размеры для форм
export const getResponsiveFormSizes = (breakpoint: Breakpoint) => {
  const formSizes = {
    mobile: {
      maxWidth: '100%',
      paddingHorizontal: 24,
      inputHeight: 56,
      buttonHeight: 56,
      borderRadius: 12,
      gap: 24,
    },
    tablet: {
      maxWidth: 400,
      paddingHorizontal: 32,
      inputHeight: 60,
      buttonHeight: 60,
      borderRadius: 16,
      gap: 32,
    },
    largeTablet: {
      maxWidth: 450,
      paddingHorizontal: 40,
      inputHeight: 64,
      buttonHeight: 64,
      borderRadius: 18,
      gap: 36,
    },
    desktop: {
      maxWidth: 500,
      paddingHorizontal: 48,
      inputHeight: 68,
      buttonHeight: 68,
      borderRadius: 20,
      gap: 40,
    },
  };

  return formSizes[breakpoint];
};

// Responsive размеры для логотипа
export const getResponsiveLogoSize = (breakpoint: Breakpoint) => {
  const logoSize = {
    mobile: {
      width: 120,
      height: 120,
    },
    tablet: {
      width: 160,
      height: 160,
    },
    largeTablet: {
      width: 200,
      height: 200,
    },
    desktop: {
      width: 240,
      height: 240,
    },
  };

  return logoSize[breakpoint];
};
