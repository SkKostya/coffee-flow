import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthResponse, User } from '../../types/auth';

// Константы для ключей AsyncStorage
export const TOKEN_KEY = '@coffee_flow_token';
export const USER_KEY = '@coffee_flow_user';

// Интерфейс состояния auth slice
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Начальное состояние
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true, // Начинаем с true для загрузки данных при инициализации
  error: null,
};

// Async thunk для загрузки данных пользователя при инициализации
export const loadUserData = createAsyncThunk(
  'auth/loadUserData',
  async (_, { rejectWithValue }) => {
    try {
      const [token, userData] = await Promise.all([
        AsyncStorage.getItem(TOKEN_KEY),
        AsyncStorage.getItem(USER_KEY),
      ]);

      if (token && userData) {
        const parsedUser = JSON.parse(userData);
        return parsedUser;
      }

      return null;
    } catch (error) {
      console.error('Ошибка загрузки данных пользователя:', error);
      return rejectWithValue('Ошибка загрузки данных пользователя');
    }
  }
);

// Async thunk для входа
export const login = createAsyncThunk(
  'auth/login',
  async (response: AuthResponse, { rejectWithValue }) => {
    try {
      if (response.accessToken && response.client) {
        // Сохраняем токен и данные пользователя
        await Promise.all([
          AsyncStorage.setItem(TOKEN_KEY, response.accessToken),
          AsyncStorage.setItem(USER_KEY, JSON.stringify(response.client)),
        ]);

        return response.client;
      } else {
        throw new Error(response.message || 'Ошибка авторизации');
      }
    } catch (error) {
      console.error('Ошибка входа:', error);
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка входа'
      );
    }
  }
);

// Async thunk для выхода
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      // Удаляем токен и данные пользователя
      await Promise.all([
        AsyncStorage.removeItem(TOKEN_KEY),
        AsyncStorage.removeItem(USER_KEY),
      ]);

      return null;
    } catch (error) {
      console.error('Ошибка выхода:', error);
      return rejectWithValue('Ошибка выхода');
    }
  }
);

// Async thunk для обновления данных пользователя
export const updateUser = createAsyncThunk(
  'auth/updateUser',
  async (updatedUser: User, { rejectWithValue }) => {
    try {
      // Обновляем данные в AsyncStorage
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error) {
      console.error('Ошибка сохранения данных пользователя:', error);
      return rejectWithValue('Ошибка сохранения данных пользователя');
    }
  }
);

// Создание auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Синхронные действия
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // loadUserData
      .addCase(loadUserData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadUserData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
        state.error = null;
      })
      .addCase(loadUserData.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      })
      // login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      })
      // logout
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // updateUser
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Экспорт действий
export const { clearError, setLoading } = authSlice.actions;

// Экспорт редьюсера
export default authSlice.reducer;
