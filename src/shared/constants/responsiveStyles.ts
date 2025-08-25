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
      h1: 30,
      h2: 26,
      h3: 24,
      body: 16,
      caption: 14,
      small: 12,
    },
  };

  return typography[breakpoint];
};

// Responsive размеры для форм
export const getResponsiveFormSizes = (breakpoint: Breakpoint) => {
  const formSizes = {
    mobile: {
      maxWidth: '100%',
      paddingHorizontal: 16,
      inputHeight: 42,
      buttonHeight: 36,
      borderRadius: 12,
      gap: 16,
    },
    tablet: {
      maxWidth: 400,
      paddingHorizontal: 24,
      inputHeight: 48,
      buttonHeight: 42,
      borderRadius: 16,
      gap: 24,
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
