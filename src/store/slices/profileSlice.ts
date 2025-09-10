import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { router } from 'expo-router';
import { profileApi } from '../../profile/services/profileApi';
import {
  ChangePasswordRequest,
  DeleteAccountRequest,
  UpdateProfileRequest,
  UserProfile,
} from '../../profile/types/api';
import { logout } from './authSlice';

// Интерфейс состояния profile slice
interface ProfileState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
}

// Начальное состояние
const initialState: ProfileState = {
  profile: null,
  isLoading: false,
  error: null,
};

// Async thunk для загрузки профиля
export const loadProfile = createAsyncThunk(
  'profile/loadProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await profileApi.getProfile();

      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.error || 'Ошибка загрузки профиля');
      }
    } catch (error) {
      console.error('Ошибка загрузки профиля:', error);
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка загрузки профиля'
      );
    }
  }
);

// Async thunk для обновления профиля
export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (data: UpdateProfileRequest, { rejectWithValue }) => {
    try {
      const response = await profileApi.updateProfile(data);

      if (response.success && response.data) {
        return response.data;
      } else {
        throw new Error(response.error || 'Ошибка обновления профиля');
      }
    } catch (error) {
      console.error('Ошибка обновления профиля:', error);
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка обновления профиля'
      );
    }
  }
);

// Async thunk для изменения пароля
export const changePassword = createAsyncThunk(
  'profile/changePassword',
  async (data: ChangePasswordRequest, { rejectWithValue }) => {
    try {
      const response = await profileApi.changePassword(data);

      if (response.success) {
        return { message: response.message || 'Пароль успешно изменен' };
      } else {
        throw new Error(response.error || 'Ошибка изменения пароля');
      }
    } catch (error) {
      console.error('Ошибка изменения пароля:', error);
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка изменения пароля'
      );
    }
  }
);

// Async thunk для удаления аккаунта
export const deleteAccount = createAsyncThunk(
  'profile/deleteAccount',
  async (data: DeleteAccountRequest, { rejectWithValue, dispatch }) => {
    try {
      const response = await profileApi.deleteAccount(data);

      if (response.success) {
        // Очищаем профиль и выходим из системы
        dispatch(clearProfile());
        dispatch(logout());
        router.navigate('/auth/login');
        return { message: response.message || 'Аккаунт успешно удален' };
      } else {
        throw new Error(response.error || 'Ошибка удаления аккаунта');
      }
    } catch (error) {
      console.error('Ошибка удаления аккаунта:', error);
      return rejectWithValue(
        error instanceof Error ? error.message : 'Ошибка удаления аккаунта'
      );
    }
  }
);

// Создание profile slice
const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    // Синхронные действия
    clearError: (state) => {
      state.error = null;
    },
    clearProfile: (state) => {
      state.profile = null;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // loadProfile
      .addCase(loadProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(loadProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // updateProfile
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // changePassword
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // deleteAccount
      .addCase(deleteAccount.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteAccount.fulfilled, (state) => {
        state.isLoading = false;
        state.profile = null;
        state.error = null;
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Экспорт действий
export const { clearError, clearProfile, setLoading } = profileSlice.actions;

// Экспорт редьюсера
export default profileSlice.reducer;
