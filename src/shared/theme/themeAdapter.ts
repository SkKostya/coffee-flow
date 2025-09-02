import { createTheme } from '@rneui/themed';
import Colors, { ColorSchemes } from '../constants/Colors';

// Адаптер для интеграции палитры Colors.ts с React Native Elements
export const createCoffeeFlowTheme = (isDark: boolean = true) => {
  const colorScheme = isDark ? ColorSchemes.dark : ColorSchemes.light;

  return createTheme({
    lightColors: {
      // Основные цвета
      primary: Colors.primary[500],
      secondary: Colors.secondary[500],
      success: Colors.success[500],
      error: Colors.error[500],
      warning: Colors.primary[500], // Используем primary для warning

      // Фоновые цвета
      background: colorScheme.background,

      // Дополнительные цвета для компонентов
      disabled: Colors.neutral[400],
    },
    darkColors: {
      // Основные цвета (темная тема)
      primary: Colors.primary[400], // Немного светлее для темной темы
      secondary: Colors.secondary[400],
      success: Colors.success[400],
      error: Colors.error[400],
      warning: Colors.primary[400],

      // Фоновые цвета
      background: colorScheme.background,

      // Дополнительные цвета для компонентов
      disabled: Colors.neutral[600],
    },
    mode: isDark ? 'dark' : 'light',
    // Добавляем стили для компонентов
    components: {
      Button: {
        raised: true,
        radius: 8,
        titleStyle: {
          fontWeight: '600',
        },
      },
      Input: {
        containerStyle: {
          paddingHorizontal: 0,
        },
        inputContainerStyle: {
          position: 'relative',
          borderWidth: 1,
          borderRadius: 8,
          paddingHorizontal: 0,
          minHeight: 48,
        },
        inputStyle: {
          paddingHorizontal: 12,
        },
        rightIconContainerStyle: {
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: 42,
          justifyContent: 'center',
          alignItems: 'center',
        },
        labelStyle: {
          fontWeight: '500',
          marginBottom: 4,
        },
        errorStyle: {
          marginTop: 4,
          marginLeft: 4,
        },
      },
      Card: {
        containerStyle: {
          borderRadius: 12,
          margin: 8,
        },
      },
    },
  });
};

// Утилитарные функции для работы с темой
export const getThemeColor = (theme: any, colorKey: string): string => {
  return theme?.colors?.[colorKey] || Colors.neutral[500];
};

export const getComponentTheme = (theme: any, componentName: string) => {
  return theme?.components?.[componentName] || {};
};

// Экспорт типов для использования в других частях приложения
export type CoffeeFlowTheme = ReturnType<typeof createCoffeeFlowTheme>;
export type ThemeColorKey = string;
