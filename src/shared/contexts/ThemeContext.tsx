import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useColorScheme } from 'react-native';
import { ColorSchemes } from '../constants/Colors';

export type ThemeType = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: ThemeType;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: ThemeType) => void;
  colors: typeof ColorSchemes.light | typeof ColorSchemes.dark;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<ThemeType>('system');

  // Определяем, должна ли быть темная тема
  const isDark = (() => {
    switch (theme) {
      case 'light':
        return false;
      case 'dark':
        return true;
      case 'system':
      default:
        return systemColorScheme === 'dark' || systemColorScheme === null;
    }
  })();

  // Получаем цвета для текущей темы
  const colors = isDark ? ColorSchemes.dark : ColorSchemes.light;

  // Переключаем тему
  const toggleTheme = () => {
    setThemeState((current) => {
      if (current === 'system') return 'dark';
      if (current === 'dark') return 'light';
      return 'system';
    });
  };

  // Устанавливаем конкретную тему
  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
  };

  // Сохраняем выбранную тему в AsyncStorage (можно добавить позже)
  useEffect(() => {
    // Здесь можно добавить сохранение темы в AsyncStorage
    console.log('Theme changed to:', theme);
  }, [theme]);

  const value: ThemeContextType = {
    theme,
    isDark,
    toggleTheme,
    setTheme,
    colors,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeProvider;
