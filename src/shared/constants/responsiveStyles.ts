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
  };

  return logoSize[breakpoint];
};
