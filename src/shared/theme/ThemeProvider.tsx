import { ThemeProvider as RNEThemeProvider } from '@rneui/themed';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTheme } from '../../store';
import { CoffeeFlowTheme, createCoffeeFlowTheme } from './themeAdapter';

// Контекст для доступа к теме React Native Elements
interface CoffeeFlowThemeContextType {
  theme: CoffeeFlowTheme;
  isDark: boolean;
  toggleTheme: () => void;
}

const CoffeeFlowThemeContext = createContext<
  CoffeeFlowThemeContextType | undefined
>(undefined);

// Хук для использования темы React Native Elements
export const useCoffeeFlowTheme = (): CoffeeFlowThemeContextType => {
  const context = useContext(CoffeeFlowThemeContext);
  if (!context) {
    throw new Error(
      'useCoffeeFlowTheme must be used within a CoffeeFlowThemeProvider'
    );
  }
  return context;
};

// Провайдер темы, интегрированный с существующей системой
interface CoffeeFlowThemeProviderProps {
  children: React.ReactNode;
}

export const CoffeeFlowThemeProvider: React.FC<
  CoffeeFlowThemeProviderProps
> = ({ children }) => {
  const { isDark } = useTheme();
  const [theme, setTheme] = useState<CoffeeFlowTheme>(() =>
    createCoffeeFlowTheme(isDark)
  );

  // Обновляем тему при изменении режима
  useEffect(() => {
    setTheme(createCoffeeFlowTheme(isDark));
  }, [isDark]);

  const toggleTheme = () => {
    // Тема переключается через существующий useTheme хук
    // Этот метод оставлен для совместимости
  };

  const contextValue: CoffeeFlowThemeContextType = {
    theme,
    isDark,
    toggleTheme,
  };

  return (
    <CoffeeFlowThemeContext.Provider value={contextValue}>
      <RNEThemeProvider theme={theme}>{children}</RNEThemeProvider>
    </CoffeeFlowThemeContext.Provider>
  );
};

export default CoffeeFlowThemeProvider;
