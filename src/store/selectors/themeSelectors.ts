import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../index';

// Базовые селекторы
const selectThemeState = (state: RootState) => state.theme;

// Селекторы для theme
export const selectTheme = createSelector(
  [selectThemeState],
  (theme) => theme.theme
);

export const selectIsDark = createSelector(
  [selectThemeState],
  (theme) => theme.isDark
);

export const selectColors = createSelector(
  [selectThemeState],
  (theme) => theme.colors
);

// Комбинированные селекторы
export const selectThemeStatus = createSelector(
  [selectTheme, selectIsDark, selectColors],
  (theme, isDark, colors) => ({
    theme,
    isDark,
    colors,
  })
);

// Селекторы для конкретных цветов
export const selectBackgroundColor = createSelector(
  [selectColors],
  (colors) => colors.background
);

export const selectSurfaceColor = createSelector(
  [selectColors],
  (colors) => colors.surface
);

export const selectTextColor = createSelector(
  [selectColors],
  (colors) => colors.text
);

export const selectTextSecondaryColor = createSelector(
  [selectColors],
  (colors) => colors.textSecondary
);

export const selectBorderColor = createSelector(
  [selectColors],
  (colors) => colors.border
);

export const selectDividerColor = createSelector(
  [selectColors],
  (colors) => colors.divider
);
