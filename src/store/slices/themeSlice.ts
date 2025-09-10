import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ColorSchemes } from '../../shared/constants/Colors';

// Тип темы
export type ThemeType = 'light' | 'dark' | 'system';

// Интерфейс состояния theme slice
interface ThemeState {
  theme: ThemeType;
  isDark: boolean;
  colors: typeof ColorSchemes.light | typeof ColorSchemes.dark;
}

// Начальное состояние
const initialState: ThemeState = {
  theme: 'system',
  isDark: false, // Будет обновлено при инициализации
  colors: ColorSchemes.light,
};

// Создание theme slice
const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    // Установка конкретной темы
    setTheme: (state, action: PayloadAction<ThemeType>) => {
      state.theme = action.payload;

      // Обновляем isDark в зависимости от выбранной темы
      switch (action.payload) {
        case 'light':
          state.isDark = false;
          state.colors = ColorSchemes.light;
          break;
        case 'dark':
          state.isDark = true;
          state.colors = ColorSchemes.dark;
          break;
        case 'system':
          // Для system темы isDark будет обновляться извне
          // через updateSystemTheme action
          break;
      }
    },

    // Переключение темы (light -> dark -> system -> light)
    toggleTheme: (state) => {
      switch (state.theme) {
        case 'light':
          state.theme = 'dark';
          state.isDark = true;
          state.colors = ColorSchemes.dark;
          break;
        case 'dark':
          state.theme = 'system';
          // isDark будет обновлено через updateSystemTheme
          break;
        case 'system':
          state.theme = 'light';
          state.isDark = false;
          state.colors = ColorSchemes.light;
          break;
      }
    },

    // Обновление системной темы (вызывается при изменении системной темы)
    updateSystemTheme: (state, action: PayloadAction<boolean>) => {
      if (state.theme === 'system') {
        state.isDark = action.payload;
        state.colors = action.payload ? ColorSchemes.dark : ColorSchemes.light;
      }
    },

    // Принудительное обновление цветов (для случаев, когда нужно пересчитать)
    updateColors: (state) => {
      if (state.theme === 'system') {
        // Для system темы цвета уже должны быть правильными
        return;
      }

      state.colors = state.isDark ? ColorSchemes.dark : ColorSchemes.light;
    },
  },
});

// Экспорт действий
export const { setTheme, toggleTheme, updateSystemTheme, updateColors } =
  themeSlice.actions;

// Экспорт редьюсера
export default themeSlice.reducer;
