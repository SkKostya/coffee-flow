// Color palette for Coffee Flow app
// Based on the comprehensive color system

export const Colors = {
  // Primary Colors (Orange/Brown tones)
  primary: {
    50: '#FDF9F5',
    100: '#F7E3CE',
    200: '#F2CEAB',
    300: '#ECB886',
    400: '#E6A361',
    500: '#E08D3C',
    600: '#B37130',
    700: '#865524',
    800: '#5A3818',
    900: '#2D1C0C',
  },

  // Secondary Colors (Blue tones)
  secondary: {
    50: '#F5F9FE',
    100: '#CFE3F8',
    200: '#ACCFF2',
    300: '#87BAEC',
    400: '#62A4E7',
    500: '#3D8FE1',
    600: '#3172B4',
    700: '#255687',
    800: '#18395A',
    900: '#0C1D2D',
  },

  // Success Colors (Green tones)
  success: {
    50: '#F5FEF7',
    100: '#CFF8D5',
    200: '#ACF2B7',
    300: '#87EC97',
    400: '#62E778',
    500: '#3DE158',
    600: '#318446',
    700: '#258735',
    800: '#185A23',
    900: '#0C2D12',
  },

  // Error Colors (Red tones)
  error: {
    50: '#FEF6F5',
    100: '#F8D3CF',
    200: '#F2B2AC',
    300: '#EC9187',
    400: '#E76F62',
    500: '#E14D3D',
    600: '#B43E31',
    700: '#872E25',
    800: '#5A1F18',
    900: '#2D0F0C',
  },

  // Neutral Colors (Grayscale tones)
  neutral: {
    50: '#F7F7F7',
    100: '#D6D6D6',
    200: '#B5B5B5',
    300: '#949494',
    400: '#737373',
    500: '#525252',
    600: '#363636',
    700: '#1F1F1F',
    800: '#1A1A1A',
    900: '#0D0D0D',
  },

  // Additional utility colors
  neutralMask: {
    50: 'rgba(15, 15, 15, 0.5)', // 50% opacity
    75: 'rgba(15, 15, 15, 0.75)', // 75% opacity
  },

  // Background color
  background: '#242424',

  // Semantic color aliases for easy access
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;

// Type definitions for better TypeScript support
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

// Utility function to get color with shade
export const getColor = (palette: ColorPalette, shade: ColorShade): string => {
  return Colors[palette][shade];
};

// Utility function to get color with opacity
export const getColorWithOpacity = (color: string, opacity: number): string => {
  // Convert hex to rgba
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// Common color combinations for UI components
export const ColorSchemes = {
  light: {
    background: Colors.white,
    surface: Colors.neutral[50],
    text: Colors.neutral[900],
    textSecondary: Colors.neutral[600],
    border: Colors.neutral[300],
    divider: Colors.neutral[200],
  },
  dark: {
    background: Colors.background,
    surface: Colors.neutral[800],
    text: Colors.neutral[50],
    textSecondary: Colors.neutral[300],
    border: Colors.neutral[700],
    divider: Colors.neutral[600],
  },
} as const;

export default Colors;
