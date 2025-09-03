// Type definitions for the color system

export type ColorShade =
  | 50
  | 100
  | 200
  | 300
  | 400
  | 500
  | 600
  | 700
  | 800
  | 900;
export type ColorPalette =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'error'
  | 'neutral';

export interface ColorPaletteColors {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
}

export interface ColorScheme {
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  divider: string;
}

export interface ColorVariants {
  main: string;
  light: string;
  dark: string;
  contrast: string;
}

export interface StatusColors {
  info: string;
  warning: string;
  success: string;
  error: string;
}

export interface BackgroundVariants {
  primary: string;
  secondary: string;
  tertiary: string;
  elevated: string;
  card: string;
  input: string;
  neutral: string;
}

export interface TextVariants {
  primary: string;
  secondary: string;
  disabled: string;
  inverse: string;
}

export interface BorderVariants {
  primary: string;
  secondary: string;
  focus: string;
  error: string;
  subtle: string;
  strong: string;
}

export interface ShadowColors {
  light: string;
  medium: string;
  heavy: string;
}

export interface Colors {
  primary: ColorPaletteColors;
  secondary: ColorPaletteColors;
  success: ColorPaletteColors;
  error: ColorPaletteColors;
  neutral: ColorPaletteColors;
  neutralMask: {
    50: string;
    75: string;
  };
  background: string;
  white: string;
  black: string;
  transparent: string;
}

export interface UseColorsReturn {
  // Theme-aware colors
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  divider: string;

  // Direct access to all colors
  colors: Colors;

  // Utility functions
  getColor: (palette: ColorPalette, shade: ColorShade) => string;
  getColorWithOpacity: (color: string, opacity: number) => string;

  // Theme-aware color getters
  getThemeColor: (palette: ColorPalette, shade: ColorShade) => string;

  // Common color combinations
  primary: ColorVariants;
  secondary: ColorVariants;
  success: ColorVariants;
  error: ColorVariants;

  // Status colors
  status: StatusColors;

  // Background variations
  backgrounds: BackgroundVariants;

  // Text variations
  texts: TextVariants;

  // Border variations
  borders: BorderVariants;

  // Shadow colors
  shadows: ShadowColors;
}
