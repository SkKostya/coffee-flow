import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
  selectBackgroundColor,
  selectBorderColor,
  selectColors,
  selectDividerColor,
  selectIsDark,
  selectSurfaceColor,
  selectTextColor,
  selectTextSecondaryColor,
  selectTheme,
  selectThemeStatus,
} from '../selectors/themeSelectors';
import {
  setTheme,
  ThemeType,
  toggleTheme,
  updateColors,
  updateSystemTheme,
} from '../slices/themeSlice';

// Хук для работы с темой
export const useTheme = () => {
  const dispatch = useAppDispatch();

  // Селекторы
  const theme = useAppSelector(selectTheme);
  const isDark = useAppSelector(selectIsDark);
  const colors = useAppSelector(selectColors);
  const themeStatus = useAppSelector(selectThemeStatus);
  const backgroundColor = useAppSelector(selectBackgroundColor);
  const surfaceColor = useAppSelector(selectSurfaceColor);
  const textColor = useAppSelector(selectTextColor);
  const textSecondaryColor = useAppSelector(selectTextSecondaryColor);
  const borderColor = useAppSelector(selectBorderColor);
  const dividerColor = useAppSelector(selectDividerColor);

  // Действия
  const setAppTheme = useCallback(
    (newTheme: ThemeType) => {
      dispatch(setTheme(newTheme));
    },
    [dispatch]
  );

  const toggleAppTheme = useCallback(() => {
    dispatch(toggleTheme());
  }, [dispatch]);

  const updateSystemAppTheme = useCallback(
    (systemIsDark: boolean) => {
      dispatch(updateSystemTheme(systemIsDark));
    },
    [dispatch]
  );

  const updateAppColors = useCallback(() => {
    dispatch(updateColors());
  }, [dispatch]);

  return {
    // Состояние
    theme,
    isDark,
    colors,
    themeStatus,
    backgroundColor,
    surfaceColor,
    textColor,
    textSecondaryColor,
    borderColor,
    dividerColor,

    // Действия
    setTheme: setAppTheme,
    toggleTheme: toggleAppTheme,
    updateSystemTheme: updateSystemAppTheme,
    updateColors: updateAppColors,
  };
};
