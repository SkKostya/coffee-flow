import { UseColorsReturn } from '../../types/colors';
import Colors, {
  ColorSchemes,
  getColor,
  getColorWithOpacity,
} from '../constants/Colors';
import { useTheme } from '../contexts/ThemeContext';

export const useColors = (): UseColorsReturn => {
  const { isDark } = useTheme();

  const theme = isDark ? ColorSchemes.dark : ColorSchemes.light;

  return {
    // Theme-aware colors
    ...theme,

    // Direct access to all colors
    colors: Colors,

    // Utility functions
    getColor,
    getColorWithOpacity,

    // Theme-aware color getters
    getThemeColor: (
      palette: 'primary' | 'secondary' | 'success' | 'error' | 'neutral',
      shade: 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900
    ) => {
      return getColor(palette, shade);
    },

    // Common color combinations
    primary: {
      main: Colors.primary[500],
      light: Colors.primary[300],
      dark: Colors.primary[700],
      contrast: Colors.white,
    },

    secondary: {
      main: Colors.secondary[500],
      light: Colors.secondary[300],
      dark: Colors.secondary[700],
      contrast: Colors.white,
    },

    success: {
      main: Colors.success[500],
      light: Colors.success[300],
      dark: Colors.success[700],
      contrast: Colors.white,
    },

    error: {
      main: Colors.error[500],
      light: Colors.error[300],
      dark: Colors.error[700],
      contrast: Colors.white,
    },

    // Status colors
    status: {
      info: Colors.secondary[500],
      warning: Colors.primary[500],
      success: Colors.success[500],
      error: Colors.error[500],
    },

    // Background variations
    backgrounds: {
      primary: theme.background,
      secondary: isDark ? Colors.neutral[800] : Colors.neutral[50],
      tertiary: isDark ? Colors.neutral[700] : Colors.neutral[100],
      elevated: isDark ? Colors.neutral[700] : Colors.white,
      card: isDark ? Colors.neutral[800] : Colors.white,
      input: isDark ? Colors.neutral[700] : Colors.neutral[50],
      neutral: isDark ? Colors.neutral[600] : theme.background,
    },

    // Text variations
    texts: {
      primary: theme.text,
      secondary: theme.textSecondary,
      disabled: isDark ? Colors.neutral[500] : Colors.neutral[500],
      inverse: isDark ? Colors.neutral[900] : Colors.neutral[50],
    },

    // Border variations
    borders: {
      primary: theme.border,
      secondary: isDark ? Colors.neutral[600] : Colors.neutral[400],
      focus: Colors.primary[500],
      error: Colors.error[500],
      subtle: isDark ? Colors.neutral[600] : Colors.neutral[300],
      strong: isDark ? Colors.neutral[500] : Colors.neutral[500],
    },

    // Shadow colors
    shadows: {
      light: isDark ? Colors.neutralMask[75] : Colors.neutralMask[50],
      medium: isDark ? Colors.neutralMask[75] : Colors.neutral[500],
      heavy: isDark ? Colors.black : Colors.neutral[700],
    },
  };
};

export default useColors;
